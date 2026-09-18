import sys
import json

sys.stdout.reconfigure(encoding='utf-8')

with open('data/grades/grade_7.json', 'r', encoding='utf-8') as f:
    d7 = json.load(f)

for t, qs in d7['Rus dili 7'].items():
    for q_idx, q in enumerate(qs):
        opts = q.get('options', [])
        clean_opts = [str(o).strip().lower() for o in opts]
        if len(set(clean_opts)) < len(opts):
            print(f"[Rus dili 7] {t} (Q#{q_idx}): {q.get('question')}")
            print(f"    Options: {opts}")
            print(f"    CA: {q.get('correctAnswer')}")
            print(f"    Expl: {q.get('explanation')}")
