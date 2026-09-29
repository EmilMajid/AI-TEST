import sys
import json
import ast
import re

sys.stdout.reconfigure(encoding='utf-8')

with open('data/grades/grade_8.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

topic = data['Riyaziyyat 8']['Kvadrat tənliklərin vuruqlara ayırma üsulu ilə həlli']

for i in range(16, 31):
    q = topic[i]
    opts = q.get('options', [])
    c_idx = q.get('correctAnswer', 0)
    expl_raw = q.get('explanation', '')
    
    dist_texts = []
    if isinstance(expl_raw, str) and expl_raw.strip().startswith('{'):
        try:
            obj = ast.literal_eval(expl_raw)
            if isinstance(obj, dict):
                dist_dict = obj.get('distractors', {})
                dist_texts = list(dist_dict.values())
        except Exception as e:
            pass
            
    flagged_as_distractor = []
    for opt_idx, opt in enumerate(opts):
        opt_s = str(opt).strip()
        is_dist = any(f"'{opt_s}'" in dt or f"‘{opt_s}’" in dt or f'"{opt_s}"' in dt for dt in dist_texts)
        if is_dist:
            flagged_as_distractor.append(opt_idx)
            
    remaining = [idx for idx in range(len(opts)) if idx not in flagged_as_distractor]
    rem_str = [f"{chr(65+r)}) {opts[r]}" for r in remaining]
    print(f"Q{i+1}: Stored Key: {chr(65+c_idx)}) {opts[c_idx]} | Discarded: {len(flagged_as_distractor)} | Surviving True Answer: {rem_str}")
