
# production_reindexer.py
import os
import sys
import json
import time
import shutil
import logging
from pathlib import Path
from typing import List, Dict, Any

# Add current and rag_system to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(os.path.join(os.path.dirname(os.path.abspath(__file__)), "rag_system"))

from rag_orchestrator import RAGOrchestrator
from rag_content_extractor import ContentExtractor
from html_content_extractor import HTMLContentExtractor
from section_parser import SectionParser
from noise_remover import NoiseRemover
from dictionary_validator import DictionaryValidator

# --- LOGGING SETUP ---
base_dir = Path(__file__).parent.parent
log_dir = base_dir / "logs"
log_dir.mkdir(exist_ok=True)
log_file = log_dir / "reindexer_job.log"

logging.basicConfig(
    filename=str(log_file),
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    encoding='utf-8',
    filemode='a' # Append to preserve history during resume
)

# Add console handler
console = logging.StreamHandler()
console.setLevel(logging.INFO)
formatter = logging.Formatter('%(message)s') # Simpler format for console
console.setFormatter(formatter)
logging.getLogger('').addHandler(console)

def log(msg):
    logging.info(msg)

def setup_files(base_dir: Path, target_file: Path, is_full_reindex: bool):
    """
    Implements ATOMIC WRITE strategy.
    Returns path to temporary file for writing.
    """
    temp_file = target_file.parent / f"{target_file.stem}_temp.jsonl"
    
    existing_ids = set()
    
    # If temp exists, we ALWAYS try to resume from it (unless we want a forced reset)
    if temp_file.exists():
        log(f"[*] Found existing temp file: {temp_file.name}. Resuming...")
        with open(temp_file, "r", encoding="utf-8") as f:
            for line in f:
                try:
                    c = json.loads(line)
                    existing_ids.add(c.get("book_id"))
                except: pass
        return temp_file, existing_ids

    # If full reindex and NO temp, start fresh
    if is_full_reindex:
        log(f"[*] Starting FRESH re-index to atomic temp file: {temp_file.name}")
        return temp_file, set()
    
    # If partial reindex (specific books) and no temp, copy target to temp
    if target_file.exists():
        log(f"[*] Copying existing {target_file.name} to temp for safe partial update...")
        shutil.copy2(target_file, temp_file)
        with open(temp_file, "r", encoding="utf-8") as f:
            for line in f:
                try:
                    c = json.loads(line)
                    existing_ids.add(c.get("book_id"))
                except: pass
                
    return temp_file, existing_ids

def finalize_atomic_write(target_file: Path, temp_file: Path):
    """
    Swaps temp file to target file atomically.
    """
    if not temp_file.exists(): return
    
    log("\n" + "="*50)
    log(f"[*] ATOMIC SWAP: {temp_file.name} -> {target_file.name}")
    
    # Backup original if exists
    if target_file.exists():
        backup = target_file.parent / f"{target_file.stem}_backup.jsonl"
        shutil.move(target_file, backup)
        
    shutil.move(temp_file, target_file)
    log("[*] Re-indexing completed successfully.")

