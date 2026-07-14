import json

with open('data/offline_tests.json', 'r', encoding='utf8') as f:
    db = json.load(f)

tests = db.get('Rus dili 6', [])
print(f"Rus dili 6 cəmi: {len(tests)} test")

ARCHIVE_KEY = '[Arxiv] Xətalı Köhnə Generasiya'
if ARCHIVE_KEY not in db:
    db[ARCHIVE_KEY] = []

moved = 0
for t in tests:
    t['archived_from'] = 'Rus dili 6'
    t['archive_reason'] = 'Şablon testlər - mövzuya uyğun deyil'
    db[ARCHIVE_KEY].append(t)
    moved += 1

db['Rus dili 6'] = []

with open('data/offline_tests.json', 'w', encoding='utf8') as f:
    json.dump(db, f, ensure_ascii=False, indent=2)

print(f"Köçürüldü: {moved} test → [{ARCHIVE_KEY}]")
print(f"Rus dili 6 artıq: {len(db['Rus dili 6'])} test")
