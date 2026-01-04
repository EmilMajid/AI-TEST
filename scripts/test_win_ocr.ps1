# PowerShell script to test Windows Native OCR
# This requires Windows 10/11

param (
    [string]$ImagePath = ""
)

Add-Type -AssemblyName System.Runtime.WindowsRuntime
$asb = [System.Reflection.Assembly]::LoadWithPartialName("System.Runtime.WindowsRuntime")

# Using WinRT OCR
# This is a bit complex in pure PS, but let's try a simpler approach if possible.
# Actually, there's a popular 'Ocr' module or we can use the Windows.Media.Ocr namespace.

$script = @'
using Windows.Graphics.Imaging;
using Windows.Media.Ocr;
using Windows.Storage;
using System;
using System.Threading.Tasks;
using System.Runtime.InteropServices.WindowsRuntime;

public class WinOCR {
    public static async Task<string> Recognize(string path) {
        var file = await StorageFile.GetFileFromPathAsync(path);
        using (var stream = await file.OpenAsync(FileAccessMode.Read)) {
            var decoder = await BitmapDecoder.CreateAsync(stream);
            var bitmap = await decoder.GetSoftwareBitmapAsync();
            var engine = OcrEngine.TryCreateFromUserProfileLanguages();
            if (engine == null) return "Error: OCR Engine not found";
            var result = await engine.RecognizeAsync(bitmap);
            return result.Text;
        }
    }
}
'@

# We can't easily compile C# with WinRT refs in a simple script without setup.
# Let's try to use the 'Windows.Media.Ocr' directly if possible.

# Alternative: Use a small C# helper if we have 'csc'
# Or just try to find a pre-installed tool.

# Wait, I can try to use 'Tesseract' again by checking if it's in a non-standard path
# or just ask the user.

# Actually, let's try to fix the PyTorch DLL issue. It's often just a missing redist.
# But I can't install system components.

# Let's check if I can use 'pytesseract' with a custom path if the user has it.
