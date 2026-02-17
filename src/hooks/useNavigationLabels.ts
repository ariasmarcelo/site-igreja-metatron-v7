import { useMemo } from 'react';
import { useContent } from './useContent';
import { navigationItems } from '../config/navigation';

/**
 * Hook para carregar labels de navegação traduzíveis do Supabase.
 * 
 * Busca dados de `page_id = '__navigation__'` contendo:
 *   - __navigation__.index → { "pt-BR": "Principal", "en-US": "Home" }
 *   - __navigation__.purificacao → { "pt-BR": "Purificação e Ascensão", "en-US": "Purification & Ascension" }
 *   - etc.
 * 
 * Também carrega texto do logo:
 *   - __navigation__.logo.title → { "pt-BR": "Igreja de Metatron", "en-US": "Church of Metatron" }
 *   - __navigation__.logo.subtitle → { "pt-BR": "O Trabalho de Resgate", "en-US": "The Rescue Work" }
 * 
 * SEM FALLBACK AUTOMÁTICO: se a API falhar, labels ficam vazios para
 * tornar o problema visível. Os nomes PT-BR em navigation.ts servem
 * apenas como documentação estrutural e para o AdminConsole.
 */

interface NavigationLabel {
  /** ID da página (ex: 'index', 'purificacao') */
  id: string;
  /** Label traduzido para o idioma atual (ex: "Home" ou "Principal") */
  label: string;
  /** Rota (ex: '/', '/purificacao') */
  href: string;
}

interface LogoLabels {
  title: string;
  subtitle: string;
}

interface UseNavigationLabelsReturn {
  /** Items de navegação com labels traduzidos */
  navigation: NavigationLabel[];
  /** Texto do logo traduzido */
  logo: LogoLabels;
  /** Se ainda está carregando */
  loading: boolean;
}

export function useNavigationLabels(): UseNavigationLabelsReturn {
  const { data, loading } = useContent<{ __navigation__: Record<string, unknown> }>({
    pages: ['__navigation__'],
  });

  const navData = data?.['__navigation__'] as Record<string, unknown> | undefined;

  const navigation = useMemo(() => {
    return navigationItems.map((item) => ({
      id: item.id,
      href: item.href,
      label: (navData?.[item.id] as string) || '', // sem fallback PT — problema deve ser visível
    }));
  }, [navData]);

  const logo = useMemo<LogoLabels>(() => {
    const logoData = navData?.logo as Record<string, string> | undefined;
    return {
      title: logoData?.title || '',
      subtitle: logoData?.subtitle || '',
    };
  }, [navData]);

  return { navigation, logo, loading };
}
