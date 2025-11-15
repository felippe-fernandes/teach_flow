# 🚀 Quick Start - NextAuth + Neon

> **Languages**: **English** | [Português (Brasil)](./QUICK_START.PT.md)

This guide will help you set up and run TeachFlow locally in **10 minutes**.

## 📋 Prerequisites

- Node.js 18+ installed
- npm or yarn
- [Neon](https://neon.tech) account (free)
- (Optional) Google Cloud account for OAuth

## ⚡ Quick Setup (10 minutes)

### 1. Set up Neon (5 min)

```bash
# 1. Go to https://neon.tech and log in
# 2. Create project "teachflow"
# 3. Copy the connection strings
```

Update `.env.local`:
```env
DATABASE_URL="postgresql://user:password@host/db?pgbouncer=true&sslmode=require"
DIRECT_URL="postgresql://user:password@host/db?sslmode=require"
```

### 2. Generate the Secret (1 min)

```bash
openssl rand -base64 32
```

Add to `.env.local`:
```env
NEXTAUTH_SECRET=paste-the-result-here
```

### 3. Migrate the Database (2 min)

```bash
npx prisma generate
npx prisma db push
```

### 4. Set up Google OAuth (2 min) - OPTIONAL

If you want to enable Google login, follow these steps:

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Create an OAuth 2.0 Client ID
3. Add **Authorized redirect URIs**:
   ```
   http://localhost:3000/api/auth/callback/google
   ```
4. Copy Client ID and Client Secret to `.env.local`:
   ```env
   GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=your-client-secret
   ```

💡 **Skip this step** if you don't want OAuth now. You can use email/password for testing.

📖 **Complete guide**: [OAUTH_SETUP.md](./OAUTH_SETUP.md)

### 5. Install dependencies and run the project (1 min)

```bash
# Install dependencies
npm install

# Run in development
npm run dev
```

### 6. Test!

Open http://localhost:3000 in your browser.

**Option 1: Create account with email/password**
- Go to http://localhost:3000/register
- Fill in email, name and password
- Log in!

**Option 2: Login with Google** (if you set up OAuth)
- Go to http://localhost:3000/login
- Click "Continue with Google"
- Authorize and you're done!

---

## ✅ Setup Checklist

### Required:
- [ ] Neon configured
- [ ] `DATABASE_URL` and `DIRECT_URL` in `.env.local`
- [ ] `NEXTAUTH_SECRET` generated and configured
- [ ] `NEXTAUTH_URL=http://localhost:3000` in `.env.local`
- [ ] Dependencies installed (`npm install`)
- [ ] `npx prisma generate` executed
- [ ] `npx prisma db push` executed
- [ ] App running at http://localhost:3000
- [ ] Successfully created account and logged in

### Optional (Google OAuth):
- [ ] Google OAuth configured in Google Cloud Console
- [ ] `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` in `.env.local`
- [ ] Redirect URI added in Google Console
- [ ] Google login working

---

## 🆘 Common Problems

### ❌ "Can't connect to database"

**Solution**:
```bash
# 1. Check if DATABASE_URL and DIRECT_URL are correct in .env.local
# 2. Confirm that sslmode=require is present in the URLs
# 3. Test the connection:
npx prisma studio
```

### ❌ "Invalid NEXTAUTH_SECRET" or "no secret"

**Solution**:
```bash
# Generate a new secret:
openssl rand -base64 32

# Add to .env.local:
# NEXTAUTH_SECRET=paste-the-result-here

# Restart the server:
npm run dev
```

### ❌ "Prisma Client not generated"

**Solution**:
```bash
npx prisma generate
npm run dev
```

### ❌ "Google OAuth error" or "redirect_uri_mismatch"

**Solution**:
```bash
# 1. Confirm the redirect URI in Google Console:
#    http://localhost:3000/api/auth/callback/google
# 2. Check if GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET are correct
# 3. Try clearing browser cookies
```

### ❌ Error when creating account: "User already exists"

**Solution**:
- The email is already registered. Try logging in or use another email.

### ❌ Blank page after login

**Solution**:
```bash
# 1. Check the browser console (F12) for errors
# 2. Confirm that all migrations were applied:
npx prisma db push
# 3. Restart the server
```

---

## 📖 Complete Documentation

Now that you have the project running, explore the complete documentation:

- **[README.md](./README.md)** - Project overview, Git Flow and structure
- **[OAUTH_SETUP.md](./OAUTH_SETUP.md)** - Complete Google OAuth setup guide
- **[NEON_SETUP.md](./NEON_SETUP.md)** - Detailed Neon PostgreSQL setup
- **[MIGRATION_SUMMARY.md](./MIGRATION_SUMMARY.md)** - Supabase → NextAuth migration history

### External Documentation

- [NextAuth.js Docs](https://authjs.dev) - Official NextAuth documentation
- [Neon Docs](https://neon.tech/docs) - Official Neon documentation
- [Prisma Docs](https://www.prisma.io/docs) - Official Prisma documentation
- [Next.js Docs](https://nextjs.org/docs) - Official Next.js documentation

## 🚀 Next Steps

1. ✅ Explore the dashboard at http://localhost:3000/dashboard
2. ✅ Create your first contractor
3. ✅ Add students
4. ✅ Schedule classes
5. ✅ Set up Google Calendar (optional)

## 💡 Tips

- Use **Prisma Studio** to visualize data: `npx prisma studio`
- Check the terminal logs to debug issues
- Keep `.env.local` secure and never commit it
- For production, follow the instructions in [OAUTH_SETUP.md](./OAUTH_SETUP.md)

---

**Ready to use!** 🎉

If you have questions or problems, consult the [complete documentation](#-complete-documentation) or open an issue in the repository.