def main():
    # Force UTF-8 for console
    if sys.platform == "win32":
        import io
        sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

    # Args
    args_grade = sys.argv[1] if len(sys.argv) > 1 else None
    target_ids = sys.argv[2:] if len(sys.argv) > 2 else []
    
    textbooks_json = base_dir / "data" / "textbooks.json"
    chunks_jsonl = base_dir / "data" / "textbook-chunks.jsonl"
    
    log("=" * 70)
    log("PRODUCTION RAG 2.0 RE-INDEXER (Atomic & Structured)")
    log("=" * 70)

    # 1. Initialize Components
    log("\n[*] Initializing Embeddings (MANDATORY)...")
    try:
        from sentence_transformers import SentenceTransformer
        # Check if GPU available, otherwise CPU
        model = SentenceTransformer("sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2")
    except Exception as e:
        log(f"[CRITICAL] Could not load embedding model: {e}")
        log("Aborting. Production RAG 2.0 requires valid embedding model.")
        sys.exit(1)
        
    orchestrator = RAGOrchestrator(embedding_model=model)
    extractor = ContentExtractor()
    html_extractor = HTMLContentExtractor()
    
    # New RAG 2.0 Components
    section_parser = SectionParser()
    noise_remover = NoiseRemover()
    
    # 2. Setup Atomic Write
    is_full_sweep = (not target_ids) # Only do full reset if no specific books targeted
    temp_jsonl, indexed_books = setup_files(base_dir, chunks_jsonl, is_full_sweep)
    
    # 3. Load textbooks
    with open(textbooks_json, "r", encoding="utf-8") as f:
        all_data = json.load(f)

    all_grades = [args_grade] if args_grade else ["5", "6", "7", "8", "9"]
    
    total_books = 0
    total_chunks = 0
    
    for grade in all_grades:
        if grade not in all_data: continue
        log(f"\n>>> PROCESSING GRADE {grade} " + "=" * 40)
        grade_books = all_data.get(grade, [])
        
        for i, book in enumerate(grade_books, 1):
            book_id = book['id']
            if target_ids and book_id not in target_ids: continue
            
            # Atomic check: if book is in temp file, skip it
            if book_id in indexed_books and not target_ids:
                log(f"  [-] Skipping {book_id} (already in temp index)")
                continue

            log(f"\n[{i}/{len(grade_books)}] {book['title']} ({book_id})")
            
            try:
                # A. EXTRACT RAW TEXT (ALL PAGES)
                full_text_pages = []
                
                if book.get("type") == "html":
                    content_path = base_dir / book["contentPath"]
                    if content_path.exists():
                        log(f"  [*] Extracting HTML...")
                        pages = html_extractor.extract_with_page_numbers(content_path, book["subject"])
                        for p in pages:
                            full_text_pages.append(p["text"])
                else:
                    # PDF Search
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
                            
                    if pdf_path and pdf_path.exists():
                        log(f"  [*] Extracting PDF: {pdf_path.name}")
                        # Extract all pages
                        for page_res in extractor.extract_pdf_pages(str(pdf_path), subject=book['subject']):
                            full_text_pages.append(page_res["page_data"]["text"])
                    else:
                        log(f"  [!] PDF source not found: {book_id}")
                        continue

                if not full_text_pages:
                    log("  [!] No content extracted.")
                    continue

                # B. GLOBAL NOISE REMOVAL
                log(f"  [*] Running Global Noise Removal on {len(full_text_pages)} pages...")
                combined_text = "\n".join(full_text_pages)
                clean_text = noise_remover.remove_noise(combined_text)
                
                # C. SECTION PARSING
                log(f"  [*] Parsing Logical Sections...")
                sections = section_parser.parse(clean_text)
                log(f"  [+] Found {len(sections)} logical sections.")
                
                # D. INGEST SECTIONS
                book_chunk_count = 0
                
                # Open temp file in append mode for each book
                with open(temp_jsonl, "a", encoding="utf-8") as f:
                    for sec in sections:
                        # Ingest section text
                        res = orchestrator.ingest_document(sec["content"], meta={
                            "book_id": book_id,
                            "grade": int(grade),
                            "subject": book["subject"],
                            "section_title": sec["title"],
                            "section_level": sec["level"],
                            "type": book.get("type", "pdf"),
                            "bypass_dedup": True # Ensure we override previous chunks
                        })
                        
                        if res["status"] == "success":
                            for j, chunk_text in enumerate(res["chunks"]):
                                chunk_entry = res["metadata"][j]
                                chunk_entry["section"] = sec["title"] # Enrich metadata
                                json.dump(chunk_entry, f, ensure_ascii=False)
                                f.write("\n")
                            book_chunk_count += res["chunks_count"]
                
                log(f"  [+] Saved {book_chunk_count} high-quality chunks.")
                total_chunks += book_chunk_count
                total_books += 1
                
            except Exception as e:
                log(f"  [!] Failed to process {book_id}: {e}")
                # import traceback
                # traceback.print_exc()

    # 4. Final Atomic Swap
    if total_books > 0:
        finalize_atomic_write(chunks_jsonl, temp_jsonl)
    else:
        log("\n[*] No new books processed. No changes made.")

if __name__ == "__main__":
    main()
