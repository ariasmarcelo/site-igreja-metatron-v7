-- ============================================================================
-- Migração: Permitir page_id NULL e adicionar conteúdo compartilhado
-- Data: 2025-11-13
-- 
-- INSTRUÇÕES:
-- 1. Acesse o Supabase Dashboard
-- 2. Vá em SQL Editor
-- 3. Cole e execute este SQL completo
-- 4. Depois execute: node scripts/apply-shared-content-migration.js
-- ============================================================================

-- 1. Remover constraint UNIQUE do page_id (se existir)
ALTER TABLE page_contents DROP CONSTRAINT IF EXISTS page_contents_page_id_key;

-- 2. Modificar coluna page_id para permitir NULL
ALTER TABLE page_contents ALTER COLUMN page_id DROP NOT NULL;

-- 3. Criar novo constraint: page_id deve ser UNIQUE apenas quando NOT NULL
CREATE UNIQUE INDEX IF NOT EXISTS page_contents_page_id_unique 
ON page_contents (page_id) 
WHERE page_id IS NOT NULL;

-- 4. Inserir registro compartilhado (footer global)
INSERT INTO page_contents (page_id, content)
VALUES (
  NULL,
  '{"footer": {"copyright": "© 2025 Igreja de Metatron. Todos os direitos reservados.", "trademark": "Marcas registradas® protegidas por lei."}}'::jsonb
);

-- 5. Remover footer do Index (já que agora virá do compartilhado)
UPDATE page_contents
SET content = content - 'footer'
WHERE page_id = 'index' AND content ? 'footer';

-- 6. Atualizar RLS para permitir acesso ao registro NULL
DROP POLICY IF EXISTS "Allow public read access" ON page_contents;

CREATE POLICY "Allow public read access"
  ON page_contents FOR SELECT
  TO public
  USING (true);  -- Permite ler TODOS os registros, incluindo NULL

-- ============================================================================
-- Verificação final
-- ============================================================================
SELECT 
  COALESCE(page_id, '🌐 COMPARTILHADO') as pagina,
  CASE 
    WHEN content ? 'footer' THEN '✅ TEM footer' 
    ELSE '❌ SEM footer' 
  END as status,
  CASE 
    WHEN content ? 'header' THEN '✅ TEM conteúdo'
    ELSE '⚠️  SÓ footer'
  END as conteudo
FROM page_contents
ORDER BY page_id NULLS FIRST;
