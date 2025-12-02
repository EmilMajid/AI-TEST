# Grade 8 Textbooks Batch Downloader & Converter
$ErrorActionPreference = "Continue"
$ProgressPreference = 'SilentlyContinue'

# Paths
$TempDir = "temp"
$OutputDir = "public/textbooks"

# Create directories
New-Item -ItemType Directory -Force -Path $TempDir | Out-Null
New-Item -ItemType Directory -Force -Path $OutputDir | Out-Null

# All Grade 8 textbooks
$textbooks = @(
    @{id=784; title="Azerbaycan dili 8"},
    @{id=785; title="Alman dili 8 (esas)"},
    @{id=786; title="Alman dili 8 (ikinci)"},
    @{id=788; title="Ingilis dili 8 (ikinci)"},
    @{id=789; title="Fransiz dili 8 (esas)"},
    @{id=790; title="Fransiz dili 8 (ikinci)"},
    @{id=791; title="Umumi tarix 8"},
    @{id=793; title="Edebiyyat 8"},
    @{id=795; title="Rus dili 8 (esas)"},
    @{id=796; title="Rus dili 8 (ikinci)"},
    @{id=797; title="Ingilis dili 8 (esas)"},
    @{id=799; title="Azerbaycan tarixi 8"},
    @{id=801; title="Cografiya 8"},
    @{id=803; title="Kimya 8"},
    @{id=824; title="Texnologiya 8"},
    @{id=369; title="Informatika 8"},
    @{id=371; title="Fiziki terbiye 8"},
    @{id=374; title="Cografiya 8 (zengin)"},
    @{id=379; title="Azerbaycan tarixi 8 (zengin)"},
    @{id=381; title="Fizika 8 (zengin)"},
    @{id=383; title="Biologiya 8 (zengin)"},
    @{id=393; title="Riyaziyyat 8 (zengin)"},
    @{id=395; title="Kimya 8 (zengin)"}
)

Write-Host "Starting download and conversion of $($textbooks.Count) textbooks..." -ForegroundColor Green
Write-Host ""

$successCount = 0
$failCount = 0
$total = $textbooks.Count
$current = 0

foreach ($book in $textbooks) {
    $current++
    $epubUrl = "https://www.e-derslik.edu.az/books/$($book.id)/$($book.id).epub"
    $epubPath = "$TempDir/$($book.id).epub"
    $pdfPath = "$OutputDir/$($book.id).pdf"
    
    Write-Host "[$current/$total] $($book.title)" -ForegroundColor Cyan
    
    try {
        # Download EPUB
        Write-Host "  Downloading..." -NoNewline
        Invoke-WebRequest -Uri $epubUrl -OutFile $epubPath -ErrorAction Stop
        Write-Host " Done" -ForegroundColor Green
        
        # Convert to PDF
        Write-Host "  Converting to PDF..." -NoNewline
        $calibrePath = "C:\Program Files\Calibre2\ebook-convert.exe"
        & $calibrePath $epubPath $pdfPath --paper-size a4 --pdf-page-numbers 2>&1 | Out-Null
        
        if (Test-Path $pdfPath) {
            Write-Host " Done" -ForegroundColor Green
            $successCount++
            Remove-Item $epubPath -Force
        } else {
            Write-Host " Failed" -ForegroundColor Red
            $failCount++
        }
        
    } catch {
        Write-Host " Error: $($_.Exception.Message)" -ForegroundColor Red
        $failCount++
    }
    
    Write-Host ""
}

Write-Host "Processing complete!" -ForegroundColor Green
Write-Host "Summary:" -ForegroundColor Yellow
Write-Host "   Total: $total"
Write-Host "   Success: $successCount" -ForegroundColor Green
Write-Host "   Failed: $failCount" -ForegroundColor Red
Write-Host "   Output: $OutputDir"
