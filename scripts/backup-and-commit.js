/**
 * 🔄 Script de Backup Automático com Versionamento Git
 * 
 * Faz backup do Supabase e commita em branch separada do Git.
 * Isso garante que os backups fiquem persistidos no GitHub,
 * independente de ambientes efêmeros.
 * 
 * Uso:
 *   node scripts/backup-and-commit.js
 *   node scripts/backup-and-commit.js --verbose
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Carregar .env.local
dotenv.config({ path: path.join(__dirname, '../.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variáveis de ambiente Supabase não configuradas');
  console.log('📝 Configure VITE_SUPABASE_URL e SUPABASE_SERVICE_KEY no .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Argumentos
const VERBOSE = process.argv.includes('--verbose');

// Diretórios
const BACKUP_DIR = path.join(__dirname, '../backups/supabase');
const timestamp = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
const dateStr = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
const CURRENT_BACKUP_DIR = path.join(BACKUP_DIR, dateStr);

// Branch do Git para backups
const BACKUP_BRANCH = 'backups/database';

// Tabelas
const TABLES = [
  'text_entries',
  'page_history'
];

/**
 * Executa comando Git
 */
function execGit(command, ignoreError = false) {
  try {
    const output = execSync(command, { 
      cwd: path.join(__dirname, '..'),
      encoding: 'utf8' 
    });
    if (VERBOSE && output) console.log(output);
    return output;
  } catch (error) {
    if (!ignoreError) {
      console.error(`❌ Erro ao executar: ${command}`);
      console.error(error.message);
    }
    return null;
  }
}

/**
 * Cria diretório de backup
 */
function ensureBackupDir() {
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
  }
  if (!fs.existsSync(CURRENT_BACKUP_DIR)) {
    fs.mkdirSync(CURRENT_BACKUP_DIR, { recursive: true });
  }
}

/**
 * Faz backup de uma tabela
 */
async function backupTable(tableName) {
  try {
    if (VERBOSE) console.log(`📥 Backup de ${tableName}...`);
    
    const { data, error, count } = await supabase
      .from(tableName)
      .select('*', { count: 'exact' });
    
    if (error) {
      console.error(`❌ Erro ao buscar ${tableName}:`, error.message);
      return { success: false, tableName, error: error.message };
    }
    
    // Salvar arquivo JSON
    const filePath = path.join(CURRENT_BACKUP_DIR, `${tableName}.json`);
    const content = JSON.stringify(data, null, 2);
    fs.writeFileSync(filePath, content, 'utf8');
    
    const fileSize = (fs.statSync(filePath).size / 1024).toFixed(2);
    
    if (VERBOSE) {
      console.log(`✅ ${tableName}: ${count || data.length} registros, ${fileSize} KB`);
    }
    
    return {
      success: true,
      tableName,
      records: count || data.length,
      size: fileSize,
      filePath
    };
    
  } catch (error) {
    console.error(`❌ Erro ao processar ${tableName}:`, error.message);
    return { success: false, tableName, error: error.message };
  }
}

/**
 * Cria arquivo de metadados
 */
function createMetadata(results) {
  const metadata = {
    timestamp: new Date().toISOString(),
    date: timestamp,
    supabaseUrl,
    tables: results.map(r => ({
      name: r.tableName,
      success: r.success,
      records: r.records || 0,
      size: r.size || '0',
      error: r.error || null
    })),
    totalRecords: results.reduce((sum, r) => sum + (r.records || 0), 0),
    totalSize: results.reduce((sum, r) => sum + parseFloat(r.size || 0), 0).toFixed(2),
    successful: results.filter(r => r.success).length,
    failed: results.filter(r => !r.success).length
  };
  
  const metadataPath = path.join(CURRENT_BACKUP_DIR, '_metadata.json');
  fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2), 'utf8');
  
  return metadata;
}

/**
 * Verifica se houve mudanças nos dados
 */
function hasChanges() {
  const status = execGit('git status --porcelain backups/', true);
  return status && status.trim().length > 0;
}

/**
 * Commita backup no Git
 */
