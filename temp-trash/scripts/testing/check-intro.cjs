const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

supabase.from('text_entries').select('json_key').eq('page_id', 'purificacao').like('json_key', 'purificacao.intro%').limit(5)
  .then(({data}) => data.forEach(e => console.log(e.json_key)));
