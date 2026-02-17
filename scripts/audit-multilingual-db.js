import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BACKUP_FILE = path.join(__dirname, '../backups/backup-supabase-2026-02-11.json');

// Mesmo validador da API
function validateMultilingualIntegrity(content, jsonKey) {
  const VALID_LANGUAGES = ['pt-BR', 'en-US'];
  const issues = [];
  const availableLanguages = [];
  
  // Se content não é objeto, é inválido
  if (!content || typeof content !== 'object' || Array.isArray(content)) {
    issues.push(`Tipo inválido: ${typeof content} (esperado: object)`);
    return {
      isValid: false,
      availableLanguages: [],
      issues,
      completeness: `0/2`
    };
  }
  
  VALID_LANGUAGES.forEach(lang => {
    if (lang in content) {
      const value = content[lang];
      if (value === undefined || value === null) {
        issues.push(`${lang} é null/undefined`);
      } else if (typeof value !== 'string') {
        issues.push(`${lang} não é string`);
      } else if (value.trim() === '') {
        issues.push(`${lang} está vazio`);
      } else {
        availableLanguages.push(lang);
      }
    } else {
      issues.push(`${lang} FALTANDO`);
    }
  });
  
  if (availableLanguages.length === 2 && content['pt-BR'] === content['en-US']) {
    issues.push('⚠️ CONTAMINAÇÃO SUSPEITA: idiomas idênticos');
  }
  
  return {
    isValid: issues.length === 0 && availableLanguages.length === VALID_LANGUAGES.length,
    availableLanguages,
    issues,
    completeness: `${availableLanguages.length}/2`
  };
}

