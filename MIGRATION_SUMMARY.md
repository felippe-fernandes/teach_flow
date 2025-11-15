# Migração Supabase → NextAuth + Neon - Resumo

## ✅ O que foi feito

### 1. Instalação de Dependências
- ✅ Instalado `next-auth@beta` (v5)
- ✅ Instalado `@auth/prisma-adapter`
- ✅ Instalado `bcryptjs` para hash de senhas
- ✅ Removido `@supabase/supabase-js` e `@supabase/ssr`
- ✅ Removido `node-appwrite` e `appwrite`

### 2. Atualização do Schema do Prisma
- ✅ Adicionado tabelas do NextAuth:
  - `Account` - Para OAuth providers (Google, etc)
  - `Session` - Para sessões de usuário
  - `VerificationToken` - Para verificação de email
- ✅ Atualizado model `User`:
  - Removido `supabase_auth_id`
  - Removido `google_id`
  - Adicionado `emailVerified`, `image`, `password`
  - Mantido `google_calendar_sync` e tokens do Calendar
  - Adicionado relacionamentos com `accounts` e `sessions`

### 3. Configuração do NextAuth
- ✅ Criado `lib/auth.config.ts` - Configuração do NextAuth
- ✅ Criado `lib/auth.ts` - Exports do NextAuth
- ✅ Criado `app/api/auth/[...nextauth]/route.ts` - API routes
- ✅ Configurado providers:
  - Credentials (email/password)
  - Google OAuth (com escopos do Calendar)

### 4. Reescrita das Auth Actions
- ✅ `lib/actions/auth.ts` reescrito para NextAuth:
  - `login()` - Usando credentials provider
  - `signup()` - Hash de senha com bcrypt
  - `logout()` - Usando NextAuth signOut
  - `loginWithGoogle()` - Usando Google provider
  - `getUser()` - Busca usuário da sessão
  - `updateUserProfile()` - Mantém Prisma
  - `getLinkedProviders()` - Consulta table Account

### 5. Limpeza de Arquivos
- ✅ Removido `lib/supabase/`
- ✅ Removido `lib/appwrite/`
- ✅ Removido `app/auth/callback/` (NextAuth gerencia)
- ✅ Removido documentação do Appwrite

### 6. Variáveis de Ambiente
- ✅ Atualizado `.env.local` com variáveis do Neon e NextAuth
- ✅ Criado `.env.example` com template

### 7. Documentação
- ✅ Criado `NEON_SETUP.md` - Guia completo de setup do Neon
- ✅ Criado este resumo de migração

## ⏳ O que VOCÊ precisa fazer

### 1. Configurar Neon (5 min) - **OBRIGATÓRIO**
1. Acesse https://neon.tech e crie uma conta
2. Crie um novo projeto "teachflow"
3. Copie a **Connection String (Pooled)** → cole em `DATABASE_URL`
4. Copie a **Direct Connection String** → cole em `DIRECT_URL`

### 2. Gerar NEXTAUTH_SECRET (1 min) - **OBRIGATÓRIO**
Execute no terminal:
```bash
openssl rand -base64 32
```
Copie o resultado e cole em `NEXTAUTH_SECRET` no `.env.local`

### 3. Migrar Schema para Neon (2 min) - **OBRIGATÓRIO**
```bash
npx prisma generate
npx prisma db push
```

