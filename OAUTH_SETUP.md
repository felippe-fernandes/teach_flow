# OAuth Setup Guide - Google Sign In

> **Languages**: **English** | [Português (Brasil)](./OAUTH_SETUP.PT.md)

This guide explains how to set up Google Sign In for TeachFlow using NextAuth.js.

## Implementation Status

✅ **Code implemented** - Google OAuth is fully implemented in the application code using NextAuth.js v5.

⚠️ **Configuration required** - You need to configure Google OAuth in the Google Cloud Console and add the credentials to `.env.local`.

---

## 🔵 Google OAuth Configuration

### 1. Google Cloud Console Setup

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth 2.0 Client ID**

### 2. Configure OAuth Consent Screen

If you haven't configured the consent screen yet:

1. Click **Configure Consent Screen**
2. Choose the type:
   - **External**: For any user with a Google account (recommended for production)
   - **Internal**: Only for users in your Google Workspace
3. Fill in the required information:
   - **App name**: TeachFlow
   - **User support email**: your email
   - **Developer contact email**: your email
4. In **Scopes**, add:
   - `email`
   - `profile`
   - `openid`
   - `https://www.googleapis.com/auth/calendar` (for Google Calendar integration)
   - `https://www.googleapis.com/auth/calendar.events` (for Calendar events)
5. Click **Save and Continue**
6. Add test users (if in testing mode)
7. Click **Save and Continue** until finished

### 3. Create OAuth 2.0 Client ID

1. Return to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
2. Configure:
   - **Application type**: Web application
   - **Name**: TeachFlow Web

3. **Authorized JavaScript origins**:
   ```
   http://localhost:3000
   https://your-domain.com
   https://your-app.vercel.app
   ```

4. **Authorized redirect URIs**:
   ```
   http://localhost:3000/api/auth/callback/google
   https://your-domain.com/api/auth/callback/google
   https://your-app.vercel.app/api/auth/callback/google
   ```

   💡 **Important**: With NextAuth, the redirect URI is always `[APP_URL]/api/auth/callback/google`

5. Click **Create**
6. **IMPORTANT**: Copy the generated **Client ID** and **Client Secret**

### 4. Environment Variables

Add to your `.env.local`:

```env
# NextAuth
NEXTAUTH_URL=http://localhost:3000  # development
# NEXTAUTH_URL=https://your-domain.com  # production
NEXTAUTH_SECRET=generate-a-random-secret-here

# Google OAuth
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000  # development
# NEXT_PUBLIC_APP_URL=https://your-domain.com  # production
```

### 5. Generate NEXTAUTH_SECRET

Run in your terminal:

```bash
openssl rand -base64 32
```

Copy the result and paste it in `NEXTAUTH_SECRET`.

### 6. Test in Development

1. Start your application:
   ```bash
   npm run dev
   ```

2. Go to `http://localhost:3000/login` or `http://localhost:3000/register`

3. Click the **Continue with Google** button

4. You will be redirected to the Google login page

5. Select your Google account

6. After successful authentication, you will be redirected to `/dashboard`

---

## 🚀 Deploy to Production (Vercel)

### 1. Configure Environment Variables on Vercel

