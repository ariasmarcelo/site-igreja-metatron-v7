// Migrate footer entries from index page to __shared__
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

async function migrateFooter() {
  console.log('🔄 Migrating footer entries from index to __shared__...\n');
  
  // 1. Get all footer entries from index page
  const { data: footerEntries, error: fetchError } = await supabase
    .from('text_entries')
    .select('*')
    .eq('page_id', 'index')
    .like('json_key', 'index.footer%');
  
  if (fetchError) {
    console.error('❌ Error fetching footer entries:', fetchError.message);
    return;
  }
  
  console.log(`Found ${footerEntries.length} footer entries to migrate\n`);
  
  // 2. Migrate each entry
  let migrated = 0;
  let errors = 0;
  
  for (const entry of footerEntries) {
    // Remove "index." prefix from json_key
    const newJsonKey = entry.json_key.replace('index.', '');
    
    console.log(`Migrating: ${entry.json_key} → ${newJsonKey}`);
    
    // Insert into __shared__ (or update if exists)
    const { error: upsertError } = await supabase
      .from('text_entries')
      .upsert({
        page_id: '__shared__',
        json_key: newJsonKey,
        content: entry.content,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'json_key'
      });
    
    if (upsertError) {
      console.error(`  ❌ Error: ${upsertError.message}`);
      errors++;
      continue;
    }
    
    // Delete from index page
    const { error: deleteError } = await supabase
      .from('text_entries')
      .delete()
      .eq('page_id', 'index')
      .eq('json_key', entry.json_key);
    
    if (deleteError) {
      console.error(`  ⚠️ Error deleting old entry: ${deleteError.message}`);
    }
    
    console.log(`  ✅ Migrated successfully`);
    migrated++;
  }
  
  console.log(`\n✅ Migration complete: ${migrated} migrated, ${errors} errors`);
  
  // Clear LMDB cache
  console.log('\n🧹 Remember to clear LMDB cache after migration!');
}

migrateFooter();
