import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { useState, useEffect, lazy, Suspense, memo } from 'react';
import { Menu, X } from 'lucide-react';
import { useLanguage, type Language } from './contexts/LanguageContext';
import { useNavigationLabels } from './hooks/useNavigationLabels';
import Index from './pages/Index';
import IndexAntiga from './pages/IndexAntiga';
import QuemSomos from './pages/QuemSomos';
import Tratamentos from './pages/Tratamentos';
import Purificacao from './pages/Purificacao';
import Artigos from './pages/Artigos';
import ArtigoDetalhes from './pages/ArtigoDetalhes';
import ArtigosCategoria from './pages/ArtigosCategoria';
import Contato from './pages/Contato';
import Testemunhos from './pages/Testemunhos';
import IconGallery from './pages/IconGallery';
import WhatsAppButton from './components/WhatsAppButton';
import NotFound from './pages/NotFound';

// Lazy load heavy components (Admin Console)
const AdminConsole = lazy(() => import('./pages/AdminConsole'));

// Componente para atualizar o título da página dinamicamente
// Deriva itens da fonte centralizada (navigation.ts) — NÃO duplicar listas aqui!
const PageTitleManager = () => {
  const location = useLocation();
  const { navigation, logo } = useNavigationLabels();
  const baseSiteName = logo.subtitle || 'O Trabalho de Resgate';

  useEffect(() => {
    // Monta mapa rota→título a partir dos items de navegação traduzidos
    const routeTitles: Record<string, string> = {};
    for (const item of navigation) {
      routeTitles[item.href] = item.label;
    }
    // Rotas especiais fora do menu de navegação
    routeTitles['/436F6E736F6C45'] = 'Painel Administrativo';

    // Títulos especiais para rotas dinâmicas
    if (location.pathname.startsWith('/artigos/categoria/')) {
      document.title = `${baseSiteName} - Artigos`;
      return;
    }
    if (location.pathname.startsWith('/artigos/') && location.pathname !== '/artigos') {
      document.title = `${baseSiteName} - Artigo`;
      return;
    }

    const pageTitle = routeTitles[location.pathname];
    document.title = pageTitle ? `${baseSiteName} - ${pageTitle}` : baseSiteName;
  }, [location.pathname, navigation, logo]);

  return null;
};

// Componente para gerenciar scroll: mantém posição no refresh (editor), reseta ao navegar (site)
const ScrollManager = () => {
  const location = useLocation();

  useEffect(() => {
    const isEditor = location.pathname === '/436F6E736F6C45';
    
    // Desabilitar scroll restoration automático do navegador sempre
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    
    if (isEditor) {
      // Restaurar scroll no editor
      const savedScroll = sessionStorage.getItem('editor_scroll');
      if (savedScroll) {
        const scrollPos = parseInt(savedScroll, 10);
        // Usar setTimeout 0 para executar após o render
        setTimeout(() => window.scrollTo(0, scrollPos), 0);
      }
      
      // Salvar ao sair
      const save = () => sessionStorage.setItem('editor_scroll', window.scrollY.toString());
      window.addEventListener('beforeunload', save);
      return () => window.removeEventListener('beforeunload', save);
    } else {
      // Site: reset ao topo APENAS quando navegar entre páginas
      window.scrollTo(0, 0);
    }
  }, [location.pathname]);

  return null;
};

/** Inline SVG flag components — small, no external dependencies */
const BrazilFlag = ({ className = 'w-7 h-5' }: { className?: string }) => (
  <svg viewBox="0 0 28 20" className={className} xmlns="http://www.w3.org/2000/svg">
    <rect width="28" height="20" rx="2" fill="#009C3B" />
    <path d="M14 3L26 10L14 17L2 10Z" fill="#FFDF00" />
    <circle cx="14" cy="10" r="4.5" fill="#002776" />
    <path d="M9.8 10.8C11.2 8.4 16.8 8.4 18.2 10.8" stroke="white" strokeWidth="0.6" fill="none" />
  </svg>
);

