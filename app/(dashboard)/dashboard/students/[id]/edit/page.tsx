"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getStudent, updateStudent } from "@/lib/actions/students";
import { getContractors } from "@/lib/actions/contractors";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

type Student = Awaited<ReturnType<typeof getStudent>>;
type Contractor = Awaited<ReturnType<typeof getContractors>>[0];

export default function EditStudentPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [student, setStudent] = useState<Student>(null);
  const [contractors, setContractors] = useState<Contractor[]>([]);
  const [hasPackage, setHasPackage] = useState(false);

  useEffect(() => {
    async function loadData() {
      const [studentData, contractorsData] = await Promise.all([getStudent(params.id), getContractors()]);
      if (!studentData) {
        router.push("/dashboard/students");
      } else {
        setStudent(studentData);
        setContractors(contractorsData);
        setHasPackage(!!studentData.package_details);
        setLoading(false);
      }
    }
    loadData();
  }, [params.id, router]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    formData.append("has_package", hasPackage.toString());

    const result = await updateStudent(params.id, formData);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    } else if (result?.success) {
      router.push(`/dashboard/students/${params.id}`);
    }
  }

  if (loading || !student) {
    return <div className="flex items-center justify-center min-h-[400px]"><p className="text-muted-foreground">Carregando...</p></div>;
  }

  const packageDetails = student.package_details as any;

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <Link href={`/dashboard/students/${params.id}`}><Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button></Link>
        <div><h1 className="text-3xl font-bold">Editar Aluno</h1><p className="text-muted-foreground">{student.name}</p></div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Informações Básicas</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo <span className="text-destructive">*</span></Label>
                <Input id="name" name="name" defaultValue={student.name} required disabled={loading} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2"><Label htmlFor="email">E-mail</Label><Input id="email" name="email" type="email" defaultValue={student.email || ""} disabled={loading} /></div>
                <div className="space-y-2"><Label htmlFor="phone_number">Telefone</Label><Input id="phone_number" name="phone_number" defaultValue={student.phone_number || ""} disabled={loading} /></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select name="status" defaultValue={student.status} disabled={loading}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
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
                  <Select name="contractor_id" defaultValue={student.contractor_id || undefined} disabled={loading}>
                    <SelectTrigger><SelectValue placeholder="Particular" /></SelectTrigger>
                    <SelectContent>
                      {contractors.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Informações Acadêmicas</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2"><Label htmlFor="native_language">Idioma Nativo</Label><Input id="native_language" name="native_language" defaultValue={student.native_language || ""} disabled={loading} /></div>
                <div className="space-y-2">
                  <Label htmlFor="proficiency_level">Nível</Label>
                  <Select name="proficiency_level" defaultValue={student.proficiency_level || undefined} disabled={loading}>
                    <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
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
              <div className="space-y-2"><Label htmlFor="learning_goals">Objetivos</Label><Textarea id="learning_goals" name="learning_goals" defaultValue={student.learning_goals || ""} rows={3} disabled={loading} /></div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div><CardTitle>Pacote de Aulas</CardTitle></div>
                <Button type="button" variant={hasPackage ? "default" : "outline"} size="sm" onClick={() => setHasPackage(!hasPackage)} disabled={loading}>{hasPackage ? "Remover" : "Adicionar"}</Button>
              </div>
            </CardHeader>
            {hasPackage && (
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2"><Label htmlFor="package_total_classes">Total</Label><Input id="package_total_classes" name="package_total_classes" type="number" defaultValue={packageDetails?.total_classes} required disabled={loading} /></div>
                  <div className="space-y-2"><Label htmlFor="package_remaining_classes">Restantes</Label><Input id="package_remaining_classes" name="package_remaining_classes" type="number" defaultValue={packageDetails?.remaining_classes} required disabled={loading} /></div>
                  <div className="space-y-2"><Label htmlFor="package_value">Valor</Label><Input id="package_value" name="package_value" type="number" step="0.01" defaultValue={packageDetails?.value_per_package} required disabled={loading} /></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="package_currency">Moeda</Label>
                    <Select name="package_currency" defaultValue={packageDetails?.currency || "BRL"} disabled={loading}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent><SelectItem value="BRL">BRL</SelectItem><SelectItem value="USD">USD</SelectItem><SelectItem value="EUR">EUR</SelectItem></SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2"><Label htmlFor="package_expires_at">Expira em</Label><Input id="package_expires_at" name="package_expires_at" type="date" defaultValue={packageDetails?.expires_at?.split("T")[0]} disabled={loading} /></div>
                </div>
              </CardContent>
            )}
          </Card>

          <Card>
            <CardHeader><CardTitle>Observações</CardTitle></CardHeader>
            <CardContent><Textarea id="notes" name="notes" defaultValue={student.notes || ""} rows={4} disabled={loading} /></CardContent>
          </Card>

          {error && <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">{error}</div>}

          <div className="flex gap-4">
            <Button type="submit" disabled={loading}>{loading ? "Salvando..." : "Salvar"}</Button>
            <Link href={`/dashboard/students/${params.id}`}><Button type="button" variant="outline" disabled={loading}>Cancelar</Button></Link>
          </div>
        </div>
      </form>
    </div>
  );
}
