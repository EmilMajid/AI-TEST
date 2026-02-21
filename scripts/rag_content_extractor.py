"""
RAG Content Extractor - Dərslik məlumatlarını çıxarıb strukturlaşdırır
Enhanced with multilingual OCR, logging, and quality metrics
"""
import pdfplumber
import pytesseract
import fitz # PyMuPDF
from PIL import Image
import io
import os
import json
import re
import logging
from typing import List, Dict, Any, Optional
from pathlib import Path
from datetime import datetime
import unicodedata

try:
    from llm_utils import extract_triples, call_gemini_vision, call_xai_vision, get_api_key
except ImportError:
    # Fallback if running from root
    import sys
    sys.path.append(str(Path(__file__).parent))
    from llm_utils import extract_triples, call_gemini_vision, call_xai_vision, get_api_key

# Optional: Progress bar
try:
    from tqdm import tqdm
    TQDM_AVAILABLE = True
except ImportError:
    TQDM_AVAILABLE = False

class ChunkValidator:
    """Validates chunk quality before adding to RAG database"""
    
    QUALITY_THRESHOLD_REJECT = 60
    QUALITY_THRESHOLD_WARN = 80
    MIN_CHUNK_LENGTH = 50  # Lowered from 100 for OCR fragments
    
    @staticmethod
    def validate(chunk: Dict) -> tuple[bool, str]:
        """Validates chunk and returns (is_valid, reason)"""
        text = chunk.get("text", "")
        score = chunk.get("quality_score", 0)
        
        # Hard reject - low quality
        if score < ChunkValidator.QUALITY_THRESHOLD_REJECT:
            return False, "LOW_QUALITY_SCORE"
        
        # Hard reject - too short
        if len(text) < ChunkValidator.MIN_CHUNK_LENGTH:
            return False, "TOO_SHORT"
        
        # Hard reject - gibberish check
        if ChunkValidator.is_gibberish(text):
            return False, "GIBBERISH"
        
        # Soft warning - medium quality
        if score < ChunkValidator.QUALITY_THRESHOLD_WARN:
            chunk["quality_warning"] = True
        
        return True, "OK"
    
    @staticmethod
    def is_gibberish(text: str) -> bool:
        """Checks if text appears to be gibberish"""
        if not text: return True
        
        # Check ratio of spaces to characters
        space_ratio = text.count(' ') / len(text)
        # Tables often have high space ratio, increased from 0.5 to 0.8
        if space_ratio < 0.05 or space_ratio > 0.8:  
            return True
        
        # Check for excessive special characters
        # Exclude common table characters from "noise" count
        table_chars = {'|', '+', '-', '_', '—', '.', ',', '?', '!', '(', ')', '[', ']', '{', '}'}
        non_alnum = [c for c in text if not c.isalnum() and not c.isspace()]
        non_table_special = [c for c in non_alnum if c not in table_chars]
        
        # Standard special char ratio check (ignore table chars and punctuation)
        if len(text) > 20: 
            if len(non_table_special) / len(text) > 0.3:
                return True
                
        return False

