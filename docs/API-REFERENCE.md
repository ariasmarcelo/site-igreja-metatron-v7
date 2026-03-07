# API Reference — `/api/content/:pageId`

> Arquivo: `api/content/[pageId].js` (~1100 linhas, CommonJS)

## Endpoint Único

| Método | URL | Descrição |
|--------|-----|-----------|
| `GET` | `/api/content/:pageId` | Retorna conteúdo aninhado da página |
| `PUT` | `/api/content/:pageId` | Atualiza campos (upsert com merge inteligente) |
| `DELETE` | `/api/content/:pageId` | Remove registros por ID |
| `OPTIONS` | `/api/content/:pageId` | Preflight CORS (retorna 200) |

---

## GET — Leitura de Conteúdo

### Query Parameters

| Parâmetro | Tipo | Obrigatório | Valores | Comportamento |
|-----------|------|-------------|---------|---------------|
| `language` | string | Não | `pt-BR`, `en-US`, `all` | Se omitido ou `all`: modo multilíngue (cada leaf = `{pt-BR, en-US}`) |

### Modo Single-Language (`?language=pt-BR`)

Cada valor folha é uma **string plana** no idioma solicitado:
```json
{
  "success": true,
  "content": {
    "hero": {
      "title": "Igreja de Metatron",
      "subtitle": "Cura e Transformação"
    },
    "treatments": [
      { "title": "Psicoterapia", "description": "..." }
    ]
  }
}
```

Se o idioma solicitado não existe para uma key, retorna `"<Vazio>"` (pt-BR) ou `"<Empty>"` (en-US).

### Modo Multilíngue (sem `?language=` ou `?language=all`)

Cada valor folha é um **objeto com todos os idiomas**:
```json
{
  "success": true,
  "content": {
    "hero": {
      "title": { "pt-BR": "Igreja de Metatron", "en-US": "Church of Metatron" }
    }
  }
}
```

### Resposta Completa GET (200)

```json
{
  "success": true,
  "content": { /* JSON aninhado reconstruído */ },
  "languageMetadata": {
    "hero.title": {
      "availableLanguages": ["pt-BR", "en-US"],
      "requestedLanguage": "en-US",
      "issues": [],
      "isMultilingual": false
    }
  },
  "source": "supabase-db",
  "languageStatus": {
    "requested": "en-US",
    "integrityWarnings": [
      {
        "key": "hero.title",
        "available": ["pt-BR"],
        "requested": "en-US",
        "used": null,
        "issues": ["en-US FALTANDO"],
        "fallbackUsed": null
      }
    ],
    "totalWithIssues": 1
  },
  "metadata": {
    "requestId": "a1b2c3d4e5f6g7h8",
    "duration": "123ms",
    "timestamp": "2026-02-16T12:00:00.000Z"
  }
}
```

### Reconstrução de JSON (`reconstructObjectFromEntries`)

A API converte registros flat do banco em JSON aninhado:

1. **Deduplicação:** Se existem `hero.title` e `index.hero.title`, o sem prefixo de pageId vence.
2. **Split por `.`** : `hero.title` → `["hero", "title"]` (objetos aninhados)
3. **Bracket notation** : `treatments[0].title` → detectado via regex `/^(.+)\[(\d+)\]$/` → cria arrays com posições indexadas
4. **Keys `__shared__`** : mantidas sob namespace `__shared__` no JSON de resposta

### `languageStatus` — Integridade Multilíngue

Gerado por `validateMultilingualIntegrity()` para CADA key no banco:

| Issue | Condição |
|-------|----------|
| `"en-US FALTANDO"` | A chave do idioma não existe no objeto `content` |
| `"en-US é null/undefined"` | Chave existe mas valor é null/undefined |
| `"en-US não é string"` | Valor não é string (tipo incorreto) |
| `"en-US está vazio"` | String vazia após `.trim()` |
| `"SUSPEITA: pt-BR e en-US são idênticos"` | Ambos idiomas têm texto igual (possível cópia sem tradução) |

Buscar `languageStatus.integrityWarnings` filtrados por `issues.includes('FALTANDO')` para encontrar traduções ausentes.

---

## PUT — Atualização de Conteúdo

### Request Body (obrigatório)

```json
{
  "language": "pt-BR",
  "edits": {
    "hero.title": {
      "newText": {
        "pt-BR": "Novo título em português",
        "en-US": "New title in English"
      }
    },
    "__shared__.footer.copyright": {
      "newText": {
        "pt-BR": "© 2026 Igreja de Metatron",
        "en-US": "© 2026 Church of Metatron"
      }
    }
  }
}
```

### Regras Críticas do PUT

| Regra | Detalhe |
|-------|---------|
| **`newText` deve ser OBJETO** | Strings planas são REJEITADAS. Sempre `{ "pt-BR": "...", "en-US": "..." }` |
| **Merge inteligente** | Se enviar apenas `{ "pt-BR": "..." }`, o `en-US` existente no banco é PRESERVADO |
| **Hash comparison** | Se o conteúdo após merge é idêntico ao existente (SHA-256), o write é IGNORADO (no-op) |
| **Keys `__shared__`** | Prefixo `__shared__.` no json_key → `page_id = "__shared__"`, prefixo removido da key |
| **Keys com prefixo de página** | `index.hero.title` → prefixo `index.` removido → key salva como `hero.title` |
| **Legacy key cleanup** | Após salvar, verifica e remove key legada `${pageId}.${jsonKey}` se existir |

### Fluxo Interno do PUT (por key)

