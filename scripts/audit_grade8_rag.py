"""
Audit Grade 8 RAG Indexing
Checks which books have chunks and which failed.
"""
import sys
import json
from pathlib import Path

def main():
    base_dir = Path(__file__).parent.parent
    textbooks_json = base_dir / "data" / "textbooks.json"
    chunks_jsonl = base_dir / "data" / "textbook-chunks.jsonl"
    
    print("=" * 60)
    print("GRADE 8 RAG AUDIT")
    print("=" * 60)
    
    # Load textbooks
    with open(textbooks_json, "r", encoding="utf-8") as f:
        data = json.load(f)
    
    g8_books = data.get("8", [])
    expected_ids = {b["id"]: b["title"] for b in g8_books if b.get("type") == "pdf"}
    
    print(f"Found {len(expected_ids)} PDF books in Grade 8 configuration.")
    
    # Check chunks
    book_chunk_counts = {bid: 0 for bid in expected_ids}
    
    if chunks_jsonl.exists():
        with open(chunks_jsonl, "r", encoding="utf-8") as f:
            for line in f:
                if line.strip():
                    chunk = json.loads(line)
                    if chunk.get("grade") == 8:
                        bid = chunk.get("book_id")
                        if bid in book_chunk_counts:
                            book_chunk_counts[bid] += 1
                        # Handle potential mismatch in ID usage if any
    
    # Report
    print("\nSTATUS REPORT:")
    print("-" * 60)
    print(f"{'BOOK ID':<30} | {'CHUNKS':<10} | {'STATUS'}")
    print("-" * 60)
    
    missing_books = []
    
    for bib, title in expected_ids.items():
        count = book_chunk_counts.get(bib, 0)
        status = "OK" if count > 10 else ("LOW" if count > 0 else "FAILED")
        print(f"{bib:<30} | {count:<10} | {status}")
        
        if count == 0:
            missing_books.append(bib)
            
    print("-" * 60)
    print(f"Total Grade 8 Chunks: {sum(book_chunk_counts.values())}")
    print(f"Failed Books: {len(missing_books)}")
    
    if missing_books:
        print("\nACTION REQUIRED FOR:")
        for bib in missing_books:
            print(f" - {bib} ({expected_ids[bib]})")

if __name__ == "__main__":
    main()
