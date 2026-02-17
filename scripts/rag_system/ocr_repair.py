# ocr_repair.py
import re

# Expanded common Azerbaijani OCR errors based on audit report
COMMON_FIXES = {
    # User-provided examples
    "hmiyyti": "əhəmiyyəti",
    "vardr": "vardır",
    "bdnimizi": "bədənimizi",
    "vziyytd": "vəziyyətdə",
    "nsan": "insan",
    "znginlir": "zənginləşir",
    "snq": "sınıq",
    "nahiyy": "nahiyə",
    "sars": "sarğı",
    "vziyytin": "vəziyyətinə",
    "mzakir": "müzakirə",
    "mayinsi": "müayinəsi",
    "vasitsil": "vasitəsilə",
    "grmk": "görmək",
    "mmkndr": "mümkündür",
    "frqlnir": "fərqlənir",
    "smk": "sümük",
    "smklr": "sümüklər",
    "birlrk": "birləşərək",
    "birlmlri": "birləşmələri",
    "ml": "əmələ",
    "gtirir": "gətirir",
    "hrktli": "hərəkətli",
    "yarmhrktli": "yarımhərəkətli",
    "ksr": "kəllə",
    "stununda": "sütununda",
    "glinir": "gəlinir",
    "birlir": "birləşir",
    "bilir": "bilir",
    "srbst": "sərbəst",
    "kild": "şəkildə",
    "mxtlif": "müxtəlif",
    "sbblrdn": "səbəblərdən",
    "sna": "sına",
    "bilr": "bilər",
    "snm": "sınmış",
    "brpa": "bərpa",
    "hkim": "həkim",
    "zdlnmi": "zədələnmiş",
    "qalsn": "qalsın",
    "bitisin": "bitişsin",
    "kmk": "kömək",
    "qrlmalar": "qırılmalar",
    "killrin": "şəkillərinə",
    # General Fixes
    "trbiy": "tərbiyə",
    "mktb": "məktəb",
    "mumthsil": "ümumtəhsil",
    "sas": "əsas",
    "fnlrdn": "fənlərdən",
    "salamln": "sağlamlığın",
    "agird": "şagird",
    "thsil": "təhsil",
    "inkiaf": "inkişaf",
    "faliyyt": "fəaliyyət",
    "hzrl": "hazırlıq",
    "mllr": "məşqlər",
    "vzif": "vəzifə",
    "tadris": "tədris",
    "vait": "vasitə",
    "sviyy": "səviyyə",
    "dyrl": "dəyər",
    "mvzu": "mövzu",
    "blm": "bölmə",
    "nc": "üçüncü",
    "kinci": "ikinci",
    "birinci": "birinci",
    "nzri": "nəzəri",
    "hyat": "həyat",
    "belki": "belə ki",
    "ntic": "nəticə",
    "ld": "əldə",
    "mqsd": "məqsəd",
    "xsiyyt": "şəxsiyyət",
    "fiziki": "fiziki",
}

class OCRRepair:
    """
    Azerbaijani vowel and letter recovery for noisy OCR text.
    """
    def repair(self, text: str) -> str:
        if not text:
            return ""
            
        # 1. Dictionary-based correction (Prefix matching at word boundaries)
        for wrong, correct in COMMON_FIXES.items():
            text = re.sub(rf"\b{wrong}", correct, text)
            
        # 2. Heuristic Pattern-based recovery
        text = self._recover_common_patterns(text)
        
        return text

    def _recover_common_patterns(self, text: str) -> str:
        # Common collapses: hrkt -> hərəkət, etc.
        text = re.sub(r'\bhrkt', 'hərəkət', text)
        text = re.sub(r'\bhrki', 'hərəki', text)
        
        # Repair dotless 'i' and capital 'Ə' if missed by Tesseract
        # (Though Tesseract 5 is usually good at this)
        
        return text
