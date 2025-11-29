import { useEffect, useState } from 'react';

// Event emitter global para sincronização de dados entre componentes
const refreshEvents = new Map<string, Set<() => void>>();

// Flag global para bloquear atualizações enquanto há edições pendentes
const editLocks = new Map<string, boolean>();

export const triggerRefresh = (pageId: string) => {
  const normalizedPageId = pageId.toLowerCase();
  const listeners = refreshEvents.get(normalizedPageId);
  if (listeners) {
    listeners.forEach(callback => callback());
  }
};

export const setEditLock = (pageId: string, locked: boolean) => {
  editLocks.set(pageId.toLowerCase(), locked);
};

export const isEditLocked = (pageId: string): boolean => {
  return editLocks.get(pageId.toLowerCase()) || false;
};

/**
 * @deprecated Use useContent from '@/hooks/useContent' instead
 * 
 * Hook ANTIGO para carregar paths granulares do Supabase via API `content`
 * Este hook será removido em versões futuras.
 * 
 * @param paths - Array de paths no formato "pageId.path.to.data"
 * @returns { data, loading, error } - Objeto com os dados indexados por path
 * 
 * @example
 * // ANTIGO (deprecated):
 * const { data, loading } = useLazyContent(["purificacao.hero"]);
 * 
 * // NOVO (recomendado):
 * import { useContent } from '@/hooks/useContent';
 * const { data, loading } = useContent({ pages: ['purificacao'] });
 */
export function useLazyContent<T = Record<string, unknown>>(
  paths: string[]
): {
  data: Record<string, T> | null;
  loading: boolean;
  error: string | null;
} {
  const [data, setData] = useState<Record<string, T> | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!paths || paths.length === 0) {
      setData(null);
      setLoading(false);
      return;
    }

    const loadContent = async () => {
      setLoading(true);
      setError(null);
      
      const apiBaseUrl = import.meta.env.VITE_API_URL || '';
      const normalizedPaths = paths.map(p => p.toLowerCase());
      const url = `${apiBaseUrl}/api/content?paths=${normalizedPaths.join(',')}`;
      
      try {
        const loadStart = performance.now();
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`API returned status ${response.status}`);
        }
        
        const result = await response.json();
        const loadEnd = performance.now();
        
        console.log(`[${new Date().toISOString()}] [FRONTEND] Lazy content loaded: paths=${normalizedPaths.join(',')}, duration=${Math.round(loadEnd - loadStart)}ms`);
        
        if (result.success && result.data) {
          setData(result.data);
        } else {
          throw new Error(result.message || 'Failed to load content');
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        console.error(`[${new Date().toISOString()}] [FRONTEND] Error loading lazy content:`, errorMessage);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, [paths.join(',')]);

  return { data, loading, error };
}

/**
 * Hook para carregar textos do Supabase via API content-v2
 * 
 * @deprecated Use `usePageContent` from '@/hooks/useContent' instead.
 * This hook will be removed in a future version.
 * 
 * Migration example:
 * ```
 * // Before:
 * const { texts, loading, error } = useLocaleTexts<MyTexts>('mypage');
 * 
 * // After:
 * const { data: texts, loading, error } = usePageContent<MyTexts>('mypage');
 * ```
 * 
 * @param pageId - ID da página (index, quem-somos, contato, etc)
 * @returns { texts, loading, error } - Dados da página, estado de loading e erro
 */
