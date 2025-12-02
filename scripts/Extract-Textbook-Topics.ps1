# Extract Topics from Textbooks
# Parses TOC files (toc.xhtml, nav.xhtml) to populate 'topics' in registry

$ErrorActionPreference = "Continue"
$RegistryPath = "data/textbooks.json"
$PublicPath = "public/textbooks"

function Get-Registry {
    if (Test-Path $RegistryPath) {
        return Get-Content $RegistryPath | ConvertFrom-Json
    }
    return @{}
}

function Save-Registry ($data) {
    $data | ConvertTo-Json -Depth 5 | Set-Content $RegistryPath
}

Write-Host "--- Extracting Textbook Topics ---" -ForegroundColor Cyan

$Registry = Get-Registry
$Grade = "8" # Target grade

if (-not $Registry.$Grade) {
    Write-Host "No data for Grade $Grade" -ForegroundColor Red
    exit
}

foreach ($Book in $Registry.$Grade) {
    Write-Host "Processing: $($Book.title)" -ForegroundColor Cyan
    
    # 1. Locate TOC File
    $BookDir = "$PublicPath/$Grade/$($Book.id)"
    
    # Auto-detect folder if direct path fails
    if (-not (Test-Path $BookDir)) {
        if ($Book.contentPath -and (Test-Path $Book.contentPath)) { 
            $BookDir = $Book.contentPath 
        } else {
            # Try removing -8 suffix
            $CleanId = $Book.id -replace "-8.*", ""
            $Candidate = "$PublicPath/$Grade/$CleanId"
            if (Test-Path $Candidate) {
                $BookDir = $Candidate
                # Fix the contentPath in registry while we are here
                if (-not $Book.PSObject.Properties['contentPath']) {
                    $Book | Add-Member -MemberType NoteProperty -Name "contentPath" -Value $BookDir
                } else {
                    $Book.contentPath = $BookDir
                }
            } else {
                # Try matching any folder starting with CleanId
                $Found = Get-ChildItem "$PublicPath/$Grade" -Directory | Where-Object { $_.Name -like "$CleanId*" } | Select-Object -First 1
                if ($Found) {
                    $BookDir = $Found.FullName
                    if (-not $Book.PSObject.Properties['contentPath']) {
                        $Book | Add-Member -MemberType NoteProperty -Name "contentPath" -Value ("public/textbooks/$Grade/" + $Found.Name)
                    } else {
                        $Book.contentPath = ("public/textbooks/$Grade/" + $Found.Name)
                    }
                } else {
                    Write-Host "  Directory not found for $($Book.id)" -ForegroundColor Red
                    continue
                }
            }
        }
    }

    # Prioritize TOC files
    $TocFile = Get-ChildItem -Path $BookDir -Include "toc.xhtml", "nav.xhtml", "toc.html", "nav.html" -Recurse | Select-Object -First 1
    
    if (-not $TocFile) {
        # Fallback to anything with 'toc' or 'nav' in name
        $TocFile = Get-ChildItem -Path $BookDir -Filter "*toc*" -Recurse | Select-Object -First 1
        if (-not $TocFile) {
             $TocFile = Get-ChildItem -Path $BookDir -Filter "*nav*" -Recurse | Select-Object -First 1
        }
    }
    
    if (-not $TocFile) {
        Write-Host "  TOC file not found" -ForegroundColor Yellow
        continue
    }

    Write-Host "  Found TOC: $($TocFile.Name)" -ForegroundColor Gray

    # 2. Parse Topics
    try {
        $Content = Get-Content $TocFile.FullName -Raw
        
        # Regex to find link text: <a ...>(.*?)</a>
        # We try to target the main nav/ol structure
        
        $Topics = @()
        
        # Simple regex extraction (can be improved with HTML parser if needed)
        $Matches = [regex]::Matches($Content, '<a[^>]*>(.*?)</a>')
        
        foreach ($Match in $Matches) {
            $Text = $Match.Groups[1].Value.Trim()
            
            # Filter out common non-topic items
            if ($Text -match "^(Cild|Info|Page|Səhifə|Cover|Title|Copyright|\d+$)") { continue }
            if ($Text.Length -lt 3) { continue }
            
            # Decode HTML entities (basic)
            $Text = $Text.Replace("&nbsp;", " ").Replace("&amp;", "&")
            
            # Add to list if unique
            if ($Topics -notcontains $Text) {
                $Topics += $Text
            }
        }
        
        # Limit to reasonable number (e.g., first 20-30 main topics)
        # or filter for "UNIT", "FƏSİL", "BÖLMƏ" if list is too long
        if ($Topics.Count -gt 50) {
            $Topics = $Topics | Where-Object { $_ -match "(UNIT|FƏSİL|BÖLMƏ|MÖVZU|Chapter|Part)" }
            if ($Topics.Count -eq 0) {
                 # Fallback: take first 20 longer items
                 $Topics = $Matches | ForEach-Object { $_.Groups[1].Value.Trim() } | Where-Object { $_.Length -gt 10 } | Select-Object -First 20
            }
        }

        if ($Topics.Count -gt 0) {
            $Book | Add-Member -MemberType NoteProperty -Name "topics" -Value $Topics -Force
            Write-Host "  Extracted $($Topics.Count) topics" -ForegroundColor Green
        } else {
            Write-Host "  No valid topics extracted" -ForegroundColor Yellow
        }

    } catch {
        Write-Host "  Error parsing TOC: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Save-Registry $Registry
Write-Host "Registry updated with topics!" -ForegroundColor Green
