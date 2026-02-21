
# expand_az_dictionary.py
import json
import re
from pathlib import Path
from collections import Counter

def main():
    base_dir = Path(__file__).parent.parent
    textbooks_json = base_dir / "data" / "textbooks.json"
    dict_dir = base_dir / "data" / "dictionaries"
    dict_dir.mkdir(parents=True, exist_ok=True)
    az_dict_path = dict_dir / "az.txt"

    # 1. Load existing dictionary if any
    existing_words = set()
    if az_dict_path.exists():
        with open(az_dict_path, "r", encoding="utf-8") as f:
            existing_words = {line.strip().lower() for line in f if line.strip()}

    # Supplement with common academic and textbook terms
    # Supplement with common academic and textbook terms
    academic_words = [
        "və", "ya", "yaxud", "amma", "ancaq", "lakin", "çünki", "isə", "halbuki", "məhz",
        "belə", "beləliklə", "nəticədə", "nəhayət", "xüsusən", "məsələn", "təbii", "əlbəttə",
        "şübhəsiz", "yəqin", "bəlkə", "ehtimal", "mümkün", "zəruri", "vacib", "əsas",
        "mühüm", "kiçik", "böyük", "orta", "yüksək", "aşağı", "ümumi", "xüsusi", "fərdi",
        "milli", "beynəlxalq", "rəsmi", "qeyri", "təxminən", "tamamilə", "qismən", "kifayət",
        "çoxlu", "azacıq", "bir neçə", "hər hansı", "istənilən", "müəyyən", "naməlum",
        "fərqli", "oxşar eyni", "tərs", "düz", "əyri", "parallell", "perpendikulyar"
    ]
    
    # Subject specific blocks
    history_words = ["tarixi", "xanlıq", "imperiya", "dövlətçilik", "səfəvilər", "atabəylər", "şirvanşahlar", "qədim", "orta", "yeni", "müasir", "dövr", "mərhələ", "hadisə", "şəxsiyyət", "fərman", "müqavilə", "sülh", "müharibə", "döyüş"]
    nature_words = ["biologiya", "fizika", "kimya", "coğrafiya", "təbiət", "aləm", "canlı", "cansız", "hüceyrə", "orqanizm", "mühit", "ekologiya", "planet", "ulduz", "qalaktika", "maddə", "enerji", "qüvvə", "hərəkət", "zaman", "məkan"]
    math_words = ["ədəd", "rəqəm", "riyazi", "hesab", "toplama", "çıxma", "vurma", "bölmə", "tənlik", "məsələ", "misal", "həndəsə", "triqonometriya", "funksiya", "qrafik", "sahə", "həcm", "perimetr", "bucağı", "tərəfi"]

    common_words = [
        "vətən", "ölkə", "tarix", "dövlət", "xalq", "milli", "mədəniyyət", "elm", "təhsil",
        "məktəb", "şagird", "müəllim", "dərs", "kitab", "oxumaq", "yazmaq", "bilik", "bacarıq",
        "dünya", "yer", "günəş", "ay", "ulduz", "təbiət", "heyvan", "bitki", "su", "hava",
        "od", "torpaq", "insan", "həyat", "sağlamlıq", "idman", "oyun", "rəqs", "musiqi",
        "rəsm", "incəsənət", "ədəbiyyat", "dil", "ana", "ata", "bacı", "qardaş", "ailə",
        "dost", "yoldaş", "uşaq", "gənc", "qoca", "şəhər", "kənd", "küçə", "meydan",
        "park", "bağ", "meşə", "dağ", "çay", "dəniz", "göl", "okean", "ada", "sahil",
        "bulaq", "şəlalə", "vadi", "düzənlik", "səhra", "qütb", "iqlim", "hava", "külək",
        "yağış", "qar", "duman", "şimşək", "ildırım", "fəsil", "yaz", "yay", "payız", "qış",
        "vaxt", "zaman", "saat", "dəqiqə", "saniyə", "gün", "həftə", "ay", "il", "əsər",
        "qədim", "yeni", "müasir", "gələcək", "keçmiş", "hadisə", "fəaliyyət", "iş", "əmək",
        "istehsal", "ticarət", "iqtisadiyyat", "siyasət", "hüquq", "qanun", "azadlıq",
        "müstəqillik", "respublika", "prezident", "parlament", "hökumət", "ordu", "əsgər",
        "qəhrəman", "şəhid", "qələbə", "zəfər", "sülh", "müharibə", "döyüş", "hücum",
        "müdafiə", "bayraq", "gerb", "himn", "paytaxt", "bakı", "naxçıvan", "gəncə",
        "sumqayıt", "lənkəran", "şəki", "şuşa", "qarabağ", "ağdam", "füzuli", "zəngilan",
        "qubadlı", "kəlbəcər", "laçın", "cəbrayıl", "xocalı", "xankəndi", "tərtər",
        "beyləqan", "saatlı", "sabirabad", "hacıqabul", "şirvan", "salyan", "neftçala",
        "cəlilabad", "biləsuvar", "yardımlı", "lerik", "astara", "masallı", "göyçay",
        "uqar", "axacaq", "daşqın", "zəlzələ", "yanğın", "təhlükə", "ehtiyat", "qayda",
        "nəqliyyat", "avtomobil", "qatar", "təyyarə", "gəmi", "velosiped", "metro",
        "rabitə", "telefon", "internet", "kompüter", "texnologiya", "kosmos", "raket",
        "peyk", "astronomiya", "fizika", "kimya", "biologiya", "riyaziyyat", "informatika",
        "coğrafiya", "məntiq", "psixologiya", "fəlsəfə", "din", "mənəviyyat", "əxlaq",
        "adət", "ənənə", "bayram", "novruz", "ramazan", "qurban", "müəllif", "nəşr",
        "redaktor", "tərcümə", "lətifə", "nağıl", "dastan", "bayatı", "qoşma", "qəzəl",
        "şeir", "nəsr", "dram", "teatr", "kino", "televiziya", "radio", "qəzet", "jurnal"
    ]

    # Add more complex words to ensure coverage
    more_words = [
        "və", "ilə", "üçün", "görə", "sonra", "əvvəl", "kimi", "qədər", "daxil", "xaric",
        "olan", "olmaq", "etmək", "demək", "görmək", "bilmək", "gəlmək", "getmək", "qalmaq",
        "çıxmaq", "tapmaq", "almaq", "vermək", "çalışmaq", "yaşamaq", "yaratmaq", "qurmaq",
        "açmaq", "bağlamaq", "baxmaq", "dinləmək", "anlamaq", "öyrənmək", "öyrətmək",
        "dəyişmək", "artmaq", "azalmaq", "bitmək", "başlamaq", "müxtəlif", "eyni", "həmin",
        "başqa", "öz", "hər", "bütün", "bəzi", "çox", "az", "bir", "iki", "üç", "dörd", "beş",
        "altı", "yeddi", "səkkiz", "doqquz", "on", "yüz", "min", "milyon", "birinci", "ikinci",
        "üçüncü", "hansı", "nə", "kim", "hara", "necə", "nə vaxt", "niyə", "çünki", "yaxşı",
        "pis", "böyük", "kiçik", "hündür", "alçaq", "eni", "uzun", "dar", "geniş", "isti",
        "soyuq", "yumşaq", "bərk", "ağır", "yüngül", "sürətli", "yavaş", "güclü", "zəif",
        "gözəl", "çirkin", "açıq", "tünd", "ağ", "qara", "qırmızı", "göy", "yaşıl", "sarı",
        "narıncı", "bənövşəyi", "qəhvəyi", "boz", "çəhrayı", "parlaq", "solğun"
    ]

    all_words = existing_words.union(set(common_words)).union(set(more_words))
    all_words = all_words.union(set(academic_words)).union(set(history_words)).union(set(nature_words)).union(set(math_words))
    
    # Add common suffixes as words potentially (sometimes they get split)
    suffixes = ["lar", "lər", "dan", "dən", "nın", "nin", "nun", "nün", "da", "də", "ya", "yə", "un", "ün", "ın", "in"]
    all_words = all_words.union(set(suffixes))

    
    # Sort and save
    sorted_words = sorted(list(all_words))
    with open(az_dict_path, "w", encoding="utf-8") as f:
        for w in sorted_words:
            f.write(f"{w}\n")

    print(f"[*] Expanded Azerbaijani dictionary to {len(sorted_words)} words.")

if __name__ == "__main__":
    main()