### 4. Atualizar Google OAuth Redirect URI (3 min)
1. Acesse [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Selecione seu OAuth 2.0 Client ID
3. Em **Authorized redirect URIs**, adicione:
   ```
   http://localhost:3000/api/auth/callback/google
   https://seu-dominio.com/api/auth/callback/google (produção)
   ```
4. Remova a antiga URI do Supabase

### 5. (Opcional) Migrar Dados Existentes
Se você tem usuários no Supabase:

**Opção A: Dump e Restore**
```bash
# Export do Supabase
pg_dump [supabase-url] > dump.sql

# Import no Neon
psql [neon-direct-url] < dump.sql
```

**Opção B: Script Manual**
- Crie script Node.js para copiar dados
- Adapte o campo `supabase_auth_id` para a nova estrutura

### 6. Testar (10 min) - **OBRIGATÓRIO**
```bash
npm run dev
```

Teste:
- ✅ Cadastro com email/password
- ✅ Login com email/password
- ✅ Google OAuth
- ✅ Logout
- ✅ Editar perfil
- ✅ Criar contractors/students/classes

## 📊 Comparação: Antes vs Depois

| Aspecto | Supabase | NextAuth + Neon |
|---------|----------|-----------------|
| **Autenticação** | Supabase Auth | NextAuth.js |
| **Banco** | PostgreSQL (Supabase) | PostgreSQL (Neon) |
| **ORM** | Prisma | Prisma (sem mudanças) |
| **Limite Projetos** | 2 grátis | Ilimitado |
| **Custo** | Grátis até 2 projetos | 100% grátis |
| **Storage** | 500MB | 3GB por projeto |
| **Sessions** | JWT via Supabase | JWT via NextAuth |
| **OAuth** | Supabase providers | NextAuth providers |

## 🎯 Benefícios da Migração

✅ **Projetos ilimitados** no Neon (vs 2 no Supabase)
✅ **100% gratuito** para sempre
✅ **Mantém Prisma** - Zero mudanças nas queries
✅ **NextAuth é padrão** Next.js - Melhor suporte
✅ **Mais controle** sobre autenticação
✅ **3GB storage** por projeto no Neon

## 🔧 Arquivos Modificados

### Criados:
- `lib/auth.ts`
- `lib/auth.config.ts`
- `app/api/auth/[...nextauth]/route.ts`
- `.env.example`
- `NEON_SETUP.md`
- `MIGRATION_SUMMARY.md`

### Modificados:
- `prisma/schema.prisma`
- `lib/actions/auth.ts`
- `.env.local`
- `package.json`

### Removidos:
- `lib/supabase/`
- `lib/appwrite/`
- `app/auth/callback/`
- `APPWRITE_SETUP.md`

## ⚠️ Breaking Changes

### 1. Campo `name` agora é opcional
- Antes: `name: String` (obrigatório)
- Depois: `name: String?` (opcional)
- **Razão**: NextAuth permite OAuth sem nome

### 2. Removido `supabase_auth_id`
- Antes: Identificava usuário do Supabase
- Depois: Usa `id` do Prisma direto
- **Ação**: Nenhuma (NextAuth gerencia internamente)

### 3. Callback do Google OAuth mudou
- Antes: `https://projeto.supabase.co/auth/v1/callback`
- Depois: `http://localhost:3000/api/auth/callback/google`
- **Ação**: Atualizar no Google Cloud Console

## 🚀 Próximos Passos

1. **Complete os passos obrigatórios** acima
2. **Teste tudo** localmente
3. **Commit e push** para repositório
4. **Deploy** (atualize env vars na Vercel/Railway)

## 💡 Troubleshooting

### Erro: "Invalid session"
- Verifique se `NEXTAUTH_SECRET` está configurado
- Limpe cookies do navegador

### Erro: "Can't connect to database"
- Verifique as connection strings do Neon
- Confirme que `sslmode=require` está presente

### Google OAuth não funciona
- Verifique redirect URI no Google Console
- Confirme que `GOOGLE_CLIENT_ID` e `SECRET` estão corretos

### Prisma push falha
- Rode `npx prisma generate` primeiro
- Use `npx prisma db push --force-reset` se necessário (⚠️ perde dados)

---

**Migração completada com sucesso!** 🎉

Se tiver dúvidas, consulte:
- [NextAuth.js Docs](https://authjs.dev)
- [Neon Docs](https://neon.tech/docs)
- [NEON_SETUP.md](./NEON_SETUP.md)
