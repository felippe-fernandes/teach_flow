import { getUser } from "@/lib/actions/auth";
import { getClasses } from "@/lib/actions/classes";
import { getStudents } from "@/lib/actions/students";
import { getFinancialSummary } from "@/lib/actions/payments";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function DashboardPage() {
  const user = await getUser();
  if (!user) redirect("/login");

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const [upcomingClasses, students, financialSummary] = await Promise.all([
    getClasses({ startDate: today, endDate: tomorrow, status: "scheduled" }),
    getStudents(),
    getFinancialSummary({ start: new Date(now.getFullYear(), now.getMonth(), 1), end: new Date(now.getFullYear(), now.getMonth() + 1, 0) }),
  ]);

  const activeStudents = students.filter(s => s.status === "active");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Bem-vindo de volta, {user.name}!</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Próximas Aulas</CardTitle>
            <CardDescription>Aulas agendadas para hoje</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{upcomingClasses.length}</p>
            <Link href="/dashboard/classes"><Button variant="link" className="p-0 h-auto">Ver agenda</Button></Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Alunos Ativos</CardTitle>
            <CardDescription>Total de alunos cadastrados</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{activeStudents.length}</p>
            <Link href="/dashboard/students"><Button variant="link" className="p-0 h-auto">Ver alunos</Button></Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Faturamento do Mês</CardTitle>
            <CardDescription>Receita de {now.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: user.default_currency }).format(Number(financialSummary.totalReceived))}
            </p>
            <Link href="/dashboard/payments"><Button variant="link" className="p-0 h-auto">Ver financeiro</Button></Link>
          </CardContent>
        </Card>
      </div>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Começando com o TeachFlow</CardTitle>
            <CardDescription>
              Configure sua conta e comece a gerenciar suas aulas
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start space-x-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                1
              </div>
              <div>
                <h3 className="font-medium">Configure seu perfil</h3>
                <p className="text-sm text-muted-foreground">
                  Defina seu fuso horário, moeda padrão e preferências
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                2
              </div>
              <div>
                <h3 className="font-medium">Adicione contratantes</h3>
                <p className="text-sm text-muted-foreground">
                  Cadastre escolas, plataformas e suas regras de pagamento
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                3
              </div>
              <div>
                <h3 className="font-medium">Cadastre seus alunos</h3>
                <p className="text-sm text-muted-foreground">
                  Crie perfis detalhados para cada aluno
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                4
              </div>
              <div>
                <h3 className="font-medium">Agende suas aulas</h3>
                <p className="text-sm text-muted-foreground">
                  Comece a agendar aulas e gerencie sua agenda
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
    </div>
  );
}
