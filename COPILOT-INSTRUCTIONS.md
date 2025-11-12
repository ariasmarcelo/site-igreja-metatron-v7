# SEÇÃO PÉTREA #

Neste documento, criado pelo usuário, existem seções chamadas PÉTREAS, as quais não podem ser removidas ou modificadas. Elas devem ser respeitadas até o ponto em que você pergunte ao usuário se aquilo pode ser quebrado em algum contexto atual ou futuro.

Este documento deve ser lido, compreendido e atualizado durante o trabalho com informações de ordem estrutural sobre o projeto e o estado atual do desenvolvimento, como: Em que ponto se está na modificação ou implementação em curso. Desta forma, até que se estabilize uma versão, estes textos de status devem estar na seção "STATUS INTERNO", mais ao final deste documento.

## Propósito ##

Desenvolver site institucional para a Igreja de Metatron, que se descreve em seu conteúdo, junto de um sistema de edição dinâmica de todos os textos e formatos CSS. Para isso, esses dados ficam em banco de dados e são acessíveis por um sistema de edição destes dados que precisa ser encontrado e compreendido. Este sistema, da forma como hoje foi implementado, é uma interface gráfica React que abre em si a página a editar e permite acessar e atualizar os dados editáveis (JSONs e CSSs). Eu queria um editor que me permitisse modificar blocos gráficos e dimensões e propriedades de TODOS os elementos de conteúdo. Mas isso daria muito trabalho e custaria MUITO do pouco tempo que temos.

O que buscamos expressar e esclarecer no conteúdo do site é que compreendemos que não pode haver cura e realização espiritual final e completa enquanto, em primeiro lugar, não houver regulação completa homeostática e equilíbrio dinâmico e harmônico do sistema nervoso autônomo. Isso ocorre porque, tendo o indivíduo passado por experiências muito traumatizantes, o sistema de defesa do corpo se ativa de forma excessivamente intensa e crônica; assim, fechando canais de informação entre as partes internas de si e fixando formas socialmente e espiritualmente disfuncionais, de ser e estar a cada momento. Reverter essa situação, para que então possa haver avanço espiritual real, é o foco e objetivo principal do trabalho da Igreja de Metatron. A partir disso, o site deve expressar os conceitos e práticas que levem a esta regulação, que é a base para qualquer avanço espiritual verdadeiro e duradouro.

## FIM Propósito ##

## Instruções Gerais ##

> **Visualizar site e ler TODO o conteúdo atual do site de Frontend para melhor compreensão de seus propósitos humanos e do que pode ser melhorado nos textos.**

> **Sempre que iniciar uma sessão, leia este documento por completo.**

> **Leia e compreenda todos os documentos (.md) deste pacote.**

> **Sempre sugerir melhorias para o conteúdo dos textos do site. Mas NUNCA modificar os textos do site sem consultar o editor, o usuário.**

> **Sempre avalie todo o conteúdo deste documento de forma a melhorá-lo, mas sem adicionar conteúdo irrelevante.**

> **Sempre que aprender algo novo, atualize este documento com as novas informações.**

> **Nunca liste documentos ou instruções HARDCODED neste documento. Oriente conceitualmente sobre o que e onde procurar a informação dentro do pacote físico real. Isso inclui, mas não se limita a, nomes de arquivos, caminhos de diretórios e estruturas de pastas.**

> **Encontre todos os scripts de automação existentes, analise suas funções e mantenha-os em mente para quando for necessário usá-los.**

> **Com seu contexto interno restaurado, faça: "Escreva um resumo para o usuário sobre o projeto, stack tecnológica, últimas mudanças importantes e estado atual do desenvolvimento."**

> **Sempre que possível, sugira melhorias para os scripts de automação existentes.**

> **Sempre que iniciar uma sessão, releia todos os backups dos arquivos do projeto por completo. Isto serve para que suas novas ações possam compreender melhor o histórico e a direção em que tudo evoluiu.**

> **Escreva sempre backups de todos os arquivos locais modificados, especialmente quando forem de conteúdo proprietário deste pacote. Mantenha cinco versões anteriores em histórico. Caso algo dê errado, possamos restaurar uma versão anterior do arquivo.**

> **Nunca remova ou modifique as seções PÉTREAS deste documento. Sempre pergunte ao usuário se pode quebrar alguma delas, em algum contexto atual ou futuro.**

> **Ao escrever código, sempre siga as boas práticas de desenvolvimento, incluindo: código limpo, modularidade, comentários claros e consistentes, tratamento de erros adequado e completo e testes quando aplicável.**

