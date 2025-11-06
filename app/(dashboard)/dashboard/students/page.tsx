import Link from "next/link";
import { getStudents } from "@/lib/actions/students";
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
import { Plus, Users, GraduationCap, Globe } from "lucide-react";

export default async function StudentsPage() {
  const students = await getStudents();
  const contractors = await getContractors();

  const statusMap: Record<string, { label: string; variant: "default" | "secondary" | "outline" | "destructive" }> = {
    active: { label: "Ativo", variant: "default" },
    inactive: { label: "Inativo", variant: "secondary" },
    paused: { label: "Pausado", variant: "outline" },
    lead: { label: "Lead", variant: "secondary" },
    archived: { label: "Arquivado", variant: "destructive" },
  };

  const proficiencyMap: Record<string, string> = {
    A1: "Iniciante",
    A2: "Elementar",
    B1: "Intermediário",
    B2: "Intermediário Superior",
    C1: "Avançado",
    C2: "Proficiente",
    Native: "Nativo",
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Alunos</h1>
          <p className="text-muted-foreground">
            Gerencie seus alunos e acompanhe o progresso
          </p>
        </div>
        <Link href="/dashboard/students/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Novo Aluno
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Alunos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{students.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alunos Ativos</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {students.filter((s) => s.status === "active").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Leads</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {students.filter((s) => s.status === "lead").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contratantes</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(students.filter((s) => s.contractor_id).map((s) => s.contractor_id)).size}
            </div>
          </CardContent>
        </Card>
      </div>

      {students.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              Nenhum aluno cadastrado
            </h3>
            <p className="text-sm text-muted-foreground mb-4 text-center max-w-md">
              Comece adicionando seus alunos para gerenciar aulas e acompanhar o
              progresso
            </p>
            <Link href="/dashboard/students/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Adicionar Primeiro Aluno
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {students.map((student) => {
            const packageDetails = student.package_details as any;

            return (
              <Link
                key={student.id}
                href={`/dashboard/students/${student.id}`}
              >
                <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-xl">
                            {student.name}
                          </CardTitle>
                          <Badge variant={statusMap[student.status]?.variant || "default"}>
                            {statusMap[student.status]?.label || student.status}
                          </Badge>
                        </div>
                        {student.email && (
                          <CardDescription className="text-sm">
                            {student.email}
                          </CardDescription>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {student.proficiency_level && (
                      <div className="flex items-center gap-2">
                        <GraduationCap className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          {proficiencyMap[student.proficiency_level] || student.proficiency_level}
                        </span>
                      </div>
                    )}
                    {student.contractor && (
                      <div className="text-sm text-muted-foreground">
                        {student.contractor.name}
                      </div>
                    )}
                    {packageDetails && (
                      <div className="pt-2 border-t">
                        <div className="text-xs text-muted-foreground">
                          Pacote: {packageDetails.remaining_classes}/{packageDetails.total_classes} aulas restantes
                        </div>
                      </div>
                    )}
                    <div className="flex gap-4 text-xs text-muted-foreground pt-2">
                      <div>
                        <span className="font-medium">{student._count.classes}</span> aulas
                      </div>
                      <div>
                        <span className="font-medium">{student._count.payments}</span> pagamentos
                      </div>
                    </div>
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
