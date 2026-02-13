# quality_scorer.py

import re

class QualityScorer:
    def score(self, text: str) -> dict:
        if not text:
            return {"score": 0.0}

        length = len(text)
        if length < 10:
             return {"score": 0.0}

        noise_ratio = self._noise_ratio(text)
        repetition_ratio = self._repetition_ratio(text)
        alpha_ratio = self._alpha_ratio(text)

        # Simple weighted score
        # High noise -> Low score
        # High repetition -> Low score
        # High alpha -> High score
        
        final_score = (
            (1 - noise_ratio) * 0.3 +
            (1 - repetition_ratio) * 0.3 +
            alpha_ratio * 0.4
        )

        # Clamp between 0 and 1
        final_score = max(0.0, min(1.0, final_score))

        return {
            "score": round(final_score, 3),
            "noise_ratio": round(noise_ratio, 3),
            "repetition_ratio": round(repetition_ratio, 3),
            "alpha_ratio": round(alpha_ratio, 3)
        }

    def _noise_ratio(self, text):
        # Characters that are NOT alphanumeric, space, or common punctuation
        # German includes äöüÄÖÜß
        noise_chars = re.findall(r'[^a-zA-ZäöüÄÖÜß0-9\s.,!?-]', text)
        return min(1.0, len(noise_chars) / max(len(text), 1))

    def _repetition_ratio(self, text):
        # 3 or more repetitions of same char
        repetitions = re.findall(r'(.)\1{3,}', text)
        return min(1.0, len(repetitions) / max(len(text), 1))

    def _alpha_ratio(self, text):
        # Ratio of actual letters
        alpha_chars = re.findall(r'[a-zA-ZäöüÄÖÜß]', text)
        return min(1.0, len(alpha_chars) / max(len(text), 1))
