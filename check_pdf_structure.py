import fitz
import sys
import io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

pdf_path = r'C:\Users\User\.gemini\antigravity\brain\3c6d91d4-ab06-4ee4-9598-273f712891fb\.tempmediaStorage\2adeec2f061ad330.pdf'
doc = fitz.open(pdf_path)

# The PDF seems to be image-based (scanned). Let's check if there's a TOC
toc = doc.get_toc()
print("=== TABLE OF CONTENTS ===")
for item in toc:
    print(item)

print()
print(f"Total readable pages: {len([i for i in range(doc.page_count) if doc[i].get_text().strip()])}")

# Check if it's a scanned PDF by looking for images vs text
for i in range(min(30, doc.page_count)):
    text = doc[i].get_text().strip()
    imgs = doc[i].get_images()
    if text or imgs:
        print(f"Page {i+1}: text_len={len(text)}, images={len(imgs)}")

doc.close()
