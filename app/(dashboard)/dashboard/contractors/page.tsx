import Link from "next/link";
import { getContractors } from "@/lib/actions/contractors";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Building2, DollarSign, Calendar } from "lucide-react";

export default async function ContractorsPage() {
  const contractors = await getContractors();

  const paymentFrequencyMap: Record<string, string> = {
    weekly: "Semanal",
    bi_weekly: "Quinzenal",
    monthly: "Mensal",
    per_class: "Por Aula",
    custom: "Personalizado",
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Contratantes</h1>
          <p className="text-muted-foreground">
            Gerencie escolas, plataformas e regras de pagamento
          </p>
        </div>
        <Link href="/dashboard/contractors/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Novo Contratante
          </Button>
        </Link>
      </div>

      {contractors.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              Nenhum contratante cadastrado
            </h3>
            <p className="text-sm text-muted-foreground mb-4 text-center max-w-md">
              Comece adicionando escolas, plataformas ou clientes que contratam
              seus serviços
            </p>
            <Link href="/dashboard/contractors/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Adicionar Primeiro Contratante
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {contractors.map((contractor) => {
            const contactInfo = contractor.contact_info as Record<string, string> | null;

            return (
              <Link
                key={contractor.id}
                href={`/dashboard/contractors/${contractor.id}`}
              >
                <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1 flex-1">
                        <CardTitle className="text-xl">
                          {contractor.name}
                        </CardTitle>
                        {contactInfo?.email && (
                          <CardDescription className="text-sm">
                            {contactInfo.email}
                          </CardDescription>
                        )}
                      </div>
                      <Building2 className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">
                        {new Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: contractor.currency,
                        }).format(Number(contractor.default_hourly_rate))}
                        /hora
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <Badge variant="secondary">
                        {paymentFrequencyMap[contractor.payment_frequency] ||
                          contractor.payment_frequency}
                      </Badge>
                    </div>
                    {contractor.payment_terms_days > 0 && (
                      <div className="text-sm text-muted-foreground">
                        Prazo: {contractor.payment_terms_days} dias
                      </div>
                    )}
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
