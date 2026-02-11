import { useEffect, useState } from 'react';
import { useLanguage, type Language } from '../contexts/LanguageContext';

/**
 * HOOK UNIVERSAL para carregar conteúdo do Supabase com suporte a múltiplos idiomas
 * 
 * Unifica todos os métodos de carregamento em uma interface simples.
 * SEMPRE retorna dados nested (objetos reconstruídos) independente da fonte.
 * 
 * Uso:
 * 
 * 1. Carregar uma página inteira (usa idioma atual):
 *    const { data, loading } = useContent({ pages: ['purificacao'] });
 *    // Acessa: data.purificacao.header.title
 * 
 * 2. Com idioma específico:
 *    const { data, loading } = useContent({ pages: ['purificacao'], language: 'en-US' });
 * 
 * 3. Modo debug:
 *    const { data, loading, debug } = useContent({ pages: ['index'], debug: true });
 */

interface UseContentOptions {
  /** IDs das páginas a carregar (ex: ['purificacao', 'testemunhos']) */
  pages: string[];
  /** Idioma (usa contexto se não fornecido) */
  language?: Language;
  /** Ativar logs detalhados */
  debug?: boolean;
}

interface UseContentReturn<T = Record<string, unknown>> {
  /** Dados nested organizados por página: { purificacao: { header: {...}, intro: {...} } } */
  data: T | null;
  /** Estado de carregamento */
  loading: boolean;
  /** Mensagem de erro se houver */
  error: string | null;
  /** Informações de debug (apenas se debug=true) */
  debug?: {
    cacheHit: boolean;
    duration: number;
    source: 'cache' | 'database' | 'mixed';
    language: Language;
  };
}

/**
 * Função auxiliar para extrair apenas um idioma específico do conteúdo
 * Se o idioma solicitado não existir, faz fallback para pt-BR
 */
function extractLanguageFromContent(content: any, language: Language): any {
  if (!content || typeof content !== 'object') {
    return content;
  }

  // Se é um array, processar cada elemento
  if (Array.isArray(content)) {
    return content.map(item => extractLanguageFromContent(item, language));
  }

  // Se é um objeto com idiomas (formato { 'pt-BR': '...', 'en-US': '...' })
  if (content[language] !== undefined) {
    return content[language];
  }
  
  // Fallback para pt-BR se idioma solicitado não existir
  if (content['pt-BR'] !== undefined) {
    return content['pt-BR'];
  }

  // Se é um objeto comum, processar recursivamente
  const result: any = {};
  for (const key in content) {
    result[key] = extractLanguageFromContent(content[key], language);
  }
  return result;
}

/**
 * Hook universal para carregar conteúdo com suporte a múltiplos idiomas
 */
export function useContent<T = Record<string, unknown>>(
  options: UseContentOptions
): UseContentReturn<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<UseContentReturn['debug']>();
  
  // Obter idioma do contexto se não fornecido
  const contextLanguage = useLanguage().language;
  const language = options.language || contextLanguage;

  const { pages, debug = false } = options;
  const pagesKey = pages.join(',');

  useEffect(() => {
    if (!pages || pages.length === 0) {
      setData(null);
      setLoading(false);
      return;
    }

    const loadContent = async () => {
      setLoading(true);
      setError(null);

      const apiBaseUrl = import.meta.env.VITE_API_URL || '';
      const normalizedPages = pages.map(p => p.toLowerCase());

      try {
        const loadStart = performance.now();
        
        // Carregar todas as páginas em paralelo
        const responses = await Promise.all(
          normalizedPages.map(pageId => 
            fetch(`${apiBaseUrl}/api/content/${pageId}`)
          )
        );

        // Consolidar resultados no formato esperado { pageId: content, ... }
        const pagesData: Record<string, unknown> = {};
        const sources: Record<string, string> = {};

        for (let i = 0; i < normalizedPages.length; i++) {
          const response = responses[i];
          const pageId = normalizedPages[i];

          if (!response.ok) {
            throw new Error(`API returned status ${response.status} for page ${pageId}`);
          }

          const result = await response.json();
          
          if (result.success && result.content) {
            // Extrair apenas o idioma solicitado do conteúdo
            const processedContent = extractLanguageFromContent(result.content, language);
            pagesData[pageId] = processedContent;
            sources[pageId] = result.source || 'db';
          }
        }

        const loadEnd = performance.now();
        const duration = Math.round(loadEnd - loadStart);

        if (debug) {
          console.log(`[${new Date().toISOString()}] [useContent] Loaded pages=${normalizedPages.join(',')} lang=${language} duration=${duration}ms`);
          console.log(`[${new Date().toISOString()}] [useContent] Sources:`, sources);
        }

        if (Object.keys(pagesData).length > 0) {
          setData(pagesData as T);

          // Calcular debug info
          if (debug) {
            const sourcesArray = Object.values(sources);
            const cacheHits = sourcesArray.filter(s => s === 'cache').length;
            const dbHits = sourcesArray.filter(s => s === 'supabase-db' || s === 'db').length;
            
            setDebugInfo({
              cacheHit: cacheHits > 0,
              duration,
              source: cacheHits > 0 && dbHits > 0 ? 'mixed' : cacheHits > 0 ? 'cache' : 'database',
              language
            });
          }
        } else {
          throw new Error('Failed to load content');
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        console.error(`[${new Date().toISOString()}] [useContent] Error loading content:`, errorMessage);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagesKey, language, debug]);

  return { data, loading, error, debug: debugInfo };
}

/**
 * Atalho para carregar uma única página
 * 
 * IMPORTANTE: Automaticamente mescla dados compartilhados (__shared__) com a página,
 * permitindo acesso direto a data.footer.* em qualquer página
 * 
 * @example
 * const { data, loading } = usePageContent('purificacao');
 * // Acessa: data.header.title, data.intro.mainText
 * // Acessa: data.footer.copyright (vem de __shared__)
 */
export function usePageContent<T = Record<string, unknown>>(pageId: string) {
  const { data, loading, error, debug } = useContent({ pages: [pageId] });
  
  // Extrair a página e mesclar com dados compartilhados
  const pageData = data?.[pageId.toLowerCase()] as Record<string, unknown> | undefined;
  const sharedData = data?.['__shared__'] as Record<string, unknown> | undefined;
  
  // Merge: página + compartilhado (compartilhado tem precedência)
  const mergedData = pageData ? { ...pageData, ...sharedData } : null;
  
  return { data: mergedData as T | null, loading, error, debug };
}