```
1. SELECT content, id FROM text_entries WHERE page_id = X AND json_key = Y
2. sentLanguages = chaves presentes em newText
3. notSentLanguages = ['pt-BR', 'en-US'] - sentLanguages
4. mergedContent = { ...existente para notSent, ...novo para sent }
5. IF hashContent(before) === hashContent(after) → SKIP (no-op)
6. UPSERT { page_id, json_key, content: mergedContent, updated_at }
   ON CONFLICT (page_id, json_key)
7. Verifica e limpa legacy key "${pageId}.${jsonKey}" se existir
```

### Resposta PUT (200)

```json
{
  "success": true,
  "message": "Conteúdo atualizado com sucesso",
  "updatedCount": 5,
  "failedCount": 0,
  "updateLog": [
    {
      "key": "hero.title",
      "status": "SUCCESS",
      "oldHash": "abc12345...",
      "newHash": "def67890...",
      "isNewRecord": false,
      "sentLanguages": ["pt-BR", "en-US"],
      "preservedLanguages": [],
      "finalState": { "pt-BR": "\"Novo título...\"", "en-US": "\"New title...\"" },
      "integrityValid": true,
      "integrityIssues": []
    }
  ],
  "metadata": { "requestId": "...", "duration": "456ms", "timestamp": "..." }
}
```

### Exemplo: PUT via Node.js

```javascript
const http = require('http');

function putContent(pageId, edits) {
  const body = JSON.stringify({ edits });
  return new Promise((resolve, reject) => {
    const req = http.request({
      hostname: 'localhost', port: 3000,
      path: `/api/content/${pageId}`,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
        'Content-Length': Buffer.byteLength(body, 'utf8')
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}
```

### Exemplo: PUT via PowerShell

```powershell
$ProgressPreference = 'SilentlyContinue'
$body = @{
  edits = @{
    "hero.title" = @{
      newText = @{ "pt-BR" = "Novo título"; "en-US" = "New title" }
    }
  }
} | ConvertTo-Json -Depth 10

$response = Invoke-RestMethod -Uri "http://localhost:3000/api/content/index" `
  -Method Put -Body $body -ContentType "application/json"

$response.updateLog | ForEach-Object { Write-Host "$($_.key): $($_.status)" }
```

---

## DELETE — Remoção de Registros

### Request Body

```json
{ "ids": ["uuid-1", "uuid-2", 123] }
```

- `ids` deve ser array não-vazio, máximo 1000 elementos
- Cada ID pode ser `string` ou `number`
- DELETE confirma `page_id = pageId` para cada ID (proteção cross-page)

### Resposta DELETE (200)

```json
{
  "success": true,
  "message": "Deletado 3/3 registros",
  "deletedCount": 3,
  "failedCount": 0,
  "metadata": { "requestId": "...", "duration": "78ms", "timestamp": "..." }
}
```

---

## Respostas de Erro

| Status | Condição |
|--------|----------|
| 400 | Validação falhou: `pageId` inválido, `language` inválido, `newText` não é objeto |
| 404 | `pageId` válido mas sem dados no banco |
| 405 | Método HTTP não permitido |
| 413 | Body > 100KB |
| 429 | DELETE com > 1000 IDs |
| 500 | Erro interno (mensagem sanitizada) |
| 504 | Timeout (> 30 segundos) |

```json
{ "success": false, "message": "Descrição sanitizada do erro", "requestId": "a1b2c3d4e5f6g7h8" }
```

---

## Safeguards (OWASP)

| Categoria | Implementação |
|-----------|---------------|
| **CORS** | Whitelist: `localhost:3000`, `localhost:5173`, `192.168.1.3:3000`, `*.vercel.app`, `www.igrejademetatron.com.br`. Non-prod aceita qualquer. |
| **Headers** | `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Cache-Control: no-store, no-cache` |
| **Validação** | pageId ∈ whitelist, language ∈ `[pt-BR, en-US]`, texto ≤ 5000 chars, json_key ≤ 255 chars |
| **Limites** | Body ≤ 100KB, DELETE ≤ 1000 IDs, Timeout 30s |
| **SQL awareness** | Detecta padrões `/[;\-\-]/g` + Supabase ORM |
| **Sanitização** | `sanitizeError()` remove detalhes internos de DB/network |
| **Hash** | SHA-256 antes/depois para evitar writes desnecessários |
| **Request ID** | `crypto.randomBytes(8).toString('hex')` — header `X-Request-ID` + respostas |
| **Logging** | JSON com timestamp, level, service name, request ID, duração |
| **Scope DELETE** | Confirma `page_id = pageId` além do `id` |

---

## Schema do Banco — `text_entries`

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `id` | `uuid` / `bigint` | Primary key |
| `page_id` | `text` | Parte do unique constraint |
| `json_key` | `text` | Parte do unique constraint. Notação flat: `hero.title`, `treatments[0].title` |
| `content` | `jsonb` | Sempre objeto: `{ "pt-BR": "...", "en-US": "..." }` |
| `updated_at` | `timestamp` | Atualizado em cada upsert |

**Unique constraint:** `(page_id, json_key)`

### Formatos de JSON Key

| Formato | Exemplo | Semântica |
|---------|---------|-----------|
| Dot notation | `hero.title` | Objetos aninhados |
| Bracket notation | `treatments[0].title` | Arrays com índice numérico |
| Misto | `valores.cards[7].content` | Objeto → array → objeto |

**IMPORTANTE:** `values.0.title` (ponto com número) cria objetos `{0: {title: ...}}`, NÃO arrays. Apenas `values[0].title` (bracket) cria arrays reais. Bracket notation é canônica para arrays.
