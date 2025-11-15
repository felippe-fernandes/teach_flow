"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getUser } from "./auth";

type StudentFilters = {
  status?: string;
  contractorId?: string;
  search?: string;
};

export async function getStudents(filters?: StudentFilters) {
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = {
    user_id: user.id,
  };

  if (filters?.status) {
    where.status = filters.status;
  }

  if (filters?.contractorId) {
    where.contractor_id = filters.contractorId;
  }

  if (filters?.search) {
    where.OR = [
      { name: { contains: filters.search, mode: "insensitive" } },
      { email: { contains: filters.search, mode: "insensitive" } },
    ];
  }

  const students = await prisma.student.findMany({
    where,
    select: {
      id: true,
      user_id: true,
      name: true,
      email: true,
      phone_number: true,
      native_language: true,
      proficiency_level: true,
      contractor_id: true, // Explicitly select contractor_id
      status: true,
      learning_goals: true,
      notes: true,
      package_details: true,
      created_at: true,
      updated_at: true,
      contractor: {
        select: {
          id: true,
          name: true,
        },
      },
      _count: {
        select: {
          classes: true,
          payments: true,
        },
      },
    },
    orderBy: {
      created_at: "desc",
    },
  });

  return students;
}

export async function getStudent(id: string) {
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }

  const student = await prisma.student.findFirst({
    where: {
      id,
      user_id: user.id,
    },
    include: {
      contractor: true,
      classes: {
        orderBy: {
          start_time: "desc",
        },
        take: 10,
      },
      payments: {
        orderBy: {
          created_at: "desc",
        },
        take: 10,
      },
      _count: {
        select: {
          classes: true,
          payments: true,
        },
      },
    },
  });

  if (!student) {
    return null;
  }

  // Convert Decimal fields to numbers for serialization
  return {
    ...student,
    contractor: student.contractor ? {
      ...student.contractor,
      default_hourly_rate: student.contractor.default_hourly_rate.toNumber(),
      cancellation_penalty_rate: student.contractor.cancellation_penalty_rate.toNumber(),
    } : null,
  };
}

export async function createStudent(formData: FormData) {
  const user = await getUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const phoneNumber = formData.get("phone_number") as string;
  const nativeLanguage = formData.get("native_language") as string;
  const proficiencyLevel = formData.get("proficiency_level") as string;
  const contractorIdRaw = formData.get("contractor_id") as string;
  const contractorId = contractorIdRaw === "__particular__" ? null : contractorIdRaw;
  const status = formData.get("status") as string;
  const learningGoals = formData.get("learning_goals") as string;
  const notes = formData.get("notes") as string;

  // Package details
  const hasPackage = formData.get("has_package") === "true";
  let packageDetails: object | null = null;

  if (hasPackage) {
    packageDetails = {
      total_classes: parseInt(formData.get("package_total_classes") as string),
      remaining_classes: parseInt(formData.get("package_total_classes") as string),
      value_per_package: parseFloat(formData.get("package_value") as string),
      expires_at: formData.get("package_expires_at") as string,
      currency: formData.get("package_currency") as string,
      classes_per_week: parseInt(formData.get("package_classes_per_week") as string) || null,
    };
  }

  try {
    const student = await prisma.student.create({
      data: {
        user_id: user.id,
        name,
        email: email || null,
        phone_number: phoneNumber || null,
        native_language: nativeLanguage || null,
        proficiency_level: proficiencyLevel || null,
        contractor_id: contractorId,
        status: status || "active",
        learning_goals: learningGoals || null,
        notes: notes || null,
        package_details: packageDetails as never,
      },
    });

    revalidatePath("/dashboard/students");
    return { success: true, student };
  } catch (error) {
    console.error("Error creating student:", error);
    return { error: "Failed to create student" };
  }
}

export async function updateStudent(id: string, formData: FormData) {
  const user = await getUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const phoneNumber = formData.get("phone_number") as string;
  const nativeLanguage = formData.get("native_language") as string;
  const proficiencyLevel = formData.get("proficiency_level") as string;
  const contractorIdRaw = formData.get("contractor_id") as string;
  const contractorId = contractorIdRaw === "__particular__" ? null : contractorIdRaw;
  const status = formData.get("status") as string;
  const learningGoals = formData.get("learning_goals") as string;
  const notes = formData.get("notes") as string;

  // Package details
  const hasPackage = formData.get("has_package") === "true";
  let packageDetails = null;

  if (hasPackage) {
    packageDetails = {
      total_classes: parseInt(formData.get("package_total_classes") as string),
      remaining_classes: parseInt(formData.get("package_remaining_classes") as string),
      value_per_package: parseFloat(formData.get("package_value") as string),
      expires_at: formData.get("package_expires_at") as string,
      currency: formData.get("package_currency") as string,
      classes_per_week: parseInt(formData.get("package_classes_per_week") as string) || null,
    };
  }

  try {
    const student = await prisma.student.update({
      where: {
        id,
        user_id: user.id,
      },
      data: {
        name,
        email: email || null,
        phone_number: phoneNumber || null,
        native_language: nativeLanguage || null,
        proficiency_level: proficiencyLevel || null,
        contractor_id: contractorId,
        status: status || "active",
        learning_goals: learningGoals || null,
        notes: notes || null,
        package_details: packageDetails as never,
      },
    });

    revalidatePath("/dashboard/students");
    revalidatePath(`/dashboard/students/${id}`);
    return { success: true, student };
  } catch (error) {
    console.error("Error updating student:", error);
    return { error: "Failed to update student" };
  }
}

export async function deleteStudent(id: string) {
  const user = await getUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  try {
    await prisma.student.delete({
      where: {
        id,
        user_id: user.id,
      },
    });

    revalidatePath("/dashboard/students");
    return { success: true };
  } catch (error) {
    console.error("Error deleting student:", error);
    return { error: "Failed to delete student. Make sure the student has no associated data." };
  }
}
