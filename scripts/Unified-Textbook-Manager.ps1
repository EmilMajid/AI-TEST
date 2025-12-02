# Unified Textbook Manager for Azerbaijan AI Platform
# Handles downloading, organizing, and registering textbooks for AI integration

param (
    [string]$Grade = "8",
    [switch]$ForceDownload
)

$ErrorActionPreference = "Continue"
$RegistryPath = "data/textbooks.json"
$PublicPath = "public/textbooks"

# Configuration for Textbooks (Add more grades here)
$Config = @{
    "8" = @(
        @{id="369"; name="informatika"; title="İnformatika 8"; subject="İnformatika"},
        @{id="784"; name="azerbaycan-dili"; title="Azərbaycan dili 8"; subject="Azərbaycan dili"},
        @{id="793"; name="edebiyyat"; title="Ədəbiyyat 8"; subject="Ədəbiyyat"},
        @{id="799"; name="azerbaycan-tarixi"; title="Azərbaycan tarixi 8"; subject="Azərbaycan tarixi"},
        @{id="791"; name="umumi-tarix"; title="Ümumi tarix 8"; subject="Ümumi tarix"},
        @{id="393"; name="riyaziyyat"; title="Riyaziyyat 8"; subject="Riyaziyyat"},
        @{id="381"; name="fizika"; title="Fizika 8"; subject="Fizika"},
        @{id="395"; name="kimya"; title="Kimya 8"; subject="Kimya"},
        @{id="383"; name="biologiya"; title="Biologiya 8"; subject="Biologiya"},
        @{id="374"; name="cografiya"; title="Coğrafiya 8"; subject="Coğrafiya"},
        @{id="797"; name="ingilis-dili"; title="İngilis dili 8"; subject="Xarici dil"},
        @{id="824"; name="texnologiya"; title="Texnologiya 8"; subject="Texnologiya"}
    )
}

function Get-Registry {
    if (Test-Path $RegistryPath) {
        return Get-Content $RegistryPath | ConvertFrom-Json
    }
    return @{}
}

function Save-Registry ($data) {
    $data | ConvertTo-Json -Depth 5 | Set-Content $RegistryPath
}

Write-Host "--- Unified Textbook Manager ---" -ForegroundColor Cyan
Write-Host "Target Grade: $Grade" -ForegroundColor Yellow

# Ensure directories exist
$GradePath = "$PublicPath/$Grade"
New-Item -ItemType Directory -Force -Path $GradePath | Out-Null

# Load Registry
$Registry = Get-Registry
if (-not $Registry.$Grade) {
    $Registry | Add-Member -MemberType NoteProperty -Name $Grade -Value @()
}

$Books = $Config[$Grade]

if (-not $Books) {
    Write-Host "No configuration found for Grade $Grade" -ForegroundColor Red
    exit
}

foreach ($Book in $Books) {
    Write-Host "Processing: $($Book.title)" -ForegroundColor Cyan
    
    $BookDir = "$GradePath/$($Book.name)"
    $EpubUrl = "https://www.e-derslik.edu.az/books/$($Book.id)/$($Book.id).epub"
    $ZipPath = "temp/$($Book.id).zip"
    
    # 1. Download & Extract (HTML Strategy)
    if (-not (Test-Path $BookDir) -or $ForceDownload) {
        Write-Host "  Downloading..." -NoNewline
        try {
            Invoke-WebRequest -Uri $EpubUrl -OutFile $ZipPath -ErrorAction Stop
            Write-Host " Done" -ForegroundColor Green
            
            Write-Host "  Extracting HTML..." -NoNewline
            if (Test-Path $BookDir) { Remove-Item $BookDir -Recurse -Force }
            Expand-Archive -Path $ZipPath -DestinationPath $BookDir -Force
            Remove-Item $ZipPath -Force
            Write-Host " Done" -ForegroundColor Green
        } catch {
            Write-Host " Failed to download/extract: $($_.Exception.Message)" -ForegroundColor Red
            continue
        }
    } else {
        Write-Host "  Already exists (Skipping download)" -ForegroundColor Gray
    }

    # 2. Find Entry Point
    $EntryPoint = Get-ChildItem -Path $BookDir -Include "basla.html", "index.html", "start.html" -Recurse | Select-Object -First 1
    
    if (-not $EntryPoint) {
        # Check for OEBPS structure
        $EntryPoint = Get-ChildItem -Path $BookDir -Include "cover.xhtml", "toc.xhtml", "index.xhtml" -Recurse | Select-Object -First 1
    }

    if (-not $EntryPoint) {
        # Fallback to any HTML/XHTML
        $EntryPoint = Get-ChildItem -Path $BookDir -Include "*.html", "*.xhtml" -Recurse | Select-Object -First 1
    }

    if ($EntryPoint) {
        $RelPath = "/textbooks/$Grade/$($Book.name)/" + $EntryPoint.Name
        $ContentPath = "public/textbooks/$Grade/$($Book.name)"
        
        # 3. Register in JSON
        $Existing = $Registry.$Grade | Where-Object { $_.id -eq $Book.name }
        if ($Existing) {
            $Existing.path = $RelPath
            $Existing.contentPath = $ContentPath
            $Existing.type = "html"
        } else {
            $NewEntry = @{
                id = $Book.name
                title = $Book.title
                subject = $Book.subject
                type = "html"
                path = $RelPath
                contentPath = $ContentPath
                originalId = $Book.id
            }
            $Registry.$Grade += $NewEntry
        }
        Write-Host "  Registered: $RelPath" -ForegroundColor Green
    } else {
        Write-Host "  Error: No HTML entry point found!" -ForegroundColor Red
    }
}

Save-Registry $Registry
Write-Host "Registry updated!" -ForegroundColor Green
