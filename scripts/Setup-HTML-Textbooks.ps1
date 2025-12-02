# Extract and Setup HTML Textbooks
# For textbooks that failed PDF conversion, use HTML format directly

$ErrorActionPreference = "Continue"
$ProgressPreference = 'SilentlyContinue'

$TempDir = "temp"
$OutputDir = "public/textbooks"

# Textbooks to extract as HTML
$htmlTextbooks = @(
    @{id=801; title="Cografiya 8"; zipFile="cografiya-8-az.zip"; folder="cografiya-8"},
    @{id=803; title="Kimya 8"; zipFile="kimya-8-az.zip"; folder="kimya-8"},
    @{id=371; title="Fiziki terbiye 8"; zipFile="fiziki-terbiye-8-az.zip"; folder="fiziki-terbiye-8"},
    @{id=374; title="Cografiya 8 (zengin)"; zipFile="cografiya-8-zengin.zip"; folder="cografiya-8-zengin"},
    @{id=379; title="Azerbaycan tarixi 8 (zengin)"; zipFile="azerbaycan-tarixi-8-zengin.zip"; folder="azerbaycan-tarixi-8-zengin"},
    @{id=381; title="Fizika 8 (zengin)"; zipFile="fizika-8-zengin.zip"; folder="fizika-8-zengin"},
    @{id=393; title="Riyaziyyat 8 (zengin)"; zipFile="riyaziyyat-8-zengin.zip"; folder="riyaziyyat-8-zengin"},
    @{id=395; title="Kimya 8 (zengin)"; zipFile="kimya-8-zengin.zip"; folder="kimya-8-zengin"}
)

Write-Host "Setting up HTML textbooks..." -ForegroundColor Green
Write-Host ""

$successCount = 0

foreach ($book in $htmlTextbooks) {
    Write-Host "[$($htmlTextbooks.IndexOf($book) + 1)/$($htmlTextbooks.Count)] $($book.title)" -ForegroundColor Cyan
    
    $zipUrl = "https://www.e-derslik.edu.az/books/$($book.id)/$($book.zipFile)"
    $zipPath = "$TempDir/$($book.id).zip"
    $extractPath = "$OutputDir/$($book.folder)"
    
    try {
        # Download ZIP if not exists
        if (-not (Test-Path $zipPath)) {
            Write-Host "  Downloading ZIP..." -NoNewline
            Invoke-WebRequest -Uri $zipUrl -OutFile $zipPath -ErrorAction Stop
            Write-Host " Done" -ForegroundColor Green
        } else {
            Write-Host "  ZIP already downloaded" -ForegroundColor Yellow
        }
        
        # Extract to textbooks folder
        Write-Host "  Extracting to $extractPath..." -NoNewline
        if (Test-Path $extractPath) {
            Remove-Item $extractPath -Recurse -Force
        }
        Expand-Archive -Path $zipPath -DestinationPath $extractPath -Force
        Write-Host " Done" -ForegroundColor Green
        
        # Find main HTML file
        $htmlFiles = Get-ChildItem -Path $extractPath -Filter "*.html" -Recurse
        $mainHtml = $htmlFiles | Where-Object { $_.Name -match "basla|index|start" } | Select-Object -First 1
        
        if ($mainHtml) {
            Write-Host "  Main file: $($mainHtml.Name)" -ForegroundColor Green
            $successCount++
        } else {
            Write-Host "  Warning: No main HTML file found" -ForegroundColor Yellow
        }
        
        # Cleanup ZIP
        Remove-Item $zipPath -Force -ErrorAction SilentlyContinue
        
    } catch {
        Write-Host " Error: $($_.Exception.Message)" -ForegroundColor Red
    }
    
    Write-Host ""
}

Write-Host "HTML textbook setup complete!" -ForegroundColor Green
Write-Host "Success: $successCount textbooks extracted" -ForegroundColor Green
