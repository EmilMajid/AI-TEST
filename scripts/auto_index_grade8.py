"""
Grade 8 Auto-Indexer - No interactive prompts
"""
import sys
import json
from pathlib import Path

# Add scripts to path
sys.path.insert(0, str(Path(__file__).parent))

from rag_content_extractor import ContentExtractor

def main():
    base_dir = Path(__file__).parent.parent
    textbooks_json = base_dir / "data" / "textbooks.json"
    chunks_jsonl = base_dir / "data" / "textbook-chunks.jsonl"
    
    print("=" * 70)
    print("GRADE 8 AUTO-INDEXER")
    print("=" * 70)
    
    # Load data
    with open(textbooks_json, "r", encoding="utf-8") as f:
        data = json.load(f)
    
    g8_books = data.get("8", [])
    pdf_books = [b for b in g8_books if b.get("type") == "pdf"]
    
    print(f"\nFound {len(pdf_books)} PDF books in Grade 8")
    
    # Load existing
    existing = []
    if chunks_jsonl.exists():
        with open(chunks_jsonl, "r", encoding="utf-8") as f:
            for line in f:
                if line.strip():
                    existing.append(json.loads(line))
        print(f"Loaded {len(existing)} existing chunks")
    
    # Rewrite existing
    with open(chunks_jsonl, "w", encoding="utf-8") as f:
        for chunk in existing:
            if chunk.get("type") != "pdf_placeholder":
                json.dump(chunk, f, ensure_ascii=False)
                f.write("\n")
    
    # Identify already indexed books
    indexed_books = set()
    for chunk in existing:
        if chunk.get("grade") == 8 and chunk.get("book_id"):
            indexed_books.add(chunk.get("book_id"))
    
    print(f"Skipping {len(indexed_books)} already indexed books: {', '.join(indexed_books)}")
    
    # Process
    extractor = ContentExtractor()
    total = 0
    
    for i, book in enumerate(pdf_books, 1):
        print(f"\n[{i}/{len(pdf_books)}] {book['title']}")
        
        if book['id'] in indexed_books:
            print(f"  [i] Already indexed, skipping.")
            continue
            
        # Find PDF
        pdf_path = None
        if book.get("contentPath"):
            local_dir = base_dir / book["contentPath"]
            if local_dir.exists():
                pdfs = list(local_dir.glob("*.pdf"))
                if pdfs:
                    pdf_path = pdfs[0]
        
        if not pdf_path:
            rel_path = book.get("path", "").lstrip("/").lstrip("\\")
            pdf_path = base_dir / "public" / rel_path
            if not pdf_path.exists():
                pdf_path = base_dir / "public" / "textbooks" / rel_path
        
        if not pdf_path or not pdf_path.exists():
            print(f"  [!] PDF not found")
            continue
        
        print(f"  [*] Processing: {pdf_path.name}")
        
        try:
            # Extract
            extracted = extractor.extract_pdf(str(pdf_path), subject=book['subject'])
            if not extracted["content"]:
                print(f"  [!] No content extracted")
                continue
            
            # Chunk
            chunks = extractor.chunk_content(
                extracted["content"],
                subject=book["subject"],
                grade=8,
                book_id=book["id"]
            )
            
            # Log event
            extractor.log_extraction_event(
                book_id=book["id"],
                grade=8,
                subject=book["subject"],
                result={"chunks": chunks, "metadata": extracted.get("metadata", {})}
            )
            
            # Save
            with open(chunks_jsonl, "a", encoding="utf-8") as f:
                for chunk in chunks:
                    json.dump(chunk, f, ensure_ascii=False)
                    f.write("\n")
            
            print(f"  [+] Saved {len(chunks)} chunks")
            total += len(chunks)
            
        except Exception as e:
            print(f"  [ERROR] {e}")
    
    print("\n" + "=" * 70)
    print(f"COMPLETE: {total} chunks indexed for Grade 8")
    print("=" * 70)

if __name__ == "__main__":
    main()
