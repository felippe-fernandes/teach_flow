# OAuth Setup Guide - Google Sign In

> **Idiomas**: [English](./OAUTH_SETUP.md) | **Português (Brasil)**

Este guia explica como configurar o login com Google no TeachFlow usando NextAuth.js.

## Status da Implementação

✅ **Código implementado** - Google OAuth está completamente implementado no código da aplicação usando NextAuth.js v5.

⚠️ **Configuração necessária** - Você precisa configurar o Google OAuth no Google Cloud Console e adicionar as credenciais ao `.env.local`.

---

## 🔵 Google OAuth Configuration

### 1. Google Cloud Console Setup

1. Acesse o [Google Cloud Console](https://console.cloud.google.com/)
2. Crie um novo projeto ou selecione um existente
3. Vá para **APIs & Services** → **Credentials**
4. Clique em **Create Credentials** → **OAuth 2.0 Client ID**

### 2. Configure OAuth Consent Screen

Se ainda não configurou a tela de consentimento:

1. Clique em **Configure Consent Screen**
2. Escolha o tipo:
   - **External**: Para qualquer usuário com conta Google (recomendado para produção)
   - **Internal**: Apenas para usuários do seu Google Workspace
3. Preencha as informações obrigatórias:
   - **App name**: TeachFlow
   - **User support email**: seu email
   - **Developer contact email**: seu email
4. Em **Scopes**, adicione:
   - `email`
   - `profile`
   - `openid`
   - `https://www.googleapis.com/auth/calendar` (para integração com Google Calendar)
   - `https://www.googleapis.com/auth/calendar.events` (para eventos do Calendar)
5. Clique em **Save and Continue**
6. Adicione usuários de teste (se em modo de teste)
7. Clique em **Save and Continue** até finalizar

### 3. Create OAuth 2.0 Client ID

1. Volte para **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
2. Configure:
   - **Application type**: Web application
   - **Name**: TeachFlow Web

3. **Authorized JavaScript origins**:
   ```
   http://localhost:3000
   https://seu-dominio.com
   https://seu-app.vercel.app
   ```

4. **Authorized redirect URIs**:
   ```
   http://localhost:3000/api/auth/callback/google
   https://seu-dominio.com/api/auth/callback/google
   https://seu-app.vercel.app/api/auth/callback/google
   ```

   💡 **Importante**: Com NextAuth, a redirect URI é sempre `[APP_URL]/api/auth/callback/google`

5. Clique em **Create**
6. **IMPORTANTE**: Copie o **Client ID** e **Client Secret** gerados

### 4. Variáveis de Ambiente

Adicione ao seu `.env.local`:

```env
# NextAuth
NEXTAUTH_URL=http://localhost:3000  # desenvolvimento
# NEXTAUTH_URL=https://seu-dominio.com  # produção
NEXTAUTH_SECRET=gere-um-secret-aleatorio-aqui

# Google OAuth
GOOGLE_CLIENT_ID=seu-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=seu-client-secret

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000  # desenvolvimento
# NEXT_PUBLIC_APP_URL=https://seu-dominio.com  # produção
```

### 5. Gerar NEXTAUTH_SECRET

Execute no terminal:

```bash
openssl rand -base64 32
```

Copie o resultado e cole em `NEXTAUTH_SECRET`.

### 6. Teste em Desenvolvimento

1. Inicie sua aplicação:
   ```bash
   npm run dev
   ```

2. Acesse `http://localhost:3000/login` ou `http://localhost:3000/register`

3. Clique no botão **Continuar com Google**

4. Você será redirecionado para a página de login do Google

5. Selecione sua conta Google

6. Após autenticação bem-sucedida, você será redirecionado para `/dashboard`

---

## 🚀 Deploy em Produção (Vercel)

### 1. Configure Variáveis de Ambiente na Vercel

1. Acesse seu projeto no [Vercel Dashboard](https://vercel.com/)
2. Vá para **Settings** → **Environment Variables**
3. Adicione:
   - `NEXTAUTH_URL`: URL do seu app na Vercel (ex: `https://teachflow.vercel.app`)
   - `NEXTAUTH_SECRET`: O mesmo secret que você gerou (use `openssl rand -base64 32`)
   - `GOOGLE_CLIENT_ID`: Client ID do Google Cloud Console
   - `GOOGLE_CLIENT_SECRET`: Client Secret do Google Cloud Console
   - `NEXT_PUBLIC_APP_URL`: URL do seu app na Vercel
   - `DATABASE_URL`: Connection string do Neon (pooled)
   - `DIRECT_URL`: Direct connection string do Neon

### 2. Atualize URLs Autorizadas no Google Cloud Console

1. Volte ao [Google Cloud Console](https://console.cloud.google.com/)
2. Vá para **APIs & Services** → **Credentials**
3. Clique no seu OAuth 2.0 Client ID
4. Em **Authorized JavaScript origins**, adicione:
   ```
   https://seu-app.vercel.app
   https://seu-dominio-custom.com  (se tiver domínio próprio)
   ```
5. Em **Authorized redirect URIs**, adicione:
   ```
   https://seu-app.vercel.app/api/auth/callback/google
   https://seu-dominio-custom.com/api/auth/callback/google  (se tiver domínio próprio)
   ```
6. Clique em **Save**

### 3. Deploy

O projeto já está configurado para fazer deploy automático apenas do branch `release`:

```bash
# Certifique-se de estar na branch release
git checkout release

# Faça suas alterações e commit
git add .
git commit -m "chore: configure production OAuth"

# Push para deploy
git push origin release
```

### 4. Teste em Produção

1. Acesse seu app em produção (ex: `https://seu-app.vercel.app`)
2. Vá para a página de login
3. Clique em **Continuar com Google**
4. Complete o fluxo OAuth
5. Verifique se foi redirecionado corretamente para o dashboard

---

## 🔍 Troubleshooting

### Erro: "redirect_uri_mismatch"

**Causa**: A URL de redirect não está autorizada no Google Cloud Console

**Solução**:
1. Verifique se `http://localhost:3000/api/auth/callback/google` está em **Authorized redirect URIs** para desenvolvimento
2. Verifique se `https://seu-dominio.com/api/auth/callback/google` está lá para produção
3. Certifique-se de que não há espaços ou caracteres extras
4. Confirme que está usando `https://` em produção (não `http://`)
5. Aguarde alguns minutos após salvar (pode haver delay)

### Erro: "access_denied"

**Causa**: App em modo de teste e usuário não está na lista de test users

**Solução**:
1. Vá para **OAuth consent screen** no Google Cloud Console
2. Adicione seu email em **Test users**
3. Ou publique o app clicando em **Publish App** (sai do modo de teste)

### Erro: "invalid_client"

**Causa**: Client ID ou Client Secret incorretos

**Solução**:
1. Verifique se copiou corretamente o Client ID e Secret do Google Cloud Console para `.env.local`
2. Não deve haver espaços antes/depois ao colar
3. Gere um novo Client Secret se necessário

### Erro: "Configuration" ou "Missing NEXTAUTH_SECRET"

**Causa**: NEXTAUTH_SECRET não foi configurado

**Solução**:
1. Execute `openssl rand -base64 32`
2. Adicione o resultado em `NEXTAUTH_SECRET` no `.env.local`
3. Reinicie o servidor de desenvolvimento

### Timezone não está sendo salvo

**Causa**: Cookie não está sendo criado antes do redirect

**Solução**:
- O timezone é detectado automaticamente usando `Intl.DateTimeFormat().resolvedOptions().timeZone`
- É armazenado em um cookie chamado `user_timezone` antes do redirect OAuth
- Verifique se cookies estão habilitados no navegador

### Usuário criado mas sem nome

**Causa**: Permissões de `profile` não foram concedidas

**Solução**:
1. Verifique se o scope `profile` está configurado na OAuth consent screen
2. Revogue o acesso do app nas configurações da sua conta Google e tente novamente
3. O app pegará o nome da conta Google automaticamente

### Google pede autorização toda vez

**Causa**: App em modo de teste

**Solução**:
- Em modo de teste, tokens expiram em 7 dias
- Para evitar isso, publique o app na OAuth consent screen
- Ou adicione permanentemente os usuários na lista de test users

### Erro: "Database error" após login com Google

**Causa**: Banco de dados não foi migrado ou variáveis de ambiente incorretas

**Solução**:
1. Execute `npx prisma generate && npx prisma db push`
2. Verifique se `DATABASE_URL` e `DIRECT_URL` estão corretos
3. Confirme que a conexão com o Neon está funcionando

---

## 📝 Como Funciona

### Fluxo de Autenticação com NextAuth

1. **User clica em "Continuar com Google"**
   - NextAuth inicia o fluxo OAuth
   - Timezone é detectado e salvo em cookie
   - Usuário é redirecionado para Google OAuth

2. **Google autentica o usuário**
   - Usuário faz login ou seleciona conta
   - Google pede consentimento (primeira vez)
   - Usuário autoriza os escopos solicitados

3. **Google redireciona para NextAuth**
   - Callback: `http://localhost:3000/api/auth/callback/google`
   - NextAuth troca o código de autorização por tokens

4. **NextAuth cria/atualiza sessão**
   - Verifica se usuário existe no banco de dados
   - Se não existe: cria novo usuário com dados do Google
   - Se existe: atualiza informações (se necessário)

5. **Criação do usuário no banco**
   - Email e nome extraídos do Google
   - Timezone pego do cookie
   - Moeda padrão definida como BRL
   - Registro criado na tabela `Account` (OAuth provider)

6. **Redirecionamento final**
   - Usuário é levado para `/dashboard`
   - Sessão ativa e autenticado

### Dados Capturados do Google

- **Email**: `profile.email`
- **Nome**: `profile.name`
- **Google ID**: `profile.sub` (armazenado em `Account.providerAccountId`)
- **Avatar**: `profile.picture` (armazenado em `User.image`)
- **Email verificado**: `profile.email_verified`

### Estrutura de Dados

#### Tabela `User`
```prisma
model User {
  id             String    @id @default(uuid())
  email          String    @unique
  name           String?
  emailVerified  DateTime?
  image          String?
  password       String?   // Para auth com credentials
  // ... outros campos
}
```

#### Tabela `Account` (OAuth)
```prisma
model Account {
  id                String  @id @default(uuid())
  userId            String
  type              String  // "oauth"
  provider          String  // "google"
  providerAccountId String  // Google ID do usuário
  access_token      String?
  refresh_token     String?
  // ... outros campos
}
```

### Segurança

- ✅ OAuth 2.0 com PKCE
- ✅ State parameter para CSRF protection
- ✅ HTTPS obrigatório em produção
- ✅ Tokens gerenciados pelo NextAuth
- ✅ Session storage seguro com HTTP-only cookies
- ✅ JWT signed com NEXTAUTH_SECRET

---

## 📚 Recursos Adicionais

- [Documentação NextAuth.js](https://authjs.dev)
- [NextAuth.js - Google Provider](https://authjs.dev/getting-started/providers/google)
- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Prisma Adapter para NextAuth](https://authjs.dev/getting-started/adapters/prisma)

---

## ✅ Checklist de Configuração

Antes de fazer deploy em produção:

- [ ] Projeto criado no Google Cloud Console
- [ ] OAuth consent screen configurada
- [ ] Scopes adicionados: email, profile, openid, calendar
- [ ] OAuth 2.0 Client ID criado
- [ ] Client ID e Secret copiados
- [ ] `GOOGLE_CLIENT_ID` e `GOOGLE_CLIENT_SECRET` configurados no `.env.local`
- [ ] `NEXTAUTH_SECRET` gerado e configurado
- [ ] `NEXTAUTH_URL` configurado corretamente
- [ ] Redirect URIs de desenvolvimento configuradas no Google Console
- [ ] Testado login com Google em desenvolvimento
- [ ] Variáveis de ambiente configuradas na Vercel (produção)
- [ ] Redirect URIs de produção adicionadas no Google Console
- [ ] Deploy feito para o branch `release`
- [ ] Testado login com Google em produção
- [ ] Verificado criação de usuário no banco de dados
- [ ] Confirmado que timezone está sendo salvo corretamente

---

Pronto! Seu login com Google usando NextAuth.js está configurado e pronto para uso. 🎉
