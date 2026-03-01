# quality_scorer.py
import re

class QualityScorer:
    """
    Measures the quality of text chunks for RAG ingestion.
    Now includes corruption detection and length penalties.
    """
    def score(self, text: str) -> dict:
        if not text:
            return {"score": 0.0}

        length = len(text)
        if length < 10:
             return {"score": 0.0}

        # 1. Basic metrics
        noise_ratio = self._noise_ratio(text)
        repetition_ratio = self._repetition_ratio(text)
        alpha_ratio = self._alpha_ratio(text)
        
        # 2. Encoding Quality (Mojibake detection)
        # Characters like Ì, ÿ (when not ə), ë, ó, etc.
        # We allow ç, ö, ü as they are native.
        mojibake_chars = re.findall(r'[Ìëóòåèíôàñéûùøúÿ]', text)
        mojibake_ratio = len(mojibake_chars) / max(len(text), 1)
        encoding_score = 1.0 - (mojibake_ratio * 5.0) # Aggressive penalty
        encoding_score = max(0.0, encoding_score)

        # 3. Corruption ratio (Audit report focus)
        words = text.split()
        short_words = [w for w in words if len(w) <= 4 and w.islower()]
        corruption_ratio = len(short_words) / max(len(words), 1)

        # 4. Final Score Calculation
        base_score = (
            (1 - noise_ratio) * 0.15 +
            (1 - repetition_ratio) * 0.15 +
            (1 - corruption_ratio) * 0.2 +
            alpha_ratio * 0.2 +
            encoding_score * 0.3
        )

        # 4. Length Penalty (User suggested min 350, we penalize below 300)
        length_penalty = 1.0
        if length < 350:
            length_penalty = 0.7
        if length < 150:
            length_penalty = 0.4
        if length < 50:
            length_penalty = 0.1

        final_score = base_score * length_penalty
        
        # Clamp between 0 and 1
        final_score = max(0.0, min(1.0, final_score))

        return {
            "score": round(final_score, 3),
            "corruption_ratio": round(corruption_ratio, 3),
            "noise_ratio": round(noise_ratio, 3),
            "alpha_ratio": round(alpha_ratio, 3)
        }

    def _noise_ratio(self, text):
        # Characters that are NOT alphanumeric, space, or common punctuation
        noise_chars = re.findall(r'[^a-zA-Z0-9\s.,!?-əöüçşğıƏÖÜÇŞĞİа-яА-ЯёЁäöüÄÖÜßàâçéèêëîïôûùÿÀÂÇÉÈÊËÎÏÔÛÙŸ]', text)
        return min(1.0, len(noise_chars) / max(len(text), 1))

    def _repetition_ratio(self, text):
        # 3 or more repetitions of same char
        repetitions = re.findall(r'(.)\1{3,}', text)
        return min(1.0, len(repetitions) / max(len(text), 1))

    def _alpha_ratio(self, text):
        alpha_chars = re.findall(r'[a-zA-ZəöüçşğıƏÖÜÇŞĞİа-яА-ЯёЁäöüÄÖÜßàâçéèêëîïôûùÿÀÂÇÉÈÊËÎÏÔÛÙŸ]', text)
        return min(1.0, len(alpha_chars) / max(len(text), 1))
