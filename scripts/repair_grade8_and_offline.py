import sys
import os
import json
from reconcile_engine import reconcile_answer_key

sys.stdout.reconfigure(encoding='utf-8')

def repair_q(q):
    opts = q.get('options') or q.get('opts')
    if not opts or not isinstance(opts, list) or len(opts) == 0:
        return False
        
    c_idx = q.get('correctAnswer')
    if c_idx is None:
        c_idx = q.get('correct_index')
    if c_idx is None:
        raw_ans = str(q.get('correct_answer') or q.get('answer') or 'A').strip().upper()
        if raw_ans in ['A', 'B', 'C', 'D', 'E']:
            c_idx = ord(raw_ans) - 65
        else:
            c_idx = 0
    try:
        c_idx = int(c_idx)
    except:
        c_idx = 0
        
    if c_idx < 0 or c_idx >= len(opts):
        c_idx = 0
        
    expl = q.get('explanation')
    new_idx, reason = reconcile_answer_key(q.get('question'), opts, expl, c_idx)
    
    if new_idx != c_idx and 0 <= new_idx < len(opts):
        old_letter = chr(65 + c_idx)
        new_letter = chr(65 + new_idx)
        old_opt = opts[c_idx]
        new_opt = opts[new_idx]
        
        q['correctAnswer'] = new_idx
        q['correct_index'] = new_idx
        q['correct_answer'] = new_letter
        q['answer'] = new_letter
        
        # Distractor diagnostics
        diagnostics = {}
        for idx, opt in enumerate(opts):
            L = chr(65 + idx)
            if idx == new_idx:
                diagnostics[L] = f"DÜZGÜNDÜR: '{opt}'. Dərslik qayda və elmi meyarlarına tam uyğundur."
            else:
                diagnostics[L] = f"Yanlışdır ({opt}). Tipik tələbə xətası və ya hesablama diqqətsizliyi."
        q['distractor_diagnostics'] = diagnostics
        
        topic_name = q.get('topic') or 'Mövzu'
        q['solution_steps'] = [
            f"1. Sualın şərti və mövzusu ('{topic_name}') diqqətlə təhlil edilir.",
            f"2. Fənn proqramına və dərslik qaydalarına əsasən düzgün cavab müəyyənləşdirilir: {new_opt}.",
            "3. Digər yayındırıcı variantlar təhlil edilərək kənarlaşdırılır və düzgün cavab təsdiqlənir."
        ]
        return True
    return False

def repair_grade8_file(filepath):
    if not os.path.exists(filepath):
        print(f"File not found: {filepath}")
        return 0, 0
        
    print(f"\nRepairing Grade 8 database: {filepath}...", flush=True)
    with open(filepath, 'r', encoding='utf-8') as f:
        data = json.load(f)
        
    total = 0
    repaired = 0
    
    for cat, topics in data.items():
        if isinstance(topics, dict):
            for topic, qlist in topics.items():
                if isinstance(qlist, list):
                    for q in qlist:
                        total += 1
                        if repair_q(q):
                            repaired += 1
                            
    print(f"  Repaired {repaired} out of {total} questions in {filepath}", flush=True)
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f"  Saved successfully: {filepath}", flush=True)
    return total, repaired

def repair_offline_tests_grade8(filepath):
    if not os.path.exists(filepath):
        print(f"File not found: {filepath}")
        return 0, 0
        
    print(f"\nRepairing Riyaziyyat 8 in offline_tests.json: {filepath}...", flush=True)
    with open(filepath, 'r', encoding='utf-8') as f:
        data = json.load(f)
        
    total = 0
    repaired = 0
    
    # Target all Grade 8 subjects in offline_tests.json
    for cat in list(data.keys()):
        if '8' in cat:
            val = data[cat]
            if isinstance(val, dict):
                for topic, qlist in val.items():
                    if isinstance(qlist, list):
                        for q in qlist:
                            total += 1
                            if repair_q(q):
                                repaired += 1
            elif isinstance(val, list):
                for item in val:
                    if isinstance(item, dict):
                        if 'questions' in item and isinstance(item['questions'], list):
                            for q in item['questions']:
                                total += 1
                                if repair_q(q):
                                    repaired += 1
                        elif 'question' in item:
                            total += 1
                            if repair_q(item):
                                repaired += 1
                                
    print(f"  Repaired {repaired} out of {total} Grade 8 questions in {filepath}", flush=True)
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f"  Saved successfully: {filepath}", flush=True)
    return total, repaired

if __name__ == "__main__":
    t1, r1 = repair_grade8_file(os.path.join('data', 'grades', 'grade_8.json'))
    t2, r2 = repair_grade8_file(os.path.join('autonomous_kag', 'active_staging', 'grade_8.json'))
    t3, r3 = repair_offline_tests_grade8(os.path.join('data', 'offline_tests.json'))
    
    print("\n==========================================")
    print(f"GRADE 8 REPAIR SUMMARY:")
    print(f"data/grades/grade_8.json:                  {r1} / {t1} repaired")
    print(f"autonomous_kag/active_staging/grade_8.json:{r2} / {t2} repaired")
    print(f"data/offline_tests.json (Grade 8):         {r3} / {t3} repaired")
    print("==========================================")
