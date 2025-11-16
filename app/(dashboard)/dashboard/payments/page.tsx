import { getPayments, getFinancialSummary } from "@/lib/actions/payments";
import { PaymentsClient } from "./payments-client";

export default async function PaymentsPage() {
  const paymentsData = await getPayments();

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const summary = await getFinancialSummary({ start: startOfMonth, end: endOfMonth });

  // Convert Decimal to number for client component
  const payments = paymentsData.map((payment) => ({
    ...payment,
    amount: Number(payment.amount),
  }));

  const summaryConverted = {
    totalReceived: Number(summary.totalReceived),
    totalPending: Number(summary.totalPending),
  };

  return <PaymentsClient initialPayments={payments} initialSummary={summaryConverted} />;
}
