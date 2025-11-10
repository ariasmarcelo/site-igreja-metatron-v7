#!/usr/bin/env node

/**
 * SCRIPT UNIFICADO: Verificação e Correção de IDs Únicos
 * 
 * FUNCIONALIDADES:
 * 1. --check: Apenas verifica e reporta problemas (padrão)
 * 2. --fix: Corrige automaticamente os problemas encontrados
 * 3. --dry-run: Mostra o que seria feito sem modificar arquivos
 * 
 * EXECUÇÃO:
 * node scripts/check-and-fix-ids.js                    # Verifica apenas
 * node scripts/check-and-fix-ids.js --fix              # Verifica e corrige
 * node scripts/check-and-fix-ids.js --dry-run --fix    # Preview das correções
 * node scripts/check-and-fix-ids.js --page=Index       # Página específica
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ============================================================================
// CONFIGURAÇÃO
// ============================================================================

const ROOT_DIR = path.join(__dirname, '..');
const PAGES_DIR = path.join(ROOT_DIR, 'src', 'pages');
const LOCALES_DIR = path.join(ROOT_DIR, 'src', 'locales', 'pt-BR');

const CHECK_ONLY = !process.argv.includes('--fix');
const DRY_RUN = process.argv.includes('--dry-run');
const VERBOSE = process.argv.includes('--verbose');
const PAGE_FILTER = process.argv.find(arg => arg.startsWith('--page='))?.split('=')[1];

console.log('🎯 Script Unificado - Verificação e Correção de IDs');
console.log('═'.repeat(80));
console.log(`🔧 Modo: ${CHECK_ONLY ? '🔍 CHECK (somente verificação)' : DRY_RUN ? '👁️  DRY RUN (preview)' : '🔴 FIX (vai modificar arquivos!)'}`);
if (PAGE_FILTER) console.log(`🎯 Filtro: ${PAGE_FILTER}`);
console.log('');

// ============================================================================
// UTILITÁRIOS
// ============================================================================

function log(...args) {
  if (VERBOSE) console.log(...args);
}

function getPageId(filename) {
  return filename.replace('.tsx', '').toLowerCase();
}

function normalizeIdentifier(str) {
  return str
    .toLowerCase()
    .replace(/[áàâã]/g, 'a')
    .replace(/[éèê]/g, 'e')
    .replace(/[íìî]/g, 'i')
    .replace(/[óòôõ]/g, 'o')
    .replace(/[úùû]/g, 'u')
    .replace(/[ç]/g, 'c')
    .replace(/[^a-z0-9]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '');
}

/**
 * Extrai caminho JSON de {texts.xxx.yyy}
 */
function extractJsonPath(textUsage) {
  const match = textUsage.match(/\{texts(\?)?\.([a-zA-Z0-9_.[\]]+)\}/);
  return match ? match[2] : null;
}

/**
 * Busca tag JSX que contém o texto
 */
function findParentTag(code, position) {
  let startPos = position;
  let openTagPos = -1;
  let depth = 0;
  
  // Buscar para trás até encontrar tag de abertura
  for (let i = startPos; i >= 0; i--) {
    if (code[i] === '>') depth++;
    if (code[i] === '<') {
      depth--;
      if (depth < 0) {
        openTagPos = i;
        break;
      }
    }
  }
  
  if (openTagPos === -1) return null;
  
  // Encontrar fim da tag de abertura
  let closeTagPos = code.indexOf('>', openTagPos);
  if (closeTagPos === -1) return null;
  
  // Extrair tag completa
  const tagContent = code.substring(openTagPos, closeTagPos + 1);
  
  // Pegar nome da tag
  const tagMatch = tagContent.match(/<(\w+)/);
  const tagName = tagMatch ? tagMatch[1] : 'unknown';
  
  return {
    content: tagContent,
    start: openTagPos,
    end: closeTagPos + 1,
    name: tagName,
    hasDataJsonKey: /data-json-key=/.test(tagContent)
  };
}

/**
 * Gera ID único para elemento
 */
function generateId(pageId, jsonPath, index = null) {
  if (index !== null) {
    // Para arrays: pagina.items[0].title
    return `${pageId}.${jsonPath.replace(/\./g, '.')}`;
  }
  return `${pageId}.${jsonPath}`;
}

/**
 * Injeta data-json-key na tag
 */
function injectDataJsonKey(tagContent, dataJsonKey) {
  // Se já tem data-json-key, substituir
  if (/data-json-key=/.test(tagContent)) {
    return tagContent.replace(
      /data-json-key=(?:"[^"]*"|'[^']*'|\{[^}]*\})/,
      `data-json-key="${dataJsonKey}"`
    );
  }
  
  // Adicionar antes do > final
  const insertPos = tagContent.lastIndexOf('>');
  if (insertPos === -1) return tagContent;
  
  // Verificar se é self-closing
  const isSelfClosing = tagContent.substring(insertPos - 1, insertPos) === '/';
  const insertBefore = isSelfClosing ? insertPos - 1 : insertPos;
  
  return tagContent.substring(0, insertBefore) + 
         ` data-json-key="${dataJsonKey}"` + 
         tagContent.substring(insertBefore);
}

