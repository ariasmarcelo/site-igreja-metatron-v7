/**
 * Ícone Tântrico — Silhueta meditando com chakras e lótus
 * Corpo humano em posição de lótus (padmasana) clássica,
 * 7 chakras ao longo da coluna e flor de lótus acima da cabeça.
 */

interface TantricIconProps {
  className?: string;
}

export const TantricIcon = ({ className = "w-6 h-6" }: TantricIconProps) => {
  // 7 chakras: posição Y ao longo da coluna + cor tradicional
  const chakras = [
    { y: 20.0, color: "#E53E3E" },  // Muladhara (raiz) — vermelho
    { y: 18.5, color: "#ED8936" },  // Svadhisthana (sacral) — laranja
    { y: 16.8, color: "#ECC94B" },  // Manipura (plexo solar) — amarelo
    { y: 15.0, color: "#48BB78" },  // Anahata (coração) — verde
    { y: 13.2, color: "#4299E1" },  // Vishuddha (garganta) — azul
    { y: 11.5, color: "#805AD5" },  // Ajna (terceiro olho) — índigo
    { y: 9.8,  color: "#D53F8C" },  // Sahasrara (coroa) — violeta/magenta
  ];

  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Cabeça */}
      <circle cx="12" cy="8.8" r="2.2" stroke="currentColor" strokeWidth="2" />

      {/* Corpo / torso */}
      <line
        x1="12" y1="11" x2="12" y2="20"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* Ombros */}
      <line
        x1="8.5" y1="13" x2="15.5" y2="13"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* Braço esquerdo — descendo até joelho esquerdo */}
      <path
        d="M8.5 13 Q7 15.5 6 17.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />

      {/* Braço direito — descendo até joelho direito */}
      <path
        d="M15.5 13 Q17 15.5 18 17.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />

      {/* Perna esquerda — posição de lótus (cruzada) */}
      <path
        d="M12 20 Q9 20.5 7 19.5 Q5.5 18.5 6 17.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />

      {/* Perna direita — posição de lótus (cruzada) */}
      <path
        d="M12 20 Q15 20.5 17 19.5 Q18.5 18.5 18 17.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />

      {/* 7 Chakras ao longo da coluna */}
      {chakras.map((c, i) => (
        <circle
          key={i}
          cx="12"
          cy={c.y}
          r="0.9"
          fill={c.color}
          opacity="0.85"
        />
      ))}

      {/* Lótus acima da cabeça */}
      <ellipse cx="12" cy="4.2" rx="1.1" ry="2.2" fill="currentColor" opacity="0.2" />
      <ellipse cx="12" cy="4.2" rx="1.1" ry="2.2" fill="currentColor" opacity="0.15" transform="rotate(-30 12 4.2)" />
      <ellipse cx="12" cy="4.2" rx="1.1" ry="2.2" fill="currentColor" opacity="0.15" transform="rotate(30 12 4.2)" />
      <ellipse cx="12" cy="4.2" rx="1.1" ry="2.2" fill="currentColor" opacity="0.12" transform="rotate(-55 12 4.2)" />
      <ellipse cx="12" cy="4.2" rx="1.1" ry="2.2" fill="currentColor" opacity="0.12" transform="rotate(55 12 4.2)" />
      <circle cx="12" cy="4.6" r="0.7" fill="currentColor" opacity="0.35" />
    </svg>
  );
};
