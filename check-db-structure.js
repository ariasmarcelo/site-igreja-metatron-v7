const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function check() {
  const { data, error } = await supabase
    .from('text_entries')
    .select('*')
    .eq('page_id', 'purificacao')
    .limit(3);
    
  if (error) {
    console.log('ERRO:', error.message);
  } else {
    console.log('Estrutura DB:');
    console.log(JSON.stringify(data, null, 2));
  }
}

check();
