# 🚀 Quick Start - NextAuth + Neon

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

### 4. Atualize Google OAuth (2 min)

No [Google Cloud Console](https://console.cloud.google.com/apis/credentials):

**Authorized redirect URIs:**
```
http://localhost:3000/api/auth/callback/google
```

### 5. Teste! (1 min)

```bash
npm run dev
```

Abra http://localhost:3000/register e crie uma conta!

---

## ✅ Checklist

- [ ] Neon configurado
- [ ] DATABASE_URL e DIRECT_URL no .env.local
- [ ] NEXTAUTH_SECRET gerado e configurado
- [ ] `prisma db push` executado
- [ ] Google redirect URI atualizada
- [ ] App rodando em http://localhost:3000
- [ ] Conseguiu criar conta e fazer login

---

## 🆘 Problemas?

### "Can't connect to database"
```bash
# Verifique as connection strings
# Confirme que sslmode=require está presente
```

### "Invalid NEXTAUTH_SECRET"
```bash
# Gere novamente:
openssl rand -base64 32
```

### "Google OAuth error"
```bash
# Confirme a redirect URI no Google Console:
# http://localhost:3000/api/auth/callback/google
```

---

## 📖 Documentação Completa

- [MIGRATION_SUMMARY.md](./MIGRATION_SUMMARY.md) - Resumo da migração
- [NEON_SETUP.md](./NEON_SETUP.md) - Setup detalhado do Neon
- [NextAuth Docs](https://authjs.dev) - Documentação oficial
- [Neon Docs](https://neon.tech/docs) - Documentação oficial

---

**Pronto para usar!** 🎉
