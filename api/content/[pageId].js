const { createClient } = require('@supabase/supabase-js');
const crypto = require('crypto');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

console.log('[INIT] VITE_SUPABASE_URL:', supabaseUrl ? supabaseUrl.substring(0, 20) + '...' : 'UNDEFINED');
console.log('[INIT] SUPABASE_SERVICE_KEY:', process.env.SUPABASE_SERVICE_KEY ? 'SET' : 'NOT SET');
console.log('[INIT] VITE_SUPABASE_ANON_KEY:', process.env.VITE_SUPABASE_ANON_KEY ? 'SET' : 'NOT SET');

const supabase = createClient(supabaseUrl, supabaseKey);

// ============ VALIDAÇÃO E SEGURANÇA ============
const VALID_LANGUAGES = ['pt-BR', 'en-US'];

/**
 * ATENÇÃO: Esta lista DEVE ser idêntica a ALL_VALID_PAGE_IDS em src/config/navigation.ts
 * A fonte de verdade é navigation.ts. Este arquivo é CJS serverless e não pode importar .ts.
 * Se adicionar/remover páginas, ATUALIZAR NOS DOIS LUGARES.
 */
const VALID_PAGE_IDS = [
  'index', 'quemsomos', 'tratamentos', 'artigos', 
  'contato', 'purificacao', 'notfound', 'testemunhos', '__shared__', '__navigation__'
];
const MAX_TEXT_LENGTH = 5000;
const MAX_JSON_KEY_LENGTH = 255;
const MAX_REQUEST_BODY_SIZE = 1024 * 100; // 100KB
const REQUEST_TIMEOUT_MS = 30000; // 30 segundos

// Validar parâmetros entrada
function validateInput(pageId, language, text) {
  const errors = [];
  
  if (!pageId || typeof pageId !== 'string') {
    errors.push('pageId é obrigatório e deve ser string');
  } else if (!VALID_PAGE_IDS.includes(pageId)) {
    errors.push(`pageId inválido. Válidos: ${VALID_PAGE_IDS.join(', ')}`);
  } else if (pageId.length > MAX_JSON_KEY_LENGTH) {
    errors.push(`pageId muito longo (máx ${MAX_JSON_KEY_LENGTH} chars)`);
  }
  
  // language pode ser null (modo multilíngue para editor) ou uma string válida
  if (language !== null && (typeof language !== 'string' || !VALID_LANGUAGES.includes(language))) {
    errors.push(`language deve ser null (multilíngue) ou um dos válidos: ${VALID_LANGUAGES.join(', ')}`);
  }
  
  if (text !== undefined && text !== null) {
    if (typeof text !== 'string') {
      errors.push('text deve ser string');
    } else if (text.length > MAX_TEXT_LENGTH) {
      errors.push(`text muito longo (máx ${MAX_TEXT_LENGTH} chars, atual: ${text.length})`);
    }
    // Verificar para SQL injection basicamente
    if (/[;\-\-]/g.test(text)) {
      // Nota: ORM protege contra SQL injection, mas alertar
      console.warn('[SECURITY] Caracteres suspeitos detectados em text:', text.substring(0, 50));
    }
  }
  
  return errors;
}

// Hash para verificar integridade
function hashContent(content) {
  return crypto.createHash('sha256').update(JSON.stringify(content)).digest('hex');
}

// Sanitizar erro para não expor detalhes internos
function sanitizeError(error) {
  const message = error?.message || 'Erro desconhecido';
  if (message.includes('database') || message.includes('supabase')) {
    return 'Erro ao acessar banco de dados';
  }
  if (message.includes('network')) {
    return 'Erro de conexão';
  }
  if (message.includes('timeout')) {
    return 'Operação expirou';
  }
  return message;
}

// ============ LOGGING ESTRUTURADO ============
function log(msg, level = 'INFO', meta = {}) {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    level,
    service: 'CONTENT-API',
    message: msg,
    ...meta
  };
  console.log(JSON.stringify(logEntry, null, 0));
}

// Função para validar integridade multilíngue
function validateMultilingualIntegrity(content, jsonKey) {
  const issues = [];
  const availableLanguages = [];
  
  // Verificar cada idioma válido
  VALID_LANGUAGES.forEach(lang => {
    if (lang in content) {
      const value = content[lang];
      if (value === undefined || value === null) {
        issues.push(`${lang} é null/undefined`);
      } else if (typeof value !== 'string') {
        issues.push(`${lang} não é string (tipo: ${typeof value})`);
      } else if (value.trim() === '') {
        issues.push(`${lang} está vazio`);
      } else {
        availableLanguages.push(lang);
      }
    } else {
      issues.push(`${lang} FALTANDO`);
    }
  });
  
  // Verificar se os dois idiomas são idênticos (possível contaminação)
  if (availableLanguages.length === 2 && content['pt-BR'] === content['en-US']) {
    issues.push('⚠️ SUSPEITA: pt-BR e en-US são idênticos (possível contaminação)');
  }
  
  return {
    isValid: issues.length === 0 && availableLanguages.length === VALID_LANGUAGES.length,
    availableLanguages,
    issues,
    completeness: `${availableLanguages.length}/${VALID_LANGUAGES.length}`
  };
}

