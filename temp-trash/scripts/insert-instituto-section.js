// Script para inserir dados da seção instituto no Supabase
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY // Service key para poder fazer INSERT
);

const institutoData = [
  {
    page_id: 'index',
    json_key: 'index.instituto.firstCallTitle',
    content: { 'pt-BR': 'Redescubra seu equilíbrio interno emocional, mental e espiritual' }
  },
  {
    page_id: 'index',
    json_key: 'index.instituto.firstCall[0]',
    content: { 'pt-BR': '"Se você está passando por desafios emocionais ou espirituais, não precisa enfrentar isso sozinho. Estamos aqui para caminhar com você em direção à cura e ao equilíbrio."' }
  },
  {
    page_id: 'index',
    json_key: 'index.instituto.firstCall[1]',
    content: { 'pt-BR': 'Você sente que está sobrecarregado, ansioso ou bloqueado para avançar na vida?' }
  },
  {
    page_id: 'index',
    json_key: 'index.instituto.firstCall[2]',
    content: { 'pt-BR': 'As dificuldades nas relações, a hipersensibilidade às críticas e as emoções intensas podem ser reflexo de experiências traumáticas antigas — mesmo aquelas de que você não se lembra.' }
  },
  {
    page_id: 'index',
    json_key: 'index.instituto.firstCall[3]',
    content: { 'pt-BR': 'Todo nosso trabalho é baseado na Neurofisiologia do Trauma, ajudando você a:' }
  },
  {
    page_id: 'index',
    json_key: 'index.instituto.firstCallList[0]',
    content: { 'pt-BR': 'Compreender suas emoções em profundidade' }
  },
  {
    page_id: 'index',
    json_key: 'index.instituto.firstCallList[1]',
    content: { 'pt-BR': 'Regular seu sistema nervoso' }
  },
  {
    page_id: 'index',
    json_key: 'index.instituto.firstCallList[2]',
    content: { 'pt-BR': 'Liberar padrões que aprisionam seu potencial' }
  },
  {
    page_id: 'index',
    json_key: 'index.instituto.firstCallList[3]',
    content: { 'pt-BR': 'Reconectar-se com os seus e com quem você realmente é' }
  },
  {
    page_id: 'index',
    json_key: 'index.instituto.firstCall[4]',
    content: { 'pt-BR': 'Com técnica precisa e um olhar de compaixão genuína, oferecemos caminhos para uma cura real e duradoura.' }
  },
  {
    page_id: 'index',
    json_key: 'index.instituto.firstCallFooter',
    content: { 'pt-BR': 'Se você está pronto para transformar sua vida, nós estamos prontos para ajudar.' }
  }
];

async function insertInstitutoSection() {
  console.log('\n=== Inserindo dados da seção INSTITUTO ===\n');
  
  let successCount = 0;
  let errorCount = 0;
  
  for (const entry of institutoData) {
    const { error } = await supabase
      .from('text_entries')
      .upsert(entry, { onConflict: 'json_key' });
    
    if (error) {
      console.error(`❌ Erro ao inserir ${entry.json_key}:`, error.message);
      errorCount++;
    } else {
      console.log(`✅ Inserido: ${entry.json_key}`);
      successCount++;
    }
  }
  
  console.log(`\n📊 Resultado: ${successCount} sucesso, ${errorCount} erros`);
  
  if (successCount > 0) {
    console.log('\n✅ Dados inseridos com sucesso!');
    console.log('🔄 Recarregue a página http://localhost:3000 para ver as mudanças.');
  }
}

insertInstitutoSection();
