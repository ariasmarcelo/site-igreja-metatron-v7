# INSTRUÇÕES PARA AGENTES DE INTELIGÊNCIA ARTIFICIAL

> **Este documento é leitura obrigatória ao iniciar qualquer sessão de trabalho.**
> Contém regras invioláveis, contexto do projeto e diretrizes operacionais.
> Última atualização: 17/02/2026

---

# REGRAS PÉTREAS - IMUTÁVEIS

**Definição:** Estas regras NÃO PODEM ser removidas, flexibilizadas ou modificadas sem autorização explícita do usuário. Violação equivale a falha crítica.

## 1. Propósito do Projeto

Site institucional para a **Igreja de Metatron** com sistema de edição dinâmica de conteúdo textual multilíngue, armazenado em Supabase e acessível via interface React.

**Missão do conteúdo:** Expressar que a cura e realização espiritual completa requer, primeiramente, regulação homeostática e equilíbrio harmônico do sistema nervoso autônomo. Traumas intensos ativam excessivamente os sistemas de defesa, bloqueando canais internos e fixando padrões disfuncionais. O trabalho da Igreja foca em reverter essa condição como base para avanço espiritual verdadeiro.

## 2. Proteção de Dados do Banco (MÁXIMA PRIORIDADE)

**Os dados no Supabase são hipersensíveis e representam meses de trabalho curado manualmente.**

**Proibições absolutas:**
- NUNCA modificar, remover ou sobrescrever textos/dados do banco sem consulta e autorização explícita do usuário
- NUNCA executar operações de PUT/POST/DELETE na API sem antes mostrar exatamente o que será enviado
- NUNCA enviar atualizações parciais que possam destruir traduções existentes em outros idiomas
- Apenas sugerir melhorias de conteúdo, nunca aplicar autonomamente

**Obrigações:**
- Antes de qualquer operação de escrita, fazer backup ou confirmar que existe backup recente
- Validar a estrutura completa dos dados antes de enviar (todas as línguas presentes)
- Ao trabalhar com traduções, sempre preservar idiomas existentes que não estão sendo alterados

## 3. Sistema Multilíngue (CRÍTICO)

O site opera em **pt-BR** (primário) e **en-US**. Os dados no banco seguem estrutura multilíngue obrigatória.

**Formato dos dados no Supabase:**
```json
{
  "json_key": "hero.title",
  "page_id": "index",
  "text": {
    "pt-BR": "Texto em português",
    "en-US": "Text in English"
  }
}
```

**Regras invioláveis para operações de escrita:**
- Cada campo `text` DEVE conter AMBOS os idiomas: `pt-BR` e `en-US`
- PUT parcial (apenas um idioma) deve PRESERVAR o outro idioma existente no banco
- A API possui safeguards que fazem merge inteligente: ao enviar apenas `pt-BR`, o `en-US` existente é mantido
- NUNCA enviar string pura onde se espera objeto multilíngue (ex: `"texto"` em vez de `{"pt-BR": "texto", "en-US": "text"}`)
- Se uma tradução não existe ainda, deixar como string vazia `""` ou marker `"<EMPTY>"`, nunca omitir a chave do idioma

**Formato de PUT para a API:**
```json
{
  "edits": {
    "hero.title": {
      "newText": {
        "pt-BR": "Novo título",
        "en-US": "New title"
      }
    }
  }
}
```

**Documentação detalhada:** `docs/API-SAFEGUARDS*.md`, `docs/GRANULAR-FALLBACK-SYSTEM-V2.md`

## 4. Gestão de Documentação

**Ao iniciar sessão:**
- Ler este documento completamente
- Consultar documentos relevantes em `docs/` conforme necessidade da tarefa
- Compreender o estado atual do projeto antes de agir

**Ao modificar documentos:**
- Reler documento integralmente antes de modificar
- Reescrever seções do zero quando necessário para evitar incoerências
- Manter estilo de escrita profissional
- Corrigir erros de digitação encontrados
- Não usar nomes genéricos (dev, server): usar nomes descritivos
- Não inserir listas hardcoded de dados que mudam: orientar conceitualmente onde buscar

## 5. Padrões de Código

**Qualidade:**
- Código limpo e modular
- Comentários claros e consistentes
- Tratamento de erros completo
- Documentação: comentários, API docs, guias

**Performance e Segurança:**
- Otimização: complexidade algorítmica, recursos, cache, escalabilidade
- Segurança: validação e sanitização de inputs, proteção XSS/CSRF/SQL Injection
- A API já possui safeguards OWASP implementados (ver `api/content/[pageId].js`)

**Revisão:**
- Análise criteriosa: bugs, vulnerabilidades, ineficiências
- Questionar incoerências comportamentais
- Buscar soluções definitivas, evitar soluções temporárias

## 6. Scripts e Automação

**Obrigações:**
- Localizar e analisar scripts existentes antes de criar novos
- Para iniciar ou reiniciar o servidor, SEMPRE usar o script com caminho absoluto:
  ```powershell
  & "d:\SiteIgrejaMeatron\site-igreja-v7\workspace\shadcn-ui\start-dev.ps1"
  ```
- Para parar o servidor, usar `stop-dev.ps1` com caminho absoluto
- NUNCA iniciar o servidor manualmente com `npx vite`, `npm run dev` ou comandos avulsos
- Verificar caminhos antes de executar comandos (diretório de trabalho correto)
- Nunca inserir emojis ou caracteres especiais em scripts
- O diretório de trabalho para todos os comandos deve ser `workspace/shadcn-ui/`