// Reconstruir objeto a partir das entradas do DB
function reconstructObjectFromEntries(entries, pageId, language = null) {
  const pageContent = {};
  const languageMetadata = {}; // Rastrear qual idioma foi usado para cada chave
  const isMultilingual = !language; // Se não especificar language, retornar estrutura multilíngue
  
  log(`🔧 Reconstruindo ${entries.length} entradas para pageId="${pageId}" language="${language || 'TODAS'}" mode="${isMultilingual ? 'MULTILINGUAL' : 'SINGLE'}'`);
  
  // Primeiro, filtrar para priorizar chaves sem prefixo duplicado
  // Se existir 'valores.cards[7].content' E 'quemsomos.valores.cards[7].content',
  // usar apenas a primeira (sem duplicação)
  const cleanedEntries = new Map();
  
  for (const entry of entries) {
    // Rastreamento completo de cada página/idioma construída
    log(`🔨 PROCESSANDO ENTRADA: page_id=${entry.page_id}, json_key=${entry.json_key}, mode="${isMultilingual ? 'MULTILINGUAL' : 'SINGLE'}'`, 'DEBUG', {
      pageId,
      json_key: entry.json_key,
      content_keys: Object.keys(entry.content || {})
    });
    
    // Validar integridade do conteúdo existente
    if (typeof entry.content !== 'object' || Array.isArray(entry.content)) {
      const msg = `⚠️ Conteúdo inválido para ${entry.json_key}`;
      log(msg, 'WARN', { pageId, jsonKey: entry.json_key, tipo: typeof entry.content });
      continue;
    }
    
    log(`  Conteúdo disponível: ${Object.keys(entry.content).join(', ')}`, 'DEBUG');
    log(`  pt-BR: ${entry.content['pt-BR'] ? `"${String(entry.content['pt-BR']).substring(0, 60)}..."` : 'NÃO EXISTE'}`, 'DEBUG');
    log(`  en-US: ${entry.content['en-US'] ? `"${String(entry.content['en-US']).substring(0, 60)}..."` : 'NÃO EXISTE'}`, 'DEBUG');
    
    let cleanKey = entry.json_key;
    const hasDuplicatePrefix = cleanKey.startsWith(entry.page_id + '.');
    
    if (hasDuplicatePrefix) {
      cleanKey = cleanKey.substring(entry.page_id.length + 1);
    }
    
    const fullKey = `${entry.page_id}.${cleanKey}`;
    
    // Se já existe uma entrada para essa chave, priorizar a SEM prefixo duplicado
    if (cleanedEntries.has(fullKey)) {
      const existing = cleanedEntries.get(fullKey);
      // Se a entrada atual NÃO tem prefixo duplicado, ela substitui a anterior
      if (!hasDuplicatePrefix) {
        log(`✨ Priorizando chave sem prefixo: "${entry.json_key}" sobre "${existing.original_key}"`);
        cleanedEntries.set(fullKey, {
          ...entry,
          cleanKey,
          fullKey,
          original_key: entry.json_key,
          hasDuplicatePrefix
        });
      }
    } else {
      cleanedEntries.set(fullKey, {
        ...entry,
        cleanKey,
        fullKey,
        original_key: entry.json_key,
        hasDuplicatePrefix
      });
    }
  }
  
  log(`📊 Processadas ${entries.length} entradas → ${cleanedEntries.size} únicas`);
  
  // Agora reconstruir o objeto com as entradas priorizadas
  cleanedEntries.forEach((entry) => {
    
    // Remover prefixo do pageId para construir objeto nested
    // "index.hero.title" -> ["hero", "title"]
    // "__shared__.footer.copyright" -> ["footer", "copyright"]
    // "tratamentos.header.title" -> ["header", "title"]
    let keys;
    
    if (entry.page_id === pageId) {
      // Para a página solicitada, remover o prefixo do pageId
      keys = entry.cleanKey.split('.');
    } else if (entry.page_id === '__shared__') {
      // Para __shared__, manter o prefixo __shared__ na estrutura
      keys = ['__shared__', ...entry.cleanKey.split('.')];
    } else {
      // Para outras páginas, manter a estrutura completa
      keys = entry.fullKey.split('.');
    }
    
    if (keys.length === 0) return;
    
    let current = pageContent;
    
    // Navega pela estrutura criando objetos/arrays conforme necessário
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
    
    // Define o valor final
    const lastKey = keys[keys.length - 1];
    const arrayMatch = lastKey.match(/^(.+)\[(\d+)\]$/);
    
    // Rastrear qual idioma foi usado
    const integrity = validateMultilingualIntegrity(entry.content, entry.json_key);
    
    if (isMultilingual) {
      // Modo multilíngue: retornar TODAS as languages, mesmo que vazias
      // Garantir que entry.content é um objeto com as languages
      const multilingualValue = {};
      
      if (typeof entry.content === 'object' && entry.content !== null && !Array.isArray(entry.content)) {
        // entry.content é um objeto, pode ter as languages
        VALID_LANGUAGES.forEach(lang => {
          multilingualValue[lang] = entry.content[lang] || '';
        });
      } else if (typeof entry.content === 'string') {
        // entry.content é uma string direta, usar para PT-BR como fallback
        // (não colocar em en-US porque não sabemos qual idioma é)
        multilingualValue['pt-BR'] = entry.content;
        multilingualValue['en-US'] = '';
      } else {
        // Tipo desconhecido, deixar ambas vazias
        VALID_LANGUAGES.forEach(lang => {
          multilingualValue[lang] = '';
        });
      }
      
      if (arrayMatch) {
        const arrayName = arrayMatch[1];
        const arrayIndex = parseInt(arrayMatch[2]);
        if (!current[arrayName]) current[arrayName] = [];
        current[arrayName][arrayIndex] = multilingualValue;
      } else {
        current[lastKey] = multilingualValue;
      }
      
      log(`  ✓ MULTILINGUAL VALUE para "${lastKey}": ${JSON.stringify(multilingualValue).substring(0, 80)}...`, 'DEBUG');
    } else {
      // Modo single-language: retornar apenas a language solicitada
      const usedLanguage = language && integrity.availableLanguages.includes(language) 
        ? language 
        : undefined;
      
      // Se idioma está disponível, retornar o conteúdo
      // Se estiver vazio, retornar placeholder para manter visibilidade no UI
      let contentValue;
      if (integrity.availableLanguages.includes(language)) {
        contentValue = entry.content[language];
      } else {
        // Campo vazio - gerar placeholder visual baseado no idioma solicitado
        contentValue = language === 'pt-BR' ? '<Vazio>' : '<Empty>';
      }
      
      if (arrayMatch) {
        const arrayName = arrayMatch[1];
        const arrayIndex = parseInt(arrayMatch[2]);
        if (!current[arrayName]) current[arrayName] = [];
        current[arrayName][arrayIndex] = contentValue;
      } else {
        current[lastKey] = contentValue;
      }
      
      log(`  ✓ Selecionado para language="${language}": "${String(contentValue).substring(0, 60)}..."`, 'DEBUG');
    }
    
    // Salvar metadados de integridade
    languageMetadata[entry.json_key] = {
      availableLanguages: integrity.availableLanguages,
      requestedLanguage: language,
      issues: integrity.issues,
      isMultilingual: isMultilingual
    };
  });
  
  log(`✅ Objeto reconstruído com chaves: ${Object.keys(pageContent).join(', ')}`);
  
  // Retornar com metadados de integridade
  return {
    content: pageContent,
    languageMetadata,
    isMultilingual
  };
}

