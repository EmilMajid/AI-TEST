import os
import requests
import json
import argparse
from urllib.parse import urlparse

class DuisIngestor:
    def __init__(self, base_dir="public/textbooks"):
        self.base_dir = base_dir

    def download_file(self, url, target_path):
        print(f"  [DOWNLOAD] {url} -> {target_path}")
        try:
            response = requests.get(url, stream=True, timeout=30)
            response.raise_for_status()
            os.makedirs(os.path.dirname(target_path), exist_ok=True)
            with open(target_path, 'wb') as f:
                for chunk in response.iter_content(chunk_size=8192):
                    f.write(chunk)
            return True
        except Exception as e:
            print(f"  [ERROR] Download failed: {e}")
            return False

    def ingest_trims(self, grade, subject_slug, filename):
        """Download PDF from TRİMS"""
        url = f"https://trims.edu.az/noduploads/book/{filename}"
        if not filename.endswith(".pdf"):
            url += ".pdf"
            
        target_dir = os.path.join(self.base_dir, grade, subject_slug)
        target_path = os.path.join(target_dir, "book.pdf")
        
        return self.download_file(url, target_path)

    def ingest_ederslik_epub(self, grade, subject_slug, book_id):
        """Download EPUB from E-Dərslik (Future implementation)"""
        # Placeholder for EPUB download logic
        # Pattern usually: https://www.e-derslik.edu.az/download/epub/{book_id}.epub (needs verification)
        url = f"https://www.e-derslik.edu.az/books/{book_id}/epub/{book_id}.epub" # Guessing pattern
        
        target_dir = os.path.join(self.base_dir, grade, subject_slug)
        target_path = os.path.join(target_dir, f"{book_id}.epub")
        
        print(f"  [INGEST] E-Dərslik EPUB for ID {book_id} to {target_dir}")
        print("  NOTE: This currently Requires manual URL verification or better scraping logic.")
        # For now, we manually handle e-derslik since they often use protective headers or unique tokens.
        return False

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="DUİS Ingestor - Automated Textbook Procurement")
    parser.add_argument("--source", choices=["trims", "ederslik"], required=True)
    parser.add_argument("--grade", required=True)
    parser.add_argument("--subject", required=True, help="Subject slug (e.g., riyaziyyat)")
    parser.add_argument("--id", required=True, help="Filename for TRİMS or BookID for e-derslik")

    args = parser.parse_args()
    ingestor = DuisIngestor()

    if args.source == "trims":
        success = ingestor.ingest_trims(args.grade, args.subject, args.id)
    else:
        success = ingestor.ingest_ederslik_epub(args.grade, args.subject, args.id)

    if success:
        print("✅ Ingestion complete.")
    else:
        print("❌ Ingestion failed.")
