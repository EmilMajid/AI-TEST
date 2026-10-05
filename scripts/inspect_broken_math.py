import json

with open('data/grades/grade_10.json', 'r', encoding='utf-8') as f:
    d = json.load(f)

r10 = d.get('Riyaziyyat 10', {})

broken_math = []
for t_name, qs in r10.items():
    for idx, q in enumerate(qs, 1):
        opts = q.get('options', [])
        clean = [str(o).strip() for o in opts]
        if all(o in ['$$', '$ $', ''] for o in clean):
            broken_math.append({
                "topic": t_name, "q_num": idx, "q": q.get('question'),
                "exp": q.get('explanation'), "opts": opts, "correct": q.get('correctAnswer')
            })

print(f"Total broken math in Riyaziyyat 10: {len(broken_math)}")
for bm in broken_math[:10]:
    print(f"[{bm['topic']} Q{bm['q_num']}]")
    print("  Q:", bm['q'])
    print("  Exp:", bm['exp'])
    print("  Opts:", bm['opts'])
    print("  Correct:", bm['correct'])
    print("-" * 60)
