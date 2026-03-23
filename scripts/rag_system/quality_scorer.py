import re

class QualityScorer:
    """
    Chunk keyfiyyətini (0-1) ölçən modul.
    """
    def score(self, text: str, subject: str = "default") -> dict:
        if not text:
            return {
                "score": 0.0,
                "noise_ratio": 0.0,
                "repetition_ratio": 0.0,
                "alpha_ratio": 0.0,
                "vowel_loss_ratio": 0.0,
                "anomaly_ratio": 0.0,
                "word_count": 0
            }

        length = len(text)
        
        # Technical subject detection (Math, Physics, Chemistry)
        is_technical = any(s in subject.lower() for s in ["riyaziyyat", "fizika", "kimya", "biologiya", "texnologiya"])

        # Səs-küy nisbəti (xüsusi simvollar)
        # For technical subjects, digits are NOT noise
        if is_technical:
            noise = re.findall(r'[^a-zA-Z0-9əğıöçüƏĞİÖÇÜ\s.,!?-]', text)
        else:
            noise = re.findall(r'[^a-zA-ZəğıöçüƏĞİÖÇÜ\s.,!?-]', text)
            
        noise_ratio = len(noise) / max(length, 1)
        
        # Təkrar simvol nisbəti
        rep = re.findall(r'(.)\1{3,}', text)
        repetition_ratio = len(rep) / max(length, 1)
        
        # Əlifba simvollarının nisbəti (Include digits for technical)
        if is_technical:
            alpha = re.findall(r'[a-zA-Z0-9əğıöçüƏĞİÖÇÜ]', text)
        else:
            alpha = re.findall(r'[a-zA-ZəğıöçüƏĞİÖÇÜ]', text)
            
        alpha_ratio = len(alpha) / max(length, 1)
        
        # NEW: Vowel loss detection (OCR corruption indicator)
        words = text.split()
        word_count = len(words)
        vowel_less_count = 0
        vowels = set('aəeioöuüıAƏEİOÖUÜI')
        
        for w in words:
            clean_w = re.sub(r'[^\w]', '', w)
            # Skip numbers in technical subjects for vowel check
            if len(clean_w) > 2 and not clean_w.isdigit():
                if not any(c in vowels for c in clean_w):
                    vowel_less_count += 1
        
        vowel_loss_ratio = vowel_less_count / max(word_count, 1)

        # NEW: DUİS Anomaly Detection (Encoding corruption)
        anomalies = re.findall(r'[øùԥԤԦԧԨԩԪԫ]', text)
        anomaly_ratio = len(anomalies) / max(length, 1)

        # Balın hesablanması
        # Adjust weights for technical subjects (lower alpha requirements if digits are many)
        if is_technical and alpha_ratio > 0.3:
            alpha_bonus = 1.0
        else:
            alpha_bonus = min(alpha_ratio * 1.5, 1)

        final_score = (
            (1 - min(noise_ratio * 3, 1)) * 0.20 + 
            (1 - min(repetition_ratio * 5, 1)) * 0.10 + 
            alpha_bonus * 0.25 + 
            min(word_count / 40, 1) * 0.15 +
            (1 - min(vowel_loss_ratio * 3, 1)) * 0.15 +
            (1 - min(anomaly_ratio * 20, 1)) * 0.15
        )

        return {
            "score": round(final_score, 3),
            "noise_ratio": round(noise_ratio, 3),
            "repetition_ratio": round(repetition_ratio, 3),
            "alpha_ratio": round(alpha_ratio, 3),
            "vowel_loss_ratio": round(vowel_loss_ratio, 3),
            "anomaly_ratio": round(anomaly_ratio, 4),
            "word_count": word_count
        }
