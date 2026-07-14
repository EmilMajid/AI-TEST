import json
import re
from collections import Counter

with open('data/offline_tests.json', 'r', encoding='utf8') as f:
    db = json.load(f)

tests = db.get('Texnologiya 6', [])
print(f"Total tests found for Texnologiya 6: {len(tests)}\n")

# Mövzu bölgüsü
topics = Counter([t.get('topic', 'Unknown') for t in tests])
print("=== Mövcud mövzu bölgüsü ===")
for t, c in sorted(topics.items(), key=lambda x: -x[1]):
    print(f'  "{t}": {c}')

# GS 2.1 audit
format_issues = {
    'old_options_dict': 0,
    'missing_correctAnswer': 0,
    'invalid_correctAnswer_type': 0,
    'explanation_with_variant_letter': 0,
    'missing_passport_id': 0
}

for t in tests:
    if isinstance(t.get('options'), dict):
        format_issues['old_options_dict'] += 1
    
    ans = t.get('correctAnswer')
    if ans is None:
        format_issues['missing_correctAnswer'] += 1
    elif not isinstance(ans, int):
        format_issues['invalid_correctAnswer_type'] += 1
        
    expl = t.get('pedagogical_explanation') or t.get('explanation', '')
    if expl:
        if re.search(r'\b[A-D]\s+variantı\b|\bCavab\s+[A-D]\b', expl, re.IGNORECASE):
            format_issues['explanation_with_variant_letter'] += 1
            
    if not t.get('passport_id'):
        format_issues['missing_passport_id'] += 1

print("\n=== Gold Standart 2.1 Audit ===")
all_ok = True
for issue, count in format_issues.items():
    icon = '✅' if count == 0 else '❌'
    if count > 0:
        all_ok = False
    print(f"  {icon} {issue}: {count}")

if all_ok:
    print("\n  ✅ Format tamamilə qüsursuzdur!")
else:
    print("\n  ⚠️ Format problemi var!")

# Now check against the 28 topics
ALL_TOPICS = [
    "1. Məktəbdə ünsiyyət və davranış mədəniyyəti",
    "2. Ailə büdcəsinin formalaşdırılması. Gəlir və xərc",
    "3. Divar əşyalarının bərkidilməsi və bərkitmə yerlərinin təmiri texnologiyası",
    "4. Qapı kilidlərinin növləri, quruluşu və quraşdırılması",
    "5. Sanitar-texniki avadanlıqların sadə təmiri",
    "6. Meyvə ağaclarının əkilməsi və meyvələrin saxlanma texnologiyası",
    "7. Oduncağın tədarükü və mişar materiallarının istehsalı",
    "8. Məmulatların konstruksiya edilməsi. Düzbucaqlı və müxtəlif formalı detalların çertyoju",
    "9. Tirciklərin birləşdirilməsi",
    "10. Əl alətləri ilə silindrik və konusşəkilli detalların hazırlanması",
    "11. Oduncaq və metal məmulatların bəzədilməsi",
    "12. Metal pəstahlann kəsilməsi",
    "13. Metal pəstahların yeyələnməsi. Ştangenpərgar",
    "14. Mexanikləşdirilmiş əl alətləri",
    "15. Elektrik enerjisinin ötürülməsi və istifadəsi yolları",
    "16. Sadə elektrik dövrəsi",
    "17. Detallann lehimləmə ilə birləşdirilməsi",
    "18. Mexanikləşdirilmiş mətbəx avadanlığının quruluşu və iş prinsipi",
    "19. İnsan həyatmda qida məhsulları",
    "20. Südlü xörəklərin hazırlanma texnologiyası",
    "21. Yarmadan, paxlalı bitkilərdən və makaron məmulatlarından xörəklərin hazırlanma texnologiyası",
    "22. Duru xəmirdən məmulatların hazırlanma texnologiyası",
    "23. Tərəvəz xörəklərinin hazırlanma texnologiyası",
    "24. Məişət tikiş maşınının quruluşu",
    "25. Tikiş maşınının işə hazırlanması",
    "26. Tikiş maşınında əməliyyatlar",
    "27. Naxıştikmə üçün alət və tərtibatlar. Hesab naxıştikməsinə hazırlıq",
    "28. Geyimin təmiri texnologiyası",
]

print("\n=== MÖVZU UYĞUNLUQ YOXLAMası (28 mövzu, hər biri 15 test) ===")
covered = 0
for t in ALL_TOPICS:
    c = topics.get(t, 0)
    if c >= 15:
        status = '✅'
        covered += 1
    elif c > 0:
        status = f'⚠️ ({c}/15)'
    else:
        status = '❌ 0'
    print(f"  {status} {t}: {c}")

other = {k: v for k, v in topics.items() if k not in ALL_TOPICS}
if other:
    print('\n=== Digər/Naməlum mövzular ===')
    for k, v in other.items():
        print(f'  "{k}": {v}')

print(f"\nTamamlanmış mövzular: {covered}/28")
print(f"Ümumi cəm: {len(tests)} test")
