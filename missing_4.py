import json
import os
import math

db = json.load(open('data/offline_tests.json', encoding='utf8'))
chunks = []
if os.path.exists('data/textbook-chunks.jsonl'):
    for line in open('data/textbook-chunks.jsonl', encoding='utf8'):
        if line.strip():
            chunks.append(json.loads(line))

grade4Subjects = [cat for cat in db.keys() if cat.endswith(' 4') or '4-cü' in cat or ' 4 ' in cat]

def create_queue(subject_name, output_file):
    tests = db.get(subject_name, [])
    topicCounts = {}
    for t in tests:
        tp = t.get('topic', '').strip() or 'Mövzusuz'
        topicCounts[tp] = topicCounts.get(tp, 0) + 1
    
    subName = subject_name.replace(' 4', '').strip()
    subChunks = [c for c in chunks if c.get('subject') == subName and str(c.get('grade')) == '4']
    
    availableTopics = []
    for c in subChunks:
        tp = c.get('topic', '').strip() or c.get('section', '').strip()
        if tp and tp not in availableTopics:
            availableTopics.append(tp)
            
    queue = []
    for tp in availableTopics:
        count = topicCounts.get(tp, 0)
        needed = 15 - count
        if needed > 0:
            queue.append({'topic': tp, 'needed': needed})
            
    with open(output_file, 'w', encoding='utf8') as f:
        json.dump(queue, f, ensure_ascii=False, indent=2)
    print(f'Created {output_file} with {len(queue)} topics.')

create_queue('Riyaziyyat 4', 'queue_math4.json')
create_queue('Azərbaycan dili 4', 'queue_az4.json')
create_queue('İnformatika 4', 'queue_info4.json')
create_queue('Həyat bilgisi 4', 'queue_life4.json')
create_queue('Texnologiya 4', 'queue_tex4.json')
create_queue('Təsviri incəsənət 4', 'queue_art4.json')
create_queue('Fiziki tərbiyə 4', 'queue_pe4.json')
create_queue('Musiqi 4', 'queue_music4.json')
