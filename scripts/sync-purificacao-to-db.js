/**
 * Script para sincronizar Purificacao.json com o banco de dados Supabase
 * 
 * Uso: node scripts/sync-purificacao-to-db.js
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function syncPurificacaoToDb() {
  try {
    console.log('📖 Lendo Purificacao.json...');
    
    // Ler o arquivo JSON
    const jsonPath = join(__dirname, '../src/locales/pt-BR/Purificacao.json');
    const jsonContent = JSON.parse(readFileSync(jsonPath, 'utf-8'));
    
    console.log('✓ JSON carregado com sucesso');
    console.log(`📊 Chaves principais: ${Object.keys(jsonContent).join(', ')}`);
    
    // Enviar para API
    console.log('\n📤 Enviando para banco de dados (localhost:3001)...');
    
    const response = await fetch('http://localhost:3001/api/save-json', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        pageId: 'purificacao',
        content: jsonContent
      })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }
    
    const result = await response.json();
    
    console.log('✅ Sincronização concluída com sucesso!');
    console.log('📝 Detalhes:', result);
    console.log('\n🌐 Conteúdo atualizado no Supabase!');
    console.log('🔄 Recarregue o site para ver as mudanças');
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
    console.error('\n💡 Dica: Certifique-se de que o servidor backend está rodando:');
    console.error('   pnpm server  ou  node server/express-server.js');
    process.exit(1);
  }
}

syncPurificacaoToDb();
