import sys
import json

sys.stdout.reconfigure(encoding='utf-8')

with open('data/grades/grade_7.json', 'r', encoding='utf-8') as f:
    d7 = json.load(f)

math_dups = []
for t, qs in d7['Riyaziyyat 7'].items():
    for q_idx, q in enumerate(qs):
        opts = q.get('options', [])
        clean_opts = [str(o).strip().lower() for o in opts]
        if len(set(clean_opts)) < len(opts):
            math_dups.append({
                "topic": t,
                "q_idx": q_idx,
                "question": q.get('question'),
                "explanation": q.get('explanation')
            })

with open('scratch/math_79_dups.json', 'w', encoding='utf-8') as f:
    json.dump(math_dups, f, ensure_ascii=False, indent=2)

print(f"Saved {len(math_dups)} math dups to scratch/math_79_dups.json")
