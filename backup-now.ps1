# Backup Supabase via REST API
$timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$backupDir = "backups\backup-$timestamp"
New-Item -ItemType Directory -Force -Path $backupDir | Out-Null

$supabaseUrl = "https://laikwxajpcahfatiybnb.supabase.co"
$apiKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxhaWt3eGFqcGNhaGZhdGl5Ym5iIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjU2ODMwMywiZXhwIjoyMDc4MTQ0MzAzfQ.nvcfxdNtcl5FhU7-xvEq3niiqCzdUzobGIshth5klLE"

Write-Host "🗄️  Iniciando backup do Supabase..." -ForegroundColor Cyan
Write-Host "📁 Salvando em: $backupDir`n" -ForegroundColor Gray

$headers = @{
    "apikey" = $apiKey
    "Authorization" = "Bearer $apiKey"
    "Content-Type" = "application/json"
}

# Backup text_entries
Write-Host "📦 Fazendo backup de: text_entries" -ForegroundColor Yellow
$response = Invoke-RestMethod -Uri "$supabaseUrl/rest/v1/text_entries?select=*" -Headers $headers -Method Get
$response | ConvertTo-Json -Depth 10 | Out-File "$backupDir\text_entries.json" -Encoding UTF8
Write-Host "✅ text_entries: $($response.Count) registros salvos" -ForegroundColor Green

# Backup page_history
Write-Host "📦 Fazendo backup de: page_history" -ForegroundColor Yellow
$response = Invoke-RestMethod -Uri "$supabaseUrl/rest/v1/page_history?select=*" -Headers $headers -Method Get
$response | ConvertTo-Json -Depth 10 | Out-File "$backupDir\page_history.json" -Encoding UTF8
Write-Host "✅ page_history: $($response.Count) registros salvos" -ForegroundColor Green

Write-Host "`n🎉 Backup completo salvo em:" -ForegroundColor Green
Write-Host "$backupDir" -ForegroundColor White
