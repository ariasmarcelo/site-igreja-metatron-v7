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
 * Hook para carregar textos do Supabase via API content-v2
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
    const loadFromAPI = async () => {
      const locked = isEditLocked(pageId);
      
      // NÃO atualizar se há edições pendentes (lock ativo)
      if (locked) {
        console.log(`🔒 Skipping load for ${pageId} - edit lock active`);
        return;
      }
      
      setLoading(true);
      setError(null);
      
      try {
        console.log(`📥 Carregando ${pageId} do Supabase...`);
        
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
        const response = await fetch(`${apiUrl}/api/content-v2/${pageId.toLowerCase()}`);
        
        if (!response.ok) {
          throw new Error(`API returned status ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data && data.content) {
          setTexts(data.content as T);
          setError(null);
          console.log(`✅ Carregado do Supabase: ${pageId} (${Object.keys(data.content).length} keys)`);
        } else {
          throw new Error(`No content found in API response`);
        }
      } catch (apiError) {
        const errorMsg = apiError instanceof Error ? apiError.message : 'Unknown error';
        setError(`Failed to load ${pageId}: ${errorMsg}`);
        console.error(`❌ Erro ao carregar ${pageId}:`, errorMsg);
      } finally {
        setLoading(false);
      }
    };

    loadFromAPI();
  }, [pageId, refreshTrigger]);

  return { texts, loading, error };
}
