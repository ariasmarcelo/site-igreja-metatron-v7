import { useContent } from '@/hooks/useContent';

interface SharedContent {
  footer?: {
    copyright?: string;
    trademark?: string;
  };
}

/**
 * Página de edição de conteúdo compartilhado (__shared__).
 * 
 * Renderiza todos os campos de __shared__ com formatação visível
 * para que o VisualPageEditor os detecte via data-json-key.
 * 
 * Usada apenas no AdminConsole.
 */
export default function SharedContent() {
  const { data } = useContent<{ __shared__: SharedContent }>({ pages: ['__shared__'] });

  const footer = data?.['__shared__']?.footer;
  const copyright = footer?.copyright || '';
  const trademark = footer?.trademark || '';

  return (
    <div className="min-h-100 bg-linear-to-b from-stone-800 to-stone-900 rounded-xl p-12">
      {/* Header */}
      <div className="text-center mb-10">
        <h2 className="text-2xl font-bold text-white/90 mb-2">
          Conteúdo Compartilhado
        </h2>
        <p className="text-white/60 text-sm">
          Textos exibidos em todas as páginas (footer, etc.)
        </p>
      </div>

      {/* Footer Section */}
      <div className="bg-white/10 rounded-lg p-8 backdrop-blur-sm border border-white/20">
        <h3 className="text-lg font-semibold text-amber-300 mb-6 flex items-center gap-2">
          <span>📄</span> Footer
        </h3>

        <div className="space-y-6">
          {/* Copyright */}
          <div className="border border-white/10 rounded-md p-4 bg-white/5">
            <span className="text-xs text-white/40 uppercase tracking-wider block mb-2">Copyright</span>
            <p
              className="text-emerald-100/80 text-sm leading-relaxed"
              data-json-key="__shared__.footer.copyright"
            >
              {copyright || '✎ Clique para editar'}
            </p>
          </div>

          {/* Trademark */}
          <div className="border border-white/10 rounded-md p-4 bg-white/5">
            <span className="text-xs text-white/40 uppercase tracking-wider block mb-2">Trademark</span>
            <p
              className="text-emerald-100/80 text-sm leading-relaxed"
              data-json-key="__shared__.footer.trademark"
            >
              {trademark || '✎ Clique para editar'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
