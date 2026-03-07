# Hooks & Contexts — Referência Detalhada

## `usePageContent<T>(pageId, options?)` — Hook Preferido

```typescript
function usePageContent<T>(pageId: string, options?: { includePages?: string[] }): {
  data: T | null; loading: boolean; error: string | null; debug?: object;
}
```

- Atalho para `useContent({ pages: [pageId, ...includePages] })` com merge automático de edições pendentes
- **Stage 1 — `pendingOverrides`:** `useMemo` que extrai do `PendingEditsContext` os valores do idioma ATUAL
- **Stage 2 — `mergedData`:** `useMemo` que mescla `pageData` + `pendingOverrides`
- Integra com `PendingEditsContext` via try/catch (funciona fora do admin sem erro)

```tsx
// Simples (uma página):
const { data: texts, loading } = usePageContent<MyTexts>('purificacao');

// Com dados extras:
const { data, loading } = usePageContent('testemunhos', { includePages: ['__shared__'] });
```

Consumido por: todas as páginas, `SharedFooter.tsx`, `TestimonialsCarousel.tsx`

---

## `useContent<T>(options)` — Hook Universal

```typescript
interface UseContentOptions {
  pages: string[];        // page_ids para carregar
  language?: Language;    // opcional, default = LanguageContext.language
  debug?: boolean;
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

```tsx
// Padrão antigo (sem merge de edições pendentes):
const { data: allData, loading, error } = useContent<any>({ pages: ['index'] });
const texts = allData?.index;
```

---

## `useNavigationLabels()` — Menu e Títulos de Página

```typescript
interface UseNavigationLabelsReturn {
  navigation: { id: string; label: string; href: string }[];
  logo: { title: string; subtitle: string };
  loading: boolean;
}
```

- Busca `useContent({ pages: ['__navigation__'] })` para traduções
- Combina com `navigationItems` de `src/config/navigation.ts` como fallback
- Se API não responde → usa nomes PT-BR hardcoded (graceful degradation)
- Consumido por: `Navigation.tsx` (menu + `PageTitleManager`), `AdminConsole.tsx`

---

## Contexts

### `LanguageContext`

```typescript
{ language: 'pt-BR' | 'en-US', setLanguage: (lang) => void, isDarkLanguage: boolean }
```
- Inicializa de `localStorage('preferred_language')` → `navigator.language` → `"pt-BR"`
- Persiste em localStorage e atualiza `document.documentElement.lang`

### `ContentCacheContext`

```typescript
{ invalidateCache: (pageId: string) => void, invalidateAll: () => void, getInvalidationTime: (pageId: string) => number | null }
```
- Armazena `Map<string, number>` de pageId → timestamp de invalidação
- `invalidateAll` cobre os 8 page_ids conhecidos

### `PendingEditsContext`

```typescript
{
  setPendingEdit: (pageId, cleanKey, ptValue, enValue) => void,
  clearPendingEdits: (pageId?) => void,
  getPendingEditsForPage: (pageId) => Map<string, PendingEdit>,
  pendingVersion: number
}
```
- Armazena edições pendentes do VisualPageEditor antes de salvar no DB
- `setPendingEdit` registra uma edição; `pendingVersion` incrementa (trigger de re-render)
- `clearPendingEdits()` sem args: limpa TODAS. Com `pageId`: limpa apenas essa página
- Usa `useRef` para dados + `useState` para version (evita re-renders em cascata)
- Consumido por: `usePageContent` (merge automático), `VisualPageEditor.tsx` (escrita)

### `LocalEditsContext`

```typescript
{ setLocalEdit: (key, value) => void, clearLocalEdits: () => void, getValueWithOverride: (key, originalValue) => string }
```
- Preview local antes de salvar no banco (legado, mantido por compatibilidade)

---

## Editor Visual — Fluxo Completo

Ativado via Admin Console (`/436F6E736F6C45`, componente `VisualPageEditor.tsx`). Detecta `data-json-key` nos elementos HTML. Usa `EditableField` para rendering + edição inline.

**`extractSourcePageId(jsonKey)`** extrai page_id do formato `"{pageId}.{rest}"`. Ex: `"__shared__.footer.copyright"` → `{ sourcePageId: "__shared__", cleanKey: "footer.copyright" }`. Permite edição cross-page.

**Fluxo:**
1. Usuário edita campo → `setPendingEdit(sourcePageId, cleanKey, ptValue, enValue)` via `PendingEditsContext`
2. `usePageContent` mescla automaticamente as edições pendentes nos dados renderizados (preview imediato)
3. Ao salvar → edições agrupadas por `sourcePageId` → PUT separado para cada page_id afetado
4. Após salvar → `clearPendingEdits()` + `invalidateCache()` para refetch
