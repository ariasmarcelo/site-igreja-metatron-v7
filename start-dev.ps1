# Start Development Server
# Uso: .\start-dev.ps1

Write-Host "=== Iniciando Servidor de Desenvolvimento ===" -ForegroundColor Cyan
Write-Host ""

$WorkDir = $PSScriptRoot

# Matar processos node existentes (limpar portas)
Write-Host "Limpando portas..." -ForegroundColor Yellow
Get-Process | Where-Object { $_.ProcessName -eq "node" } | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2

# Verificar se node_modules existe
if (!(Test-Path "$WorkDir\node_modules")) {
    Write-Host "node_modules nao encontrado. Instalando dependencias..." -ForegroundColor Yellow
    Set-Location $WorkDir
    npm install
    Write-Host ""
}

# Iniciar Vite
Write-Host "Iniciando Vite Dev Server..." -ForegroundColor Green
Write-Host "Acesse: http://localhost:3000" -ForegroundColor Cyan
Write-Host ""

Set-Location $WorkDir
npm run dev
