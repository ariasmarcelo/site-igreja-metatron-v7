import React from 'react';

interface FooterProps {
  copyright?: string;
  trademark?: string;
  className?: string;
}

/**
 * Componente de Footer compartilhado
 * Exibe copyright e trademark vindos do conteúdo compartilhado (page_id = NULL)
 */
export const SharedFooter: React.FC<FooterProps> = ({ 
  copyright = '© 2025 Igreja de Metatron. Todos os direitos reservados.',
  trademark = 'Marcas registradas® protegidas por lei.',
  className = ''
}) => {
  return (
    <div className={`relative z-10 pt-4 pb-2 text-white ${className}`}>
      <div className="container mx-auto px-4">
        <div className="border-t border-emerald-700/50 mt-16 pt-3 pb-1 text-center text-emerald-100/70 text-sm max-w-4xl mx-auto">
          <p data-json-key="footer.copyright">{copyright}</p>
          <p className="mt-2" data-json-key="footer.trademark">{trademark}</p>
        </div>
      </div>
    </div>
  );
};
