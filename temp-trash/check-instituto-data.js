// Verificar dados da seção instituto no Supabase
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function checkInstitutoData() {
  console.log('\n=== Verificando dados da seção INSTITUTO ===\n');
  
  const { data, error } = await supabase
    .from('text_entries')
    .select('json_key, content')
    .eq('page_id', 'index')
    .ilike('json_key', '%instituto%');
    
  if (error) {
    console.error('Erro:', error);
    return;
  }
  
  if (!data || data.length === 0) {
    console.log('❌ NENHUM DADO ENCONTRADO para "instituto" na página index');
    console.log('\nVocê precisa adicionar os dados no Supabase com as seguintes chaves:');
    console.log('  - index.instituto.heroExtraTitle');
    console.log('  - index.instituto.heroExtra[0]');
    console.log('  - index.instituto.heroExtra[1]');
    console.log('  - index.instituto.heroExtraList[0]');
    console.log('  - index.instituto.heroExtraFooter');
    return;
  }
  
  console.log(`✅ ${data.length} registros encontrados:\n`);
  data.forEach(entry => {
    console.log(`📝 ${entry.json_key}`);
    console.log(`   Conteúdo: ${entry.content['pt-BR']}`);
    console.log('');
  });
}

checkInstitutoData();
