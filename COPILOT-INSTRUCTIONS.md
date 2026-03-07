# INSTRUÇÕES PARA AGENTES DE INTELIGÊNCIA ARTIFICIAL

> **Leitura obrigatória ao iniciar qualquer sessão de trabalho.**
> Regras condensadas abaixo; detalhes completos nos `.cursor/rules/*.mdc` (carregados automaticamente) e em `docs/`.
> Última atualização: 07/03/2026

---

# REGRAS PÉTREAS — IMUTÁVEIS

**Estas regras NÃO PODEM ser removidas ou flexibilizadas sem autorização explícita do usuário.**

Cada regra tem uma referência ao arquivo `.mdc` que a detalha. Os `.mdc` são carregados automaticamente pelo Cursor; este documento serve como referência autoritativa e visão geral unificada.

## 1. Propósito do Projeto

Site institucional da **Igreja de Metatron** com edição dinâmica de conteúdo multilíngue (pt-BR + en-US), armazenado em Supabase, interface React.

**Missão do conteúdo:** A cura e realização espiritual completa requer regulação homeostática do sistema nervoso autônomo. Traumas intensos fixam padrões disfuncionais; o trabalho da Igreja reverte essa condição como base para avanço espiritual.

## 2. Proteção de Dados (MÁXIMA PRIORIDADE)

> Detalhes: `.cursor/rules/igreja-metatron-data-protection.mdc`

- NUNCA modificar/remover dados no Supabase sem autorização explícita
- NUNCA executar PUT/POST/DELETE sem mostrar exatamente o que será enviado
- NUNCA enviar atualizações parciais que destruam traduções existentes
- Apenas sugerir melhorias, nunca aplicar autonomamente
- Validar estrutura completa antes de enviar; confirmar backup existe

## 3. Sistema Multilíngue (CRÍTICO)

> Detalhes: `.cursor/rules/igreja-metatron-data-protection.mdc`

Idiomas: **pt-BR** (primário) + **en-US**. Formato obrigatório:

```json
{ "pt-BR": "Texto em português", "en-US": "Text in English" }
```

- `newText` em PUT DEVE ser objeto, nunca string plana
- Cada campo DEVE conter ambos os idiomas (usar `""` se tradução ausente)
- API faz merge inteligente: enviar só pt-BR preserva en-US existente

## 4. Gestão de Documentação

**Ao iniciar sessão:** Ler este documento + consultar `docs/` conforme necessidade.

**Ao modificar documentos:**
- Reler integralmente antes de modificar
- Reescrever seções do zero quando necessário para evitar incoerências
- Não usar nomes genéricos; não inserir listas hardcoded de dados que mudam

## 5. Padrões de Código

> Detalhes: `.cursor/rules/igreja-metatron-editablefield-itcss.mdc`

**EditableField:** NUNCA usar `??` ou fallback hardcoded em `value`. Campos ausentes devem aparecer como "FALTANDO".

**Qualidade:** Código limpo, modular, com tratamento de erros completo. Soluções definitivas, não temporárias.

**Segurança:** Validação de inputs, proteção XSS/CSRF/SQL Injection. API já possui safeguards OWASP.

## 6. Scripts e Servidor

> Detalhes: `.cursor/rules/igreja-metatron-scripts-server.mdc`

- SEMPRE usar `start-dev.ps1` / `stop-dev.ps1` com caminho absoluto
- NUNCA iniciar manualmente com `npx vite`, `npm run dev` etc.
- Diretório de trabalho: `workspace/shadcn-ui/`

## 7. Configuração Crítica (IMUTÁVEL)

> Detalhes: `.cursor/rules/igreja-metatron-scripts-server.mdc`

**Não alterar sem autorização:** `vite.config.ts` (apiPlugin), `vercel.json`, `api/content/[pageId].js`.

## 8. ITCSS (IMUTÁVEL)

> Detalhes: `.cursor/rules/igreja-metatron-editablefield-itcss.mdc`

- Sem estilos inline (`style={{...}}`) em React
- CSS apenas na estrutura ITCSS (`src/styles/`)
- Usar variáveis CSS (`var(--gold-500)`), não valores hardcoded

## 9. Encoding UTF-8 (IMUTÁVEL)

> Detalhes: `.cursor/rules/igreja-metatron-encoding.mdc`

Todo o projeto opera em **UTF-8 sem BOM**. Violações corrompem dados multilíngues (U+FFFD).

---