## 7. Configuração Crítica do Servidor (IMUTÁVEL)

**NUNCA REMOVER OU MODIFICAR SEM AUTORIZAÇÃO EXPLÍCITA**

O projeto usa **Vite com plugin customizado `apiPlugin()`** para servir APIs serverless localmente.

**Arquivos críticos que não devem ser alterados sem autorização:**
1. `vite.config.ts` - DEVE conter `apiPlugin()` completo
2. `vercel.json` - configuração de deploy e funções serverless
3. `api/content/[pageId].js` - handler principal da API com safeguards

**O que o plugin `apiPlugin()` faz:**
- Intercepta requisições `/api/*` no Vite dev server
- Mapeia rotas dinâmicas (ex: `/api/content/index` para `api/content/[pageId].js`)
- Executa serverless functions localmente sem necessidade do Vercel CLI
- Permite acesso via localhost E IP local (host: `0.0.0.0`)

**Se removido ou corrompido:** APIs retornam 404 ou HTML em vez de JSON, site não carrega conteúdo do banco.

## 8. Arquitetura CSS - ITCSS (IMUTÁVEL)

**Proibições absolutas:**
- Estilos inline (`style={{...}}`) em componentes React
- Arquivos CSS fora da estrutura ITCSS
- Caminhos de import incorretos

**Estrutura obrigatória:**
```
src/styles/
  settings/    # 1. Variáveis CSS e design tokens
  base/        # 2. Estilos HTML base (body, h1-h6)
  components/  # 3. Componentes reutilizáveis
  layouts/     # 4. Layouts e páginas (subpasta pages/)
  utilities/   # 5. Classes utilitárias
```

**Ordem de especificidade:** Settings - Base - Components - Layouts - Utilities (genérico para específico)

**Ponto de entrada:** `src/styles.css` (importado em `main.tsx`)

**Padrões de import em componentes React:**
```tsx
import '@/styles/layouts/pages/nome-pagina.css'
import '@/styles/components/nome-componente.css'
```

**Nomenclatura de classes:** BEM ou utility (`.card-elevated`, `.btn-gold`)

**Checklist ao adicionar CSS:**
1. Arquivo no diretório correto da estrutura ITCSS?
2. Importado em `styles.css` na ordem correta?
3. Usa variáveis CSS (`var(--gold-500)`) em vez de valores hardcoded?
4. Import correto no componente React?
5. Sem estilos inline?

**Documentação:** `src/styles/README.md`, `src/styles/QUICK-GUIDE.md`, `src/styles/SUMMARY.md`

## 9. Encoding UTF-8 (IMUTÁVEL)

Todo o projeto opera exclusivamente em **UTF-8 sem BOM**. Violações de encoding corrompem dados multilíngues com acentos (pt-BR) e são difíceis de reverter.

**Proibições absolutas:**
- NUNCA usar `Out-File` do PowerShell sem `-Encoding utf8` (o padrão do PS 5.1 é UTF-16LE)
- NUNCA salvar arquivos JSON em encoding diferente de UTF-8 (sem BOM)
- NUNCA ler arquivos com `fs.readFileSync(path, 'utf8')` sem antes verificar/tratar BOM
- NUNCA sobrescrever o header `Content-Type` da API sem incluir `charset=utf-8`

**Obrigações ao criar ou modificar arquivos de dados:**
- Todo arquivo `.json` deve estar em UTF-8 sem BOM
- Ao gerar JSON via PowerShell, usar: `| Out-File -Encoding utf8NoBOM` (PS 7+) ou `[System.IO.File]::WriteAllText($path, $json, [System.Text.UTF8Encoding]::new($false))`
- Ao ler JSON em Node.js, usar a função `readJSON()` de `intelligent-put-update.cjs` como referência (detecta BOM automaticamente)
- Ao exportar dados da API via terminal, nunca usar pipe para `Out-File` sem encoding explícito

**Regras para o plugin `apiPlugin()` em `vite.config.ts`:**
- O mock `vercelRes.json()` NÃO deve sobrescrever `Content-Type` se a API já o definiu
- Se precisar definir, usar sempre `'application/json; charset=utf-8'`

**Regras para scripts de tradução/dados:**
- Scripts que leem `index-content-TRANSLATED.json` ou `index-content.json` devem usar detecção de BOM
- Todo `http.request()` que envia JSON deve incluir header `'Content-Type': 'application/json; charset=UTF-8'`
- Sempre usar `Buffer.byteLength(body, 'utf8')` para `Content-Length`, nunca `body.length`

**Arquivo de referência para leitura segura de JSON:** `intelligent-put-update.cjs` (função `readJSON()`)

# FIM DAS REGRAS PÉTREAS

---

# CONTEXTO TÉCNICO DO PROJETO

## Stack Tecnológica

| Camada | Tecnologia | Versão |
|--------|------------|--------|
| Frontend | React + TypeScript + Vite + Tailwind CSS + React Router | React 19.2, Vite 7.2, Tailwind 4.1 |
| UI Components | Radix UI + shadcn/ui + TipTap (editor rico) | TipTap 3.10 |
| Backend | Vercel Serverless Functions (Node.js, CommonJS) | — |
| Database | Supabase PostgreSQL — tabela `text_entries` com JSONB multilíngue | supabase-js 2.81 |
| Deploy | Vercel (produção), Vite dev server com `apiPlugin()` (desenvolvimento) | — |
| URL de Produção | `https://shadcn-ui-silk-sigma.vercel.app/` | — |
| Package Manager | pnpm (Vercel/produção) / npm (Windows local — ver nota abaixo) | — |
| TypeScript | Strict mode parcial (`noImplicitAny: false`, `strictNullChecks: false`) | 5.9 |
| CSS | Tailwind CSS v4 (sintaxe canônica: `bg-linear-to-r`, não `bg-gradient-to-r`) | 4.1 |

