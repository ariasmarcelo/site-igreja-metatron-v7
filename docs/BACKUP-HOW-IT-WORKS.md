# 🔄 Como Funciona o Backup Automático

## 📧 Email Configurado

**Destinatário:** `marcelo.arias@igrejametatron.org`

---

## 🤖 Três Formas de Disparar o Backup

### 1️⃣ Backup Automático Diário (Recomendado) ⭐

**GitHub Actions** executa automaticamente todo dia.

#### Como funciona:
```
📅 Diariamente às 3:00 AM UTC (00:00 Brasília)
     ↓
🤖 GitHub Actions inicia
     ↓
📥 Conecta ao Supabase
     ↓
💾 Faz backup de text_entries + page_history
     ↓
📦 Commita na branch backups/database
     ↓
🚀 Push para GitHub
     ↓
✅ Backup protegido na nuvem!
```

#### Arquivo responsável:
`.github/workflows/backup-daily.yml`

#### Como monitorar:
1. Acesse: https://github.com/ariasmarcelo/site-igreja-v6
2. Clique em "Actions" (topo da página)
3. Veja "Backup Diário do Supabase"
4. Histórico de execuções aparecerá lá

#### Executar manualmente:
```
GitHub → Actions → Backup Diário do Supabase → Run workflow
```

**⚠️ IMPORTANTE:** Este backup NÃO envia email (GitHub Actions roda em ambiente público)

---

### 2️⃣ Backup Manual Local com Git

Execute quando quiser fazer backup imediato e enviar para GitHub.

#### Comando:
```bash
pnpm backup:commit
```

#### O que acontece:
```
💻 Seu computador local executa
     ↓
📥 Conecta ao Supabase com .env.local
     ↓
💾 Baixa todos os dados (802 registros)
     ↓
📝 Salva JSONs localmente
     ↓
🌿 Commita em branch backups/database
     ↓
🚀 Push para GitHub
     ↓
✅ Backup versionado e na nuvem!
```

#### Quando usar:
- ✅ Antes de grandes mudanças no Admin Console
- ✅ Após adicionar muito conteúdo novo
- ✅ Antes de migrations ou alterações no banco
- ✅ Quando quiser garantia extra

**⚠️ IMPORTANTE:** Este também NÃO envia email automaticamente

---

### 3️⃣ Backup com Envio por Email 📧

Execute para receber backup por email.

#### Pré-requisitos:
1. **Configurar Gmail no `.env.local`:**
   ```env
   EMAIL_BACKUP_ENABLED=true
   EMAIL_BACKUP_FROM=seu-email@gmail.com
   EMAIL_BACKUP_TO=marcelo.arias@igrejametatron.org
   EMAIL_BACKUP_PASSWORD=sua-senha-de-app-gmail
   ```

2. **Gerar senha de app do Gmail:**
   - Acesse: https://myaccount.google.com/apppasswords
   - Selecione "Email"
   - Copie a senha gerada (16 caracteres)
   - Cole em `EMAIL_BACKUP_PASSWORD`

#### Comando:
```bash
pnpm backup:email
```

#### O que acontece:
```
💻 Seu computador local executa
     ↓
📥 Conecta ao Supabase
     ↓
💾 Baixa todos os dados
     ↓
📝 Salva JSONs localmente
     ↓
📦 Compacta em arquivo ZIP
     ↓
📧 Envia email via Gmail para marcelo.arias@igrejametatron.org
     ↓
✅ Backup na caixa postal!
```

#### Email contém:
- ✅ Arquivo ZIP com todos os dados
- ✅ Resumo: quantos registros, tamanho, data
- ✅ Lista de tabelas incluídas
- ✅ Status de cada backup

#### Quando usar:
- ✅ Para ter cópia offline extra
- ✅ Antes de eventos importantes
- ✅ Redundância adicional além do Git
- ✅ Quando precisar compartilhar dados

---

## 📊 Resumo das Opções

| Método | Frequência | Destino | Email? | Como Disparar |
|--------|-----------|---------|--------|---------------|
| **GitHub Actions** | Diário (3 AM) | GitHub | ❌ Não | Automático |
| **backup:commit** | Manual | GitHub | ❌ Não | `pnpm backup:commit` |
| **backup:email** | Manual | Email + Local | ✅ Sim | `pnpm backup:email` |

---

## 🎯 Estratégia Recomendada

### Setup Inicial (Agora):

