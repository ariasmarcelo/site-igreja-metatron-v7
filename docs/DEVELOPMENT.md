# Desenvolvimento, Deploy e Troubleshooting

## Vite Config — `apiPlugin()`

O projeto usa um **plugin Vite customizado** que emula o ambiente Vercel Serverless localmente.

**O que faz:**
1. Intercepta todas as requisições `/api/*` no dev server
2. Resolve o handler: `api/<path>/index.js`, `api/<path>.js`, ou `api/<basePath>/[pageId].js` (rota dinâmica)
3. Para POST/PUT: coleta body chunks e parseia JSON
4. Constrói shim `req/res` compatível com Vercel (`query`, `body`, `status()`, `json()`, `setHeader()`)
5. Usa `import()` dinâmico com cache-busting (`?t=timestamp`) para hot-reload
6. Erros são capturados e retornados como JSON 500

**Se removido ou corrompido:** APIs retornam 404 ou HTML em vez de JSON → site não carrega conteúdo do banco.

**Localização:** definido dentro de `vite.config.ts`, ANTES do plugin React.

---

## Desenvolvimento Local

### Iniciar / Parar Servidor

```powershell
# Iniciar (OBRIGATÓRIO — nunca usar npx vite, npm run dev etc.)
& "d:\SiteIgrejaMeatron\site-igreja-v7\workspace\shadcn-ui\start-dev.ps1"

# Parar
& "d:\SiteIgrejaMeatron\site-igreja-v7\workspace\shadcn-ui\stop-dev.ps1"
```

O script: mata processos node existentes → npm install se necessário → npm run dev.
Resultado: `http://localhost:3000` (também acessível via IP local).

### Testar API (PowerShell)

```powershell
$ProgressPreference = 'SilentlyContinue'

# GET — conteúdo multilíngue
$r = Invoke-RestMethod -Uri "http://localhost:3000/api/content/index" -Method Get

# GET — idioma específico
$r = Invoke-RestMethod -Uri "http://localhost:3000/api/content/index?language=pt-BR" -Method Get

# Verificar integridade de traduções
$r.languageStatus.integrityWarnings | Where-Object { $_.issues -match 'FALTANDO' }
```

### Build e Deploy

```powershell
cd "d:\SiteIgrejaMeatron\site-igreja-v7\workspace\shadcn-ui"
npm run build     # Build de produção
vercel --prod     # Deploy
```

---

## Deploy — Vercel

### `vercel.json`

```json
{
  "outputDirectory": "dist",
  "buildCommand": "pnpm run build && cd api && pnpm install",
  "installCommand": "pnpm install && cd api && pnpm install",
  "functions": {
    "api/**/*.js": { "memory": 1024, "maxDuration": 10, "includeFiles": "api/**" }
  },
  "rewrites": [
    { "source": "/((?!api/).*)", "destination": "/index.html" }
  ]
}
```

- **Dual install:** `pnpm install` para frontend + `cd api && pnpm install` para dependências do handler
- **Rewrites:** Tudo que NÃO começa com `/api/` → `index.html` (SPA routing)
- **Functions:** Cada `.js` em `api/` vira serverless function com 1GB RAM e timeout de 10s

### pnpm vs npm no Windows Local

O `pnpm install` **falha silenciosamente no Windows** (bug WMI "Nó - NOVOATOM / Consulta inválida") que interrompe linking, deixando `node_modules` incompleto.

**Solução:** Usar `npm install` localmente. O `package-lock.json` gerado NÃO deve ser commitado (Vercel usa `pnpm-lock.yaml`). No Vercel (Linux), `pnpm` funciona normalmente.

---

## Scripts Disponíveis

### Via npm (package.json)

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Vite dev server na porta 3000 |
| `npm run build` | Build de produção |
| `npm run lint` | ESLint no `src/` |
| `npm run backup` | Backup completo do Supabase |
| `npm run backup:verbose` | Backup com output detalhado |
| `npm run backup:list` | Listar backups disponíveis |
| `npm run backup:list:detailed` | Lista detalhada de backups |
| `npm run restore` | Restaurar backup (interativo) |
| `npm run restore:latest` | Restaurar backup mais recente |
| `npm run restore:dry` | Dry-run da restauração |
| `npm run deploy` | Deploy para Vercel produção |

### Scripts Utilitários (`scripts/`)

| Script | Função |
|--------|--------|
| `backup-supabase.js` | Backup completo do banco |
| `restore-supabase.js` | Restauração de backup |
| `audit-multilingual-db.js` | Auditoria de integridade multilíngue |
| `deploy.ps1` | Deploy automatizado para Vercel |
| `list-backups.ps1` | Listar backups disponíveis |

---

## Troubleshooting

| Problema | Causa Provável | Solução |
|----------|----------------|---------|
| API retorna HTML em vez de JSON | `apiPlugin()` ausente/corrompido em `vite.config.ts` | Restaurar plugin |
| Caracteres corrompidos (U+FFFD) | Encoding UTF-16LE ao salvar arquivo | Verificar encoding, usar UTF-8 sem BOM |
| `pnpm install` falha (exit code 1, Windows) | Bug WMI | Usar `npm install` |
| `Cannot find module @rollup/rollup-win32-x64-msvc` | `node_modules` incompleto após pnpm | Deletar `node_modules` e reinstalar com `npm install` |
| PUT aceita mas não salva | Hash idêntico (no-op) | Verificar `updateLog[].oldHash` vs `newHash` |
| Tradução igual em PT e EN | Key em dot-notation, front usa bracket-notation | Atualizar AMBAS as notações se coexistirem |
| `languageStatus` mostra FALTANDO | Idioma ausente no `content` | PUT com o idioma faltante |
