# llm_refiner.py
import re
import logging
import sys
import os
from typing import Dict, Any

# Ensure we can import from parent dir
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
import llm_utils
from skeleton_refiner import SkeletonRefiner

class LLMContentRefiner:
    """
    Uses LLMs (with local Skeleton fallback) to restore highly corrupted Azerbaijani OCR text.
    Targeted at fixing vowel loss and context-dependent word borking.
    """
    def __init__(self):
        self.logger = logging.getLogger(__name__)
        self.local_refiner = SkeletonRefiner()

    def refine(self, text: str, subject: str = "Təbiət") -> str:
        if not text or len(text.strip()) < 10:
            return text
            
        self.logger.info(f"Triggering Refinement for corrupted text (length: {len(text)})")
        
        # 1. Check if we have API Keys
        api_key = llm_utils.get_api_key("gemini")
        if not api_key or "placeholder" in api_key:
            self.logger.info("  [LOCAL] No API key found. Using SkeletonRefiner fallback.")
            return self.local_refiner.refine_text(text)

        prompt = f"""
        Sən Azərbaycan dili üzrə redaktor və dərslik tərtibatçısısan. 
        Aşağıdakı mətn PDF-dən OCR (tanıma) vasitəsilə çıxarılıb və bəzi hərflər (xüsusən saitlər: ə, ı, ö, ü) itmiş və ya yanlış oxunmuşdur.
        
        SƏNİN VƏZİFƏN:
        1. Mətni Azərbaycan dilinin qrammatikasına və məntiqinə uyğun bərpa et.
        2. Mənanı DƏYİŞMƏ, sadəcə hərfləri və sözləri düzəlt.
        3. Struktur markerlərini qoru (məsələn: "Addım 1", "§", rəqəmlər).
        4. Əgər bir söz tamamilə oxunmursa, onu kontekstə uyğun ən məntiqli şəkildə tamamla.
        
        FƏNN KONTEKSTİ: {subject}
        
        POZULMUŞ MƏTN:
        ---
        {text}
        ---
        
        YALNIZ bərpa edilmiş mətni qaytar. Heç bir izahat və ya giriş cümləsi yazma.
        """
        
        try:
            # Using Gemini as primary
            refined_text = llm_utils.generate_text_with_failover(prompt, provider="gemini")
            
            if refined_text:
                refined_text = refined_text.strip()
                if refined_text.startswith("---"): refined_text = refined_text.replace("---", "").strip()
                self.logger.info("  [LLM] Refinement successful.")
                return refined_text
                
            return self.local_refiner.refine_text(text)
        except Exception as e:
            self.logger.error(f"  [LLM] Refinement error: {e}. Falling back to local.")
            return self.local_refiner.refine_text(text)

if __name__ == "__main__":
    # Quick test
    logging.basicConfig(level=logging.INFO)
    refiner = LLMContentRefiner()
    bad_text = "Addm . Stkanlardan birini isti su, digrini is soyuq su ilə doldurun. Addm . Stkanlarn hr birin eyni əldə qnd paras lav edib qardrn."
    print("Testing Refiner...")
    print(f"INPUT: {bad_text}")
    print(f"OUTPUT: {refiner.refine(bad_text)}")