## Arquitetura do Sistema

### Fluxo de Dados — Leitura

```
Página React carrega
  → hook usePageContent('index') — atalho preferido (ou useContent para múltiplas pages)
    → GET /api/content/index?language=pt-BR  (paralelo para cada page)
      → Supabase: SELECT page_id, json_key, content FROM text_entries WHERE page_id IN (...)
        → API reconstrói JSON aninhado via reconstructObjectFromEntries()
          → Retorna { content, languageMetadata, languageStatus }
            → Hook extrai idioma solicitado recursivamente
              → usePageContent mescla edições pendentes (PendingEditsContext)
                → Componente renderiza com fallback via operador ||
```

### Fluxo de Dados — Escrita (Editor Visual)

```
Usuário edita campo no Editor Visual (VisualPageEditor.tsx)
  → PUT /api/content/index
    Body: { edits: { "hero.title": { newText: { "pt-BR": "...", "en-US": "..." } } } }
      → API validateInput() + validateMultilingualIntegrity()
        → Para cada key: fetch existing → merge inteligente → hash comparison
          → Se mudou: Supabase UPSERT (page_id, json_key) → cleanup legacy keys
            → Resposta com updateLog detalhado por key
```

### Editor Visual

Ativado via Admin Console (`/436F6E736F6C45`, componente `VisualPageEditor.tsx`). Detecta atributo `data-json-key` nos elementos HTML. Usa componente `EditableField` para rendering + edição inline.

**`extractSourcePageId(jsonKey)`** — extrai page_id de destino do formato `"{pageId}.{rest}"`. Ex: `"__shared__.footer.copyright"` → `{ sourcePageId: "__shared__", cleanKey: "footer.copyright" }`. Permite **edição cross-page** (editar campos de `__shared__` ou `testemunhos` enquanto visualiza outra página).

**Fluxo de edição:**
1. Usuário edita campo → `setPendingEdit(sourcePageId, cleanKey, ptValue, enValue)` via `PendingEditsContext`
2. `usePageContent` mescla automaticamente as edições pendentes nos dados renderizados (preview imediato, sem DOM manipulation)
3. Ao salvar → edições agrupadas por `sourcePageId` → PUT separado para cada page_id afetado
4. Após salvar → `clearPendingEdits()` + `invalidateCache()` para refetch

### Conteúdo Compartilhado (`__shared__`)

`page_id = "__shared__"` armazena **apenas dados do footer** (5 registros). Cada página carrega seu próprio page_id; `__shared__` é carregado independentemente por `SharedFooter.tsx` via `usePageContent('__shared__')`. **Páginas NÃO devem mais incluir `__shared__` nos seus hooks** — o footer cuida de si mesmo.

> Histórico: `__shared__` era um "saco de lixo" com 144 registros misturados (testimonials, triplaProtecao, etc.). Todos foram migrados para seus page_ids corretos em fev/2026. Não adicionar dados novos em `__shared__` sem justificativa forte.

### Navegação e Traduções — Fonte Única de Verdade

**REGRA: Todos os itens do menu de navegação são definidos em um ÚNICO local.**

O sistema de navegação opera em 2 camadas:

| Camada | Arquivo | Papel |
|--------|---------|-------|
| **Estática** | `src/config/navigation.ts` | Fonte de verdade. Define `navigationItems[]` (id, href, nome PT-BR), `specialPageIds`, `ALL_VALID_PAGE_IDS` |
| **Dinâmica** | `useNavigationLabels()` hook | Combina navigation.ts + traduções da API (`__navigation__`). Fallback automático para PT-BR |

**`src/config/navigation.ts`** exporta:
- `navigationItems` — itens do menu superior (ordem, rotas, nomes PT-BR como fallback)
- `specialPageIds` — page_ids válidos que NÃO estão no menu (`artigos`, `notfound`, `__shared__`, `__navigation__`)
- `ALL_VALID_PAGE_IDS` — união dos dois acima (lista completa para validação)
- `routeNameMap` — mapa `href → nome PT-BR` derivado automaticamente

**`useNavigationLabels()`** (hook React) retorna:
- `navigation[]` — `{ id, href, label }` com labels traduzidos para o idioma ativo
- `logo` — `{ title, subtitle }` traduzidos
- `loading` — estado de carregamento

**Quem consome o quê:**

| Consumidor | O que importa | Por quê |
|------------|---------------|----------|
| `Navigation.tsx` (menu) | `useNavigationLabels()` | Renderiza items traduzidos |
| `Navigation.tsx` (`PageTitleManager`) | `useNavigationLabels()` | `document.title` traduzido |
| `AdminConsole.tsx` | `navigationItems` + `useNavigationLabels()` | Tabs do editor |
| `api/content/[pageId].js` | Cópia CJS de `VALID_PAGE_IDS` | Whitelist de segurança — CJS não importa .ts |

