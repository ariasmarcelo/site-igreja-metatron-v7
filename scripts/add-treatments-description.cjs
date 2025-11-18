const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Erro: Variáveis VITE_SUPABASE_URL e SUPABASE_SERVICE_KEY devem estar definidas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const descriptions = [
  "Abordagens científicas integradas que combinam métodos validados pela neurociência com práticas terapêuticas humanistas para transformação profunda e duradoura.",
  "Tratamentos supervisionados por profissionais habilitados com registro ativo em seus respectivos conselhos."
];

function insertDescriptions() {
  const promises = descriptions.map((desc, index) => {
    return supabase
      .from('text_entries')
      .upsert({
        page_id: 'index',
        json_key: `index.treatments.description[${index}]`,
        content: { 'pt-BR': desc }
      }, {
        onConflict: 'page_id,json_key'
      })
      .then(({ data, error }) => {
        if (error) {
          console.error(`❌ Erro ao inserir description[${index}]:`, error.message);
          return null;
        }
        console.log(`✅ Inserido: index.treatments.description[${index}]`);
        return data;
      });
  });

  return Promise.all(promises)
    .then(() => {
      console.log('\n✅ Todas as descrições foram inseridas com sucesso!');
      console.log('🔄 Recarregue a página para ver as mudanças.');
    })
    .catch((err) => {
      console.error('❌ Erro geral:', err);
      process.exit(1);
    });
}

insertDescriptions();
