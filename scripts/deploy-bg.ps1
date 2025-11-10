# Deploy em Background - Wrapper Simplificado
# Uso: .\scripts\deploy-bg.ps1 "mensagem do commit"
# Ou: pnpm bg "mensagem do commit"

param(
    [Parameter(Position=0)]
    [string]$CommitMessage = "deploy: atualizacao automatica $(Get-Date -Format 'dd/MM/yyyy HH:mm')"
)

# Garantir que estamos no diretório correto
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$projectRoot = Split-Path -Parent $scriptDir
Set-Location $projectRoot

Write-Host "[DEPLOY] Iniciando deploy em background..." -ForegroundColor Cyan
Write-Host "[INFO] Diretorio: $projectRoot" -ForegroundColor Gray  
Write-Host "[INFO] Commit: $CommitMessage" -ForegroundColor Gray
Write-Host ""

# Executar o script Node.js em background
Start-Process -NoNewWindow -FilePath "node" -ArgumentList "scripts/deploy-background.js", "`"$CommitMessage`"" -WorkingDirectory $projectRoot

Write-Host "[OK] Deploy iniciado em background!" -ForegroundColor Green
Write-Host ""
Write-Host "Comandos uteis:" -ForegroundColor Yellow
Write-Host "  Ver logs:    Get-Content logs\deploy-*.log -Tail 20 -Wait" -ForegroundColor Gray
Write-Host "  Ultimo log:  Get-ChildItem logs\deploy-*.log | Sort-Object LastWriteTime -Descending | Select-Object -First 1 | Get-Content -Tail 30" -ForegroundColor Gray
Write-Host ""
Write-Host "Continue trabalhando normalmente!" -ForegroundColor Green
