require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function listTriplaProtecao() {
  // Buscar registros onde json_key começa com "index.triplaProtecao"
  const { data: allData, error: err1 } = await supabase
    .from('text_entries')
    .select('*')
    .eq('page_id', 'index');
  
  if (err1) {
    console.error('Error:', err1);
    return;
  }
  
  // Filtrar os que começam com "index.triplaProtecao"
  const data = allData.filter(row => 
    row.json_key && row.json_key.startsWith('index.triplaProtecao')
  ).sort((a, b) => a.json_key.localeCompare(b.json_key));
  
  const error = null;

  if (error) {
    console.error('Error:', error);
    return;
  }

  console.log('\n=== Registros da seção Tripla Proteção ===\n');
  data.forEach((row, i) => {
    // Tentar encontrar o campo de texto (pode ser 'text', 'content', 'data', etc)
    const allKeys = Object.keys(row);
    const textKey = allKeys.find(k => !['id', 'page_id', 'json_key', 'created_at', 'updated_at'].includes(k));
    const textField = textKey ? row[textKey] : null;
    
    let preview = '';
    if (typeof textField === 'string') {
      preview = textField.length > 80 ? textField.substring(0, 80) + '...' : textField;
    } else if (textField && typeof textField === 'object') {
      const jsonStr = JSON.stringify(textField);
      preview = jsonStr.length > 80 ? jsonStr.substring(0, 80) + '...' : jsonStr;
    }
    
    console.log(`${i + 1}. ID: ${row.id}`);
    console.log(`   page_id: ${row.page_id}`);
    console.log(`   json_key: ${row.json_key}`);
    console.log(`   conteúdo: ${preview}`);
    console.log('');
  });
  
  console.log(`Total: ${data.length} registros`);
}

listTriplaProtecao();
