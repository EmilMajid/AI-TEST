import re

class QualityScorer:
    """
    Chunk keyfiyyətini (0-1) ölçən modul.
    """
    def score(self, text: str) -> dict:
        if not text:
            return {"score": 0.0}

        length = len(text)
        # Səs-küy nisbəti (xüsusi simvollar)
        noise = re.findall(r'[^a-zA-ZəğıöçüƏĞİÖÇÜ\s.,!?-]', text)
        noise_ratio = len(noise) / max(length, 1)
        
        # Təkrar simvol nisbəti
        rep = re.findall(r'(.)\1{3,}', text)
        repetition_ratio = len(rep) / max(length, 1)
        
        # Əlifba simvollarının nisbəti
        alpha = re.findall(r'[a-zA-ZəğıöçüƏĞİÖÇÜ]', text)
        alpha_ratio = len(alpha) / max(length, 1)
        
        word_count = len(text.split())

        # Balın hesablanması
        final_score = (
            (1 - min(noise_ratio * 2, 1)) * 0.25 + 
            (1 - min(repetition_ratio * 5, 1)) * 0.25 + 
            min(alpha_ratio * 1.2, 1) * 0.30 + 
            min(word_count / 50, 1) * 0.20
        )

        return {
            "score": round(final_score, 3),
            "noise_ratio": round(noise_ratio, 3),
            "repetition_ratio": round(repetition_ratio, 3),
            "alpha_ratio": round(alpha_ratio, 3),
            "word_count": word_count
        }
