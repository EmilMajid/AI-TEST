# Extract HTML from EPUB files
# EPUB files are ZIP archives - extract and use HTML content

$ErrorActionPreference = "Continue"

$TempDir = "temp"
$OutputDir = "public/textbooks"

# EPUB files we have in temp directory
$epubFiles = @(
    @{id=784; title="Azerbaycan dili 8"; folder="azerbaycan-dili-8"},
    @{id=786; title="Alman dili 8 (ikinci)"; folder="alman-dili-8-ikinci"},
    @{id=788; title="Ingilis dili 8 (ikinci)"; folder="ingilis-dili-8-ikinci"},
    @{id=790; title="Fransiz dili 8 (ikinci)"; folder="fransiz-dili-8-ikinci"},
    @{id=791; title="Umumi tarix 8"; folder="umumi-tarix-8"},
    @{id=801; title="Cografiya 8"; folder="cografiya-8"},
    @{id=803; title="Kimya 8"; folder="kimya-8"},
    @{id=371; title="Fiziki terbiye 8"; folder="fiziki-terbiye-8"}
)

Write-Host "Extracting HTML from EPUB files..." -ForegroundColor Green
Write-Host ""

$successCount = 0

foreach ($book in $epubFiles) {
    Write-Host "[$($epubFiles.IndexOf($book) + 1)/$($epubFiles.Count)] $($book.title)" -ForegroundColor Cyan
    
    $epubPath = "$TempDir/$($book.id).epub"
    $extractPath = "$OutputDir/$($book.folder)"
    
    if (-not (Test-Path $epubPath)) {
        Write-Host "  EPUB file not found: $epubPath" -ForegroundColor Red
        continue
    }
    
    try {
        # EPUB is a ZIP file - extract it
        Write-Host "  Extracting EPUB..." -NoNewline
        
        if (Test-Path $extractPath) {
            Remove-Item $extractPath -Recurse -Force
        }
        
        # Rename .epub to .zip temporarily
        $zipPath = "$TempDir/$($book.id)_temp.zip"
        Copy-Item $epubPath $zipPath
        
        Expand-Archive -Path $zipPath -DestinationPath $extractPath -Force
        Remove-Item $zipPath -Force
        
        Write-Host " Done" -ForegroundColor Green
        
        # Find HTML files
        $htmlFiles = Get-ChildItem -Path $extractPath -Filter "*.html" -Recurse -ErrorAction SilentlyContinue
        $xhtmlFiles = Get-ChildItem -Path $extractPath -Filter "*.xhtml" -Recurse -ErrorAction SilentlyContinue
        
        $allFiles = @($htmlFiles) + @($xhtmlFiles)
        
        if ($allFiles.Count -gt 0) {
            Write-Host "  Found $($allFiles.Count) HTML/XHTML files" -ForegroundColor Green
            $successCount++
        } else {
            Write-Host "  No HTML files found" -ForegroundColor Yellow
        }
        
    } catch {
        Write-Host " Error: $($_.Exception.Message)" -ForegroundColor Red
    }
    
    Write-Host ""
}

Write-Host "Extraction complete!" -ForegroundColor Green
Write-Host "Success: $successCount textbooks extracted" -ForegroundColor Green
