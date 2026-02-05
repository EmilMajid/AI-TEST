"""
RAG Content Extractor - GRADE 8 ONLY VERSION
Temporary script to index only Grade 8 textbooks
"""
import sys
from pathlib import Path

# Add parent to path
sys.path.insert(0, str(Path(__file__).parent))

# Import main extractor
from rag_content_extractor import process_unified_pipeline, ContentExtractor
import json

def process_grade_8_only():
    """Process only Grade 8 textbooks"""
    base_dir = Path(__file__).parent.parent
    textbooks_json_path = base_dir / "data" / "textbooks.json"
    chunks_jsonl_path = base_dir / "data" / "textbook-chunks.jsonl"
    
    print("=" * 80)
    print("[GRADE 8 FOCUSED INDEXING]")
    print("=" * 80)
    
    # Load textbooks
    with open(textbooks_json_path, "r", encoding="utf-8") as f:
        textbooks_data = json.load(f)
    
    # Check if Grade 8 exists
    if "8" not in textbooks_data:
        print("❌ Grade 8 not found in textbooks.json")
        return
    
    grade_8_books = textbooks_data["8"]
    pdf_books = [b for b in grade_8_books if b.get("type") == "pdf"]
    
    print(f"\n📚 Grade 8: {len(grade_8_books)} total books, {len(pdf_books)} PDF books")
    print("\nPDF Books to process:")
    for i, book in enumerate(pdf_books, 1):
        print(f"  {i}. {book['title']} ({book['subject']})")
    
    # Load existing chunks
    existing_chunks = []
    if chunks_jsonl_path.exists():
        print(f"\n📂 Loading existing chunks from {chunks_jsonl_path}...")
        with open(chunks_jsonl_path, "r", encoding="utf-8") as f:
            for line in f:
                if line.strip():
                    existing_chunks.append(json.loads(line))
        print(f"✅ Loaded {len(existing_chunks)} existing chunks")
    
    # Check how many Grade 8 chunks already exist
    grade_8_existing = [c for c in existing_chunks if c.get("grade") == 8]
    print(f"📊 Existing Grade 8 chunks: {len(grade_8_existing)}")
    
    # Confirm before processing
    print("\n" + "=" * 80)
    response = input("Press ENTER to start processing Grade 8, or Ctrl+C to cancel: ")
    
    # Create extractor
    extractor = ContentExtractor()
    
    # Write existing chunks back
    print("\n💾 Rewriting existing chunks...")
    with open(chunks_jsonl_path, "w", encoding="utf-8") as f:
        for chunk in existing_chunks:
            if chunk.get("type") != "pdf_placeholder":
                json.dump(chunk, f, ensure_ascii=False)
                f.write("\n")
    
    # Process Grade 8 PDFs
    print("\n🚀 Starting Grade 8 PDF processing...")
    total_chunks_added = 0
    
    for i, book in enumerate(pdf_books, 1):
        print(f"\n[{i}/{len(pdf_books)}] 📖 {book['title']}")
        
        # Find PDF path
        pdf_path = None
        pdf_rel_path = book.get("path")
        
        # Try contentPath first
        if book.get("contentPath"):
            local_dir = base_dir / book["contentPath"]
            if local_dir.exists():
                pdfs = list(local_dir.glob("*.pdf"))
                if pdfs:
                    pdf_path = pdfs[0]
        
        # Fallback to direct path
        if not pdf_path and pdf_rel_path:
            clean_path = pdf_rel_path.lstrip("/").lstrip("\\")
            pdf_path = base_dir / "public" / clean_path
            if not pdf_path.exists():
                pdf_path = base_dir / "public" / "textbooks" / clean_path
        
        if not pdf_path or not pdf_path.exists():
            print(f"  ⚠️ PDF not found: {pdf_rel_path}")
            continue
        
        print(f"  ✅ Found: {pdf_path.name}")
        
        # Extract
        try:
            extracted = extractor.extract_pdf(str(pdf_path), subject=book['subject'])
            
            if not extracted["content"]:
                print(f"  ⚠️ No content extracted")
                continue
            
            # Chunk
            file_chunks = extractor.chunk_content(
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
                result={"chunks": file_chunks, "metadata": extracted.get("metadata", {})}
            )
            
            # Save chunks
            with open(chunks_jsonl_path, "a", encoding="utf-8") as f:
                for chunk in file_chunks:
                    json.dump(chunk, f, ensure_ascii=False)
                    f.write("\n")
            
            print(f"  ✅ Saved {len(file_chunks)} chunks")
            total_chunks_added += len(file_chunks)
            
        except Exception as e:
            print(f"  ❌ Error: {e}")
            extractor.logger.error(f"Failed to process {book['id']}: {e}")
    
    print("\n" + "=" * 80)
    print(f"🎉 GRADE 8 INDEXING COMPLETE!")
    print(f"📊 Total chunks added: {total_chunks_added}")
    print("=" * 80)

if __name__ == "__main__":
    process_grade_8_only()
