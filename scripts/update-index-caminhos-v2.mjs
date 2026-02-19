/**
 * Atualização dos textos da seção "Dois Caminhos" para serem mais fiéis aos originais
 * + 2 novos bullets por card (total 5 cada)
 */

const API_BASE = 'http://localhost:3000/api/content/index';

async function updateCaminhos() {
  const edits = {};

  // === IGREJA - resumo mais fiel ao original ===
  edits['caminhos.igreja.resumo'] = {
    newText: {
      'pt-BR': 'A Igreja de Metatron não é uma igreja convencional. Para nós, Deus é origem de TUDO, Seu Corpo é o próprio Universo e Sua Mente, a Ordem dos fundamentos da matéria e dos campos. Nossa missão é a restauração da sua harmonia interna, para que o seu Eu Superior possa se manifestar diretamente em seu corpo físico.',
      'en-US': 'The Church of Metatron is not a conventional church. For us, God is the origin of ALL; His Body is the very Universe, and His Mind is the Order underlying the foundations of matter and the fields. Our mission is the restoration of your inner harmony, so that your Higher Self can embody your physical form.'
    }
  };

  // Items existentes (0-2) - manter
  // Novos items (3-4)
  edits['caminhos.igreja.items[3]'] = {
    newText: {
      'pt-BR': 'Restauração da Presença Espiritual no corpo físico',
      'en-US': 'Restoration of Spiritual Presence in the physical body'
    }
  };
  edits['caminhos.igreja.items[4]'] = {
    newText: {
      'pt-BR': 'Uma espiritualidade livre de dogmas, baseada na transformação real',
      'en-US': 'A dogma-free spirituality based on real transformation'
    }
  };

  // === INSTITUTO - resumo mais fiel ao original ===
  edits['caminhos.instituto.resumo'] = {
    newText: {
      'pt-BR': 'O Instituto Metatron é o braço técnico-terapêutico da Igreja, oferecendo tratamentos especializados fundados na Neurofisiologia do Trauma e na Teoria Polivagal. Tratamentos realizados por profissionais associados com compreensão realista dos sistemas autônomos e relacionais-emocionais.',
      'en-US': 'The Metatron Institute is the technical-therapeutic arm of the Church, offering specialized treatments grounded in Trauma Neurophysiology and Polyvagal Theory. Treatments are conducted by associated professionals with a realistic understanding of the autonomic and relational-emotional systems.'
    }
  };

  // Items existentes (0-2) - manter
  // Novos items (3-4)
  edits['caminhos.instituto.items[3]'] = {
    newText: {
      'pt-BR': 'Profissionais associados: médicos, psicólogos, fisioterapeutas',
      'en-US': 'Associated professionals: physicians, psychologists, physiotherapists'
    }
  };
  edits['caminhos.instituto.items[4]'] = {
    newText: {
      'pt-BR': 'Fundamentos em Neurofisiologia do Trauma e Teoria Polivagal',
      'en-US': 'Grounded in Trauma Neurophysiology and Polyvagal Theory'
    }
  };

  // === INSTITUTO - botão mais fiel ===
  edits['caminhos.instituto.button'] = {
    newText: {
      'pt-BR': 'Conheça os Tratamentos',
      'en-US': 'Explore Treatments'
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
  }
}

updateCaminhos();
