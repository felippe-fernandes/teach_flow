"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getUser } from "./auth";

type PaymentFilters = { status?: string; contractorId?: string; startDate?: Date; endDate?: Date };

export async function getPayments(filters?: PaymentFilters) {
  const user = await getUser();
  if (!user) redirect("/login");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = { user_id: user.id };

  if (filters?.status) where.status = filters.status;
  if (filters?.contractorId) where.contractor_id = filters.contractorId;
  if (filters?.startDate || filters?.endDate) {
    where.due_date = {};
    if (filters.startDate) where.due_date.gte = filters.startDate;
    if (filters.endDate) where.due_date.lte = filters.endDate;
  }

  const payments = await prisma.payment.findMany({
    where,
    include: { contractor: true, student: true, class: true },
    orderBy: { due_date: "desc" },
  });

  // Convert Decimal fields to numbers for serialization
  return payments.map((payment) => ({
    ...payment,
    amount: payment.amount.toNumber(),
    contractor: {
      ...payment.contractor,
      default_hourly_rate: payment.contractor.default_hourly_rate.toNumber(),
      cancellation_penalty_rate: payment.contractor.cancellation_penalty_rate.toNumber(),
    },
    class: payment.class ? {
      ...payment.class,
      custom_rate: payment.class.custom_rate?.toNumber() ?? null,
    } : null,
  }));
}

export async function getPayment(id: string) {
  const user = await getUser();
  if (!user) redirect("/login");

  const payment = await prisma.payment.findFirst({
    where: { id, user_id: user.id },
    include: { contractor: true, student: true, class: true },
  });

  if (!payment) return null;

  // Convert Decimal fields to numbers for serialization
  return {
    ...payment,
    amount: payment.amount.toNumber(),
    contractor: {
      ...payment.contractor,
      default_hourly_rate: payment.contractor.default_hourly_rate.toNumber(),
      cancellation_penalty_rate: payment.contractor.cancellation_penalty_rate.toNumber(),
    },
    class: payment.class ? {
      ...payment.class,
      custom_rate: payment.class.custom_rate?.toNumber() ?? null,
    } : null,
  };
}

export async function updatePaymentStatus(id: string, status: string, receivedDate?: Date) {
  const user = await getUser();
  if (!user) return { error: "Unauthorized" };

  try {
    const payment = await prisma.payment.update({
      where: { id, user_id: user.id },
      data: {
        status,
        received_date: receivedDate || (status === "received" ? new Date() : null),
      },
    });

    revalidatePath("/dashboard/payments");
    revalidatePath(`/dashboard/payments/${id}`);
    return { success: true, payment };
  } catch (error) {
    console.error("Error updating payment:", error);
    return { error: "Failed to update payment" };
  }
}

export async function getFinancialSummary(period: { start: Date; end: Date }) {
  const user = await getUser();
  if (!user) redirect("/login");

  const [received, pending, byContractor] = await Promise.all([
    prisma.payment.aggregate({
      where: { user_id: user.id, status: "received", received_date: { gte: period.start, lte: period.end } },
      _sum: { amount: true },
    }),
    prisma.payment.aggregate({
      where: { user_id: user.id, status: "pending", due_date: { lte: new Date() } },
      _sum: { amount: true },
    }),
    prisma.payment.groupBy({
      by: ["contractor_id"],
      where: { user_id: user.id, status: "received", received_date: { gte: period.start, lte: period.end } },
      _sum: { amount: true },
    }),
  ]);

  return {
    totalReceived: received._sum.amount || 0,
    totalPending: pending._sum.amount || 0,
    byContractor,
  };
}