class ContentExtractor:
    """Dərsliklərdən mətn, şəkil və düsturları çıxarır - Enhanced with multilingual support"""
    
    # Subject-based language mapping for OCR
    SUBJECT_LANG_MAP = {
        'Rus dili': 'rus',
        'Rus dild': 'rus',
        'Literaturnoye chteniye': 'rus',
        'Xarici dil': 'eng+aze',  # English
        'İkinci xarici dil': 'rus+deu+fra+aze',  # Russian/German/French
        'default': 'aze+eng+rus'
    }
    

    def __init__(self):
        self.math_pattern = re.compile(r'\$(.*?)\$|\\\[(.*?)\\\]')
        project_root = Path(__file__).parent.parent
        self.output_dir = project_root / "data"
        # Standard path for Tesseract stability
        self.tessdata_dir = (self.output_dir / "tessdata").resolve()
        
        # Set TESSDATA_PREFIX environment variable so Tesseract finds our local packs
        os.environ['TESSDATA_PREFIX'] = str(self.tessdata_dir)
        
        # Configure Tesseract path
        tesseract_bin = r"C:\Program Files\Tesseract-OCR\tesseract.exe"
        if Path(tesseract_bin).exists():
            import pytesseract
            pytesseract.pytesseract.tesseract_cmd = tesseract_bin
        
        # Initialize specialized cleaners
        try:
            from rag_cleaner import RAGCleaner
            from quality_scorer import QualityScorer
            self.cleaner = RAGCleaner()
            self.scorer = QualityScorer()
        except ImportError:
            # Fallback if scripts not in path (though they should be)
            import sys
            sys.path.append(str(Path(__file__).parent))
            from rag_cleaner import RAGCleaner
            from quality_scorer import QualityScorer
            self.cleaner = RAGCleaner()
            self.scorer = QualityScorer()
            
        self.setup_logging()
    
    def setup_logging(self):
        """Initialize logging system"""
        log_dir = Path("logs")
        log_dir.mkdir(exist_ok=True)
        
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        log_file = log_dir / f"extraction_{timestamp}.log"
        
        logging.basicConfig(
            filename=str(log_file),
            level=logging.INFO,
            format='%(asctime)s - %(levelname)s - %(message)s',
            encoding='utf-8'
        )
        self.logger = logging.getLogger(__name__)
        self.logger.info("RAG Content Extractor started")
        print(f"Logging to: {log_file}")
    
    def get_ocr_lang(self, subject: str) -> str:
        """Get OCR language parameter based on subject"""
        lang = self.SUBJECT_LANG_MAP.get(subject, self.SUBJECT_LANG_MAP['default'])
        self.logger.info(f"OCR language for '{subject}': {lang}")
        return lang
    
    def clean_text(self, text: str, subject: str = "default") -> str:
        """
        Cleans and normalizes extracted text based on RAGCleaner pipeline.
        """
        # Use the specialized cleaner
        return self.cleaner.clean(text)

    def calculate_quality_score(self, text: str, ocr_used: bool) -> float:
        """
        Calculates quality score using specialized QualityScorer
        Returns 0-100 scale
        """
        # Use the specialized scorer
        result = self.scorer.score(text)
        # Convert 0-1 scale to 0-100
        return result["score"] * 100
    def is_valid_text(self, text: str) -> bool:
        """Enhanced text validation"""
        if not text or len(text.strip()) < 30:
            return False
        if "(cid:" in text:  # PDF font encoding problems
            return False
        # Check for reasonable amount of letters (Azerbaijani + Latin)
        letter_count = len(re.findall(r'[a-zA-Zəöüçşğı]', text))
        if letter_count < 10:
            return False
        return True

    def extract_with_vision(self, image_data: bytes, subject: str) -> Optional[str]:
        """
        INTERNAL OPTIMIZATION (No External API):
        Enhances image quality locally and retries OCR.
        Acts as a 'Simulated Vision AI' by applying computer vision techniques.
        """
        try:
            # Load image with PIL
            img = Image.open(io.BytesIO(image_data))
            
            # 1. Convert to Greyscale
            img = img.convert('L')
            
            # 2. Enhance Contrast
            from PIL import ImageEnhance
            enhancer = ImageEnhance.Contrast(img)
            img = enhancer.enhance(2.0) # High contrast
            
            # 3. Enhance Sharpness
            enhancer = ImageEnhance.Sharpness(img)
            img = enhancer.enhance(2.0)
            
            # 4. Retry Tesseract with stricter config
            # Scale up for better character recognition
            img = img.resize((img.width * 2, img.height * 2), Image.Resampling.LANCZOS)
            
            ocr_lang = self.get_ocr_lang(subject)
            tesseract_config = (
                '--psm 6 '  # Assume a single uniform block of text (good for reading lines)
                '--oem 3 '
                '-c preserve_interword_spaces=1 '
            )
            
            self.logger.info("  Running Internal Vision Optimization (Contrast+Scale+PSM6)...")
            text = pytesseract.image_to_string(img, lang=ocr_lang, config=tesseract_config)
            
            return text
            
        except Exception as e:
            self.logger.error(f"Internal Vision Optimization failed: {e}")
            return None
    
    
    def extract_pdf_pages(self, pdf_path: str, subject: str = "Ümumi", skip_pages: set = None):
        """PDF fayldan məlumatları səhifə-səhifə çıxarır (generator)"""
        if skip_pages is None: skip_pages = set()
        ocr_lang = self.get_ocr_lang(subject)
        self.logger.info(f"Incremental processing: {pdf_path} (Subject: {subject})")
        
        doc_fitz = None
        try:
            try:
                doc_fitz = fitz.open(pdf_path)
            except Exception as e:
                self.logger.warning(f"Could not open PDF with fitz: {e}")
            
            with pdfplumber.open(pdf_path) as pdf:
                for page_num, page in enumerate(pdf.pages, 1):
                    if page_num in skip_pages:
                        # self.logger.debug(f"  Page {page_num}: Skipped (already indexed)")
                        continue
                        
                    text = page.extract_text()
                    ocr_used = False
                    
                    if not self.is_valid_text(text):
                        if doc_fitz and page_num - 1 < len(doc_fitz):
                            try:
                                page_fitz = doc_fitz[page_num - 1]
                                # Enhanced DPI for better OCR quality
                                pix = page_fitz.get_pixmap(dpi=400)
                                img_data = pix.tobytes("png")
                                image = Image.open(io.BytesIO(img_data))
                                
                                # Azerbaijani-optimized Tesseract config
                                tesseract_config = (
                                    '--psm 3 '  # Fully automatic page segmentation
                                    '--oem 3 '  # Default OCR Engine Mode
                                    '-c preserve_interword_spaces=1 '  # Preserve spacing
                                    '-c tessedit_char_whitelist=ABCÇDEƏFGĞHXIİJKLMNOÖPQRSŞTUÜVYZabcçdeəfgğhxıijklmnoöpqrsştuüvyz0123456789 .,:;!?\'\"()-–—' 
                                )
                                
                                ocr_text = pytesseract.image_to_string(
                                    image, 
                                    lang=ocr_lang,
                                    config=tesseract_config
                                )
                                
                                # Quality check - fallback to Vision AI if poor quality
                                if self.is_valid_text(ocr_text):
                                    ocr_quality = self.calculate_quality_score(ocr_text, True)
                                    
                                    if ocr_quality < 70:  # Quality threshold
                                        self.logger.warning(f"  Page {page_num}: Low OCR quality ({ocr_quality:.1f}), trying Vision AI...")
                                        try:
                                            vision_text = self.extract_with_vision(img_data, subject)
                                            if vision_text and self.is_valid_text(vision_text):
                                                vision_quality = self.calculate_quality_score(vision_text, False)
                                                if vision_quality > ocr_quality:
                                                    text = vision_text
                                                    ocr_used = True
                                                    self.logger.info(f"  Page {page_num}: Vision AI used (quality: {vision_quality:.1f} > {ocr_quality:.1f})")
                                                else:
                                                    text = ocr_text
                                                    ocr_used = True
                                                    self.logger.info(f"  Page {page_num}: OCR kept (quality: {ocr_quality:.1f})")
                                            else:
                                                text = ocr_text
                                                ocr_used = True
                                                self.logger.info(f"  Page {page_num}: OCR used (Vision AI failed)")
                                        except Exception as vision_e:
                                            self.logger.warning(f"  Page {page_num}: Vision AI failed - {vision_e}")
                                            text = ocr_text
                                            ocr_used = True
                                    else:
                                        text = ocr_text
                                        ocr_used = True
                                        self.logger.info(f"  Page {page_num}: OCR used successfully (quality: {ocr_quality:.1f})")
                            except Exception as ocr_e:
                                self.logger.error(f"  Page {page_num}: Tesseract OCR failed (Encoding/Other) - {repr(ocr_e)}")
                                try:
                                    vision_text = self.extract_with_vision(img_data, subject)
                                    if vision_text and self.is_valid_text(vision_text):
                                        text = vision_text
                                        ocr_used = True
                                        self.logger.info(f"  Page {page_num}: Vision AI (Gemini) used successfully")
                                except Exception as vision_e:
                                    self.logger.warning(f"  Page {page_num}: Vision AI failed - {vision_e}")

                    if text and self.is_valid_text(text):
                        page_data = {
                            "page": page_num,
                            "text": text,
                            "type": "text",
                            "ocr_used": ocr_used,
                            "quality_score": self.calculate_quality_score(text, ocr_used)
                        }
                        
                        # Apply text cleaning
                        page_data["text"] = self.clean_text(page_data["text"], subject=subject)
                        
                        # Formulas
                        math_blocks = self.math_pattern.findall(text)
                        page_formulas = []
                        for match in math_blocks:
                            formula = match[0] or match[1]
                            if formula:
                                page_formulas.append({
                                    "page": page_num,
                                    "formula": formula,
                                    "type": "latex"
                                })
                        
                        yield {"page_data": page_data, "formulas": page_formulas}
            
            if doc_fitz:
                doc_fitz.close()
                
        except Exception as e:
            if doc_fitz:
                doc_fitz.close()
            self.logger.error(f"Error in extract_pdf_pages: {e}")

    def extract_pdf(self, pdf_path: str, subject: str = "Ümumi") -> Dict[str, Any]:
        """PDF fayldan məlumatları çıxarır - Enhanced with subject-based OCR (PyMuPDF)"""
        text_content = []
        formulas = []
        metadata = {
            "source": os.path.basename(pdf_path),
            "pages": 0
        }
        
        ocr_lang = self.get_ocr_lang(subject)
        self.logger.info(f"Processing: {pdf_path} (Subject: {subject})")
        
        doc_fitz = None
        try:
            # Open with fitz for OCR capability
            try:
                doc_fitz = fitz.open(pdf_path)
            except Exception as e:
                self.logger.warning(f"Could not open PDF with fitz: {e}")
            
            # Extract text and formulas from PDF
            with pdfplumber.open(pdf_path) as pdf:
                metadata["pages"] = len(pdf.pages)
                
                for page_num, page in enumerate(pdf.pages, 1):
                    # Text extraction
                    text = page.extract_text()
                    ocr_used = False
                    
                    # Enhanced validation
                    if not self.is_valid_text(text):
                        # Fallback to OCR using PyMuPDF behavior
                        if doc_fitz:
                            try:
                                # Load page (0-indexed)
                                if page_num - 1 < len(doc_fitz):
                                    page_fitz = doc_fitz[page_num - 1]
                                    pix = page_fitz.get_pixmap(dpi=300)
                                    img_data = pix.tobytes("png")
                                    image = Image.open(io.BytesIO(img_data))
                                    
                                    # Azerbaijani-optimized Tesseract config
                                    ocr_config = (
                                        '--psm 3 '  # Fully automatic page segmentation
                                        '--oem 3 '  # Default OCR Engine Mode
                                        '-c preserve_interword_spaces=1 '  # Preserve spacing
                                        '-c tessedit_char_whitelist=ABCÇDEƏFGĞHXIİJKLMNOÖPQRSŞTUÜVYZabcçdeəfgğhxıijklmnoöpqrsştuüvyz0123456789 .,:;!?\'\"()-–—' 
                                    )
                                    
                                    ocr_text = pytesseract.image_to_string(
                                        image, 
                                        lang=ocr_lang,
                                        config=ocr_config
                                    )
                                    if self.is_valid_text(ocr_text):
                                        text = ocr_text
                                        ocr_used = True
                                        self.logger.info(f"  Page {page_num}: OCR used successfully (fitz)")
                            except Exception as ocr_e:
                                self.logger.warning(f"  Page {page_num}: Tesseract OCR failed - {ocr_e}")
                                
                                # Fallback to Vision AI
                                try:
                                    vision_text = self.extract_with_vision(img_data, subject)
                                    if vision_text and self.is_valid_text(vision_text):
                                        text = vision_text
                                        ocr_used = True
                                        self.logger.info(f"  Page {page_num}: Vision AI (Gemini) used successfully")
                                except Exception as vision_e:
                                    self.logger.warning(f"  Page {page_num}: Vision AI failed - {vision_e}")

                    if text and self.is_valid_text(text):
                        text_content.append({
                            "page": page_num,
                            "text": text,
                            "type": "text",
                            "ocr_used": ocr_used,
                            "quality_score": self.calculate_quality_score(text, ocr_used)
                        })
                        
                        # Apply text cleaning
                        text_content[-1]["text"] = self.clean_text(text_content[-1]["text"], subject=subject)
                        
                        # Formula extraction from text
                        math_blocks = self.math_pattern.findall(text)
                        for match in math_blocks:
                            formula = match[0] or match[1]
                            if formula:
                                formulas.append({
                                    "page": page_num,
                                    "formula": formula,
                                    "type": "latex"
                                })
            
            if doc_fitz:
                doc_fitz.close()
                
            result = {
                "content": text_content,
                "formulas": formulas,
                "metadata": metadata
            }
            
            self.logger.info(f"Extracted {len(text_content)} pages, {len(formulas)} formulas")
            return result
            
        except Exception as e:
            if doc_fitz:
                doc_fitz.close()
            error_msg = f"Error extracting {pdf_path}: {str(e)}"
            self.logger.error(error_msg)
            print(f"Error: {error_msg}")
            return {
                "content": [],
                "formulas": [],
                "metadata": metadata,
                "error": str(e)
            }
    
    def chunk_content(self, content: List[Dict], subject: str = "Ümumi", grade: int = None, book_id: str = None, chunk_size: int = 500) -> List[Dict]:
        """Məzmunu kiçik hissələrə bölür (chunking) - Enhanced with quality gate"""
        chunks = []
        current_chunk = []
        current_length = 0
        chunk_id = 0
        rejected_chunks = []
        
        for item in content:
            text = item["text"]
            words = text.split()
            
            if current_length + len(words) > chunk_size:
                if current_chunk:
                    chunk_text = " ".join(current_chunk)
                    
                    # Build chunk with orchestrator metadata
                    chunk_obj = {
                        "id": chunk_id,
                        "text": chunk_text,
                        "page": item["page"],
                        "type": "chunk",
                        "quality_score": self.calculate_quality_score(chunk_text, item.get("ocr_used", False)),
                        "ocr_used": item.get("ocr_used", False),
                        # Orchestrator metadata
                        "ingestion_timestamp": datetime.now().isoformat(),
                        "processing_pipeline": "rag_content_extractor_v2",
                        "subject_context": subject,
                        "grade": grade,
                        "book_id": book_id,
                        "knowledge": []  # KAG placeholder
                    }
                    
                    # Quality gate validation
                    is_valid, reason = ChunkValidator.validate(chunk_obj)
                    
                    if is_valid:
                        chunks.append(chunk_obj)
                    else:
                        chunk_obj["rejection_reason"] = reason
                        rejected_chunks.append(chunk_obj)
                        self.logger.warning(f"Chunk {chunk_id} rejected: {reason} (score: {chunk_obj['quality_score']})")
                    
                    chunk_id += 1
                    current_chunk = []
                    current_length = 0
            
            current_chunk.extend(words)
            current_length += len(words)
        
        # Add last chunk
        if current_chunk:
            chunk_text = " ".join(current_chunk)
            chunk_obj = {
                "id": chunk_id,
                "text": chunk_text,
                "page": item["page"],
                "type": "chunk",
                "quality_score": self.calculate_quality_score(chunk_text, item.get("ocr_used", False)),
                "ocr_used": item.get("ocr_used", False),
                "ingestion_timestamp": datetime.now().isoformat(),
                "processing_pipeline": "rag_content_extractor_v2",
                "subject_context": subject,
                "grade": grade,
                "book_id": book_id,
                "knowledge": []
            }
            
            is_valid, reason = ChunkValidator.validate(chunk_obj)
            if is_valid:
                chunks.append(chunk_obj)
            else:
                chunk_obj["rejection_reason"] = reason
                rejected_chunks.append(chunk_obj)
                self.logger.warning(f"Chunk {chunk_id} rejected: {reason}")
        
        # Log rejection summary
        if rejected_chunks:
            self.logger.info(f"Quality Gate: {len(chunks)} chunks accepted, {len(rejected_chunks)} rejected")
            self.save_rejected_chunks(rejected_chunks, book_id)
        
        return chunks
    
    def save_rejected_chunks(self, rejected_chunks: List[Dict], book_id: str):
        """Save rejected chunks to review queue"""
        review_queue_path = Path("data/human_review_queue.jsonl")
        
        with open(review_queue_path, "a", encoding="utf-8") as f:
            for chunk in rejected_chunks:
                review_item = {
                    "chunk_id": f"{book_id}_chunk_{chunk['id']}",
                    "book_id": book_id,
                    "reason": chunk["rejection_reason"],
                    "quality_score": chunk.get("quality_score", 0),
                    "text_preview": chunk["text"][:150] + "...",
                    "page": chunk.get("page"),
                    "timestamp": datetime.now().isoformat()
                }
                json.dump(review_item, f, ensure_ascii=False)
                f.write("\n")
        
        self.logger.info(f"Saved {len(rejected_chunks)} chunks to review queue")
    
    def log_extraction_event(self, book_id: str, grade: int, subject: str, result: Dict):
        """Log extraction event for audit and monitoring"""
        event_log_path = Path("data/extraction_events.jsonl")
        
        chunks = result.get("chunks", [])
        
        # Calculate statistics
        total_chunks = len(chunks)
        avg_quality = sum(c.get("quality_score", 0) for c in chunks) / total_chunks if total_chunks > 0 else 0
        ocr_usage = sum(1 for c in chunks if c.get("ocr_used", False))
        
        event = {
            "event_type": "PDF_EXTRACTION_COMPLETE",
            "book_id": book_id,
            "grade": grade,
            "subject": subject,
            "timestamp": datetime.now().isoformat(),
            "stats": {
                "chunks_created": total_chunks,
                "avg_quality_score": round(avg_quality, 2),
                "ocr_pages": ocr_usage,
                "total_pages": result.get("metadata", {}).get("pages", 0)
            }
        }
        
        with open(event_log_path, "a", encoding="utf-8") as f:
            json.dump(event, f, ensure_ascii=False)
            f.write("\n")
        
        self.logger.info(f"Event logged: {event['event_type']} for {book_id}")

