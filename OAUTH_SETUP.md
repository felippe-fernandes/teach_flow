# OAuth Setup Guide - Google Sign In

Este guia explica como configurar o login com Google no TeachFlow usando Supabase.

## Status da Implementação

✅ **Código implementado** - Google OAuth está completamente implementado no código da aplicação.

⚠️ **Configuração necessária** - Você precisa configurar o Google OAuth no Google Cloud Console e no Supabase Dashboard.

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
   https://seu-projeto.supabase.co/auth/v1/callback
   ```

   💡 **Como encontrar sua URL de callback do Supabase**:
   - Vá para [Supabase Dashboard](https://app.supabase.com)
   - Selecione seu projeto
   - Vá para **Authentication** → **Providers** → **Google**
   - Copie a **Callback URL (for OAuth)** que aparece lá

5. Clique em **Create**
6. **IMPORTANTE**: Copie o **Client ID** e **Client Secret** gerados

### 4. Supabase Dashboard Setup

1. Acesse seu [Supabase Dashboard](https://app.supabase.com)
2. Selecione seu projeto
3. Vá para **Authentication** → **Providers**
4. Encontre **Google** na lista
5. Clique em **Enable**
6. Configure:
   - **Google enabled**: Toggle para ON
   - **Client ID (for OAuth)**: Cole o Client ID do Google Cloud Console
   - **Client Secret (for OAuth)**: Cole o Client Secret do Google Cloud Console
   - **Authorized Client IDs**: Deixe vazio (não é necessário para web)
7. Clique em **Save**

### 5. Variáveis de Ambiente

Certifique-se de que seu `.env.local` contém:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-anon-key

# App URL (usado para OAuth redirects)
NEXT_PUBLIC_APP_URL=http://localhost:3000  # desenvolvimento
# NEXT_PUBLIC_APP_URL=https://seu-dominio.com  # produção
```

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
   - `NEXT_PUBLIC_SUPABASE_URL`: URL do seu projeto Supabase
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Anon key do Supabase
   - `NEXT_PUBLIC_APP_URL`: URL do seu app na Vercel (ex: `https://teachflow.vercel.app`)

### 2. Atualize URLs Autorizadas no Google Cloud Console

1. Volte ao [Google Cloud Console](https://console.cloud.google.com/)
2. Vá para **APIs & Services** → **Credentials**
3. Clique no seu OAuth 2.0 Client ID
4. Em **Authorized JavaScript origins**, adicione:
   ```
   https://seu-app.vercel.app
   https://seu-dominio-custom.com  (se tiver domínio próprio)
   ```
5. **Não precisa adicionar nada em Authorized redirect URIs** - a URL do Supabase já está lá e funciona para produção também
6. Clique em **Save**

### 3. Deploy

O projeto já está configurado para fazer deploy automático apenas do branch `release`:

```bash
git push origin develop:release
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
1. Verifique se `https://seu-projeto.supabase.co/auth/v1/callback` está em **Authorized redirect URIs**
2. Certifique-se de que não há espaços ou caracteres extras
3. Confirme que está usando `https://` (não `http://`)
4. Aguarde alguns minutos após salvar (pode haver delay)

### Erro: "access_denied"

**Causa**: App em modo de teste e usuário não está na lista de test users

**Solução**:
1. Vá para **OAuth consent screen** no Google Cloud Console
2. Adicione seu email em **Test users**
3. Ou publique o app clicando em **Publish App** (sai do modo de teste)

### Erro: "invalid_client"

**Causa**: Client ID ou Client Secret incorretos no Supabase

**Solução**:
1. Verifique se copiou corretamente o Client ID e Secret do Google Cloud Console
2. Não deve haver espaços antes/depois ao colar
3. Gere um novo Client Secret se necessário

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

---

## 📝 Como Funciona

### Fluxo de Autenticação

1. **User clica em "Continuar com Google"**
   - Timezone é detectado e salvo em cookie
   - Usuário é redirecionado para Google OAuth

2. **Google autentica o usuário**
   - Usuário faz login ou seleciona conta
   - Google pede consentimento (primeira vez)

3. **Google redireciona para Supabase**
   - Callback: `https://seu-projeto.supabase.co/auth/v1/callback`
   - Supabase troca o código por sessão

4. **Supabase redireciona para sua aplicação**
   - Callback interno: `/api/auth/callback`
   - Verifica se usuário existe no banco de dados

5. **Criação/Login do usuário**
   - Se não existe: cria novo usuário com dados do Google
   - Pega timezone do cookie
   - Define moeda padrão como BRL

6. **Redirecionamento final**
   - Usuário é levado para `/dashboard`
   - Sessão ativa e autenticado

### Dados Capturados do Google

- **Email**: `data.user.email`
- **Nome**: `data.user.user_metadata.name`
- **Google ID**: `data.user.user_metadata.sub`
- **Avatar**: `data.user.user_metadata.picture` (não está sendo salvo no momento)

### Segurança

- ✅ OAuth 2.0 com PKCE
- ✅ State parameter para CSRF protection
- ✅ HTTPS obrigatório em produção
- ✅ Tokens gerenciados pelo Supabase
- ✅ Session storage seguro com HTTP-only cookies

---

## 📚 Recursos Adicionais

- [Documentação Supabase - Google OAuth](https://supabase.com/docs/guides/auth/social-login/auth-google)
- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Supabase Auth Helpers Next.js](https://supabase.com/docs/guides/auth/auth-helpers/nextjs)

---

## ✅ Checklist de Configuração

Antes de fazer deploy em produção:

- [ ] Projeto criado no Google Cloud Console
- [ ] OAuth consent screen configurada
- [ ] OAuth 2.0 Client ID criado
- [ ] Client ID e Secret copiados
- [ ] Google OAuth habilitado no Supabase Dashboard
- [ ] Client ID e Secret configurados no Supabase
- [ ] Variáveis de ambiente configuradas no `.env.local`
- [ ] Testado login com Google em desenvolvimento
- [ ] URLs de produção adicionadas no Google Cloud Console
- [ ] Variáveis de ambiente configuradas na Vercel
- [ ] Deploy feito para o branch `release`
- [ ] Testado login com Google em produção
- [ ] Verificado criação de usuário no banco de dados
- [ ] Confirmado que timezone está sendo salvo corretamente

---

Pronto! Seu login com Google está configurado e pronto para uso. 🎉
