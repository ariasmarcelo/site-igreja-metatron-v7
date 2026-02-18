/**
 * Upload dos 13 Princípios Unificados para o Supabase
 * Keys: quemsomos.principios_unificados.title + quemsomos.principios_unificados.items[0-12]
 * Formato: { title, content } em pt-BR e en-US
 */

const API_BASE = 'http://localhost:3000/api/content/quemsomos';

const SECTION_TITLE = {
  'pt-BR': 'Nossos Princípios',
  'en-US': 'Our Principles'
};

const PRINCIPLES = [
  {
    title: {
      'en-US': 'Wholeness of Being',
      'pt-BR': 'Integralidade do Ser'
    },
    content: {
      'en-US': 'We recognize human beings as an integration of body, emotions, mind, and Spirit, deserving care in all dimensions.',
      'pt-BR': 'Reconhecemos o ser humano como integração de corpo, emoções, mente e Espírito, merecedor de cuidado em todas as dimensões.'
    }
  },
  {
    title: {
      'en-US': 'Universalism',
      'pt-BR': 'Universalismo'
    },
    content: {
      'en-US': 'A practice free from dogma, honoring each individual\'s unique spiritual journey.',
      'pt-BR': 'Uma prática livre de dogmas, que honra a jornada espiritual única de cada indivíduo.'
    }
  },
  {
    title: {
      'en-US': 'Subjective Freedom',
      'pt-BR': 'Liberdade Subjetiva'
    },
    content: {
      'en-US': 'We honor individual freedom and the sacred right to different understandings, autonomous choices, and personal paths.',
      'pt-BR': 'Honramos a liberdade individual e o direito sagrado a diferentes compreensões, escolhas autônomas e caminhos pessoais.'
    }
  },
  {
    title: {
      'en-US': 'Compassion and Inclusion',
      'pt-BR': 'Compaixão e Inclusão'
    },
    content: {
      'en-US': 'We cultivate compassion for all beings, recognizing our fundamental interconnection, and welcome everyone without discrimination.',
      'pt-BR': 'Cultivamos compaixão por todos os seres, reconhecendo nossa interconexão fundamental, e acolhemos a todos sem discriminação.'
    }
  },
  {
    title: {
      'en-US': 'Genders',
      'pt-BR': 'Gêneros'
    },
    content: {
      'en-US': 'We recognize two natural genders, male and female, as complex binary expressions of the Hermetic Principles of Polarity and Gender in human beings.',
      'pt-BR': 'Reconhecemos dois gêneros naturais, masculino e feminino, como expressões binárias complexas dos Princípios Herméticos de Polaridade e Gênero nos seres humanos.'
    }
  },
  {
    title: {
      'en-US': 'Sacred Reverence',
      'pt-BR': 'Reverência Sagrada'
    },
    content: {
      'en-US': 'We honor the material and spiritual dimensions of life with deep respect and reverence before the mysteries of existence.',
      'pt-BR': 'Honramos as dimensões material e espiritual da vida com profundo respeito e reverência diante dos mistérios da existência.'
    }
  },
  {
    title: {
      'en-US': 'Humility',
      'pt-BR': 'Humildade'
    },
    content: {
      'en-US': 'Before the mysteries of existence, we remain humble, recognizing the infinite in what we do not know.',
      'pt-BR': 'Diante dos mistérios da existência, permanecemos humildes, reconhecendo o infinito naquilo que não sabemos.'
    }
  },
  {
    title: {
      'en-US': 'Direct Knowledge and Scientific Approach',
      'pt-BR': 'Conhecimento Direto e Abordagem Científica'
    },
    content: {
      'en-US': 'We seek authentic understanding through direct knowledge and experience, grounded in rigorous research, including contemporary findings in trauma neurobiology and neurophysiology.',
      'pt-BR': 'Buscamos compreensão autêntica através do conhecimento direto e da experiência, fundamentados em pesquisa rigorosa, incluindo descobertas contemporâneas em neurobiologia do trauma e neurofisiologia.'
    }
  },
  {
    title: {
      'en-US': 'Transparency and Consent',
      'pt-BR': 'Transparência e Consentimento'
    },
    content: {
      'en-US': 'We ensure transparency in all actions and processes and obtain informed consent prior to any intervention.',
      'pt-BR': 'Garantimos transparência em todas as ações e processos e obtemos consentimento informado antes de qualquer intervenção.'
    }
  },
  {
    title: {
      'en-US': 'Ethics and Responsibility',
      'pt-BR': 'Ética e Responsabilidade'
    },
    content: {
      'en-US': 'We ensure qualified professionals and lawful contexts for interventions, taking responsibility for clear ethical standards and for the impact of our actions on individual lives and on humanity.',
      'pt-BR': 'Asseguramos profissionais qualificados e contextos legais para intervenções, assumindo responsabilidade por padrões éticos claros e pelo impacto de nossas ações nas vidas individuais e na humanidade.'
    }
  },
  {
    title: {
      'en-US': 'Coherence',
      'pt-BR': 'Coerência'
    },
    content: {
      'en-US': 'We uphold alignment between thoughts, words, and actions, with integrity and transparency.',
      'pt-BR': 'Sustentamos o alinhamento entre pensamentos, palavras e ações, com integridade e transparência.'
    }
  },
  {
    title: {
      'en-US': 'Balance',
      'pt-BR': 'Equilíbrio'
    },
    content: {
      'en-US': 'We honor the dynamic balance of cycles and polarities over time, integrating them into healing and growth processes.',
      'pt-BR': 'Honramos o equilíbrio dinâmico dos ciclos e polaridades ao longo do tempo, integrando-os nos processos de cura e crescimento.'
    }
  },
  {
    title: {
      'en-US': 'Collective Service',
      'pt-BR': 'Serviço Coletivo'
    },
    content: {
      'en-US': 'We place energy, talents, and knowledge in service of individual and collective liberation for the greater good.',
      'pt-BR': 'Colocamos energia, talentos e conhecimento a serviço da libertação individual e coletiva para o bem maior.'
    }
  }
];

async function uploadPrinciples() {
  console.log('=== Upload dos 13 Princípios Unificados ===\n');

  // Build edits object
  const edits = {};

  // Section title
  edits['principios_unificados.title'] = {
    newText: SECTION_TITLE
  };

  // Each principle: title + content
  for (let i = 0; i < PRINCIPLES.length; i++) {
    const p = PRINCIPLES[i];
    edits[`principios_unificados.items[${i}].title`] = {
      newText: p.title
    };
    edits[`principios_unificados.items[${i}].content`] = {
      newText: p.content
    };
  }

  console.log(`Enviando ${Object.keys(edits).length} keys ao banco...`);

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

uploadPrinciples();
