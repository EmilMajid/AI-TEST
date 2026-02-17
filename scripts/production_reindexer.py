# production_reindexer.py
import os
import sys
import json
import time
from pathlib import Path
# Moved SentenceTransformer import inside main to handle DLL errors

# Add current and rag_system to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(os.path.join(os.path.dirname(os.path.abspath(__file__)), "rag_system"))

from rag_orchestrator import RAGOrchestrator
from rag_content_extractor import ContentExtractor
from html_content_extractor import HTMLContentExtractor

def main():
    # Force UTF-8 for console output on Windows
    if sys.platform == "win32":
        import io
        sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

    # Parse args
    args_grade = sys.argv[1] if len(sys.argv) > 1 else None
    target_ids = sys.argv[2:] if len(sys.argv) > 2 else []

    base_dir = Path(__file__).parent.parent
    textbooks_json = base_dir / "data" / "textbooks.json"
    chunks_jsonl = base_dir / "data" / "textbook-chunks.jsonl"
    
    print("=" * 70)
    print("ULTIMATE PRODUCTION-GRADE RE-INDEXER")
    print("=" * 70)

    # 1. Initialize Orchestrator & Model
    print("\n[*] Initializing Embedding Model...")
    model = None
    try:
        from sentence_transformers import SentenceTransformer
        model = SentenceTransformer("sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2")
    except Exception as e:
        print(f"  [!] Could not load embedding model: {e}")
        print("  [*] Falling back to Dummy Hashing for deduplication.")
        
    orchestrator = RAGOrchestrator(embedding_model=model)
    extractor = ContentExtractor()
    html_extractor = HTMLContentExtractor()

    # 2. Load existing book_ids to make it resumable
    indexed_books = set()
    if chunks_jsonl.exists():
        print(f"\n[*] Scanning existing {chunks_jsonl.name} for indexed books...")
        with open(chunks_jsonl, "r", encoding="utf-8") as f:
            for line in f:
                if line.strip():
                    try:
                        chunk = json.loads(line)
                        if "book_id" in chunk:
                            indexed_books.add(chunk["book_id"])
                    except: pass
        print(f"  [+] Found {len(indexed_books)} unique books already indexed.")

    # 3. Clear existing chunks ONLY if doing a full re-index AND no already indexed books
    if not args_grade and not target_ids and not indexed_books:
        print(f"\n[*] Full clean re-index requested. Resetting {chunks_jsonl.name}...")
        with open(chunks_jsonl, "w", encoding="utf-8") as f:
            pass # Truncate file
    else:
        print(f"\n[*] Resuming re-index. Appending to existing chunks.")

    # 4. Load textbooks
    with open(textbooks_json, "r", encoding="utf-8") as f:
        all_data = json.load(f)

    all_grades = [args_grade] if args_grade else ["5", "6", "7", "8", "9"]
    total_books_processed = 0
    total_chunks_saved = 0

    for grade in all_grades:
        if grade not in all_data: continue
        print(f"\n>>> PROCESSING GRADE {grade} " + "=" * 40)
        grade_books = all_data.get(grade, [])
        
        for i, book in enumerate(grade_books, 1):
            if target_ids and book['id'] not in target_ids:
                continue
            
            if book['id'] in indexed_books and not target_ids:
                print(f"  [-] Skipping {book['id']} (already indexed)")
                continue
            print(f"\n[{i}/{len(grade_books)}] {book['title']} ({book['id']})")
            book_chunks = 0
            
            try:
                # Handle HTML vs PDF
                if book.get("type") == "html":
                    content_path = base_dir / book["contentPath"]
                    if not content_path.exists():
                        print(f"  [!] Missing path: {content_path}")
                        continue
                        
                    print(f"  [*] Extracting HTML...")
                    pages = html_extractor.extract_with_page_numbers(content_path, book["subject"])
                    
                    for page in pages:
                        # Full Production Flow
                        res = orchestrator.ingest_document(page["text"], meta={
                            "book_id": book["id"],
                            "grade": int(grade),
                            "subject": book["subject"],
                            "page": page["page"],
                            "type": "html"
                        })
                        
                        if res["status"] == "success":
                            # Save chunks manually to JSONL
                            with open(chunks_jsonl, "a", encoding="utf-8") as f:
                                for j, chunk_text in enumerate(res["chunks"]):
                                    chunk_entry = res["metadata"][j]
                                    json.dump(chunk_entry, f, ensure_ascii=False)
                                    f.write("\n")
                            book_chunks += res["chunks_count"]
                
                else: # PDF
                    pdf_path = None
                    search_paths = [
                        base_dir / book.get("contentPath", ""),
                        base_dir / "public" / book.get("path", "").lstrip("/\\")
                    ]
                    for p in search_paths:
                        if p.is_file(): pdf_path = p; break
                        if p.is_dir():
                            pdfs = list(p.glob("*.pdf"))
                            if pdfs: pdf_path = pdfs[0]; break
                    
                    if not pdf_path or not pdf_path.exists():
                        print(f"  [!] PDF not found: {book['id']}")
                        continue
                        
                    print(f"  [*] Extracting PDF: {pdf_path.name}")
                    for page_result in extractor.extract_pdf_pages(str(pdf_path), subject=book['subject']):
                        page_data = page_result["page_data"]
                        
                        # Full Production Flow
                        res = orchestrator.ingest_document(page_data["text"], meta={
                            "book_id": book["id"],
                            "grade": int(grade),
                            "subject": book["subject"],
                            "page": page_data["page"],
                            "type": "pdf"
                        })
                        
                        if res["status"] == "success":
                            with open(chunks_jsonl, "a", encoding="utf-8") as f:
                                for j, chunk_text in enumerate(res["chunks"]):
                                    chunk_entry = res["metadata"][j]
                                    json.dump(chunk_entry, f, ensure_ascii=False)
                                    f.write("\n")
                            book_chunks += res["chunks_count"]

                book_stats = orchestrator.get_stats()
                print(f"  [+] Chunks saved: {book_chunks}")
                print(f"  [+] Avg Quality: {book_stats['average_quality']:.3f}")
                print(f"  [+] Avg Corruption: {book_stats['average_corruption']:.3f}")
                
                total_chunks_saved += book_chunks
                total_books_processed += 1

            except Exception as e:
                print(f"  [!] Error processing {book['id']}: {e}")
                import traceback
                traceback.print_exc()

    # Summary
    print("\n" + "=" * 70)
    print(f"FINAL REPORT")
    print(f"Books Processed: {total_books_processed}")
    print(f"Total Chunks Saved: {total_chunks_saved}")
    stats = orchestrator.get_stats()
    print(f"Average Quality: {stats['average_quality']}")
    print(f"Low Quality Skipped: {stats['skipped']} ({stats['low_quality_ratio'] * 100:.1f}%)")
    print("=" * 70)

if __name__ == "__main__":
    main()
