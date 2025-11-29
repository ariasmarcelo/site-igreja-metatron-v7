const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://nxkrfblquzblyhcrhmys.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im54a3JmYmxxdXpibHloY3JobXlzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE0MzExNDAsImV4cCI6MjA0NzAwNzE0MH0.pGiJV5dCHcLGLqB23A_EevBb_LCT1oBN61KAEu8Xhrc';

const supabase = createClient(supabaseUrl, supabaseKey);

async function insertArtigo() {
  try {
    console.log('Inserindo artigo 1: Os Mistérios da Geometria Sagrada...');
    
    // Inserir artigo
    const { data: artigo, error: artigoError } = await supabase
      .from('artigos')
      .insert({
        title: 'Os Mistérios da Geometria Sagrada',
        slug: 'misterios-geometria-sagrada',
        excerpt: 'Descubra como os padrões geométricos ancestrais carregam as chaves para a compreensão da criação universal e da estrutura energética do cosmos.',
        content: `<h2>A Linguagem Universal da Criação</h2>
<p>A geometria sagrada representa a linguagem universal através da qual o divino se manifesta na realidade física. Desde tempos imemoriais, civilizações antigas reconheceram que determinados padrões geométricos carregam propriedades energéticas e espirituais únicas.</p>

<h3>A Flor da Vida</h3>
<p>Um dos símbolos mais poderosos da geometria sagrada, a Flor da Vida, contém em sua estrutura todos os blocos de construção da criação. Composta por círculos sobrepostos perfeitamente espaçados, este padrão revela:</p>
<ul>
<li>Os cinco sólidos platônicos fundamentais</li>
<li>A proporção áurea que governa o crescimento natural</li>
<li>A estrutura do campo energético humano (Merkabah)</li>
<li>Os padrões de expansão da consciência universal</li>
</ul>

<h3>O Cubo de Metatron</h3>
<p>Derivado da Flor da Vida, o Cubo de Metatron é considerado o projeto divino da criação. Este padrão sagrado contém todas as formas geométricas existentes na natureza e serve como mapa energético para a manifestação da matéria a partir do espírito.</p>

<h2>Aplicações Práticas na Vida Espiritual</h2>
<p>O estudo e meditação com geometria sagrada oferece benefícios profundos:</p>

<h3>1. Harmonização Energética</h3>
<p>Visualizar ou meditar sobre padrões geométricos sagrados alinha os campos energéticos sutis, promovendo equilíbrio e bem-estar integral.</p>

<h3>2. Expansão da Consciência</h3>
<p>Os padrões geométricos atuam como portais para estados elevados de consciência, facilitando experiências de unidade e compreensão cósmica.</p>

<h3>3. Manifestação Consciente</h3>
<p>Compreender a geometria subjacente à criação permite trabalhar conscientemente com as leis universais para manifestar realidades desejadas.</p>

<h2>Práticas Recomendadas</h2>
<p>Para integrar a geometria sagrada em sua jornada espiritual:</p>

<ol>
<li><strong>Meditação Visual:</strong> Contemple símbolos geométricos sagrados durante 10-20 minutos diários</li>
<li><strong>Desenho Consciente:</strong> Pratique traçar padrões geométricos com atenção plena</li>
<li><strong>Visualização Criativa:</strong> Utilize formas geométricas em práticas de manifestação</li>
<li><strong>Estudo Aprofundado:</strong> Pesquise as propriedades matemáticas e energéticas de cada padrão</li>
</ol>

<h2>Conclusão</h2>
<p>A geometria sagrada não é apenas uma curiosidade estética ou matemática – é uma ferramenta espiritual poderosa que conecta o praticante aos princípios fundamentais da criação. Ao estudar e trabalhar com estes padrões ancestrais, abrimos portas para dimensões mais elevadas de compreensão e realização espiritual.</p>`,
        author: 'Equipe Igreja de Metatron',
        tags: ['geometria-sagrada', 'esoterismo', 'simbologia', 'flor-da-vida', 'cubo-metatron', 'espiritualidade'],
        cover_image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=1200&h=600&fit=crop',
        published: true,
        published_at: new Date().toISOString()
      })
      .select()
      .single();

    if (artigoError) {
      console.error('Erro ao inserir artigo:', artigoError);
      return;
    }

    console.log('✅ Artigo inserido com ID:', artigo.id);

    // Buscar categoria Esoterismo
    const { data: categoria } = await supabase
      .from('artigos_categorias')
      .select('id')
      .eq('nome', 'Esoterismo')
      .single();

    if (!categoria) {
      console.error('❌ Categoria Esoterismo não encontrada');
      return;
    }

    // Vincular artigo à categoria
    const { error: relError } = await supabase
      .from('artigos_categorias_rel')
      .insert({
        artigo_id: artigo.id,
        categoria_id: categoria.id
      });

    if (relError) {
      console.error('Erro ao vincular categoria:', relError);
      return;
    }

    console.log('✅ Artigo vinculado à categoria Esoterismo');
    console.log('\n🎉 Artigo 1 criado com sucesso!');
    
  } catch (error) {
    console.error('Erro:', error);
  }
}

insertArtigo();
