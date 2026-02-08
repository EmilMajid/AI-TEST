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
    # Force UTF-8 for console output on Windows
    if sys.platform == "win32":
        import io
        sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
        sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')

    # Parse arguments
    target_ids = sys.argv[1:] if len(sys.argv) > 1 else []
    if target_ids:
        print(f"Targeted indexing for: {', '.join(target_ids)}")

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
    
    # Identify already indexed pages per book
    indexed_pages = {} # book_id -> set of pages
    for chunk in existing:
        bid = chunk.get("book_id")
        pnum = chunk.get("page") or chunk.get("metadata", {}).get("page")
        if bid and pnum:
            if bid not in indexed_pages:
                indexed_pages[bid] = set()
            indexed_pages[bid].add(pnum)
    
    print(f"Found existing data for {len(indexed_pages)} books.")
    
    # Process
    extractor = ContentExtractor()
    total = 0
    
    for i, book in enumerate(pdf_books, 1):
        if target_ids and book['id'] not in target_ids:
            continue

        print(f"\n[{i}/{len(pdf_books)}] {book['title']}")
        
        # We don't skip the whole book here anymore, we skip within the page loop
        book_indexed_pages = indexed_pages.get(book['id'], set())
        if not target_ids and book['id'] in indexed_pages and len(book_indexed_pages) > 10:
             # Basic heuristic: if it has >10 pages, maybe skip book if not targeted
             # But for safety, let's keep it robust and skip individually
             pass
            
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
            # Incremental Extract, Chunk and Save
            for page_result in extractor.extract_pdf_pages(str(pdf_path), subject=book['subject']):
                page_data = page_result["page_data"]
                page_num = page_data["page"]
                
                # SKIP if already indexed
                if page_num in book_indexed_pages:
                    continue
                
                # Chunk this single page
                chunks = extractor.chunk_content(
                    [page_data],
                    subject=book["subject"],
                    grade=8,
                    book_id=book["id"]
                )
                
                if chunks:
                    # Save immediately
                    with open(chunks_jsonl, "a", encoding="utf-8") as f:
                        for chunk in chunks:
                            json.dump(chunk, f, ensure_ascii=False)
                            f.write("\n")
                    
                    total += len(chunks)
            
            print(f"  [+] Book completed incrementally. Total book chunks: {total}")
            
        except Exception as e:
            print(f"  [ERROR] {e}")
    
    print("\n" + "=" * 70)
    print(f"COMPLETE: {total} chunks indexed for Grade 8")
    print("=" * 70)

if __name__ == "__main__":
    main()
