import sys
import os
import json
import re
from reconcile_engine import reconcile_answer_key, extract_solution_text

sys.stdout.reconfigure(encoding='utf-8')

def repair_question_object(q):
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
        
        # Update question keys
        q['correctAnswer'] = new_idx
        q['correct_index'] = new_idx
        q['correct_answer'] = new_letter
        q['answer'] = new_letter
        
        # Update diagnostics
        diagnostics = {}
        for idx, opt in enumerate(opts):
            L = chr(65 + idx)
            if idx == new_idx:
                diagnostics[L] = f"DÜZGÜNDÜR: '{opt}'. Dərslik qayda və elmi meyarlarına tam uyğundur."
            else:
                diagnostics[L] = f"Yanlışdır ({opt}). Tipik tələbə xətası və ya hesablama diqqətsizliyi."
        q['distractor_diagnostics'] = diagnostics
        
        # Update solution steps
        topic_name = q.get('topic') or 'Mövzu'
        q['solution_steps'] = [
            f"1. Sualın şərti və mövzusu ('{topic_name}') diqqətlə təhlil edilir.",
            f"2. Fənn proqramına və dərslik qaydalarına əsasən düzgün cavab müəyyənləşdirilir: {new_opt}.",
            "3. Digər yayındırıcı variantlar təhlil edilərək kənarlaşdırılır və düzgün cavab təsdiqlənir."
        ]
        return True, old_letter, old_opt, new_letter, new_opt, reason
        
    return False

def process_file(filepath):
    if not os.path.exists(filepath):
        return 0, 0, []
        
    print(f"\nProcessing file: {filepath}...", flush=True)
    with open(filepath, 'r', encoding='utf-8') as f:
        try:
            data = json.load(f)
        except Exception as e:
            print(f"  Error reading {filepath}: {e}", flush=True)
            return 0, 0, []
            
    total_q = 0
    repaired_q = 0
    sample_repairs = []
    
    # Can be dict { category: { topic: [questions] } } or dict { category: [questions] }
    if isinstance(data, dict):
        for cat, topics in data.items():
            if isinstance(topics, dict):
                for topic, qlist in topics.items():
                    if isinstance(qlist, list):
                        for q in qlist:
                            total_q += 1
                            res = repair_question_object(q)
                            if res:
                                repaired_q += 1
                                if len(sample_repairs) < 5:
                                    sample_repairs.append((topic, q.get('question', '')[:60], res[1], res[2], res[3], res[4]))
            elif isinstance(topics, list):
                for item in topics:
                    if isinstance(item, dict):
                        if 'questions' in item and isinstance(item['questions'], list):
                            for q in item['questions']:
                                total_q += 1
                                res = repair_question_object(q)
                                if res:
                                    repaired_q += 1
                                    if len(sample_repairs) < 5:
                                        sample_repairs.append((q.get('topic', cat), q.get('question', '')[:60], res[1], res[2], res[3], res[4]))
                        elif 'question' in item:
                            total_q += 1
                            res = repair_question_object(item)
                            if res:
                                repaired_q += 1
                                if len(sample_repairs) < 5:
                                    sample_repairs.append((item.get('topic', cat), item.get('question', '')[:60], res[1], res[2], res[3], res[4]))
                                    
    if repaired_q > 0:
        print(f"  Writing {repaired_q} repairs to {filepath}...", flush=True)
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
            
    print(f"  Done: Total {total_q} questions, Repaired {repaired_q} answer keys.", flush=True)
    return total_q, repaired_q, sample_repairs

if __name__ == "__main__":
    targets = []
    
    # 1. data/grades/grade_*.json
    grades_dir = os.path.join('data', 'grades')
    if os.path.exists(grades_dir):
        for f in os.listdir(grades_dir):
            if f.startswith('grade_') and f.endswith('.json') and not '.bak' in f:
                targets.append(os.path.join(grades_dir, f))
                
    # 2. data/offline_tests.json
    offline_file = os.path.join('data', 'offline_tests.json')
    if os.path.exists(offline_file):
        targets.append(offline_file)
        
    # 3. autonomous_kag/active_staging/grade_*.json
    staging_dir = os.path.join('autonomous_kag', 'active_staging')
    if os.path.exists(staging_dir):
        for f in os.listdir(staging_dir):
            if f.startswith('grade_') and f.endswith('.json'):
                targets.append(os.path.join(staging_dir, f))
                
    print(f"Found {len(targets)} database files to audit and repair:")
    for t in targets:
        print(f" - {t}")
        
    grand_total_q = 0
    grand_repaired_q = 0
    
    for t in targets:
        t_q, r_q, samples = process_file(t)
        grand_total_q += t_q
        grand_repaired_q += r_q
        for s in samples:
            print(f"    [Sample] {s[0]}: '{s[1]}' | Old: {s[2]}) {s[3]} ===> New: {s[4]}) {s[5]}")
            
    print(f"\n==========================================")
    print(f"GLOBAL REPAIR COMPLETED!")
    print(f"Total Questions Audited Across Database: {grand_total_q}")
    print(f"Total Flawed Answer Keys Reconciled:      {grand_repaired_q}")
    print(f"==========================================")
