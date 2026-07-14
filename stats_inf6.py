import json
from collections import Counter

with open('data/offline_tests.json', 'r', encoding='utf8') as f:
    db = json.load(f)

tests = db.get('İnformatika 6', [])
counts = Counter(t.get('topic') for t in tests)

ALL_TOPICS = [
    "1. Kompüter necə işləyir",
    "2. İnformasiya harada saxlanılır",
    "3. Ədədi informasiya necə kodlaşdırılır",
    "4. İnformasiya nə qədər yer tutur",
    "5. Proqramı başlatmağın bir neçə üsulu",
    "6. Şəklin kompüterdə saxlanması və çapı",
    "7. Mətnin görünüşünün yaxşılaşdırılması",
    "8. Abzasın formatlanması",
    "9. Elektron təqdimatlar",
    "10. Slaydlarla iş",
    "11. Obyektin informasiya modeli",
    "12. Alqoritmin xassələri",
    "13. Alqoritmin növləri",
    "14. Dövri alqoritmlər",
    "15. Əyləncəli məsələlər",
    "16. Proqramda dəyişənlər",
    "17. Proqramlaşdırma mühitində seçim",
    "18. Proqramlaşdırma mühitində dövr",
    "19. Dövrlər və naxışlar",
    "20. Proqramlaşdırma mühitində musiqi",
    "21. İnformasiya resursları ilə iş mərhələləri",
    "22. Dünya hörümçək torunda gəzişmə",
    "23. İnternetdə axtarış",
    "24. Elektron poçt",
    "25. Elektron poçtla məktublaşma"
]

print('\n=== İNFORMATİKA 6 STATİSTİKA ===')
total_ok = 0
for t in ALL_TOPICS[:6] + [ALL_TOPICS[6]]: # Just check the first 7 topics
    c = counts.get(t, 0)
    if c >= 15:
        status = '✅'
        total_ok += 1
    else:
        status = f'⚠️ ({c}/15)'
    print(f'  {status} {t}: {c}')
