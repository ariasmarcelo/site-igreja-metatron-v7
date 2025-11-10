import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Carregar .env.local
dotenv.config({ path: join(__dirname, '..', '.env.local') });

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function checkData() {
  console.log('\n🔍 Verificando dados no Supabase...\n');
  
  const pages = ['index', 'quemsomos', 'contato', 'purificacao', 'artigos', 'testemunhos', 'tratamentos'];
  
  for (const pageId of pages) {
    const { data, error } = await supabase
      .from('page_contents')
      .select('content')
      .eq('page_id', pageId)
      .single();
    
    if (error) {
      console.log(`❌ ${pageId}: ERRO - ${error.message}`);
    } else if (!data) {
      console.log(`⚠️  ${pageId}: NÃO EXISTE no banco`);
    } else if (!data.content) {
      console.log(`⚠️  ${pageId}: content é NULL`);
    } else {
      const keys = Object.keys(data.content);
      console.log(`✅ ${pageId}: ${keys.length} chaves - ${keys.slice(0, 3).join(', ')}...`);
    }
  }
}

checkData();
