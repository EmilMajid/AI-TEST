import json

with open('data/offline_tests.json', 'r', encoding='utf8') as f:
    db = json.load(f)

# Normalize topic names for Ümumi tarix 6
NAME_FIX = {
    '5. ikiçayarasının digər dövlətləri': '5. İkiçayarasının digər dövlətləri',
    '12. ilk Respublika yaradanlar':       '12. İlk Respublika yaradanlar',
    '4. Şumerdən başlayan tarix':          '4. Şumerdən başlayan tarix',  # keep consistent
}

fixed = 0
for t in db.get('Ümumi tarix 6', []):
    old = t.get('topic', '')
    if old in NAME_FIX:
        t['topic'] = NAME_FIX[old]
        fixed += 1

with open('data/offline_tests.json', 'w', encoding='utf8') as f:
    json.dump(db, f, ensure_ascii=False, indent=2)

print(f'Normalized {fixed} topic names.')

# Final stats
from collections import Counter
tests = db.get('Ümumi tarix 6', [])
counts = Counter(t.get('topic') for t in tests)

ALL_TOPICS = [
    '1. Tarixdə il hesabı',
    '2. İbtidai cəmiyyət',
    '3. Ehramlar ölkəsi',
    '4. Şumerdən başlayan tarix',
    '5. İkiçayarasının digər dövlətləri',
    '6. Oda sitayiş edənlər',
    '7. Parfiya dövləti',
    '8. Tanrının döyüşçüləri',
    '9. Böyük ipək yolunun başlandığı ölkə',
    '10. Şahmatın vətəni',
    '11. Avropa mədəniyyətinin beşiyi',
    '12. İlk Respublika yaradanlar',
]

print('\n=== YEKUNİ STATİSTİKA ===')
total_ok = 0
for topic in ALL_TOPICS:
    c = counts.get(topic, 0)
    if c == 15:
        status = '✅'
        total_ok += 1
    elif c > 15:
        status = '🔶 Artıq'
    elif c > 0:
        status = f'⚠️ ({c}/15)'
    else:
        status = '❌ Yoxdur'
    print(f'  {status} {topic}: {c}')

print(f'\nTamamlanmış mövzular: {total_ok}/12')

other = {k: v for k, v in counts.items() if k not in ALL_TOPICS}
if other:
    print('\nDigər:')
    for k, v in other.items():
        print(f'  "{k}": {v}')
