const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function check() {
  console.log('\n=== ESTRUTURA REAL DO SUPABASE ===\n');
  
  const { data, error } = await supabase
    .from('text_entries')
    .select('page_id, json_key, content')
    .eq('page_id', 'purificacao')
    .limit(5);
    
  if (error) {
    console.log('ERRO:', error.message);
  } else {
    console.log(`Encontrados ${data.length} registros:\n`);
    data.forEach((entry, i) => {
      console.log(`[${i+1}] page_id: "${entry.page_id}"`);
      console.log(`    json_key: "${entry.json_key}"`);
      console.log(`    content['pt-BR']: "${entry.content['pt-BR']?.substring(0, 50)}..."`);
      console.log('');
    });
  }
}

check();
