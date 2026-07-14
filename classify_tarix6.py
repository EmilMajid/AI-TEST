import json

with open('data/offline_tests.json', 'r', encoding='utf8') as f:
    db = json.load(f)

tests = db.get('Ümumi tarix 6', [])
heap = [t for t in tests if t.get('topic') == '1. Tarixdə il hesabı']

# Detect topic by keyword mapping in question text
TOPIC_MAP = [
    (2,  'İbtidai cəmiyyət',                   ['ibtidai', 'daş dövrü', 'neolit', 'paleolit', 'mezolit', 'əkinçi', 'tayfa', 'piktografiya', 'klan', 'icma']),
    (4,  'Şumerdən başlanan tarix',             ['şumer', 'uruk', 'ur', 'akkad', 'babil', 'hammurapi', 'mixi yazı', 'mesopotam', 'gilqameş', 'zikkurat']),
    (6,  'Oda sitayiş edənlər',                 ['zərdüşt', 'midiya', 'əhəməni', 'dara', 'kir', 'kserks', 'fars', 'ahura mazda', 'avesta', 'sitayiş', 'od']),
    (7,  'Parfiya dövləti',                     ['parfiya', 'arsak', 'ktesifon', 'mitridat', 'nisa', 'parfiy']),
    (8,  'Tanrının döyüşçüləri',               ['iskit', 'hun', 'türk', 'mete', 'tanhu', 'sak', 'nomad', 'qövlər', 'köçəri', 'xaqanlıq', 'kurqan', 'pazırıq']),
]

# Classify each test
groups = {num: [] for num, _, _ in TOPIC_MAP}
groups[0] = []  # Unclassified or truly "Tarixdə il hesabı"

for t in heap:
    q = (t.get('question', '') + ' ' + t.get('pedagogical_explanation', '')).lower()
    matched = False
    for num, name, keywords in TOPIC_MAP:
        if any(kw in q for kw in keywords):
            groups[num].append(t)
            matched = True
            break
    if not matched:
        groups[0].append(t)

print('=== Məzmun əsaslı qruplaşdırma nəticəsi ===\n')
for num, name, _ in TOPIC_MAP:
    g = groups[num]
    print(f'Mövzu {num}. "{name}": {len(g)} test')
    for t in g:
        print(f'   - {t.get("question", "")[:75]}')

print(f'\nMövzu 1 (Tarixdə il hesabı) - Müəyyənləşdirilməmiş: {len(groups[0])} test')
for t in groups[0]:
    print(f'   - {t.get("question", "")[:80]}')
