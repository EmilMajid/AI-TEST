# Find HTML Entry Points
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
        $files = Get-ChildItem -Path $path -Filter "*.html" -Recurse
        $main = $files | Where-Object { $_.Name -match "basla|index|start" } | Select-Object -First 1
        
        if (-not $main) {
            $main = $files | Select-Object -First 1
        }
        
        if ($main) {
            # Get relative path from public/textbooks
            $relPath = $main.FullName.Substring((Get-Item "public/textbooks").FullName.Length).Replace("\", "/")
            Write-Host "$folder : $relPath"
        } else {
            Write-Host "$folder : NO_HTML_FOUND"
        }
    } else {
        Write-Host "$folder : NOT_FOUND"
    }
}
