import json
from collections import Counter

with open('data/offline_tests.json', 'r', encoding='utf8') as f:
    db = json.load(f)

tests = db.get('Ümumi tarix 6', [])
heap = [t for t in tests if t.get('topic') == '1. Tarixdə il hesabı']

TOPIC_RULES = [
    ('7. Parfiya dövləti',
     ['parfiya', 'parfiy', 'arsak', 'ktesifon', 'nisa', 'mitridat', 'arşakid', 'surena', 'karra döyüş']),
    ('6. Oda sitayiş edənlər',
     ['zərdüşt', 'midiya', 'kiaksar', 'astiaq', 'əhəməni', 'dara', 'kserks', 'kir', 'ahura mazda', 'avesta',
      'darik', 'satrap', 'persepol', 'əhəmən', 'midiy', 'atropaten']),
    ('4. Şumerdən başlayan tarix',
     ['şumer', 'uruk', 'akkad', 'babil', 'hammurapi', 'mixi yazı', 'gilqameş', 'zikkurat', 'aşşur', 'mesopotam']),
    ('8. Tanrının döyüşçüləri',
     ['iskit', 'hun ', 'hun dövl', 'hun imper', 'mete tanhu', 'tanhu', 'sak ', 'sirak', 'idanfir',
      'pazırıq', 'essik', 'issik', 'iskit padş', 'qərbi hun', 'qədim türk', 'xaqanlıq', 'köçəri',
      'kurqan', 'skif', 'türk xaq']),
    ('11. Avropa mədəniyyətinin beşiyi',
     ['yunan', 'ellin', 'atina', 'sparta', 'olimpiya', 'akropol', 'parfenon', 'solon', 'perikl',
      'herodot', 'iskəndər', 'makedon', 'iskəndəriyy', 'afina', 'yunanl', 'yunan-əhəməni', 'agora']),
    ('2. İbtidai cəmiyyət',
     ['ibtidai', 'daş dövrü', 'neolit', 'paleolit', 'mezolit', 'tayfa', 'klan', 'piktografiya']),
    ('12. İlk Respublika yaradanlar',
     ['roma', 'latın', 'respublika', 'senat', 'konsul']),
]

# Manual overrides for the 2 unmatched tests
MANUAL = {
    'Qavqamela döyüşündə': '11. Avropa mədəniyyətinin beşiyi',  # İskəndər vs III Dara
    'İskit ordusunun əsasını': '8. Tanrının döyüşçüləri',
}

reclassified_count = Counter()
fixed = 0

for t in heap:
    q_full = (t.get('question', '') + ' ' + t.get('pedagogical_explanation', '')).lower()
    q_start = t.get('question', '')[:30]

    # Check manual overrides first
    new_topic = None
    for key, val in MANUAL.items():
        if key.lower() in q_start.lower():
            new_topic = val
            break

    if not new_topic:
        for topic_name, keywords in TOPIC_RULES:
            if any(kw in q_full for kw in keywords):
                new_topic = topic_name
                break

    if new_topic:
        t['topic'] = new_topic
        reclassified_count[new_topic] += 1
        fixed += 1
    else:
        t['topic'] = '[Arxiv] Xətalı Köhnə Generasiya'
        reclassified_count['[ARXIV]'] += 1

with open('data/offline_tests.json', 'w', encoding='utf8') as f:
    json.dump(db, f, ensure_ascii=False, indent=2)

print(f'Yenidən sistemləşdirildi: {fixed}/75 test\n')
print('Mövzu bölgüsü (yenilənmiş):')
for topic, count in sorted(reclassified_count.items()):
    print(f'  {topic}: {count}')

# Now show full statistics
print('\n\n=== ÜMUMİ TAİRX 6 — TAM STATİSTİKA (YENİLƏNMİŞ) ===')
with open('data/offline_tests.json', 'r', encoding='utf8') as f:
    db2 = json.load(f)

all_tests = db2.get('Ümumi tarix 6', [])
topic_counts = Counter([t.get('topic') for t in all_tests])

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

for t in ALL_TOPICS:
    count = topic_counts.get(t, 0)
    status = '✅' if count == 15 else ('⚠️' if 0 < count < 15 else '❌')
    print(f'  {status} {t}: {count}/15')

other = {k: v for k, v in topic_counts.items() if k not in ALL_TOPICS}
if other:
    print('\nDigər (arxiv/naməlum):')
    for k, v in other.items():
        print(f'  {k}: {v}')
