param([switch]$Detailed, [switch]$Compare)

$BackupDir = Join-Path $PSScriptRoot "..\backups\supabase"

if (-not (Test-Path $BackupDir)) {
    Write-Host "`nNenhum backup encontrado`n" -ForegroundColor Red
    exit 1
}

$backups = Get-ChildItem $BackupDir -Directory | Sort-Object LastWriteTime -Descending

if ($backups.Count -eq 0) {
    Write-Host "`nNenhum backup disponivel`n" -ForegroundColor Yellow
    exit 0
}

Write-Host "`n=== BACKUPS DISPONIVEIS ($($backups.Count)) ===`n" -ForegroundColor Cyan

$backupList = @()

foreach ($backup in $backups) {
    $metaFile = Join-Path $backup.FullName "_metadata.json"
    
    if (Test-Path $metaFile) {
        $meta = Get-Content $metaFile | ConvertFrom-Json
        $timestamp = [DateTime]::Parse($meta.timestamp)
        
        $backupList += [PSCustomObject]@{
            DataHora = $timestamp.ToString("dd/MM/yyyy HH:mm:ss")
            Pasta = $backup.Name
            TabelasOK = $meta.successful
            Falhas = $meta.failed
            Registros = $meta.totalRecords
            TamanhoKB = $meta.totalSize
            Metadata = $meta
        }
    }
}

if (-not $Detailed) {
    $backupList | Select-Object DataHora, Pasta, TabelasOK, Registros, TamanhoKB | Format-Table -AutoSize
} else {
    foreach ($item in $backupList) {
        Write-Host "---------------------------------------------------" -ForegroundColor Gray
        Write-Host "Data: $($item.DataHora)" -ForegroundColor Yellow
        Write-Host "Pasta: $($item.Pasta)" -ForegroundColor Cyan
        Write-Host "Estatisticas:" -ForegroundColor White
        Write-Host "  - Tabelas OK: $($item.TabelasOK)" -ForegroundColor Green
        Write-Host "  - Falhas: $($item.Falhas)" -ForegroundColor Red
        Write-Host "  - Registros: $($item.Registros)" -ForegroundColor White
        Write-Host "  - Tamanho: $($item.TamanhoKB) KB`n" -ForegroundColor White
        
        Write-Host "Tabelas:" -ForegroundColor White
        foreach ($table in $item.Metadata.tables) {
            $icon = if ($table.success) { "OK" } else { "ERRO" }
            Write-Host "  [$icon] $($table.name) - $($table.records) registros" -ForegroundColor $(if ($table.success) { "Green" } else { "Red" })
        }
        Write-Host ""
    }
}

if ($Compare -and $backupList.Count -ge 2) {
    Write-Host "`n=== COMPARACAO ULTIMO vs ANTERIOR ===`n" -ForegroundColor Yellow
    
    $latest = $backupList[0]
    $previous = $backupList[1]
    
    Write-Host "Ultimo:  $($latest.DataHora) - $($latest.Registros) registros" -ForegroundColor Cyan
    Write-Host "Anterior: $($previous.DataHora) - $($previous.Registros) registros" -ForegroundColor Cyan
    
    $diffRecords = $latest.Registros - $previous.Registros
    Write-Host "Diferenca: $diffRecords registros`n" -ForegroundColor $(if ($diffRecords -gt 0) { "Green" } elseif ($diffRecords -lt 0) { "Red" } else { "Gray" })
}

Write-Host "==================================================" -ForegroundColor Green
Write-Host "Dicas:" -ForegroundColor Yellow
Write-Host "  pnpm backup:list:detailed  - Lista com detalhes"
Write-Host "  pnpm backup:compare        - Comparar versoes"
Write-Host "  node scripts/restore-supabase.js --backup=PASTA" -ForegroundColor Gray
Write-Host "==================================================`n" -ForegroundColor Green
