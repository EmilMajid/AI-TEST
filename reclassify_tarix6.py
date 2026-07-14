import json
from collections import Counter

with open('data/offline_tests.json', 'r', encoding='utf8') as f:
    db = json.load(f)

tests = db.get('Ümumi tarix 6', [])
heap = [t for t in tests if t.get('topic') == '1. Tarixdə il hesabı']

# Comprehensive keyword map ordered by specificity (most specific first)
TOPIC_RULES = [
    ('7. Parfiya dövləti',
     ['parfiya', 'parfiy', 'arsak', 'ktesifon', 'nisa', 'mitridat', 'arşakid', 'surena', 'karra döyüş']),
    
    ('6. Oda sitayiş edənlər',
     ['zərdüşt', 'midiya', 'kiaksar', 'astiaq', 'əhəməni', 'dara', 'kserks', 'kir', 'ahura mazda', 'avesta',
      'darik', 'satrap', 'sarp', 'persepol', 'əhəmən', 'midiy', 'mid dövl', 'atropaten']),

    ('4. Şumerdən başlanan tarix',
     ['şumer', 'uruk', 'ur şəh', 'akkad', 'babil', 'hammurapi', 'mixi yazı', 'gilqameş', 'zikkurat',
      'ur-namma', 'şumer məkt', 'şumer cəm', 'şumer astron', 'şumer şəhər', 'aşşur', 'asuriya',
      'sumer', 'mesopotam']),

    ('5. İkiçayarasının digər dövlətləri',
     ['aşşur ordusu', 'aşşur döv', 'aşşurban', 'yeni babil', 'xaldey', 'nebukadnezar']),

    ('8. Tanrının döyüşçüləri',
     ['iskit', 'hun ', 'hun dövl', 'hun imper', 'mete tanhu', 'tanhu', 'sak ', 'sirak', 'idanfir',
      'pazırıq', 'essik', 'issik', 'iskit padş', 'qərbi hun', 'qədim türk', 'xaqanlıq', 'köçəri',
      'kurqan', 'türk xaq', 'sarmat', 'skif']),

    ('2. İbtidai cəmiyyət',
     ['ibtidai', 'daş dövrü', 'neolit', 'paleolit', 'mezolit', 'ilk əkinç', 'tayfa', 'klan',
      'piktografiya', 'icma', 'totemizm', 'animizm', 'ovsun']),

    ('11. Avropa mədəniyyətinin beşiyi',
     ['yunan', 'ellin', 'atina', 'sparta', 'olimpiya', 'akropol', 'parfenon', 'solon', 'perikl',
      'herodot', 'iskəndər', 'makedon', 'iskəndəriyy', 'afina', 'hellen', 'qərb sivil',
      'afinada', 'yunanl', 'yunan-əhəməni', 'agora', 'feodal', 'misir ehram']),

    ('12. İlk Respublika yaradanlar',
     ['roma', 'latın', 'respublika', 'senat', 'konsul', 'sezar', 'august']),

    ('1. Tarixdə il hesabı',
     ['eramızdan əvvəl', 'e.ə.', 'xronolog', 'il hesabı', 'milad', 'xristos', 'tarix elmi',
      'herodot tarixi', 'tarixçi']),
]

reclassified = {}
unmatched = []

for t in heap:
    q_full = (t.get('question', '') + ' ' + t.get('pedagogical_explanation', '')).lower()
    matched_topic = None
    for topic_name, keywords in TOPIC_RULES:
        if any(kw in q_full for kw in keywords):
            matched_topic = topic_name
            break
    if matched_topic:
        reclassified.setdefault(matched_topic, []).append(t)
    else:
        unmatched.append(t)

print('=== YENİDƏN SİSTEMLƏŞDİRMƏ NƏTİCƏSİ ===\n')
for topic, tlist in sorted(reclassified.items()):
    print(f'{topic}: {len(tlist)} test')

print(f'\nTanımlanmamış (Uyğun mövzu tapılmadı): {len(unmatched)} test')
for t in unmatched:
    print(f'  - {t.get("question", "")[:80]}')

print('\n\n=== TƏSDİQLƏ VƏ YARAT ===')
print('Bu skripti apply_tarix6_reclassify.py faylı kimi yadda saxla.')
print('İstifadəçi təsdiq edərsə, bütün 75 testi yenidən mövzulara görə "topic" sahəsi yenilənəcək.')
