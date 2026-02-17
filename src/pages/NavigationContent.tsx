import { useContent } from '@/hooks/useContent';
import { navigationItems } from '@/config/navigation';

interface NavigationData {
  index?: string;
  purificacao?: string;
  tratamentos?: string;
  testemunhos?: string;
  quemsomos?: string;
  contato?: string;
  logo?: {
    title?: string;
    subtitle?: string;
  };
}

/**
 * Página de edição dos labels de navegação (__navigation__).
 *
 * Renderiza todos os campos de __navigation__ com data-json-key
 * para que o VisualPageEditor os detecte e permita edição multilíngue.
 *
 * Usada apenas no AdminConsole.
 */
export default function NavigationContent() {
  const { data } = useContent<{ __navigation__: NavigationData }>({ pages: ['__navigation__'] });

  const nav = data?.['__navigation__'];
  const logo = nav?.logo;

  return (
    <div className="min-h-100 bg-linear-to-b from-indigo-900 to-slate-900 rounded-xl p-12">
      {/* Header */}
      <div className="text-center mb-10">
        <h2 className="text-2xl font-bold text-white/90 mb-2">
          Navegação &amp; Traduções
        </h2>
        <p className="text-white/60 text-sm">
          Labels do menu, título do site e subtítulo — automaticamente traduzidos em todos os idiomas
        </p>
      </div>

      {/* Logo / Branding */}
      <div className="bg-white/10 rounded-lg p-8 backdrop-blur-sm border border-white/20 mb-8">
        <h3 className="text-lg font-semibold text-amber-300 mb-6 flex items-center gap-2">
          <span>🏛️</span> Logo / Branding
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Title */}
          <div className="border border-white/10 rounded-md p-4 bg-white/5">
            <span className="text-xs text-white/40 uppercase tracking-wider block mb-2">Título do Site</span>
            <p
              className="text-white text-xl font-bold"
              data-json-key="__navigation__.logo.title"
            >
              {(logo?.title as string) || '✎ Clique para editar'}
            </p>
          </div>

          {/* Subtitle */}
          <div className="border border-white/10 rounded-md p-4 bg-white/5">
            <span className="text-xs text-white/40 uppercase tracking-wider block mb-2">Subtítulo</span>
            <p
              className="text-white/80 text-lg italic"
              data-json-key="__navigation__.logo.subtitle"
            >
              {(logo?.subtitle as string) || '✎ Clique para editar'}
            </p>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="bg-white/10 rounded-lg p-8 backdrop-blur-sm border border-white/20">
        <h3 className="text-lg font-semibold text-amber-300 mb-6 flex items-center gap-2">
          <span>📑</span> Itens do Menu
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {navigationItems.map(item => {
            const value = nav?.[item.id as keyof NavigationData];
            const displayValue = typeof value === 'string' ? value : '';

            return (
              <div
                key={item.id}
                className="border border-white/10 rounded-md p-4 bg-white/5 hover:bg-white/10 transition-colors"
              >
                <span className="text-xs text-white/40 uppercase tracking-wider block mb-1">
                  {item.id}
                </span>
                <span className="text-xs text-indigo-300/60 block mb-3">
                  {item.href}
                </span>
                <p
                  className="text-white font-medium text-base"
                  data-json-key={`__navigation__.${item.id}`}
                >
                  {displayValue || '✎ Clique para editar'}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
