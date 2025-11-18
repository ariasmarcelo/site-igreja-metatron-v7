import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
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
import { navigationItems } from '@/config/navigation';

export default function AdminConsole() {
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

  // Construir páginas a partir da configuração centralizada do menu
  const pages = navigationItems.map(item => ({
    id: item.id,
    name: item.name,
    component: componentMap[item.id],
  }));

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
                <div className="admin-console-page-selector">
                  <Tabs value={pageTab} onValueChange={setPageTab}>
                    <div className="bg-white border-2 border-[#d4af37] shadow-md p-4 rounded-lg">
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

                    {pages.map(page => (
                      <TabsContent key={page.id} value={page.id} className="admin-console-page-content">
                        <VisualPageEditor
                          pageId={page.id}
                          pageName={page.name}
                          pageComponent={page.component}
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
