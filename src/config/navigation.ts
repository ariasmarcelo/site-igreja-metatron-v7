/**
 * SINGLE SOURCE OF TRUTH — Configuração centralizada de navegação e páginas.
 *
 * Este arquivo define:
 *   1. Os itens do menu de navegação superior (ordem, rotas, nomes PT-BR)
 *   2. A lista completa de todos os page_ids válidos (incluindo páginas não-navegáveis)
 *
 * Quem consome:
 *   - useNavigationLabels.ts → sobrepõe labels traduzidos da API (__navigation__)
 *   - Navigation.tsx          → renderiza menu + PageTitleManager
 *   - AdminConsole.tsx        → tabs do editor
 *   - api/content/[pageId].js → VALID_PAGE_IDS (cópia CJS, manter sincronizado!)
 *
 * Código que NÃO pode chamar a API (ex: serverless CJS) importa daqui diretamente.
 * Código React usa o hook useNavigationLabels() que combina esta config + traduções da API.
 */

export interface NavigationItem {
  /** Identificador da página (corresponde a page_id no Supabase) */
  id: string;
  /** Rota URL */
  href: string;
  /** Nome em PT-BR (fallback quando traduções não disponíveis) */
  name: string;
}

// Items do menu de navegação — ordem: escuro (noite) → claro (dia) para progressão dos footers
export const navigationItems: readonly NavigationItem[] = [
  { name: 'Principal', href: '/', id: 'index' },
  { name: 'Purificação e Ascensão', href: '/purificacao', id: 'purificacao' },
  { name: 'Tratamentos Associados', href: '/tratamentos', id: 'tratamentos' },
  { name: 'Testemunhos', href: '/testemunhos', id: 'testemunhos' },
  { name: 'Quem Somos', href: '/quemsomos', id: 'quemsomos' },
  { name: 'Contato', href: '/contato', id: 'contato' },
] as const;

// IDs de páginas que NÃO estão no menu mas são válidas para a API
export const specialPageIds = [
  'artigos',        // Sistema de blog (oculto do menu)
  'notfound',       // Página 404
  '__shared__',     // Dados compartilhados (footer)
  '__navigation__', // Labels de navegação (traduções)
] as const;

/**
 * Lista COMPLETA de todos os page_ids válidos para a API.
 * A API (api/content/[pageId].js) deve manter uma cópia idêntica.
 * Se adicionar uma página nova, atualizar AQUI e na API.
 */
export const ALL_VALID_PAGE_IDS = [
  ...navigationItems.map(item => item.id),
  ...specialPageIds,
] as const;

/** Mapa rota → nome PT-BR (para document.title e similares) */
export const routeNameMap: Record<string, string> = Object.fromEntries(
  navigationItems.map(item => [item.href, item.name])
);
