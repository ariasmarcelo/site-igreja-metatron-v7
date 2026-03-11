/**
 * Constantes compartilhadas do footer paisagem (FooterBackground).
 * Todas as páginas que usam o footer com céu/montanhas/ondas devem
 * importar daqui para manter proporções consistentes.
 */

export const FOOTER = {
  /** Classes do <footer> wrapper — sombra projetada para cima separando do conteúdo */
  sectionClass: 'relative overflow-hidden shadow-[0_-24px_48px_rgba(0,0,0,0.50),0_-8px_16px_rgba(0,0,0,0.30)]',

  /** Altura do viewBox SVG (coordenadas internas) */
  viewBoxHeight: 518,

  /** Classes Tailwind do container interno (z-10, flex, padding, height) */
  containerClass: 'footer-cta-container relative z-10 flex flex-col items-center justify-between px-4 pt-6 pb-4 h-[269px]',

  /** Classes do título CTA (h2) */
  titleClass: 'text-[28px] md:text-[33px] font-bold mb-4 text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]',

  /** Classes do subtítulo CTA (p) */
  subtitleClass: 'text-lg -mt-[5px] mb-5 text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.3)]',

  /** Classes do copyright no rodapé */
  copyrightClass: 'text-xs text-white/40 text-center',

  /** Classes do trademark no rodapé */
  trademarkClass: 'text-[10px] text-white/25 text-center mt-1',
} as const;
