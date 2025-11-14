// Add shared content to database
// Usage: node scripts/add-shared-content.js

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// EXEMPLOS DE CONTEÚDO COMPARTILHADO
// Adicione aqui os blocos que você quer compartilhar entre páginas
const sharedContent = [
  // Cabeçalho compartilhado
  {
    json_key: 'header.logo.text',
    content: { 'pt-BR': 'Igreja de Metatron' }
  },
  {
    json_key: 'header.logo.subtitle',
    content: { 'pt-BR': 'Restauração e Cura Integral' }
  },
  
  // Menu compartilhado
  {
    json_key: 'menu.items[0].text',
    content: { 'pt-BR': 'Início' }
  },
  {
    json_key: 'menu.items[0].url',
    content: { 'pt-BR': '/' }
  },
  {
    json_key: 'menu.items[1].text',
    content: { 'pt-BR': 'Quem Somos' }
  },
  {
    json_key: 'menu.items[1].url',
    content: { 'pt-BR': '/quem-somos' }
  },
  
  // CTA compartilhado
  {
    json_key: 'cta.global.title',
    content: { 'pt-BR': 'Pronto para Começar?' }
  },
  {
    json_key: 'cta.global.subtitle',
    content: { 'pt-BR': 'Agende sua consulta inicial e dê o primeiro passo.' }
  },
  {
    json_key: 'cta.global.buttonText',
    content: { 'pt-BR': 'Agendar Consulta' }
  },
  
  // Aviso legal compartilhado
  {
    json_key: 'legal.disclaimer',
    content: { 'pt-BR': 'Os serviços oferecidos não substituem acompanhamento médico profissional.' }
  }
];

async function addSharedContent() {
  console.log('📝 Adicionando conteúdo compartilhado...\n');
  
  let added = 0;
  let updated = 0;
  let errors = 0;
  
  for (const item of sharedContent) {
    console.log(`Processando: ${item.json_key}`);
    
    // Verificar se já existe
    const { data: existing } = await supabase
      .from('text_entries')
      .select('id')
      .eq('json_key', item.json_key)
      .single();
    
    // Upsert
    const { error } = await supabase
      .from('text_entries')
      .upsert({
        page_id: '__shared__',
        json_key: item.json_key,
        content: item.content,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'json_key'
      });
    
    if (error) {
      console.error(`  ❌ Erro: ${error.message}`);
      errors++;
    } else {
      if (existing) {
        console.log(`  ✅ Atualizado`);
        updated++;
      } else {
        console.log(`  ✅ Adicionado`);
        added++;
      }
    }
  }
  
  console.log(`\n✅ Concluído: ${added} adicionados, ${updated} atualizados, ${errors} erros`);
  console.log('\n💡 Não esqueça de limpar o cache LMDB!');
  console.log('   Remove-Item -Recurse -Force ".cache\\content-lmdb"');
}

addSharedContent();
