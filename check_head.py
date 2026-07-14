import json

try:
    with open('data/offline_tests_HEAD.json', 'r', encoding='utf8') as f:
        db = json.load(f)

    grade6_subjects = [
        'Azərbaycan dili 6', 'Riyaziyyat 6', 'Təbiət 6', 'Ümumi tarix 6', 
        'Coğrafiya 6', 'Azərbaycan tarixi 6', 'Ədəbiyyat 6', 'İnformatika 6', 
        'Texnologiya 6', 'İngilis dili 6', 'Rus dili 6', 'Alman dili 6', 'Fransız dili 6'
    ]
    
    out = []
    for subj in grade6_subjects:
        out.append(f'{subj}: {len(db.get(subj, []))}')
        
    with open('head_stats.txt', 'w', encoding='utf8') as f:
        f.write('\n'.join(out))
except Exception as e:
    with open('head_stats.txt', 'w', encoding='utf8') as f:
        f.write(str(e))
