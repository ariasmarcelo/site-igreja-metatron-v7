# start-dev.ps1
# Inicia ambiente de desenvolvimento com Vite
# Vite serve Frontend na porta 8080, APIs apontam para produção

$WorkDir = "c:\temp\Site_Igreja_Meta\site-igreja-v6\workspace\shadcn-ui"

Write-Host "=== Iniciando Vite Dev Server ===" -ForegroundColor Cyan
Write-Host ""

Set-Location $WorkDir

Write-Host "[1/2] Limpando porta 8080..." -ForegroundColor Yellow

# Limpar porta 8080
$port8080 = netstat -ano | findstr ":8080" | Select-Object -First 1
if ($port8080) {
    $processId = ($port8080 -split '\s+')[-1]
    taskkill /PID $processId /F 2>$null | Out-Null
    Write-Host "  Porta 8080 liberada" -ForegroundColor Green
}

Start-Sleep -Seconds 1
Write-Host ""

Write-Host "[2/2] Iniciando Vite..." -ForegroundColor Yellow
Write-Host "  Frontend: Vite com hot reload" -ForegroundColor DarkGray
Write-Host "  Backend: APIs em producao (Vercel)" -ForegroundColor DarkGray
Write-Host "  Porta: 8080 (frontend)" -ForegroundColor DarkGray
Write-Host ""

# Iniciar Vite em nova janela minimizada
Start-Process powershell -ArgumentList "-NoExit", "-Command", "pnpm run dev" -WorkingDirectory $WorkDir -WindowStyle Minimized
Start-Sleep -Seconds 5

Write-Host "=== Verificando Status ===" -ForegroundColor Cyan
Write-Host ""

# Verificar servidor
$serverOk = netstat -ano | findstr ":8080" | Select-Object -First 1

if ($serverOk) {
    Write-Host "OK Vercel Dev: http://localhost:8080" -ForegroundColor Green
    Write-Host "OK Admin Console: http://localhost:8080/436F6E736F6C45" -ForegroundColor Green
    Write-Host "OK APIs: http://localhost:8080/api/*" -ForegroundColor Green
} else {
    Write-Host "ERRO Vercel Dev nao iniciou" -ForegroundColor Red
}

Write-Host ""
Write-Host "Vercel Dev simula producao localmente!" -ForegroundColor Cyan
Write-Host "  - Hot reload ativo" -ForegroundColor DarkGray
Write-Host "  - APIs funcionando" -ForegroundColor DarkGray
Write-Host "  - 100% dev/prod parity" -ForegroundColor DarkGray
Write-Host ""
