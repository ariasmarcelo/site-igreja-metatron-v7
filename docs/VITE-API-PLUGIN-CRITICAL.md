# ⚠️ CONFIGURAÇÃO CRÍTICA - VITE API PLUGIN ⚠️

**ATENÇÃO:** Esta configuração é ESSENCIAL para o funcionamento do sistema. NÃO REMOVER sem autorização explícita.

---

## 🎯 Problema Resolvido

O projeto precisa servir **APIs serverless** localmente durante desenvolvimento, mas:
- **Vercel Dev** não funciona adequadamente com todas as configurações
- **Proxy simples** não executa as functions, apenas redireciona
- **Servidor separado** adiciona complexidade desnecessária

## ✅ Solução Implementada

**Plugin customizado `apiPlugin()`** no `vite.config.ts` que:
1. Intercepta requisições HTTP para `/api/*`
2. Mapeia para arquivos JavaScript em `api/`
3. Executa as serverless functions localmente
4. Suporta rotas dinâmicas como `[pageId].js`
5. Permite acesso via localhost e IP da rede local

---

## 📋 Configuração Obrigatória

### Arquivo: `vite.config.ts`

```typescript
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import fs from "fs";
import { pathToFileURL } from "url";

// Load environment variables
const env = loadEnv('development', process.cwd(), '');
Object.assign(process.env, env);

// ⚠️ PLUGIN CRÍTICO - NÃO REMOVER
const apiPlugin = () => ({
  name: 'api-dev-server',
  configureServer(server: any) {
    server.middlewares.use((req: any, res: any, next: any) => {
      if (!req.url?.startsWith('/api/')) {
        return next();
      }

      const urlParts = req.url.split('?');
      const urlPath = urlParts[0];

      // Parse query string
      const query: Record<string, string> = {};
      if (urlParts[1]) {
        const params = new URLSearchParams(urlParts[1]);
        params.forEach((value, key) => {
          query[key] = value;
        });
      }

      // Resolve API file path
      let apiPath = path.join(__dirname, urlPath, 'index.js');

      if (!fs.existsSync(apiPath)) {
        apiPath = path.join(__dirname, urlPath + '.js');
      }

      // Handle dynamic routes like [pageId].js
      if (!fs.existsSync(apiPath)) {
        const pathSegments = urlPath.split('/').filter(Boolean);
        if (pathSegments.length >= 2) {
          const basePath = pathSegments.slice(0, -1).join('/');
          const paramValue = pathSegments[pathSegments.length - 1];
          const dynamicPath = path.join(__dirname, basePath, '[pageId].js');

          if (fs.existsSync(dynamicPath)) {
            apiPath = dynamicPath;
            query.pageId = paramValue;
          }
        }
      }

      if (!fs.existsSync(apiPath)) {
        return next();
      }

      // Execute serverless function
      const handleRequest = (body?: any) => {
        const vercelReq = {
          ...req,
          query,
          body,
          method: req.method,
          url: req.url
        };

        const vercelRes = {
          statusCode: 200,
          setHeader: (key: string, value: string) => res.setHeader(key, value),
          status: (code: number) => {
            vercelRes.statusCode = code;
            return vercelRes;
          },
          json: (data: any) => {
            res.statusCode = vercelRes.statusCode;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(data));
          },
          end: (data?: string) => {
            res.statusCode = vercelRes.statusCode;
            res.end(data);
          }
        };

        const fileUrl = pathToFileURL(apiPath).href;
        const timestamp = Date.now();

        import(`${fileUrl}?t=${timestamp}`).then((module: any) => {
          const apiHandler = module.default || module;
          return apiHandler(vercelReq, vercelRes);
        }).catch((error: any) => {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: error.message }));
        });
      };

      // Handle POST/PUT body parsing
      if (req.method === 'POST' || req.method === 'PUT') {
        let body = '';
        req.on('data', (chunk: any) => { body += chunk.toString(); });
        req.on('end', () => {
          try {
            const parsedBody = body ? JSON.parse(body) : {};
            handleRequest(parsedBody);
          } catch (e) {
            handleRequest({});
          }
        });
      } else {
        handleRequest();
      }
    });
  }
});

export default defineConfig({
  base: '/',
  plugins: [react(), apiPlugin()], // ⚠️ apiPlugin() OBRIGATÓRIO
  publicDir: 'public',
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: '0.0.0.0', // ⚠️ Permite acesso via IP
    port: 3000,
    watch: {
      ignored: ['**/public/fonts/**', '**/.cache/**', '**/api/**'],
    },
  },
  // ... resto da configuração
});
```

