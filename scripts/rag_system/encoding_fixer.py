# encoding_fixer.py
import re

class EncodingFixer:
    """
    Fixes "Mojibake" corruption where Azerbaijani text in Windows-1251/Cyrillic
    is misinterpreted as Windows-1252 (Latin-1).
    Example: "Ìÿëóìäóð" -> "Məlumdur"
    """
    def __init__(self):
        # Mojibake char -> Intended Azerbaijani Latin char
        # Based on common Windows-1251 (Cyrillic) to Azerbaijani Latin mapping
        self.map = {
            'Ì': 'M', 'ÿ': 'ə', 'ë': 'l', 'ó': 'u', 'ì': 'm', 'ä': 'd', 'ð': 'r',
            'ê': 'k', 'î': 'o', 'ï': 'p', 'ö': 'ü', 'ò': 't', 'å': 'e', 'è': 'i',
            'í': 'n', 'ô': 'f', 'à': 'a', 'ñ': 's', 'é': 'y', 'û': 'ı', 'ã': 'q',
            'ù': 'h', 'ø': 'ş', 'ú': 'z', 'ÿ': 'ə', 'ú': 'z', 'ö': 'ü', 'ù': 'h',
            # Caps
            'Ï': 'P', 'Ð': 'R', 'Ñ': 'S', 'Ò': 'T', 'Ó': 'U', 'Â': 'V', 'Õ': 'X',
            'Þ': 'Y', 'Ç': 'Z', 'À': 'A', 'Á': 'B', 'Â': 'V', 'Ã': 'G', 'Ä': 'D',
            'Å': 'E', 'Æ': 'J', 'Ç': 'Z', 'È': 'İ', 'É': 'Y', 'Ê': 'K', 'Ë': 'L',
            'Ì': 'M', 'Í': 'N', 'Î': 'O', 'Ï': 'P', 'Ð': 'R', 'Ñ': 'S', 'Ò': 'T',
            'Ó': 'U', 'Ô': 'F', 'Õ': 'H', 'Ö': 'Ü', '×': 'Ç', 'Ø': 'Ş', 'Ù': 'H',
            'Ü': 'Ü', 'Ý': 'E', 'Þ': 'Y', 'ß': 'S',
            # Add specific ones found in the user example
            'ÿ': 'ə', 'ù': 'h' # already in there but let's be safe
        }
        # Refined mapping for the specific case provided
        self.ext_map = {
            'ø': 'ş', 'ÿ': 'ə', 'ö': 'ü', '÷': 'ç', 'û': 'ı', 'ù': 'h', 'à': 'a',
            'á': 'b', 'â': 'v', 'ã': 'g', 'ä': 'd', 'å': 'e', 'æ': 'j', 'ç': 'z',
            'è': 'i', 'é': 'y', 'ê': 'k', 'ë': 'l', 'ì': 'm', 'í': 'n', 'î': 'o',
            'ï': 'p', 'ð': 'r', 'ñ': 's', 'ò': 't', 'ó': 'u', 'ô': 'f', 'õ': 'x',
            'ö': 'ü', '÷': 'ç', 'ø': 'ş', 'ù': 'h', 'ú': 'z', 'û': 'ı', 'ü': 'ü'
        }
        # Combine maps
        self.full_map = self.map.copy()
        self.full_map.update(self.ext_map)

    def is_mojibake(self, text: str) -> bool:
        """Detects if string contains high concentration of high-byte chars."""
        if not text: return False
        high_chars = len(re.findall(r'[\u00C0-\u00FF]', text))
        return (high_chars / len(text)) > 0.1

    def fix(self, text: str) -> str:
        if not self.is_mojibake(text):
            return text
            
        fixed = []
        for char in text:
            fixed.append(self.full_map.get(char, char))
        
        return "".join(fixed)
