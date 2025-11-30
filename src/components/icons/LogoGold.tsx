/**
 * Logo da Igreja de Metatron - Versão Dourada
 */

interface LogoGoldProps {
  className?: string;
}

export const LogoGold = ({ className = "w-24 h-24" }: LogoGoldProps) => {
  return (
    <img 
      src="/logo-gold.svg" 
      alt="Logo Igreja de Metatron" 
      className={className}
    />
  );
};