> **Quando for atualizar um documento deste projeto, seja qual for, releia integralmente o documento a ser modificado e o reescreva todo do zero para evitar incoerências e duplicidades. Sempre mantenha o melhor estilo de escrita.**

> **Mantenha sempre atualizado o bloco "DADOS BÁSICOS GERAIS" mais abaixo neste documento.**

> **Sempre que possível, escreva testes automatizados para o código que você escrever.**

> **Sempre que possível, utilize e recomende o uso de boas práticas de segurança, incluindo, mas não se limitando a: validação e sanitização de entradas, uso de HTTPS, autenticação e autorização adequadas, proteção contra ataques comuns (XSS, CSRF, SQL Injection), gerenciamento seguro de senhas e dados sensíveis, atualizações regulares de dependências e bibliotecas, monitoramento e logging de atividades suspeitas.**

> **Sempre que possível, escreva documentação clara e concisa para o código que você escrever, incluindo comentários no código, documentação de API, guias de uso e exemplos práticos.**

> **Sempre que possível, escreva código otimizado para desempenho e escalabilidade, considerando aspectos como complexidade algorítmica, uso eficiente de recursos, cacheamento, balanceamento de carga e arquitetura escalável.**

> **Seja extremamente criterioso ao revisar o código existente, procurando por bugs, vulnerabilidades de segurança, ineficiências e oportunidades de melhoria. Sempre sugira melhorias quando encontrar algo que possa ser aprimorado.**

> **Seja extremamente criterioso ao analisar causalidades, não permitindo passar incoerências nos comportamentos do sistema. Sempre que encontrar algo incoerente, questione o usuário sobre o que fazer a respeito.**

> **Sempre corrija erros de digitação em todos os documentos deste pacote.**

> **Nunca use abreviações informais ou gírias em documentos técnicos. Sempre escreva de forma clara, formal e profissional.**

> **Nunca use nomes "padrão" destes ambientes, mas use nomes DESCRITIVOS do que aquilo faz para alguém que não conheça os tais padrões, do tipo: "dev", "server" e essas coisas.**

> **Devemos SEMPRE buscar soluções definitivas e duradouras para os problemas, evitando "gambiarras" ou soluções temporárias que possam comprometer a qualidade e a manutenção do código a longo prazo.**

> **SEMPRE verifique o caminho do comando que deseja executar e USE esse caminho para a execução.**

> **Para que possamos iniciar e matar o servidor web local de desenvolvimento corretamente, SEMPRE use os scripts de automação existentes. Nunca inicie ou pare o servidor manualmente. Faça com que esses scripts lancem o servidor em background.**

## FIM Instruções Gerais ##

# FIM DA SEÇÃO PÉTREA #

---

## 🔑 SCRIPTS CRÍTICOS: Fix de IDs Únicos (NÃO REMOVER)

**⚠️ IMPORTANTE - Scripts essenciais para manutenção do sistema de edição:**

### `scripts/fix-ids.js`
- **Função:** Revisar e corrigir atribuição de IDs únicos em TODAS as páginas editáveis
- **Uso:** Garantir que cada elemento tenha um identificador único para o sistema de edição
- **Quando usar:** Após adicionar novos elementos editáveis ou modificar estrutura de páginas

### `scripts/fix-all-json-keys.cjs`
- **Função:** Revisar e padronizar keys JSON em TODAS as páginas
- **Uso:** Garantir convenção de nomenclatura consistente nos dados
- **Importante:** Mantém integridade da estrutura de dados do Supabase

### `scripts/fix-index-json-keys.cjs`
- **Função:** Revisar e corrigir keys JSON especificamente da página index
- **Uso:** Validação e correção focada na página principal
- **Importante:** Página index é a mais complexa e requer verificação dedicada

**📝 NOTA:** Estes scripts são ferramentas de manutenção essenciais. Sem IDs únicos e consistentes, o Admin Console não consegue mapear edições corretamente para o banco de dados. **NUNCA remover estes arquivos.**

---

# DADOS BÁSICOS GERAIS #

**Última atualização:** 12 de novembro de 2025

**Versão do projeto:** site-igreja-v6

**Repositório:** ariasmarcelo/site-igreja-v5

**Status:** ✅ Funcional - Otimizações de Performance Aplicadas

**Produção:** https://shadcn-ui-seven-olive.vercel.app

**Stack:** Vite 7.2 + React 19 + TypeScript 5.7 + Tailwind CSS 4 + Supabase PostgreSQL + Vercel Serverless

# FIM DADOS BÁSICOS GERAIS #

---

# STATUS INTERNO #

## ✅ Otimizações de Performance - 12/11/2025

**Commit:** `5d08039` - "perf: otimizações de performance e developer experience"

