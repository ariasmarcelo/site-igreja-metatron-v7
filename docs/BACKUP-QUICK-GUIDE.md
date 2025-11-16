# 🚀 Guia Rápido - Sistema de Backup

## ⚡ Comandos Essenciais

### Backup Local (Manual)
```bash
pnpm backup              # Backup simples
pnpm backup:verbose      # Com detalhes
```

### Backup + Git + GitHub (Recomendado)
```bash
pnpm backup:commit       # Backup versionado no Git
```

### Backup + Email (Redundância Extra)
```bash
pnpm backup:email        # Backup via email (Gmail)
```

### Listar Backups
```bash
pnpm backup:list         # Lista simples
pnpm backup:list:detailed # Com detalhes completos
```

### Restaurar
```bash
pnpm restore             # Escolher backup
pnpm restore:latest      # Restaurar último
pnpm restore:dry         # Simular (não altera)
```

---

## 📋 Setup Inicial (5 minutos)

### 1. Configurar Variáveis de Ambiente
```bash
# Já estão configuradas no .env.local
# ✅ VITE_SUPABASE_URL
# ✅ SUPABASE_SERVICE_KEY
```

### 2. (Opcional) Configurar Email
```bash
# Adicione ao .env.local:
EMAIL_BACKUP_ENABLED=true
EMAIL_BACKUP_FROM=seu-email@gmail.com
EMAIL_BACKUP_TO=destino@email.com
EMAIL_BACKUP_PASSWORD=senha-app-gmail
```

### 3. Testar Backup
```bash
pnpm backup:verbose
# Deve mostrar: ✅ 802 registros salvos
```

### 4. GitHub Secrets (para backup automático)
```
GitHub → Settings → Secrets → Actions → New secret

Nome: VITE_SUPABASE_URL
Valor: https://seu-projeto.supabase.co

Nome: SUPABASE_SERVICE_KEY
Valor: sua_service_key
```

---

## 🤖 Backup Automático

### GitHub Actions (Configurado)
- ✅ Roda diariamente às 3 AM UTC (00:00 Brasília)
- ✅ Commita na branch `backups/database`
- ✅ Push automático para GitHub

### Executar Manualmente
```
GitHub → Actions → Backup Diário do Supabase → Run workflow
```

---

## 🆘 Emergência - Recuperar Dados

### Cenário 1: Dados deletados acidentalmente
```bash
# 1. Ver backups disponíveis
pnpm backup:list:detailed

# 2. Simular restauração (seguro)
pnpm restore:dry

# 3. Restaurar último backup
pnpm restore:latest
```

### Cenário 2: Supabase inacessível
```bash
# 1. Acessar branch de backups
git checkout backups/database

# 2. Ver arquivos JSON
cd backups/supabase
ls -la

# 3. Copiar JSONs manualmente ou usar script restore
```

### Cenário 3: Perdeu tudo (GitHub ainda existe)
```bash
# 1. Clonar repositório novamente
git clone https://github.com/ariasmarcelo/site-igreja-v6.git

# 2. Acessar branch de backups
cd site-igreja-v6/workspace/shadcn-ui
git checkout backups/database

# 3. Restaurar
pnpm install
pnpm restore:latest
```

---

## 📊 Status Atual

```bash
✅ Backup local funcionando
✅ Backup + Git implementado
✅ Backup + Email implementado
✅ GitHub Action configurada
✅ 802 registros protegidos
   - 777 text_entries
   - 25 page_history
✅ Documentação completa
```

---

## 💡 Dicas

### Quando fazer backup manual?
- Antes de edições importantes no Admin Console
- Antes de migrations no banco
- Após adicionar muito conteúdo novo
- Antes de testes arriscados

### Verificar backups funcionando?
```bash
# Ver branch de backups
git checkout backups/database
git log --oneline

# Voltar para main
git checkout main
```

### Problema com email?
```bash
# Testar com verbose
node scripts/backup-and-email.js --verbose

# Verificar senha de app (não senha normal!)
# https://myaccount.google.com/apppasswords
```

---

## 📚 Documentação Completa

Ver: `docs/BACKUP-SYSTEM.md`

---

**Última atualização:** 16/11/2025
