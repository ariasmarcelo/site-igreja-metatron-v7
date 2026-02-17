import { createContext, useContext, useCallback, useState, ReactNode } from 'react';

/**
 * Context para gerenciar invalidação de cache de conteúdo
 * Permite que VisualPageEditor dispare refetch global após salvar
 */

interface ContentCacheContextType {
  /** Invalidar cache de página específica */
  invalidateCache: (pageId: string) => void;
  /** Invalidar TODAS as páginas */
  invalidateAll: () => void;
  /** Verificar se página foi invalidada (retorna timestamp) */
  getInvalidationTime: (pageId: string) => number | null;
}

const ContentCacheContext = createContext<ContentCacheContextType | undefined>(undefined);

export function ContentCacheProvider({ children }: { children: ReactNode }) {
  // Mapa de timestamps: pageId → quando foi invalidado
  const [invalidations, setInvalidations] = useState<Map<string, number>>(new Map());

  const invalidateCache = useCallback((pageId: string) => {
    console.log(`🔄 [ContentCacheContext] Invalidating cache for page: ${pageId}`);
    setInvalidations(prev => new Map(prev).set(pageId, Date.now()));
  }, []);

  const invalidateAll = useCallback(() => {
    console.log(`🔄 [ContentCacheContext] Invalidating ALL pages cache`);
    // Invalidar páginas conhecidas
    const pageIds = ['index', 'quemsomos', 'artigos', 'artigodetalhes', 'purificacao', 'contato', 'tratamentos', 'testemunhos'];
    const newInvalidations = new Map(invalidations);
    const now = Date.now();
    pageIds.forEach(id => newInvalidations.set(id, now));
    setInvalidations(newInvalidations);
  }, [invalidations]);

  const getInvalidationTime = useCallback((pageId: string): number | null => {
    return invalidations.get(pageId) || null;
  }, [invalidations]);

  return (
    <ContentCacheContext.Provider value={{ invalidateCache, invalidateAll, getInvalidationTime }}>
      {children}
    </ContentCacheContext.Provider>
  );
}

/**
 * Hook para usar o context
 * @example
 * const { invalidateCache } = useContentCache();
 * invalidateCache('quemsomos');
 */
export function useContentCache() {
  const context = useContext(ContentCacheContext);
  if (!context) {
    throw new Error('useContentCache deve ser usado dentro de ContentCacheProvider');
  }
  return context;
}
