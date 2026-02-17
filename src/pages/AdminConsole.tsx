import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useLanguage } from '@/contexts/LanguageContext';
import VisualPageEditor from '@/components/VisualPageEditor';
import ArtigosEditor from '@/components/ArtigosEditor';
import Index from './Index';
import { API_ENDPOINTS } from '@/config/api';
import QuemSomos from './QuemSomos';
import Contato from './Contato';
import Purificacao from './Purificacao';
import Artigos from './Artigos';
import Testemunhos from './Testemunhos';
import Tratamentos from './Tratamentos';
import SharedContent from './SharedContent';
import NavigationContent from './NavigationContent';
import { navigationItems } from '@/config/navigation';
import { useNavigationLabels } from '@/hooks/useNavigationLabels';

export default function AdminConsole() {
  // Obter idioma do contexto
  const { language: contextLanguage, setLanguage: setContextLanguage } = useLanguage();

  // Mapeamento de componentes por ID
  const componentMap: Record<string, React.ComponentType> = {
    index: Index,
    quemsomos: QuemSomos,
    purificacao: Purificacao,
    tratamentos: Tratamentos,
    testemunhos: Testemunhos,
    artigos: Artigos,
    contato: Contato,
  };

  // Labels traduzidos para a navegação
  const { navigation: navLabels } = useNavigationLabels();

  // Construir páginas a partir da configuração centralizada do menu + labels traduzidos
  const pages = [
    ...navigationItems.map(item => {
      const translated = navLabels.find(n => n.id === item.id);
      return {
        id: item.id,
        name: translated?.label || item.name,
        component: componentMap[item.id],
      };
    }),
    // Páginas especiais (não estão no menu de navegação)
    { id: '__shared__', name: '⚙️ Conteúdo Compartilhado', component: SharedContent as React.ComponentType },
    { id: '__navigation__', name: '🗺️ Navegação & Traduções', component: NavigationContent as React.ComponentType },
  ];

  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem('adminConsole_activeTab') || 'pages';
  });
  const [pageTab, setPageTab] = useState(() => {
    return localStorage.getItem('adminConsole_pageTab') || 'index';
  });
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);



  // Salvar estados de abas no localStorage
  useEffect(() => {
    localStorage.setItem('adminConsole_activeTab', activeTab);
  }, [activeTab]);

  useEffect(() => {
    localStorage.setItem('adminConsole_pageTab', pageTab);
  }, [pageTab]);

  useEffect(() => {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.startsWith('visual_') || key.startsWith('admin_') || key.startsWith('wysiwyg_'))) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key));
  }, []);





  return (
    <div className="admin-console-container">
      <div className="admin-console-wrapper">
        <Card>
          <CardContent className="admin-console-card-content">
            <h1 className="admin-console-title">Admin Console</h1>

            {message && (
              <Alert className="admin-console-alert">
                <AlertDescription>{message.text}</AlertDescription>
              </Alert>
            )}

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="pages" className="admin-console-main-tab">Pages</TabsTrigger>
                <TabsTrigger value="artigos" className="admin-console-main-tab">Artigos</TabsTrigger>
              </TabsList>

              <TabsContent value="pages">
                <div>
                  <Tabs value={pageTab} onValueChange={setPageTab}>
                    {/* 🔒 BARRA STICKY: seletores sempre visíveis durante edição */}
                    <div className="sticky top-0 z-50 bg-white pb-4 shadow-sm border-b border-stone-200 mb-4">
                      {/* 🌐 SELETOR DE IDIOMA AO NÍVEL DA PÁGINA */}
                      <div className="flex items-center gap-3 bg-linear-to-r from-amber-50 to-yellow-50 border-2 border-[#d4af37] rounded-lg p-4">
                        <span className="text-sm font-semibold text-gray-700">🌐 Idioma de Visualização:</span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setContextLanguage('pt-BR')}
                            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
                              contextLanguage === 'pt-BR'
                                ? 'bg-green-500 text-white shadow-md'
                                : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-[#d4af37]'
                            }`}
                          >
                            🇧🇷 Português (PT-BR)
                          </button>
                          <button
                            onClick={() => setContextLanguage('en-US')}
                            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
                              contextLanguage === 'en-US'
                                ? 'bg-blue-500 text-white shadow-md'
                                : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-[#d4af37]'
                            }`}
                          >
                            🇺🇸 English (EN-US)
                          </button>
                        </div>
                        <span className="text-xs text-gray-600 ml-auto italic">
                          A página é renderizada no idioma selecionado
                        </span>
                      </div>

                      <div className="bg-white border-2 border-[#d4af37] shadow-md p-4 rounded-lg mt-3">
                        <h2 className="admin-console-page-selector-title mb-3">
                          📄 Selecione uma Página para Editar
                        </h2>
                        <TabsList className="admin-console-page-tabs-list flex flex-wrap gap-3 bg-transparent border-0 shadow-none p-0 w-full h-auto">
                          {pages.map(page => (
                            <TabsTrigger 
                              key={page.id} 
                              value={page.id} 
                              className="admin-console-page-tab min-w-40 px-6 py-3 font-semibold text-base whitespace-nowrap inline-flex items-center justify-center h-auto rounded-md border-2 border-stone-200 transition-all hover:border-[#d4af37] data-[state=active]:bg-[#d4af37] data-[state=active]:text-white data-[state=active]:border-[#d4af37] data-[state=active]:shadow-lg"
                            >
                              {page.name}
                            </TabsTrigger>
                          ))}
                        </TabsList>
                      </div>
                    </div>

                    {pages.map(page => (
                      <TabsContent key={page.id} value={page.id} className="admin-console-page-content">
                        <VisualPageEditor
                          pageId={page.id}
                          pageName={page.name}
                          pageComponent={page.component}
                          selectedLanguage={contextLanguage}
                        />
                      </TabsContent>
                    ))}
                  </Tabs>
                </div>
              </TabsContent>

              <TabsContent value="artigos">
                <ArtigosEditor />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
