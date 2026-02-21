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
        
        # NEW: Vowel loss detection (OCR corruption indicator)
        words = text.split()
        word_count = len(words)
        vowel_less_count = 0
        vowels = set('aəeioöuüıAƏEİOÖUÜI')
        
        for w in words:
            clean_w = re.sub(r'[^\w]', '', w)
            if len(clean_w) > 2 and not clean_w.isdigit():
                if not any(c in vowels for c in clean_w):
                    vowel_less_count += 1
        
        vowel_loss_ratio = vowel_less_count / max(word_count, 1)

        # Balın hesablanması
        final_score = (
            (1 - min(noise_ratio * 2, 1)) * 0.20 + 
            (1 - min(repetition_ratio * 5, 1)) * 0.20 + 
            min(alpha_ratio * 1.2, 1) * 0.30 + 
            min(word_count / 50, 1) * 0.15 +
            (1 - min(vowel_loss_ratio * 3, 1)) * 0.15
        )

        return {
            "score": round(final_score, 3),
            "noise_ratio": round(noise_ratio, 3),
            "repetition_ratio": round(repetition_ratio, 3),
            "alpha_ratio": round(alpha_ratio, 3),
            "vowel_loss_ratio": round(vowel_loss_ratio, 3),
            "word_count": word_count
        }
