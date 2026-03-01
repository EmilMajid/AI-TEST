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
    # Physics & Curriculum specific (Təbiət 5)
    "brabrdir": "bərabərdir",
    "brabr": "bərabər",
    "dm": "düşmə",
    "bucana": "bucağına",
    "bucan": "bucağın",
    "periskopdur": "periskopdur",
    "grmyimiz": "görməyimiz",
    "traf": "ətraf",
    "trafı": "ətrafı",
    # Hissə 2 corrections
    "Enerii": "Enerji",
    "Eneril": "Enerji",
    "BRPA": "BƏRPA",
    "ENERV4": "ENERJİ",
    "MNBLR": "MƏNBƏLƏR",
    "TB FLAKTLR": "TƏBİİ FƏLAKƏTLƏR",
    "Klk": "Külək",
    "Zlzlnin": "Zəlzələnin",
    "evrilir": "çevrilir",
    "evrilrkn": "çevrilərkən",
    "shvdir": "səhvdir",
    "ba verir": "baş verir",
    "mhduddur": "məhduddur",
    "irklnmsin": "çirklənməsinə",
    "ktlsi": "kütləsi",
    "zncir": "zəncir",
    "canllarn": "canlıların",
    "yrtc": "yırtıcı",
    "ikar": "şikar",
    "quraqlq": "quraqlıq",
    "razid": "ərazidə",
    "tmizlik": "təmizlik",
    "imk": "içmək",
    "tbil": "təbii",
    "tknmsin": "tükənməsinə",
    "qrlmas": "qırılması",
    "nsillr": "nəsillərə",
    "Eneriinin": "enerjinin",
    "Eneriiyə": "enerjiyə",
    "eneriisi": "enerjisi",
    "eneriisin": "enerjisinə",
    "eneriilrinin": "enerjilərinin",
    "evrilmdn": "çevrilmədən",
    "mhrrik": "mühərrik",
    "lelevizor": "Televizor",
    "mnblridir": "mənbələridir",
    "kemlidir": "keçməlidir",
    "Yanacan": "Yanacağın",
    "ktlsi": "kütləsi",
    "Klyin": "Küləyin",
    "evirmk": "çevirmək",
    "enerfisi": "enerjisi",
    "laqlri": "əlaqələri",
    "mhkm": "möhkəm",
    "ardcl": "ardıcıl",
    "gcn": "gücünü",
    "lmy": "ölçməyə",
    "ksiklr": "kəsiklər",
    "silklyin": "silkələyin",
    "ehmalca": "ehmalca",
    "eitdikd": "eşitdikdə",
    "yantlarn": "yağıntıların",
    "tinliklr": "çətinliklər",
    "Atmosferd": "Atmosferdə",
    "srmlrinin": "səhraların",
    "glck nsillr": "gələcək nəsillərə",
    "maariflndirici": "maarifləndirici",
    "istifadsi": "istifadəsi",
    "tkrar tmizlnmsi": "təkrar təmizlənməsi",
    "ttbiq edilmsi": "tətbiq edilməsi",
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
        
        # Physics specifically: "dm buca" -> "düşmə bucağı"
        text = re.sub(r'\bdm\s+bucağ', 'düşmə bucağ', text)
        text = re.sub(r'\bdm\s+buca', 'düşmə buca', text)
        text = re.sub(r'\bqaytma\b', 'qayıtma', text)
        text = re.sub(r'\biın\b', 'işığın', text)
        text = re.sub(r'\bn\s+qaytma', 'işığın qayıtma', text)
        
        # Repair dotless 'i' and capital 'Ə' if missed by Tesseract
        # (Though Tesseract 5 is usually good at this)
        
        return text