1. **GitHub Actions** (já configurado) ✅
   - Backup diário automático
   - Sem necessidade de fazer nada
   - Monitore em GitHub → Actions

2. **Email Backup** (opcional):
   ```bash
   # Configure .env.local com seu Gmail
   # Depois teste:
   pnpm backup:email
   ```

### Uso no Dia a Dia:

- **Deixe o GitHub Actions rodar sozinho** (backup diário)
- **Use `pnpm backup:commit`** antes de grandes mudanças
- **Use `pnpm backup:email`** quando quiser cópia extra

---

## ⚙️ Configuração do Email (Passo a Passo)

### 1. Ativar Verificação em 2 Etapas no Google

```
1. Acesse: https://myaccount.google.com/security
2. Clique em "Verificação em duas etapas"
3. Siga as instruções para ativar
```

### 2. Gerar Senha de App

```
1. Acesse: https://myaccount.google.com/apppasswords
2. Selecione "Email" ou "Outro (nome personalizado)"
3. Digite "Backup Igreja Metatron"
4. Clique em "Gerar"
5. Copie a senha de 16 caracteres
```

### 3. Atualizar `.env.local`

```env
EMAIL_BACKUP_ENABLED=true
EMAIL_BACKUP_FROM=seuemail@gmail.com
EMAIL_BACKUP_TO=marcelo.arias@igrejametatron.org
EMAIL_BACKUP_PASSWORD=xxxx xxxx xxxx xxxx  # Cole aqui (sem espaços)
```

### 4. Testar

```bash
pnpm backup:email --verbose
```

**Resultado esperado:**
```
✅ Email enviado: <message-id>
📧 Para: marcelo.arias@igrejametatron.org
```

---

## 📍 Onde os Backups Ficam

### Local (Seu Computador)
```
workspace/shadcn-ui/backups/supabase/
  └── 2025-11-16T20-49-16/
      ├── text_entries.json      (291 KB)
      ├── page_history.json      (162 KB)
      └── _metadata.json         (resumo)
```

### GitHub (Nuvem)
```
Branch: backups/database
URL: https://github.com/ariasmarcelo/site-igreja-v6/tree/backups/database
```

### Email (Gmail)
```
Para: marcelo.arias@igrejametatron.org
Assunto: 🗄️ Backup Supabase - 2025-11-16 - Igreja de Metatron
Anexo: backup-igreja-metatron-2025-11-16.zip (40 KB)
```

---

## 🔔 Notificações

### GitHub Actions (Automático)

- ✅ Você receberá email do GitHub se o backup falhar
- ✅ Configure em: Settings → Notifications → Actions

### Email Manual

- ✅ Você verá resultado imediato no terminal
- ✅ Email chegará em segundos
- ✅ Verifique caixa de spam na primeira vez

---

## 🆘 Troubleshooting

### Backup automático não está rodando

```bash
# Verificar se GitHub Action está habilitada
GitHub → Actions → Enable workflows (se necessário)

# Verificar secrets configurados
GitHub → Settings → Secrets → Actions
# Deve ter: VITE_SUPABASE_URL, SUPABASE_SERVICE_KEY
```

### Email não está sendo enviado

```bash
# 1. Verificar configuração
cat .env.local | grep EMAIL

# 2. Testar com verbose
pnpm backup:email --verbose

# 3. Problemas comuns:
# - Senha normal ao invés de senha de app ❌
# - 2FA não ativado ❌
# - EMAIL_BACKUP_ENABLED=false ❌
```

### Senha de app não funciona

```
1. Certifique-se que 2FA está ATIVO
2. Gere uma NOVA senha de app
3. Cole SEM espaços no .env.local
4. Use a senha de 16 caracteres, NÃO sua senha normal
```

---

## 📅 Próxima Execução Automática

**Primeira execução:** Amanhã às 00:00 (Brasília) / 03:00 (UTC)

**Verificar execução:**
```
GitHub → Actions → Backup Diário do Supabase
```

**Forçar execução agora:**
```
GitHub → Actions → Backup Diário do Supabase → Run workflow
```

---

## ✅ Checklist Rápido

- [x] GitHub Actions configurado
- [x] Backup diário agendado (3 AM)
- [x] Email destinatário: marcelo.arias@igrejametatron.org
- [ ] Configurar Gmail (opcional)
- [ ] Testar backup por email (opcional)
- [ ] Aguardar primeiro backup automático (24h)

---

**Última atualização:** 16/11/2025  
**Email configurado:** marcelo.arias@igrejametatron.org
