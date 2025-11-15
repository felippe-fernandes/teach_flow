# 🚀 Quick Start - NextAuth + Neon

> **Idiomas**: [English](./QUICK_START.md) | **Português (Brasil)**

Este guia irá ajudá-lo a configurar e rodar o TeachFlow localmente em **10 minutos**.

## 📋 Pré-requisitos

- Node.js 18+ instalado
- npm ou yarn
- Conta no [Neon](https://neon.tech) (gratuita)
- (Opcional) Conta Google Cloud para OAuth

## ⚡ Configuração Rápida (10 minutos)

### 1. Configure o Neon (5 min)

```bash
# 1. Acesse https://neon.tech e faça login
# 2. Crie projeto "teachflow"
# 3. Copie as connection strings
```

Atualize `.env.local`:
```env
DATABASE_URL="postgresql://user:password@host/db?pgbouncer=true&sslmode=require"
DIRECT_URL="postgresql://user:password@host/db?sslmode=require"
```

### 2. Gere o Secret (1 min)

```bash
openssl rand -base64 32
```

Adicione ao `.env.local`:
```env
NEXTAUTH_SECRET=cole-o-resultado-aqui
```

### 3. Migre o Banco (2 min)

```bash
npx prisma generate
npx prisma db push
```

### 4. Configure Google OAuth (2 min) - OPCIONAL

Se quiser habilitar login com Google, siga estas etapas:

1. Acesse o [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Crie um OAuth 2.0 Client ID
3. Adicione **Authorized redirect URIs**:
   ```
   http://localhost:3000/api/auth/callback/google
   ```
4. Copie Client ID e Client Secret para `.env.local`:
   ```env
   GOOGLE_CLIENT_ID=seu-client-id.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=seu-client-secret
   ```

💡 **Pule esta etapa** se não quiser OAuth agora. Você pode usar email/password para testes.

📖 **Guia completo**: [OAUTH_SETUP.md](./OAUTH_SETUP.md)

### 5. Instale dependências e rode o projeto (1 min)

```bash
# Instalar dependências
npm install

# Rodar em desenvolvimento
npm run dev
```

### 6. Teste!

Abra http://localhost:3000 no navegador.

**Opção 1: Criar conta com email/password**
- Acesse http://localhost:3000/register
- Preencha email, nome e senha
- Faça login!

**Opção 2: Login com Google** (se configurou OAuth)
- Acesse http://localhost:3000/login
- Clique em "Continuar com Google"
- Autorize e pronto!

---

## ✅ Checklist de Configuração

### Obrigatório:
- [ ] Neon configurado
- [ ] `DATABASE_URL` e `DIRECT_URL` no `.env.local`
- [ ] `NEXTAUTH_SECRET` gerado e configurado
- [ ] `NEXTAUTH_URL=http://localhost:3000` no `.env.local`
- [ ] Dependências instaladas (`npm install`)
- [ ] `npx prisma generate` executado
- [ ] `npx prisma db push` executado
- [ ] App rodando em http://localhost:3000
- [ ] Conseguiu criar conta e fazer login

### Opcional (Google OAuth):
- [ ] Google OAuth configurado no Google Cloud Console
- [ ] `GOOGLE_CLIENT_ID` e `GOOGLE_CLIENT_SECRET` no `.env.local`
- [ ] Redirect URI adicionada no Google Console
- [ ] Login com Google funcionando

---

## 🆘 Problemas Comuns

### ❌ "Can't connect to database"

**Solução**:
```bash
# 1. Verifique se DATABASE_URL e DIRECT_URL estão corretos no .env.local
# 2. Confirme que sslmode=require está presente nas URLs
# 3. Teste a conexão:
npx prisma studio
```

### ❌ "Invalid NEXTAUTH_SECRET" ou "no secret"

**Solução**:
```bash
# Gere um novo secret:
openssl rand -base64 32

# Adicione ao .env.local:
# NEXTAUTH_SECRET=cole-o-resultado-aqui

# Reinicie o servidor:
npm run dev
```

### ❌ "Prisma Client not generated"

**Solução**:
```bash
npx prisma generate
npm run dev
```

### ❌ "Google OAuth error" ou "redirect_uri_mismatch"

**Solução**:
```bash
# 1. Confirme a redirect URI no Google Console:
#    http://localhost:3000/api/auth/callback/google
# 2. Verifique se GOOGLE_CLIENT_ID e GOOGLE_CLIENT_SECRET estão corretos
# 3. Tente limpar os cookies do navegador
```

### ❌ Erro ao criar conta: "User already exists"

**Solução**:
- O email já está cadastrado. Tente fazer login ou use outro email.

### ❌ Página em branco após login

**Solução**:
```bash
# 1. Verifique o console do navegador (F12) para erros
# 2. Confirme que todas as migrações foram aplicadas:
npx prisma db push
# 3. Reinicie o servidor
```

---

## 📖 Documentação Completa

Agora que você tem o projeto rodando, explore a documentação completa:

- **[README.md](./README.md)** - Visão geral do projeto, Git Flow e estrutura
- **[OAUTH_SETUP.md](./OAUTH_SETUP.md)** - Guia completo de configuração do Google OAuth
- **[NEON_SETUP.md](./NEON_SETUP.md)** - Setup detalhado do Neon PostgreSQL
- **[MIGRATION_SUMMARY.md](./MIGRATION_SUMMARY.md)** - Histórico de migração Supabase → NextAuth

### Documentação Externa

- [NextAuth.js Docs](https://authjs.dev) - Documentação oficial do NextAuth
- [Neon Docs](https://neon.tech/docs) - Documentação oficial do Neon
- [Prisma Docs](https://www.prisma.io/docs) - Documentação oficial do Prisma
- [Next.js Docs](https://nextjs.org/docs) - Documentação oficial do Next.js

## 🚀 Próximos Passos

1. ✅ Explore o dashboard em http://localhost:3000/dashboard
2. ✅ Crie seu primeiro contratante
3. ✅ Adicione alunos
4. ✅ Agende aulas
5. ✅ Configure Google Calendar (opcional)

## 💡 Dicas

- Use o **Prisma Studio** para visualizar os dados: `npx prisma studio`
- Veja os logs no terminal para debugar problemas
- Mantenha o `.env.local` seguro e nunca faça commit dele
- Para produção, siga as instruções em [OAUTH_SETUP.md](./OAUTH_SETUP.md)

---

**Pronto para usar!** 🎉

Se tiver dúvidas ou problemas, consulte a [documentação completa](#-documentação-completa) ou abra uma issue no repositório.
