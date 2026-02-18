/**
 * Upload das novas keys para a seção "Dois Caminhos, Uma Missão" da Index
 * + CTA de testemunhos
 * Keys: index.caminhos.* + index.testemunhos_cta
 */

const API_BASE = 'http://localhost:3000/api/content/index';

async function uploadCaminhos() {
  const edits = {};

  // Título da seção
  edits['caminhos.title'] = {
    newText: {
      'pt-BR': 'Dois Caminhos, Uma Missão',
      'en-US': 'Two Paths, One Mission'
    }
  };

  // === IGREJA ===
  edits['caminhos.igreja.resumo'] = {
    newText: {
      'pt-BR': 'A Igreja de Metatron é um espaço sagrado de estudo, prática e evolução espiritual. Baseada nos princípios herméticos universais, oferece um caminho de purificação e ascensão da consciência.',
      'en-US': 'The Church of Metatron is a sacred space for study, practice, and spiritual evolution. Based on universal hermetic principles, it offers a path of purification and ascension of consciousness.'
    }
  };

  edits['caminhos.igreja.items[0]'] = {
    newText: {
      'pt-BR': 'Trabalho de Purificação e Ascensão',
      'en-US': 'Purification and Ascension Work'
    }
  };
  edits['caminhos.igreja.items[1]'] = {
    newText: {
      'pt-BR': 'Estudos dos princípios herméticos universais',
      'en-US': 'Studies of universal hermetic principles'
    }
  };
  edits['caminhos.igreja.items[2]'] = {
    newText: {
      'pt-BR': 'Comunidade de apoio e crescimento espiritual',
      'en-US': 'Community of support and spiritual growth'
    }
  };

  edits['caminhos.igreja.button'] = {
    newText: {
      'pt-BR': 'Saiba Mais',
      'en-US': 'Learn More'
    }
  };

  // === INSTITUTO ===
  edits['caminhos.instituto.resumo'] = {
    newText: {
      'pt-BR': 'O Instituto Metatron oferece tratamentos terapêuticos holísticos que integram corpo, mente e espírito. Uma abordagem complementar que trabalha as causas profundas do desequilíbrio.',
      'en-US': 'The Metatron Institute offers holistic therapeutic treatments that integrate body, mind, and spirit. A complementary approach that addresses the deep causes of imbalance.'
    }
  };

  edits['caminhos.instituto.items[0]'] = {
    newText: {
      'pt-BR': 'Terapias bioenergéticas e vibracionais',
      'en-US': 'Bioenergetic and vibrational therapies'
    }
  };
  edits['caminhos.instituto.items[1]'] = {
    newText: {
      'pt-BR': 'Tratamentos complementares integrativos',
      'en-US': 'Integrative complementary treatments'
    }
  };
  edits['caminhos.instituto.items[2]'] = {
    newText: {
      'pt-BR': 'Cuidado integral do ser humano',
      'en-US': 'Comprehensive care of the human being'
    }
  };

  edits['caminhos.instituto.button'] = {
    newText: {
      'pt-BR': 'Conheça os Tratamentos',
      'en-US': 'Explore Treatments'
    }
  };

  // === TESTEMUNHOS CTA ===
  edits['testemunhos_cta'] = {
    newText: {
      'pt-BR': 'Veja o que dizem as pessoas que já passaram por essa experiência transformadora.',
      'en-US': 'See what people who have been through this transformative experience have to say.'
    }
  };

  edits['testemunhos_cta.button'] = {
    newText: {
      'pt-BR': 'Ler Testemunhos',
      'en-US': 'Read Testimonials'
    }
  };

  console.log(`Enviando ${Object.keys(edits).length} keys ao banco...`);
  console.log('Keys:', Object.keys(edits).join(', '));

  try {
    const response = await fetch(API_BASE, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ edits })
    });

    const result = await response.json();

    if (result.success) {
      console.log(`\n✅ Sucesso! ${result.updatedCount} campos atualizados.`);
      if (result.updateLog) {
        const created = result.updateLog.filter(l => l.status === 'SUCCESS' && l.action === 'CREATED');
        const updated = result.updateLog.filter(l => l.status === 'SUCCESS' && l.action !== 'CREATED');
        const failed = result.updateLog.filter(l => l.status !== 'SUCCESS');
        console.log(`   Criados: ${created.length}`);
        console.log(`   Atualizados: ${updated.length}`);
        if (failed.length > 0) {
          console.log(`   ❌ Falhas: ${failed.length}`);
          failed.forEach(f => console.log(`      - ${f.key}: ${f.error || f.status}`));
        }
      }
    } else {
      console.error(`\n❌ Erro: ${result.message}`);
    }
  } catch (err) {
    console.error(`\n❌ Erro de conexão: ${err.message}`);
    console.error('Verifique se o servidor está rodando em localhost:3000');
  }
}

uploadCaminhos();
