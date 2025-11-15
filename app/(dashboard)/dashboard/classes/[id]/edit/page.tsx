"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getClass, updateClass } from "@/lib/actions/classes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

type Class = Awaited<ReturnType<typeof getClass>>;

export default function EditClassPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [classRecord, setClassRecord] = useState<Class>(null);

  useEffect(() => {
    async function loadClass() {
      const data = await getClass(id);
      if (!data) {
        router.push("/dashboard/classes");
      } else {
        setClassRecord(data);
        setLoading(false);
      }
    }
    loadClass();
  }, [id, router]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const result = await updateClass(id, formData);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    } else if (result?.success) {
      router.push(`/dashboard/classes/${id}`);
    }
  }

  if (loading || !classRecord) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <Link href={`/dashboard/classes/${id}`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Editar Aula</h1>
          <p className="text-muted-foreground">{classRecord.student.name}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Status e Observações</CardTitle>
              <CardDescription>Atualize o status e adicione observações sobre a aula</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select name="status" defaultValue={classRecord.status} disabled={loading}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="scheduled">Agendada</SelectItem>
                    <SelectItem value="completed">Concluída</SelectItem>
                    <SelectItem value="cancelled">Cancelada</SelectItem>
                    <SelectItem value="no_show">Falta</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="class_notes">Observações da Aula</Label>
                <Textarea
                  id="class_notes"
                  name="class_notes"
                  defaultValue={classRecord.class_notes || ""}
                  placeholder="Tópicos abordados, progresso do aluno, materiais utilizados..."
                  rows={6}
                  disabled={loading}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Informações da Aula</CardTitle>
              <CardDescription>Dados registrados no agendamento</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Aluno</Label>
                  <p className="text-sm text-muted-foreground">{classRecord.student.name}</p>
                </div>
                <div className="space-y-2">
                  <Label>Contratante</Label>
                  <p className="text-sm text-muted-foreground">{classRecord.contractor?.name || "Particular"}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Data e Hora</Label>
                  <p className="text-sm text-muted-foreground">
                    {new Date(classRecord.start_time).toLocaleString("pt-BR")}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label>Duração</Label>
                  <p className="text-sm text-muted-foreground">{classRecord.duration_minutes} minutos</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tipo de Aula</Label>
                  <p className="text-sm text-muted-foreground">
                    {classRecord.location_type === "online" ? "Online" : "Presencial"}
                  </p>
                </div>
                {classRecord.virtual_meeting_link && (
                  <div className="space-y-2">
                    <Label>Link da Reunião</Label>
                    <a
                      href={classRecord.virtual_meeting_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline break-all"
                    >
                      {classRecord.virtual_meeting_link}
                    </a>
                  </div>
                )}
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
            <Link href={`/dashboard/classes/${id}`}>
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