### Melhorias Implementadas:

**Performance:**
- ✅ Lazy loading do AdminConsole com React.lazy + Suspense
- ✅ Navigation memoizado com React.memo para evitar re-renders
- ✅ Console.logs comentados em produção (hooks e contexts)
- ✅ Vite config otimizado com manual chunks por vendor (7 chunks separados)
- ✅ Classes Tailwind padronizadas (min-w-40, z-10000)

**Developer Experience:**
- ✅ API config flexível (`.env.local.example` criado)
- ✅ Novo comando: `pnpm check` (verifica servidores rodando)
- ✅ Script `check-servers.ps1` para status de dev servers
- ✅ Backups completos em `backups/optimization-2025-11-12-103924/`

**Resultados de Build:**
- Bundle dividido em 7 chunks otimizados:
  - `react-vendor` (44KB) - React core separado
  - `AdminConsole` (73KB) - Lazy loaded
  - `ui-vendor` (98KB) - Radix UI isolado
  - `supabase` (157KB) - Cliente Supabase separado
  - `editor-vendor` (373KB) - TipTap editor isolado
- Build time: 10.55s
- Bundle otimizado para cache e carregamento incremental

**Documentação:**
- `OPTIMIZATION-SUMMARY.md` criado com métricas completas
- `.env.local.example` para configuração local

---

## ✅ Migração Vercel Completa - 11/11/2025

### Decisão Arquitetural

- ❌ Removido: GitHub Pages (não suporta serverless functions)
- ❌ Removido: Express server (duplicação funcional)
- ✅ Adotado: **Vercel 100%** para desenvolvimento e produção

### Ambiente de Desenvolvimento

**UM ÚNICO SERVIDOR HTTP na porta 8080:**

- Comando: `pnpm start` (executa `start-dev.ps1` em background)
- Verificar: `pnpm check` (executa `check-servers.ps1`)
- Parar: `pnpm stop` (executa `stop-dev.ps1`)
- Reiniciar: `pnpm restart`
- Frontend: http://localhost:8080/
- APIs: http://localhost:8080/api/*
- Admin Console: http://localhost:8080/436F6E736F6C45

**Paridade Dev/Prod = 100%:**
- Mesmas serverless functions em desenvolvimento e produção
- Mesmo comportamento de roteamento
- Mesmas variáveis de ambiente (`.env.local`)

### Scripts Disponíveis

```bash
pnpm start     # Inicia Vite Dev (porta 8080, background)
pnpm stop      # Para Vite Dev
pnpm check     # Verifica status dos servidores
pnpm restart   # Reinicia Vite Dev
pnpm deploy    # Deploy para Vercel produção
```

### Configuração Limpa

- `vercel.json`: Minimalista (apenas configuração de functions)
- `package.json`: Script "dev" = "vite" (evita recursão no Vercel Dev)
- `.vercel/`: Linkado ao projeto correto (shadcn-ui)
- Yarn instalado globalmente (requerido pelo Vercel CLI)

### Commits Importantes

- `5d08039`: Otimizações de performance e DX
- `95b7b7d`: Documentação atualizada
- `79bef96`: Configuração limpa Vercel Dev
- `baa2240`: Remoção Express server
- `ea4efe7`: Migração 100% Vercel
- `pre-vercel-migration` (tag): Backup antes da migração

### Fluxo de Dados

**ÚNICA FONTE DE DADOS:** Supabase PostgreSQL

- Todas as páginas, conteúdos e estilos estão no Supabase
- Admin Console faz CRUD direto no Supabase via APIs serverless
- Frontend consome dados do Supabase via APIs serverless

---

## 🔧 Correção API save-visual-edits - 11/11/2025

**PROBLEMA RESOLVIDO:**
- API `save-visual-edits.js` tinha lógica incorreta de mapeamento de dados
- Incompatibilidade entre formato do frontend vs API
- Erro de constraint no banco (usava `upsert` errado)

**CORREÇÕES APLICADAS:**
1. ✅ Formato aceito: `{ pageId, edits: { elementId: { newText } } }`
2. ✅ Mapeamento: "hero-title" → content.hero.title
3. ✅ Substituído `upsert()` por `update().eq('page_id', pageId)`
4. ✅ Cópia profunda: `JSON.parse(JSON.stringify(content))`
5. ✅ Logs detalhados para debug
6. ✅ Validação de linhas afetadas

**TESTES CONFIRMADOS:**
- ✅ Edição única salva e recuperada
- ✅ Múltiplas edições simultâneas OK
- ✅ Persistência confirmada via GET API
- ✅ Tempo real verificado com timestamps

# FIM STATUS INTERNO #
