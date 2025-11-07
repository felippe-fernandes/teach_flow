# Checklist de Deployment - TeachFlow

Use este checklist para garantir que todos os passos críticos foram executados antes e depois do deploy.

## Pré-Deploy

### Configuração do Supabase
- [ ] RLS policies aplicadas via SQL Editor (`prisma/rls-policies.sql`)
- [ ] Site URL configurado para URL de produção
- [ ] Redirect URLs adicionadas:
  - [ ] `https://[SEU-DOMINIO]/auth/callback`
  - [ ] `https://[SEU-DOMINIO]/auth/login`
- [ ] JWT expiry configurado (recomendado: 3600s)
- [ ] Email confirmations habilitado (se desejar)

### Preparação do Código
- [ ] Build local executado com sucesso (`npm run build`)
- [ ] Testes unitários passando (`npm test`)
- [ ] Todas as alterações commitadas no Git
- [ ] Branch `main` atualizada (merge de `develop`)
- [ ] `.env.example` criado e commitado
- [ ] `.env.local` e `.env.production.local` no `.gitignore`

### Configuração do Vercel
- [ ] Conta Vercel criada/acessada
- [ ] Repositório GitHub conectado
- [ ] Framework detectado como Next.js
- [ ] Environment Variables configuradas:
  - [ ] `DATABASE_URL` (connection pooler, porta 6543)
  - [ ] `NEXT_PUBLIC_SUPABASE_URL`
  - [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] Variáveis marcadas para Production, Preview e Development

## Durante o Deploy

- [ ] Deploy iniciado no Vercel
- [ ] Build completado sem erros
- [ ] Deployment status: Ready
- [ ] URL de produção gerada (ex: `https://teach-flow.vercel.app`)

## Pós-Deploy

### Configuração Final
- [ ] URLs no Supabase atualizadas para URL do Vercel
- [ ] Schema do banco verificado (tabelas existem)
- [ ] Prisma Client gerado (`npx prisma generate`)
- [ ] Domínio customizado configurado (opcional)
- [ ] DNS records atualizados (se domínio customizado)
- [ ] HTTPS ativo e certificado válido

### Testes de Funcionalidade

#### Autenticação
- [ ] Registro de novo usuário funciona
- [ ] Login funciona corretamente
- [ ] Logout funciona
- [ ] Redirecionamento para `/dashboard` após login
- [ ] Redirecionamento para `/auth/login` ao acessar rotas protegidas sem auth

#### CRUD de Contractors
- [ ] Criar contractor funciona
- [ ] Listar contractors mostra apenas do usuário logado
- [ ] Editar contractor funciona
- [ ] Deletar contractor funciona

#### CRUD de Students
- [ ] Criar student funciona
- [ ] Listar students mostra apenas do usuário logado
- [ ] Editar student funciona
- [ ] Adicionar package funciona
- [ ] Deletar student funciona

#### CRUD de Classes
- [ ] Criar class funciona
- [ ] Validação de ownership (student e contractor) funciona
- [ ] Listar classes mostra apenas do usuário logado
- [ ] Editar class funciona
- [ ] Marcar class como "completed" cria payment automaticamente
- [ ] Deletar class funciona

#### Módulo Financeiro
- [ ] Payments são criados automaticamente ao completar class
- [ ] Listar payments mostra apenas do usuário logado
- [ ] Atualizar status de payment funciona
- [ ] Dashboard financeiro calcula totais corretamente
- [ ] Filtros por período funcionam

#### Dashboard
- [ ] Estatísticas mostram dados corretos (não zeros)
- [ ] Próximas aulas mostram classes agendadas
- [ ] Resumo financeiro mostra valores do mês atual

### Testes de Segurança

#### Row Level Security (RLS)
- [ ] Usuário A não consegue ver dados do Usuário B
- [ ] Criar 2 contas diferentes e verificar isolamento
- [ ] Tentar acessar URL direta de recurso de outro usuário (deve falhar)
- [ ] Verificar que todas as queries incluem `user_id` nos logs

#### Autorização
- [ ] Acessar `/dashboard` sem login redireciona para `/auth/login`
- [ ] Token JWT expira após período configurado
- [ ] Refresh token funciona (não precisa relogar constantemente)
- [ ] Middleware protege todas as rotas do dashboard

### Performance e Monitoramento

- [ ] Vercel Analytics ativado
- [ ] Tempo de carregamento da página < 3s
- [ ] Logs de erro monitorados no Vercel
- [ ] Logs de queries monitorados no Supabase
- [ ] Não há erros no console do navegador

## Rollback Plan

Se algo der errado:

- [ ] Reverter deploy no Vercel (Deployments > ... > Redeploy)
- [ ] Verificar logs de erro
- [ ] Corrigir localmente
- [ ] Testar build local novamente
- [ ] Fazer novo deploy

## Próximos Passos Recomendados

### Backup e Recuperação
- [ ] Configurar backup automático no Supabase
- [ ] Testar restore de backup
- [ ] Documentar processo de recuperação

### CI/CD
- [ ] Configurar GitHub Actions para testes automáticos
- [ ] Adicionar lint check no CI
- [ ] Adicionar type check no CI
- [ ] Bloquear merge se testes falharem

### Monitoramento
- [ ] Configurar Sentry ou similar para error tracking
- [ ] Configurar UptimeRobot para monitorar uptime
- [ ] Adicionar alertas de erro via email/Slack
- [ ] Configurar logs estruturados

### Segurança
- [ ] Implementar rate limiting em APIs sensíveis
- [ ] Adicionar captcha no registro (se spam)
- [ ] Configurar CORS adequadamente
- [ ] Implementar 2FA (opcional)
- [ ] Adicionar CSP headers

### Performance
- [ ] Otimizar imagens (usar next/image)
- [ ] Implementar cache de queries
- [ ] Adicionar lazy loading de componentes
- [ ] Configurar ISR para páginas estáticas

## Notas Importantes

### DATABASE_URL
⚠️ **IMPORTANTE**: Use sempre a **connection pooler URL** (porta 6543) no Vercel, não a URL direta (porta 5432). Isso evita esgotamento de conexões.

```
✅ Correto: postgresql://...@...pooler.supabase.com:6543/postgres
❌ Errado:  postgresql://...@db....supabase.co:5432/postgres
```

### Environment Variables
🔒 **SEGURANÇA**: Nunca commite arquivos `.env.local` ou `.env.production.local`. Sempre use apenas `.env.example` como template.

### RLS Policies
🛡️ **CRÍTICO**: As RLS policies são a última linha de defesa. Mesmo que o código tenha bugs, o banco não permitirá acesso não autorizado.

### Session Management
🔑 **TOKENS**: O Supabase auto-renova tokens via refresh token. Não é necessário implementar renovação manual.

## Data de Deploy

- **Primeira versão (v0.1.0)**: ___/___/___
- **Responsável**: ________________
- **Ambiente**: Production / Staging
- **Status**: ✅ Sucesso / ❌ Problemas

## Problemas Encontrados

| Data | Problema | Solução | Status |
|------|----------|---------|--------|
|      |          |         |        |
|      |          |         |        |
|      |          |         |        |

---

**Última atualização**: 2025-11-07
