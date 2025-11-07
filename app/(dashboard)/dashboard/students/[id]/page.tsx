import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { getStudent, deleteStudent } from "@/lib/actions/students";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit, Trash2, Mail, Phone, GraduationCap, Calendar, DollarSign } from "lucide-react";

export default async function StudentDetailPage({ params }: { params: { id: string } }) {
  const student = await getStudent(params.id);

  if (!student) {
    notFound();
  }

  const packageDetails = student.package_details as any;

  const statusMap: Record<string, { label: string; variant: "default" | "secondary" | "outline" | "destructive" }> = {
    active: { label: "Ativo", variant: "default" },
    inactive: { label: "Inativo", variant: "secondary" },
    paused: { label: "Pausado", variant: "outline" },
    lead: { label: "Lead", variant: "secondary" },
    archived: { label: "Arquivado", variant: "destructive" },
  };

  const proficiencyMap: Record<string, string> = {
    A1: "A1 - Iniciante", A2: "A2 - Elementar", B1: "B1 - Intermediário",
    B2: "B2 - Intermediário Superior", C1: "C1 - Avançado", C2: "C2 - Proficiente", Native: "Nativo",
  };

  async function handleDelete() {
    "use server";
    const result = await deleteStudent(params.id);
    if (result?.success) {
      redirect("/dashboard/students");
    }
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/students">
            <Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold">{student.name}</h1>
              <Badge variant={statusMap[student.status]?.variant}>{statusMap[student.status]?.label}</Badge>
            </div>
            <p className="text-muted-foreground">Detalhes do aluno</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href={`/dashboard/students/${student.id}/edit`}>
            <Button><Edit className="mr-2 h-4 w-4" />Editar</Button>
          </Link>
          <form action={handleDelete}>
            <Button type="submit" variant="destructive"><Trash2 className="mr-2 h-4 w-4" />Excluir</Button>
          </form>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Informações de Contato</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {student.email && (
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div><p className="text-sm font-medium">E-mail</p><p className="text-sm text-muted-foreground">{student.email}</p></div>
              </div>
            )}
            {student.phone_number && (
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <div><p className="text-sm font-medium">Telefone</p><p className="text-sm text-muted-foreground">{student.phone_number}</p></div>
              </div>
            )}
            {!student.email && !student.phone_number && (
              <p className="text-sm text-muted-foreground">Nenhuma informação de contato</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Informações Acadêmicas</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {student.native_language && (
              <div><p className="text-sm font-medium">Idioma Nativo</p><p className="text-sm text-muted-foreground">{student.native_language}</p></div>
            )}
            {student.proficiency_level && (
              <div className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-muted-foreground" />
                <div><p className="text-sm font-medium">Nível</p><p className="text-sm text-muted-foreground">{proficiencyMap[student.proficiency_level]}</p></div>
              </div>
            )}
            {student.contractor && (
              <div><p className="text-sm font-medium">Contratante</p><p className="text-sm text-muted-foreground">{student.contractor.name}</p></div>
            )}
          </CardContent>
        </Card>

        {packageDetails && (
          <Card>
            <CardHeader><CardTitle>Pacote de Aulas</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div><p className="text-sm font-medium">Aulas Restantes</p><p className="text-2xl font-bold">{packageDetails.remaining_classes}/{packageDetails.total_classes}</p></div>
              <div><p className="text-sm font-medium">Valor do Pacote</p><p className="text-sm text-muted-foreground">{new Intl.NumberFormat("pt-BR", { style: "currency", currency: packageDetails.currency || "BRL" }).format(packageDetails.value_per_package)}</p></div>
              {packageDetails.expires_at && (
                <div><p className="text-sm font-medium">Expira em</p><p className="text-sm text-muted-foreground">{new Date(packageDetails.expires_at).toLocaleDateString("pt-BR")}</p></div>
              )}
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader><CardTitle>Estatísticas</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div><p className="text-2xl font-bold">{student._count.classes}</p><p className="text-xs text-muted-foreground">Aulas</p></div>
              <div><p className="text-2xl font-bold">{student._count.payments}</p><p className="text-xs text-muted-foreground">Pagamentos</p></div>
            </div>
          </CardContent>
        </Card>
      </div>

      {student.learning_goals && (
        <Card>
          <CardHeader><CardTitle>Objetivos de Aprendizado</CardTitle></CardHeader>
          <CardContent><p className="text-sm text-muted-foreground whitespace-pre-wrap">{student.learning_goals}</p></CardContent>
        </Card>
      )}

      {student.notes && (
        <Card>
          <CardHeader><CardTitle>Observações Pedagógicas</CardTitle></CardHeader>
          <CardContent><p className="text-sm text-muted-foreground whitespace-pre-wrap">{student.notes}</p></CardContent>
        </Card>
      )}
    </div>
  );
}