1. Go to your project on [Vercel Dashboard](https://vercel.com/)
2. Navigate to **Settings** → **Environment Variables**
3. Add:
   - `NEXTAUTH_URL`: Your app's URL on Vercel (e.g., `https://teachflow.vercel.app`)
   - `NEXTAUTH_SECRET`: The same secret you generated (use `openssl rand -base64 32`)
   - `GOOGLE_CLIENT_ID`: Client ID from Google Cloud Console
   - `GOOGLE_CLIENT_SECRET`: Client Secret from Google Cloud Console
   - `NEXT_PUBLIC_APP_URL`: Your app's URL on Vercel
   - `DATABASE_URL`: Neon connection string (pooled)
   - `DIRECT_URL`: Neon direct connection string

### 2. Update Authorized URLs in Google Cloud Console

1. Return to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **APIs & Services** → **Credentials**
3. Click on your OAuth 2.0 Client ID
4. In **Authorized JavaScript origins**, add:
   ```
   https://your-app.vercel.app
   https://your-custom-domain.com  (if you have a custom domain)
   ```
5. In **Authorized redirect URIs**, add:
   ```
   https://your-app.vercel.app/api/auth/callback/google
   https://your-custom-domain.com/api/auth/callback/google  (if you have a custom domain)
   ```
6. Click **Save**

### 3. Deploy

The project is already configured to automatically deploy only from the `release` branch:

```bash
# Make sure you're on the release branch
git checkout release

# Make your changes and commit
git add .
git commit -m "chore: configure production OAuth"

# Push to deploy
git push origin release
```

### 4. Test in Production

1. Access your app in production (e.g., `https://your-app.vercel.app`)
2. Go to the login page
3. Click **Continue with Google**
4. Complete the OAuth flow
5. Verify that you were redirected correctly to the dashboard

---

## 🔍 Troubleshooting

### Error: "redirect_uri_mismatch"

**Cause**: The redirect URL is not authorized in Google Cloud Console

**Solution**:
1. Verify that `http://localhost:3000/api/auth/callback/google` is in **Authorized redirect URIs** for development
2. Verify that `https://your-domain.com/api/auth/callback/google` is there for production
3. Make sure there are no spaces or extra characters
4. Confirm you're using `https://` in production (not `http://`)
5. Wait a few minutes after saving (there may be a delay)

### Error: "access_denied"

**Cause**: App is in testing mode and user is not on the test users list

**Solution**:
1. Go to **OAuth consent screen** in Google Cloud Console
2. Add your email to **Test users**
3. Or publish the app by clicking **Publish App** (exits testing mode)

### Error: "invalid_client"

**Cause**: Client ID or Client Secret is incorrect

**Solution**:
1. Verify that you correctly copied the Client ID and Secret from Google Cloud Console to `.env.local`
2. There should be no spaces before/after when pasting
3. Generate a new Client Secret if necessary

### Error: "Configuration" or "Missing NEXTAUTH_SECRET"

**Cause**: NEXTAUTH_SECRET was not configured

**Solution**:
1. Run `openssl rand -base64 32`
2. Add the result to `NEXTAUTH_SECRET` in `.env.local`
3. Restart the development server

### Timezone is not being saved

**Cause**: Cookie is not being created before redirect

**Solution**:
- Timezone is automatically detected using `Intl.DateTimeFormat().resolvedOptions().timeZone`
- It's stored in a cookie called `user_timezone` before the OAuth redirect
- Verify that cookies are enabled in your browser

### User created but without name

**Cause**: `profile` permissions were not granted

**Solution**:
1. Verify that the `profile` scope is configured in the OAuth consent screen
2. Revoke app access in your Google account settings and try again
3. The app will automatically get the name from the Google account

### Google asks for authorization every time

**Cause**: App is in testing mode

**Solution**:
- In testing mode, tokens expire in 7 days
- To avoid this, publish the app in the OAuth consent screen
- Or permanently add users to the test users list

### Error: "Database error" after Google login

**Cause**: Database was not migrated or environment variables are incorrect

**Solution**:
1. Run `npx prisma generate && npx prisma db push`
2. Verify that `DATABASE_URL` and `DIRECT_URL` are correct
3. Confirm that the connection to Neon is working

---

## 📝 How It Works

### Authentication Flow with NextAuth

1. **User clicks "Continue with Google"**
   - NextAuth initiates the OAuth flow
   - Timezone is detected and saved in a cookie
   - User is redirected to Google OAuth

2. **Google authenticates the user**
   - User logs in or selects account
   - Google asks for consent (first time)
   - User authorizes the requested scopes

3. **Google redirects to NextAuth**
   - Callback: `http://localhost:3000/api/auth/callback/google`
   - NextAuth exchanges the authorization code for tokens

4. **NextAuth creates/updates session**
   - Checks if user exists in the database
   - If not exists: creates new user with Google data
   - If exists: updates information (if needed)

5. **User creation in database**
   - Email and name extracted from Google
   - Timezone taken from cookie
   - Default currency set as BRL
   - Record created in `Account` table (OAuth provider)

6. **Final redirect**
   - User is taken to `/dashboard`
   - Session active and authenticated

### Data Captured from Google

- **Email**: `profile.email`
- **Name**: `profile.name`
- **Google ID**: `profile.sub` (stored in `Account.providerAccountId`)
- **Avatar**: `profile.picture` (stored in `User.image`)
- **Email verified**: `profile.email_verified`

### Data Structure

#### `User` Table
```prisma
model User {
  id             String    @id @default(uuid())
  email          String    @unique
  name           String?
  emailVerified  DateTime?
  image          String?
  password       String?   // For credentials auth
  // ... other fields
}
```

#### `Account` Table (OAuth)
```prisma
model Account {
  id                String  @id @default(uuid())
  userId            String
  type              String  // "oauth"
  provider          String  // "google"
  providerAccountId String  // User's Google ID
  access_token      String?
  refresh_token     String?
  // ... other fields
}
```

### Security

- ✅ OAuth 2.0 with PKCE
- ✅ State parameter for CSRF protection
- ✅ HTTPS mandatory in production
- ✅ Tokens managed by NextAuth
- ✅ Secure session storage with HTTP-only cookies
- ✅ JWT signed with NEXTAUTH_SECRET

---

## 📚 Additional Resources

- [NextAuth.js Documentation](https://authjs.dev)
- [NextAuth.js - Google Provider](https://authjs.dev/getting-started/providers/google)
- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Prisma Adapter for NextAuth](https://authjs.dev/getting-started/adapters/prisma)

---

## ✅ Configuration Checklist

Before deploying to production:

- [ ] Project created in Google Cloud Console
- [ ] OAuth consent screen configured
- [ ] Scopes added: email, profile, openid, calendar
- [ ] OAuth 2.0 Client ID created
- [ ] Client ID and Secret copied
- [ ] `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` configured in `.env.local`
- [ ] `NEXTAUTH_SECRET` generated and configured
- [ ] `NEXTAUTH_URL` configured correctly
- [ ] Development redirect URIs configured in Google Console
- [ ] Tested Google login in development
- [ ] Environment variables configured on Vercel (production)
- [ ] Production redirect URIs added in Google Console
- [ ] Deployed to the `release` branch
- [ ] Tested Google login in production
- [ ] Verified user creation in database
- [ ] Confirmed that timezone is being saved correctly

---

Ready! Your Google Sign In using NextAuth.js is configured and ready to use. 🎉
