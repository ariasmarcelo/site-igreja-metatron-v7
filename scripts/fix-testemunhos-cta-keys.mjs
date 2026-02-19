/**
 * Fix: renomear testemunhos_cta (string) → testemunhos_cta.text (objeto)
 * para que testemunhos_cta.button funcione sem conflito
 */
const API_BASE = 'http://localhost:3000/api/content/index';

async function fixKeys() {
  const edits = {};

  // Mover o texto para .text dentro do objeto
  edits['testemunhos_cta.text'] = {
    newText: {
      'pt-BR': 'Veja o que dizem as pessoas que já passaram por essa experiência transformadora.',
      'en-US': 'See what people who have been through this transformative experience have to say.'
    }
  };

  // Limpar a key flat que causa conflito — setar para null/vazio
  // Na verdade, vamos simplesmente não mexer nela — o importante é que o código
  // não tente ler texts.testemunhos_cta como string E como objeto ao mesmo tempo.
  // A solução é mudar o código para usar texts.testemunhos_cta_text ou similar.
  
  // Alternativa: criar uma key completamente diferente
  edits['testemunhosCta.text'] = {
    newText: {
      'pt-BR': 'Veja o que dizem as pessoas que já passaram por essa experiência transformadora.',
      'en-US': 'See what people who have been through this transformative experience have to say.'
    }
  };

  edits['testemunhosCta.button'] = {
    newText: {
      'pt-BR': 'Ler Testemunhos',
      'en-US': 'Read Testimonials'
    }
  };

  console.log(`Enviando ${Object.keys(edits).length} keys ao banco...`);

  try {
    const response = await fetch(API_BASE, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ edits })
    });
    const result = await response.json();
    if (result.success) {
      console.log(`✅ Sucesso! ${result.updatedCount} campos atualizados.`);
    } else {
      console.error(`❌ Erro: ${result.message}`);
    }
  } catch (err) {
    console.error(`❌ Erro de conexão: ${err.message}`);
  }
}

fixKeys();
