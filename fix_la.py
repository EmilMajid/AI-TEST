import json
with open('data/offline_tests.json', 'r', encoding='utf8') as f:
    db = json.load(f)
c = 0
for t in db['Azərbaycan dili 6']:
    if t['topic'] == '"-la" şəkilçisinin funksiyaları':
        t['topic'] = '“-la” şəkilçisinin funksiyaları'
        c += 1
with open('data/offline_tests.json', 'w', encoding='utf8') as f:
    json.dump(db, f, ensure_ascii=False, indent=2)
print(f'Fixed {c} topics.')
