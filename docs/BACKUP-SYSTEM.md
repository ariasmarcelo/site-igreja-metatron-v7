# 🗄️ Sistema de Backup Automático

**Última atualização:** 16/11/2025

## 📋 Visão Geral

Sistema robusto de backup para proteger todos os dados do Supabase contra perda, independente de ambientes efêmeros. Os backups são versionados no Git e podem ser enviados por email automaticamente.

---

## 🎯 Objetivos

1. **Proteção contra perda de dados** no Supabase (SaaS gratuito)
2. **Versionamento no Git** para histórico completo
3. **Backup diário automático** via GitHub Actions
4. **Envio por email** (opcional) para redundância extra
5. **Recuperação simples** com scripts dedicados

---

## 📦 Componentes do Sistema

### 1. Scripts de Backup

#### `backup-supabase.js` - Backup Local Simples
Faz backup do Supabase para arquivos JSON locais.

**Uso:**
```bash
pnpm backup                  # Backup padrão
pnpm backup:verbose          # Com detalhes
```

**Tabelas incluídas:**
- `text_entries` - Todos os textos do site (764 registros)
- `page_history` - Histórico de alterações

**Output:**
```
backups/supabase/
  └── 2025-11-16T15-30-00/
      ├── text_entries.json
      ├── page_history.json
      └── _metadata.json
```

---

#### `backup-and-commit.js` - Backup com Versionamento Git
Faz backup e commita em branch separada do Git, enviando para GitHub.

**Uso:**
```bash
node scripts/backup-and-commit.js
node scripts/backup-and-commit.js --verbose
```

**Características:**
- ✅ Cria backup local
- ✅ Commita na branch `backups/database`
- ✅ Push automático para GitHub
- ✅ Detecta mudanças (não commita se dados não mudaram)
- ✅ Histórico completo de versões

**Estrutura no Git:**
```
Branch: backups/database
  └── backups/supabase/
      ├── 2025-11-16T15-30-00/
      ├── 2025-11-15T15-30-00/
      └── 2025-11-14T15-30-00/
```

---

#### `backup-and-email.js` - Backup com Envio por Email
Faz backup, cria arquivo ZIP e envia por email via Gmail.

**Uso:**
```bash
node scripts/backup-and-email.js
node scripts/backup-and-email.js --verbose
```

**Configuração necessária no `.env.local`:**
```env
EMAIL_BACKUP_ENABLED=true
EMAIL_BACKUP_FROM=seu-email@gmail.com
EMAIL_BACKUP_TO=destino@email.com
EMAIL_BACKUP_PASSWORD=senha-de-app-gmail
```

**Como gerar senha de app do Gmail:**
1. Ative verificação em 2 etapas: https://myaccount.google.com/security
2. Gere senha de app: https://myaccount.google.com/apppasswords
3. Selecione "Email" e copie a senha gerada
4. Cole no `.env.local`

**Output:**
- Arquivo ZIP compactado com todos os backups
- Email com anexo e resumo detalhado
- Backup local mantido

---

### 2. GitHub Action - Backup Automático Diário

**Arquivo:** `.github/workflows/backup-daily.yml`

**Execução:**
- 🕐 Automático: Diariamente às 3:00 AM UTC (00:00 Brasília)
- 🖱️ Manual: Via GitHub Actions UI

**O que faz:**
1. Conecta ao Supabase
2. Faz backup de todas as tabelas
3. Commita na branch `backups/database`
4. Push para GitHub
5. Notifica sucesso/falha

**Configuração necessária (GitHub Secrets):**
```
Settings → Secrets and variables → Actions → New repository secret

VITE_SUPABASE_URL          → https://seu-projeto.supabase.co
SUPABASE_SERVICE_KEY       → eyJhbGc...seu-service-key
```

**Para visualizar no GitHub:**
```
Actions → Backup Diário do Supabase → Run workflow (manual)
```

---

### 3. Script de Restauração

#### `restore-supabase.js` - Restaurar Backup

**Uso:**
```bash
pnpm restore                    # Escolher backup manualmente
pnpm restore:latest             # Restaurar último backup
pnpm restore:dry                # Simular (não altera banco)
```

**Funcionalidades:**
- Lista backups disponíveis
- Visualiza conteúdo antes de restaurar
- Modo dry-run para testes
- Restauração seletiva (escolher tabelas)

---

## 🔐 Segurança e Boas Práticas

### Variáveis de Ambiente

