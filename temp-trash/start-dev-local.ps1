# start-dev-local.ps1
# Inicia ambiente de desenvolvimento local com Vite + Express (server-local)

$WorkDir = "c:\temp\Site_Igreja_Meta\site-igreja-v6\workspace\shadcn-ui"

Write-Host "=== Iniciando Ambiente Local ===" -ForegroundColor Cyan
Write-Host ""

Set-Location $WorkDir

Write-Host "[1/3] Limpando processos Node..." -ForegroundColor Yellow
taskkill /F /IM node.exe /T 2>$null | Out-Null
Start-Sleep -Seconds 2
Write-Host "  Processos encerrados" -ForegroundColor Green

Write-Host ""
Write-Host "[2/3] Iniciando Express API Server (porta 3001)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$WorkDir\server-local'; node server.js" -WorkingDirectory "$WorkDir\server-local"
Start-Sleep -Seconds 3

Write-Host ""
Write-Host "[3/3] Iniciando Vite Frontend (porta 3000)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$WorkDir'; pnpm dev" -WorkingDirectory $WorkDir
Start-Sleep -Seconds 5

Write-Host ""
Write-Host "=== Verificando Status ===" -ForegroundColor Cyan
Write-Host ""

$port3000 = netstat -ano | findstr ":3000" | Select-Object -First 1
$port3001 = netstat -ano | findstr ":3001" | Select-Object -First 1

if ($port3000) {
    Write-Host "OK Vite Frontend: http://192.168.1.5:3000" -ForegroundColor Green
} else {
    Write-Host "ERRO: Vite não iniciou na porta 3000" -ForegroundColor Red
}

if ($port3001) {
    Write-Host "OK Express API: http://localhost:3001/api/*" -ForegroundColor Green
} else {
    Write-Host "ERRO: Express não iniciou na porta 3001" -ForegroundColor Red
}

Write-Host ""
Write-Host "Ambiente LOCAL funcionando!" -ForegroundColor Cyan
Write-Host ""
Write-Host "Frontend: http://192.168.1.5:3000" -ForegroundColor White
Write-Host "APIs: http://localhost:3001/api/*" -ForegroundColor White
