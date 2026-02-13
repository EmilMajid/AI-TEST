"""
Universal Auto-Indexer - Processes any grade specified
Usage: python scripts/auto_index_universal.py <grade> [target_book_ids...]
Example: python scripts/auto_index_universal.py 6
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

    if len(sys.argv) < 2:
        print("Usage: python scripts/auto_index_universal.py <grade> [target_book_ids...]")
        return

    grade = sys.argv[1]
    target_ids = sys.argv[2:] if len(sys.argv) > 2 else []
    
    if target_ids:
        print(f"Targeted indexing for Grade {grade}: {', '.join(target_ids)}")
    else:
        print(f"Full indexing for Grade {grade}")

    base_dir = Path(__file__).parent.parent
    textbooks_json = base_dir / "data" / "textbooks.json"
    chunks_jsonl = base_dir / "data" / "textbook-chunks.jsonl"
    
    print("=" * 70)
    print(f"GRADE {grade} AUTO-INDEXER")
    print("=" * 70)
    
    # Load data
    with open(textbooks_json, "r", encoding="utf-8") as f:
        data = json.load(f)
    
    grade_books = data.get(grade, [])
    pdf_books = [b for b in grade_books if b.get("type") == "pdf"]
    
    print(f"\nFound {len(pdf_books)} PDF books in Grade {grade}")
    
    # Load existing
    indexed_pages = {} # book_id -> set of pages
    if chunks_jsonl.exists():
        with open(chunks_jsonl, "r", encoding="utf-8") as f:
            for line in f:
                if line.strip():
                    try:
                        chunk = json.loads(line)
                        bid = chunk.get("book_id")
                        pnum = chunk.get("page") or chunk.get("metadata", {}).get("page")
                        if bid and pnum:
                            if bid not in indexed_pages:
                                indexed_pages[bid] = set()
                            indexed_pages[bid].add(int(pnum))
                    except: pass
        print(f"Loaded existing data for {len(indexed_pages)} books.")
    
    # Process books
    extractor = ContentExtractor()
    total_new_chunks = 0
    
    for i, book in enumerate(grade_books, 1):
        if target_ids and book['id'] not in target_ids:
            continue

        print(f"\n[{i}/{len(grade_books)}] {book['title']} ({book['id']})")
        
        book_indexed_pages = indexed_pages.get(book['id'], set())
        book_chunks_count = 0
        
        try:
            # Handle HTML textbooks
            if book.get("type") == "html":
                from html_content_extractor import HTMLContentExtractor
                html_extractor = HTMLContentExtractor()
                
                content_path = base_dir / book["contentPath"]
                if not content_path.exists():
                    print(f"  [!] HTML directory not found: {content_path}")
                    continue
                
                print(f"  [*] Processing HTML textbook: {content_path.name}")
                
                # Extract HTML content
                html_content = html_extractor.extract_with_page_numbers(content_path, book["subject"])
                
                if not html_content:
                    print(f"  [!] No content extracted from HTML")
                    continue
                
                # Chunk and save
                chunks = extractor.chunk_content(
                    html_content,
                    subject=book["subject"],
                    grade=int(grade),
                    book_id=book["id"]
                )
                
                if chunks:
                    with open(chunks_jsonl, "a", encoding="utf-8") as f:
                        for chunk in chunks:
                            json.dump(chunk, f, ensure_ascii=False)
                            f.write("\n")
                    
                    book_chunks_count = len(chunks)
                    total_new_chunks += len(chunks)
                
                print(f"  [+] Book completed. New chunks: {book_chunks_count}")
                continue
            
            # Handle PDF textbooks (existing logic)
            if book.get("type") != "pdf":
                print(f"  [!] Unsupported type: {book.get('type')}")
                continue
            
            # Find PDF
            pdf_path = None
            search_paths = []
            if book.get("contentPath"):
                search_paths.append(base_dir / book["contentPath"])
            
            rel_path = book.get("path", "").lstrip("/").lstrip("\\")
            if rel_path:
                search_paths.append(base_dir / "public" / rel_path)
                search_paths.append(base_dir / "public" / "textbooks" / rel_path)
            
            for p in search_paths:
                if p.is_file():
                    pdf_path = p
                    break
                elif p.is_dir():
                    pdfs = list(p.glob("*.pdf"))
                    if pdfs:
                        pdf_path = pdfs[0]
                        break
            
            if not pdf_path or not pdf_path.exists():
                print(f"  [!] PDF not found in search paths")
                continue
            
            print(f"  [*] Processing: {pdf_path.name}")
            
            # Incremental Extract, Chunk and Save
            for page_result in extractor.extract_pdf_pages(str(pdf_path), subject=book['subject'], skip_pages=book_indexed_pages):
                page_data = page_result["page_data"]
                
                # Chunk this single page
                chunks = extractor.chunk_content(
                    [page_data],
                    subject=book["subject"],
                    grade=int(grade),
                    book_id=book["id"]
                )
                
                if chunks:
                    # Save immediately
                    with open(chunks_jsonl, "a", encoding="utf-8") as f:
                        for chunk in chunks:
                            json.dump(chunk, f, ensure_ascii=False)
                            f.write("\n")
                    
                    book_chunks_count += len(chunks)
                    total_new_chunks += len(chunks)
            
            print(f"  [+] Book completed. New chunks: {book_chunks_count}")
            
        except Exception as e:
            print(f"  [ERROR] {e}")
            import traceback
            traceback.print_exc()
    
    print("\n" + "=" * 70)
    print(f"COMPLETE: {total_new_chunks} new chunks indexed for Grade {grade}")
    print("=" * 70)

if __name__ == "__main__":
    main()
