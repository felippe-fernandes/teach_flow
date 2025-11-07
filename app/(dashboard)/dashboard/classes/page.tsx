import Link from "next/link";
import { getClasses } from "@/lib/actions/classes";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Calendar as CalendarIcon, Clock, Video } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default async function ClassesPage() {
  const classes = await getClasses();

  const statusMap: Record<string, { label: string; variant: "default" | "secondary" | "outline" | "destructive" }> = {
    scheduled: { label: "Agendada", variant: "default" },
    completed: { label: "Concluída", variant: "secondary" },
    cancelled: { label: "Cancelada", variant: "destructive" },
    no_show: { label: "Falta", variant: "outline" },
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Aulas</h1>
          <p className="text-muted-foreground">Gerencie seu calendário de aulas</p>
        </div>
        <Link href="/dashboard/classes/new">
          <Button><Plus className="mr-2 h-4 w-4" />Agendar Aula</Button>
        </Link>
      </div>

      {classes.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <CalendarIcon className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhuma aula agendada</h3>
            <p className="text-sm text-muted-foreground mb-4">Comece agendando sua primeira aula</p>
            <Link href="/dashboard/classes/new"><Button><Plus className="mr-2 h-4 w-4" />Agendar Primeira Aula</Button></Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {classes.map((cls) => (
            <Card key={cls.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <CardTitle>{cls.student.name}</CardTitle>
                      <Badge variant={statusMap[cls.status]?.variant}>{statusMap[cls.status]?.label}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{cls.contractor.name}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                    <span>{format(new Date(cls.start_time), "dd 'de' MMMM, yyyy", { locale: ptBR })}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{format(new Date(cls.start_time), "HH:mm")} - {format(new Date(cls.end_time), "HH:mm")}</span>
                  </div>
                  {cls.location_type === "online" && cls.virtual_meeting_link && (
                    <a href={cls.virtual_meeting_link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-primary hover:underline">
                      <Video className="h-4 w-4" />
                      <span>Entrar na aula</span>
                    </a>
                  )}
                </div>
                {cls.class_notes && (
                  <p className="text-sm text-muted-foreground line-clamp-2">{cls.class_notes}</p>
                )}
                <Link href={`/dashboard/classes/${cls.id}`}>
                  <Button variant="outline" size="sm">Ver Detalhes</Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
