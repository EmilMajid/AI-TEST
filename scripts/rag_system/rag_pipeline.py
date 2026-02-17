# rag_pipeline.py
from normalizer import Normalizer
from ocr_repair import OCRRepair
from quality_scorer import QualityScorer
from auto_language_correction import AutoLanguageCorrector
from encoding_fixer import EncodingFixer

class RAGIngestionPipeline:
    """
    Production-grade pipeline: Encoding Fix -> Normalization -> Repair -> Language -> Scoring.
    """
    def __init__(self, default_lang="az"):
        self.encoder = EncodingFixer()
        self.normalizer = Normalizer()
        self.repairer = OCRRepair()
        self.corrector = AutoLanguageCorrector(default_lang=default_lang)
        self.scorer = QualityScorer()

    def process(self, raw_text: str) -> dict:
        # 0. Fix Mojibake/Encoding issues first
        fixed_encoding = self.encoder.fix(raw_text)
        
        # 1. Unicode & Whitespace Normalization
        normalized = self.normalizer.normalize(fixed_encoding)
        
        # 2. Azerbaijani OCR Repair (vowel recovery - initial layer)
        repaired = self.repairer.repair(normalized)
        
        # 3. Language detection
        lang = self.corrector.detect_language(repaired)
        
        # 4. Advanced Language Correction (contextual/probabilistic)
        corrected = self.corrector.correct(repaired, lang=lang)
        
        # 5. Semantic Quality Scoring
        quality = self.scorer.score(corrected)
        
        return {
            "text": corrected,
            "language": lang,
            "quality": quality,
            "original_length": len(raw_text),
            "processed_length": len(corrected)
        }
