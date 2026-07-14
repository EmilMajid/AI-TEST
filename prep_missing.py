import json
import re

db = json.load(open('data/offline_tests.json', 'r', encoding='utf8'))

subjects = [
    'Ədəbiyyat 5',
    'Texnologiya 5',
    'Alman dili 5 (əsas xarici dil)',
    'Fransız dili 5 (əsas xarici dil)',
    'İngilis dili 5 (əsas xarici dil)'
]

missing_data = []

for subj in subjects:
    tests = db.get(subj, [])
    
    # Exclude tests marked 'Təyin edilməyib' and 'Ümumiləşdirici və Nəzəri Testlər' from strict counts?
    # The user wants "mövzuları üzrə testləri minumum 15 ədədə çatmasını təmin et."
    # Yes, we should skip 'Təyin edilməyib' or 'Ümumiləşdirici və Nəzəri Testlər' maybe?
    # No, let's include them if they are actual valid topics for the subject.
    
    topics = {}
    for t in tests:
        tp = t.get('topic', 'Təyin edilməyib')
        topics[tp] = topics.get(tp, 0) + 1
        
    for tp, count in topics.items():
        if count < 15 and tp != 'Təyin edilməyib':
            shortfall = 15 - count
            missing_data.append({
                'subject': subj,
                'topic': tp,
                'needed': shortfall
            })

with open('missing_15.json', 'w', encoding='utf8') as f:
    json.dump(missing_data, f, ensure_ascii=False, indent=2)

print(f"Total topics needing tests: {len(missing_data)}")
