/**
 * Background padronizado para footers — horizonte terrestre animado
 *
 * Zero inline CSS. Tudo definido em arquivos externos:
 *   - footer-stars.css  → 126 estrelas (posição, tamanho, brilho)
 *   - waves.css          → animações de ondas + posicionamento de ícones
 *
 * Elementos idênticos em todos os footers: estrelas, montanhas, forma das ondas, sol/lua default.
 * Variáveis por página: skyColors, earthColor, waterColors (props), leftIcon/rightIcon (JSX).
 * Tamanhos de ícones: definidos no CSS de cada página via --icon-size (default 80px).
 */

import { FOOTER } from './footer-constants';

const STAR_COUNT = 126;

/** Sol dourado com 12 raios */
const DefaultSun = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="20" fill="#CFAF5A" />
    {[...Array(12)].map((_, i) => {
      const angle = (i * 30 * Math.PI) / 180;
      return (
        <line
          key={i}
          x1={50 + Math.cos(angle) * 25}
          y1={50 + Math.sin(angle) * 25}
          x2={50 + Math.cos(angle) * 40}
          y2={50 + Math.sin(angle) * 40}
          stroke="#CFAF5A"
          strokeWidth="3"
          strokeLinecap="round"
        />
      );
    })}
  </svg>
);

/** Lua crescente. maskId evita colisão de IDs entre páginas. */
const DefaultMoon = ({ maskId }: { maskId: string }) => (
  <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <mask id={maskId}>
        <circle cx="50" cy="50" r="25" fill="white" />
        <circle cx="58" cy="50" r="22" fill="black" />
      </mask>
    </defs>
    <circle cx="50" cy="50" r="25" fill="#F3F4F6" mask={`url(#${maskId})`} />
  </svg>
);

interface FooterBackgroundProps {
  gradientId?: string;
  skyColors?: [string, string, string];
  earthColor?: string;
  waterColors?: [string, string, string];
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const defaultSky: [string, string, string] = ['#1e3a5f', '#2563eb', '#38bdf8'];
const defaultWater: [string, string, string] = ['#3b82f6', '#2563eb', '#1d4ed8'];

export const FooterBackground = ({
  gradientId = "skyGradient",
  skyColors = defaultSky,
  earthColor = '#4a3f2e',
  waterColors = defaultWater,
  leftIcon,
  rightIcon,
}: FooterBackgroundProps) => {

  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      {/* CAMADA 1 — Gradiente do céu */}
      <svg
        className="absolute left-1/2 -translate-x-1/2 h-full w-[max(100%,1200px)] z-0"
        viewBox={`0 0 1200 ${FOOTER.viewBoxHeight}`}
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={skyColors[0]} />
            <stop offset="50%" stopColor={skyColors[1]} />
            <stop offset="100%" stopColor={skyColors[2]} />
          </linearGradient>
        </defs>
        <rect width="1200" height={FOOTER.viewBoxHeight} fill={`url(#${gradientId})`} />
      </svg>

      {/* CAMADA 2 — 126 estrelas (posicionamento 100% via CSS: footer-stars.css) */}
      {Array.from({ length: STAR_COUNT }, (_, i) => (
        <div key={`s${i}`} className={`footer-star s${i}`} />
      ))}

      {/* ÍCONES CELESTES — posição e tamanho 100% via CSS (waves.css + page CSS) */}
      <div className="footer-icon-left drop-shadow-lg">
        {leftIcon ?? <DefaultSun />}
      </div>
      <div className="footer-icon-right">
        {rightIcon ?? <DefaultMoon maskId={`crescentMask_${gradientId}`} />}
      </div>

      {/* CAMADA 3 — Terra + Água (overflow visible para ondas abaixo do viewBox) */}
      <svg
        className="absolute left-1/2 -translate-x-1/2 h-full w-[max(100%,1200px)] z-2"
        viewBox={`0 0 1200 ${FOOTER.viewBoxHeight}`}
        preserveAspectRatio="none"
        overflow="visible"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0,381 Q75,350 150,322 Q225,361 300,300 Q375,322 450,269 Q525,294 600,244 Q675,277 750,260 Q825,311 900,292 Q975,339 1050,319 Q1125,361 1200,378 L1200,518 L0,518 Z"
          fill="#3d5a4a"
        />
        <path
          d="M0,386 Q150,364 300,333 Q450,319 600,296 Q750,314 900,325 Q1050,352 1200,384 L1200,518 L0,518 Z"
          fill="#2d4a3a"
        />
        <path
          d="M0,389 Q100,372 200,344 Q275,378 350,322 Q425,350 500,292 Q550,311 600,274 Q650,300 700,280 Q800,328 900,311 Q975,356 1050,339 Q1100,372 1200,386 L1200,518 L0,518 Z"
          fill="#2d4a3a"
        />

        <defs>
          <linearGradient id={`${gradientId}_wg1`} gradientUnits="userSpaceOnUse" x1="0" y1="385" x2="0" y2="518">
            <stop offset="0%" stopColor={waterColors[0]} stopOpacity="0" />
            <stop offset="35%" stopColor={waterColors[0]} stopOpacity="0.2" />
            <stop offset="100%" stopColor={waterColors[0]} stopOpacity="0.5" />
          </linearGradient>
          <linearGradient id={`${gradientId}_wg2`} gradientUnits="userSpaceOnUse" x1="0" y1="393" x2="0" y2="518">
            <stop offset="0%" stopColor={waterColors[1]} stopOpacity="0" />
            <stop offset="35%" stopColor={waterColors[1]} stopOpacity="0.25" />
            <stop offset="100%" stopColor={waterColors[1]} stopOpacity="0.55" />
          </linearGradient>
          <linearGradient id={`${gradientId}_wg3`} gradientUnits="userSpaceOnUse" x1="0" y1="399" x2="0" y2="518">
            <stop offset="0%" stopColor={waterColors[2]} stopOpacity="0" />
            <stop offset="35%" stopColor={waterColors[2]} stopOpacity="0.3" />
            <stop offset="100%" stopColor={waterColors[2]} stopOpacity="0.6" />
          </linearGradient>
        </defs>

        <path
          className="animate-wave-1"
          d="M-100,482 Q600,385 1300,482 L1300,580 L-100,580 Z"
          fill={`url(#${gradientId}_wg1)`}
        />
        <path
          className="animate-wave-2"
          d="M-100,490 Q600,393 1300,490 L1300,580 L-100,580 Z"
          fill={`url(#${gradientId}_wg2)`}
        />
        <path
          className="animate-wave-3"
          d="M-100,496 Q600,399 1300,496 L1300,580 L-100,580 Z"
          fill={`url(#${gradientId}_wg3)`}
        />
      </svg>
    </div>
  );
};
