# Script PowerShell para sincronizar Purificacao.json com Supabase
# Uso: .\sync-purificacao.ps1

$jsonPath = "src\locales\pt-BR\Purificacao.json"
$apiUrl = "http://localhost:3001/api/save-json"

Write-Host "📖 Lendo Purificacao.json..." -ForegroundColor Cyan
$jsonContent = Get-Content $jsonPath -Raw | ConvertFrom-Json

Write-Host "✓ JSON carregado com sucesso" -ForegroundColor Green
Write-Host "📊 Chaves principais: $($jsonContent.PSObject.Properties.Name -join ', ')" -ForegroundColor Gray

Write-Host "`n📤 Enviando para banco de dados (localhost:3001)..." -ForegroundColor Cyan

$body = @{
    pageId = "purificacao"
    content = $jsonContent
} | ConvertTo-Json -Depth 20

try {
    $response = Invoke-RestMethod -Uri $apiUrl -Method POST -Body $body -ContentType "application/json"
    
    Write-Host "✅ Sincronização concluída com sucesso!" -ForegroundColor Green
    Write-Host "📝 Detalhes: $($response | ConvertTo-Json -Depth 3)" -ForegroundColor Gray
    Write-Host "`n🌐 Conteúdo atualizado no Supabase!" -ForegroundColor Green
    Write-Host "🔄 Recarregue o site para ver as mudanças" -ForegroundColor Yellow
} catch {
    Write-Host "❌ Erro: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "`n💡 Dica: Certifique-se de que o servidor backend está rodando:" -ForegroundColor Yellow
    Write-Host "   pnpm server  ou  node server/express-server.js" -ForegroundColor Gray
    exit 1
}
