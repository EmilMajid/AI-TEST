import os
import subprocess

def test_tesseract_aze():
    # Setup environment
    env = os.environ.copy()
    base_dir = os.path.abspath(os.path.dirname(__file__))
    tessdata_dir = os.path.join(base_dir, "ocr_temp", "tessdata")
    env["TESSDATA_PREFIX"] = tessdata_dir
    
    tesseract_exe = r"C:\Program Files\Tesseract-OCR\tesseract.exe"
    img_path = os.path.join(base_dir, "ocr_temp", "p8_raw.png")
    out_base = os.path.join(base_dir, "ocr_temp", "test_p8_aze_out")
    
    print(f"Running Tesseract on {img_path}")
    print(f"With TESSDATA_PREFIX={tessdata_dir}")
    
    try:
        subprocess.run([tesseract_exe, img_path, out_base, "-l", "aze"], env=env, check=True)
        print("Tesseract finished. Reading output...")
        
        with open(f"{out_base}.txt", 'r', encoding='utf-8') as f:
            text = f.read()
            print("\n--- OCR OUTPUT PREVIEW ---")
            print(text[:500])
            print("--- END PREVIEW ---")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_tesseract_aze()
