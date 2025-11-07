import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { getContractor, deleteContractor } from "@/lib/actions/contractors";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit, Trash2, Building2, Mail, Phone, Globe, User } from "lucide-react";

export default async function ContractorDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const contractor = await getContractor(params.id);

  if (!contractor) {
    notFound();
  }

  const contactInfo = contractor.contact_info as Record<string, string> | null;

  const paymentFrequencyMap: Record<string, string> = {
    weekly: "Semanal",
    bi_weekly: "Quinzenal",
    monthly: "Mensal",
    per_class: "Por Aula",
    custom: "Personalizado",
  };

  async function handleDelete() {
    "use server";
    const result = await deleteContractor(params.id);
    if (result?.success) {
      redirect("/dashboard/contractors");
    }
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/contractors">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">{contractor.name}</h1>
            <p className="text-muted-foreground">
              Detalhes do contratante
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href={`/dashboard/contractors/${contractor.id}/edit`}>
            <Button>
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </Button>
          </Link>
          <form action={handleDelete}>
            <Button type="submit" variant="destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Excluir
            </Button>
          </form>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Informações de Contato</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {contactInfo?.email && (
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">E-mail</p>
                  <p className="text-sm text-muted-foreground">{contactInfo.email}</p>
                </div>
              </div>
            )}
            {contactInfo?.phone && (
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Telefone</p>
                  <p className="text-sm text-muted-foreground">{contactInfo.phone}</p>
                </div>
              </div>
            )}
            {contactInfo?.website && (
              <div className="flex items-center gap-3">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Website</p>
                  <a
                    href={contactInfo.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline"
                  >
                    {contactInfo.website}
                  </a>
                </div>
              </div>
            )}
            {contactInfo?.contact_person && (
              <div className="flex items-center gap-3">
                <User className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Pessoa de Contato</p>
                  <p className="text-sm text-muted-foreground">{contactInfo.contact_person}</p>
                </div>
              </div>
            )}
            {!contactInfo?.email && !contactInfo?.phone && !contactInfo?.website && !contactInfo?.contact_person && (
              <p className="text-sm text-muted-foreground">
                Nenhuma informação de contato cadastrada
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Regras Financeiras</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium">Valor por Hora</p>
              <p className="text-2xl font-bold">
                {new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: contractor.currency,
                }).format(Number(contractor.default_hourly_rate))}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium mb-2">Frequência de Pagamento</p>
              <Badge>
                {paymentFrequencyMap[contractor.payment_frequency] ||
                  contractor.payment_frequency}
              </Badge>
            </div>
            {contractor.payment_terms_days > 0 && (
              <div>
                <p className="text-sm font-medium">Prazo para Pagamento</p>
                <p className="text-sm text-muted-foreground">
                  {contractor.payment_terms_days} dias após a aula/fechamento
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Regras de Cancelamento</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium">Aviso Mínimo</p>
              <p className="text-sm text-muted-foreground">
                {contractor.min_cancellation_notice_hours} horas de antecedência
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">Taxa de Penalidade</p>
              <p className="text-sm text-muted-foreground">
                {Number(contractor.cancellation_penalty_rate) > 0
                  ? `${(Number(contractor.cancellation_penalty_rate) * 100).toFixed(0)}% do valor da aula`
                  : "Sem penalidade"}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Estatísticas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-2xl font-bold">{contractor._count.students}</p>
                <p className="text-xs text-muted-foreground">Alunos</p>
              </div>
              <div>
                <p className="text-2xl font-bold">{contractor._count.classes}</p>
                <p className="text-xs text-muted-foreground">Aulas</p>
              </div>
              <div>
                <p className="text-2xl font-bold">{contractor._count.payments}</p>
                <p className="text-xs text-muted-foreground">Pagamentos</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {contractor.notes && (
        <Card>
          <CardHeader>
            <CardTitle>Observações</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {contractor.notes}
            </p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Informações do Sistema</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <div>
            <span className="font-medium">Criado em:</span>{" "}
            {new Date(contractor.created_at).toLocaleString("pt-BR")}
          </div>
          <div>
            <span className="font-medium">Última atualização:</span>{" "}
            {new Date(contractor.updated_at).toLocaleString("pt-BR")}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
