import json
import re
import sys
import os

sys.stdout.reconfigure(encoding='utf-8')

LETTERS = ['A', 'B', 'C', 'D', 'E']

print("Starting Phase 0 remediation: Reverting regressions and auditing realignments...")

total_reverted = 0
total_verified = 0
reverted_details = []

for g in range(1, 12):
    fp = f'data/grades/grade_{g}.json'
    st_fp = f'autonomous_kag/active_staging/grade_{g}.json'
    
    with open(fp, 'r', encoding='utf-8') as f:
        data = json.load(f)
        
    file_modified = False
    
    for subj, topics in data.items():
        if not isinstance(topics, dict):
            continue
        for topic, qs in topics.items():
            if not isinstance(qs, list):
                continue
            for qi, q in enumerate(qs):
                if not isinstance(q, dict):
                    continue
                expl = str(q.get('explanation', ''))
                curr_ans = q.get('answer')
                opts = q.get('options', [])
                
                # Check 1: Explicit "Doğru cavab X" contradiction
                m = re.search(r'Doğru cavab\s+([A-E])\b', expl)
                if m and curr_ans in LETTERS and m.group(1) != curr_ans:
                    correct_letter = m.group(1)
                    correct_idx = LETTERS.index(correct_letter)
                    if correct_idx < len(opts):
                        old_ans = curr_ans
                        q['answer'] = correct_letter
                        q['correct_answer'] = correct_letter
                        q['correctAnswer'] = correct_idx
                        q['correct_index'] = correct_idx
                        if 'correct_letter' in q:
                            q['correct_letter'] = correct_letter
                        
                        # Fix distractor diagnostics
                        dd = q.get('distractor_diagnostics')
                        if isinstance(dd, dict) and dd:
                            new_dd = {}
                            for oi in range(len(opts)):
                                ol = LETTERS[oi]
                                if oi == correct_idx:
                                    new_dd[ol] = f"DÜZGÜNDÜR: {ol} variantı sualın şərtinə və dərslik qaydalarına tam uyğun olan doğru cavabdır."
                                else:
                                    new_dd[ol] = f"{ol} variantı yanlışdır: dərslik standartına uyğun deyil."
                            q['distractor_diagnostics'] = new_dd
                            
                        total_reverted += 1
                        file_modified = True
                        reverted_details.append({
                            'grade': g,
                            'subject': subj,
                            'topic': topic,
                            'q_num': qi + 1,
                            'from': old_ans,
                            'to': correct_letter,
                            'reason': f"İzahda açıq şəkildə 'Doğru cavab {correct_letter}' göstərilib",
                            'question': q.get('question', '')[:60]
                        })

    if file_modified:
        with open(fp, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        if os.path.exists(st_fp):
            with open(st_fp, 'w', encoding='utf-8') as f:
                json.dump(data, f, ensure_ascii=False, indent=2)

print(f"Total explicit regressions reverted: {total_reverted}")
with open('scripts/phase0_reverted.json', 'w', encoding='utf-8') as f:
    json.dump(reverted_details, f, ensure_ascii=False, indent=2)

