// server/express-server.js
// Servidor local que usa as MESMAS serverless functions da Vercel
// Garante paridade 100% entre desenvolvimento e produção

import express from 'express';
import cors from 'cors';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import dotenv from 'dotenv';

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = resolve(__dirname, '..');

// Carregar variáveis de ambiente ANTES de importar as serverless functions
dotenv.config({ path: resolve(projectRoot, '.env.local') });

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));

console.log('🔄 Carregando serverless functions...\n');

// Helper para montar serverless functions
function mountServerlessFunction(path, method, route) {
  try {
    const functionPath = resolve(projectRoot, 'api', path);
    
    // Importar função CommonJS
    delete require.cache[require.resolve(functionPath)]; // Clear cache
    const handler = require(functionPath);
    
    // Montar rota
    if (method === 'GET') {
      app.get(route, handler);
    } else if (method === 'POST') {
      app.post(route, handler);
    } else if (method === 'PUT') {
      app.put(route, handler);
    }
    
    console.log(`✓ ${method.padEnd(6)} ${route.padEnd(35)} → api/${path}`);
  } catch (error) {
    console.error(`✗ ${method.padEnd(6)} ${route.padEnd(35)} → ERRO: ${error.message}`);
  }
}

// Montar todas as serverless functions
try {
  // POST routes
  mountServerlessFunction('save-json.js', 'POST', '/api/save-json');
  mountServerlessFunction('save-visual-edits.js', 'POST', '/api/save-visual-edits');
  mountServerlessFunction('save-styles.js', 'POST', '/api/save-styles');
  
  // GET routes com parâmetros dinâmicos
  // Vercel: /api/content/[pageId].js → Express: /api/content/:pageId
  mountServerlessFunction('content/[pageId].js', 'GET', '/api/content/:pageId');
  mountServerlessFunction('styles/[pageId].js', 'GET', '/api/styles/:pageId');
  
  console.log('\n' + '='.repeat(60));
  
  // Health check
  app.get('/health', (req, res) => {
    res.json({
      status: 'ok',
      mode: 'development',
      serverType: 'serverless-compatible',
      timestamp: new Date().toISOString()
    });
  });
  
  // Iniciar servidor
  app.listen(PORT, () => {
    console.log(`\n🚀 Servidor Local (Serverless-Compatible)!`);
    console.log(`📍 Porta: ${PORT}`);
    console.log(`🔗 URL: http://localhost:${PORT}`);
    console.log(`\n💡 Usando as MESMAS funções que rodam na Vercel`);
    console.log(`   Paridade 100% dev ↔ produção!\n`);
  });
  
} catch (error) {
  console.error('\n❌ Erro ao inicializar:', error);
  process.exit(1);
}
