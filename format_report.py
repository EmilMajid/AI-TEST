import json
import re
from collections import defaultdict
from datetime import datetime

with open('c:/Users/User/Downloads/azerbaijanaiplatform/data/offline_tests.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

grades = defaultdict(list)

for key, tests in data.items():
    if not isinstance(tests, list): continue
    
    grade_match = re.search(r'\b(1[0-1]|[3-9])\b', key)
    if grade_match:
        grade = int(grade_match.group(1))
    else:
        grade = 0

    topics = set()
    valid_tests = 0
    for test in tests:
        if isinstance(test, dict):
            topics.add(test.get('topic', 'Mövzusuz'))
            valid_tests += 1
            
    num_topics = len(topics)
    num_tests = valid_tests
    
    clean_subj = key.replace(str(grade), '').strip() if grade else key
    clean_subj = clean_subj.replace('  ', ' ')
    
    found = False
    for item in grades[grade]:
        if item['subject'] == clean_subj:
            item['topics'].update(topics)
            item['tests'] += num_tests
            found = True
            break
            
    if not found:
        grades[grade].append({'subject': clean_subj, 'topics': topics, 'tests': num_tests})

out = []
now = datetime.now()
out.append(now.strftime('%d.%m.%Y %H:%M'))
out.append('')

for grade in sorted(grades.keys()):
    if grade == 0:
        out.append('Sinifi qeyd olunmayanlar / Arxiv:')
    else:
        out.append(f'{grade}-ci sinif')
        
    for item in sorted(grades[grade], key=lambda x: x['tests'], reverse=True):
        subj = item['subject']
        t_count = len(item['topics'])
        test_count = item['tests']
        avg = round(test_count / t_count, 1) if t_count > 0 else 0
        out.append(f'{subj} -- {t_count} mövzu -- {test_count} test - {avg} ortalama')
    out.append('')

with open('c:/Users/User/Downloads/azerbaijanaiplatform/offline_tests_report.txt', 'w', encoding='utf-8') as f:
    f.write('\n'.join(out))