function auditDatabase() {
  console.log('📊 AUDITORIA MULTILÍNGUE DO BANCO DE DADOS');
  console.log('='.repeat(100));
  
  // Carregar backup
  const backup = JSON.parse(fs.readFileSync(BACKUP_FILE, 'utf-8'));
  console.log(`✅ Carregados ${backup.length} registros do backup\n`);
  
  // Categorizar registros
  const categories = {
    complete: [],        // Ambos idiomas presentes e diferentes
    missing_en: [],      // Falta en-US
    missing_pt: [],      // Falta pt-BR
    both_empty: [],      // Ambos vazios/nulos
    identical: [],       // pt-BR === en-US (contaminação)
    invalid: [],         // Tipo incorreto
    mixed_issues: []     // Múltiplos problemas
  };
  
  backup.forEach((record) => {
    const integrity = validateMultilingualIntegrity(record.content, record.json_key);
    const hasIssues = integrity.issues.length > 0;
    
    if (integrity.isValid) {
      categories.complete.push({
        page_id: record.page_id,
        json_key: record.json_key,
        pt_preview: record.content['pt-BR'].substring(0, 50),
        en_preview: record.content['en-US'].substring(0, 50),
        integrity
      });
    } else {
      const issue = integrity.issues[0];
      
      if (issue.includes('pt-BR FALTANDO')) {
        categories.missing_pt.push({
          page_id: record.page_id,
          json_key: record.json_key,
          en_preview: record.content['en-US']?.substring(0, 50),
          integrity
        });
      } else if (issue.includes('en-US FALTANDO')) {
        categories.missing_en.push({
          page_id: record.page_id,
          json_key: record.json_key,
          pt_preview: record.content['pt-BR']?.substring(0, 50),
          integrity
        });
      } else if (issue.includes('CONTAMINAÇÃO')) {
        categories.identical.push({
          page_id: record.page_id,
          json_key: record.json_key,
          content_preview: record.content['pt-BR']?.substring(0, 50),
          integrity,
          issues: integrity.issues
        });
      } else if (issue.includes('tipo') || issue.includes('null') || issue.includes('undefined')) {
        categories.invalid.push({
          page_id: record.page_id,
          json_key: record.json_key,
          integrity,
          issues: integrity.issues
        });
      } else {
        categories.mixed_issues.push({
          page_id: record.page_id,
          json_key: record.json_key,
          integrity,
          issues: integrity.issues
        });
      }
    }
  });
  
  // Relatório resumido
  console.log('📋 SUMÁRIO:');
  console.log(`  ✅ Completos (ambos idiomas OK): ${categories.complete.length}`);
  console.log(`  ⚠️  Faltando en-US: ${categories.missing_en.length}`);
  console.log(`  ⚠️  Faltando pt-BR: ${categories.missing_pt.length}`);
  console.log(`  🔴 Ambos vazios/nulos: ${categories.both_empty.length}`);
  console.log(`  🔴 Idênticos (CONTAMINAÇÃO): ${categories.identical.length}`);
  console.log(`  🔴 Tipo inválido: ${categories.invalid.length}`);
  console.log(`  🔴 Múltiplos problemas: ${categories.mixed_issues.length}`);
  console.log('\n' + '='.repeat(100) + '\n');
  
  // Detalhes por categoria problemática
  if (categories.missing_en.length > 0) {
    console.log(`\n📌 REGISTROS FALTANDO en-US (${categories.missing_en.length}):`);
    console.log('-'.repeat(100));
    categories.missing_en.slice(0, 10).forEach((record, i) => {
      console.log(`${i + 1}. ${record.page_id}.${record.json_key}`);
      console.log(`   pt-BR disponível: "${record.pt_preview}..."`);
      console.log(`   ➜ AÇÃO: Editar em en-US via interface`);
      console.log();
    });
    if (categories.missing_en.length > 10) {
      console.log(`   ... e mais ${categories.missing_en.length - 10} registros\n`);
    }
  }
  
  if (categories.missing_pt.length > 0) {
    console.log(`\n📌 REGISTROS FALTANDO pt-BR (${categories.missing_pt.length}):`);
    console.log('-'.repeat(100));
    categories.missing_pt.slice(0, 10).forEach((record, i) => {
      console.log(`${i + 1}. ${record.page_id}.${record.json_key}`);
      console.log(`   en-US disponível: "${record.en_preview}..."`);
      console.log(`   ➜ AÇÃO: Editar em pt-BR via interface`);
      console.log();
    });
    if (categories.missing_pt.length > 10) {
      console.log(`   ... e mais ${categories.missing_pt.length - 10} registros\n`);
    }
  }
  
  if (categories.identical.length > 0) {
    console.log(`\n🔴 REGISTROS COM CONTAMINAÇÃO (pt-BR === en-US) (${categories.identical.length}):`);
    console.log('-'.repeat(100));
    categories.identical.slice(0, 10).forEach((record, i) => {
      console.log(`${i + 1}. ${record.page_id}.${record.json_key}`);
      console.log(`   Conteúdo (idêntico): "${record.content_preview}..."`);
      console.log(`   ➜ AÇÃO: Verificar qual idioma é realmente esse conteúdo`);
      console.log();
    });
    if (categories.identical.length > 10) {
      console.log(`   ... e mais ${categories.identical.length - 10} registros\n`);
    }
  }
  
  if (categories.invalid.length > 0) {
    console.log(`\n🔴 REGISTROS COM TIPO INVÁLIDO (${categories.invalid.length}):`);
    console.log('-'.repeat(100));
    categories.invalid.slice(0, 10).forEach((record, i) => {
      console.log(`${i + 1}. ${record.page_id}.${record.json_key}`);
      console.log(`   Problemas: ${record.issues.join(', ')}`);
      console.log(`   ➜ AÇÃO: Necessário corrigir tipo de dados`);
      console.log();
    });
  }
  
  // Salvar relatório completo
  const reportFile = path.join(__dirname, '../docs/MULTILINGUAL-AUDIT-REPORT.json');
  const report = {
    timestamp: new Date().toISOString(),
    total_records: backup.length,
    summary: {
      complete: categories.complete.length,
      missing_en: categories.missing_en.length,
      missing_pt: categories.missing_pt.length,
      both_empty: categories.both_empty.length,
      identical: categories.identical.length,
      invalid: categories.invalid.length,
      mixed_issues: categories.mixed_issues.length
    },
    records_by_status: {
      complete: categories.complete,
      missing_en_us: categories.missing_en,
      missing_pt_br: categories.missing_pt,
      identical: categories.identical.map(r => ({
        page_id: r.page_id,
        json_key: r.json_key,
        issues: r.issues
      })),
      invalid: categories.invalid
    },
    action_items: {
      immediate: [
        `Corrigir ${categories.identical.length} registros com conteúdo idêntico`,
        `Adicionar en-US em ${categories.missing_en.length} registros`,
        `Adicionar pt-BR em ${categories.missing_pt.length} registros`
      ],
      total_to_fix: categories.missing_en.length + categories.missing_pt.length + categories.identical.length
    }
  };
  
  fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));
  
  console.log('\n' + '='.repeat(100));
  console.log(`\n📁 Relatório completo salvo em: ${reportFile}`);
  console.log(`\n✅ AUDITORIA CONCLUÍDA`);
  console.log(`\n📌 PRÓXIMOS PASSOS:`);
  console.log(`   1. Abrir a interface de edição`);
  console.log(`   2. Para cada registro com problemas, completar o idioma faltante`);
  console.log(`   3. Sistema saberá qual idioma está faltando e qual está presente`);
  console.log(`   4. Após editar, salvar e system salva com integridade`);
}

auditDatabase();
