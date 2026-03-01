# encoding_fixer.py
import re
import logging

class EncodingFixer:
    """
    Advanced Encoding Fixer for DUİS Spec.
    Fixes "Mojibake" corruption and PDF font mapping issues (ø, ù, ԥ).
    """
    def __init__(self):
        self.logger = logging.getLogger(__name__)
        
        # 1. Standard Win-1251 to Latin mapping
        self.win1251_map = {
            'Ì': 'M', 'ÿ': 'ə', 'ë': 'l', 'ó': 'u', 'ì': 'm', 'ä': 'd', 'ð': 'r',
            'ê': 'k', 'î': 'o', 'ï': 'p', 'ö': 'ü', 'ò': 't', 'å': 'e', 'è': 'i',
            'í': 'n', 'ô': 'f', 'à': 'a', 'ñ': 's', 'é': 'y', 'û': 'ı', 'ã': 'q',
            'ù': 'h', 'ø': 'ş', 'ú': 'z',
            'Ï': 'P', 'Ð': 'R', 'Ñ': 'S', 'Ò': 'T', 'Ó': 'U', 'Â': 'V', 'Õ': 'X',
            'Þ': 'Y', 'Ç': 'Z', 'À': 'A', 'Á': 'B', 'Ã': 'G', 'Ä': 'D',
            'Å': 'E', 'Æ': 'J', 'È': 'İ', 'É': 'Y', 'Ê': 'K', 'Ë': 'L',
            'Î': 'O', 'Ô': 'F', '×': 'Ç', 'Ø': 'Ş', 'Ù': 'H', 'Ü': 'Ü', 'Ý': 'E'
        }
        
        # 2. DUİS Specific Font Mapping (ø, ù, ԥ, etc.)
        self.duis_map = {
            'øù': 'İş', ')ԥDOL\\ԥW': 'fəaliyyət', 'TԥOLPDW': 'Təlimat',
            '$GGÕP': 'Addım', 'G]ԥOGLQ': 'düzəldin', '1ԥWLFԥ': 'Nəticə',
            'ԥ': 'ə', 'ø': 'ş', 'ù': 'h'
        }
        
        # Expanded char-by-char guessing for DUİS
        # Only include non-conflicting mappings
        self.duis_char_map = {
            'ԥ': 'ə', 'Õ': 'ı', 'ø': 'ş', 'ù': 'h', 'L': 'i', 'O': 'l', 'P': 'm',
            'D': 'a', 'W': 't', 'G': 'd', 'Z': 'z', 'Q': 'n', 'H': 'e', 'U': 'r',
            'V': 's', 'X': 'u', 'S': 'p', 'R': 'f', 'K': 'k', 'I': 'ı', 'J': 'g',
            'B': 'b', 'C': 'c', 'E': 'e', 'F': 'f', 'Y': 'y',
            '[': 'x', ']': 'ü', '\\': 'y', ')': 'f', '÷': 'ğ', '1': 'N', '$': 'A',
            'Ԥ': 'ə'
        }

        # 3. UTF-8 as Latin-1 Mojibake
        self.utf8_mojibake = {
            'É™': 'ə', 'Æ': 'ə', 'ÅŸ': 'ş', 'Åž': 'ş', 'Ã§': 'ç', 'Ã‡': 'ç',
            'Ã¶': 'ö', 'Ã–': 'ö', 'Ã¼': 'ü', 'Ãœ': 'ü', 'Ä±': 'ı', 'Ä°': 'i',
            'ÄŸ': 'ğ', 'Äž': 'ğ'
        }

    def detect_anomalies(self, text: str) -> dict:
        """Calculates anomaly ratio and confidence for DUİS spec."""
        if not text: return {"ratio": 0, "confidence": 1.0}
        
        anomalous_patterns = [r'[øùԥԤԦԧԨԩԪԫ]', r'\\u[0-9a-fA-F]{4}']
        total_anomalies = 0
        for pattern in anomalous_patterns:
            matches = re.findall(pattern, text)
            total_anomalies += len(matches)
            
        ratio = total_anomalies / max(len(text), 1)
        
        # Check for Azerbaijan specific letter absence in long text
        az_letters = set('əışçğöüİ')
        has_az = any(c in az_letters for c in text)
        
        confidence = 1.0 - (ratio * 10) # Aggressive drop
        if len(text) > 100 and not has_az and ratio > 0.01:
            confidence *= 0.5
            
        return {
            "ratio": round(ratio, 4),
            "confidence": round(max(confidence, 0), 2),
            "total_anomalies": total_anomalies
        }

    def fix_mojibake(self, text: str) -> str:
        """Apply sequential fixes for Mojibake and font mapping."""
        if not text: return text
        
        # 1. Fix UTF-8 decoded as Latin-1
        for moj, fixed in self.utf8_mojibake.items():
            text = text.replace(moj, fixed)
            
        # 2. Check for DUIS corruption
        stats = self.detect_anomalies(text)
        if stats["ratio"] > 0.01:
            # Apply DUIS Mapping
            for broken, fixed in self.duis_map.items():
                text = text.replace(broken, fixed)
            
            # Char-by-char fallback for high corruption
            if stats["ratio"] > 0.05:
                fixed_chars = []
                for char in text:
                    fixed_chars.append(self.duis_char_map.get(char, char))
                text = "".join(fixed_chars)
                
        # 3. Final Win-1251 attempt
        if self.is_high_byte(text):
            fixed = "".join([self.win1251_map.get(c, c) for c in text])
            text = fixed
            
        return text

    def is_high_byte(self, text: str) -> bool:
        if not text: return False
        high_chars = len(re.findall(r'[\u00C0-\u00FF]', text))
        return (high_chars / len(text)) > 0.1

    def fix(self, text: str) -> str:
        """Main entry point for pipeline."""
        return self.fix_mojibake(text)
