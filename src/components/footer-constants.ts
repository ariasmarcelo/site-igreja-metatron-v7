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
  containerClass: 'relative z-10 flex flex-col items-center justify-between px-4 pt-6 pb-4 h-[269px]',

  /** Classes do título CTA (h2) */
  titleClass: 'text-3xl md:text-4xl font-bold mb-4 text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]',

  /** Classes do subtítulo CTA (p) */
  subtitleClass: 'text-lg mb-5 text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.3)]',

  /** Classes do botão CTA */
  buttonClass: 'bg-[#CFAF5A] text-white font-semibold px-6 py-4 text-base rounded-lg shadow-[0_6px_20px_rgba(0,0,0,0.5)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.6)] transition-all duration-300 hover:scale-105',

  /** Classes do copyright no rodapé */
  copyrightClass: 'text-xs text-white/40 text-center',

  /** Classes do trademark no rodapé */
  trademarkClass: 'text-[10px] text-white/25 text-center mt-1',
} as const;
