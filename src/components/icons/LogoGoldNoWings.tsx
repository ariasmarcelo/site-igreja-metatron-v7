/**
 * Logo da Igreja de Metatron - Versão Dourada SEM asas
 * Idêntico ao logo principal, mas apenas o símbolo central (hexagrama + raios)
 */

interface LogoGoldNoWingsProps {
  className?: string;
}

export const LogoGoldNoWings = ({ className = "w-24 h-24" }: LogoGoldNoWingsProps) => {
  return (
    <img
      src="/logo-metatron-sem-asas-gold.svg"
      alt="Logo Igreja de Metatron (símbolo)"
      className={className}
    />
  );
};
