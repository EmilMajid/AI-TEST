# Find HTML/XHTML Entry Points - Improved
$folders = @(
    "azerbaycan-dili-8",
    "alman-dili-8-ikinci",
    "ingilis-dili-8-ikinci",
    "fransiz-dili-8-ikinci",
    "umumi-tarix-8",
    "cografiya-8",
    "kimya-8",
    "fiziki-terbiye-8",
    "cografiya-8-zengin",
    "azerbaycan-tarixi-8-zengin",
    "fizika-8-zengin",
    "riyaziyyat-8-zengin",
    "kimya-8-zengin"
)

foreach ($folder in $folders) {
    $path = "public/textbooks/$folder"
    if (Test-Path $path) {
        $files = Get-ChildItem -Path $path -Include "*.html", "*.xhtml" -Recurse
        
        # Try to find common entry points
        $main = $files | Where-Object { $_.Name -match "^(index|basla|start|cover|nav|toc)\.(html|xhtml)$" } | Select-Object -First 1
        
        if (-not $main) {
            # If no common name, take the first file that looks like content (not css/js)
            $main = $files | Select-Object -First 1
        }
        
        if ($main) {
            # Get relative path from public/textbooks
            $relPath = $main.FullName.Substring((Get-Item "public/textbooks").FullName.Length).Replace("\", "/")
            Write-Host "$folder : $relPath"
        } else {
            Write-Host "$folder : NO_HTML_OR_XHTML_FOUND"
            # List some files to see what's there
            $anyFiles = Get-ChildItem -Path $path -Recurse | Select-Object -First 5
            if ($anyFiles) {
                Write-Host "  Contains: $($anyFiles.Name -join ', ')"
            } else {
                Write-Host "  Folder is empty"
            }
        }
    } else {
        Write-Host "$folder : NOT_FOUND"
    }
}
