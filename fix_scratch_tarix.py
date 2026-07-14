import json
import glob
import os

FILE_TOPICS = {
    'tarix6_1.json': '1. Tarixdə il hesabı',
    'tarix6_2.json': '2. İbtidai cəmiyyət',
    'tarix6_9.json': '9. Böyük ipək yolunun başlandığı ölkə',
    'tarix6_10.json': '10. Şahmatın vətəni'
}

files = glob.glob(r'C:\Users\User\.gemini\antigravity\scratch\tarix6_*.json')

for fpath in files:
    fname = os.path.basename(fpath)
    topic = FILE_TOPICS.get(fname)
    if not topic:
        continue
        
    with open(fpath, 'r', encoding='utf8') as f:
        data = json.load(f)
        
    tests = data.get('Ümumi tarix 6', [])
    for t in tests:
        if 'id' in t:
            t['passport_id'] = t.pop('id')
            
        t['topic'] = topic
        
        # Ensure bloom and difficulty are present from passport_id
        pid = t.get('passport_id', '')
        if pid:
            parts = pid.split('-')
            if len(parts) >= 7:
                bloom = parts[5] # BL1
                diff = parts[6] # S, O, Ç
                if not t.get('bloom_taxonomy'):
                    t['bloom_taxonomy'] = bloom
                if not t.get('difficulty'):
                    if diff == 'S': t['difficulty'] = 'Sadə'
                    elif diff == 'O': t['difficulty'] = 'Orta'
                    elif diff == 'Ç': t['difficulty'] = 'Çətin'
                    
    with open(fpath, 'w', encoding='utf8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

print("Fixed generated tests in scratch.")
