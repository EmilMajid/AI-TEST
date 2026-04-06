# llm_refiner.py
import re
import logging
import sys
import os
from typing import Dict, Any

# Ensure we can import from parent dir
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
# Try relative imports for package usage, fallback to standard imports for direct execution
try:
    from skeleton_refiner import SkeletonRefiner
    from ai_ocr_refiner import AIOCRRefiner
except (ImportError, ValueError):
    from skeleton_refiner import SkeletonRefiner
    from ai_ocr_refiner import AIOCRRefiner

import llm_utils

class LLMContentRefiner:
    """
    Hierarchical Azerbaijani OCR Refiner:
    1. Gemini API (External AI - Gold Standard)
    2. ByT5 local AI (Internal Seq2Seq - Robust)
    3. SkeletonRefiner (Local Heuristics - Fast)
    """
    def __init__(self):
        self.logger = logging.getLogger(__name__)
        self.skeleton_refiner = SkeletonRefiner()
        self.ai_refiner = AIOCRRefiner()

    def refine(self, text: str, subject: str = "Təbiət", force_local: bool = False) -> str:
        if not text or len(text.strip()) < 10:
            return text
            
        self.logger.info(f"Triggering Refinement (length: {len(text)})")
        
        # --- LEVEL 1: EXTERNAL AI (Gemini) ---
        if not force_local:
            api_key = llm_utils.get_api_key("gemini")
            if api_key and "placeholder" not in api_key:
                prompt = self._build_prompt(text, subject)
                try:
                    refined_text = llm_utils.generate_text_with_failover(prompt, provider="gemini")
                    if refined_text:
                        refined_text = refined_text.strip()
                        if refined_text.startswith("---"): refined_text = refined_text.replace("---", "").strip()
                        self.logger.info("  [LEVEL 1] Gemini API refinement successful.")
                        return refined_text
                except Exception as e:
                    self.logger.warning(f"  [LEVEL 1] Gemini failed: {e}. Falling to Level 2.")

        # --- LEVEL 2: LOCAL AI (ByT5) ---
        if self.ai_refiner.model:
            try:
                self.logger.info("  [LEVEL 2] Triggering Local ByT5 AI...")
                refined_text = self.ai_refiner.refine(text)
                if refined_text and len(refined_text) > (len(text) * 0.7): # Basic sanity check
                    self.logger.info("  [LEVEL 2] ByT5 refinement successful.")
                    return refined_text
            except Exception as e:
                self.logger.warning(f"  [LEVEL 2] ByT5 failed: {e}. Falling to Level 3.")

        # --- LEVEL 3: LOCAL HEURISTICS (Skeleton/Segmenter) ---
        self.logger.info("  [LEVEL 3] Using SkeletonRefiner fallback.")
        return self.skeleton_refiner.refine_text(text)

    def _build_prompt(self, text: str, subject: str) -> str:
        return f"""
        Sən Azərbaycan dili üzrə redaktor və dərslik tərtibatçısısan. 
        Aşağıdakı mətn PDF-dən OCR vasitəsilə çıxarılıb və bəzi hərflər (xüsusən saitlər: ə, ı, ö, ü) itmiş və ya yanlış oxunmuşdur.
        
        SƏNİN VƏZİFƏN:
        1. Mətni Azərbaycan dilinin qrammatikasına və məntiqinə uyğun bərpa et.
        2. Mənanı DƏYİŞMƏ, struktur markerlərini qoru.
        3. Əgər bir söz oxunmursa, onu kontekstə ({subject}) uyğun bərpa et.
        
        MƏTN:
        {text}
        
        YALNIZ bərpa edilmiş mətni qaytar.
        """

if __name__ == "__main__":
    # Quick test
    logging.basicConfig(level=logging.INFO)
    refiner = LLMContentRefiner()
    bad_text = "Addm . Stkanlardan birini isti su, digrini is soyuq su ilə doldurun. Addm . Stkanlarn hr birin eyni əldə qnd paras lav edib qardrn."
    print("Testing Refiner...")
    print(f"INPUT: {bad_text}")
    print(f"OUTPUT: {refiner.refine(bad_text)}")
