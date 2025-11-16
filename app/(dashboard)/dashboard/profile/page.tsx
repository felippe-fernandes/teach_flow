import { getUser, getLinkedProviders } from "@/lib/actions/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { redirect } from "next/navigation";
import { User, Mail, Globe, DollarSign, Shield } from "lucide-react";
import { ConnectedProviders } from "@/components/profile/connected-providers";

export default async function ProfilePage() {
  const user = await getUser();
  if (!user) redirect("/login");

  const identities = await getLinkedProviders();

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold">Perfil</h1>
        <p className="text-muted-foreground">Gerencie suas informações e preferências</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Informações Pessoais</CardTitle>
            <CardDescription>Seus dados cadastrais</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <User className="h-4 w-4 text-muted-foreground" />
              <div><p className="text-sm font-medium">Nome</p><p className="text-sm text-muted-foreground">{user.name}</p></div>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <div><p className="text-sm font-medium">E-mail</p><p className="text-sm text-muted-foreground">{user.email}</p></div>
            </div>
            {user.phone_number && (
              <div className="flex items-center gap-3">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <div><p className="text-sm font-medium">Telefone</p><p className="text-sm text-muted-foreground">{user.phone_number}</p></div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Preferências</CardTitle>
            <CardDescription>Configurações da conta</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <div><p className="text-sm font-medium">Fuso Horário</p><p className="text-sm text-muted-foreground">{user.timezone}</p></div>
            </div>
            <div className="flex items-center gap-3">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <div><p className="text-sm font-medium">Moeda Padrão</p><p className="text-sm text-muted-foreground">{user.default_currency}</p></div>
            </div>
            <div className="flex items-center gap-3">
              <Shield className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Autenticação 2FA</p>
                {user.two_factor_enabled ? (
                  <Badge variant="default">Ativado</Badge>
                ) : (
                  <Badge variant="outline">Desativado</Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <ConnectedProviders identities={identities} />

      <Card>
        <CardHeader>
          <CardTitle>Informações do Sistema</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <div><span className="font-medium">Conta criada em:</span> {new Date(user.created_at).toLocaleString("pt-BR")}</div>
          <div><span className="font-medium">Última atualização:</span> {new Date(user.updated_at).toLocaleString("pt-BR")}</div>
          <div><span className="font-medium">ID do usuário:</span> <code className="text-xs bg-muted px-2 py-1 rounded">{user.id}</code></div>
        </CardContent>
      </Card>
    </div>
  );
}
