# Lista de Arquivos para Remoção

## Categoria 1: Arquivos Temporários JSON (REMOVER)
- temp-contato.json
- temp-index.json
- temp-purificacao.json
- temp-quemsomos.json
- temp-testemunhos.json
- temp-tratamentos.json

## Categoria 2: Scripts One-Time Use - Root (REMOVER)
- check-instituto-data.js
- check-tratamentos-titles.cjs
- delete-tratamento-7.cjs
- fetch-tratamentos.cjs
- generate-backup.cjs
- list-tratamentos.cjs
- list-tripla-protecao.cjs
- update-tripla-to-shared.cjs

## Categoria 3: Scripts One-Time Use - scripts/ (REMOVER)
- scripts/add-treatments-description.cjs
- scripts/analyze-content.js
- scripts/check-api-shared.cjs
- scripts/check-backup-igreja.cjs
- scripts/check-data-json-keys.js
- scripts/check-igreja-data.cjs
- scripts/check-igreja-history.cjs
- scripts/check-principios-structure.js
- scripts/check-shared-duplicates.js
- scripts/check-valores.js
- scripts/create-carousel-shared-texts.cjs
- scripts/delete-orphaned-treatments.cjs
- scripts/insert-instituto-section.js
- scripts/insert-instituto-section.sql
- scripts/load-test.js
- scripts/migrate-testimonials-to-shared.cjs
- scripts/read-integrada-items.cjs
- scripts/restore-igreja-texts.cjs
- scripts/simulate-api-response.js
- scripts/test-artigos-table.js
- scripts/test-production.js
- scripts/testing/ (diretório completo)
- scripts/UPDATE_PILARES_QUEMSOMOS.sql
- scripts/verificar-hierarquia-categorias.js
- scripts/verify-db-shared.cjs
- scripts/verify-shared-testimonials.cjs

## Categoria 4: Scripts SQL One-Time - workspace/scripts/ (REMOVER)
- artigo-01-geometria-sagrada.sql até artigo-16-estudos-meditacao.sql (todos)
- check-all-keys.sql
- check-cards-quemsomos.sql
- check-constraints.sql
- check-valores-data.sql
- delete-valores-purificacao.sql
- EXECUTE-MIGRATION-SAFE.sql
- find-valores-anywhere.sql
- fix-duplicate-keys.sql
- insert-artigo-01-v2.js
- insert-artigo-01.js
- insert-artigo-01.sql
- migrate-valores-to-quemsomos.sql
- MIGRATION-PLAN.md
- migration-published-archived.sql
- restore-valores-data.sql

## Categoria 5: Servidores Obsoletos (REMOVER)
- server/ (diretório completo - 1 arquivo apenas)
- server-local/ (diretório completo - não usado mais)

## Categoria 6: Scripts PowerShell Obsoletos (REMOVER)
- start-dev-external.ps1 (duplicado)
- start-dev-local.ps1 (obsoleto)
- start-vite-simple.ps1 (obsoleto)
- force-restart-8080.ps1 (troubleshooting one-time)

## Categoria 7: Arquivos de Log/Debug (REMOVER)
- test-encoding-raw.txt
- tailwindcss-52100.log
- .ids-assigned

## Categoria 8: Documentos Obsoletos Root (REMOVER)
- DATABASE_CHANGES_PILARES.md (movido para docs/)
- EXECUTE-NO-SUPABASE.sql (one-time)
- SUPABASE-SETUP.md (movido para docs/)

## MANTER (Essenciais)
✅ api/ - APIs serverless
✅ backups/ - backups do banco
✅ docs/ - documentação atualizada
✅ public/ - assets públicos
✅ src/ - código fonte React
✅ logs/ - logs do sistema
✅ scripts/backup-supabase.js - backup essencial
✅ scripts/backup-and-commit.js - backup essencial
✅ scripts/backup-and-email.js - backup essencial
✅ scripts/restore-supabase.js - restore essencial
✅ scripts/list-backups.ps1 - listar backups
✅ scripts/fix-ids.js - manutenção
✅ start-dev.ps1 - iniciar servidor
✅ stop-dev.ps1 - parar servidor
✅ check-servers.ps1 - verificar status
✅ package.json
✅ vite.config.ts
✅ vercel.json
✅ index.html
✅ README.md
✅ COPILOT-INSTRUCTIONS.md
✅ DEPLOY-VERCEL.md
✅ DATA_JSON_KEY_NAMING_CONVENTION.md
✅ Arquivos de configuração (.env*, tsconfig*, eslint*, etc)

## Total Estimado
- ~80 arquivos para remover
- ~2-5 MB de espaço a liberar