### Arquivo: `vercel.json`

```json
{
  "outputDirectory": "dist",
  "devCommand": "vite",
  "buildCommand": "pnpm run build && cd api && pnpm install",
  "installCommand": "pnpm install && cd api && pnpm install",
  "functions": {
    "api/**/*.js": {
      "memory": 1024,
      "maxDuration": 10,
      "includeFiles": "api/**"
    }
  }
}
```

**Nota:** `"devCommand": "vite"` usa o Vite direto com nosso plugin customizado.

---

## 🔄 Como Funciona

### Desenvolvimento Local
```
Cliente → http://localhost:3000/api/content/index
         ↓
      Vite Dev Server (porta 3000)
         ↓
      apiPlugin() intercepta /api/*
         ↓
      Mapeia para api/content/[pageId].js
         ↓
      Executa function com pageId="index"
         ↓
      Retorna JSON do Supabase
```

### Produção (Vercel)
```
Cliente → https://site.vercel.app/api/content/index
         ↓
      Vercel Edge Network
         ↓
      Executa api/content/[pageId].js
         ↓
      Retorna JSON do Supabase
```

---

## 🚀 Como Usar

### Iniciar Servidor
```bash
pnpm dev
```

### Acessos Disponíveis
- **Localhost:** `http://localhost:3000/`
- **Rede Local:** `http://192.168.x.x:3000/`
- **APIs:** `http://localhost:3000/api/*`

### Testar API
```bash
curl http://localhost:3000/api/content/index
```

Deve retornar:
```json
{
  "success": true,
  "content": { ... },
  "source": "supabase-db"
}
```

---

## ❌ O Que Acontece Se Remover

### Sintomas
1. APIs retornam **404 Not Found**
2. Cliente recebe **HTML ao invés de JSON**
3. Console browser: `Unexpected token '<', "<!DOCTYPE"... is not valid JSON`
4. Site não carrega conteúdo do banco de dados
5. Páginas mostram fallbacks hardcoded ou erros

### Erro Típico
```
[useContent] Error loading content: Unexpected token '<', "<!DOCTYPE "... is not valid JSON
```

---

## 🔧 Troubleshooting

### Problema: APIs não respondem
**Solução:** Verificar se `apiPlugin()` está presente em `vite.config.ts`

### Problema: Erro "module not found"
**Solução:** Verificar se `import fs from "fs"` e `import { pathToFileURL } from "url"` estão presentes

### Problema: Site não acessa via IP
**Solução:** Verificar se `server.host` está configurado como `'0.0.0.0'`

### Problema: Rotas dinâmicas não funcionam
**Solução:** Verificar se o mapeamento de `[pageId].js` está no plugin

---

## 📚 Histórico

- **29/11/2025:** Documentação criada após restauração do plugin removido acidentalmente
- **Commit 4d7ddea:** Última versão funcional antes da remoção
- **Causa:** Agente IA removeu plugin pensando estar simplificando configuração

---

## ✅ Checklist de Verificação

Antes de qualquer mudança no `vite.config.ts`, verificar:

- [ ] Plugin `apiPlugin()` está presente e completo?
- [ ] `import fs from "fs"` está no topo?
- [ ] `import { pathToFileURL } from "url"` está no topo?
- [ ] `plugins: [react(), apiPlugin()]` tem ambos os plugins?
- [ ] `server.host` está configurado como `'0.0.0.0'`?
- [ ] `vercel.json` tem `"devCommand": "vite"`?

---

**Referência:** Commit `4d7ddea` - configuração funcional completa
