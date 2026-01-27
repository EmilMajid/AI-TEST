import pdfplumber
import re
import os

pdf_path = "public/textbooks/6/azerbaycan-tarixi/book.pdf"

def deduplicate_text(text):
    if not text: return ""
    # Simplify common doubled characters like AAzzəərrbbaayyc caann
    # This is a bit tricky but often they are identical neighbors
    new_text = ""
    i = 0
    while i < len(text):
        char = text[i]
        if i + 1 < len(text) and text[i+1] == char and char != ' ' and char != '\n':
            new_text += char
            i += 2
        else:
            new_text += char
            i += 1
    # Also handle cases where there's a space between doubled chars or just weirdness
    # Let's try to remove every second occurance of non-space chars if they repeat
    return new_text

def main():
    print(f"Opening {pdf_path}...")
    with pdfplumber.open(pdf_path) as pdf:
        for p_idx in [3, 4]: # Pages 4 and 5
            print(f"\n--- PAGE {p_idx+1} ---")
            text = pdf.pages[p_idx].extract_text()
            if text:
                print("Original:")
                print(text[:200])
                print("\nDeduplicated:")
                print(deduplicate_text(text))
            else:
                print("[No text]")

if __name__ == "__main__":
    main()
