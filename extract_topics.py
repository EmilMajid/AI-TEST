import json

with open('data/offline_tests.json', 'r', encoding='utf-8') as f:
    db = json.load(f)

res = []
for subj in ['Azərbaycan dili 3', 'Riyaziyyat 3', 'Həyat bilgisi 3', 'İnformatika 3', 'Texnologiya 3', 'İngilis dili 3', 'Русский язык 3', 'Alman dili 3', 'Fransız dili 3', 'Azərbaycan dili 4', 'Riyaziyyat 4', 'Həyat bilgisi 4', 'İnformatika 4', 'Texnologiya 4']:
    if subj not in db: continue
    items = db[subj]
    topics = {}
    for item in items:
        if 'questions' in item and isinstance(item['questions'], list):
            for q in item['questions']:
                t = q.get('topic', item.get('topic_key', 'Unknown'))
                topics[t] = topics.get(t, 0) + 1
        else:
            t = item.get('topic', 'Unknown')
            topics[t] = topics.get(t, 0) + 1
    
    res.append(f'### {subj}')
    for t, c in topics.items():
        res.append(f'- {t}: {c}')

with open('topic_counts3.txt', 'w', encoding='utf-8') as f:
    f.write('\n'.join(res))
print("DONE")
