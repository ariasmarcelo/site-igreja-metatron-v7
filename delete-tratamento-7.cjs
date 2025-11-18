require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Supabase credentials not found in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function deleteTratamento7() {
  try {
    console.log('🔍 Buscando registros de tratamentos.treatments[7]...\n');

    // Buscar todos os registros que começam com tratamentos.treatments[7]
    const { data: records, error: fetchError } = await supabase
      .from('text_entries')
      .select('*')
      .eq('page_id', 'tratamentos')
      .like('json_key', 'tratamentos.treatments[7]%');

    if (fetchError) {
      console.error('❌ Erro ao buscar registros:', fetchError);
      process.exit(1);
    }

    if (!records || records.length === 0) {
      console.log('⚠️  Nenhum registro encontrado para treatments[7]');
      return;
    }

    console.log(`📋 Encontrados ${records.length} registros:\n`);
    records.forEach((record, idx) => {
      console.log(`${idx + 1}. ID: ${record.id}`);
      console.log(`   Key: ${record.json_key}`);
      console.log(`   Text: ${record.text_pt?.substring(0, 80)}...`);
      console.log('');
    });

    // Deletar todos os registros
    const ids = records.map(r => r.id);
    const { error: deleteError } = await supabase
      .from('text_entries')
      .delete()
      .in('id', ids);

    if (deleteError) {
      console.error('❌ Erro ao deletar registros:', deleteError);
      process.exit(1);
    }

    console.log(`✅ ${ids.length} registros deletados com sucesso!`);
    console.log('🎯 Tratamento "Fundamentação Espiritual Sólida" removido da listagem');

  } catch (error) {
    console.error('❌ Erro:', error);
    process.exit(1);
  }
}

deleteTratamento7();