const USFlag = ({ className = 'w-7 h-5' }: { className?: string }) => (
  <svg viewBox="0 0 28 20" className={className} xmlns="http://www.w3.org/2000/svg">
    <rect width="28" height="20" rx="2" fill="#B22234" />
    {/* White stripes */}
    <rect y="1.54" width="28" height="1.54" fill="white" />
    <rect y="4.62" width="28" height="1.54" fill="white" />
    <rect y="7.69" width="28" height="1.54" fill="white" />
    <rect y="10.77" width="28" height="1.54" fill="white" />
    <rect y="13.85" width="28" height="1.54" fill="white" />
    <rect y="16.92" width="28" height="1.54" fill="white" />
    {/* Blue canton */}
    <rect width="11.2" height="10.77" fill="#3C3B6E" />
    {/* Simplified stars */}
    <circle cx="2" cy="1.8" r="0.6" fill="white" />
    <circle cx="4.5" cy="1.8" r="0.6" fill="white" />
    <circle cx="7" cy="1.8" r="0.6" fill="white" />
    <circle cx="9.5" cy="1.8" r="0.6" fill="white" />
    <circle cx="3.25" cy="3.5" r="0.6" fill="white" />
    <circle cx="5.75" cy="3.5" r="0.6" fill="white" />
    <circle cx="8.25" cy="3.5" r="0.6" fill="white" />
    <circle cx="2" cy="5.2" r="0.6" fill="white" />
    <circle cx="4.5" cy="5.2" r="0.6" fill="white" />
    <circle cx="7" cy="5.2" r="0.6" fill="white" />
    <circle cx="9.5" cy="5.2" r="0.6" fill="white" />
    <circle cx="3.25" cy="6.9" r="0.6" fill="white" />
    <circle cx="5.75" cy="6.9" r="0.6" fill="white" />
    <circle cx="8.25" cy="6.9" r="0.6" fill="white" />
    <circle cx="2" cy="8.6" r="0.6" fill="white" />
    <circle cx="4.5" cy="8.6" r="0.6" fill="white" />
    <circle cx="7" cy="8.6" r="0.6" fill="white" />
    <circle cx="9.5" cy="8.6" r="0.6" fill="white" />
  </svg>
);

