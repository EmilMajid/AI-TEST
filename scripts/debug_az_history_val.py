import json
import logging
import os
import sys
from pathlib import Path

# Add current directory to path for imports
sys.path.append(str(Path(__file__).parent))
from rag_content_extractor import ContentExtractor

def debug_az_history_validation():
    book_id = "azerbaycan-tarixi-7"
    pdf_path = Path(f"scripts/ocr_temp/{book_id}.pdf")
    
    extractor = ContentExtractor()
    subject = "Azərbaycan tarixi"
    
    # Check page 10
    import pdfplumber
    with pdfplumber.open(pdf_path) as pdf:
        page = pdf.pages[9] # page 10
        text = page.extract_text()
        print(f"--- Digital Text (Page 10) ---")
        print(f"Length: {len(text) if text else 0}")
        if text:
            print(f"Valid: {extractor.is_valid_text(text, subject=subject)}")
            # Check anomalies
            import re
            anomalies = re.findall(r'[øùԥԤԦԧԨԩԪԫ]', text)
            print(f"Anomalies found: {len(anomalies)}")
            if len(text) > 0:
                print(f"Anomaly ratio: {len(anomalies)/len(text)}")
            
            # Check mirror
            mirrored_patterns = [r'\beht\b', r'\bdna\b', r'\bruoy\b', r'\bym\b']
            mirrored_count = sum(1 for p in mirrored_patterns if re.search(p, text, re.IGNORECASE))
            print(f"Mirror count: {mirrored_count}")

            # Check content chars
            content_chars = re.findall(r'[a-zA-ZəöüçşğıƏÖÜÇŞĞIİ]', text)
            print(f"Content chars: {len(content_chars)}")

if __name__ == "__main__":
    debug_az_history_validation()
