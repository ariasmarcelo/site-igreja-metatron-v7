/**
 * Sol com 12 raios - Ícone customizado
 * Substitui o ícone Sun do Lucide (que tem 8 raios)
 */

interface Sun12RaysProps {
  className?: string;
}

export const Sun12Rays = ({ className = "w-6 h-6" }: Sun12RaysProps) => {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Círculo central */}
      <circle cx="12" cy="12" r="4" />
      
      {/* 12 raios (ângulo de 30° entre cada um) */}
      {[...Array(12)].map((_, i) => {
        const angle = (i * 30 * Math.PI) / 180;
        const innerRadius = 6;
        const outerRadius = 10;
        const x1 = 12 + Math.cos(angle) * innerRadius;
        const y1 = 12 + Math.sin(angle) * innerRadius;
        const x2 = 12 + Math.cos(angle) * outerRadius;
        const y2 = 12 + Math.sin(angle) * outerRadius;
        
        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
          />
        );
      })}
    </svg>
  );
};
