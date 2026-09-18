import sys
import json

sys.stdout.reconfigure(encoding='utf-8')

with open('data/grades/grade_7.json', 'r', encoding='utf-8') as f:
    d7 = json.load(f)

for s in ['İnformatika 7', 'Fizika 7', 'Kimya 7']:
    for t, qs in d7[s].items():
        for q_idx, q in enumerate(qs):
            opts = q.get('options', [])
            clean_opts = [str(o).strip().lower() for o in opts]
            if len(set(clean_opts)) < len(opts):
                print(f"[{s}] {t} (Q#{q_idx}): {q.get('question')}")
                print(f"    Options: {opts}")
                print(f"    CA: {q.get('correctAnswer')}")
                print(f"    Expl: {q.get('explanation')}")
