/**
 * Componente de Background padronizado para footers
 * Horizonte terrestre: céu (gradiente) + estrelas + terra + ondas de água animadas
 * Cada página passa suas próprias cores para progressão noite→dia
 */

/**
 * Estrelas fixas — distribuição inspirada no céu noturno do hemisfério sul.
 * Renderizadas como divs HTML para manter forma circular perfeita
 * (o SVG da paisagem usa preserveAspectRatio="none" que distorceria circles).
 * Cada estrela: [x%, y%, tamanho em px, opacidade]
 *
 * Referências do hemisfério sul:
 * - Via Láctea: faixa densa diagonal (esquerda → centro)
 * - Cruzeiro do Sul: constelação compacta (~27%, 20%)
 * - Alpha/Beta Centauri: par brilhante (~31-32%, 20-22%)
 * - Canopus: 2ª mais brilhante (~58%, 8%)
 * - Achernar: brilhante isolada (~79%, 6%)
 * - Nuvens de Magalhães: clusters difusos (~45-50%, 13-20%)
 */
const STARS: [number, number, number, number][] = [
  // ═══ VIA LÁCTEA — faixa densa diagonal ═══
  [1.0076, 32.9536, 0.41, 0.4053], [23.4451, 2, 0.33, 0.7823], [21.7125, 13.6525, 0.36, 0.6093],
  [3.3795, 25.2311, 0.99, 0.4667], [13.3972, 34.6995, 0.44, 0.4187], [6.3699, 44, 2.17, 0.3681],
  [14.1289, 15.7033, 0.41, 0.5825], [9.0899, 19.727, 0.46, 0.53], [11.4378, 28.8062, 0.6, 0.4879],
  [3.05, 30.8897, 0.77, 0.4672], [23.8949, 3.7894, 0.43, 0.7566], [5.0956, 32.1405, 0.31, 0.4058],
  [15.661, 19.3922, 0.46, 0.5268], [23.6228, 13.0454, 0.5, 0.6863], [11.7267, 34.5444, 0.59, 0.4046],
  [19.2663, 15.4853, 0.55, 0.6163], [8.07, 21.4349, 0.47, 0.5727], [2.4472, 21.0531, 0.51, 0.5447],
  [11.2785, 26.2874, 0.39, 0.4963], [6.6044, 24.8885, 1.21, 0.518], [19.8967, 22.9901, 0.34, 0.5767],
  [10.0088, 6.4398, 0.38, 0.6874], [8.2237, 29.5665, 0.6, 0.4385], [16.2223, 21.2629, 0.41, 0.5228],
  [7.8727, 44, 0.94, 0.3359], [12.2535, 18.937, 0.42, 0.5704], [8.4039, 37.7995, 0.86, 0.3356],
  [9.0775, 29.9157, 1.75, 0.5273], [19.2722, 2, 0.56, 0.7819], [23.6474, 2, 1.06, 0.6992],

  // ═══ CRUZEIRO DO SUL ═══
  [26.67, 23.78, 2.8, 0.8],    // Acrux (Alpha Crucis) — base
  [27.33, 19.46, 2.6, 0.784],  // Mimosa (Beta Crucis)
  [26, 21.08, 2.2, 0.76],      // Gacrux (Gamma)
  [26.67, 17.57, 2.6, 0.784],  // Delta Crucis
  [27.92, 25.68, 1.4, 0.68],   // Epsilon Crucis (5ª, menor)

  // ═══ ALPHA & BETA CENTAURI (ponteiros) ═══
  [31.25, 20.27, 3.2, 0.8],    // Alpha Centauri
  [32.5, 22.16, 2.8, 0.76],    // Beta Centauri (Hadar)

  // ═══ CANOPUS — 2ª mais brilhante do céu ═══
  [58.33, 8.11, 3.4, 0.8],

  // ═══ ACHERNAR ═══
  [79.17, 5.95, 2.8, 0.784],

  // ═══ NUVENS DE MAGALHÃES (clusters difusos) ═══
  [47.0536, 14.7729, 0.68, 0.4449], [46.6042, 15.67, 0.9, 0.47], [44.9023, 13.3155, 0.98, 0.509],
  [45.0162, 13.8524, 0.73, 0.4503], [46.525, 13.0056, 0.67, 0.4867],
  [50.0572, 17.9287, 0.7, 0.4455], [49.1488, 19.9323, 0.59, 0.4447], [49.4258, 18.6025, 0.52, 0.502],
  [48.3891, 17.4448, 0.84, 0.5212],

  // ═══ DISPERSAS — campo aberto (pseudo-aleatória) ═══
  [92.9361, 24.5758, 0.52, 0.495], [71.7145, 3.9037, 0.49, 0.7713], [51.9013, 37.4681, 2.04, 0.3953],
  [90.9568, 3.9747, 0.44, 0.7309], [56.7876, 24.2314, 0.93, 0.5416], [37.2041, 33.212, 1.09, 0.4312],
  [34.2625, 20.2387, 2.19, 0.5547], [51.4709, 41.6375, 0.85, 0.3337], [33.0479, 39.2494, 1.07, 0.4094],
  [88.3889, 8.7187, 0.32, 0.6543], [45.7698, 19.7113, 0.99, 0.5404], [58.4573, 33.845, 0.9, 0.4692],
  [85.5928, 13.482, 0.5, 0.6001], [55.0036, 12.4457, 0.75, 0.6548], [54.3061, 7.8789, 0.42, 0.6741],
  [94.1969, 4.0908, 0.38, 0.7475], [88.0652, 23.4967, 0.54, 0.5203], [37.193, 9.1292, 0.31, 0.6474],
  [76.5607, 10.7621, 0.51, 0.6899], [34.7881, 36.9844, 0.45, 0.4346], [98.1225, 14.2675, 0.81, 0.628],
  [75.1962, 11.3824, 0.48, 0.6649], [47.3296, 29.5051, 0.45, 0.4762], [52.0147, 31.084, 1.05, 0.4525],
  [58.751, 15.3452, 0.43, 0.6442], [96.0126, 35.293, 0.91, 0.3595], [94.5793, 24.4346, 0.52, 0.5086],
  [59.7345, 8.8108, 0.4, 0.7292], [81.3533, 29.984, 0.84, 0.4662], [68.5995, 28.1311, 0.52, 0.5084],
  [41.4556, 9.9679, 0.84, 0.7085], [94.6441, 37.5409, 0.4, 0.3689], [67.8354, 33.2677, 1.04, 0.423],
  [32.5928, 10.8903, 0.5, 0.6925], [72.288, 33.1133, 0.49, 0.4782], [29.9238, 18.3112, 0.56, 0.5954],
  [47.0831, 15.5467, 2.12, 0.5998], [61.7199, 7.887, 0.36, 0.7276], [81.4319, 15.2103, 0.3, 0.5813],
  [46.928, 26.7474, 1.45, 0.4964], [83.4164, 5.7148, 1.97, 0.751], [68.1414, 10.7713, 0.46, 0.6615],
  [63.1225, 8.6663, 1.74, 0.7099], [84.3223, 23.2676, 0.37, 0.4848], [98.3503, 10.8105, 1.73, 0.666],
  [86.3696, 8.7726, 0.81, 0.7317], [41.0618, 41.1323, 0.59, 0.4093], [84.9148, 33.2007, 1.98, 0.4263],
  [40.2895, 8.4658, 0.56, 0.7128], [36.568, 10.518, 1.35, 0.6461], [81.8375, 15.3384, 0.45, 0.5667],
  [49.4981, 41.9268, 0.37, 0.3696], [83.6887, 23.5702, 0.82, 0.5491], [57.1186, 38.0079, 0.88, 0.4302],
  [58.2806, 40.7893, 0.51, 0.3053],

  // ═══ HORIZONTE — atmosfera atenua ═══
  [79.7653, 46.9815, 0.56, 0.2483], [9.2238, 48.1124, 0.53, 0.3338], [32.2237, 51.8516, 0.38, 0.279],
  [79.9237, 48.3732, 0.52, 0.286], [5.0737, 50.1611, 0.55, 0.305], [22.3156, 49.9947, 0.36, 0.293],
  [46.9098, 49.19, 0.51, 0.3374], [20.7616, 45.8495, 0.52, 0.3071], [41.9408, 47.7696, 0.44, 0.3157],
  [73.8686, 52.7516, 0.37, 0.2892], [83.9396, 46.0969, 0.42, 0.249], [28.4544, 48.4825, 0.36, 0.2949],
  [12.078, 51.9686, 0.33, 0.2705], [70.2177, 51.7197, 0.35, 0.2589],

  // Sub-horizonte — terra cobre a maioria, visíveis nas bordas laterais
  [9.6454, 60.163, 0.33, 0.1294], [27.7536, 56.1376, 0.48, 0.1277], [8.6933, 57.6201, 0.36, 0.2012],
  [40.6713, 59.7277, 0.33, 0.1384], [90.8592, 61.7222, 0.47, 0.1685], [62.7051, 57.8334, 0.45, 0.1396],
  [45.3013, 60.1178, 0.42, 0.1495], [40.7533, 60.1662, 0.31, 0.1731], [82.9515, 60.1879, 0.41, 0.214],
];