# CONTEXTO TÉCNICO

## Stack

| Camada | Tecnologia |
|--------|------------|
| Frontend | React 19 + TypeScript + Vite 7 + Tailwind CSS 4 + React Router |
| UI | Radix UI + shadcn/ui + TipTap 3 (editor rico) |
| Backend | Vercel Serverless Functions (CJS) |
| Database | Supabase PostgreSQL — tabela `text_entries` com JSONB multilíngue |
| Deploy | Vercel (prod), Vite + `apiPlugin()` (dev) |
| URL prod | `https://shadcn-ui-silk-sigma.vercel.app/` |
| CSS | ITCSS + Tailwind v4 (sintaxe: `bg-linear-to-r`, não `bg-gradient-to-r`) |
| Package | pnpm (Vercel) / npm (Windows local — pnpm falha por bug WMI) |

## Arquitetura — Fluxo de Dados

**Leitura:**
```
Página → usePageContent(pageId) → GET /api/content/{pageId}?language=
  → Supabase SELECT → reconstructObjectFromEntries() → JSON aninhado
  → Hook extrai idioma → merge com PendingEditsContext → renderiza
```

**Escrita (Editor Visual):**
```
Usuário edita campo no VisualPageEditor → PendingEditsContext
  → PUT /api/content/{pageId} { edits: { "key": { newText: { pt-BR, en-US } } } }
  → API: validate → fetch existing → merge → hash compare → UPSERT
```

> Fluxo detalhado do editor visual: `docs/HOOKS-REFERENCE.md`

## Hooks Principais

| Hook / Context | Papel |
|----------------|-------|
| `usePageContent<T>(pageId)` | **Preferido.** Carrega conteúdo + merge de edições pendentes |
| `useContent({ pages: [...] })` | Hook universal para múltiplas páginas |
| `useNavigationLabels()` | Labels traduzidos do menu (navigation.ts + API) |
| `LanguageContext` | `{ language, setLanguage }`. Persiste em localStorage |
| `ContentCacheContext` | Invalidação de cache por pageId |
| `PendingEditsContext` | Edições não salvas do editor visual |

> Assinaturas e uso detalhado: `docs/HOOKS-REFERENCE.md`

## Navegação — Fonte Única de Verdade

> Detalhes: `.cursor/rules/igreja-metatron-navigation-tailwind.mdc`

| Camada | Arquivo | Papel |
|--------|---------|-------|
| Estática | `src/config/navigation.ts` | Fonte de verdade: `navigationItems[]`, `ALL_VALID_PAGE_IDS` |
| Dinâmica | `useNavigationLabels()` | Combina navigation.ts + traduções da API (`__navigation__`) |

A API (CJS) mantém cópia própria de `VALID_PAGE_IDS`. Ao adicionar/remover páginas, atualizar em AMBOS os locais.

## Conteúdo Compartilhado (`__shared__`)

`page_id = "__shared__"` armazena **apenas dados do footer** (5 registros). Carregado independentemente por `SharedFooter.tsx` via `usePageContent('__shared__')`. Páginas NÃO devem incluir `__shared__` nos seus hooks.

## Estrutura de Pastas

```
workspace/shadcn-ui/                    # RAIZ DO PROJETO
├── api/content/[pageId].js             # Handler API (~1100 linhas, CJS)
├── src/
│   ├── components/                     # UI: VisualPageEditor, SharedFooter, EditableField...
│   │   ├── ui/                         # shadcn/ui (Button, Card, Accordion...)
│   │   └── icons/                      # Ícones customizados
│   ├── contexts/                       # Language, ContentCache, PendingEdits, LocalEdits
│   ├── hooks/                          # useContent, useNavigationLabels, usePageStyles
│   ├── pages/                          # Index, QuemSomos, Tratamentos, Purificacao...
│   ├── styles/                         # ITCSS (settings → base → components → layouts → utilities)
│   ├── config/navigation.ts            # FONTE ÚNICA: items do menu, page_ids, rotas
│   └── lib/                            # Utilitários (cn(), etc.)
├── scripts/                            # Backup, restore, deploy, auditoria
├── docs/                               # Documentação técnica detalhada
├── vite.config.ts                      # CRÍTICO — contém apiPlugin()
├── vercel.json                         # Deploy config
└── start-dev.ps1 / stop-dev.ps1       # OBRIGATÓRIO usar para start/stop
```

## Páginas e page_ids

