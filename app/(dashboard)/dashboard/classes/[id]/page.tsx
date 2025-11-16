import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { getClass, deleteClass } from "@/lib/actions/classes";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit, Trash2, Calendar as CalendarIcon, Clock, MapPin, Video, FileText } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default async function ClassDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const classRecord = await getClass(id);

  if (!classRecord) {
    notFound();
  }

  const statusMap: Record<string, { label: string; variant: "default" | "secondary" | "outline" | "destructive" }> = {
    scheduled: { label: "Agendada", variant: "default" },
    completed: { label: "Concluída", variant: "secondary" },
    cancelled: { label: "Cancelada", variant: "destructive" },
    no_show: { label: "Falta", variant: "outline" },
  };

  const locationTypeMap: Record<string, { label: string; icon: typeof MapPin }> = {
    online: { label: "Online", icon: Video },
    in_person: { label: "Presencial", icon: MapPin },
  };

  async function handleDelete() {
    "use server";
    const result = await deleteClass(id);
    if (result?.success) {
      redirect("/dashboard/classes");
    }
  }

  const LocationIcon = locationTypeMap[classRecord.location_type]?.icon || MapPin;

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/classes">
            <Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold">{classRecord.student.name}</h1>
              <Badge variant={statusMap[classRecord.status]?.variant}>{statusMap[classRecord.status]?.label}</Badge>
            </div>
            <p className="text-muted-foreground">Detalhes da aula</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href={`/dashboard/classes/${classRecord.id}/edit`}>
            <Button><Edit className="mr-2 h-4 w-4" />Editar</Button>
          </Link>
          <form action={handleDelete}>
            <Button type="submit" variant="destructive"><Trash2 className="mr-2 h-4 w-4" />Excluir</Button>
          </form>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Horário</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Data</p>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(classRecord.start_time), "dd 'de' MMMM, yyyy", { locale: ptBR })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Horário</p>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(classRecord.start_time), "HH:mm")} - {format(new Date(classRecord.end_time), "HH:mm")}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Duração</p>
                <p className="text-sm text-muted-foreground">{classRecord.duration_minutes} minutos</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Localização</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <LocationIcon className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Tipo</p>
                <p className="text-sm text-muted-foreground">
                  {locationTypeMap[classRecord.location_type]?.label || classRecord.location_type}
                </p>
              </div>
            </div>
            {classRecord.location_type === "online" && classRecord.virtual_meeting_link && (
              <div>
                <p className="text-sm font-medium mb-2">Link da Reunião</p>
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
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Participantes</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium">Aluno</p>
              <Link href={`/dashboard/students/${classRecord.student.id}`}>
                <p className="text-sm text-primary hover:underline">{classRecord.student.name}</p>
              </Link>
            </div>
            <div>
              <p className="text-sm font-medium">Contratante</p>
              {classRecord.contractor ? (
                <Link href={`/dashboard/contractors/${classRecord.contractor.id}`}>
                  <p className="text-sm text-primary hover:underline">{classRecord.contractor.name}</p>
                </Link>
              ) : (
                <p className="text-sm text-muted-foreground">Particular</p>
              )}
            </div>
          </CardContent>
        </Card>

        {classRecord.custom_rate && (
          <Card>
            <CardHeader><CardTitle>Valores</CardTitle></CardHeader>
            <CardContent>
              <div>
                <p className="text-sm font-medium">Taxa Customizada</p>
                <p className="text-2xl font-bold">
                  {new Intl.NumberFormat("pt-BR", { style: "currency", currency: classRecord.contractor?.currency || "BRL" }).format(classRecord.custom_rate)}
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {classRecord.class_notes && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              <CardTitle>Observações da Aula</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{classRecord.class_notes}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
