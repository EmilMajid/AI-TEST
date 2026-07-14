import json
import re
from collections import Counter

with open('data/offline_tests.json', 'r', encoding='utf8') as f:
    db = json.load(f)

tests = db.get('Texnologiya 6', [])

# Sualların başlanğıcında mövzu nömrəsi açıq şəkildə yazılıb.
# Format: '15. Elektrik...' mövzusunda ... (Test versiyası ...)
# Format: Metal emalı zamanı ('17. ...')
# Format: Məişət mədəniyyətində ('18. ...')
# Bunu regex ilə çıxararaq birbaşa mövzu nömrəsini müəyyən edəcəyik.

TOPIC_NAMES = {
    1: "1. Məktəbdə ünsiyyət və davranış mədəniyyəti",
    2: "2. Ailə büdcəsinin formalaşdırılması. Gəlir və xərc",
    3: "3. Divar əşyalarının bərkidilməsi və bərkitmə yerlərinin təmiri texnologiyası",
    4: "4. Qapı kilidlərinin növləri, quruluşu və quraşdırılması",
    5: "5. Sanitar-texniki avadanlıqların sadə təmiri",
    6: "6. Meyvə ağaclarının əkilməsi və meyvələrin saxlanma texnologiyası",
    7: "7. Oduncağın tədarükü və mişar materiallarının istehsalı",
    8: "8. Məmulatların konstruksiya edilməsi. Düzbucaqlı və müxtəlif formalı detalların çertyoju",
    9: "9. Tirciklərin birləşdirilməsi",
    10: "10. Əl alətləri ilə silindrik və konusşəkilli detalların hazırlanması",
    11: "11. Oduncaq və metal məmulatların bəzədilməsi",
    12: "12. Metal pəstahların kəsilməsi",
    13: "13. Metal pəstahların yeyələnməsi. Ştangenpərgar",
    14: "14. Mexanikləşdirilmiş əl alətləri",
    15: "15. Elektrik enerjisinin ötürülməsi və istifadəsi yolları",
    16: "16. Sadə elektrik dövrəsi",
    17: "17. Detalların lehimləmə ilə birləşdirilməsi",
    18: "18. Mexanikləşdirilmiş mətbəx avadanlığının quruluşu və iş prinsipi",
    19: "19. İnsan həyatında qida məhsulları",
    20: "20. Südlü xörəklərin hazırlanma texnologiyası",
    21: "21. Yarmadan, paxlalı bitkilərdən və makaron məmulatlarından xörəklərin hazırlanma texnologiyası",
    22: "22. Duru xəmirdən məmulatların hazırlanma texnologiyası",
    23: "23. Tərəvəz xörəklərinin hazırlanma texnologiyası",
    24: "24. Məişət tikiş maşınının quruluşu",
    25: "25. Tikiş maşınının işə hazırlanması",
    26: "26. Tikiş maşınında əməliyyatlar",
    27: "27. Naxıştikmə üçün alət və tərtibatlar. Hesab naxıştikməsinə hazırlıq",
    28: "28. Geyimin təmiri texnologiyası",
}

reclassified = Counter()
unmatched = []

for t in tests:
    q = t.get('question', '')
    # Try to find topic number embedded in question text
    # Patterns: '15. Foo' or "('17. Bar')" etc.
    m = re.search(r"'(\d{1,2})\.", q)
    if not m:
        m = re.search(r'"(\d{1,2})\.',  q)
    if not m:
        m = re.search(r'\b(\d{1,2})\.\s+[A-ZÜÖĞƏÇŞI]', q)

    if m:
        num = int(m.group(1))
        if num in TOPIC_NAMES:
            t['topic'] = TOPIC_NAMES[num]
            reclassified[TOPIC_NAMES[num]] += 1
        else:
            unmatched.append((q[:80], m.group(0)))
    else:
        # Try pedagogical explanation
        expl = t.get('pedagogical_explanation', '')
        m2 = re.search(r"'(\d{1,2})\.", expl)
        if m2:
            num = int(m2.group(1))
            if num in TOPIC_NAMES:
                t['topic'] = TOPIC_NAMES[num]
                reclassified[TOPIC_NAMES[num]] += 1
            else:
                unmatched.append((q[:80], 'expl:' + m2.group(0)))
        else:
            unmatched.append((q[:80], 'NO_MATCH'))

with open('data/offline_tests.json', 'w', encoding='utf8') as f:
    json.dump(db, f, ensure_ascii=False, indent=2)

total_fixed = sum(reclassified.values())
print(f"Reklassifikasiya: {total_fixed}/420 test mövzularına göre yenilendi\n")

print("=== Reklassifikasiya Nəticəsi ===")
for num in range(1, 29):
    name = TOPIC_NAMES[num]
    c = reclassified.get(name, 0)
    status = '✅' if c >= 15 else ('⚠️' if c > 0 else '❌')
    print(f"  {status} {name}: {c}/15")

print(f"\nTanımlanmamış (unmatched): {len(unmatched)} test")
for q, m in unmatched[:10]:
    print(f"  [{m}] {q}")
