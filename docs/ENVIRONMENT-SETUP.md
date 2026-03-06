# Configuração de Variáveis de Ambiente

**Última atualização:** 15/11/2025

## 📋 Visão Geral

Este projeto usa múltiplos arquivos de ambiente para diferentes contextos de execução. Este guia explica o propósito de cada arquivo e como configurá-los corretamente.

---

## 📁 Arquivos de Ambiente

### `.env` - Vercel Dev (APIs Serverless)

**Propósito:** Variáveis para APIs serverless quando rodando localmente com `vercel dev`

**Usado por:**
- APIs em `api/` (Node.js CommonJS)
- Servidor de desenvolvimento Vercel Dev

**Variáveis obrigatórias:**
```env
VITE_SUPABASE_URL=https://laikwxajpcahfatiybnb.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...seu_token_anonimo
SUPABASE_SERVICE_KEY=eyJhbGc...seu_service_role_key
```

**Observações:**
- `SUPABASE_SERVICE_KEY` é necessário para operações de escrita no banco
- **NUNCA commitar este arquivo** (listado em `.gitignore`)

---

### `.env.local` - Vite (Frontend React)

**Propósito:** Variáveis para o frontend React durante desenvolvimento

**Usado por:**
- Aplicação React em `src/`
- Build do Vite
- Desenvolvimento local (`pnpm dev`)

**Variáveis obrigatórias:**
```env
VITE_SUPABASE_URL=https://laikwxajpcahfatiybnb.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...seu_token_anonimo
VITE_API_URL=
```

**Variáveis opcionais:**
```env
# Ativar logs de debug no console (EditableField, etc.)
# Omitir ou false = silencioso em produção
VITE_DEBUG_LOGS=true
```

**Observações:**
- `VITE_API_URL` deve estar **vazio** (`''` ou omitido)
- Isso permite que APIs funcionem tanto local quanto em produção sem mudanças
- **NUNCA commitar este arquivo** (listado em `.gitignore`)

---

### `.env.example` - Template para `.env`

**Propósito:** Template de exemplo para criar seu próprio `.env`

**Como usar:**
```bash
cp .env.example .env
# Edite .env com suas credenciais reais
```

**Conteúdo:**
```env
# Supabase Configuration (Vercel Dev)
VITE_SUPABASE_URL=your_supabase_project_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_KEY=your_service_role_key_here
```

**Observações:**
- Este arquivo **DEVE** ser commitado (serve como documentação)
- Não contém dados sensíveis reais

---

### `.env.local.example` - Template para `.env.local`

**Propósito:** Template de exemplo para criar seu próprio `.env.local`

**Como usar:**
```bash
cp .env.local.example .env.local
# Edite .env.local com suas credenciais reais
```

**Conteúdo:**
```env
# Supabase Configuration (Vite Frontend)
VITE_SUPABASE_URL=your_supabase_project_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here

# API URL (deixe vazio para usar caminhos relativos)
VITE_API_URL=

# Logs de debug (opcional; omitir = silencioso em produção)
# VITE_DEBUG_LOGS=true
```

**Observações:**
- Este arquivo **DEVE** ser commitado (serve como documentação)
- Não contém dados sensíveis reais

---

### `.env.production` - Variáveis de Produção

**Propósito:** Variáveis específicas para ambiente de produção (Vercel)

**Usado por:**
- Build de produção no Vercel
- Variáveis configuradas no dashboard da Vercel

**Variáveis obrigatórias:**
```env
VITE_SUPABASE_URL=https://laikwxajpcahfatiybnb.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...seu_token_anonimo
SUPABASE_SERVICE_KEY=eyJhbGc...seu_service_role_key
```

**Observações:**
- Geralmente configurado no dashboard da Vercel, não localmente
- **NUNCA commitar este arquivo com valores reais**

---

## 📝 Logging e Debug

O projeto usa um logger controlado por `VITE_DEBUG_LOGS`:

| Valor | Comportamento |
|-------|---------------|
| `true` | Logs de debug/info/warn exibidos no console |
| Omitido ou outro | Silencioso (apenas `logger.error` exibido) |

**Uso no código:**
```typescript
import { logger } from '@/lib/logger';

logger.debug('mensagem de debug');  // só quando VITE_DEBUG_LOGS=true
logger.error('erro crítico');       // sempre exibido
```

Em produção, não defina `VITE_DEBUG_LOGS` para evitar poluir o console do usuário.

---

## 🔐 Obtendo Credenciais do Supabase

### 1. Acessar Dashboard Supabase

