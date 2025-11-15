"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getUser } from "./auth";

type ClassFilters = { startDate?: Date; endDate?: Date; studentId?: string; contractorId?: string; status?: string };

export async function getClasses(filters?: ClassFilters) {
  const user = await getUser();
  if (!user) redirect("/login");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = { user_id: user.id };

  if (filters?.studentId) where.student_id = filters.studentId;
  if (filters?.contractorId) where.contractor_id = filters.contractorId;
  if (filters?.status) where.status = filters.status;
  if (filters?.startDate || filters?.endDate) {
    where.start_time = {};
    if (filters.startDate) where.start_time.gte = filters.startDate;
    if (filters.endDate) where.start_time.lte = filters.endDate;
  }

  const classes = await prisma.class.findMany({
    where,
    include: { student: true, contractor: true },
    orderBy: { start_time: "asc" },
  });

  // Convert Decimal fields to numbers for serialization
  return classes.map((classRecord) => ({
    ...classRecord,
    custom_rate: classRecord.custom_rate?.toNumber() ?? null,
    contractor: {
      ...classRecord.contractor,
      default_hourly_rate: classRecord.contractor.default_hourly_rate.toNumber(),
      cancellation_penalty_rate: classRecord.contractor.cancellation_penalty_rate.toNumber(),
    },
  }));
}

export async function getClass(id: string) {
  const user = await getUser();
  if (!user) redirect("/login");

  const classRecord = await prisma.class.findFirst({
    where: { id, user_id: user.id },
    include: { student: true, contractor: true },
  });

  if (!classRecord) return null;

  // Convert Decimal fields to numbers for serialization
  return {
    ...classRecord,
    custom_rate: classRecord.custom_rate?.toNumber() ?? null,
    contractor: {
      ...classRecord.contractor,
      default_hourly_rate: classRecord.contractor.default_hourly_rate.toNumber(),
      cancellation_penalty_rate: classRecord.contractor.cancellation_penalty_rate.toNumber(),
    },
  };
}

export async function createClass(formData: FormData) {
  const user = await getUser();
  if (!user) return { error: "Unauthorized" };

  const studentId = formData.get("student_id") as string;
  const contractorId = formData.get("contractor_id") as string;

  // SECURITY: Verify student and contractor belong to user
  const [student, contractor] = await Promise.all([
    prisma.student.findFirst({ where: { id: studentId, user_id: user.id } }),
    prisma.contractor.findFirst({ where: { id: contractorId, user_id: user.id } }),
  ]);

  if (!student || !contractor) {
    return { error: "Student or Contractor not found" };
  }

  const startTime = new Date(formData.get("start_time") as string);
  const durationMinutes = parseInt(formData.get("duration_minutes") as string);
  const endTime = new Date(startTime.getTime() + durationMinutes * 60000);

  try {
    const classRecord = await prisma.class.create({
      data: {
        user_id: user.id,
        student_id: studentId,
        contractor_id: contractorId,
        start_time: startTime,
        end_time: endTime,
        duration_minutes: durationMinutes,
        status: "scheduled",
        location_type: formData.get("location_type") as string || "online",
        virtual_meeting_link: formData.get("virtual_meeting_link") as string || null,
        class_notes: formData.get("class_notes") as string || null,
      },
    });

    revalidatePath("/dashboard/classes");
    return { success: true, class: classRecord };
  } catch (error) {
    console.error("Error creating class:", error);
    return { error: "Failed to create class" };
  }
}

export async function updateClass(id: string, formData: FormData) {
  const user = await getUser();
  if (!user) return { error: "Unauthorized" };

  const status = formData.get("status") as string;
  const classNotes = formData.get("class_notes") as string;

  try {
    const classRecord = await prisma.class.update({
      where: { id, user_id: user.id },
      data: { status, class_notes: classNotes },
    });

    // Auto-create payment if completed
    if (status === "completed") {
      // SECURITY: Only get contractor if it belongs to user
      const contractor = await prisma.contractor.findFirst({
        where: { id: classRecord.contractor_id, user_id: user.id },
      });

      if (contractor) {
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + contractor.payment_terms_days);

        await prisma.payment.create({
          data: {
            user_id: user.id,
            class_id: classRecord.id,
            student_id: classRecord.student_id,
            contractor_id: classRecord.contractor_id,
            amount: contractor.default_hourly_rate,
            currency: contractor.currency,
            status: "pending",
            due_date: dueDate,
          },
        });
      }
    }

    revalidatePath("/dashboard/classes");
    revalidatePath(`/dashboard/classes/${id}`);
    return { success: true, class: classRecord };
  } catch (error) {
    console.error("Error updating class:", error);
    return { error: "Failed to update class" };
  }
}

export async function deleteClass(id: string) {
  const user = await getUser();
  if (!user) return { error: "Unauthorized" };

  try {
    await prisma.class.delete({ where: { id, user_id: user.id } });
    revalidatePath("/dashboard/classes");
    return { success: true };
  } catch (error) {
    console.error("Error deleting class:", error);
    return { error: "Failed to delete class" };
  }
}