const NavigationMenu = memo(() => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { language, setLanguage } = useLanguage();
  const location = useLocation();
  const { navigation, logo } = useNavigationLabels();

  // Esconder Navigation no painel de administração
  if (location.pathname === '/436F6E736F6C45') {
    return null;
  }

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-white/95 backdrop-blur-md shadow-lg sticky top-0 z-40 border-b border-stone-200/60">
      <div className="container mx-auto px-4">
        <div className="flex items-center h-12 md:h-14">

          {/* ═══ Logo (left) ═══ */}
          <div className="flex items-center gap-2 shrink-0">
            <Link to="/" className="shrink-0">
              <svg
                viewBox="0 0 100 100"
                className="w-8 h-8 md:w-9 md:h-9"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="50" cy="50" r="20" fill="#CFAF5A" />
                {[...Array(12)].map((_, i) => {
                  const angle = (i * 30 * Math.PI) / 180;
                  const x1 = 50 + Math.cos(angle) * 25;
                  const y1 = 50 + Math.sin(angle) * 25;
                  const x2 = 50 + Math.cos(angle) * 40;
                  const y2 = 50 + Math.sin(angle) * 40;
                  return (
                    <line
                      key={i}
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke="#CFAF5A"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                  );
                })}
              </svg>
            </Link>

            {/* Logo Text — desktop only */}
            <Link to="/" className="hidden lg:block">
              <div className="text-left leading-tight">
                <div className="text-base font-bold text-[#CFAF5A] tracking-tight leading-tight">{logo.title}</div>
                <div className="text-[10px] text-stone-500 font-medium">{logo.subtitle}</div>
              </div>
            </Link>
          </div>

          {/* ═══ Center: Desktop Navigation Links ═══ */}
          <div className="hidden md:flex items-center justify-center flex-1 mx-4">
            <div className="flex items-center gap-0.5">
              {navigation.map((item) => (
                <Link
                  key={item.id}
                  to={item.href}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                    isActive(item.href)
                      ? 'text-white bg-linear-to-br from-[#CFAF5A] to-[#A08930] shadow-md shadow-[#CFAF5A]/30 -translate-y-px'
                      : 'text-stone-600 hover:text-[#CFAF5A] hover:bg-stone-50'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* ═══ Right: Language Switcher (desktop) ═══ */}
          <div className="hidden md:flex items-center shrink-0 ml-auto">
            <div className="flex items-center bg-stone-100 rounded-full p-0.5 gap-0.5">
              <button
                onClick={() => setLanguage('pt-BR')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                  language === 'pt-BR'
                    ? 'bg-white text-stone-800 shadow-sm ring-1 ring-stone-200'
                    : 'text-stone-500 hover:text-stone-700'
                }`}
                title="Português (Brasil)"
              >
                <BrazilFlag className="w-5 h-3.5 rounded-sm" />
                <span>PT</span>
              </button>
              <button
                onClick={() => setLanguage('en-US')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                  language === 'en-US'
                    ? 'bg-white text-stone-800 shadow-sm ring-1 ring-stone-200'
                    : 'text-stone-500 hover:text-stone-700'
                }`}
                title="English (US)"
              >
                <USFlag className="w-5 h-3.5 rounded-sm" />
                <span>EN</span>
              </button>
            </div>
          </div>

          {/* ═══ Mobile: center logo text + right hamburger ═══ */}
          <Link to="/" className="md:hidden absolute left-1/2 -translate-x-1/2">
            <div className="text-center leading-tight">
              <div className="text-base font-bold text-[#CFAF5A] tracking-tight">{logo.title}</div>
              <div className="text-[10px] text-stone-500">{logo.subtitle}</div>
            </div>
          </Link>

          <button
            className="md:hidden p-2 rounded-lg hover:bg-stone-100 ml-auto"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-stone-700" />
            ) : (
              <Menu className="w-6 h-6 text-stone-700" />
            )}
          </button>
        </div>

        {/* ═══ Mobile Dropdown ═══ */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-stone-200/80 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.id}
                to={item.href}
                className={`block px-4 py-3 rounded-lg transition-all duration-200 font-medium ${
                  isActive(item.href)
                    ? 'text-white bg-linear-to-br from-[#CFAF5A] to-[#A08930] shadow-md'
                    : 'text-stone-700 hover:text-[#CFAF5A] hover:bg-stone-50'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}

            {/* Mobile Language Switcher — with flags */}
            <div className="flex items-center gap-2 px-4 pt-3 mt-2 border-t border-stone-200/80">
              <button
                onClick={() => { setLanguage('pt-BR'); setMobileMenuOpen(false); }}
                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                  language === 'pt-BR'
                    ? 'bg-stone-800 text-white shadow-md'
                    : 'text-stone-600 bg-stone-100 hover:bg-stone-200'
                }`}
              >
                <BrazilFlag className="w-6 h-4 rounded-sm" />
                Português
              </button>
              <button
                onClick={() => { setLanguage('en-US'); setMobileMenuOpen(false); }}
                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                  language === 'en-US'
                    ? 'bg-stone-800 text-white shadow-md'
                    : 'text-stone-600 bg-stone-100 hover:bg-stone-200'
                }`}
              >
                <USFlag className="w-6 h-4 rounded-sm" />
                English
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
});

const Navigation = () => {
  // Vercel serve na raiz
  const basename = '/';
  
  return (
    <BrowserRouter basename={basename}>
      <PageTitleManager />
      <ScrollManager />
      <NavigationMenu />

        {/* Routes */}
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/indexantiga" element={<IndexAntiga />} />
          <Route path="/quemsomos" element={<QuemSomos />} />
          <Route path="/tratamentos" element={<Tratamentos />} />
          <Route path="/purificacao" element={<Purificacao />} />
          <Route path="/artigos" element={<Artigos />} />
          <Route path="/artigos/categoria/:categoria" element={<ArtigosCategoria />} />
          <Route path="/artigos/:slug" element={<ArtigoDetalhes />} />
          <Route path="/contato" element={<Contato />} />
          <Route path="/testemunhos" element={<Testemunhos />} />
          <Route path="/icones" element={<IconGallery />} />
          <Route 
            path="/436F6E736F6C45" 
            element={
              <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Carregando Admin Console...</div>}>
                <AdminConsole />
              </Suspense>
            } 
          />
          <Route path="*" element={<NotFound />} />
        </Routes>

        {/* WhatsApp Button */}
        <WhatsAppButton />
      </BrowserRouter>
  );
};

export default Navigation;