// GET - Buscar conteúdo de uma página
function handleGet(pageId, language = 'en-US') {
  const startTime = Date.now();
  
  // Validar entrada
  const validationErrors = validateInput(pageId, language);
  if (validationErrors.length > 0) {
    const msg = `GET validation failed: ${validationErrors.join('; ')}`;
    log(msg, 'WARN', { pageId, language });
    throw new Error(msg);
  }
  
  log(`GET pageId=${pageId} language=${language}`, 'INFO', { method: 'GET' });
  
  // Busca APENAS as entradas da página solicitada
  // Páginas que precisam de __shared__ devem solicitá-lo explicitamente
  return supabase
    .from('text_entries')
    .select('page_id, json_key, content')
    .eq('page_id', pageId)
    .then(({ data: entries, error }) => {
      const duration = Date.now() - startTime;
      
      if (error) {
        log(`ERROR: ${error.message}`, 'ERROR', { pageId, language, duration, errorCode: error.code });
        throw new Error(sanitizeError(error));
      }
      
      if (!entries || entries.length === 0) {
        log(`NOT FOUND: pageId=${pageId}`, 'WARN', { pageId, language, duration });
        return {
          content: {},
          languageMetadata: {}
        };
      }

      // Reconstruct object from entries
      const { content, languageMetadata } = reconstructObjectFromEntries(
        entries,
        pageId,
        language
      );

      log(`SUCCESS: Retornando ${Object.keys(content).length} chaves`, 'INFO', {
        pageId,
        language,
        duration,
        contentKeys: Object.keys(content).length,
        metadataKeys: Object.keys(languageMetadata).length
      });

      return {
        content,
        languageMetadata
      };
    })
    .catch((error) => {
      log('GET ERROR', 'ERROR', { pageId, language, error: error.message });
      throw error;
    });
}

