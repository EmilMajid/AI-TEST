# Alternative Textbook Download Script - Using ZIP Format
# Downloads ZIP files and converts HTML to PDF

$ErrorActionPreference = "Continue"
$ProgressPreference = 'SilentlyContinue'

$TempDir = "temp"
$OutputDir = "public/textbooks"

# Failed textbooks - trying ZIP format instead of EPUB
$failedTextbooks = @(
    @{id=784; title="Azerbaycan dili 8"; zipFile="azerbaycan-dili-8-az.zip"},
    @{id=786; title="Alman dili 8 (ikinci)"; zipFile="alman-dili-8-ikinci.zip"},
    @{id=788; title="Ingilis dili 8 (ikinci)"; zipFile="ingilis-dili-8-ikinci.zip"},
    @{id=790; title="Fransiz dili 8 (ikinci)"; zipFile="fransiz-dili-8-ikinci.zip"},
    @{id=791; title="Umumi tarix 8"; zipFile="umumi-tarix-8-az.zip"},
    @{id=801; title="Cografiya 8"; zipFile="cografiya-8-az.zip"},
    @{id=803; title="Kimya 8"; zipFile="kimya-8-az.zip"},
    @{id=371; title="Fiziki terbiye 8"; zipFile="fiziki-terbiye-8-az.zip"},
    @{id=374; title="Cografiya 8 (zengin)"; zipFile="cografiya-8-zengin.zip"},
    @{id=379; title="Azerbaycan tarixi 8 (zengin)"; zipFile="azerbaycan-tarixi-8-zengin.zip"},
    @{id=381; title="Fizika 8 (zengin)"; zipFile="fizika-8-zengin.zip"},
    @{id=393; title="Riyaziyyat 8 (zengin)"; zipFile="riyaziyyat-8-zengin.zip"},
    @{id=395; title="Kimya 8 (zengin)"; zipFile="kimya-8-zengin.zip"}
)

Write-Host "Trying alternative conversion method for failed textbooks..." -ForegroundColor Green
Write-Host ""

$successCount = 0
$failCount = 0

foreach ($book in $failedTextbooks) {
    Write-Host "[$($failedTextbooks.IndexOf($book) + 1)/$($failedTextbooks.Count)] $($book.title)" -ForegroundColor Cyan
    
    $zipUrl = "https://www.e-derslik.edu.az/books/$($book.id)/$($book.zipFile)"
    $zipPath = "$TempDir/$($book.id).zip"
    $extractPath = "$TempDir/$($book.id)"
    $pdfPath = "$OutputDir/$($book.id).pdf"
    
    try {
        # Download ZIP
        Write-Host "  Downloading ZIP..." -NoNewline
        Invoke-WebRequest -Uri $zipUrl -OutFile $zipPath -ErrorAction Stop
        Write-Host " Done" -ForegroundColor Green
        
        # Extract ZIP
        Write-Host "  Extracting..." -NoNewline
        Expand-Archive -Path $zipPath -DestinationPath $extractPath -Force
        Write-Host " Done" -ForegroundColor Green
        
        # Find main HTML file
        $htmlFiles = Get-ChildItem -Path $extractPath -Filter "*.html" -Recurse
        $mainHtml = $htmlFiles | Where-Object { $_.Name -match "basla|index|start" } | Select-Object -First 1
        
        if (-not $mainHtml) {
            $mainHtml = $htmlFiles | Select-Object -First 1
        }
        
        if ($mainHtml) {
            Write-Host "  Converting HTML to PDF..." -NoNewline
            $calibrePath = "C:\Program Files\Calibre2\ebook-convert.exe"
            & $calibrePath $mainHtml.FullName $pdfPath --paper-size a4 --pdf-page-numbers 2>&1 | Out-Null
            
            if (Test-Path $pdfPath) {
                Write-Host " Done" -ForegroundColor Green
                $successCount++
                
                # Cleanup
                Remove-Item $zipPath -Force
                Remove-Item $extractPath -Recurse -Force
            } else {
                Write-Host " Failed" -ForegroundColor Red
                $failCount++
            }
        } else {
            Write-Host "  No HTML file found" -ForegroundColor Red
            $failCount++
        }
        
    } catch {
        Write-Host " Error: $($_.Exception.Message)" -ForegroundColor Red
        $failCount++
    }
    
    Write-Host ""
}

Write-Host "Alternative conversion complete!" -ForegroundColor Green
Write-Host "Summary:" -ForegroundColor Yellow
Write-Host "   Success: $successCount" -ForegroundColor Green
Write-Host "   Failed: $failCount" -ForegroundColor Red
