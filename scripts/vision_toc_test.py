import fitz  # PyMuPDF
import os
import requests
import json
import base64

# CONFIG
PDF_PATH = "public/textbooks/6/azerbaycan-tarixi/book.pdf"
OUTPUT_DIR = "scripts/debug_images"
os.makedirs(OUTPUT_DIR, exist_ok=True)

def get_api_key():
    # Try to load from .env.local or .env
    for f in [".env.local", ".env"]:
        if os.path.exists(f):
            with open(f, "r") as env:
                for line in env:
                    if "GEMINI_API_KEY=" in line:
                        return line.split("=")[1].strip().replace('"', '').replace("'", "")
    return None

def call_gemini_vision(image_paths, prompt):
    api_key = get_api_key()
    if not api_key:
        return "Error: No API Key found."

    # Gemini 1.5 Flash supports multiple images
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-pro:generateContent?key={api_key}"
    
    parts = [{"text": prompt}]
    for img_path in image_paths:
        with open(img_path, "rb") as f:
            img_data = base64.b64encode(f.read()).decode("utf-8")
            parts.append({
                "inline_data": {
                    "mime_type": "image/png",
                    "data": img_data
                }
            })

    data = {
        "contents": [{"parts": parts}]
    }
    
    try:
        response = requests.post(url, headers={"Content-Type": "application/json"}, json=data)
        response.raise_for_status()
        result = response.json()
        return result['candidates'][0]['content']['parts'][0]['text']
    except Exception as e:
        return f"API Error: {e}"

def main():
    doc = fitz.open(PDF_PATH)
    # Extract pages 4, 5, 6
    image_paths = []
    for i in [3, 4, 5]: # 0-indexed
        page = doc.load_page(i)
        pix = page.get_pixmap()
        img_path = os.path.join(OUTPUT_DIR, f"page_{i+1}.png")
        pix.save(img_path)
        image_paths.append(img_path)
        print(f"Saved {img_path}")

    prompt = """
    Aşağıdakı şəkillər Azərbaycan tarixi 6-cı sinif dərsliyinin mündəricat (TOC) səhifələridir.
    Zəhmət olmasa bu şəkillərdən bütün mövzuları çıxar.
    
    Format:
    Bölmə Adı (varsa)
    Mövzu nömrəsi. Mövzu adı - Səhifə nömrəsi
    
    Yalnız mövzuları çıxar, başqa heç bir şərh yazma.
    """
    
    print("Calling Gemini Vision...")
    result = call_gemini_vision(image_paths, prompt)
    print("\n--- EXTRACTED TOPICS ---")
    print(result)

if __name__ == "__main__":
    main()
