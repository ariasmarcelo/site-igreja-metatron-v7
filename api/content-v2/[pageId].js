// Vercel Serverless Function - Get Content with Cache-First Strategy
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs').promises;
const path = require('path');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

// Lock para evitar criação simultânea de cache para mesma página
const cacheLocks = new Map();

// Helper: Carregar conteúdo do cache (1 arquivo JSON por página)
async function loadFromCache(pageId) {
  const fallbacksDir = path.join(process.cwd(), '.cache', 'fallbacks');
  const cacheFile = path.join(fallbacksDir, `${pageId}.json`);
  
  try {
    const content = await fs.readFile(cacheFile, 'utf-8');
    const pageContent = JSON.parse(content);
    console.log(`   ✓ Cache: ${pageId}.json`);
    return pageContent;
  } catch (error) {
    if (error.code !== 'ENOENT') {
      console.warn(`   ⚠️  Erro lendo cache: ${error.message}`);
    }
    return null;
  }
}

// Helper: Buscar do DB e criar cache
async function loadFromDBAndCache(pageId) {
  // Buscar do DB
  const { data: entries, error: entriesError } = await supabase
    .from('text_entries')
    .select('json_key, content')
    .in('page_id', [pageId, '__shared__']);

  if (entriesError) throw entriesError;
  if (!entries || entries.length === 0) {
    console.log(`   ⚠️  Nenhum registro no DB para ${pageId}`);
    return null;
  }

  console.log(`   ✓ Encontrados ${entries.length} registros no DB para ${pageId}`);
  
  // Reconstruir objeto
  const pageContent = {};
  
  entries.forEach(entry => {
    const jsonKey = entry.json_key;
    const keys = jsonKey.startsWith(pageId + '.') 
      ? jsonKey.split('.').slice(1)
      : jsonKey.split('.');
    
    if (keys.length === 0) return;
    
    let current = pageContent;
    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      const arrayMatch = key.match(/^(.+)\[(\d+)\]$/);
      
      if (arrayMatch) {
        const arrayName = arrayMatch[1];
        const arrayIndex = parseInt(arrayMatch[2]);
        if (!current[arrayName]) current[arrayName] = [];
        if (!current[arrayName][arrayIndex]) current[arrayName][arrayIndex] = {};
        current = current[arrayName][arrayIndex];
      } else {
        if (!current[key]) current[key] = {};
        current = current[key];
      }
    }
    
    const lastKey = keys[keys.length - 1];
    const arrayMatch = lastKey.match(/^(.+)\[(\d+)\]$/);
    
    if (arrayMatch) {
      const arrayName = arrayMatch[1];
      const arrayIndex = parseInt(arrayMatch[2]);
      if (!current[arrayName]) current[arrayName] = [];
      current[arrayName][arrayIndex] = entry.content['pt-BR'] || entry.content;
    } else {
      current[lastKey] = entry.content['pt-BR'] || entry.content;
    }
  });

  // Criar cache APÓS retornar resposta (não bloquear HTTP response)
  // LOCK: evitar múltiplas escritas simultâneas para mesma página
  if (!cacheLocks.has(pageId)) {
    console.log(`   📝 Cache será criado após resposta HTTP`);
    
    // setImmediate: executa DEPOIS da resposta ser enviada ao cliente
    const lockPromise = new Promise((resolve) => {
      setImmediate(async () => {
        try {
          console.log(`   🔨 Iniciando criação de cache para ${pageId}...`);
          await createCacheFiles(pageId, pageContent);
          console.log(`   ✅ Cache finalizado para ${pageId}`);
          resolve();
        } catch (err) {
          console.error(`   ❌ Erro ao criar cache: ${err.message}`);
          resolve(); // Resolve mesmo com erro para limpar lock
        } finally {
          cacheLocks.delete(pageId);
        }
      });
    });
    
    cacheLocks.set(pageId, lockPromise);
  }

  return pageContent;
}

// Helper: Criar arquivo de cache (1 arquivo JSON por página)
async function createCacheFiles(pageId, content) {
  const fallbacksDir = path.join(process.cwd(), '.cache', 'fallbacks');
  await fs.mkdir(fallbacksDir, { recursive: true });
  
  const cacheFile = path.join(fallbacksDir, `${pageId}.json`);
  
  try {
    await fs.writeFile(cacheFile, JSON.stringify(content, null, 2), 'utf-8');
    console.log(`   ✅ Cache salvo: ${pageId}.json`);
  } catch (err) {
    console.error(`   ❌ Erro: ${err.message}`);
    throw err;
  }
}

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

    console.log(`📦 Buscando conteúdo para página: ${pageId}`);

    try {
      // ESTRATÉGIA CACHE-FIRST:
      // 1. Tentar carregar do cache local (fallback JSONs)
      console.log(`🔍 [1/2] Verificando cache local...`);
      let pageContent = await loadFromCache(pageId);
      
      if (pageContent) {
        console.log(`✅ [CACHE HIT] Retornando conteúdo do cache local`);
        return res.status(200).json({ 
          success: true, 
          content: pageContent,
          source: 'cache (local fallback JSONs)'
        });
      }

      // 2. Cache miss → Buscar do DB e criar cache
      console.log(`⚠️  [CACHE MISS] Buscando do DB...`);
      pageContent = await loadFromDBAndCache(pageId);

      if (!pageContent) {
        return res.status(404).json({ 
          success: false, 
          message: `Nenhum conteúdo encontrado para: ${pageId}` 
        });
      }

      console.log(`✅ [DB HIT] Retornando conteúdo do DB (cache sendo criado em background)`);
      return res.status(200).json({ 
        success: true, 
        content: pageContent,
        source: 'database (cache created)'
      });

    } catch (dbError) {
      console.error(`❌ Erro ao buscar conteúdo:`, dbError.message);
      
      return res.status(500).json({ 
        success: false, 
        message: 'Erro ao buscar conteúdo',
        error: dbError.message
      });
    }
  } catch (error) {
    console.error(`❌ Erro geral:`, error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};
