/**
 * Backup rápido do Supabase
 */
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const supabaseUrl = 'https://laikwxajpcahfatiybnb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxhaWt3eGFqcGNhaGZhdGl5Ym5iIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjU2ODMwMywiZXhwIjoyMDc4MTQ0MzAzfQ.nvcfxdNtcl5FhU7-xvEq3niiqCzdUzobGIshth5klLE';

const supabase = createClient(supabaseUrl, supabaseKey);

const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
const backupDir = path.join(process.cwd(), 'backups', `backup-${timestamp}`);

console.log('🗄️  Iniciando backup do Supabase...');
console.log(`📁 Salvando em: ${backupDir}\n`);

// Criar diretório
if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir, { recursive: true });
}

async function backupTable(tableName) {
  console.log(`📦 Fazendo backup de: ${tableName}`);
  
  const { data, error } = await supabase
    .from(tableName)
    .select('*');
  
  if (error) {
    console.error(`❌ Erro em ${tableName}:`, error.message);
    return;
  }
  
  const filename = path.join(backupDir, `${tableName}.json`);
  fs.writeFileSync(filename, JSON.stringify(data, null, 2));
  console.log(`✅ ${tableName}: ${data.length} registros salvos`);
}

async function run() {
  await backupTable('text_entries');
  await backupTable('page_history');
  
  console.log(`\n🎉 Backup completo salvo em:\n${backupDir}`);
}

run().catch(console.error);
