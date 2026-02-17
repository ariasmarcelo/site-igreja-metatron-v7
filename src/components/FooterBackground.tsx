/**
 * Componente de Background padronizado para footers
 * Horizonte terrestre: céu (gradiente) + terra + ondas de água animadas
 * Cada página passa suas próprias cores para progressão noite→dia
 */

interface FooterBackgroundProps {
  gradientId?: string;
  /** Cores do gradiente de céu [topo, meio, base/horizonte] */
  skyColors?: [string, string, string];
  /** Cor da terra/horizonte */
  earthColor?: string;
  /** Cores das 3 camadas de água [onda1, onda2, onda3] */
  waterColors?: [string, string, string];
}

// Defaults: azul médio (design original, usado por Purificação)
const defaultSky: [string, string, string] = ['#1e3a5f', '#2563eb', '#38bdf8'];
const defaultWater: [string, string, string] = ['#14b8a6', '#0d9488', '#0f766e'];

export const FooterBackground = ({
  gradientId = "skyGradient",
  skyColors = defaultSky,
  earthColor = '#4a3f2e',
  waterColors = defaultWater,
}: FooterBackgroundProps) => {
  return (
    <div className="absolute inset-0 z-0">
      <svg
        className="w-full h-full"
        viewBox="0 0 1200 370"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* GRADIENTE CÉU */}
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={skyColors[0]} />
            <stop offset="50%" stopColor={skyColors[1]} />
            <stop offset="100%" stopColor={skyColors[2]} />
          </linearGradient>
        </defs>
        <rect width="1200" height="370" fill={`url(#${gradientId})`} />
        
        {/* HORIZONTE DE TERRA - atrás das ondas */}
        <path
          d="M0,251 Q600,161 1200,251 L1200,400 L0,400 Z"
          fill={earthColor}
        />
        
        {/* ÁGUA - camadas animadas com movimentos entrelaçados */}
        <path 
          className="animate-wave-1"
          d="M-100,318 Q600,198 1300,318 L1300,380 L-100,380 Z" 
          fill={waterColors[0]}
          opacity="0.25"
        />
        <path 
          className="animate-wave-2"
          d="M-100,330 Q600,210 1300,330 L1300,380 L-100,380 Z" 
          fill={waterColors[1]}
          opacity="0.25"
        />
        <path 
          className="animate-wave-3"
          d="M-100,338 Q600,218 1300,338 L1300,380 L-100,380 Z" 
          fill={waterColors[2]}
          opacity="0.25"
        />
      </svg>
    </div>
  );
};
