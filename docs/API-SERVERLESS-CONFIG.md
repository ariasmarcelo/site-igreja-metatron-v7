# Configuração de APIs Serverless - Vercel

## 🎯 Objetivo

Este documento explica como as APIs serverless do Vercel funcionam tanto **localmente** quanto em **produção**, usando apenas variáveis de ambiente.

---

## 🏗️ Arquitetura

### Estrutura de Pastas

```
workspace/shadcn-ui/
├── api/                              # APIs Serverless (Vercel Functions)
│   ├── save-visual-edits.js         # POST /api/save-visual-edits
│   └── content-v2/
│       └── [pageId].js              # GET /api/content-v2/:pageId
├── src/
│   └── config/
│       └── api.ts                    # Configuração centralizada de URLs
└── .env.local                        # Variáveis de ambiente (local)
```

---

## 🔧 Como Funciona

### 1. **Desenvolvimento Local (Vercel Dev)**

```bash
pnpm start  # ou: vercel dev
```

**O que acontece:**
- Vercel Dev inicia na porta `8081` (ou automática)
- Frontend: `http://localhost:8081`
- APIs: `http://localhost:8081/api/*`
- **Tudo na mesma origem!** ✅

**Configuração necessária:**

```bash
# .env.local
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua_anon_key
SUPABASE_SERVICE_KEY=sua_service_key

# ⚠️ NÃO defina VITE_API_URL (deixe vazio/comentado)
# VITE_API_URL=
```

**Por que funciona:**
- `VITE_API_URL` vazio (`''`) = caminho relativo
- `/api/content-v2/index` → `http://localhost:8081/api/content-v2/index`
- Vercel Dev roteou automaticamente para `api/content-v2/[pageId].js`

---

### 2. **Produção (Vercel Deploy)**

```bash
pnpm deploy  # ou: vercel --prod
```

**O que acontece:**
- Site publicado em: `https://seu-site.vercel.app`
- Frontend: `https://seu-site.vercel.app/`
- APIs: `https://seu-site.vercel.app/api/*`
- **Tudo na mesma origem!** ✅

**Configuração no Vercel Dashboard:**

1. Acesse: **Settings → Environment Variables**
2. Adicione:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_KEY`
   - `ENABLE_EXPERIMENTAL_COREPACK=1`

3. **NÃO adicione `VITE_API_URL`** (deixe indefinido)

**Por que funciona:**
- `VITE_API_URL` indefinido = usa caminho relativo (`''`)
- `/api/content-v2/index` → `https://seu-site.vercel.app/api/content-v2/index`
- Vercel roteia automaticamente para serverless functions

---

## 📝 Código de Configuração

### `src/config/api.ts`

```typescript
// URL da API baseada no ambiente
// Prioridade: VITE_API_URL (env) → '' (caminho relativo)
export const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export const API_ENDPOINTS = {
  getContent: (pageId: string) => `${API_BASE_URL}/api/content-v2/${pageId}`,
  saveVisualEdits: `${API_BASE_URL}/api/save-visual-edits`,
};
```

**Resultado:**

| Ambiente | `VITE_API_URL` | `API_BASE_URL` | URL Final |
|----------|----------------|----------------|-----------|
| **Local** | `undefined` | `''` | `/api/content-v2/index` |
| **Prod** | `undefined` | `''` | `/api/content-v2/index` |
| **Custom** | `https://outro-backend.com` | `https://outro-backend.com` | `https://outro-backend.com/api/content-v2/index` |

---

## 🔐 Variáveis de Ambiente

### Localmente (`.env.local`)

```bash
# Supabase (obrigatório)
VITE_SUPABASE_URL=https://laikwxajpcahfatiybnb.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbG...
SUPABASE_SERVICE_KEY=eyJhbG...

# API URL (NÃO DEFINA - deixe vazio)
# VITE_API_URL=

# Vercel
ENABLE_EXPERIMENTAL_COREPACK=1
```

### Produção (Vercel Dashboard)

```bash
# Settings → Environment Variables → Add
VITE_SUPABASE_URL=https://laikwxajpcahfatiybnb.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbG...
SUPABASE_SERVICE_KEY=eyJhbG...
ENABLE_EXPERIMENTAL_COREPACK=1

# NÃO adicione VITE_API_URL
```

---

## 🧪 Testando

### 1. Testar Localmente

```bash
# Terminal 1: Iniciar Vercel Dev
cd workspace/shadcn-ui
pnpm start

# Aguardar: "Ready! Available at http://localhost:8081"

# Terminal 2: Testar APIs
curl http://localhost:8081/api/content-v2/index
```

**Esperado:**
```json
{
  "success": true,
  "pageId": "index",
  "content": { ... }
}
```

### 2. Testar em Produção

```bash
# Após deploy
curl https://seu-site.vercel.app/api/content-v2/index
```

**Esperado:** Mesma resposta JSON

---

## 🐛 Troubleshooting

### ❌ Erro: "API not accessible"

**Causa:** `VITE_API_URL` definida incorretamente ou Vercel Dev não iniciado

**Solução:**
1. Verifique `.env.local` → `VITE_API_URL` deve estar **comentada** ou **vazia**
2. Reinicie Vercel Dev: `pnpm stop` → `pnpm start`
3. Verifique console do navegador: deve mostrar `🔧 API Configuration: { baseUrl: '(relative path)' }`

### ❌ Erro: "CORS blocked"

**Causa:** Tentando acessar API de outra origem

**Solução:**
- Em **local**: Use `http://localhost:8081` (não `http://127.0.0.1:8081`)
- Em **prod**: Deve funcionar automaticamente (mesma origem)

### ❌ Erro: "Supabase credentials missing"

**Causa:** Variáveis de ambiente do Supabase não configuradas

**Solução:**
1. **Local**: Verifique `.env.local` → `VITE_SUPABASE_URL`, `SUPABASE_SERVICE_KEY`
2. **Prod**: Configure no Vercel Dashboard → Settings → Environment Variables
3. **Redeploy** após adicionar variáveis

### ❌ APIs funcionam local, mas não em produção

**Causa:** Variáveis de ambiente não configuradas no Vercel

**Solução:**
1. Acesse Vercel Dashboard → Seu Projeto → Settings → Environment Variables
2. Adicione **todas** as variáveis do `.env.local`
3. Redeploy: `vercel --prod`

---

## ✅ Checklist de Deploy

Antes de fazer deploy:

- [ ] `.env.local` está no `.gitignore` (nunca commite credenciais!)
- [ ] `VITE_API_URL` **NÃO** está definida (comentada)
- [ ] Variáveis configuradas no Vercel Dashboard
- [ ] Build local funciona: `pnpm build`
- [ ] APIs locais funcionam: `pnpm start` → testar `/api/*`
- [ ] Deploy: `pnpm deploy`
- [ ] Testar APIs em produção: `curl https://seu-site.vercel.app/api/content-v2/index`

---

## 📚 Referências

- [Vercel Serverless Functions](https://vercel.com/docs/functions/serverless-functions)
- [Vercel Environment Variables](https://vercel.com/docs/projects/environment-variables)
- [Vercel Dev CLI](https://vercel.com/docs/cli/dev)
