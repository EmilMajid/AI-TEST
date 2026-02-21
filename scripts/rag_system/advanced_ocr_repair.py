"""
Advanced OCR Repair - Azərbaycan dilində OCR səhvlərini düzəldən AI agent
Bu modul Tesseract OCR-nin buraxdığı səhvləri pattern matching və dictionary lookup ilə düzəldir
"""
import re
from typing import Dict, List, Tuple

class AdvancedOCRRepair:
    """
    Azərbaycan dilində OCR səhvlərini düzəldən advanced sistem
    """
    
    # Sistemli OCR səhvləri - real data-dan əldə edilib
    SYSTEMATIC_ERRORS = {
        # Sait itkisi
        "AZRBAYCAN": "AZƏRBAYCAN",
        "RESPUBLKASININ": "RESPUBLİKASININ",
        "DVLT": "DÖVLƏT",
        "HMN": "HİMN",
        "Musiqisi": "Musiqisi",  # OK
        "zeyir": "Üzeyir",
        "Hacbylinin": "Hacıbəylinin",
        "szlri": "sözləri",
        "hmd": "Əhməd",
        "Cavadndr": "Cavadındır",
        
        # Ümumi sözlər
        "mumi": "ümumi",
        "thsil": "təhsil",
        "mssislrinin": "müəssisələrinin",
        "siniflri": "sinifləri",
        "tbit": "təbiət",
        "fnni": "fənni",
        "zr": "üzrə",
        "drslik": "dərslik",
        "hiss": "hissə",
        "Respublikas": "Respublikası",
        "Nazirliyi": "Nazirliyi",  # OK
        
        # License mətnləri
        "nr": "nəşr",
        "lisenziyas": "lisenziyası",
        "saytnda": "saytında",
        "latandr": "yerləşdirilib",
        "nrin": "nəşrin",
        "mzmunundan": "məzmunundan",
        "istifad": "istifadə",
        "edrkn": "edərkən",
        "szgedn": "sözügedən",
        "lisenziyann": "lisenziyanın",
        "rtlrini": "şərtlərini",
        "qbul": "qəbul",
        "etmi": "etmiş",
        "stinad": "İstinad",
        "zaman": "zamanı",
        "əmələlif": "müəllif",
        "gstrilmlidir": "göstərilməlidir",
        "Nrdn": "Nəşrdən",
        "kommersiya": "kommersiya",  # OK
        "məqsədil": "məqsədilə",
        "qadaandr": "qadağandır",
        "Trm": "TƏRİM",
        "nrlr": "nəşrlər",
        "orijinal": "orijinal",  # OK
        "yaylmaldr": "yayılmalıdır",
        "bal": "bağlı",
        "irad": "irad",  # OK
        "tkliflrinizi": "təkliflərini",
        "elektron": "elektron",  # OK
        "nvanlarna": "ünvanlarına",
        "gndrmyiniz": "göndərməyinizi",
        "xahi": "xahiş",
        "mkdalnz": "əməkdaşlığınız",
        "vvlcdn": "əvvəlcədən",
        "tkkr": "təşəkkür",
        
        # Ad və soyadlar
        "Yaln": "Yalçın",
        "slamzad": "İslamzadə",
        "Rad": "Rəşad",
        "Slimov": "Səlimov",
        "Elmar": "Elmar",  # OK
        "manov": "İmanov",
        "Famil": "Famil",  # OK
        "lkbrov": "Ələkbərov",
        "Ceyhun": "Ceyhun",  # OK
        "Cabarov": "Cabbarov",
        "Elad": "Elşad",
        "Yunusov": "Yunusov",  # OK
        "Abdullayev": "Abdullayev",  # OK
        "Mahir": "Mahir",  # OK
        "Srkrli": "Sərkərli",
        "Anar": "Anar",  # OK
        "Allahverdiyev": "Allahverdiyev",  # OK
        "Hsn": "Həsən",
        "Hsnov": "Həsənov",
        "Lamiy": "Lamiyə",
        "Msmalyeva": "Musaməliyeva",
        
        # Akronimlər
        "TTBBTT": "TƏBİƏT",
    }
    
    # Regex pattern-lər
    PATTERNS = [
        # "n kimi" → "nə kimi"
        (r'\bn kimi\b', 'nə kimi'),
        # "n n" → "nə üçün"
        (r'\bn n\b', 'nə üçün'),
        # "d " → "də "
        (r'\bd\s', 'də '),
        # "il " → "ilə "
        (r'\bil\s', 'ilə '),
    ]
    
    def __init__(self):
        # Case-insensitive lookup üçün lowercase dict
        self.errors_lower = {k.lower(): v for k, v in self.SYSTEMATIC_ERRORS.items()}
    
    def repair(self, text: str) -> str:
        """
        OCR səhvlərini düzəldir
        """
        if not text:
            return text
        
        # 1. Word-level replacement (case-preserving)
        words = text.split()
        repaired_words = []
        
        for word in words:
            # Punktuasiya ayır
            prefix = ""
            suffix = ""
            clean_word = word
            
            # Başlanğıcdakı punktuasiya
            while clean_word and not clean_word[0].isalnum():
                prefix += clean_word[0]
                clean_word = clean_word[1:]
            
            # Sondakı punktuasiya
            while clean_word and not clean_word[-1].isalnum():
                suffix = clean_word[-1] + suffix
                clean_word = clean_word[:-1]
            
            # Dictionary lookup
            if clean_word in self.SYSTEMATIC_ERRORS:
                repaired = self.SYSTEMATIC_ERRORS[clean_word]
            elif clean_word.lower() in self.errors_lower:
                # Case-insensitive match
                repaired = self.errors_lower[clean_word.lower()]
                # Preserve original case pattern
                if clean_word.isupper():
                    repaired = repaired.upper()
                elif clean_word[0].isupper():
                    repaired = repaired[0].upper() + repaired[1:]
            else:
                repaired = clean_word
            
            repaired_words.append(prefix + repaired + suffix)
        
        result = " ".join(repaired_words)
        
        # 2. Pattern-based replacement
        for pattern, replacement in self.PATTERNS:
            result = re.sub(pattern, replacement, result)
        
        return result
    
    def batch_repair(self, texts: List[str]) -> List[str]:
        """
        Bir neçə mətni eyni anda düzəldir
        """
        return [self.repair(text) for text in texts]
    
    def get_stats(self, text: str) -> Dict[str, int]:
        """
        Düzəliş statistikası
        """
        repaired = self.repair(text)
        return {
            "original_length": len(text),
            "repaired_length": len(repaired),
            "changes": sum(1 for a, b in zip(text.split(), repaired.split()) if a != b)
        }


if __name__ == "__main__":
    # Test
    repairer = AdvancedOCRRepair()
    
    test_text = """
    Yaln slamzad Rad Slimov Elmar manov Famil lkbrov Ceyhun Cabarov 
    TTBBTT mumi thsil mssislrinin -ci siniflri n tbit fnni zr drslik
    Azrbaycan Respublikas Elm və Təhsil Nazirliyi
    """
    
    print("ƏVVƏL:")
    print(test_text)
    print("\nSONRA:")
    print(repairer.repair(test_text))
    print("\nSTATİSTİKA:")
    print(repairer.get_stats(test_text))