| page_id | Componente | Descrição |
|---------|-----------|-----------|
| `index` | Index.tsx | Página principal — hero, missão, valores, testemunhos |
| `quemsomos` | QuemSomos.tsx | Sobre a Igreja — história, valores |
| `tratamentos` | Tratamentos.tsx | Serviços terapêuticos |
| `artigos` | Artigos.tsx | Blog — categorias, listagem |
| `contato` | Contato.tsx | Formulário de contato |
| `purificacao` | Purificacao.tsx | Processo de purificação espiritual |
| `notfound` | NotFound.tsx | Página 404 |
| `testemunhos` | Testemunhos.tsx | Testemunhos |
| `__shared__` | SharedFooter.tsx | Footer (5 registros) |
| `__navigation__` | (config) | Labels traduzidos do menu + texto do logo |

Estes são os ÚNICOS `page_id` aceitos pela API. Lista canônica: `src/config/navigation.ts`.

---

# API — REFERÊNCIA RÁPIDA

> Documentação completa: `docs/API-REFERENCE.md`

**Endpoint:** `/api/content/:pageId` (GET, PUT, DELETE, OPTIONS)

**GET:** `?language=pt-BR` → strings planas | sem param → objetos `{pt-BR, en-US}`

**PUT body:**
```json
{ "edits": { "hero.title": { "newText": { "pt-BR": "...", "en-US": "..." } } } }
```
- `newText` DEVE ser objeto (nunca string)
- Merge inteligente: enviar só pt-BR preserva en-US existente
- Hash SHA-256: se conteúdo idêntico → no-op
- Keys `__shared__.x` → page_id `__shared__`, key `x`

**Banco (text_entries):** `page_id` + `json_key` (unique), `content` (JSONB: `{pt-BR, en-US}`)

---

# CONVENÇÕES

## JSON Keys e `data-json-key`

| Contexto | Formato | Exemplo |
|----------|---------|---------|
| HTML/JSX (`data-json-key`) | `{pageId}.{path}` | `index.hero.title` |
| API PUT body | `{path}` ou `{pageId}.{path}` | `hero.title` |
| Banco (json_key) | `{path}` apenas | `hero.title` |
| Conteúdo shared | `__shared__.{path}` no PUT | `__shared__.footer.copyright` |

## Tailwind CSS v4

> Detalhes: `.cursor/rules/igreja-metatron-navigation-tailwind.mdc`

| v3 (INCORRETO) | v4 (CORRETO) |
|-----------------|--------------|
| `bg-gradient-to-r` | `bg-linear-to-r` |
| `w-[700px]` | `w-175` (700/4) |

Preferir classes numéricas Tailwind v4 ao invés de valores arbitrários `[Xpx]`.

## Design System

Index usa `.ds-new` com variáveis `--ds-*` (gold, sage, navy). Cada página pode ter tema próprio mas deve manter coerência visual.

---

# DOCUMENTAÇÃO DETALHADA — LEITURA OBRIGATÓRIA

**O agente DEVE ler os documentos auxiliares abaixo ao iniciar a sessão ou quando a tarefa envolver o domínio correspondente.** Este arquivo contém apenas regras e contexto resumido; os detalhes técnicos completos estão distribuídos nos documentos a seguir.

| Documento | Conteúdo | Quando ler |
|-----------|----------|------------|
| `docs/API-REFERENCE.md` | API completa: GET, PUT, DELETE, safeguards, schema, exemplos | Qualquer tarefa que envolva a API, banco de dados ou conteúdo |
| `docs/HOOKS-REFERENCE.md` | Hooks, contexts, editor visual — assinaturas e uso | Qualquer tarefa em componentes React, páginas ou editor |
| `docs/DEVELOPMENT.md` | Vite apiPlugin, deploy Vercel, scripts, troubleshooting | Setup, build, deploy, debugging, scripts |
| `docs/BACKUP-SYSTEM.md` | Sistema de backup — como funciona, como usar | Backup, restore, operações destrutivas |
| `docs/ARTIGOS.md` | Sistema de artigos/blog | Página de artigos, categorias, blog |
| `docs/ENVIRONMENT-SETUP.md` | Setup do ambiente de desenvolvimento | Configuração inicial, dependências |

---

**Status (mar/2026):** Sistema multilíngue pt-BR/en-US operacional — 0 campos corrompidos, ~1016 keys traduzidas, safeguards OWASP ativos, editor visual com edição cross-page, deploy via Vercel.
