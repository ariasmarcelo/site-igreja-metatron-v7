// Vercel Serverless Function - Get Content with Shared Content (NULL page_id)
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    // Em Vercel, rotas dinâmicas [pageId] vêm em req.query.pageId
    const pageId = req.query.pageId || req.url?.split('/').pop();
    
    if (!pageId) {
      return res.status(400).json({ success: false, message: 'pageId é obrigatório' });
    }

    console.log(`📦 Buscando conteúdo para página: ${pageId} (+ compartilhado)`);

    try {
      // Buscar conteúdo da página específica + conteúdo compartilhado (NULL)
      // Query: WHERE page_id = 'purificacao' OR page_id IS NULL
      const { data, error } = await supabase
        .from('page_contents')
        .select('page_id, content')
        .or(`page_id.eq.${pageId},page_id.is.null`);

      if (error) throw error;

      if (!data || data.length === 0) {
        return res.status(404).json({ 
          success: false, 
          message: `Nenhum conteúdo encontrado para: ${pageId}` 
        });
      }

      console.log(`✅ DB: Encontrados ${data.length} registros (página + compartilhado)`);

      // Separar conteúdo compartilhado (NULL) e específico da página
      const sharedRecord = data.find(row => row.page_id === null);
      const pageRecord = data.find(row => row.page_id === pageId);

      // Merge: conteúdo compartilhado (base) + conteúdo da página (sobrescreve)
      const mergedContent = {
        ...(sharedRecord?.content || {}),
        ...(pageRecord?.content || {})
      };

      console.log(`🔀 Merge concluído:`);
      console.log(`   • Compartilhado: ${Object.keys(sharedRecord?.content || {}).join(', ')}`);
      console.log(`   • Página: ${Object.keys(pageRecord?.content || {}).join(', ')}`);
      console.log(`   • Final: ${Object.keys(mergedContent).join(', ')}`);

      return res.status(200).json({ 
        success: true, 
        content: mergedContent,
        source: 'database',
        hasShared: !!sharedRecord,
        hasPageSpecific: !!pageRecord
      });

    } catch (dbError) {
      console.error(`❌ Erro ao buscar do DB:`, dbError.message);
      
      return res.status(500).json({ 
        success: false, 
        message: 'Erro ao buscar conteúdo do banco de dados',
        error: dbError.message
      });
    }
  } catch (error) {
    console.error(`❌ Erro geral:`, error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};
