"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign, TrendingUp, Clock, CheckCircle } from "lucide-react";
import { format } from "date-fns";
import { PaymentFilters } from "@/components/payments/payment-filters";

type Payment = {
  id: string;
  amount: number;
  currency: string;
  status: string;
  due_date: Date;
  received_date: Date | null;
  student: { name: string } | null;
  contractor: { name: string };
};

type Summary = {
  totalReceived: number;
  totalPending: number;
};

interface PaymentsClientProps {
  initialPayments: Payment[];
  initialSummary: Summary;
}

export function PaymentsClient({ initialPayments, initialSummary }: PaymentsClientProps) {
  const [filteredPayments, setFilteredPayments] = useState(initialPayments);
  const [summary, setSummary] = useState(initialSummary);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const statusMap: Record<string, { label: string; variant: "default" | "secondary" | "outline" | "destructive" }> = {
    pending: { label: "Pendente", variant: "outline" },
    received: { label: "Recebido", variant: "default" },
    cancelled: { label: "Cancelado", variant: "destructive" },
    overdue: { label: "Atrasado", variant: "destructive" },
  };

  const handleFilterChange = (newStartDate: Date | null, newEndDate: Date | null) => {
    setStartDate(newStartDate);
    setEndDate(newEndDate);
  };

  useEffect(() => {
    // Filter payments based on date range
    let filtered = initialPayments;

    if (startDate || endDate) {
      filtered = initialPayments.filter((payment) => {
        const dueDate = new Date(payment.due_date);

        if (startDate && endDate) {
          return dueDate >= startDate && dueDate <= endDate;
        } else if (startDate) {
          return dueDate >= startDate;
        } else if (endDate) {
          return dueDate <= endDate;
        }

        return true;
      });
    }

    setFilteredPayments(filtered);

    // Recalculate summary for filtered data
    const received = filtered
      .filter((p) => p.status === "received")
      .reduce((sum, p) => sum + Number(p.amount), 0);

    const pending = filtered
      .filter((p) => p.status === "pending")
      .reduce((sum, p) => sum + Number(p.amount), 0);

    setSummary({
      totalReceived: received,
      totalPending: pending,
    });
  }, [startDate, endDate, initialPayments]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Financeiro</h1>
        <p className="text-muted-foreground">Controle de pagamentos e receitas</p>
      </div>

      <PaymentFilters onFilterChange={handleFilterChange} />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {startDate || endDate ? "Recebido no Período" : "Recebido no Mês"}
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(summary.totalReceived)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendente</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(summary.totalPending)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Pagamentos</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredPayments.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recebidos</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {filteredPayments.filter((p) => p.status === "received").length}
            </div>
          </CardContent>
        </Card>
      </div>

      {filteredPayments.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <DollarSign className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {initialPayments.length === 0 ? "Nenhum pagamento registrado" : "Nenhum pagamento encontrado"}
            </h3>
            <p className="text-sm text-muted-foreground">
              {initialPayments.length === 0
                ? "Pagamentos são criados automaticamente ao concluir aulas"
                : "Tente ajustar os filtros para ver mais resultados"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Histórico de Pagamentos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredPayments.map((payment) => (
                <div key={payment.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{payment.student?.name || "Aluno não especificado"}</p>
                      <Badge variant={statusMap[payment.status]?.variant}>
                        {statusMap[payment.status]?.label}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{payment.contractor.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Vencimento: {format(new Date(payment.due_date), "dd/MM/yyyy")}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold">
                      {new Intl.NumberFormat("pt-BR", { style: "currency", currency: payment.currency }).format(Number(payment.amount))}
                    </p>
                    {payment.received_date && (
                      <p className="text-xs text-muted-foreground">
                        Recebido em {format(new Date(payment.received_date), "dd/MM/yyyy")}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
