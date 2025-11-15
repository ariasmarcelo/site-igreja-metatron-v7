import { LucideIcon } from 'lucide-react';

interface PageLoadingProps {
  /** Ícone da página (ex: Heart, Sparkles, Users, etc.) */
  icon: LucideIcon;
  /** Texto de loading (ex: "Carregando testemunhos...") */
  text: string;
  /** Cor de fundo (Tailwind classes, ex: "bg-rose-50") */
  bgColor?: string;
  /** Cor do ícone (Tailwind classes, ex: "text-rose-600") */
  iconColor?: string;
  /** Cor do texto (Tailwind classes, ex: "text-rose-900") */
  textColor?: string;
}

/**
 * Componente de loading padronizado para páginas
 * Exibe ícone animado + texto enquanto o conteúdo carrega
 */
export const PageLoading = ({
  icon: Icon,
  text,
  bgColor = 'bg-gradient-to-b from-slate-50 to-slate-100',
  iconColor = 'text-slate-600',
  textColor = 'text-slate-900',
}: PageLoadingProps) => {
  return (
    <div className={`min-h-screen ${bgColor} flex items-center justify-center`}>
      <div className="flex items-center gap-3">
        <Icon className={`w-6 h-6 ${iconColor} animate-pulse`} />
        <span className={`${textColor} text-xl font-medium`}>{text}</span>
      </div>
    </div>
  );
};

interface PageErrorProps {
  /** Mensagem de erro */
  message: string;
  /** Cor de fundo (Tailwind classes) */
  bgColor?: string;
  /** Cor do texto (Tailwind classes) */
  textColor?: string;
}

/**
 * Componente de erro padronizado para páginas
 */
export const PageError = ({
  message,
  bgColor = 'bg-gradient-to-b from-slate-50 to-slate-100',
  textColor = 'text-red-600',
}: PageErrorProps) => {
  return (
    <div className={`min-h-screen ${bgColor} flex items-center justify-center`}>
      <div className={`${textColor} font-semibold text-lg`}>{message}</div>
    </div>
  );
};
