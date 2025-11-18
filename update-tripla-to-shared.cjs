require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function updateRecord(id) {
  if (!id) {
    console.error('❌ Por favor, forneça um ID de registro');
    console.log('Uso: node update-tripla-to-shared.cjs <ID>');
    return;
  }

  // Buscar o registro atual
  const { data: current, error: fetchError } = await supabase
    .from('text_entries')
    .select('*')
    .eq('id', id)
    .single();

  if (fetchError || !current) {
    console.error('❌ Erro ao buscar registro:', fetchError || 'Registro não encontrado');
    return;
  }

  console.log('\n📋 Registro atual:');
  console.log(`   ID: ${current.id}`);
  console.log(`   page_id: ${current.page_id}`);
  console.log(`   json_key: ${current.json_key}`);
  
  // Atualizar para __shared__ e ajustar json_key
  const newJsonKey = current.json_key.replace(/^index\./, '__shared__.');
  
  const { data, error } = await supabase
    .from('text_entries')
    .update({ 
      page_id: '__shared__',
      json_key: newJsonKey
    })
    .eq('id', id)
    .select();

  if (error) {
    console.error('❌ Erro ao atualizar:', error);
    return;
  }

  console.log('\n✅ Registro atualizado com sucesso!');
  console.log(`   Novo page_id: __shared__`);
  console.log(`   Novo json_key: ${newJsonKey}`);
}

const recordId = process.argv[2];
updateRecord(recordId);
