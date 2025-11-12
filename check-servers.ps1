# check-servers.ps1
# Verifica status dos servidores de desenvolvimento

Write-Host "=== Verificando Servidores de Desenvolvimento ===" -ForegroundColor Cyan
Write-Host ""

# Verificar porta 8080 (Vite Dev Server)
$port8080 = netstat -ano | findstr ":8080" | Select-Object -First 1

if ($port8080) {
    $processId = ($port8080 -split '\s+')[-1]
    $process = Get-Process -Id $processId -ErrorAction SilentlyContinue
    
    Write-Host "✅ Vite Dev Server: RODANDO" -ForegroundColor Green
    Write-Host "   Porta: 8080" -ForegroundColor DarkGray
    Write-Host "   PID: $processId" -ForegroundColor DarkGray
    if ($process) {
        Write-Host "   Processo: $($process.ProcessName)" -ForegroundColor DarkGray
    }
    Write-Host "   URL: http://localhost:8080" -ForegroundColor DarkGray
    Write-Host "   Admin Console: http://localhost:8080/436F6E736F6C45" -ForegroundColor DarkGray
} else {
    Write-Host "❌ Vite Dev Server: PARADO" -ForegroundColor Red
    Write-Host "   Execute: pnpm start" -ForegroundColor Yellow
}

Write-Host ""

# Verificar processos Node.js relacionados ao projeto
Write-Host "Processos Node.js ativos:" -ForegroundColor Cyan
$nodeProcesses = Get-Process -Name node -ErrorAction SilentlyContinue | Where-Object {
    $_.MainWindowTitle -like '*vite*' -or 
    $_.MainWindowTitle -like '*dev*' -or
    $_.Path -like '*site-igreja*'
}

if ($nodeProcesses) {
    $nodeProcesses | ForEach-Object {
        Write-Host "   PID: $($_.Id) | Memória: $([math]::Round($_.WorkingSet64/1MB, 2)) MB" -ForegroundColor DarkGray
    }
} else {
    Write-Host "   Nenhum processo Node.js do projeto detectado" -ForegroundColor DarkGray
}

Write-Host ""
Write-Host "=== Fim da Verificação ===" -ForegroundColor Cyan
