import json
import sys
import io

if sys.platform == 'win32':
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

targets = ['ingilis-dili-5', 'ingilis-dili-2-5']
stats = {t: {'chunks': 0, 'sections': set()} for t in targets}

try:
    with open('data/textbook-chunks.jsonl', 'r', encoding='utf-8') as f:
        for line in f:
            try:
                obj = json.loads(line)
                bid = obj.get('book_id')
                if bid in targets:
                    stats[bid]['chunks'] += 1
                    sec_title = obj.get('section_title')
                    if sec_title is not None:
                        stats[bid]['sections'].add(sec_title.strip())
            except: pass
except: pass

for bid, data in stats.items():
    print(f'\n>> Book: {bid}')
    print(f'   Total Chunks: {data["chunks"]}')
    print(f'   Unique Sections: {len(data["sections"])}')
    
    sorted_sections = sorted(list(data['sections']))
    
    if bid == 'ingilis-dili-5':
        print('   Sample Sections (Head/Tail):')
        for s in sorted_sections[:15]: print('     -', s)
        print('     ...')
        for s in sorted_sections[-10:]: print('     -', s)
    else:
        print('   All Sections for ingilis-dili-2-5:')
        for s in sorted_sections: print('     -', s)
