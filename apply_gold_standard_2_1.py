import json
import re
import difflib

def get_bloom(question):
    q = question.lower()
    if any(w in q for w in ['hesablayın', 'həll', 'tətbiq']): return 'Tətbiq'
    if any(w in q for w in ['niyə', 'nə üçün', 'fərqləndir', 'müqayisə']): return 'Təhlil'
    if any(w in q for w in ['yarat', 'qur', 'tərtib']): return 'Yaratmaq'
    if any(w in q for w in ['qiymətləndir', 'yoxla', 'fikrini bildir']): return 'Qiymətləndirmə'
    if any(w in q for w in ['izah et', 'nə deməkdir', 'mənası']): return 'Anlamaq'
    return 'Bilmək'

def parse_topics():
    with open('topics_grade6.txt', 'r', encoding='utf8') as f:
        content = f.read()
    
    subjects = {}
    current_subj = None
    for line in content.split('\n'):
        line = line.strip()
        if not line: continue
        if line in ['Azərbaycan dili 6', 'Riyaziyyat 6', 'Təbiət 6', 'Ümumi tarix 6', 'Coğrafiya 6', 'Azərbaycan tarixi 6', 'Ədəbiyyat 6', 'İnformatika 6', 'Texnologiya 6', 'İngilis dili 6', 'Rus dili 6']:
            current_subj = line
            subjects[current_subj] = []
        elif current_subj:
            ignore = ['Mövzular', 'Xülasə', 'Ümumiləşdirici tapşırıqlar', 'Sözlük', 'Cavablar', 'Məsələ və misallar', 'Məsələlər', 'İzahlı sözlük', 'Отве́ты', 'Толко́вый слова́рь', 'Литература', 'Layihə', 'Lüğət', 'İnşanı necə yazmalı']
            if not any(line.startswith(ig) for ig in ignore) and not line.startswith('STEAM.'):
                subjects[current_subj].append(line)
    return subjects

def main():
    print("Reading DB...")
    with open('data/offline_tests.json', 'r', encoding='utf8') as f:
        db = json.load(f)

    subjects = parse_topics()
    
    updates = 0
    
    for subj, subj_topics in subjects.items():
        if subj not in db:
            continue
        
        tests = db[subj]
        print(f"Processing {subj} ({len(tests)} tests, {len(subj_topics)} topics)...")
        
        for t in tests:
            # 1. Update topic to match the syllabus closest
            old_topic = t.get('topic', '')
            if old_topic not in subj_topics and subj_topics:
                # Find closest
                closest = difflib.get_close_matches(old_topic, subj_topics, n=1, cutoff=0.3)
                if closest:
                    t['topic'] = closest[0]
                else:
                    t['topic'] = subj_topics[0]
            
            # 2. TİK Code
            topic_idx = subj_topics.index(t['topic']) if t['topic'] in subj_topics else 0
            t['tik_code'] = f"T{str(topic_idx+1).zfill(2)}"
            
            # 3. Bloom Taxonomy
            if 'bloom_level' not in t or not t['bloom_level']:
                t['bloom_level'] = get_bloom(t.get('question', ''))
                
            # 4. Pedagogical Explanation
            old_exp = t.get('explanation', '')
            if not old_exp:
                old_exp = "Dərslikdəki müvafiq mövzuya əsasən təhlil edilmişdir."
            
            # Organize into standardized format if not already
            if "Pedaqoji izah:" not in old_exp:
                t['pedagogical_explanation'] = f"Pedaqoji izah: Şagird bu tapşırıqda {t['bloom_level']} səviyyəsini nümayiş etdirir. İzah: {old_exp}"
            else:
                t['pedagogical_explanation'] = old_exp
                
            # Remove old 'explanation' if user wants pedagogical_explanation specifically
            # Wait, retaining 'explanation' as well is safe. Let's just keep both or rename it.
            
            # 5. Difficulty
            if 'difficulty' not in t or not t['difficulty']:
                t['difficulty'] = 'orta'
            
            updates += 1

    print(f"Total tests processed and updated to Gold Standard 2.1: {updates}")
    
    with open('data/offline_tests.json', 'w', encoding='utf8') as f:
        json.dump(db, f, ensure_ascii=False, indent=2)

if __name__ == '__main__':
    main()
