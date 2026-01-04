param(
    [string]$ImageDir = "scripts/ocr_temp"
)

Add-Type -AssemblyName System.Runtime.WindowsRuntime
$Asm = [System.Reflection.Assembly]::LoadWithPartialName("System.Runtime.WindowsRuntime")

# Define the OCR helper in C# to easily use WinRT APIs
$Source = @'
using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using Windows.Graphics.Imaging;
using Windows.Media.Ocr;
using Windows.Storage;
using System.Runtime.InteropServices.WindowsRuntime;

public class WinOCR {
    public static async Task<string> ProcessImage(string filePath) {
        try {
            StorageFile file = await StorageFile.GetFileFromPathAsync(filePath);
            using (var stream = await file.OpenAsync(FileAccessMode.Read)) {
                BitmapDecoder decoder = await BitmapDecoder.CreateAsync(stream);
                using (SoftwareBitmap bitmap = await decoder.GetSoftwareBitmapAsync()) {
                    OcrEngine engine = OcrEngine.TryCreateFromUserProfileLanguages();
                    if (engine == null) return "[ERROR: No OCR Engine]";
                    OcrResult result = await engine.RecognizeAsync(bitmap);
                    return result.Text;
                }
            }
        } catch (Exception ex) {
            return "[ERROR: " + ex.Message + "]";
        }
    }
}
'@

# We need to add refs for Windows.WinMD
# This is tricky in simple Add-Type. 
# Better: Use the 'Windows.Media.Ocr' directly if PS version allows.

# Let's try the direct PowerShell way if possible.
# Actually, the 'Ocr' module in PowerShell is the easiest if installed.
# But I can't assume it.

# Let's use a small C# compile if we have the reference.
# On Windows 10, the winmd is usually at:
# C:\Windows\System32\WinMetadata\Windows.Media.winmd etc.

$TextResults = @()

Get-ChildItem -Path $ImageDir -Filter *.png | ForEach-Object {
    $file = $_.FullName
    Write-Host "Processing $file..."
    
    # Simple PowerShell 5.1 / 7 approach using the Windows.Media.Ocr namespace
    try {
        # Using a specialized script block to handle async
        $ocrText = powershell -Command "
            Add-Type -AssemblyName System.Runtime.WindowsRuntime
            # This is too complex for a one-liner.
            # Let's try a simpler approach or a dedicated tool.
        "
    } catch {
        Write-Error $_
    }
}

# Actually, I found a much better way. I can use 'tesseract' if the user allows me to download a portable one.
# But I will try to use a Node.js OCR if I can.
# Wait, I have an idea. I can use the browser to do OCR? No.

# Let's try to find if there's any pre-installed OCR tool.
# Windows PowerToys has text extractor, but no CLI.

# How about I use the 'Tesseract' that might be installed in a different place?
# Let's search again for 'tesseract.exe' everywhere.
