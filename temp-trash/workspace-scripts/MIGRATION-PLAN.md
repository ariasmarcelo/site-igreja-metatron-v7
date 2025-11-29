# PLANO DE MIGRAÇÃO - text_entries Database Cleanup

**Data:** 17/11/2025  
**Status:** ANÁLISE COMPLETA - AGUARDANDO APROVAÇÃO PARA EXECUÇÃO

---

## 📊 DIAGNÓSTICO ATUAL

### Estatísticas Gerais
- **Total de entradas:** 837
- **Entradas `__shared__`:** 3 ✅ (CORRETAS - não mexer)
- **Entradas de páginas:** 834
  - **Com prefixo duplicado:** 805 (96%)
  - **Sem prefixo (corretas):** 29 (4%)
  - **Conflitos diretos:** 28 (mesma key com e sem prefixo)

### Problema Identificado
Entradas com `json_key` contendo prefixo duplicado do `page_id`:

❌ **INCORRETO:**
```sql
page_id = 'quemsomos'
json_key = 'quemsomos.header.title'  -- Prefixo duplicado!
```

✅ **CORRETO:**
```sql
page_id = 'quemsomos'
json_key = 'header.title'  -- Sem prefixo
```

### Páginas Afetadas
```
artigo-detalhes:    5 entradas (100% com prefixo)
artigos:          135 entradas (100% com prefixo)
contato:           44 entradas (100% com prefixo)
index:             90 entradas (99% com prefixo, 1 sem)
Index:            128 entradas (100% com prefixo) ⚠️ DUPLICAÇÃO DE CASE
notfound:           5 entradas (100% com prefixo)
purificacao:      124 entradas (80% com prefixo, 20% sem)
quemsomos:        106 entradas (97% com prefixo, 3% sem)
test:               1 entrada (100% com prefixo)
testemunhos:       58 entradas (100% com prefixo)
Testemunhos:       58 entradas (100% com prefixo) ⚠️ DUPLICAÇÃO DE CASE
tratamentos:       80 entradas (100% com prefixo)
```

### Problemas Adicionais
1. **Duplicação de case:** `index` vs `Index`, `testemunhos` vs `Testemunhos`
2. **Conflitos diretos:** 28 entradas onde existem AMBAS as versões (com e sem prefixo)

---

## 🎯 ESTRATÉGIA DE MIGRAÇÃO

### Princípios
1. **SEGURANÇA PRIMEIRO:** Backup completo antes de qualquer ação
2. **ZERO PERDA DE DADOS:** Preservar versões mais recentes
3. **ATOMICIDADE:** Executar em transação única
4. **VALIDAÇÃO:** Conferir contagem antes e depois

### Regras de Migração

#### 1. Conteúdo `__shared__`
- ✅ **NÃO MEXER** - Está correto (3 entradas)

#### 2. Normalização de Case (páginas duplicadas)
- `Index` → `index` (renomear `page_id`)
- `Testemunhos` → `testemunhos` (renomear `page_id`)

#### 3. Remoção de Prefixo Duplicado
- Remover `{page_id}.` do início de `json_key`
- Exemplo: `quemsomos.header.title` → `header.title`

#### 4. Resolução de Conflitos (28 casos)
Quando existir AMBAS as versões (com e sem prefixo):
- **Manter:** Versão SEM prefixo (geralmente mais recente e correta)
- **Deletar:** Versão COM prefixo (obsoleta)
- **Exceção:** Se versão com prefixo for mais recente, migrar conteúdo antes de deletar

---

## 📋 ETAPAS DE EXECUÇÃO

### ETAPA 1: Backup Completo
```sql
-- Criar tabela de backup
CREATE TABLE text_entries_backup_20251117 AS 
SELECT * FROM text_entries;

-- Verificar backup
SELECT COUNT(*) FROM text_entries_backup_20251117;
-- Esperado: 837 entradas
```

