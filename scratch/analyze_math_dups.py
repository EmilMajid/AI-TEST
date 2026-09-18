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
            math_dups.append((t, q_idx, q.get('question'), q.get('explanation'), opts, q.get('correctAnswer')))

print(f"Total math questions with duplicate options: {len(math_dups)}")
for i, (t, q_idx, q, expl, opts, ca) in enumerate(math_dups[:15]):
    print(f"\n#{i+1} [{t}] Q#{q_idx}")
    print(f"  Q: {q}")
    print(f"  Expl: {expl}")
    print(f"  Opts: {opts}, CA: {ca}")
