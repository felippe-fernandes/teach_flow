# TeachFlow - Plataforma de Gestão para Professores Autônomos

> **Idiomas**: [English](./README.md) | **Português (Brasil)**

## Visão Geral

TeachFlow é uma plataforma web robusta e intuitiva para professores autônomos, permitindo gerenciar de forma centralizada e eficiente aulas, alunos, contratantes e finanças.

## Stack Tecnológica

- **Frontend**: Next.js 16 (App Router), React
- **Styling**: Tailwind CSS v4, Shadcn UI
- **Backend**: Next.js Server Actions
- **Database**: PostgreSQL (Neon)
- **ORM**: Prisma
- **Authentication**: NextAuth.js v5 (com suporte a Google OAuth e Credentials)

## Git Flow - Estratégia de Branching

Este projeto utiliza o Git Flow para organização do desenvolvimento:

### Branches Principais

- **main**: Branch de produção. Contém apenas código estável e em produção.
- **develop**: Branch de desenvolvimento. Base para novas features e integrações.
- **release/vX.X.X**: Branches de release. Preparação para uma nova versão de produção.

### Branches de Suporte

- **feature/nome-da-feature**: Para desenvolvimento de novas funcionalidades (criadas a partir de `develop`)
- **bugfix/nome-do-bug**: Para correções de bugs no desenvolvimento (criadas a partir de `develop`)
- **hotfix/nome-do-hotfix**: Para correções urgentes em produção (criadas a partir de `main`)

### Workflow

1. **Desenvolver Feature**:
   ```bash
   git checkout develop
   git checkout -b feature/nome-da-feature
   # Desenvolver...
   git commit -m "feat: descrição da feature"
   git checkout develop
   git merge feature/nome-da-feature
   ```

2. **Preparar Release**:
   ```bash
   git checkout develop
   git checkout -b release/v1.0.0
   # Ajustes finais, testes, bump version...
   git commit -m "chore: prepare release v1.0.0"
   git checkout main
   git merge release/v1.0.0
   git tag v1.0.0
   git checkout develop
   git merge release/v1.0.0
   ```

3. **Hotfix de Produção**:
   ```bash
   git checkout main
   git checkout -b hotfix/nome-do-hotfix
   # Corrigir bug crítico...
   git commit -m "fix: descrição do hotfix"
   git checkout main
   git merge hotfix/nome-do-hotfix
   git tag v1.0.1
   git checkout develop
   git merge hotfix/nome-do-hotfix
   ```

## Estrutura do Projeto

```
teach_flow/
├── app/                  # Next.js App Router
├── components/           # Componentes React
├── lib/                  # Utilitários e helpers
├── prisma/              # Schema do Prisma
├── public/              # Assets estáticos
└── styles/              # Estilos globais
```

## Módulos Principais (MVP)

1. **Autenticação e Perfil do Usuário**
2. **Dashboard Centralizado**
3. **Gestão de Contratantes**
4. **Gestão de Alunos (Mini-CRM)**
5. **Gestão de Aulas e Calendário**
6. **Gestão Financeira**

## Como Começar

### Início Rápido

Para começar rapidamente, siga o **[Guia de Início Rápido](./QUICK_START.PT.md)** (10 minutos).

### Setup Detalhado

```bash
# 1. Instalar dependências
npm install

# 2. Configurar variáveis de ambiente
cp .env.example .env.local
# Edite .env.local com suas credenciais (ver seção Configuração abaixo)

# 3. Gerar NEXTAUTH_SECRET
openssl rand -base64 32
# Cole o resultado em NEXTAUTH_SECRET no .env.local

# 4. Executar migrações do Prisma
npx prisma generate
npx prisma db push

# 5. Iniciar servidor de desenvolvimento
npm run dev
```

### Configuração

Você precisará configurar:

1. **Neon PostgreSQL** - [Guia de Setup](./NEON_SETUP.PT.md)
   - Crie um projeto gratuito no Neon
   - Copie as connection strings para `DATABASE_URL` e `DIRECT_URL`

2. **Google OAuth** (opcional) - [Guia de Setup](./OAUTH_SETUP.PT.md)
   - Configure o Google Cloud Console
   - Adicione `GOOGLE_CLIENT_ID` e `GOOGLE_CLIENT_SECRET`

3. **NextAuth** - [Documentação Oficial](https://authjs.dev)
   - Gere `NEXTAUTH_SECRET` conforme indicado acima

## Credenciais de Teste

Para recrutadores e avaliadores explorarem a plataforma:

- **Email**: teste@teste.com
- **Senha**: 12345678

Este é um usuário de teste com dados de exemplo para demonstrar as funcionalidades da plataforma.

## Documentação

### Português (Brasil)
- **[QUICK_START.PT.md](./QUICK_START.PT.md)** - Comece aqui! Guia rápido de 10 minutos
- **[NEON_SETUP.PT.md](./NEON_SETUP.PT.md)** - Setup detalhado do banco de dados Neon
- **[OAUTH_SETUP.PT.md](./OAUTH_SETUP.PT.md)** - Configuração do Google OAuth
- **[MIGRATION_SUMMARY.md](./MIGRATION_SUMMARY.md)** - Histórico de migração Supabase → NextAuth

### English
- **[QUICK_START.md](./QUICK_START.md)** - Quick start guide (10 minutes)
- **[NEON_SETUP.md](./NEON_SETUP.md)** - Neon database setup guide
- **[OAUTH_SETUP.md](./OAUTH_SETUP.md)** - Google OAuth configuration