// PUT - Atualizar conteúdo de uma página com safeguards
function handlePut(pageId, edits, language = 'en-US') {
  const startTime = Date.now();
  const updateLog = [];
  
  // Validação: entrada
  const validationErrors = validateInput(pageId, language);
  if (validationErrors.length > 0) {
    const msg = `PUT validation failed: ${validationErrors.join('; ')}`;
    log(msg, 'WARN', { pageId, language, editsCount: Object.keys(edits || {}).length });
    throw new Error(msg);
  }
  
  if (!edits || typeof edits !== 'object' || Object.keys(edits).length === 0) {
    throw new Error('edits object é obrigatório e deve conter ao menos uma chave');
  }
  
  log(`PUT START`, 'INFO', { pageId, language, editsCount: Object.keys(edits).length });
  
  // Validação: estrutura e tamanho dos edits
  // REQUISITO: SEMPRE esperamos newText como objeto multilíngue { pt-BR: "...", en-US: "..." }
  const updates = [];
  for (const [jsonKey, edit] of Object.entries(edits)) {
    if (edit.newText === undefined) continue;
    
    // VALIDAÇÃO ESTRUTURAL: newText DEVE ser objeto com keys de língua
    if (typeof edit.newText !== 'object' || edit.newText === null || Array.isArray(edit.newText)) {
      const msg = `Edit validation failed for key "${jsonKey}": newText DEVE ser objeto multilíngue { pt-BR: "...", en-US: "..." }, recebido: ${typeof edit.newText}`;
      log(msg, 'WARN', { pageId, jsonKey, receivedType: typeof edit.newText });
      throw new Error(msg);
    }
    
    // Validar cada idioma esperado
    let textErrors = [];
    const foundLanguages = [];
    
    for (const [lang, content] of Object.entries(edit.newText)) {
      // Apenas validar idiomas reconhecidos
      if (!VALID_LANGUAGES.includes(lang)) {
        textErrors.push(`Idioma inválido na chave "${jsonKey}": ${lang}. Válidos: ${VALID_LANGUAGES.join(', ')}`);
        continue;
      }
      
      foundLanguages.push(lang);
      
      // Validar conteúdo de cada idioma (pode ser string ou vazio)
      if (typeof content !== 'string') {
        textErrors.push(`Idioma ${lang} na chave "${jsonKey}" deve ser string, recebido: ${typeof content}`);
      } else if (content.length > 0) {
        // Apenas validar se não vazio
        const langErrors = validateInput(pageId, lang, content);
        textErrors = textErrors.concat(langErrors);
      }
    }
    
    // Aceitar estrutura PARCIAL - idiomas não enviados serão preservados do DB
    const sentLanguages = foundLanguages;
    const notSentLanguages = VALID_LANGUAGES.filter(l => !sentLanguages.includes(l));
    if (notSentLanguages.length > 0) {
      log(`ℹ️ Idioma(s) não enviado(s): ${notSentLanguages.join(', ')} → será(ão) preservado(s) do DB`, 'INFO', {
        pageId,
        jsonKey,
        notSent: notSentLanguages
      });
    }
    
    // Reportar erros de validação
    if (textErrors.length > 0) {
      const msg = `Edit validation failed for key "${jsonKey}": ${textErrors.join('; ')}`;
      log(msg, 'WARN', { pageId, jsonKey, errors: textErrors });
      throw new Error(msg);
    }
    
    // Detectar se é conteúdo compartilhado
    const isSharedKey = jsonKey.startsWith('__shared__.');
    let targetPageId = isSharedKey ? '__shared__' : pageId;
    let finalJsonKey = isSharedKey ? jsonKey.replace('__shared__.', '') : jsonKey;
    const hasPagePrefix = jsonKey.startsWith(`${pageId}.`);
    if (!isSharedKey && hasPagePrefix) {
      finalJsonKey = jsonKey.substring(pageId.length + 1);
    }
    
    // Validar tamanho da chave
    if (finalJsonKey.length > MAX_JSON_KEY_LENGTH) {
      throw new Error(`json_key muito longo para "${jsonKey}"`);
    }
    
    updates.push({
      page_id: targetPageId,
      json_key: finalJsonKey,
      newText: edit.newText,
      language: edit.language || language,
      oldHash: null,
      newHash: null
    });
  }
  
  log(`VALIDATED: ${updates.length} updates para processar`, 'INFO', { pageId, updateCount: updates.length });
  
  // Aplicar updates sequencialmente com safeguards
  function processUpdate(index) {
    if (index >= updates.length) {
      const duration = Date.now() - startTime;
      log(`PUT COMPLETE`, 'INFO', {
        pageId,
        language,
        updatedCount: updates.length,
        duration
      });
      return Promise.resolve({ updatedCount: updates.length, updateLog });
    }
    
    const update = updates[index];
    
    log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`, 'INFO');
    log(`⚙️  PROCESSANDO UPDATE ${index + 1}/${updates.length}`, 'INFO');
    log(`  Chave: ${update.json_key}`, 'INFO');
    log(`  Idioma: ${update.language}`, 'INFO');
    
    // Log appropriate text based on whether it's multilingual or single language
    const isMultilingual = typeof update.newText === 'object' && update.newText !== null;
    if (isMultilingual) {
      log(`  Novo texto (MULTILÍNGUE): pt-BR=${ update.newText['pt-BR'] ? `"${String(update.newText['pt-BR']).substring(0, 40)}..."` : 'vazio' }, en-US=${ update.newText['en-US'] ? `"${String(update.newText['en-US']).substring(0, 40)}..."` : 'vazio' }`, 'DEBUG');
    } else {
      log(`  Novo texto: "${String(update.newText).substring(0, 80)}..."`, 'DEBUG');
    }
    log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`, 'INFO');
    
    // STEP 1: Buscar conteúdo existente
    return supabase
      .from('text_entries')
      .select('content, id')
      .eq('page_id', update.page_id)
      .eq('json_key', update.json_key)
      .single()
      .then(({ data: existing, error: fetchError }) => {
        // Se não existe registro, criar novo com ambos idiomas
        let mergedContent = {};
        let previousHash = null;
        let isNewRecord = false;
        
        if (!fetchError && existing && existing.content) {
          // Verificar integridade do conteúdo existente
          if (typeof existing.content !== 'object' || Array.isArray(existing.content)) {
            const msg = `Conteúdo corrompido para ${update.json_key}`;
            log(msg, 'ERROR', { pageId, jsonKey: update.json_key });
            throw new Error(msg);
          }
          mergedContent = { ...existing.content };
          previousHash = hashContent(mergedContent);
          
          log(`  ✓ Registro EXISTE`, 'DEBUG');
          log(`    pt-BR existente: ${mergedContent['pt-BR'] ? `"${String(mergedContent['pt-BR']).substring(0, 50)}..."` : 'VAZIO'}`, 'DEBUG');
          log(`    en-US existente: ${mergedContent['en-US'] ? `"${String(mergedContent['en-US']).substring(0, 50)}..."` : 'VAZIO'}`, 'DEBUG');
        } else if (fetchError && fetchError.code !== 'PGRST116') {
          // PGRST116 = not found, esperado. Outros erros são problemas.
          log(`Fetch error (pode ser novo registro): ${fetchError.message}`, 'DEBUG', { pageId, jsonKey: update.json_key });
        } else {
          isNewRecord = true;
          log(`  ✓ NOVO REGISTRO (não existia)`, 'DEBUG');
        }
        
        // STEP 1.5: Para idiomas NÃO enviados, preparar preservação
        const sentLanguages = Object.keys(update.newText);
        const notSentLanguages = VALID_LANGUAGES.filter(lang => !sentLanguages.includes(lang));
        
        if (notSentLanguages.length > 0) {
          notSentLanguages.forEach(lang => {
            if (!(lang in mergedContent)) {
              // Novo registro: idiomas não enviados ficarão vazios
              mergedContent[lang] = '';
              log(`⚠️ Novo registro - ${lang} não foi enviado e não existe no DB → deixar vazio`, 'DEBUG', {
                pageId,
                jsonKey: update.json_key,
                lang
              });
            } else {
              // Registro existente: preservar idioma existente
              log(`✓ PRESERVANDO ${lang}: "${String(mergedContent[lang]).substring(0, 40)}..."`, 'DEBUG');
            }
          });
        }
        
        // STEP 2: Aplicar novo conteúdo (APENAS idiomas enviados)
        log(`  APLICANDO UPDATE: enviados=${sentLanguages.join(', ')} | PRESERVANDO=${notSentLanguages.join(', ')}`, 'DEBUG');
        
        // Atualizar APENAS os idiomas que foram ENVIADOS
        const intentionallyClearedLanguages = [];
        for (const lang of sentLanguages) {
          const newValue = update.newText[lang];
          const oldValue = mergedContent[lang] || '';
          
          mergedContent[lang] = newValue;
          
          if (newValue === '') {
            intentionallyClearedLanguages.push(lang);
            log(`    ${lang}: LIMPANDO explicitamente ("${String(oldValue).substring(0, 40)}..." → vazio)`, 'DEBUG');
          } else if (oldValue === newValue) {
            log(`    ${lang}: sem mudança ("${String(newValue).substring(0, 40)}...")`, 'DEBUG');
          } else {
            log(`    ${lang}: ATUALIZANDO para "${String(newValue).substring(0, 40)}..."`, 'DEBUG');
          }
        }
        
        // Confirmar que idiomas não enviados foram preservados
        notSentLanguages.forEach(lang => {
          log(`    ${lang}: PRESERVADO (não enviado) = "${String(mergedContent[lang]).substring(0, 40)}..."`, 'DEBUG');
        });
        
        const newHash = hashContent(mergedContent);
        update.oldHash = previousHash;
        update.newHash = newHash;
        
        log(`  ANTES DE SALVAR:`, 'DEBUG');
        log(`    pt-BR: ${mergedContent['pt-BR'] ? `"${String(mergedContent['pt-BR']).substring(0, 50)}..."` : 'VAZIO'}`, 'DEBUG');
        log(`    en-US: ${mergedContent['en-US'] ? `"${String(mergedContent['en-US']).substring(0, 50)}..."` : 'VAZIO'}`, 'DEBUG');
        log(`    Hash muda de ${previousHash?.substring(0, 8)}... para ${newHash.substring(0, 8)}...`, 'DEBUG');
        
        if (previousHash === newHash) {
          log(`NO CHANGE: ${update.json_key}`, 'DEBUG', { pageId });
          return processUpdate(index + 1);
        }
        
        // STEP 4: Salvar com conteúdo mesclado
        return supabase
          .from('text_entries')
          .upsert({
            page_id: update.page_id,
            json_key: update.json_key,
            content: mergedContent,
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'page_id,json_key'
          })
          .select()
          .then(({ data, error }) => {
            if (error) {
              const msg = `Falha ao atualizar ${update.json_key}: ${error.message}`;
              log(msg, 'ERROR', { pageId, jsonKey: update.json_key, errorCode: error.code });
              updateLog.push({
                key: update.json_key,
                status: 'FAILED',
                error: sanitizeError(error)
              });
              // Continuar com próxima atualização (não interromper tudo)
              return processUpdate(index + 1);
            }
            
            // Verificar integridade APÓS save
            const finalIntegrity = validateMultilingualIntegrity(mergedContent, update.json_key);
            
            updateLog.push({
              key: update.json_key,
              status: 'SUCCESS',
              oldHash: previousHash,
              newHash,
              isNewRecord,
              sentLanguages: sentLanguages,
              preservedLanguages: notSentLanguages.length > 0 ? notSentLanguages : undefined,
              intentionallyClearedLanguages: intentionallyClearedLanguages.length > 0 ? intentionallyClearedLanguages : undefined,
              finalState: {
                'pt-BR': mergedContent['pt-BR'] ? `"${String(mergedContent['pt-BR']).substring(0, 50)}..."` : '[vazio]',
                'en-US': mergedContent['en-US'] ? `"${String(mergedContent['en-US']).substring(0, 50)}..."` : '[vazio]'
              },
              integrityValid: finalIntegrity.isValid,
              integrityIssues: finalIntegrity.issues.length > 0 ? finalIntegrity.issues : undefined
            });
            
            log(`UPDATED: ${update.json_key}`, 'INFO', {
              pageId,
              isNewRecord,
              sentLanguages,
              preservedLanguages: notSentLanguages,
              intentionallyClearedLanguages: intentionallyClearedLanguages.length > 0 ? intentionallyClearedLanguages : undefined,
              integrityValid: finalIntegrity.isValid,
              finalState: `pt-BR: ${mergedContent['pt-BR'] ? 'OK' : 'VAZIO'}, en-US: ${mergedContent['en-US'] ? 'OK' : 'VAZIO'}`
            });
            
            // STEP 5: Limpar chave legada se existir (correção 3)
            const legacyKey = `${update.page_id}.${update.json_key}`;
            if (legacyKey !== update.json_key) {
              return supabase
                .from('text_entries')
                .select('content')
                .eq('page_id', update.page_id)
                .eq('json_key', legacyKey)
                .single()
                .then(({ data: legacyRecord, error: legacyError }) => {
                  // Se legado existe e tem dados diferentes
                  if (!legacyError && legacyRecord && legacyRecord.content) {
                    const legacyLanguages = Object.keys(legacyRecord.content);
                    const newLanguages = Object.keys(mergedContent);
                    const missingFromNew = legacyLanguages.filter(l => !newLanguages.includes(l));
                    
                    if (missingFromNew.length > 0) {
                      // RISCO: Há idiomas no legado que não estão no novo
                      log('LEGACY CLEANUP: Merging missing languages from legacy', 'WARN', {
                        pageId,
                        jsonKey: update.json_key,
                        missing: missingFromNew
                      });
                      
                      // Recuperar idiomas faltantes
                      missingFromNew.forEach(lang => {
                        mergedContent[lang] = legacyRecord.content[lang];
                      });
                      
                      // Re-salvar com conteúdo completo
                      return supabase
                        .from('text_entries')
                        .upsert({
                          page_id: update.page_id,
                          json_key: update.json_key,
                          content: mergedContent
                        })
                        .then(() => {
                          // AGORA deletar legado (seguro)
                          return supabase
                            .from('text_entries')
                            .delete()
                            .eq('page_id', update.page_id)
                            .eq('json_key', legacyKey)
                            .then(() => {
                              log(`CLEANED legacy key: ${legacyKey}`, 'INFO', { pageId });
                              return processUpdate(index + 1);
                            });
                        });
                    } else {
                      // Seguro deletar - não há dados únicos no legado
                      return supabase
                        .from('text_entries')
                        .delete()
                        .eq('page_id', update.page_id)
                        .eq('json_key', legacyKey)
                        .then(() => {
                          log(`CLEANED legacy key (safe): ${legacyKey}`, 'DEBUG', { pageId });
                          return processUpdate(index + 1);
                        });
                    }
                  }
                  // Legado não encontrado, é seguro continuar
                  return processUpdate(index + 1);
                })
                .catch((err) => {
                  // Se erro ao verificar legado, não deletar (segurança)
                  log(`Could not verify legacy key, skipping cleanup: ${err.message}`, 'WARN', { pageId });
                  return processUpdate(index + 1);
                });
            }
            
            return processUpdate(index + 1);
          });
      })
      .catch((err) => {
        const duration = Date.now() - startTime;
        const msg = `Erro ao processar chave ${update.json_key}`;
        log(msg, 'ERROR', { pageId, jsonKey: update.json_key, error: err.message, duration });
        updateLog.push({
          key: update.json_key,
          status: 'EXCEPTION',
          error: sanitizeError(err),
          duration
        });
        return processUpdate(index + 1);
      });
  }
  
  return processUpdate(0);
}

