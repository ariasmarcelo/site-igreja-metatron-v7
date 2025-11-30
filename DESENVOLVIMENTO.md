# Guia Rápido de Desenvolvimento

## 🚀 Iniciar Desenvolvimento

### Opção 1: Comando direto (Recomendado)
```powershell
npm run dev
```

### Opção 2: Script PowerShell
```powershell
.\start-dev.ps1
```

O servidor vai iniciar automaticamente na primeira porta disponível (geralmente 3000 ou 3001).

## 🛑 Parar Servidor

### Opção 1: No terminal do servidor
Pressione `Ctrl + C`

### Opção 2: Script PowerShell
```powershell
.\stop-dev.ps1
```

## 📊 Verificar Status

```powershell
.\check-servers.ps1
```

Mostra quais portas estão em uso e processos Node rodando.

## 📦 Instalar/Atualizar Dependências

```powershell
npm install
```

**IMPORTANTE**: Use `npm` ao invés de `pnpm` para evitar erros de symlinks no Windows.

## 🚢 Deploy para Produção

```powershell
# Fazer commit das alterações
git add .
git commit -m "feat: sua mensagem"
git push

# Deploy é automático via GitHub → Vercel
# OU force deploy manual:
npm run deploy
```

## 📝 Scripts Disponíveis

```powershell
npm run dev              # Iniciar servidor local
npm run build            # Build para produção
npm run preview          # Preview do build
npm run lint             # Verificar código
npm run deploy           # Deploy manual para Vercel

# Backup do Supabase
npm run backup           # Backup simples
npm run backup:verbose   # Backup com detalhes
npm run backup:commit    # Backup + commit automático
```

## 🔧 Solução de Problemas

### Porta em uso
```powershell
.\stop-dev.ps1
npm run dev
```

### Erro "vite not found"
```powershell
npm install
npm run dev
```

### node_modules corrompido
```powershell
Remove-Item -Recurse -Force node_modules
npm install
```

## 🌐 URLs

- **Local**: http://localhost:3000 (ou 3001)
- **Produção**: https://shadcn-ui-silk-sigma.vercel.app
- **GitHub**: https://github.com/ariasmarcelo/site-igreja-metatron-v7
- **Vercel Dashboard**: https://vercel.com/marcelo-arias-projects-172831c7/shadcn-ui

## ⚠️ NÃO USE

- ❌ `vercel dev` - causa timeout (use `npm run dev`)
- ❌ `pnpm install` - causa erros de symlink no Windows (use `npm install`)
- ❌ Scripts antigos com caminhos do v6 (já foram atualizados)
