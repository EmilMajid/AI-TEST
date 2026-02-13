from rag_cleaner import RAGCleaner
from auto_language_correction import AutoLanguageCorrector
from quality_scorer import QualityScorer

class RAGIngestionPipeline:
    """
    Təmizləmə, Dil təyini və Keyfiyyət ölçülməsini birləşdirən boru xətti.
    """
    def __init__(self, default_lang="az"):
        self.cleaner = RAGCleaner()
        self.corrector = AutoLanguageCorrector(default_lang=default_lang)
        self.scorer = QualityScorer()

    def process(self, raw_text: str) -> dict:
        cleaned = self.cleaner.clean(raw_text)
        lang = self.corrector.detect_language(cleaned)
        # correction is optional and set to False by default in corrector
        quality = self.scorer.score(cleaned)
        
        return {
            "text": cleaned,
            "language": lang,
            "quality": quality
        }
