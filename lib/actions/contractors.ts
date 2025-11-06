"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getUser } from "./auth";

export async function getContractors() {
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }

  const contractors = await prisma.contractor.findMany({
    where: {
      user_id: user.id,
    },
    orderBy: {
      created_at: "desc",
    },
  });

  return contractors;
}

export async function getContractor(id: string) {
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }

  const contractor = await prisma.contractor.findFirst({
    where: {
      id,
      user_id: user.id,
    },
    include: {
      _count: {
        select: {
          students: true,
          classes: true,
          payments: true,
        },
      },
    },
  });

  if (!contractor) {
    return null;
  }

  return contractor;
}

export async function createContractor(formData: FormData) {
  const user = await getUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  const name = formData.get("name") as string;
  const defaultHourlyRate = parseFloat(formData.get("default_hourly_rate") as string);
  const currency = formData.get("currency") as string;
  const paymentFrequency = formData.get("payment_frequency") as string;
  const paymentTermsDays = parseInt(formData.get("payment_terms_days") as string);
  const minCancellationNoticeHours = parseInt(formData.get("min_cancellation_notice_hours") as string);
  const cancellationPenaltyRate = parseFloat(formData.get("cancellation_penalty_rate") as string);
  const notes = formData.get("notes") as string;

  const contactInfo = {
    email: formData.get("contact_email") as string,
    phone: formData.get("contact_phone") as string,
    website: formData.get("contact_website") as string,
    contact_person: formData.get("contact_person") as string,
  };

  try {
    const contractor = await prisma.contractor.create({
      data: {
        user_id: user.id,
        name,
        contact_info: contactInfo,
        default_hourly_rate: defaultHourlyRate,
        currency,
        payment_frequency: paymentFrequency,
        payment_terms_days: paymentTermsDays,
        min_cancellation_notice_hours: minCancellationNoticeHours,
        cancellation_penalty_rate: cancellationPenaltyRate,
        notes,
      },
    });

    revalidatePath("/dashboard/contractors");
    return { success: true, contractor };
  } catch (error) {
    console.error("Error creating contractor:", error);
    return { error: "Failed to create contractor" };
  }
}

export async function updateContractor(id: string, formData: FormData) {
  const user = await getUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  const name = formData.get("name") as string;
  const defaultHourlyRate = parseFloat(formData.get("default_hourly_rate") as string);
  const currency = formData.get("currency") as string;
  const paymentFrequency = formData.get("payment_frequency") as string;
  const paymentTermsDays = parseInt(formData.get("payment_terms_days") as string);
  const minCancellationNoticeHours = parseInt(formData.get("min_cancellation_notice_hours") as string);
  const cancellationPenaltyRate = parseFloat(formData.get("cancellation_penalty_rate") as string);
  const notes = formData.get("notes") as string;

  const contactInfo = {
    email: formData.get("contact_email") as string,
    phone: formData.get("contact_phone") as string,
    website: formData.get("contact_website") as string,
    contact_person: formData.get("contact_person") as string,
  };

  try {
    const contractor = await prisma.contractor.update({
      where: {
        id,
        user_id: user.id,
      },
      data: {
        name,
        contact_info: contactInfo,
        default_hourly_rate: defaultHourlyRate,
        currency,
        payment_frequency: paymentFrequency,
        payment_terms_days: paymentTermsDays,
        min_cancellation_notice_hours: minCancellationNoticeHours,
        cancellation_penalty_rate: cancellationPenaltyRate,
        notes,
      },
    });

    revalidatePath("/dashboard/contractors");
    revalidatePath(`/dashboard/contractors/${id}`);
    return { success: true, contractor };
  } catch (error) {
    console.error("Error updating contractor:", error);
    return { error: "Failed to update contractor" };
  }
}

export async function deleteContractor(id: string) {
  const user = await getUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  try {
    await prisma.contractor.delete({
      where: {
        id,
        user_id: user.id,
      },
    });

    revalidatePath("/dashboard/contractors");
    return { success: true };
  } catch (error) {
    console.error("Error deleting contractor:", error);
    return { error: "Failed to delete contractor. Make sure it has no associated data." };
  }
}