export function useLocaleTexts<T = Record<string, unknown>>(
  pageId: string
): {
  texts: T | null;
  loading: boolean;
  error: string | null;
} {
  const [texts, setTexts] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    // Registrar listener para refresh manual
    const normalizedPageId = pageId.toLowerCase();
    if (!refreshEvents.has(normalizedPageId)) {
      refreshEvents.set(normalizedPageId, new Set());
    }
    
    const callback = () => setRefreshTrigger(prev => prev + 1);
    refreshEvents.get(normalizedPageId)?.add(callback);
    
    return () => {
      refreshEvents.get(normalizedPageId)?.delete(callback);
    };
  }, [pageId]);

  useEffect(() => {
    const loadContent = async () => {
      const locked = isEditLocked(pageId);
      
      if (locked) {
        console.log(`[${new Date().toISOString()}] [FRONTEND] Skipping load: pageId=${pageId} (edit lock active)`);
        return;
      }
      
      setLoading(true);
      setError(null);
      
      const apiBaseUrl = import.meta.env.VITE_API_URL || '';
      const normalizedPageId = pageId.toLowerCase();
      const url = `${apiBaseUrl}/api/content?pages=${normalizedPageId}`;
      
      try {
        const loadStart = performance.now();
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`API returned status ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data && data.pages && data.pages[normalizedPageId]) {
          const loadEnd = performance.now();
          const loadTime = loadEnd - loadStart;
          
          setTexts(data.pages[normalizedPageId] as T);
          setError(null);
          console.log(`[${new Date().toISOString()}] [FRONTEND] Loaded: pageId=${pageId}, time=${loadTime.toFixed(2)}ms`);
        } else {
          throw new Error(`No content found for ${pageId} in API response`);
        }
      } catch (apiError) {
        const errorMsg = apiError instanceof Error ? apiError.message : 'Unknown error';
        setError(`Failed to load ${pageId}: ${errorMsg}`);
        console.error(`[${new Date().toISOString()}] [FRONTEND] Error loading ${pageId}: ${errorMsg}`);
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, [pageId, refreshTrigger]);

  return { texts, loading, error };
}

/**
 * Hook para carregar múltiplas páginas em uma única requisição
 * 
 * @deprecated Use `useContent` from '@/hooks/useContent' instead.
 * This hook will be removed in a future version.
 * 
 * Migration example:
 * ```
 * // Before:
 * const { pages, loading, error } = useMultiplePages(['page1', 'page2']);
 * const page1Data = pages.page1;
 * 
 * // After:
 * const { data: pages, loading, error } = useContent({ pages: ['page1', 'page2'] });
 * const page1Data = pages.page1;
 * ```
 * 
 * @param pageIds - Array de IDs das páginas
 * @returns { pages, loading, error } - Mapa de páginas, estado de loading e erro
 */
export function useMultiplePages<T = Record<string, unknown>>(
  pageIds: string[]
): {
  pages: Record<string, T | null>;
  loading: boolean;
  error: string | null;
} {
  const [pages, setPages] = useState<Record<string, T | null>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (pageIds.length === 0) {
      setLoading(false);
      return;
    }

    const loadMultiplePages = async () => {
      setLoading(true);
      setError(null);
      
      const normalizedPageIds = pageIds.map(id => id.toLowerCase());
      const apiBaseUrl = import.meta.env.VITE_API_URL || '';
      const url = `${apiBaseUrl}/api/content?pages=${normalizedPageIds.join(',')}`;
      
      try {
        const loadStart = performance.now();
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`API returned status ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data && data.pages) {
          const loadEnd = performance.now();
          const loadTime = loadEnd - loadStart;
          
          setPages(data.pages as Record<string, T | null>);
          setError(null);
          console.log(`[${new Date().toISOString()}] [FRONTEND] Loaded multiple pages: ${pageIds.join(',')}, time=${loadTime.toFixed(2)}ms`);
        } else {
          throw new Error(`No pages found in API response`);
        }
      } catch (apiError) {
        const errorMsg = apiError instanceof Error ? apiError.message : 'Unknown error';
        setError(`Failed to load pages: ${errorMsg}`);
        console.error(`[${new Date().toISOString()}] [FRONTEND] Error loading pages ${pageIds.join(',')}: ${errorMsg}`);
      } finally {
        setLoading(false);
      }
    };

    loadMultiplePages();
  }, [pageIds.join(',')]); // Re-run if pageIds array changes

  return { pages, loading, error };
}
