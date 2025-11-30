# Stop Development Server
# Uso: .\stop-dev.ps1

Write-Host "=== Parando Servidor de Desenvolvimento ===" -ForegroundColor Cyan
Write-Host ""

# Parar todos os processos Node.js
Write-Host "Parando processos Node..." -ForegroundColor Yellow
$nodeProcesses = Get-Process | Where-Object { $_.ProcessName -eq "node" }

if ($nodeProcesses) {
    $nodeProcesses | ForEach-Object {
        Write-Host "  Parando PID: $($_.Id)" -ForegroundColor Gray
        Stop-Process -Id $_.Id -Force -ErrorAction SilentlyContinue
    }
    Write-Host "  OK - Processos encerrados" -ForegroundColor Green
} else {
    Write-Host "  Nenhum processo Node rodando" -ForegroundColor DarkGray
}

Write-Host ""
Write-Host "[OK] Servidor de desenvolvimento parado" -ForegroundColor Green
