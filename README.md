# TeachFlow - Plataforma de Gestão para Professores Autônomos

## Visão Geral

TeachFlow é uma plataforma web robusta e intuitiva para professores autônomos, permitindo gerenciar de forma centralizada e eficiente aulas, alunos, contratantes e finanças.

## Stack Tecnológica

- **Frontend**: Next.js 16 (App Router), React
- **Styling**: Tailwind CSS v4, Shadcn UI
- **Backend**: Next.js Server Actions, Supabase
- **Database**: PostgreSQL (Supabase)
- **ORM**: Prisma
- **Authentication**: Supabase Auth (com suporte a 2FA)

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

```bash
# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env.local

# Executar migrações do Prisma
npx prisma migrate dev

# Iniciar servidor de desenvolvimento
npm run dev
```

## Licença

[A ser definida]
