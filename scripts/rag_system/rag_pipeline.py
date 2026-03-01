from normalizer import Normalizer
from ocr_repair import OCRRepair
from quality_scorer import QualityScorer
from auto_language_correction import AutoLanguageCorrector
from encoding_fixer import EncodingFixer
from llm_refiner import LLMContentRefiner

class RAGIngestionPipeline:
    """
    Production-grade pipeline: Encoding Fix -> Normalization -> Repair -> Refinement -> Language -> Scoring.
    """
    def __init__(self, default_lang="az"):
        self.encoder = EncodingFixer()
        self.normalizer = Normalizer()
        self.repairer = OCRRepair()
        self.refiner = LLMContentRefiner() # NEW: LLM-assisted refinement
        self.corrector = AutoLanguageCorrector(default_lang=default_lang)
        self.scorer = QualityScorer()

    def process(self, raw_text: str, subject: str = "Təbiət") -> dict:
        # 0. Fix Mojibake/Encoding issues first
        fixed_encoding = self.encoder.fix(raw_text)
        
        # 1. Unicode & Whitespace Normalization
        normalized = self.normalizer.normalize(fixed_encoding)
        
        # 2. Preliminary Quality Assessment
        pre_quality = self.scorer.score(normalized)
        
        # 3. OCR Repair (Local vowel recovery)
        repaired = self.repairer.repair(normalized)
        
        # 4. LLM Refinement TRIGGER (If high corruption detected)
        # Thresholds: > 10% vowel loss or < 0.65 quality score
        if pre_quality["vowel_loss_ratio"] > 0.10 or pre_quality["score"] < 0.65:
            self.refiner.logger.warning(f"  [LLM TRIGGER] Quality: {pre_quality['score']:.2f}, Vowel Loss: {pre_quality['vowel_loss_ratio']:.2f}")
            refined = self.refiner.refine(repaired, subject=subject)
        else:
            refined = repaired
        
        # 5. Language detection
        lang = self.corrector.detect_language(refined)
        
        # 6. Advanced Language Correction (contextual/probabilistic)
        corrected = self.corrector.correct(refined, lang=lang)
        
        # 7. Final Quality Scoring
        quality = self.scorer.score(corrected)
        
        return {
            "text": corrected,
            "language": lang,
            "quality": quality,
            "original_length": len(raw_text),
            "processed_length": len(corrected),
            "refinement_used": refined != repaired
        }
