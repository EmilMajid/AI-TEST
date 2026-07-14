import fitz
import sys
import io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

pdf_path = r'C:\Users\User\.gemini\antigravity\brain\3c6d91d4-ab06-4ee4-9598-273f712891fb\.tempmediaStorage\2adeec2f061ad330.pdf'
doc = fitz.open(pdf_path)

print(f'Total pages: {doc.page_count}')
print()

all_text = []
for i in range(doc.page_count):
    text = doc[i].get_text().strip()
    if text and len(text) > 15:
        all_text.append((i+1, text))

# Print all pages with content
for page_num, text in all_text:
    print(f'=== Page {page_num} ===')
    print(text[:600])
    print()

doc.close()
