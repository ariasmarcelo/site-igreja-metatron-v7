const { createClient } = require('@supabase/supabase-js');
const { open } = require('lmdb');
const path = require('path');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

function log(msg) {
  console.log(`[${new Date().toISOString()}] ${msg}`);
}

function getDB() {
  if (!global.__lmdbInstance) {
    const dbPath = path.join(process.cwd(), '.cache', 'content-lmdb');
    global.__lmdbInstance = open({ 
      path: dbPath, 
      compression: true,
      noSubdir: false,
      maxReaders: 126
    });
    log(`[LMDB] Pool global inicializado: ${dbPath}`);
  }
  return global.__lmdbInstance;
}

function loadFromCache(pageId) {
  try {
    const db = getDB();
    const cached = db.get(pageId);
    
    if (cached) {
      log(`[CACHE] Entrada encontrada: pageId=${pageId}`);
      
      if (cached.invalidatedAt === null || cached.invalidatedAt === undefined) {
        log(`[CACHE] HIT: pageId=${pageId}, invalidatedAt=null (valido)`);
        return cached.data;
      } else {
        log(`[CACHE] INVALIDADO: pageId=${pageId}, invalidatedAt=${cached.invalidatedAt}`);
        return null;
      }
    }
    
    log(`[CACHE] MISS: pageId=${pageId} (nao existe)`);
    return null;
  } catch (err) {
    log(`[CACHE] ERRO ao acessar: ${err.message}`);
    return null;
  }
}

function createCacheInLMDB(pageId, content) {
  try {
    const db = getDB();
    const cacheEntry = {
      data: content,
      invalidatedAt: null
    };
    
    log(`[CACHE] Salvando: pageId=${pageId}, size=${JSON.stringify(content).length}b, invalidatedAt=null`);
    db.put(pageId, cacheEntry);
    
    db.flushed.then(() => {
      log(`[CACHE] Flush concluido: pageId=${pageId}`);
    }).catch(err => {
      log(`[CACHE] Erro no flush: ${err.message}`);
    });
  } catch (err) {
    log(`[CACHE] ERRO ao salvar: ${err.message}`);
  }
}

function invalidateCache(pageId) {
  try {
    const db = getDB();
    log(`[CACHE] Invalidando: pageId=${pageId}`);
    db.remove(pageId);
    log(`[CACHE] Invalidado com sucesso: pageId=${pageId}`);
  } catch (err) {
    log(`[CACHE] ERRO ao invalidar: ${err.message}`);
  }
}

// Helper: Reconstruir objeto a partir das entradas do DB
function reconstructObjectFromEntries(entries, pageId) {
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
  return pageContent;
}

const cacheLocks = new Map();
async function loadFromDBAndCache(pageId) {
  log(`[DB] Buscando dados: pageId=${pageId}`);
  
  const { data: entries, error: entriesError } = await supabase
    .from('text_entries')
    .select('json_key, content')
    .in('page_id', [pageId, '__shared__']);

  if (entriesError) {
    log(`[DB] ERRO: ${entriesError.message}`);
    throw entriesError;
  }
  
  if (!entries || entries.length === 0) {
    log(`[DB] Nenhum registro encontrado: pageId=${pageId}`);
    return null;
  }

  log(`[DB] Encontrados ${entries.length} registros: pageId=${pageId}`);
  const pageContent = reconstructObjectFromEntries(entries, pageId);

  if (!cacheLocks.has(pageId)) {
    createCacheInLMDB(pageId, pageContent);
    cacheLocks.set(pageId, true);
  }
  
  return pageContent;
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

  const requestStart = Date.now();
  
  try {
    // GET /api/content-v2/:pageId - single page
    const pageId = req.query.pageId || req.url?.split('/').pop();
    if (!pageId) {
      log(`[REQUEST] ERRO: pageId ausente`);
      return res.status(400).json({ success: false, message: 'pageId é obrigatório' });
    }

    log(`[REQUEST] GET pageId=${pageId}`);

    let pageContent = loadFromCache(pageId);
    if (pageContent) {
      const duration = Date.now() - requestStart;
      log(`[RESPONSE] 200 OK: pageId=${pageId}, source=cache, duration=${duration}ms`);
      return res.status(200).json({ 
        success: true, 
        content: pageContent,
        source: 'lmdb-cache'
      });
    }

    pageContent = await loadFromDBAndCache(pageId);
    if (!pageContent) {
      const duration = Date.now() - requestStart;
      log(`[RESPONSE] 404 NOT FOUND: pageId=${pageId}, duration=${duration}ms`);
      return res.status(404).json({ 
        success: false, 
        message: `Nenhum conteúdo encontrado para: ${pageId}` 
      });
    }
    
    const duration = Date.now() - requestStart;
    log(`[RESPONSE] 200 OK: pageId=${pageId}, source=db, duration=${duration}ms`);
    res.status(200).json({ 
      success: true, 
      content: pageContent,
      source: 'supabase-db'
    });
  } catch (err) {
    const duration = Date.now() - requestStart;
    log(`[RESPONSE] 500 ERROR: ${err.message}, duration=${duration}ms`);
    res.status(500).json({ success: false, message: err.message });
  }
};