**A API serverless (CJS) NÃO pode importar navigation.ts.** Mantém sua própria cópia de `VALID_PAGE_IDS` com comentário de sincronia. Ao adicionar/remover páginas, **atualizar nos dois lugares**: `navigation.ts` E `api/content/[pageId].js`.

**PROIBIÇÃO:** Criar listas de navegação hardcoded em outros arquivos. Se precisa de items de menu → importar de `navigation.ts`. Se precisa de labels traduzidos → usar `useNavigationLabels()`. Se é código CJS/serverless → manter cópia sincronizada com comentário explícito.

---

## Estrutura de Pastas

```
workspace/shadcn-ui/                    # RAIZ DO PROJETO (diretório de trabalho obrigatório)
├── api/
│   └── content/
│       └── [pageId].js                 # Handler principal — GET, PUT, DELETE (~1100 linhas)
├── src/
│   ├── components/
│   │   ├── ui/                         # shadcn/ui components (Button, Card, Accordion, etc.)
│   │   ├── icons/                      # Ícones customizados
│   │   ├── VisualPageEditor.tsx        # Editor visual principal
│   │   ├── SharedFooter.tsx            # Footer compartilhado entre páginas
│   │   ├── FooterBackground.tsx        # Background SVG do footer
│   │   ├── TestimonialsCarousel.tsx    # Carrossel de testemunhos
│   │   ├── TiptapEditor.tsx            # Editor rico TipTap
│   │   ├── ArtigosEditor.tsx           # Editor específico para artigos
│   │   ├── WhatsAppButton.tsx          # Botão flutuante WhatsApp
│   │   ├── PageLoading.tsx             # Loading state das páginas
│   │   └── PageLoader.tsx              # Loader genérico
│   ├── contexts/
│   │   ├── LanguageContext.tsx          # Idioma ativo (pt-BR/en-US), persiste em localStorage
│   │   ├── ContentCacheContext.tsx      # Invalidação de cache por página
│   │   ├── PendingEditsContext.tsx      # Edições pendentes (não salvas) do editor visual
│   │   └── LocalEditsContext.tsx        # Overrides locais para preview antes de salvar
│   ├── hooks/
│   │   ├── useContent.ts               # Hook universal + usePageContent (com merge de edições pendentes)
│   │   ├── useNavigationLabels.ts      # Labels traduzidos do menu (navigation.ts + API)
│   │   ├── useFillEmptyFields.ts       # Preenchimento de campos vazios
│   │   ├── useLocaleTexts.ts           # Extração de textos por idioma
│   │   ├── useEditableContent.ts       # Suporte ao editor visual
│   │   └── usePageStyles.ts            # Estilos por página
│   ├── pages/
│   │   ├── Index.tsx                   # Página principal (page_id: index)
│   │   ├── QuemSomos.tsx              # Sobre a Igreja (page_id: quemsomos)
│   │   ├── Tratamentos.tsx            # Serviços oferecidos (page_id: tratamentos)
│   │   ├── Artigos.tsx                # Blog / artigos (page_id: artigos)
│   │   ├── ArtigoDetalhes.tsx         # Detalhe de artigo individual
│   │   ├── ArtigosCategoria.tsx       # Artigos por categoria
│   │   ├── Contato.tsx                # Formulário de contato (page_id: contato)
│   │   ├── Purificacao.tsx            # Processo de purificação (page_id: purificacao)
│   │   ├── Testemunhos.tsx            # Testemunhos (page_id: testemunhos)
│   │   ├── NotFound.tsx               # Página 404 (page_id: notfound)
│   │   ├── Admin.tsx                  # Área administrativa
│   │   ├── AdminConsole.tsx           # Console do editor visual
│   │   ├── SharedContent.tsx          # Admin: edição do footer (__shared__)
│   │   ├── NavigationContent.tsx      # Admin: edição do menu (__navigation__)
│   │   └── IconGallery.tsx            # Galeria de ícones Lucide
│   ├── styles/                        # ITCSS — ver Regras Pétreas §8
│   ├── config/
│   │   └── navigation.ts               # FONTE ÚNICA: items do menu, page_ids, rotas
│   ├── locales/                       # Arquivos de localização estáticos
│   ├── types/                         # TypeScript type definitions
│   └── lib/                           # Utilitários (cn(), etc.)
├── scripts/                           # Automação: backup, restore, deploy, auditoria
├── docs/                              # Documentação técnica (3 ativos)
├── backups/                           # Backups locais do banco de dados (gitignored)
├── _archive/                          # Arquivo morto de scripts e docs obsoletos (gitignored)
├── public/                            # Assets estáticos (imagens, fontes, favicons)
├── vite.config.ts                     # Config Vite + apiPlugin() customizado
├── vercel.json                        # Deploy config (rewrites, functions)
├── start-dev.ps1                      # Script para iniciar dev server
└── package.json                       # type: "module", scripts, deps
```

## Páginas e page_ids Válidos

| page_id | Componente | Descrição |
|---------|-----------|-----------|
| `index` | Index.tsx | Página principal — hero, missão, valores, testemunhos |
| `quemsomos` | QuemSomos.tsx | Sobre a Igreja — história, valores, equipe |
| `tratamentos` | Tratamentos.tsx | Serviços terapêuticos — accordion com 7 tratamentos |
| `artigos` | Artigos.tsx | Blog — categorias, listagem, artigos individuais |
| `contato` | Contato.tsx | Formulário de contato, horários, localização |
| `purificacao` | Purificacao.tsx | Processo de purificação espiritual |
| `notfound` | NotFound.tsx | Página 404 |
| `testemunhos` | Testemunhos.tsx | Testemunhos — dados próprios (`page_id: testemunhos`) |
| `__shared__` | SharedFooter.tsx | Apenas footer (5 registros). Carregado pelo SharedFooter independentemente |
| `__navigation__` | (config) | Labels traduzidos do menu + texto do logo. Consumido por `useNavigationLabels()` |

