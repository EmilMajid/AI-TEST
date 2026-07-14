import json
import re

def parse_topics_structured():
    with open('topics_grade6.txt', 'r', encoding='utf8') as f:
        content = f.read()
    
    subjects = {}
    current_subj = None
    b_idx = 1
    m_idx = 1
    
    for line in content.split('\n'):
        line = line.strip()
        if not line: continue
        
        if line in ['Azərbaycan dili 6', 'Riyaziyyat 6', 'Təbiət 6', 'Ümumi tarix 6', 'Coğrafiya 6', 'Azərbaycan tarixi 6', 'Ədəbiyyat 6', 'İnformatika 6', 'Texnologiya 6', 'İngilis dili 6', 'Rus dili 6', 'Alman dili 6', 'Fransız dili 6']:
            current_subj = line
            subjects[current_subj] = []
            b_idx = 1
            m_idx = 1
        elif current_subj:
            ignore = ['Mövzular', 'Xülasə', 'Ümumiləşdirici tapşırıqlar', 'Sözlük', 'Cavablar', 'Məsələ və misallar', 'Məsələlər', 'İzahlı sözlük', 'Отве́ты', 'Толко́вый слова́рь', 'Литература', 'Layihə', 'Lüğət', 'İnşanı necə yazmalı', 'İfadəli oxuda istifadə edilən şərti işarələr', 'Dərslikdəki bəzi terminlərin izahı', 'Oxumağı məsləhət görürük']
            
            if any(line == ig for ig in ignore) or line.startswith('STEAM.'):
                continue
                
            if line.startswith('Bölmə') or line.startswith('I Bölmə') or line.startswith('II Bölmə') or line.startswith('III Bölmə') or line.startswith('UNIT') or line.startswith('Разде́л') or re.match(r'^[IVX]+\.', line):
                # Just treat as a section heading if needed, but for simplicity, let's just increment b_idx.
                b_idx += 1
                # Do we reset m_idx? Better not to, keep running index for M01.
            else:
                subjects[current_subj].append({
                    'name': line,
                    'b_code': f"B{str(b_idx).zfill(2)}",
                    'm_code': f"M{str(m_idx).zfill(2)}"
                })
                m_idx += 1
    return subjects

subj_codes = {
    'Azərbaycan dili 6': 'AZD',
    'Riyaziyyat 6': 'RİY',
    'Təbiət 6': 'TƏB',
    'Ümumi tarix 6': 'ÜMT',
    'Coğrafiya 6': 'COĞ',
    'Azərbaycan tarixi 6': 'AZT',
    'Ədəbiyyat 6': 'ƏDB',
    'İnformatika 6': 'İNF',
    'Texnologiya 6': 'TEX',
    'İngilis dili 6': 'İNG',
    'Rus dili 6': 'RUS',
    'Alman dili 6': 'ALM',
    'Fransız dili 6': 'FRA'
}

bloom_codes = {
    'bilmə': 'BL1', 'bilmək': 'BL1',
    'anlama': 'BL2', 'anlamaq': 'BL2',
    'tətbiq': 'BL3',
    'təhlil': 'BL4',
    'qiymətləndirmə': 'BL5',
    'yaratmaq': 'BL6', 'sintez': 'BL5' 
}

diff_codes = {
    'asan': 'A', 'sadə': 'A',
    'orta': 'O',
    'çətin': 'Ç', 'mürəkkəb': 'Ç'
}

def main():
    print("Reading DB...")
    with open('data/offline_tests.json', 'r', encoding='utf8') as f:
        db = json.load(f)

    subjects = parse_topics_structured()
    updates = 0
    
    for subj, subj_topics in subjects.items():
        if subj not in db:
            continue
            
        subj_code = subj_codes.get(subj, 'UNK')
        tests = db[subj]
        
        # Keep track of counts per topic for the sequence number
        topic_counts = {}
        
        for t in tests:
            t_name = t.get('topic', '')
            
            # Find matching topic data
            t_data = next((x for x in subj_topics if x['name'] == t_name), None)
            if not t_data:
                b_code = 'B01'
                m_code = 'M01'
            else:
                b_code = t_data['b_code']
                m_code = t_data['m_code']
                
            b_level = t.get('bloom_level', '').lower()
            b_code_str = bloom_codes.get(b_level, 'BL1')
            
            diff = t.get('difficulty', '').lower()
            diff_str = diff_codes.get(diff, 'O')
            
            # Sequence
            seq_key = f"{m_code}_{b_code_str}_{diff_str}"
            topic_counts[seq_key] = topic_counts.get(seq_key, 0) + 1
            seq_str = str(topic_counts[seq_key]).zfill(3)
            
            passport = f"06-{subj_code}-2024H1-{b_code}-{m_code}-{b_code_str}-{diff_str}-{seq_str}"
            t['passport_id'] = passport
            
            # Optional cleanup
            if 'tik_code' in t:
                del t['tik_code']
                
            updates += 1

    print(f"Total passports updated: {updates}")
    
    with open('data/offline_tests.json', 'w', encoding='utf8') as f:
        json.dump(db, f, ensure_ascii=False, indent=2)

if __name__ == '__main__':
    main()