module.exports = (req, res) => {
  const requestStart = Date.now();
  const requestId = crypto.randomBytes(8).toString('hex');
  
  // ============ CORS E HEADERS DE SEGURANÇA ============
  const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:5173',
    'http://192.168.1.3:3000',
    'https://igreja-metatron.vercel.app',
    'https://www.igrejademetatron.com.br'
  ];
  
  const origin = req?.headers?.origin || req?.headers?.referer;
  const isAllowedOrigin = allowedOrigins.some(allowed => 
    origin?.startsWith(allowed)
  );
  
  // CORS: apenas origens conhecidas em produção
  if (isAllowedOrigin || !process.env.NODE_ENV?.includes('prod')) {
    res.setHeader('Access-Control-Allow-Origin', origin || allowedOrigins[0]);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  }
  
  res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With, Authorization');
  res.setHeader('Access-Control-Max-Age', '86400');
  
  // Headers de UTF-8 EXPLÍCITO
  res.setHeader('Content-Type', 'application/json; charset=UTF-8');
  res.setHeader('Charset', 'UTF-8');
  
  // Headers de segurança adicionais
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('X-Request-ID', requestId);

  // Preflight
  if (req.method === 'OPTIONS') {
    log('PREFLIGHT REQUEST', 'DEBUG', { requestId, origin });
    return res.status(200).end();
  }

  // ============ VALIDAÇÃO DE REQUISIÇÃO ============
  
  // Validar tamanho do body
  const contentLength = parseInt(req?.headers?.['content-length'] || '0');
  if (contentLength > MAX_REQUEST_BODY_SIZE) {
    log('PAYLOAD TOO LARGE', 'WARN', {
      requestId,
      contentLength,
      maxSize: MAX_REQUEST_BODY_SIZE
    });
    return res.status(413).json({
      success: false,
      message: 'Requisição muito grande'
    });
  }
  
  // Extrair pageId e language
  const pageId = req.query.pageId || req.url?.split('/').pop()?.split('?')[0];
  let language = req.query.language || req.body?.language;
  
  // Se não houver language ou se for 'all', retornar todos os idiomas (modo multilíngue)
  const isMultilingueRequest = !language || language === 'all';
  const reconstructionLanguage = isMultilingueRequest ? null : language;
  
  // Validar pageId obrigatório
  if (!pageId) {
    log('MISSING PAGE_ID', 'WARN', { requestId, method: req.method });
    return res.status(400).json({
      success: false,
      message: 'pageId é obrigatório',
      requestId
    });
  }
  
  log(`REQUEST ${req.method} START`, 'INFO', {
    requestId,
    pageId,
    language,
    method: req.method,
    origin: isAllowedOrigin ? 'ALLOWED' : 'UNKNOWN'
  });
  
  // ============ TIMEOUT HANDLER ============
  const timeoutHandle = setTimeout(() => {
    const duration = Date.now() - requestStart;
    log('REQUEST TIMEOUT', 'ERROR', {
      requestId,
      pageId,
      method: req.method,
      duration
    });
    if (!res.headersSent) {
      return res.status(504).json({
        success: false,
        message: 'Operação expirou',
        requestId
      });
    }
  }, REQUEST_TIMEOUT_MS);
  
  // ============ ROUTE HANDLERS ============

  // GET /api/content/:pageId
  if (req.method === 'GET') {
    return handleGet(pageId, reconstructionLanguage)
      .then((result) => {
        clearTimeout(timeoutHandle);
        
        if (!result) {
          const duration = Date.now() - requestStart;
          log('NOT FOUND', 'WARN', { requestId, pageId, language, duration });
          return res.status(404).json({
            success: false,
            message: `Conteúdo não encontrado para ${pageId}`,
            requestId
          });
        }

        const duration = Date.now() - requestStart;
        const content = result.content || {};
        const languageMetadata = result.languageMetadata || {};
        
        log('GET SUCCESS', 'INFO', {
          requestId,
          pageId,
          language,
          duration,
          contentKeys: Object.keys(content || {}).length
        });
        
        // Avisos sobre integridade de idiomas
        const integrityWarnings = Object.entries(languageMetadata)
          .filter(([_, meta]) => meta.issues && meta.issues.length > 0)
          .map(([key, meta]) => ({
            key,
            available: meta.availableLanguages,
            requested: meta.requestedLanguage,
            used: meta.usedLanguage,
            issues: meta.issues,
            fallbackUsed: meta.fallbackUsed
          }));
        
        return res.status(200).json({
          success: true,
          content,
          languageMetadata,
          source: 'supabase-db',
          languageStatus: {
            requested: language,
            integrityWarnings: integrityWarnings.length > 0 ? integrityWarnings : undefined,
            totalWithIssues: integrityWarnings.length
          },
          metadata: {
            requestId,
            duration: `${duration}ms`,
            timestamp: new Date().toISOString()
          }
        });
      })
      .catch((err) => {
        clearTimeout(timeoutHandle);
        const duration = Date.now() - requestStart;
        const isValidationError = err.message.includes('validation');
        const statusCode = isValidationError ? 400 : 500;
        
        log('GET ERROR', 'ERROR', {
          requestId,
          pageId,
          language,
          error: err.message,
          duration,
          statusCode
        });
        
        return res.status(statusCode).json({
          success: false,
          message: sanitizeError(err),
          requestId,
          duration: `${duration}ms`
        });
      });
  }
  
  // PUT /api/content/:pageId
  if (req.method === 'PUT') {
    const { edits, language: bodyLanguage } = req.body || {};
    const finalLanguage = bodyLanguage || language;
    
    return handlePut(pageId, edits, finalLanguage)
      .then((result) => {
        clearTimeout(timeoutHandle);
        const duration = Date.now() - requestStart;
        const failedCount = result.updateLog?.filter(l => l.status !== 'SUCCESS').length || 0;
        
        log('PUT SUCCESS', 'INFO', {
          requestId,
          pageId,
          language: finalLanguage,
          updatedCount: result.updatedCount,
          failedCount,
          duration
        });
        
        return res.status(200).json({
          success: true,
          message: 'Conteúdo atualizado com sucesso',
          updatedCount: result.updatedCount,
          failedCount,
          updateLog: result.updateLog,
          metadata: {
            requestId,
            duration: `${duration}ms`,
            timestamp: new Date().toISOString()
          }
        });
      })
      .catch((err) => {
        clearTimeout(timeoutHandle);
        const duration = Date.now() - requestStart;
        const isValidationError = err.message.includes('validation') || err.message.includes('obrigatório');
        const statusCode = isValidationError ? 400 : 500;
        
        log('PUT ERROR', 'ERROR', {
          requestId,
          pageId,
          language: finalLanguage,
          error: err.message,
          duration,
          statusCode
        });
        
        return res.status(statusCode).json({
          success: false,
          message: sanitizeError(err),
          requestId,
          duration: `${duration}ms`
        });
      });
  }
  
  // DELETE /api/content/:pageId
  if (req.method === 'DELETE') {
    const { ids } = req.body || {};
    
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'ids array é obrigatório (array de IDs)',
        requestId
      });
    }
    
    // Validar tamanho da lista de deletions
    if (ids.length > 1000) {
      log('DELETE LIMIT EXCEEDED', 'WARN', { requestId, pageId, idsCount: ids.length });
      return res.status(429).json({
        success: false,
        message: 'Máximo de 1000 deletions por requisição',
        requestId
      });
    }
    
    log('DELETE START', 'INFO', { requestId, pageId, idsCount: ids.length });
    
    // Validar e sanitizar IDs
    const validIds = ids.filter(id => typeof id === 'string' || typeof id === 'number');
    if (validIds.length !== ids.length) {
      return res.status(400).json({
        success: false,
        message: 'Todos os IDs devem ser string ou número',
        requestId
      });
    }
    
    const deletePromises = validIds.map(id => {
      return supabase
        .from('text_entries')
        .delete()
        .eq('id', id)
        .eq('page_id', pageId); // Validação extra: confirmar que ID pertence a pageId
    });
    
    return Promise.all(deletePromises)
      .then((results) => {
        clearTimeout(timeoutHandle);
        const duration = Date.now() - requestStart;
        const deletedCount = results.filter(r => !r.error).length;
        const errors = results.filter(r => r.error);
        
        if (errors.length > 0) {
          log('DELETE PARTIAL SUCCESS', 'WARN', {
            requestId,
            pageId,
            deletedCount,
            failedCount: errors.length,
            duration
          });
        } else {
          log('DELETE SUCCESS', 'INFO', {
            requestId,
            pageId,
            deletedCount,
            duration
          });
        }
        
        return res.status(200).json({
          success: errors.length === 0,
          message: `Deletado ${deletedCount}/${validIds.length} registros`,
          deletedCount,
          failedCount: errors.length,
          metadata: {
            requestId,
            duration: `${duration}ms`,
            timestamp: new Date().toISOString()
          }
        });
      })
      .catch((err) => {
        clearTimeout(timeoutHandle);
        const duration = Date.now() - requestStart;
        
        log('DELETE ERROR', 'ERROR', {
          requestId,
          pageId,
          error: err.message,
          duration
        });
        
        return res.status(500).json({
          success: false,
          message: sanitizeError(err),
          requestId,
          duration: `${duration}ms`
        });
      });
  }
  
  // Método não suportado
  return res.status(405).json({
    success: false,
    message: `Método ${req.method} não permitido. Use GET, PUT ou DELETE.`,
    requestId,
    allowedMethods: ['GET', 'PUT', 'DELETE']
  });
};