// ============================================================================
// PROCESSAMENTO
// ============================================================================

const pages = fs.readdirSync(PAGES_DIR)
  .filter(f => f.endsWith('.tsx'))
  .filter(f => !PAGE_FILTER || f === `${PAGE_FILTER}.tsx`);

let totalIssues = 0;
let totalFixed = 0;
let totalPages = 0;

const results = [];

pages.forEach(pageFile => {
  const pagePath = path.join(PAGES_DIR, pageFile);
  let content = fs.readFileSync(pagePath, 'utf-8');
  const originalContent = content;
  
  const pageId = getPageId(pageFile);
  
  // Encontrar todos os usos de {texts.xxx}
  const textsRegex = /\{texts(\?)?\.[\w.[\]]+\}/g;
  const textsMatches = [...content.matchAll(textsRegex)];
  
  if (textsMatches.length === 0) return;
  
  totalPages++;
  
  const pageResult = {
    file: pageFile,
    totalUsages: textsMatches.length,
    issues: [],
    fixed: 0
  };
  
  // Processar de trás para frente para não bagunçar as posições
  const matchesReversed = [...textsMatches].reverse();
  
  matchesReversed.forEach(match => {
    const textUsage = match[0]; // Ex: {texts.header.title}
    const position = match.index;
    const lineNumber = originalContent.substring(0, position).split('\n').length;
    
    // Extrair caminho JSON
    const jsonPath = extractJsonPath(textUsage);
    if (!jsonPath) return;
    
    // Encontrar tag pai
    const tag = findParentTag(content, position);
    if (!tag) return;
    
    // Se já tem data-json-key, pular
    if (tag.hasDataJsonKey) return;
    
    // Problema encontrado!
    totalIssues++;
    
    const issue = {
      line: lineNumber,
      textUsage,
      tagName: tag.name,
      jsonPath
    };
    
    pageResult.issues.push(issue);
    
    // Se modo FIX, corrigir
    if (!CHECK_ONLY) {
      const dataJsonKey = generateId(pageId, jsonPath);
      const newTag = injectDataJsonKey(tag.content, dataJsonKey);
      
      // Substituir no conteúdo
      content = content.substring(0, tag.start) + newTag + content.substring(tag.end);
      
      pageResult.fixed++;
      totalFixed++;
    }
  });
  
  // Salvar arquivo modificado (se não for dry-run)
  if (!CHECK_ONLY && !DRY_RUN && pageResult.fixed > 0) {
    // Criar backup
    fs.writeFileSync(`${pagePath}.backup`, originalContent);
    fs.writeFileSync(pagePath, content);
  }
  
  results.push(pageResult);
});

// ============================================================================
// RELATÓRIO
// ============================================================================

console.log('📊 RESULTADOS:\n');

results.forEach(result => {
  if (result.issues.length === 0) {
    console.log(`✅ ${result.file}`);
    console.log(`   ${result.totalUsages} elementos - Todos com data-json-key\n`);
    return;
  }
  
  console.log(`${CHECK_ONLY ? '⚠️' : '🔧'} ${result.file}`);
  console.log(`   Total de usos: ${result.totalUsages}`);
  console.log(`   Problemas: ${result.issues.length}`);
  
  if (CHECK_ONLY) {
    // Modo CHECK: mostrar problemas
    result.issues.slice(0, 5).forEach(issue => {
      console.log(`   ⚠️  Linha ${issue.line}: <${issue.tagName}> ${issue.textUsage}`);
    });
    if (result.issues.length > 5) {
      console.log(`   ... e mais ${result.issues.length - 5} problemas`);
    }
  } else {
    // Modo FIX: mostrar correções
    console.log(`   ✅ Corrigidos: ${result.fixed}`);
  }
  
  console.log('');
});

console.log('═'.repeat(80));
console.log('\n📈 RESUMO GERAL:\n');
console.log(`   Páginas verificadas: ${totalPages}`);
console.log(`   Problemas encontrados: ${totalIssues}`);

if (CHECK_ONLY) {
  if (totalIssues === 0) {
    console.log(`\n✅ Todas as páginas estão corretas!`);
    console.log(`   Todos os elementos editáveis têm data-json-key.\n`);
  } else {
    console.log(`\n⚠️  Encontrados ${totalIssues} elementos sem data-json-key.`);
    console.log(`\n💡 Para corrigir automaticamente, execute:`);
    console.log(`   node scripts/check-and-fix-ids.js --fix`);
    console.log(`\n   Ou para preview das mudanças:`);
    console.log(`   node scripts/check-and-fix-ids.js --fix --dry-run\n`);
  }
  process.exit(totalIssues > 0 ? 1 : 0);
} else {
  console.log(`   Elementos corrigidos: ${totalFixed}`);
  
  if (DRY_RUN) {
    console.log(`\n👁️  DRY RUN: Nenhum arquivo foi modificado.`);
    console.log(`   Execute sem --dry-run para aplicar as mudanças.\n`);
  } else {
    console.log(`\n✅ Arquivos modificados e backups criados (.backup)`);
    console.log(`   ${totalFixed} elementos agora têm data-json-key.\n`);
  }
  process.exit(0);
}
