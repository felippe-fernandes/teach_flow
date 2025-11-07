# Guia de Deploy - TeachFlow

Este guia contém instruções passo a passo para fazer o deploy da aplicação TeachFlow em produção usando Vercel e Supabase.

## Pré-requisitos

- Conta no [Vercel](https://vercel.com)
- Projeto Supabase já configurado
- Código commitado no GitHub (branch `main` ou `develop`)

## Passo 1: Preparar o Projeto Supabase

### 1.1 Aplicar Row Level Security (RLS)

1. Acesse seu projeto no [Supabase Dashboard](https://supabase.com/dashboard)
2. Vá em **SQL Editor** no menu lateral
3. Crie uma nova query e cole o conteúdo do arquivo `prisma/rls-policies.sql`
4. Execute a query para aplicar as políticas de segurança
5. Verifique se as políticas foram criadas em **Authentication > Policies**

### 1.2 Verificar Configurações de Autenticação

1. Vá em **Authentication > Settings**
2. Configure o **Site URL** para sua URL de produção (ex: `https://teachflow.vercel.app`)
3. Em **Redirect URLs**, adicione:
   - `https://seu-dominio.vercel.app/auth/callback`
   - `https://seu-dominio.vercel.app/auth/login`
4. Configure o **JWT Expiry** (recomendado: 3600 segundos = 1 hora)
5. Habilite **Enable email confirmations** se desejar

### 1.3 Anotar Credenciais

Anote as seguintes informações (disponíveis em **Project Settings > API**):

- `Project URL`: Seu `NEXT_PUBLIC_SUPABASE_URL`
- `Project API keys > anon public`: Seu `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `Project Settings > Database > Connection string > URI`: Seu `DATABASE_URL`

## Passo 2: Preparar Variáveis de Ambiente

### 2.1 Criar arquivo .env.production.local (local)

Crie um arquivo `.env.production.local` na raiz do projeto com:

```env
# Database
DATABASE_URL="postgresql://postgres.xxxxx:senha@aws-0-us-east-1.pooler.supabase.com:6543/postgres"

# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://xxxxx.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Importante**: Adicione `.env.production.local` no `.gitignore` (já está configurado)

### 2.2 Testar Build Local

Execute antes de fazer deploy:

```bash
npm run build
```

Se houver erros, corrija antes de continuar.

## Passo 3: Deploy no Vercel

### 3.1 Conectar Repositório

1. Acesse [Vercel Dashboard](https://vercel.com/dashboard)
2. Clique em **Add New... > Project**
3. Importe seu repositório GitHub `teach_flow`
4. Selecione a branch `main` (ou `develop` se preferir)

### 3.2 Configurar Projeto

1. **Framework Preset**: Next.js (detectado automaticamente)
2. **Root Directory**: `./` (padrão)
3. **Build Command**: `npm run build` (padrão)
4. **Output Directory**: `.next` (padrão)

### 3.3 Configurar Environment Variables

Na seção **Environment Variables**, adicione:

| Name | Value |
|------|-------|
| `DATABASE_URL` | `postgresql://postgres.xxxxx:senha@aws-0-us-east-1.pooler.supabase.com:6543/postgres` |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xxxxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |

**Importante**:
- Marque todas as variáveis para os ambientes: **Production**, **Preview**, e **Development**
- Use suas credenciais reais do Supabase

### 3.4 Deploy

1. Clique em **Deploy**
2. Aguarde o build completar (2-5 minutos)
3. Acesse a URL gerada (ex: `https://teach-flow.vercel.app`)

## Passo 4: Executar Migrações no Banco de Produção

### 4.1 Gerar Cliente Prisma

Após o primeiro deploy, execute localmente:

```bash
npx prisma generate
```

### 4.2 Aplicar Schema

Como já executamos `prisma db push` anteriormente e as tabelas existem, você pode:

**Opção A**: Usar o Supabase SQL Editor
1. Vá em **SQL Editor**
2. Verifique se as tabelas `User`, `Contractor`, `Student`, `Class`, `Payment` existem
3. Se não existirem, execute o schema do Prisma manualmente

**Opção B**: Push via CLI (recomendado)
```bash
npx prisma db push
```

## Passo 5: Configurações Pós-Deploy

### 5.1 Atualizar URLs no Supabase

1. Volte ao Supabase Dashboard
2. **Authentication > URL Configuration**
3. Atualize **Site URL** para sua URL do Vercel: `https://teach-flow.vercel.app`
4. Adicione em **Redirect URLs**:
   - `https://teach-flow.vercel.app/auth/callback`
   - `https://teach-flow.vercel.app/auth/login`
   - `https://teach-flow.vercel.app/*` (wildcard para desenvolvimento)

### 5.2 Configurar Domínio Customizado (Opcional)

1. No Vercel Dashboard, vá em **Settings > Domains**
2. Adicione seu domínio (ex: `teachflow.com`)
3. Configure os DNS records conforme instruções do Vercel
4. Aguarde propagação (pode levar até 48h)
5. Atualize as URLs no Supabase novamente com o domínio customizado

### 5.3 Habilitar HTTPS e Security Headers

O Vercel já fornece HTTPS automaticamente. Verifique se está ativo:

1. Acesse seu site via `https://`
2. Verifique o certificado SSL no navegador

## Passo 6: Testar Aplicação em Produção

### 6.1 Testar Fluxo de Autenticação

1. Acesse `https://seu-dominio.vercel.app/auth/register`
2. Crie uma nova conta
3. Faça login em `https://seu-dominio.vercel.app/auth/login`
4. Verifique se é redirecionado para `/dashboard`

### 6.2 Testar Funcionalidades

- [ ] Criar um contractor
- [ ] Criar um student
- [ ] Agendar uma class
- [ ] Completar uma class (verifica se payment é criado)
- [ ] Visualizar relatório financeiro
- [ ] Logout e login novamente

### 6.3 Verificar Segurança

- [ ] Tente acessar `/dashboard` sem estar logado (deve redirecionar para login)
- [ ] Verifique se os dados são isolados por usuário (crie 2 contas diferentes)
- [ ] Teste se RLS está funcionando (usuário não deve ver dados de outros)

## Passo 7: Monitoramento e Logs

### 7.1 Vercel Analytics

1. No Vercel Dashboard, ative **Analytics**
2. Monitore performance e erros em tempo real

### 7.2 Logs de Erro

1. Vá em **Deployments > Functions**
2. Clique em qualquer função para ver logs
3. Identifique erros de runtime

### 7.3 Supabase Logs

1. No Supabase, vá em **Logs > Explorer**
2. Monitore queries lentas e erros de autenticação

## Checklist Final de Deploy

- [ ] RLS policies aplicadas no Supabase
- [ ] URLs de callback configuradas no Supabase
- [ ] Variáveis de ambiente configuradas no Vercel
- [ ] Build local executado com sucesso
- [ ] Deploy no Vercel completado
- [ ] Schema do banco aplicado
- [ ] Domínio configurado (se aplicável)
- [ ] Testes de autenticação passando
- [ ] Testes de CRUD passando
- [ ] Verificação de segurança (RLS) funcionando
- [ ] Logs de erro monitorados

## Troubleshooting

### Build Falhou no Vercel

**Erro**: `Module not found` ou `Type errors`

**Solução**:
```bash
# Limpe cache local
rm -rf .next node_modules
npm install
npm run build
```

### Erro de Autenticação

**Erro**: `Invalid authentication credentials`

**Solução**:
1. Verifique se `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` estão corretos
2. Confirme que as URLs de callback estão configuradas no Supabase
3. Limpe cookies do navegador

### Erro de Conexão ao Banco

**Erro**: `Can't reach database server`

**Solução**:
1. Verifique se `DATABASE_URL` está correto
2. Use a **connection pooler URL** (porta 6543) no Vercel
3. Confirme que o Supabase está ativo (não pausado)

### RLS Bloqueando Operações

**Erro**: `new row violates row-level security policy`

**Solução**:
1. Verifique se executou o arquivo `prisma/rls-policies.sql`
2. Confirme que `user_id` está sendo passado em todas as queries
3. Teste com `auth.uid()` no SQL Editor

## Comandos Úteis

```bash
# Rodar build local
npm run build

# Rodar em modo produção local
npm run start

# Gerar cliente Prisma
npx prisma generate

# Push schema para banco
npx prisma db push

# Ver logs do Vercel (requer Vercel CLI)
vercel logs
```

## Próximos Passos

1. Configure backup automático do banco no Supabase
2. Implemente monitoramento de uptime (ex: UptimeRobot)
3. Configure CI/CD para testes automáticos antes do deploy
4. Adicione Sentry ou similar para tracking de erros
5. Configure rate limiting para APIs sensíveis

## Suporte

Se encontrar problemas:
1. Verifique os logs no Vercel Dashboard
2. Consulte a [documentação do Next.js](https://nextjs.org/docs)
3. Consulte a [documentação do Supabase](https://supabase.com/docs)
4. Verifique os [logs do GitHub Actions](https://github.com) se tiver CI/CD
