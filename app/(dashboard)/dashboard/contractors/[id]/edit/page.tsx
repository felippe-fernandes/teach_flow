"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getContractor, updateContractor } from "@/lib/actions/contractors";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

type Contractor = Awaited<ReturnType<typeof getContractor>>;

export default function EditContractorPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [contractor, setContractor] = useState<Contractor>(null);

  useEffect(() => {
    async function loadContractor() {
      const data = await getContractor(params.id);
      if (!data) {
        router.push("/dashboard/contractors");
      } else {
        setContractor(data);
        setLoading(false);
      }
    }
    loadContractor();
  }, [params.id, router]);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);

    const result = await updateContractor(params.id, formData);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    } else if (result?.success) {
      router.push(`/dashboard/contractors/${params.id}`);
    }
  }

  if (loading || !contractor) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  const contactInfo = contractor.contact_info as Record<string, string> | null;

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <Link href={`/dashboard/contractors/${params.id}`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Editar Contratante</h1>
          <p className="text-muted-foreground">{contractor.name}</p>
        </div>
      </div>

      <form action={handleSubmit}>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações Básicas</CardTitle>
              <CardDescription>
                Dados principais do contratante
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">
                  Nome do Contratante <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  name="name"
                  defaultValue={contractor.name}
                  placeholder="Ex: Escola de Idiomas Alpha"
                  required
                  disabled={loading}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contact_email">E-mail de Contato</Label>
                  <Input
                    id="contact_email"
                    name="contact_email"
                    type="email"
                    defaultValue={contactInfo?.email || ""}
                    placeholder="contato@escola.com"
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact_phone">Telefone</Label>
                  <Input
                    id="contact_phone"
                    name="contact_phone"
                    type="tel"
                    defaultValue={contactInfo?.phone || ""}
                    placeholder="(11) 98765-4321"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contact_website">Website</Label>
                  <Input
                    id="contact_website"
                    name="contact_website"
                    type="url"
                    defaultValue={contactInfo?.website || ""}
                    placeholder="https://escola.com"
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact_person">Pessoa de Contato</Label>
                  <Input
                    id="contact_person"
                    name="contact_person"
                    defaultValue={contactInfo?.contact_person || ""}
                    placeholder="João Silva"
                    disabled={loading}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Regras Financeiras</CardTitle>
              <CardDescription>
                Configure valores e formas de pagamento
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="default_hourly_rate">
                    Valor por Hora <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="default_hourly_rate"
                    name="default_hourly_rate"
                    type="number"
                    step="0.01"
                    min="0"
                    defaultValue={Number(contractor.default_hourly_rate)}
                    placeholder="50.00"
                    required
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">
                    Moeda <span className="text-destructive">*</span>
                  </Label>
                  <Select name="currency" defaultValue={contractor.currency} required disabled={loading}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a moeda" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BRL">BRL - Real Brasileiro</SelectItem>
                      <SelectItem value="USD">USD - Dólar Americano</SelectItem>
                      <SelectItem value="EUR">EUR - Euro</SelectItem>
                      <SelectItem value="GBP">GBP - Libra Esterlina</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="payment_frequency">
                    Frequência de Pagamento <span className="text-destructive">*</span>
                  </Label>
                  <Select name="payment_frequency" defaultValue={contractor.payment_frequency} required disabled={loading}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weekly">Semanal</SelectItem>
                      <SelectItem value="bi_weekly">Quinzenal</SelectItem>
                      <SelectItem value="monthly">Mensal</SelectItem>
                      <SelectItem value="per_class">Por Aula</SelectItem>
                      <SelectItem value="custom">Personalizado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="payment_terms_days">
                    Prazo para Pagamento (dias)
                  </Label>
                  <Input
                    id="payment_terms_days"
                    name="payment_terms_days"
                    type="number"
                    min="0"
                    defaultValue={contractor.payment_terms_days}
                    placeholder="30"
                    disabled={loading}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Regras de Cancelamento</CardTitle>
              <CardDescription>
                Defina as políticas de cancelamento de aulas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="min_cancellation_notice_hours">
                    Aviso Mínimo (horas)
                  </Label>
                  <Input
                    id="min_cancellation_notice_hours"
                    name="min_cancellation_notice_hours"
                    type="number"
                    min="0"
                    defaultValue={contractor.min_cancellation_notice_hours}
                    placeholder="24"
                    disabled={loading}
                  />
                  <p className="text-xs text-muted-foreground">
                    Horas mínimas de antecedência para cancelamento sem custo
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cancellation_penalty_rate">
                    Taxa de Penalidade (%)
                  </Label>
                  <Input
                    id="cancellation_penalty_rate"
                    name="cancellation_penalty_rate"
                    type="number"
                    step="0.01"
                    min="0"
                    max="1"
                    defaultValue={Number(contractor.cancellation_penalty_rate)}
                    placeholder="0.50"
                    disabled={loading}
                  />
                  <p className="text-xs text-muted-foreground">
                    Ex: 0.50 para 50% do valor da aula
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Observações</CardTitle>
              <CardDescription>
                Informações adicionais sobre o contratante
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="notes">Notas</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  defaultValue={contractor.notes || ""}
                  placeholder="Adicione observações, contratos específicos ou outras informações relevantes..."
                  rows={4}
                  disabled={loading}
                />
              </div>
            </CardContent>
          </Card>

          {error && (
            <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
              {error}
            </div>
          )}

          <div className="flex gap-4">
            <Button type="submit" disabled={loading}>
              {loading ? "Salvando..." : "Salvar Alterações"}
            </Button>
            <Link href={`/dashboard/contractors/${params.id}`}>
              <Button type="button" variant="outline" disabled={loading}>
                Cancelar
              </Button>
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}
