/**
 * 📧 Script de Envio de Backup por Email
 * 
 * Envia o backup mais recente do Supabase por email usando Gmail SMTP.
 * 
 * Configuração necessária no .env.local:
 *   EMAIL_BACKUP_ENABLED=true
 *   EMAIL_BACKUP_FROM=seu-email@gmail.com
 *   EMAIL_BACKUP_TO=destino@email.com
 *   EMAIL_BACKUP_PASSWORD=sua-senha-de-app-gmail
 * 
 * Para gerar senha de app do Gmail:
 *   1. Ative verificação em 2 etapas na sua conta Google
 *   2. Acesse: https://myaccount.google.com/apppasswords
 *   3. Gere uma senha de app para "Email"
 * 
 * Uso:
 *   node scripts/backup-and-email.js
 *   node scripts/backup-and-email.js --verbose
 */

import { createClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import AdmZip from 'adm-zip';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Carregar .env.local
dotenv.config({ path: path.join(__dirname, '../.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

// Configurações de email
const EMAIL_ENABLED = process.env.EMAIL_BACKUP_ENABLED === 'true';
const EMAIL_FROM = process.env.EMAIL_BACKUP_FROM;
const EMAIL_TO = process.env.EMAIL_BACKUP_TO;
const EMAIL_PASSWORD = process.env.EMAIL_BACKUP_PASSWORD;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variáveis de ambiente Supabase não configuradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Argumentos
const VERBOSE = process.argv.includes('--verbose');

// Diretórios
const BACKUP_DIR = path.join(__dirname, '../backups/supabase');
const timestamp = new Date().toISOString().split('T')[0];
const dateStr = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
const CURRENT_BACKUP_DIR = path.join(BACKUP_DIR, dateStr);

const TABLES = ['text_entries', 'page_history'];

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
 * Cria arquivo ZIP do backup
 */
function createZipBackup() {
  try {
    console.log('\n📦 Criando arquivo ZIP...');
    
    const zip = new AdmZip();
    
    // Adicionar todos os arquivos JSON
    const files = fs.readdirSync(CURRENT_BACKUP_DIR);
    files.forEach(file => {
      const filePath = path.join(CURRENT_BACKUP_DIR, file);
      zip.addLocalFile(filePath);
    });
    
    // Salvar ZIP
    const zipPath = path.join(BACKUP_DIR, `backup-${timestamp}.zip`);
    zip.writeZip(zipPath);
    
    const zipSize = (fs.statSync(zipPath).size / 1024).toFixed(2);
    console.log(`✅ ZIP criado: ${zipSize} KB`);
    
    return zipPath;
    
  } catch (error) {
    console.error('❌ Erro ao criar ZIP:', error.message);
    return null;
  }
}

/**
 * Envia backup por email
 */
async function sendEmailBackup(zipPath, metadata) {
  if (!EMAIL_ENABLED) {
    console.log('\n⏭️ Envio de email desabilitado (EMAIL_BACKUP_ENABLED=false)');
    return false;
  }
  
  if (!EMAIL_FROM || !EMAIL_TO || !EMAIL_PASSWORD) {
    console.error('\n❌ Configurações de email incompletas no .env.local');
    console.log('📝 Configure: EMAIL_BACKUP_FROM, EMAIL_BACKUP_TO, EMAIL_BACKUP_PASSWORD');
    return false;
  }
  
  try {
    console.log('\n📧 Enviando backup por email...');
    
    // Configurar transporter do Gmail
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: EMAIL_FROM,
        pass: EMAIL_PASSWORD
      }
    });
    
    // Verificar conexão
    await transporter.verify();
    
    // Preparar email
    const mailOptions = {
      from: EMAIL_FROM,
      to: EMAIL_TO,
      subject: `🗄️ Backup Supabase - ${timestamp} - Igreja de Metatron`,
      html: `
        <h2>Backup Automático do Banco de Dados</h2>
        <p><strong>Data:</strong> ${new Date(metadata.timestamp).toLocaleString('pt-BR')}</p>
        <p><strong>Total de Registros:</strong> ${metadata.totalRecords}</p>
        <p><strong>Tamanho:</strong> ${metadata.totalSize} KB</p>
        
        <h3>Tabelas:</h3>
        <ul>
          ${metadata.tables.map(t => `
            <li>
              <strong>${t.name}:</strong> 
              ${t.success ? `✅ ${t.records} registros (${t.size} KB)` : `❌ Erro: ${t.error}`}
            </li>
          `).join('')}
        </ul>
        
        <hr>
        <p style="color: #666; font-size: 12px;">
          Backup automático gerado pelo sistema da Igreja de Metatron<br>
          ${supabaseUrl}
        </p>
      `,
      attachments: [
        {
          filename: `backup-igreja-metatron-${timestamp}.zip`,
          path: zipPath
        }
      ]
    };
    
    // Enviar email
    const info = await transporter.sendMail(mailOptions);
    
    console.log(`✅ Email enviado: ${info.messageId}`);
    console.log(`📧 Para: ${EMAIL_TO}`);
    
    return true;
    
  } catch (error) {
    console.error('❌ Erro ao enviar email:', error.message);
    
    if (error.message.includes('Invalid login')) {
      console.log('\n💡 Dicas:');
      console.log('   1. Verifique se a senha de app do Gmail está correta');
      console.log('   2. Gere uma nova senha em: https://myaccount.google.com/apppasswords');
      console.log('   3. Ative verificação em 2 etapas se ainda não ativou');
    }
    
    return false;
  }
}

/**
 * Exibe resumo
 */
function printSummary(metadata, emailSent) {
  console.log('\n' + '='.repeat(60));
  console.log('📊 RESUMO DO BACKUP');
  console.log('='.repeat(60));
  console.log(`📅 Data: ${new Date(metadata.timestamp).toLocaleString('pt-BR')}`);
  console.log(`📂 Pasta: ${path.basename(CURRENT_BACKUP_DIR)}`);
  console.log(`📋 Tabelas: ${metadata.successful}/${metadata.tables.length} com sucesso`);
  console.log(`📄 Registros: ${metadata.totalRecords}`);
  console.log(`💾 Tamanho: ${metadata.totalSize} KB`);
  console.log(`📧 Email: ${emailSent ? '✅ Enviado' : '⏭️ Não enviado'}`);
  
  if (metadata.failed > 0) {
    console.log(`\n⚠️ Falhas: ${metadata.failed}`);
    metadata.tables
      .filter(t => !t.success)
      .forEach(t => console.log(`   ❌ ${t.name}: ${t.error}`));
  }
  
  console.log('\n' + '='.repeat(60));
  console.log(`✅ Backup salvo em: ${CURRENT_BACKUP_DIR}`);
  if (emailSent) {
    console.log(`✅ Backup enviado para: ${EMAIL_TO}`);
  }
  console.log('='.repeat(60) + '\n');
}

/**
 * Função principal
 */
async function main() {
  console.log('🗄️ Iniciando backup e envio por email...\n');
  
  // Verificar conexão com Supabase
  const { error: connectionError } = await supabase
    .from('text_entries')
    .select('id', { count: 'exact', head: true });
  
  if (connectionError) {
    console.error('❌ Erro ao conectar com Supabase:', connectionError.message);
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
  
  // Criar ZIP
  const zipPath = createZipBackup();
  
  // Enviar por email
  const emailSent = zipPath ? await sendEmailBackup(zipPath, metadata) : false;
  
  // Exibir resumo
  printSummary(metadata, emailSent);
  
  // Exit code
  const exitCode = metadata.failed > 0 ? 1 : 0;
  process.exit(exitCode);
}

// Executar
main().catch(error => {
  console.error('❌ Erro fatal:', error);
  process.exit(1);
});