function commitBackup(metadata) {
  console.log('\n📦 Commitando backup no Git...');
  
  // Salvar branch atual
  const currentBranch = execGit('git rev-parse --abbrev-ref HEAD').trim();
  
  try {
    // Verificar se branch de backup existe
    const branchExists = execGit(`git rev-parse --verify ${BACKUP_BRANCH}`, true);
    
    if (!branchExists) {
      console.log(`🌿 Criando branch ${BACKUP_BRANCH}...`);
      execGit(`git checkout -b ${BACKUP_BRANCH}`);
      execGit(`git checkout ${currentBranch}`);
    }
    
    // Fazer checkout da branch de backup
    execGit(`git checkout ${BACKUP_BRANCH}`);
    
    // Adicionar arquivos de backup
    execGit('git add backups/');
    
    // Verificar se há mudanças para commitar
    if (!hasChanges()) {
      console.log('ℹ️ Nenhuma mudança detectada nos dados');
      execGit(`git checkout ${currentBranch}`);
      return false;
    }
    
    // Commit
    const commitMsg = `chore: Backup automático ${timestamp} - ${metadata.totalRecords} registros`;
    execGit(`git commit -m "${commitMsg}"`);
    
    console.log(`✅ Backup commitado em ${BACKUP_BRANCH}`);
    
    // Voltar para branch original
    execGit(`git checkout ${currentBranch}`);
    
    return true;
    
  } catch (error) {
    console.error('❌ Erro ao commitar backup:', error.message);
    // Tentar voltar para branch original
    execGit(`git checkout ${currentBranch}`, true);
    return false;
  }
}

/**
 * Push para GitHub
 */
function pushToGitHub() {
  console.log('\n🚀 Enviando backup para GitHub...');
  
  try {
    const output = execGit(`git push origin ${BACKUP_BRANCH}`);
    
    if (output && output.includes('Everything up-to-date')) {
      console.log('ℹ️ GitHub já está atualizado');
    } else {
      console.log('✅ Backup enviado para GitHub');
    }
    
    return true;
    
  } catch (error) {
    console.error('❌ Erro ao fazer push:', error.message);
    console.log('⚠️ Backup commitado localmente, mas não enviado ao GitHub');
    console.log('💡 Execute manualmente: git push origin ' + BACKUP_BRANCH);
    return false;
  }
}

/**
 * Exibe resumo
 */
function printSummary(metadata, committed, pushed) {
  console.log('\n' + '='.repeat(60));
  console.log('📊 RESUMO DO BACKUP');
  console.log('='.repeat(60));
  console.log(`📅 Data: ${new Date(metadata.timestamp).toLocaleString('pt-BR')}`);
  console.log(`📂 Pasta: ${path.basename(CURRENT_BACKUP_DIR)}`);
  console.log(`📋 Tabelas: ${metadata.successful}/${metadata.tables.length} com sucesso`);
  console.log(`📄 Registros: ${metadata.totalRecords}`);
  console.log(`💾 Tamanho: ${metadata.totalSize} KB`);
  console.log(`🌿 Git Branch: ${BACKUP_BRANCH}`);
  console.log(`📦 Committed: ${committed ? '✅ Sim' : '⏭️ Não (sem mudanças)'}`);
  console.log(`🚀 Pushed: ${pushed ? '✅ Sim' : '⏭️ Não'}`);
  
  if (metadata.failed > 0) {
    console.log(`\n⚠️ Falhas: ${metadata.failed}`);
    metadata.tables
      .filter(t => !t.success)
      .forEach(t => console.log(`   ❌ ${t.name}: ${t.error}`));
  }
  
  console.log('\n' + '='.repeat(60));
  console.log(`✅ Backup salvo localmente em: ${CURRENT_BACKUP_DIR}`);
  if (committed && pushed) {
    console.log(`✅ Backup versionado e enviado para GitHub`);
    console.log(`📌 Para visualizar: git checkout ${BACKUP_BRANCH}`);
  }
  console.log('='.repeat(60) + '\n');
}

/**
 * Função principal
 */
async function main() {
  console.log('🗄️ Iniciando backup automático do Supabase...\n');
  
  // Verificar se está em um repositório Git
  const isGitRepo = execGit('git rev-parse --git-dir', true);
  if (!isGitRepo) {
    console.error('❌ Este não é um repositório Git');
    process.exit(1);
  }
  
  // Verificar conexão com Supabase
  const { error: connectionError } = await supabase
    .from('text_entries')
    .select('id', { count: 'exact', head: true });
  
  if (connectionError) {
    console.error('❌ Erro ao conectar com Supabase:', connectionError.message);
    console.log('📝 Verifique suas credenciais no .env.local');
    process.exit(1);
  }
  
  console.log('✅ Conectado ao Supabase\n');
  
  // Criar diretório
  ensureBackupDir();
  
  console.log(`📋 Fazendo backup de ${TABLES.length} tabela(s)...\n`);
  
  // Fazer backup de cada tabela
  const results = [];
  for (const table of TABLES) {
    const result = await backupTable(table);
    results.push(result);
  }
  
  // Criar metadados
  const metadata = createMetadata(results);
  
  // Commitar no Git
  const committed = commitBackup(metadata);
  
  // Push para GitHub (se commitou)
  const pushed = committed ? pushToGitHub() : false;
  
  // Exibir resumo
  printSummary(metadata, committed, pushed);
  
  // Exit code
  const exitCode = metadata.failed > 0 ? 1 : 0;
  process.exit(exitCode);
}

// Executar
main().catch(error => {
  console.error('❌ Erro fatal:', error);
  process.exit(1);
});
