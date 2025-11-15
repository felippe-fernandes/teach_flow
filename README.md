# TeachFlow - Management Platform for Freelance Teachers

> **Languages**: **English** | [Português (Brasil)](./README.PT.md)

## Overview

TeachFlow is a robust and intuitive web platform for freelance teachers, allowing you to manage classes, students, contractors, and finances in a centralized and efficient way.

## Tech Stack

- **Frontend**: Next.js 16 (App Router), React
- **Styling**: Tailwind CSS v4, Shadcn UI
- **Backend**: Next.js Server Actions
- **Database**: PostgreSQL (Neon)
- **ORM**: Prisma
- **Authentication**: NextAuth.js v5 (with Google OAuth and Credentials support)

## Git Flow - Branching Strategy

This project uses Git Flow for development organization:

### Main Branches

- **main**: Production branch. Contains only stable code in production.
- **develop**: Development branch. Base for new features and integrations.
- **release/vX.X.X**: Release branches. Preparation for a new production version.

### Support Branches

- **feature/feature-name**: For developing new functionalities (created from `develop`)
- **bugfix/bug-name**: For bug fixes in development (created from `develop`)
- **hotfix/hotfix-name**: For urgent production fixes (created from `main`)

### Workflow

1. **Develop Feature**:
   ```bash
   git checkout develop
   git checkout -b feature/feature-name
   # Develop...
   git commit -m "feat: feature description"
   git checkout develop
   git merge feature/feature-name
   ```

2. **Prepare Release**:
   ```bash
   git checkout develop
   git checkout -b release/v1.0.0
   # Final adjustments, tests, bump version...
   git commit -m "chore: prepare release v1.0.0"
   git checkout main
   git merge release/v1.0.0
   git tag v1.0.0
   git checkout develop
   git merge release/v1.0.0
   ```

3. **Production Hotfix**:
   ```bash
   git checkout main
   git checkout -b hotfix/hotfix-name
   # Fix critical bug...
   git commit -m "fix: hotfix description"
   git checkout main
   git merge hotfix/hotfix-name
   git tag v1.0.1
   git checkout develop
   git merge hotfix/hotfix-name
   ```

## Project Structure

```
teach_flow/
├── app/                  # Next.js App Router
├── components/           # React Components
├── lib/                  # Utilities and helpers
├── prisma/              # Prisma Schema
├── public/              # Static assets
└── styles/              # Global styles
```

## Main Modules (MVP)

1. **Authentication and User Profile**
2. **Centralized Dashboard**
3. **Contractor Management**
4. **Student Management (Mini-CRM)**
5. **Class and Calendar Management**
6. **Financial Management**

## Getting Started

### Quick Start

To get started quickly, follow the **[Quick Start Guide](./QUICK_START.md)** (10 minutes).

### Detailed Setup

```bash
# 1. Install dependencies
npm install

# 2. Configure environment variables
cp .env.example .env.local
# Edit .env.local with your credentials (see Configuration section below)

# 3. Generate NEXTAUTH_SECRET
openssl rand -base64 32
# Paste the result in NEXTAUTH_SECRET in .env.local

# 4. Run Prisma migrations
npx prisma generate
npx prisma db push

# 5. Start development server
npm run dev
```

### Configuration

You will need to configure:

1. **Neon PostgreSQL** - [Setup Guide](./NEON_SETUP.md)
   - Create a free project on Neon
   - Copy the connection strings to `DATABASE_URL` and `DIRECT_URL`

2. **Google OAuth** (optional) - [Setup Guide](./OAUTH_SETUP.md)
   - Configure Google Cloud Console
   - Add `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`

3. **NextAuth** - [Official Documentation](https://authjs.dev)
   - Generate `NEXTAUTH_SECRET` as indicated above

## Documentation

### English
- **[QUICK_START.md](./QUICK_START.md)** - Start here! Quick 10-minute guide
- **[NEON_SETUP.md](./NEON_SETUP.md)** - Detailed Neon database setup
- **[OAUTH_SETUP.md](./OAUTH_SETUP.md)** - Google OAuth configuration
- **[MIGRATION_SUMMARY.md](./MIGRATION_SUMMARY.md)** - Supabase → NextAuth migration history

### Português (Brasil)
- **[QUICK_START.PT.md](./QUICK_START.PT.md)** - Comece aqui! Guia rápido de 10 minutos
- **[NEON_SETUP.PT.md](./NEON_SETUP.PT.md)** - Setup detalhado do banco de dados Neon
- **[OAUTH_SETUP.PT.md](./OAUTH_SETUP.PT.md)** - Configuração do Google OAuth

## License

[To be defined]
