// Check shared content in database
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkShared() {
  console.log('Checking __shared__ entries...\n');
  
  const { data, error } = await supabase
    .from('text_entries')
    .select('page_id, json_key')
    .eq('page_id', '__shared__')
    .limit(20);
  
  if (error) {
    console.error('Error:', error.message);
    return;
  }
  
  console.log(`Found ${data.length} __shared__ entries:`);
  data.forEach(entry => {
    console.log(`  - ${entry.json_key}`);
  });
  
  // Check footer entries in index
  console.log('\n\nChecking footer entries in index page...\n');
  
  const { data: footerData, error: footerError } = await supabase
    .from('text_entries')
    .select('page_id, json_key')
    .eq('page_id', 'index')
    .like('json_key', 'index.footer%')
    .limit(20);
  
  if (footerError) {
    console.error('Error:', footerError.message);
    return;
  }
  
  console.log(`Found ${footerData.length} index.footer entries:`);
  footerData.forEach(entry => {
    console.log(`  - ${entry.json_key}`);
  });
}

checkShared();