**ATENÇÃO:** Estes são os ÚNICOS `page_id` aceitos pela API. A lista canônica está em `src/config/navigation.ts` (`ALL_VALID_PAGE_IDS`). A API mantém cópia CJS sincronizada. Qualquer outro valor é rejeitado com 400.

---

# API — DOCUMENTAÇÃO COMPLETA

## Endpoint Único

**Arquivo:** `api/content/[pageId].js` (~1100 linhas, CommonJS)

**URL base:** `/api/content/:pageId`

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
      "title": { "pt-BR": "Igreja de Metatron", "en-US": "Church of Metatron" },
      "subtitle": { "pt-BR": "Cura e Transformação", "en-US": "Healing and Transformation" }
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

Gerado por `validateMultilingualIntegrity()` para CADA key no banco. Categorias de problemas detectados:

| Issue | Condição |
|-------|----------|
| `"en-US FALTANDO"` | A chave do idioma não existe no objeto `content` |
| `"en-US é null/undefined"` | Chave existe mas valor é null/undefined |
| `"en-US não é string"` | Valor não é string (tipo incorreto) |
| `"en-US está vazio"` | String vazia após `.trim()` |
| `"SUSPEITA: pt-BR e en-US são idênticos"` | Ambos idiomas têm texto igual (possível cópia sem tradução) |

**Uso prático para verificação:** Buscar `languageStatus.integrityWarnings` filtrados por `issues.includes('FALTANDO')` para encontrar traduções ausentes.

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
    "hero.subtitle": {
      "newText": {
        "pt-BR": "Nova subtítulo"
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
| **Merge inteligente** | Se enviar apenas `{ "pt-BR": "..." }`, o `en-US` existente no banco é PRESERVADO automaticamente |
| **Hash comparison** | Se o conteúdo após merge é idêntico ao existente (SHA-256), o write é IGNORADO (no-op) |
| **Processamento sequencial** | Keys são processadas uma a uma (recursivo), não em paralelo |
| **Keys `__shared__`** | Prefixo `__shared__.` no json_key → `page_id = "__shared__"`, prefixo removido da key |
| **Keys com prefixo de página** | `index.hero.title` → prefixo `index.` removido → key salva como `hero.title` |
| **Legacy key cleanup** | Após salvar, verifica se existe key legada `${pageId}.${jsonKey}`. Se sim: merge dados + delete legado |

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
      "intentionallyClearedLanguages": [],
      "finalState": {
        "pt-BR": "\"Novo título...\"",
        "en-US": "\"New title...\""
      },
      "integrityValid": true,
      "integrityIssues": []
    }
  ],
  "metadata": {
    "requestId": "a1b2c3d4e5f6g7h8",
    "duration": "456ms",
    "timestamp": "2026-02-16T12:00:00.000Z"
  }
}
```

### Exemplo Prático: Script Node.js para PUT

```javascript
const http = require('http');

