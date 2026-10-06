import json
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

test_sentences = [
    "Bir neçə musiqiçinin birgə ifasına ansambl deyilir.",
    "Bu hadisəyə işığın sınması deyilir.",
    "Maddənin tərkibində dəyişikliyin müşahidə olunmadığı hadisələrə fiziki hadisələr deyilir.",
    "Enerjinin bu xüsusiyyətinə enerjinin saxlanması qanunu deyilir.",
    "İşığın yayıldığı maddələrə optik mühit deyilir.",
    "İşığın sınmasının səbəb olduğu bu göz aldanmasına ilğım deyilir.",
    "Ovlanan və yırtıcı tərəfindən yeyilən heyvana isə şikar deyilir.",
    "Bir cisim işığı keçirmirsə, ona qeyri-şəffaf cisim deyilir.",
    "Kompüterə verilən komandalar toplusuna proqram deyilir.",
    "ax² + bx + c = 0 şəklində olan tənliyə kvadrat tənlik deyilir."
]

p_dative_term = re.compile(r'\b\w+(?:[yn]?[aə]|[ld]?[aə]r[aə])\s+(?:isə\s+|həm\s+də\s+)?([A-Za-zƏəÖöÜüİiIıĞğÇçŞş\-\s]{3,35})\s+(?:deyilir|adlanır|adlandırılır)\.', re.I)

print("Testing Azerbaijani Dative-to-Nominative Term Extractor:")
for s in test_sentences:
    m = p_dative_term.search(s)
    if m:
        term = m.group(1).strip()
        print(f"  Sentence: {s}")
        print(f"  -> Extracted Term: '{term}'\n")
    else:
        print(f"  NO MATCH: {s}")