### ETAPA 2: Normalizar Case de Páginas
```sql
-- Consolidar Index → index
UPDATE text_entries 
SET page_id = 'index'
WHERE page_id = 'Index';

-- Consolidar Testemunhos → testemunhos
UPDATE text_entries 
SET page_id = 'testemunhos'
WHERE page_id = 'Testemunhos';
```

### ETAPA 3: Resolver Conflitos (28 casos)
Para cada conflito, verificar qual versão manter:
```sql
-- Verificar conflitos
SELECT 
  page_id,
  json_key,
  updated_at,
  LEFT(content::text, 60) as preview
FROM text_entries
WHERE page_id = 'quemsomos'
  AND json_key IN ('header.title', 'quemsomos.header.title')
ORDER BY json_key;

-- Se versão COM prefixo for mais recente, atualizar a SEM prefixo
-- (verificar caso a caso nos 28 conflitos)
```

### ETAPA 4: Remover Prefixo das Entradas Restantes
```sql
-- Para entradas que NÃO têm conflito, apenas remover prefixo
UPDATE text_entries
SET json_key = SUBSTRING(json_key FROM LENGTH(page_id) + 2)
WHERE 
  page_id != '__shared__'
  AND json_key LIKE page_id || '.%'
  AND NOT EXISTS (
    SELECT 1 FROM text_entries t2
    WHERE t2.page_id = text_entries.page_id
      AND t2.json_key = SUBSTRING(text_entries.json_key FROM LENGTH(text_entries.page_id) + 2)
      AND t2.id != text_entries.id
  );
```

### ETAPA 5: Deletar Entradas Duplicadas com Prefixo
```sql
-- Deletar apenas as que TÊM conflito (versão com prefixo obsoleta)
DELETE FROM text_entries
WHERE 
  page_id != '__shared__'
  AND json_key LIKE page_id || '.%';
```

### ETAPA 6: Validação Final
```sql
-- Verificar que não há mais prefixos duplicados
SELECT COUNT(*) as ainda_com_prefixo
FROM text_entries
WHERE page_id != '__shared__'
  AND json_key LIKE page_id || '.%';
-- Esperado: 0

-- Verificar total de entradas
SELECT COUNT(*) FROM text_entries;
-- Esperado: 837 (ou menos se houver consolidação de duplicatas)

-- Verificar por página
SELECT page_id, COUNT(*) as total
FROM text_entries
GROUP BY page_id
ORDER BY page_id;
```

---

## ⚠️ RISCOS E MITIGAÇÕES

### Risco 1: Perda de dados
**Mitigação:** Backup completo antes de iniciar

### Risco 2: Conflitos não identificados
**Mitigação:** Script de análise completa antes da migração

### Risco 3: Erro durante execução
**Mitigação:** Usar transação SQL (BEGIN/COMMIT/ROLLBACK)

### Risco 4: Inconsistência no constraint UNIQUE
**Mitigação:** Resolver conflitos antes de atualizar json_key

---

## 🔄 ROLLBACK

Caso algo dê errado:
```sql
-- Restaurar da backup
DELETE FROM text_entries;
INSERT INTO text_entries SELECT * FROM text_entries_backup_20251117;
```

---

## ✅ CRITÉRIOS DE SUCESSO

1. ✅ Zero entradas perdidas
2. ✅ Nenhuma entrada com prefixo duplicado (exceto `__shared__`)
3. ✅ Todos os conflitos resolvidos
4. ✅ Case normalizado (sem `Index` ou `Testemunhos` maiúsculas)
5. ✅ Sistema de edição funcionando corretamente

---

## 📝 PRÓXIMOS PASSOS

**AGUARDANDO APROVAÇÃO DO USUÁRIO PARA:**
1. Criar backup completo SQL
2. Gerar script de migração detalhado
3. Executar migração em ambiente de teste (se disponível)
4. Executar migração em produção

**⚠️ NÃO EXECUTAR NADA SEM CONFIRMAÇÃO EXPLÍCITA!**