/** Sol dourado com 12 raios — ícone padrão esquerdo */
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

/** Lua crescente — ícone padrão direito. maskId evita colisão entre páginas. */
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
  /** Cores do gradiente de céu [topo, meio, base/horizonte] */
  skyColors?: [string, string, string];
  /** Cor da terra/horizonte */
  earthColor?: string;
  /** Cores das 3 camadas de água [onda1, onda2, onda3] */
  waterColors?: [string, string, string];
  /** Ícone esquerdo — padrão: Sol dourado */
  leftIcon?: React.ReactNode;
  /** Ícone direito — padrão: Lua crescente */
  rightIcon?: React.ReactNode;
  /** Tamanho do ícone esquerdo em px — padrão: 80 */
  leftIconSize?: number;
  /** Tamanho do ícone direito em px — padrão: 80 */
  rightIconSize?: number;
}

// Defaults: azul médio (design original, usado por Purificação)
const defaultSky: [string, string, string] = ['#1e3a5f', '#2563eb', '#38bdf8'];
const defaultWater: [string, string, string] = ['#14b8a6', '#0d9488', '#0f766e'];

export const FooterBackground = ({
  gradientId = "skyGradient",
  skyColors = defaultSky,
  earthColor = '#4a3f2e',
  waterColors = defaultWater,
  leftIcon,
  rightIcon,
  leftIconSize = 80,
  rightIconSize = 80,
}: FooterBackgroundProps) => {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      {/* CAMADA 1 — Gradiente do céu (fundo) */}
      <svg
        className="absolute left-1/2 -translate-x-1/2 h-full w-[max(100%,1200px)] z-0"
        viewBox="0 0 1200 370"
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
        <rect width="1200" height="370" fill={`url(#${gradientId})`} />
      </svg>

      {/* CAMADA 2 — Estrelas (divs circulares sobre o gradiente) */}
      {STARS.map(([xPct, yPct, size, opacity], i) => (
        <div
          key={`s${i}`}
          className="absolute rounded-full bg-white z-1"
          style={{ left: `${xPct}%`, top: `${yPct}%`, width: size, height: size, opacity }}
        />
      ))}

      {/* ÍCONES CELESTES — posicionamento responsivo centralizado */}
      {/* calc: em telas largas ~2rem; em telas estreitas tende a 1px */}
      {/* Fórmula: (viewport - 320px) * fator → 1px em 320px, ~32px em 1200px+ */}
      {/* width/height fixos em px; [&>*] força filho a preencher o container */}
      {/* top alinha centro vertical de todos os ícones em 1rem + 40px */}
      <div
        className="absolute z-10 drop-shadow-lg [&>*]:w-full [&>*]:h-full"
        style={{ top: `calc(1rem + ${(80 - leftIconSize) / 2}px)`, left: 'clamp(1px, calc((100vw - 320px) * 0.035), 2rem)', width: leftIconSize, height: leftIconSize }}
      >
        {leftIcon ?? <DefaultSun />}
      </div>
      <div
        className="absolute z-10 [&>*]:w-full [&>*]:h-full"
        style={{ top: `calc(1rem + ${(80 - rightIconSize) / 2}px)`, right: 'clamp(1px, calc((100vw - 320px) * 0.035), 2rem)', width: rightIconSize, height: rightIconSize }}
      >
        {rightIcon ?? <DefaultMoon maskId={`crescentMask_${gradientId}`} />}
      </div>

      {/* CAMADA 3 — Terra + Água (cobre estrelas abaixo do horizonte) */}
      <svg
        className="absolute left-1/2 -translate-x-1/2 h-full w-[max(100%,1200px)] z-2"
        viewBox="0 0 1200 370"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0,251 Q600,161 1200,251 L1200,400 L0,400 Z"
          fill={earthColor}
        />
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
