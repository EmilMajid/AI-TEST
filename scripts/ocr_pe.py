import easyocr
import sys

# Configure stdout for utf-8
sys.stdout.reconfigure(encoding='utf-8')

reader = easyocr.Reader(['az']) # Azerbaijan language

image_paths = [
    r"C:/Users/User/.gemini/antigravity/brain/31d778bc-7ad4-4a0d-b9f4-d0e41b1455c7/uploaded_media_0_1769501804006.png",
    r"C:/Users/User/.gemini/antigravity/brain/31d778bc-7ad4-4a0d-b9f4-d0e41b1455c7/uploaded_media_1_1769501804006.png"
]

print("Starting OCR...")

for img_path in image_paths:
    print(f"\nProcessing {img_path}...")
    try:
        result = reader.readtext(img_path, detail=0)
        print("--- EXTRACTED TEXT ---")
        for line in result:
            print(line)
        print("----------------------")
    except Exception as e:
        print(f"Error processing {img_path}: {e}")
