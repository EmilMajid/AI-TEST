# Extract Remaining 5 EPUB files
$ErrorActionPreference = "Continue"

$TempDir = "temp"
$OutputDir = "public/textbooks"

# Remaining 5 textbooks
$epubFiles = @(
    @{id=374; title="Cografiya 8 (zengin)"; folder="cografiya-8-zengin"},
    @{id=379; title="Azerbaycan tarixi 8 (zengin)"; folder="azerbaycan-tarixi-8-zengin"},
    @{id=381; title="Fizika 8 (zengin)"; folder="fizika-8-zengin"},
    @{id=393; title="Riyaziyyat 8 (zengin)"; folder="riyaziyyat-8-zengin"},
    @{id=395; title="Kimya 8 (zengin)"; folder="kimya-8-zengin"}
)

Write-Host "Extracting remaining EPUB files..." -ForegroundColor Green
Write-Host ""

foreach ($book in $epubFiles) {
    Write-Host "Processing $($book.title)..." -ForegroundColor Cyan
    
    $epubPath = "$TempDir/$($book.id).epub"
    $extractPath = "$OutputDir/$($book.folder)"
    
    if (-not (Test-Path $epubPath)) {
        Write-Host "  EPUB file not found: $epubPath" -ForegroundColor Red
        continue
    }
    
    try {
        if (Test-Path $extractPath) {
            Remove-Item $extractPath -Recurse -Force
        }
        
        $zipPath = "$TempDir/$($book.id)_temp.zip"
        Copy-Item $epubPath $zipPath
        
        Expand-Archive -Path $zipPath -DestinationPath $extractPath -Force
        Remove-Item $zipPath -Force
        
        Write-Host "  Done" -ForegroundColor Green
        
    } catch {
        Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "Extraction complete!" -ForegroundColor Green
