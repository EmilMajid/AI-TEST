import json
import os
from pathlib import Path

# TOC Configuration
TOCS = {
    'rus-dili-esas-10': [
        'I Ty dykhanye moyo, Azerbaydzhan!',
        'II Zastyvshaya v kamne muzyka',
        'III Zhizn v obrazakh i slovakh',
        'IV Universalnyy yazyk chelovechestva',
        'V Poeziya, kotoruyu vidyat',
        'VI Legendarnyye zhenshchiny Azerbaydzhana',
        'VII Velikoye iskusstvo kino'
    ],
    'ingilis-dili-esas-10': [
        'UNIT 1 KINDNESS', 'UNIT 2 WE ARE VICTORIOUS!', 'UNIT 3 CULTURES',
        'UNIT 4 ENVIRONMENTAL PROBLEMS', 'UNIT 5 SUCCESS', 'UNIT 6 HEALTH IS WEALTH!',
        'UNIT 7 STAGES OF LIFE', 'UNIT 8 HAPPINESS', 'UNIT 9 MEDIA'
    ],
    'alman-dili-esas-10': [
        'I MEDIEN UND TECHNOLOGIE', 'II GESUNDHEIT UND FITNESS', 'III REISEN MACHT SPASS',
        'IV DAS BRAUCHE ICH!', 'V FÜR MENSCH UND UMWELT', 'VI ZEIT DER BERUFSWAHL'
    ],
    'fransiz-dili-esas-10': [
        'UNITÉ 1 Vie scolaire', 'UNITÉ 2 Vie sociale', 'UNITÉ 3 Le français en Azerbaïdjan',
        'UNITÉ 4 L\'Azerbaïdjan dans le monde'
    ]
}

MAIN = Path(r'c:\Users\User\Downloads\azerbaijanaiplatform\data\textbook-chunks.jsonl')
TEMP = Path(r'c:\Users\User\Downloads\azerbaijanaiplatform\data\textbook-chunks-hybrid.jsonl')

print('Building Hybrid Model for Grade 10...')

section_cache = {}

with open(MAIN, 'r', encoding='utf-8') as fin, open(TEMP, 'w', encoding='utf-8') as fout:
    for line in fin:
        try:
            c = json.loads(line)
            bid = c.get('book_id')
            page = c.get('page', 0)
            
            if bid in TOCS:
                units = TOCS[bid]
                # Page range estimation based on book length
                if bid == 'rus-dili-esas-10':
                    idx = min((page - 7) // 30, len(units)-1) if page > 7 else 0
                elif bid == 'ingilis-dili-esas-10':
                    idx = min((page - 6) // 24, len(units)-1) if page > 6 else 0
                elif bid == 'alman-dili-esas-10':
                    idx = min((page - 6) // 32, len(units)-1) if page > 6 else 0
                elif bid == 'fransiz-dili-esas-10':
                    idx = min((page - 6) // 45, len(units)-1) if page > 6 else 0
                else:
                    idx = 0
                
                section_name = units[max(0, idx)]
                c['section'] = section_name
                
                # Cache for aggregation
                key = (bid, section_name)
                if key not in section_cache:
                    section_cache[key] = []
                section_cache[key].append(c.get('text', ''))
            
            fout.write(json.dumps(c, ensure_ascii=False) + '\n')
        except:
            continue

    # Add Section Aggregations
    print('Adding hybrid unit aggregations...')
    for (bid, sname), texts in section_cache.items():
        if len(texts) > 0:
            combined = "\n\n---\n\n".join(texts)
            h_chunk = {
                'id': f'{bid}_{sname.replace(" ", "_")}_hybrid',
                'grade': 10,
                'book_id': bid,
                'title': f'{bid} - {sname}',
                'text': combined,
                'type': 'section_hybrid',
                'metadata': {'type': 'unit_aggregation', 'page_count': len(texts)}
            }
            fout.write(json.dumps(h_chunk, ensure_ascii=False) + '\n')

print('Done.')
