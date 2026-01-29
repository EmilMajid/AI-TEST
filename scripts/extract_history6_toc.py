import sys
sys.stdout.reconfigure(encoding='utf-8')
import PyPDF2
import json

pdf_path = r"c:\Users\User\Downloads\azerbaijanaiplatform\public\textbooks\6\umumi-tarix\book.pdf"

print(f"Extracting TOC from {pdf_path}...")
with open(pdf_path, 'rb') as f:
    reader = PyPDF2.PdfReader(f)
    print(f"Total pages: {len(reader.pages)}")
    
    outlines = reader.outline
    if outlines:
        print("Bookmarks found:")
        def print_outlines(items, level=0):
            for item in items:
                if isinstance(item, list):
                    print_outlines(item, level + 1)
                else:
                    print(f"{'  ' * level}- {item.title}")
        print_outlines(outlines)
    else:
        print("No bookmarks found. Extracting first 10 pages text...")
        for i in range(10):
            print(f"--- Page {i+1} ---")
            print(reader.pages[i].extract_text())
