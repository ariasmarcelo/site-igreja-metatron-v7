import { useEffect, useMemo, useRef, useState } from 'react';
import { useLanguage, type Language } from '../contexts/LanguageContext';
import { useContentCache } from '../contexts/ContentCacheContext';
import { usePendingEdits } from '../contexts/PendingEditsContext';

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
 * Se o idioma solicitado não existir, retorna "<EMPTY>" para indicar tradução faltante
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
  
  // Se tem outras chaves de idioma, é um objeto multilíngue mas está faltando o idioma solicitado
  if (content['pt-BR'] !== undefined || content['en-US'] !== undefined) {
    return '<EMPTY>';  // Sem fallbacks - deixar claro que falta tradução
  }

  // Se é um objeto comum (não multilíngue), processar recursivamente
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

  // Integração com cache invalidation context
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let cacheInvalidationTime: number | null = null;
  try {
    const cacheContext = useContentCache();
    const { pages } = options;
    // Verificar invalidação de qualquer página que estamos carregando
    if (pages && pages.length > 0) {
      cacheInvalidationTime = pages
        .map(p => cacheContext.getInvalidationTime(p.toLowerCase()))
        .filter((t): t is number => t !== null)
        .sort()
        .pop() || null;
    }
  } catch {
    // Context não disponível (é OK, apenas funciona sem invalidação)
  }

  const { pages, debug = false } = options;
  const pagesKey = pages.join(',');

  // Rastrear se é a primeira carga (mostrar loading) ou re-fetch silencioso
  const isFirstLoadRef = useRef(true);

  useEffect(() => {
    if (!pages || pages.length === 0) {
      setData(null);
      setLoading(false);
      return;
    }

    const loadContent = async () => {
      // Só mostrar loading na PRIMEIRA carga. Re-fetches (cache invalidation,
      // troca de idioma) são silenciosos — mantêm dados atuais enquanto carregam.
      if (isFirstLoadRef.current) {
        setLoading(true);
      }
      setError(null);

      const apiBaseUrl = import.meta.env.VITE_API_URL || '';
      const normalizedPages = pages.map(p => p.toLowerCase());

      try {
        const loadStart = performance.now();
        
        // Carregar todas as páginas em paralelo com language parameter
        const responses = await Promise.all(
          normalizedPages.map(pageId => 
            fetch(`${apiBaseUrl}/api/content/${pageId}?language=${language}`)
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
        console.error(`[useContent] Error loading content:`, errorMessage);
        setError(errorMessage);
      } finally {
        setLoading(false);
        isFirstLoadRef.current = false;
      }
    };

    loadContent();
  }, [pagesKey, language, debug, cacheInvalidationTime]);

  return { data, loading, error, debug: debugInfo };
}

/**
 * Setar valor aninhado em um objeto usando notação de caminho com suporte a arrays.
 * Ex: setNestedValue(obj, 'hero.title', 'X') → obj.hero.title = 'X'
 * Ex: setNestedValue(obj, 'cards[0].title', 'X') → obj.cards[0].title = 'X'
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function setNestedValue(obj: any, path: string, value: any): void {
  const parts = path.split('.');
  let current = obj;
  
  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i];
    const arrayMatch = part.match(/^(.+?)\[(\d+)\]$/);
    
    if (arrayMatch) {
      const [, name, idx] = arrayMatch;
      if (!current[name]) current[name] = [];
      if (!current[name][parseInt(idx)]) current[name][parseInt(idx)] = {};
      current = current[name][parseInt(idx)];
    } else {
      if (!current[part]) current[part] = {};
      current = current[part];
    }
  }
  
  const lastPart = parts[parts.length - 1];
  const lastArrayMatch = lastPart.match(/^(.+?)\[(\d+)\]$/);
  if (lastArrayMatch) {
    const [, name, idx] = lastArrayMatch;
    if (!current[name]) current[name] = [];
    current[name][parseInt(idx)] = value;
  } else {
    current[lastPart] = value;
  }
}

/**
 * Atalho para carregar uma única página
 * 
 * IMPORTANTE: Automaticamente mescla edições pendentes (não salvas) do PendingEditsContext.
 * 
 * Para páginas que precisam de dados compartilhados (__shared__), passe { includePages: ['__shared__'] }.
 * Dados de páginas extras ficam disponíveis no resultado com sua chave original.
 * 
 * Isso permite que o editor visual funcione com React de forma natural:
 * - Edições pendentes são renderizadas corretamente em qualquer idioma
 * - Sem manipulação direta de DOM ou timers
 * 
 * @example
 * const { data, loading } = usePageContent('purificacao');
 * // Acessa: data.header.title, data.intro.mainText
 * 
 * @example
 * const { data, loading } = usePageContent('testemunhos', { includePages: ['__shared__'] });
 * // Acessa: data.header.title (da página)
 * // Acessa: data.__shared__.testimonials (dados compartilhados solicitados explicitamente)
 */
export function usePageContent<T = Record<string, unknown>>(pageId: string, options?: { includePages?: string[] }) {
  const allPages = [pageId, ...(options?.includePages || [])];
  const { data, loading, error, debug } = useContent({ pages: allPages });
  const { language } = useLanguage();
  
  // Edições pendentes (não salvas no DB)
  let pendingVersion = 0;
  let getPendingEditsForPage: ((pid: string) => Map<string, { 'pt-BR': string; 'en-US': string }>) | null = null;
  try {
    const ctx = usePendingEdits();
    pendingVersion = ctx.version;
    getPendingEditsForPage = ctx.getPendingEditsForPage;
  } catch {
    // Context não disponível (ok em páginas fora do admin)
  }
  
  // Extrair a página principal
  const pageData = data?.[pageId.toLowerCase()] as Record<string, unknown> | undefined;
  
  // STAGE 1: Computar overrides do idioma ATUAL a partir das edições pendentes.
  // Este memo recalcula SEMPRE que `language` ou `pendingVersion` mudam,
  // garantindo que edit[language] retorne o valor correto para o idioma selecionado.
  const pendingOverrides = useMemo((): Record<string, string> | null => {
    if (!getPendingEditsForPage) return null;
    const edits = getPendingEditsForPage(pageId);
    if (edits.size === 0) return null;
    const overrides: Record<string, string> = {};
    for (const [key, edit] of edits) {
      const val = edit[language];
      if (val) overrides[key] = val;
    }
    return Object.keys(overrides).length > 0 ? overrides : null;
  }, [getPendingEditsForPage, pageId, language, pendingVersion]);
  
  // STAGE 2: Mesclar base data + overrides + extra pages.
  // Recalcula quando pageData ou overrides mudam.
  const mergedData = useMemo(() => {
    if (!pageData) return null;
    
    // Incluir dados de páginas extras (ex: __shared__)
    const extraData: Record<string, unknown> = {};
    if (options?.includePages) {
      for (const p of options.includePages) {
        const extra = data?.[p.toLowerCase()];
        if (extra) extraData[p] = extra;
      }
    }
    
    const base = { ...pageData, ...extraData };
    
    if (pendingOverrides) {
      const result = structuredClone(base);
      for (const [key, val] of Object.entries(pendingOverrides)) {
        setNestedValue(result, key, val);
      }
      return result;
    }
    
    return base;
  }, [pageData, pendingOverrides, data, options?.includePages]);
  
  return { data: mergedData as T | null, loading, error, debug };
}