def process_unified_pipeline():
    """Reads textbooks.json, processes PDFs, and appends to existing chunks"""
    extractor = ContentExtractor()
    
    # Paths
    base_dir = Path(os.getcwd())
    textbooks_json_path = base_dir / "data" / "textbooks.json"
    chunks_jsonl_path = base_dir / "data" / "textbook-chunks.jsonl"
    
    if not textbooks_json_path.exists():
        print(f"Error: {textbooks_json_path} not found")
        return

    # Load existing chunks if valid, or start fresh if corrupted
    existing_chunks = []
    if chunks_jsonl_path.exists():
        print(f"Loading existing data from {chunks_jsonl_path}...")
        try:
            with open(chunks_jsonl_path, "r", encoding="utf-8") as f:
                for line in f:
                    if line.strip():
                        existing_chunks.append(json.loads(line))
            print(f"Loaded {len(existing_chunks)} existing chunks (mostly EPUB).")
        except Exception as e:
            print(f"Error reading existing chunks: {e}. Starting fresh.")
    
    # Load textbooks config
    with open(textbooks_json_path, "r", encoding="utf-8") as f:
        textbooks_data = json.load(f)
        
    new_chunks = []
    
    # Create/Clear output file first
    with open(chunks_jsonl_path, "w", encoding="utf-8") as f:
        # Write existing chunks first
        for chunk in existing_chunks:
            # Skip old chunks if we are re-processing everything (optional, but for now keep them)
             if chunk.get("type") != "pdf_placeholder":
                json.dump(chunk, f, ensure_ascii=False)
                f.write("\n")

    # Iterate over all grades and books
    for grade, books in textbooks_data.items():
        print(f"Checking Grade {grade} ({len(books)} books)")
        
        # Wrap with progress bar if available
        books_iter = tqdm(books, desc=f"Grade {grade}") if TQDM_AVAILABLE else books
        
        for book in books_iter:
            if book.get("type") == "pdf":
                pdf_rel_path = book.get("path")
                print(f"  - Found PDF entry: {book['title']} ({pdf_rel_path})")
                pdf_path = None
                
                # 1. Try contentPath directory first
                if book.get("contentPath"):
                    local_dir = base_dir / book["contentPath"]
                    if local_dir.exists():
                        pdfs = list(local_dir.glob("*.pdf"))
                        if pdfs:
                            pdf_path = pdfs[0]
                
                # 2. Fallback to direct path
                if not pdf_path and pdf_rel_path:
                     clean_path = pdf_rel_path.lstrip("/").lstrip("\\")
                     pdf_path = base_dir / "public" / clean_path
                     if not pdf_path.exists():
                         # Try looking in public/textbooks
                         pdf_path = base_dir / "public" / "textbooks" / clean_path

                if pdf_path and pdf_path.exists():
                    print(f"    -> Processing PDF: {pdf_path.name} (Grade {grade} - {book['subject']})")
                    try:
                        extracted = extractor.extract_pdf(str(pdf_path), subject=book['subject'])
                        # Only proceed if we got content
                        if extracted["content"]:
                            file_chunks = extractor.chunk_content(
                                extracted["content"], 
                                subject=book["subject"],
                                grade=int(grade),
                                book_id=book["id"]
                            )
                            
                            # Log extraction event
                            extractor.log_extraction_event(
                                book_id=book["id"],
                                grade=int(grade),
                                subject=book["subject"],
                                result={"chunks": file_chunks, "metadata": extracted.get("metadata", {})}
                            )
                            
                            # APPEND chunks to file immediately
                            with open(chunks_jsonl_path, "a", encoding="utf-8") as f:
                                for chunk in file_chunks:
                                    chunk_data = {
                                        "id": chunk["id"],
                                        "grade": int(grade),
                                        "subject": book["subject"],
                                        "book_id": book["id"],
                                        "source": pdf_path.name,
                                        "text": chunk["text"],
                                        "page": chunk["page"],
                                        "type": "pdf_page",
                                        "knowledge": chunk.get("knowledge") # Already extracted in chunk_content
                                    }
                                    
                                    json.dump(chunk_data, f, ensure_ascii=False)
                                    f.write("\n")

                            print(f"  -> Extracted and saved {len(file_chunks)} chunks.")
                        else:
                             print(f"  -> No text extracted (Scanned PDF?).")
                             
                    except Exception as e:
                        print(f"Failed to process {pdf_path.name}: {e}")
                else:
                    if book.get("contentPath"):
                         print(f"Warning: PDF file not found for: {book['title']} (Checked {book['contentPath']} and path)")

    print("Unified Extraction Complete (Incremental)!")

if __name__ == "__main__":
    process_unified_pipeline()
