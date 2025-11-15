# Neon PostgreSQL Setup Guide

> **Languages**: **English** | [Português (Brasil)](./NEON_SETUP.PT.md)

## Step 1: Create Neon Account

1. Visit [https://neon.tech](https://neon.tech)
2. Click on **Sign Up**
3. Sign in with GitHub, Google, or email

## Step 2: Create New Project

1. In the Neon dashboard, click on **Create Project**
2. Configure:
   - **Project name**: teachflow
   - **Region**: Choose the closest one (e.g., US East, EU West)
   - **PostgreSQL version**: 16 (recommended)
3. Click on **Create Project**

## Step 3: Copy Connection Strings

After creating the project, you will see the connection page. Copy both strings:

### Connection String (Pooled)
```
postgresql://[user]:[password]@[host]/[database]?sslmode=require&pgbouncer=true
```
This will be used for `DATABASE_URL`

### Direct Connection String
```
postgresql://[user]:[password]@[host]/[database]?sslmode=require
```
This will be used for `DIRECT_URL`

## Step 4: Update `.env.local`

Replace the Supabase variables with Neon ones:

```env
# Neon PostgreSQL
DATABASE_URL="your-pooled-connection-string-here"
DIRECT_URL="your-direct-connection-string-here"

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=generate-a-random-secret-here

# Google OAuth (keep the same values)
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Step 5: Generate NEXTAUTH_SECRET

Run in terminal:

```bash
openssl rand -base64 32
```

Copy the result and paste it in `NEXTAUTH_SECRET`

Or use:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## Step 6: Migrate Schema to Neon

Run the commands:

```bash
npx prisma generate
npx prisma db push
```

This will create all tables in Neon, including the NextAuth ones.

## Step 7: (Optional) Migrate Existing Data

If you have data in Supabase that you want to migrate:

### Option 1: Dump and Restore (Recommended)

```bash
# Export from Supabase
pg_dump postgres://[supabase-url] > dump.sql

# Import to Neon
psql postgres://[neon-direct-url] < dump.sql
```

### Option 2: Manual Script

Create a Node.js script to copy data table by table.

## Verification

Test the connection:

```bash
npx prisma studio
```

This will open a visual interface to view your tables in Neon.

## Free Plan Limits

✅ **Unlimited projects**
✅ 3 GB storage per project
✅ 100 compute hours per month
✅ Unlimited data retention

## Troubleshooting

### Error: "Can't reach database server"
- Check if the connection string is correct
- Confirm that `sslmode=require` is present
- Try using the Direct URL temporarily

### Error: "Too many connections"
- Use the Pooled connection string (`DATABASE_URL`)
- Don't use Direct URL for normal queries

### Migration fails
- Run `npx prisma generate` first
- Use `npx prisma db push` instead of `migrate dev` initially
- After confirming it works, create migrations: `npx prisma migrate dev`

---

Done! Your PostgreSQL database on Neon is configured. 🎉