1. Acesse [https://supabase.com](https://supabase.com)
2. Faça login e selecione seu projeto
3. Navegue até **Settings** → **API**

### 2. Copiar Credenciais

**Project URL:**
```
URL: https://laikwxajpcahfatiybnb.supabase.co
Variável: VITE_SUPABASE_URL
```

**Anon Key (public):**
```
Localização: Project API keys → anon public
Variável: VITE_SUPABASE_ANON_KEY
Uso: Frontend (seguro para expor)
```

**Service Role Key (private):**
```
Localização: Project API keys → service_role secret
Variável: SUPABASE_SERVICE_KEY
Uso: Backend APIs (NUNCA expor no frontend)
⚠️ ATENÇÃO: Esta chave bypassa Row Level Security (RLS)
```

---

## 🚀 Setup Inicial

### Passo a Passo

```bash
# 1. Clone o repositório
git clone https://github.com/ariasmarcelo/site-igreja-v6.git
cd site-igreja-v6/workspace/shadcn-ui

# 2. Instale dependências
pnpm install

# 3. Crie arquivo .env a partir do template
cp .env.example .env

# 4. Crie arquivo .env.local a partir do template
cp .env.local.example .env.local

# 5. Edite ambos os arquivos com suas credenciais Supabase
# Use seu editor favorito (VS Code, Vim, Notepad++, etc.)
code .env
code .env.local

# 6. Inicie servidor de desenvolvimento
.\start-dev.ps1
```

---

## 🧪 Verificação de Setup

### Verificar se variáveis estão carregadas:

**Frontend (React):**
```typescript
// Em qualquer componente React
console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('API URL:', import.meta.env.VITE_API_URL);
```

**Backend (APIs):**
```javascript
// Em qualquer arquivo API
console.log('Supabase URL:', process.env.VITE_SUPABASE_URL);
console.log('Service Key presente:', !!process.env.SUPABASE_SERVICE_KEY);
```

### Teste de Conectividade:

```bash
# Rode script de teste
node scripts/testing/check-db.cjs
```

Se funcionar, verá:
```
✅ Query executada com sucesso!
📊 Registros retornados: 5
```

---

## ⚠️ Troubleshooting

### Erro: "Variáveis não encontradas"

**Sintomas:**
```
❌ Variáveis de ambiente não encontradas!
   VITE_SUPABASE_URL: ❌
```

**Solução:**
1. Verifique se criou `.env` e `.env.local`
2. Confirme que os nomes das variáveis estão corretos (copie do template)
3. Reinicie o servidor (`.\stop-dev.ps1` seguido de `.\start-dev.ps1`)

### Erro: "Invalid API key"

**Sintomas:**
```
Error: Invalid API key
```

**Solução:**
1. Verifique se copiou as chaves completas (tokens são longos, ~250 caracteres)
2. Confirme que está usando chaves do projeto correto no Supabase
3. Verifique se não há espaços extras antes/depois das chaves

### Erro: APIs não funcionam localmente

**Sintomas:**
- Frontend funciona
- APIs retornam 404 ou erro de CORS

**Solução:**
1. Confirme que está usando `.\start-dev.ps1` (não `pnpm dev` diretamente)
2. Verifique que `VITE_API_URL` está vazio em `.env.local`
3. Aguarde alguns segundos após iniciar servidor (Vercel Dev leva tempo para inicializar)

---

## 🔒 Segurança

### ✅ Boas Práticas

- ✅ `.env` e `.env.local` estão em `.gitignore`
- ✅ `.env.example` e `.env.local.example` sem dados sensíveis
- ✅ Service Role Key apenas em backend
- ✅ Anon Key pode ser exposto no frontend (protegido por RLS)

### ❌ O que NUNCA fazer

- ❌ Commitar `.env` ou `.env.local` com credenciais reais
- ❌ Expor `SUPABASE_SERVICE_KEY` no frontend
- ❌ Compartilhar chaves em chats, emails, screenshots
- ❌ Usar mesmas chaves em múltiplos ambientes (dev/staging/prod)

### 🔄 Rotação de Chaves

Se acidentalmente expor uma chave:

1. Acesse Supabase Dashboard → Settings → API
2. Clique em **"Reset API keys"**
3. Atualize todos os arquivos `.env*` locais
4. Atualize variáveis no dashboard da Vercel
5. Faça redeploy da aplicação

---

## 📚 Referências

- [Supabase Environment Variables](https://supabase.com/docs/guides/cli/managing-config)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)

---

**Última revisão:** 15/11/2025  
**Mantenedor:** Marcelo Arias
