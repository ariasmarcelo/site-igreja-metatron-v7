// config/api.ts
// Configuração centralizada das URLs da API

const isDevelopment = import.meta.env.DEV;

// URL da API baseada no ambiente
// Em dev: Vercel Dev serve APIs na mesma porta do Vite (caminho relativo '')
// Em prod: Vercel injeta automaticamente a URL via VITE_API_URL ou usa caminho relativo
// Prioridade: VITE_API_URL (env) → '' (caminho relativo - funciona em ambos)
export const API_BASE_URL = import.meta.env.VITE_API_URL || '';

// Endpoints da API
export const API_ENDPOINTS = {
  // Conteúdo (sistema granular)
  getContent: (pageId: string) => `${API_BASE_URL}/api/content-v2?pages=${pageId}`,
  
  // Salvamento (sistema granular)
  saveVisualEdits: `${API_BASE_URL}/api/save-visual-edits`, // Edições campo-a-campo
};

// Log da configuração em desenvolvimento
if (isDevelopment) {
  console.log('🔧 API Configuration:', {
    environment: 'development',
    baseUrl: API_BASE_URL || '(relative path)',
    endpoints: {
      getContent: API_ENDPOINTS.getContent('example'),
      saveVisualEdits: API_ENDPOINTS.saveVisualEdits
    }
  });
}

export default API_ENDPOINTS;
