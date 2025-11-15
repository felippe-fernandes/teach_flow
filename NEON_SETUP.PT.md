# Neon PostgreSQL Setup Guide

> **Idiomas**: [English](./NEON_SETUP.md) | **Português (Brasil)**

## Passo 1: Criar Conta no Neon

1. Acesse [https://neon.tech](https://neon.tech)
2. Clique em **Sign Up**
3. Faça login com GitHub, Google ou email

## Passo 2: Criar Novo Projeto

1. No dashboard do Neon, clique em **Create Project**
2. Configure:
   - **Project name**: teachflow
   - **Region**: Escolha o mais próximo (ex: US East, EU West)
   - **PostgreSQL version**: 16 (recomendado)
3. Clique em **Create Project**

## Passo 3: Copiar Connection Strings

Após criar o projeto, você verá a página de conexão. Copie ambas as strings:

### Connection String (Pooled)
```
postgresql://[user]:[password]@[host]/[database]?sslmode=require&pgbouncer=true
```
Esta será usada para `DATABASE_URL`

### Direct Connection String
```
postgresql://[user]:[password]@[host]/[database]?sslmode=require
```
Esta será usada para `DIRECT_URL`

## Passo 4: Atualizar `.env.local`

Substitua as variáveis do Supabase pelas do Neon:

```env
# Neon PostgreSQL
DATABASE_URL="sua-connection-string-pooled-aqui"
DIRECT_URL="sua-direct-connection-string-aqui"

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=gere-um-secret-aleatorio-aqui

# Google OAuth (mantenha os mesmos valores)
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Passo 5: Gerar NEXTAUTH_SECRET

Execute no terminal:

```bash
openssl rand -base64 32
```

Copie o resultado e cole em `NEXTAUTH_SECRET`

Ou use:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## Passo 6: Migrar Schema para Neon

Execute os comandos:

```bash
npx prisma generate
npx prisma db push
```

Isso criará todas as tabelas no Neon, incluindo as do NextAuth.

## Passo 7: (Opcional) Migrar Dados Existentes

Se você tem dados no Supabase que quer migrar:

### Opção 1: Dump e Restore (Recomendado)

```bash
# Export do Supabase
pg_dump postgres://[supabase-url] > dump.sql

# Import no Neon
psql postgres://[neon-direct-url] < dump.sql
```

### Opção 2: Script Manual

Crie um script Node.js para copiar dados table por table.

## Verificação

Teste a conexão:

```bash
npx prisma studio
```

Isso abrirá uma interface visual para ver suas tabelas no Neon.

## Limites do Plano Gratuito

✅ **Projetos ilimitados**
✅ 3 GB de armazenamento por projeto
✅ 100 horas de compute por mês
✅ Reten

ção de dados ilimitada

## Troubleshooting

### Erro: "Can't reach database server"
- Verifique se a connection string está correta
- Confirme que `sslmode=require` está presente
- Tente usar a Direct URL temporariamente

### Erro: "Too many connections"
- Use a Pooled connection string (`DATABASE_URL`)
- Não use Direct URL para queries normais

### Migration falha
- Rode `npx prisma generate` primeiro
- Use `npx prisma db push` em vez de `migrate dev` inicialmente
- Depois de confirmar que funciona, crie migrations: `npx prisma migrate dev`

---

Pronto! Seu banco PostgreSQL no Neon está configurado. 🎉
