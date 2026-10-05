import json
import glob
import os

print("--- SCANNING FOR CONTAMINATIONS ---")

history_terms = ['iqta', 'mülk', 'vəqf', 'eldəniz', 'şirvanşah', 'torpaq mülkiyyəti', 'feodal']

for fpath in sorted(glob.glob('data/grades/grade_*.json')):
    fname = os.path.basename(fpath)
    with open(fpath, 'r', encoding='utf-8') as f:
        try:
            data = json.load(f)
        except Exception as e:
            print(f"Error loading {fpath}: {e}")
            continue
            
    for subj, topics in data.items():
        if not isinstance(topics, dict): continue
        is_lang = any(l in subj.lower() for l in ['azərbaycan dili', 'ingilis dili', 'rus dili', 'dil qaydaları'])
        for topic_name, q_list in topics.items():
            if not isinstance(q_list, list): continue
            for idx, q in enumerate(q_list):
                bt = q.get('backward_trace', {})
                cn = str(bt.get('concept_name', '')).lower()
                rc = str(bt.get('root_concept', '')).lower()
                
                # Check history leaks in language subjects
                if is_lang:
                    if any(ht in cn for ht in history_terms) or any(ht in rc for ht in history_terms):
                        print(f"[{fname} | {subj} | {topic_name}] Q#{idx} History Leak: cn='{bt.get('concept_name')}', rc='{bt.get('root_concept')}' | Q: {q.get('question', '')[:60]}")
                
                # Check poem/literary text mapped to pure syntax questions
                q_text = str(q.get('question', '')).lower()
                if any(syn in q_text for syn in ['vasitəsiz nitq', 'sintaktik növü', 'cümlənin növü', 'budaq cümlə', 'tabeli mürəkkəb']):
                    if any(lit in rc for lit in ['oqtay eloğlu', 'şuşalı vətən', 'şeir', 'hekayə', 'bölmə']):
                        print(f"[{fname} | {subj} | {topic_name}] Q#{idx} Syntax->Lit Leak: rc='{bt.get('root_concept')}' | Q: {q.get('question', '')[:60]}")
