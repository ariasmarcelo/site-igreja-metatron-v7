# start-vite-simple.ps1
# Inicia apenas Vite (sem Vercel Dev) com proxy para APIs locais
# Mais estável e sem timeouts aleatórios

$WorkDir = "c:\temp\Site_Igreja_Meta\site-igreja-v6\workspace\shadcn-ui"

Write-Host "=== Iniciando Vite Dev (Simples) ===" -ForegroundColor Cyan
Write-Host ""

Set-Location $WorkDir

Write-Host "[1/2] Limpando processos Node..." -ForegroundColor Yellow
taskkill /F /IM node.exe /T 2>$null | Out-Null
Start-Sleep -Seconds 2
Write-Host "  Processos encerrados" -ForegroundColor Green

Write-Host ""
Write-Host "[2/2] Iniciando Vite Dev Server..." -ForegroundColor Yellow
Write-Host "  Frontend + API Plugin" -ForegroundColor DarkGray
Write-Host "  Aguardando inicializacao..." -ForegroundColor DarkGray
Write-Host ""

# Criar diretorio de logs se nao existir
if (!(Test-Path "logs")) { New-Item -ItemType Directory -Path "logs" | Out-Null }

# Iniciar Vite em nova janela
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$WorkDir'; `$OutputEncoding = [System.Text.Encoding]::UTF8; [Console]::OutputEncoding = [System.Text.Encoding]::UTF8; pnpm run dev" -WorkingDirectory $WorkDir
Start-Sleep -Seconds 8

Write-Host "=== Verificando Status ===" -ForegroundColor Cyan
Write-Host ""

# Verificar em qual porta o Vite iniciou (geralmente 3000 ou 5173)
$port = $null
foreach ($p in @(3000, 5173, 5174)) {
    $check = netstat -ano | findstr ":$p" | Select-Object -First 1
    if ($check) {
        $port = $p
        break
    }
}

if ($port) {
    Write-Host "OK Vite Dev: http://localhost:$port" -ForegroundColor Green
    Write-Host "OK APIs: http://localhost:$port/api/*" -ForegroundColor Green
    Write-Host ""
    Write-Host "Ambiente LOCAL funcionando na porta $port!" -ForegroundColor Cyan
} else {
    Write-Host "ERRO Vite Dev nao iniciou" -ForegroundColor Red
}

Write-Host ""
Write-Host ""
