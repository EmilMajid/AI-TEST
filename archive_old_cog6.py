import json

with open('data/offline_tests.json', 'r', encoding='utf8') as f:
    db = json.load(f)

tests = db.get('Coğrafiya 6', [])
renamed_count = 0

for t in tests:
    # Identify the old 180 tests:
    # 1. They have 'Bölmə 1. MƏKANI TANIYAQ' as topic
    # 2. Their passport ID has 'A-' (old notation) or they just look like the ones we sampled earlier.
    # Actually, any test with exactly 'Bölmə 1. MƏKANI TANIYAQ' as topic is the old one because the new ones have specific subtopics!
    if t.get('topic', '').strip() == 'Bölmə 1. MƏKANI TANIYAQ':
        t['topic'] = '[Arxiv/Xətalı] Köhnə Generasiya'
        renamed_count += 1

with open('data/offline_tests.json', 'w', encoding='utf8') as f:
    json.dump(db, f, ensure_ascii=False, indent=2)

print(f"Renamed {renamed_count} old tests to Archive.")
