# force-restart-8080.ps1
# Script robusto para matar TUDO e iniciar Vercel Dev na porta 8080

Write-Host "=== FORCE RESTART - PORTA 8080 ===" -ForegroundColor Red
Write-Host ""

# 1. MATAR TODOS OS PROCESSOS NODE
Write-Host "[1/5] Matando TODOS os processos Node..." -ForegroundColor Yellow
taskkill /F /IM node.exe /T 2>$null
taskkill /F /IM vercel.exe /T 2>$null
Get-Process | Where-Object {$_.ProcessName -match "node|vite|vercel"} | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 3
Write-Host "  ✅ Processos encerrados" -ForegroundColor Green

# 2. LIBERAR TODAS AS PORTAS
Write-Host ""
Write-Host "[2/5] Liberando TODAS as portas..." -ForegroundColor Yellow
$ports = @(8080, 8081, 8082, 8083, 3000, 3001, 3002, 5173)
foreach ($port in $ports) {
    $connections = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
    foreach ($conn in $connections) {
        try {
            Stop-Process -Id $conn.OwningProcess -Force -ErrorAction SilentlyContinue
            Write-Host "  Porta $port liberada (PID: $($conn.OwningProcess))" -ForegroundColor DarkGray
        } catch {}
    }
}
Start-Sleep -Seconds 2
Write-Host "  ✅ Portas liberadas" -ForegroundColor Green

# 3. LIMPAR CACHE VERCEL
Write-Host ""
Write-Host "[3/5] Limpando cache Vercel..." -ForegroundColor Yellow
Remove-Item -Path ".\.vercel" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path ".\node_modules\.vite" -Recurse -Force -ErrorAction SilentlyContinue
Write-Host "  ✅ Cache limpo" -ForegroundColor Green

# 4. VERIFICAR PORTA 8080
Write-Host ""
Write-Host "[4/5] Verificando porta 8080..." -ForegroundColor Yellow
$check8080 = Get-NetTCPConnection -LocalPort 8080 -ErrorAction SilentlyContinue
if ($check8080) {
    Write-Host "  ❌ ERRO: Porta 8080 ainda ocupada!" -ForegroundColor Red
    Write-Host "  Processo: $($check8080.OwningProcess)" -ForegroundColor Red
    Stop-Process -Id $check8080.OwningProcess -Force
    Start-Sleep -Seconds 2
    Write-Host "  ✅ Forçado encerramento do processo" -ForegroundColor Green
} else {
    Write-Host "  ✅ Porta 8080 LIVRE" -ForegroundColor Green
}

Start-Sleep -Seconds 2

# 5. INICIAR VERCEL DEV NA PORTA 8080
Write-Host ""
Write-Host "[5/5] Iniciando Vercel Dev na porta 8080..." -ForegroundColor Yellow
Write-Host "  URL: http://localhost:8080" -ForegroundColor Cyan
Write-Host ""

vercel dev --listen 8080