**NUNCA commitar:**
- `.env`
- `.env.local`
- Qualquer arquivo com credenciais

**Sempre usar:**
- `.env.example` (template sem dados sensíveis)
- GitHub Secrets para CI/CD
- Senhas de app do Gmail (não senha principal)

### Proteção de Dados

**✅ Seguro:**
- Backups em branch Git separada
- Versionamento completo
- Histórico de mudanças
- Redundância (local + GitHub + email)

**❌ Evitar:**
- Commitar backups na branch `main`
- Backups apenas locais (ambientes efêmeros)
- Credenciais hardcoded

---

## 📊 Monitoramento

### Verificar Status do Backup

```bash
# Listar backups locais
pnpm backup:list

# Listar com detalhes
pnpm backup:list:detailed

# Comparar backups
pnpm backup:compare
```

### Verificar no GitHub

```bash
# Ver branch de backups
git checkout backups/database
git log

# Voltar para main
git checkout main
```

### Verificar GitHub Actions

```
GitHub → Actions → Backup Diário do Supabase
```

---

## 🚀 Fluxo de Trabalho Recomendado

### Desenvolvimento Local

```bash
# Fazer backup antes de mudanças importantes
pnpm backup:verbose

# Após muitas edições no Admin Console
node scripts/backup-and-commit.js
```

### Produção (Automático)

```
1. GitHub Action roda diariamente às 3 AM
2. Backup commitado em backups/database
3. Push automático para GitHub
4. (Opcional) Email enviado
```

### Recuperação de Emergência

```bash
# 1. Verificar backups disponíveis
pnpm backup:list:detailed

# 2. Simular restauração (seguro)
pnpm restore:dry

# 3. Restaurar (após confirmar)
pnpm restore:latest
```

---

## 🆘 Troubleshooting

### Backup não está funcionando

```bash
# Verificar conexão com Supabase
node scripts/backup-supabase.js --verbose

# Verificar variáveis de ambiente
cat .env.local
```

### Email não está sendo enviado

1. Verificar `EMAIL_BACKUP_ENABLED=true` no `.env.local`
2. Confirmar senha de app do Gmail (não senha normal)
3. Verificar 2FA ativado na conta Google
4. Testar manualmente: `node scripts/backup-and-email.js --verbose`

### GitHub Action falhando

1. Verificar secrets configurados no GitHub
2. Ver logs detalhados em Actions
3. Testar localmente: `node scripts/backup-and-commit.js --verbose`

---

## 📈 Estatísticas

**Tamanho típico dos backups:**
- `text_entries.json`: ~150 KB (764 registros)
- `page_history.json`: ~50 KB
- **Total**: ~200 KB por backup
- **ZIP**: ~40 KB (compactado)

**Retenção:**
- **Local**: Últimos 10 backups
- **Git**: Histórico completo (ilimitado)
- **Email**: Conforme capacidade da caixa postal

---

## 🎓 Comandos Rápidos

```bash
# Backup local simples
pnpm backup

# Backup + Git + GitHub
node scripts/backup-and-commit.js

# Backup + Email
node scripts/backup-and-email.js

# Listar backups
pnpm backup:list

# Restaurar último
pnpm restore:latest

# Ver branch de backups
git checkout backups/database
```

---

## 📚 Arquivos Relacionados

- `scripts/backup-supabase.js` - Backup local
- `scripts/backup-and-commit.js` - Backup + Git
- `scripts/backup-and-email.js` - Backup + Email
- `scripts/restore-supabase.js` - Restauração
- `scripts/list-backups.ps1` - Listar backups
- `.github/workflows/backup-daily.yml` - Automação

---

## ✅ Checklist de Configuração

### Setup Inicial

- [ ] Variáveis de ambiente configuradas no `.env.local`
- [ ] GitHub Secrets configurados (para Actions)
- [ ] Testar backup local: `pnpm backup`
- [ ] Testar backup + Git: `node scripts/backup-and-commit.js`
- [ ] (Opcional) Configurar email no `.env.local`
- [ ] (Opcional) Testar email: `node scripts/backup-and-email.js`
- [ ] Habilitar GitHub Action (se necessário)
- [ ] Verificar primeiro backup automático após 24h

### Manutenção

- [ ] Verificar backups semanalmente
- [ ] Testar restauração mensalmente
- [ ] Atualizar documentação se houver mudanças
- [ ] Monitorar falhas no GitHub Actions

---

**Última revisão:** 16/11/2025  
**Status:** Sistema completo e operacional
