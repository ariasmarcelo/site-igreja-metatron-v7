# Check Server Status
# Uso: .\check-servers.ps1

Write-Host "=== Status dos Servidores ===" -ForegroundColor Cyan
Write-Host ""

# Verificar portas comuns
$ports = @(3000, 3001, 8080, 8081)

foreach ($port in $ports) {
    $connection = netstat -ano | findstr ":$port " | Select-Object -First 1
    if ($connection) {
        $processId = ($connection -split '\s+')[-1]
        $process = Get-Process -Id $processId -ErrorAction SilentlyContinue
        if ($process) {
            Write-Host "OK Porta $port - PID: $processId ($($process.ProcessName))" -ForegroundColor Green
            Write-Host "   http://localhost:$port" -ForegroundColor Cyan
        }
    } else {
        Write-Host "-- Porta $port - Nao utilizada" -ForegroundColor DarkGray
    }
}

Write-Host ""
Write-Host "Processos Node.js ativos:" -ForegroundColor Yellow
$nodeProcesses = Get-Process | Where-Object { $_.ProcessName -eq "node" }
if ($nodeProcesses) {
    $nodeProcesses | ForEach-Object {
        Write-Host "  PID: $($_.Id) - Started: $($_.StartTime)" -ForegroundColor Gray
    }
} else {
    Write-Host "  Nenhum processo Node rodando" -ForegroundColor DarkGray
}
