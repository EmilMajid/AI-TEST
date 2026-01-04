import sys
import os
import pdfplumber

# Fix for Windows terminal printing Cyrillic
if sys.version_info >= (3, 7):
    sys.stdout.reconfigure(encoding='utf-8')

pdf_dir = "rus5"
# Absolute path for artifacts
artifact_dir = r"C:\Users\User\.gemini\antigravity\brain\0b13da34-49d1-4b62-b06c-8689e341d75e"
pdfs = [
    {
        "name": "Russian_Main_5",
        "file": "quot-russkij-yazyk-quot-rus-dili-asas-xarici-dil-fanni-uzra-5-ci-sinif-ucun-darslik-1724913033-941.pdf"
    },
    {
        "name": "Russian_Second_5",
        "file": "quot-russkij-yazyk-quot-rus-dili-ikinci-xarici-dil-fanni-uzra-5-ci-sinif-ucun-darslik-1724910660-335.pdf"
    }
]

for pdf in pdfs:
    print(f"\n{'='*50}")
    print(f"BOOK: {pdf['name']}")
    print(f"{'='*50}")
    
    path = os.path.join(pdf_dir, pdf['file'])
    if not os.path.exists(path):
        print(f"Error: File not found at {path}")
        continue
        
    try:
        with pdfplumber.open(path) as pdf_obj:
            print(f"Total pages: {len(pdf_obj.pages)}")
            
            # The user said pages 6 and 7.
            for page_num in [5, 6]: 
                if page_num < len(pdf_obj.pages):
                    print(f"\n--- Saving PAGE {page_num + 1} ---")
                    page = pdf_obj.pages[page_num]
                    # Try to extract text anyway
                    text = page.extract_text()
                    if text:
                        print(f"Extracted Text (P{page_num+1}): {text[:100]}...")
                    
                    # Store as image
                    try:
                        im = page.to_image(resolution=150)
                        image_path = os.path.join(artifact_dir, f"{pdf['name']}_page_{page_num+1}.png")
                        im.save(image_path)
                        print(f"Success: Saved to {image_path}")
                    except Exception as im_e:
                        print(f"Error saving image for P{page_num+1}: {str(im_e)}")
                else:
                    print(f"\n--- PAGE {page_num + 1} (Out of range) ---")
    except Exception as e:
        print(f"Error reading {pdf['name']}: {str(e)}")
