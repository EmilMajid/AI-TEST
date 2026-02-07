import pytesseract
import os
from pathlib import Path
from PIL import Image
import io

# Config
tesseract_bin = r"C:\Program Files\Tesseract-OCR\tesseract.exe"
pytesseract.pytesseract.tesseract_cmd = tesseract_bin
tessdata_dir = Path(r"C:\Users\User\Downloads\azerbaijanaiplatform\data\tessdata").resolve()

print(f"Tessdata dir exists: {tessdata_dir.exists()}")

# Try 1: Environment variable
os.environ["TESSDATA_PREFIX"] = str(tessdata_dir)
print(f"Attempting with TESSDATA_PREFIX={os.environ['TESSDATA_PREFIX']}")

# Create a small dummy image with text "Test"
img = Image.new('RGB', (100, 30), color = (255, 255, 255))
# (Just a blank image is fine for testing language load)

try:
    # We just want to see if it loads 'aze'
    text = pytesseract.image_to_string(img, lang='aze')
    print("Success with TESSDATA_PREFIX")
except Exception as e:
    print(f"Failed with TESSDATA_PREFIX: {e}")

# Try 2: --tessdata-dir
try:
    # Clear env var to be sure
    if "TESSDATA_PREFIX" in os.environ: del os.environ["TESSDATA_PREFIX"]
    config = f'--tessdata-dir "{tessdata_dir}"'
    text = pytesseract.image_to_string(img, lang='aze', config=config)
    print("Success with --tessdata-dir")
except Exception as e:
    print(f"Failed with --tessdata-dir: {e}")

# Try 3: --tessdata-dir without quotes
try:
    config = f'--tessdata-dir {tessdata_dir}'
    text = pytesseract.image_to_string(img, lang='aze', config=config)
    print("Success with --tessdata-dir (no quotes)")
except Exception as e:
    print(f"Failed with --tessdata-dir (no quotes): {e}")
