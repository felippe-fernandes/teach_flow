"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClass } from "@/lib/actions/classes";
import { getStudents } from "@/lib/actions/students";
import { getContractors } from "@/lib/actions/contractors";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

type Student = Awaited<ReturnType<typeof getStudents>>[0];
type Contractor = Awaited<ReturnType<typeof getContractors>>[0];

export default function NewClassPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);
  const [contractors, setContractors] = useState<Contractor[]>([]);

  useEffect(() => {
    async function loadData() {
      const [studentsData, contractorsData] = await Promise.all([getStudents(), getContractors()]);
      setStudents(studentsData);
      setContractors(contractorsData);
    }
    loadData();
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const result = await createClass(formData);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    } else if (result?.success) {
      router.push("/dashboard/classes");
    }
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/classes">
          <Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Agendar Aula</h1>
          <p className="text-muted-foreground">Crie um novo agendamento</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações da Aula</CardTitle>
              <CardDescription>Selecione aluno, contratante e horário</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="student_id">Aluno <span className="text-destructive">*</span></Label>
                  <Select name="student_id" required disabled={loading}>
                    <SelectTrigger><SelectValue placeholder="Selecione o aluno" /></SelectTrigger>
                    <SelectContent>
                      {students.map((s) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contractor_id">Contratante <span className="text-destructive">*</span></Label>
                  <Select name="contractor_id" required disabled={loading}>
                    <SelectTrigger><SelectValue placeholder="Selecione o contratante" /></SelectTrigger>
                    <SelectContent>
                      {contractors.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start_time">Data e Hora <span className="text-destructive">*</span></Label>
                  <Input id="start_time" name="start_time" type="datetime-local" required disabled={loading} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration_minutes">Duração (minutos) <span className="text-destructive">*</span></Label>
                  <Input id="duration_minutes" name="duration_minutes" type="number" min="15" step="15" defaultValue="60" required disabled={loading} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location_type">Tipo de Aula</Label>
                  <Select name="location_type" defaultValue="online" disabled={loading}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="online">Online</SelectItem>
                      <SelectItem value="in_person">Presencial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="virtual_meeting_link">Link da Reunião</Label>
                  <Input id="virtual_meeting_link" name="virtual_meeting_link" type="url" placeholder="https://meet.google.com/..." disabled={loading} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="class_notes">Observações</Label>
                <Textarea id="class_notes" name="class_notes" placeholder="Tópicos da aula, material necessário..." rows={3} disabled={loading} />
              </div>
            </CardContent>
          </Card>

          {error && <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">{error}</div>}

          <div className="flex gap-4">
            <Button type="submit" disabled={loading}>{loading ? "Agendando..." : "Agendar Aula"}</Button>
            <Link href="/dashboard/classes"><Button type="button" variant="outline" disabled={loading}>Cancelar</Button></Link>
          </div>
        </div>
      </form>
    </div>
  );
}