function putContent(pageId, edits) {
  const body = JSON.stringify({ edits });
  return new Promise((resolve, reject) => {
    const req = http.request({
      hostname: 'localhost',
      port: 3000,
      path: `/api/content/${pageId}`,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
        'Content-Length': Buffer.byteLength(body, 'utf8')  // NUNCA usar body.length
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

// Uso:
await putContent('index', {
  'hero.title': {
    newText: { 'pt-BR': 'Novo título', 'en-US': 'New title' }
  }
});
```

### Exemplo Prático: PUT via PowerShell

```powershell
$ProgressPreference = 'SilentlyContinue'
$body = @{
  edits = @{
    "hero.title" = @{
      newText = @{
        "pt-BR" = "Novo título"
        "en-US" = "New title"
      }
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
{
  "ids": ["uuid-1", "uuid-2", 123]
}
```

### Regras

- `ids` deve ser array não-vazio, máximo 1000 elementos
- Cada ID pode ser `string` ou `number`
- DELETE confirma `page_id = pageId` para cada ID (proteção contra deleção cross-page)
- Processamento paralelo via `Promise.all`

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
| 400 | Validação falhou: `pageId` inválido, `language` inválido, `newText` não é objeto, campo muito longo |
| 404 | `pageId` válido mas sem dados no banco |
| 405 | Método HTTP não permitido (não é GET/PUT/DELETE/OPTIONS) |
| 413 | Body > 100KB |
| 429 | DELETE com > 1000 IDs |
| 500 | Erro interno (mensagem sanitizada, sem detalhes do DB) |
| 504 | Timeout (> 30 segundos) |

Formato de erro:
```json
{
  "success": false,
  "message": "Descrição sanitizada do erro",
  "requestId": "a1b2c3d4e5f6g7h8"
}
```

---

## Safeguards Completos (OWASP)

| Categoria | Implementação |
|-----------|---------------|
| **CORS** | Whitelist de origens: `localhost:3000`, `localhost:5173`, `192.168.1.3:3000`, `igreja-metatron.vercel.app`, `shadcn-ui-silk-sigma.vercel.app`, `www.igrejademetatron.com.br`. Em non-prod aceita qualquer. |
| **Headers de segurança** | `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Cache-Control: no-store, no-cache, must-revalidate, proxy-revalidate` |
| **Validação de input** | pageId ∈ whitelist, language ∈ `[pt-BR, en-US]` ou null, texto ≤ 5000 chars, json_key ≤ 255 chars |
| **Limite de body** | 100KB máximo (status 413) |
| **Timeout** | 30 segundos (status 504) |
| **Limite DELETE** | Máximo 1000 IDs por requisição (status 429) |
| **SQL awareness** | Detecta padrões `/[;\-\-]/g` em texto e loga warning (Supabase ORM provê proteção real) |
| **Sanitização de erros** | `sanitizeError()` remove detalhes internos de DB/network das respostas |
| **Hash de integridade** | SHA-256 antes/depois para evitar writes desnecessários |
| **Request ID** | `crypto.randomBytes(8).toString('hex')` — retornado no header `X-Request-ID` e em todas as respostas |
| **Logging estruturado** | JSON com timestamp, level, service name, request ID, duração |
| **Scope de DELETE** | Cada delete confirma `page_id = pageId` além do `id` |

---

## Schema do Banco de Dados

### Tabela: `text_entries`

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `id` | `uuid` / `bigint` | Primary key (usado em DELETE) |
| `page_id` | `text` | Parte do unique constraint. Valores: os 8 page_ids válidos |
| `json_key` | `text` | Parte do unique constraint. Notação flat: `hero.title`, `treatments[0].title` |
| `content` | `jsonb` | Sempre objeto: `{ "pt-BR": "...", "en-US": "..." }`. NUNCA string ou array |
| `updated_at` | `timestamp` | Atualizado em cada upsert |

**Unique constraint:** `(page_id, json_key)` — usado no `onConflict` do upsert.

### Formatos de JSON Key no Banco

| Formato | Exemplo | Semântica |
|---------|---------|-----------|
| **Dot notation** | `hero.title` | Objetos aninhados |
| **Bracket notation** | `treatments[0].title` | Arrays com índice numérico |
| **Misto** | `valores.cards[7].content` | Objeto → array → objeto |

**IMPORTANTE:** `values.0.title` (ponto com número) cria objetos `{0: {title: ...}}`, NÃO arrays. Apenas `values[0].title` (bracket) cria arrays reais. **Bracket notation é canônica para arrays.**

**Ambos formatos podem coexistir no banco** para a mesma entidade lógica (ex: `values.0.title` e `values[0].title`). Ao corrigir dados, é necessário atualizar AMBOS se ambos existirem.

---

# HOOKS E CONTEXTS — REFERÊNCIA RÁPIDA

## `useNavigationLabels()` — Menu e Títulos de Página

```typescript
interface UseNavigationLabelsReturn {
  navigation: { id: string; label: string; href: string }[];  // items traduzidos
  logo: { title: string; subtitle: string };                  // texto do logo
  loading: boolean;
}
```

- Busca `useContent({ pages: ['__navigation__'] })` para traduções
- Combina com `navigationItems` de `src/config/navigation.ts` como fallback
- Se API não responde → usa nomes PT-BR hardcoded (graceful degradation)
- Consumido por: `Navigation.tsx` (menu + `PageTitleManager`), `AdminConsole.tsx`

## `useContent<T>(options)` — Hook Principal

```typescript
interface UseContentOptions {
  pages: string[];        // page_ids para carregar (ex: ['index', '__shared__'])
  language?: Language;    // opcional, default = LanguageContext.language
  debug?: boolean;        // logging detalhado
}

interface UseContentReturn<T> {
  data: T | null;          // JSON aninhado organizado por page_id
  loading: boolean;
  error: string | null;
  debug?: { cacheHit: boolean; duration: number; source: string; language: string };
}
```

- Faz `GET /api/content/{pageId}?language={lang}` para cada page em paralelo (`Promise.all`)
- Extrai recursivamente o idioma solicitado dos objetos multilíngues
- Integra com `ContentCacheContext` para invalidação (refetch automático)

**Padrão de uso nas páginas (preferir `usePageContent` — ver abaixo):**
```tsx
// Padrão antigo (ainda funciona, mas sem merge de edições pendentes):
const { data: allData, loading, error } = useContent<any>({ pages: ['index'] });
const texts = allData?.index;
```

## `LanguageContext`

```typescript
{ language: 'pt-BR' | 'en-US', setLanguage: (lang) => void, isDarkLanguage: boolean }
```
- Inicializa de `localStorage('preferred_language')` → `navigator.language` → `"pt-BR"`
- Persiste em localStorage e atualiza `document.documentElement.lang`

## `ContentCacheContext`

```typescript
{ invalidateCache: (pageId: string) => void, invalidateAll: () => void, getInvalidationTime: (pageId: string) => number | null }
```
- Armazena `Map<string, number>` de pageId → timestamp de invalidação
- `invalidateAll` cobre os 8 page_ids conhecidos

## `PendingEditsContext` — Edições Pendentes (Não Salvas)

```typescript
{ setPendingEdit: (pageId, cleanKey, ptValue, enValue) => void, clearPendingEdits: (pageId?) => void, getPendingEditsForPage: (pageId) => Map<string, PendingEdit>, pendingVersion: number }
```
- Armazena edições pendentes feitas no VisualPageEditor antes de salvar no DB
- `setPendingEdit` registra uma edição; `pendingVersion` incrementa (trigger de re-render)
- `getPendingEditsForPage` retorna Map de cleanKey → `{ 'pt-BR': string, 'en-US': string }`
- `clearPendingEdits()` sem args: limpa TODAS as páginas. Com `pageId`: limpa apenas essa página
- Consumido por: `usePageContent` (merge automático), `VisualPageEditor.tsx` (escrita)
- Usa `useRef` para dados + `useState` para version (evita re-renders em cascata)

## `LocalEditsContext`

```typescript
{ setLocalEdit: (key, value) => void, clearLocalEdits: () => void, getValueWithOverride: (key, originalValue) => string }
```
- Preview local antes de salvar no banco (legado, mantido por compatibilidade)

---

## `usePageContent<T>(pageId, options?)` — Hook Preferido para Páginas

```typescript
function usePageContent<T>(pageId: string, options?: { includePages?: string[] }): {
  data: T | null; loading: boolean; error: string | null; debug?: object;
}
```

- Atalho para `useContent({ pages: [pageId, ...includePages] })` com merge automático de edições pendentes
- **Stage 1 — `pendingOverrides`:** `useMemo` que extrai do `PendingEditsContext` os valores do idioma ATUAL
- **Stage 2 — `mergedData`:** `useMemo` que mescla `pageData` + `pendingOverrides`
- Integra com `PendingEditsContext` via try/catch (funciona fora do admin sem erro)

**Padrão de uso recomendado:**
```tsx
// Simples (uma página):
const { data: texts, loading } = usePageContent<MyTexts>('purificacao');

// Com dados extras:
const { data, loading } = usePageContent('testemunhos', { includePages: ['__shared__'] });
```

- Consumido por: todas as páginas, `SharedFooter.tsx`, `TestimonialsCarousel.tsx`

---

# VITE CONFIG — `apiPlugin()`

O projeto usa um **plugin Vite customizado** que emula o ambiente Vercel Serverless localmente.

### O que faz:

1. Intercepta todas as requisições `/api/*` no dev server
2. Resolve o arquivo do handler:
   - `api/<path>/index.js` (pasta)
   - `api/<path>.js` (arquivo)
   - `api/<basePath>/[pageId].js` (rota dinâmica — extrai `pageId` do último segmento da URL)
3. Para POST/PUT: coleta body chunks e parseia JSON
4. Constrói shim `req/res` compatível com Vercel (`query`, `body`, `method`, `status()`, `json()`, `end()`, `setHeader()`)
5. Usa `import()` dinâmico com cache-busting (`?t=timestamp`) para hot-reload do handler
6. Erros são capturados e retornados como JSON 500

### Por que é CRÍTICO:

- **Se removido:** APIs retornam 404 ou HTML em vez de JSON → site não carrega conteúdo
- **Se `res.json()` sobrescrever Content-Type:** pode corromper encoding UTF-8 (ver Regras Pétreas §9)
- **Localização:** definido dentro de `vite.config.ts`, ANTES do plugin React

---

# DEPLOY — VERCEL

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

- **Dual install:** `pnpm install` para frontend + `cd api && pnpm install` para dependências do handler (supabase-js, etc.)
- **Rewrites:** Tudo que NÃO começa com `/api/` é redirecionado para `index.html` (SPA routing)
- **Functions:** Cada arquivo `.js` em `api/` vira uma serverless function com 1GB RAM e timeout de 10s

### Nota: pnpm vs npm no Windows Local

**O `pnpm install` falha silenciosamente no Windows** devido a um bug WMI (erro "Nó - NOVOATOM / Consulta inválida") que interrompe a instalação, deixando `node_modules` incompleto (sem symlinks `.bin/`, pacotes parciais). O exit code aparece como 1 mas sem mensagem de erro clara.

**Solução para ambiente local (Windows):**
- Usar `npm install` no lugar de `pnpm install` para instalar dependências localmente
- O `package-lock.json` gerado pelo npm **NÃO deve ser commitado** — o Vercel usa `pnpm-lock.yaml`
- Adicionar `package-lock.json` ao `.gitignore` se necessário
- Para iniciar o dev server: `node node_modules\vite\bin\vite.js --host` (ou via `start-dev.ps1`)

**No Vercel (Linux):** `pnpm` funciona normalmente — nenhuma mudança necessária no deploy.

---

# CONVENÇÕES DE CÓDIGO

## JSON Keys e `data-json-key`

| Contexto | Formato | Exemplo |
|----------|---------|---------|
| **No HTML/JSX** (atributo `data-json-key`) | `{pageId}.{path}` | `index.hero.title` |
| **Na API (PUT body)** | `{path}` (sem prefix) ou `{pageId}.{path}` (API remove prefix) | `hero.title` |
| **No banco (json_key)** | `{path}` apenas | `hero.title` |
| **Conteúdo shared** | `__shared__.{path}` no PUT | `__shared__.footer.copyright` |

**Componente EditableField:**
```tsx
<EditableField
  value={texts.hero.title}
  jsonKey="index.hero.title"    // pageId.path — API extrai automaticamente
  type="h1"
  className="text-5xl font-bold"
/>
```

## Tailwind CSS v4 — Sintaxe Canônica

O projeto usa **Tailwind CSS v4**, que tem sintaxe diferente do v3:

| Tailwind v3 (INCORRETO) | Tailwind v4 (CORRETO) |
|---------------------------|----------------------|
| `bg-gradient-to-r` | `bg-linear-to-r` |
| `bg-gradient-to-b` | `bg-linear-to-b` |
| `w-[700px]` | `w-175` (700/4 = 175) |
| `h-[200px]` | `h-50` (200/4 = 50) |
| `max-w-[425px]` | `max-w-106.25` (425/4) |
| `style={{ filter: '...' }}` | `drop-shadow-[...]` (usar utilities) |

**Regra:** Preferir classes numéricas de Tailwind v4 ao invés de valores arbitrários `[Xpx]`. Dividir pixels por 4 para obter o valor da classe.

---

# DESENVOLVIMENTO LOCAL

## Iniciar Reiniciar/Servidor

```powershell
# SEMPRE usar o script (OBRIGATÓRIO — ver Regras Pétreas §6):
& "d:\SiteIgrejaMeatron\site-igreja-v7\workspace\shadcn-ui\start-dev.ps1"

# O script: mata processos node existentes → npm install se necessário → npm run dev
# Resultado: http://localhost:3000 (também acessível via IP local)
```

## Parar Servidor

```powershell
& "d:\SiteIgrejaMeatron\site-igreja-v7\workspace\shadcn-ui\stop-dev.ps1"
```

## Testar API (PowerShell)

```powershell
# GET — conteúdo multilíngue completo
$ProgressPreference = 'SilentlyContinue'
$r = Invoke-RestMethod -Uri "http://localhost:3000/api/content/index" -Method Get

# GET — idioma específico
$r = Invoke-RestMethod -Uri "http://localhost:3000/api/content/index?language=pt-BR" -Method Get

# Verificar integridade de traduções
$r.languageStatus.integrityWarnings | Where-Object { $_.issues -match 'FALTANDO' }
```

## Build de Produção

```powershell
cd "d:\SiteIgrejaMeatron\site-igreja-v7\workspace\shadcn-ui"
npm run build
```

## Deploy

```powershell
cd "d:\SiteIgrejaMeatron\site-igreja-v7\workspace\shadcn-ui"
vercel --prod
```

---

# SCRIPTS DISPONÍVEIS

## Via npm (package.json)

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Inicia Vite dev server na porta 3000 |
| `npm run build` | Build de produção |
| `npm run lint` | ESLint no diretório `src/` |
| `npm run backup` | Backup completo do Supabase |
| `npm run backup:verbose` | Backup com output detalhado |
| `npm run backup:list` | Listar backups disponíveis |
| `npm run backup:list:detailed` | Lista detalhada de backups |
| `npm run restore` | Restaurar backup (interativo) |
| `npm run restore:latest` | Restaurar backup mais recente |
| `npm run restore:dry` | Dry-run da restauração |
| `npm run deploy` | Deploy para Vercel produção |

## Scripts Utilitários (diretório `scripts/`)

| Script | Função |
|--------|--------|
| `backup-supabase.js` | Backup completo do banco |
| `restore-supabase.js` | Restauração de backup |
| `audit-multilingual-db.js` | Auditoria de integridade multilíngue |
| `deploy.ps1` | Script de deploy automatizado para Vercel |
| `list-backups.ps1` | Listar backups disponíveis |

---

# DOCUMENTAÇÃO ADICIONAL

| Arquivo | Conteúdo |
|---------|----------|
| `docs/BACKUP-SYSTEM.md` | Sistema de backup — como funciona, como usar |
| `docs/ARTIGOS.md` | Sistema de artigos/blog |
| `docs/ENVIRONMENT-SETUP.md` | Setup do ambiente de desenvolvimento |
| `src/styles/README.md` | Documentação do sistema CSS ITCSS |
| `_archive/` | Arquivo morto — docs e scripts obsoletos (consulta se necessário) |

---

# TROUBLESHOOTING

## Problemas Comuns

| Problema | Causa Provável | Solução |
|----------|----------------|---------|
| API retorna HTML em vez de JSON | `apiPlugin()` ausente ou corrompido no `vite.config.ts` | Restaurar plugin — ver backup ou docs |
| Caracteres corrompidos (U+FFFD) | Encoding UTF-16LE ao salvar arquivo | Verificar encoding, usar UTF-8 sem BOM |
| `pnpm install` falha com exit code 1 (Windows) | Bug WMI "Nó - NOVOATOM / Consulta inválida" — interrompe linking | Usar `npm install` no lugar (ver seção Deploy > Nota pnpm vs npm) |
| `Cannot find module @rollup/rollup-win32-x64-msvc` | `node_modules` incompleto após pnpm install falho | Deletar `node_modules` e reinstalar com `npm install` |
| PUT aceita mas não salva | Hash idêntico (no-op) | Verificar `updateLog[].oldHash` vs `newHash` |
| Tradução aparece igual em PT e EN | Key existente apenas em dot-notation e front usa bracket-notation | Atualizar AMBAS as notações se coexistirem |
| `languageStatus` mostra FALTANDO | Idioma ausente no campo `content` da entry | PUT com o idioma faltante |
| SUSPEITA em `languageStatus` | pt-BR e en-US idênticos | Pode ser intencional (nomes próprios, datas, IDs) |

---

**Status atual (fev/2026):** Sistema multilíngue pt-BR/en-US 100% operacional — 0 campos corrompidos (U+FFFD), 0 traduções en-US faltando, ~1016 keys traduzidas, safeguards OWASP ativos, editor visual funcional com edição cross-page (extractSourcePageId + PendingEditsContext), navegação com bandeiras (SVG inline Brasil/EUA), deploy via Vercel
