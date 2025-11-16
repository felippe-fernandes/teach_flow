"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createStudent } from "@/lib/actions/students";
import { getContractors } from "@/lib/actions/contractors";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ContractorSelect } from "@/components/forms/contractor-select";
import { ArrowLeft } from "lucide-react";

type Contractor = Awaited<ReturnType<typeof getContractors>>[0];

export default function NewStudentPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [contractors, setContractors] = useState<Contractor[]>([]);
  const [hasPackage, setHasPackage] = useState(false);

  useEffect(() => {
    async function loadContractors() {
      const data = await getContractors();
      setContractors(data);
    }
    loadContractors();
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    formData.append("has_package", hasPackage.toString());

    const result = await createStudent(formData);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    } else if (result?.success) {
      router.push("/dashboard/students");
    }
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/students">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Novo Aluno</h1>
          <p className="text-muted-foreground">Adicione um novo aluno</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações Básicas</CardTitle>
              <CardDescription>Dados pessoais do aluno</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">
                  Nome Completo <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Nome do aluno"
                  required
                  disabled={loading}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="aluno@email.com"
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone_number">Telefone/WhatsApp</Label>
                  <Input
                    id="phone_number"
                    name="phone_number"
                    type="tel"
                    placeholder="(11) 98765-4321"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select name="status" defaultValue="active" disabled={loading}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Ativo</SelectItem>
                      <SelectItem value="inactive">Inativo</SelectItem>
                      <SelectItem value="paused">Pausado</SelectItem>
                      <SelectItem value="lead">Lead</SelectItem>
                      <SelectItem value="archived">Arquivado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contractor_id">Contratante</Label>
                  <ContractorSelect
                    contractors={contractors}
                    defaultValue="__particular__"
                    disabled={loading}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Informações Acadêmicas</CardTitle>
              <CardDescription>Nível e objetivos de aprendizado</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="native_language">Idioma Nativo</Label>
                  <Input
                    id="native_language"
                    name="native_language"
                    placeholder="Ex: Português"
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="proficiency_level">Nível de Proficiência</Label>
                  <Select name="proficiency_level" disabled={loading}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o nível" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A1">A1 - Iniciante</SelectItem>
                      <SelectItem value="A2">A2 - Elementar</SelectItem>
                      <SelectItem value="B1">B1 - Intermediário</SelectItem>
                      <SelectItem value="B2">B2 - Intermediário Superior</SelectItem>
                      <SelectItem value="C1">C1 - Avançado</SelectItem>
                      <SelectItem value="C2">C2 - Proficiente</SelectItem>
                      <SelectItem value="Native">Nativo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="learning_goals">Objetivos de Aprendizado</Label>
                <Textarea
                  id="learning_goals"
                  name="learning_goals"
                  placeholder="Ex: Melhorar conversação, preparar para exames, viagens..."
                  rows={3}
                  disabled={loading}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Pacote de Aulas</CardTitle>
                  <CardDescription>Configure pacotes pré-pagos</CardDescription>
                </div>
                <Button
                  type="button"
                  variant={hasPackage ? "default" : "outline"}
                  size="sm"
                  onClick={() => setHasPackage(!hasPackage)}
                  disabled={loading}
                >
                  {hasPackage ? "Remover Pacote" : "Adicionar Pacote"}
                </Button>
              </div>
            </CardHeader>
            {hasPackage && (
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="package_total_classes">
                      Total de Aulas <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="package_total_classes"
                      name="package_total_classes"
                      type="number"
                      min="1"
                      placeholder="10"
                      required={hasPackage}
                      disabled={loading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="package_value">
                      Valor do Pacote <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="package_value"
                      name="package_value"
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="500.00"
                      required={hasPackage}
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="package_currency">Moeda</Label>
                    <Select name="package_currency" defaultValue="BRL" disabled={loading}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="BRL">BRL - Real</SelectItem>
                        <SelectItem value="USD">USD - Dólar</SelectItem>
                        <SelectItem value="EUR">EUR - Euro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="package_classes_per_week">Aulas por Semana</Label>
                    <Input
                      id="package_classes_per_week"
                      name="package_classes_per_week"
                      type="number"
                      min="1"
                      placeholder="2"
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="package_expires_at">Data de Expiração</Label>
                  <Input
                    id="package_expires_at"
                    name="package_expires_at"
                    type="date"
                    disabled={loading}
                  />
                </div>
              </CardContent>
            )}
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Observações Pedagógicas</CardTitle>
              <CardDescription>Anotações sobre o aluno</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="notes">Notas</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  placeholder="Adicione observações sobre metodologia, preferências, dificuldades..."
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
              {loading ? "Salvando..." : "Salvar Aluno"}
            </Button>
            <Link href="/dashboard/students">
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
