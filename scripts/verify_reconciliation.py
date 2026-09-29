import sys
import json
from reconcile_engine import reconcile_answer_key

sys.stdout.reconfigure(encoding='utf-8')

# Test Grade 10
with open('data/grades/grade_10.json', 'r', encoding='utf-8') as f:
    g10 = json.load(f)

g10_repairs = 0
total_g10 = 0
for cat, topics in g10.items():
    if isinstance(topics, dict):
        for t, qlist in topics.items():
            if isinstance(qlist, list):
                for q in qlist:
                    total_g10 += 1
                    opts = q.get('options', [])
                    c = q.get('correctAnswer', 0)
                    new_idx, reason = reconcile_answer_key(q.get('question'), opts, q.get('explanation'), c)
                    if new_idx != c:
                        g10_repairs += 1
                        if g10_repairs <= 5:
                            print(f"G10 Repair: {q.get('question')[:40]} | Old: {chr(65+c)}) {opts[c]} ==> New: {chr(65+new_idx)}) {opts[new_idx]} | {reason}")

print(f"Total Grade 10: {total_g10} questions, Repairs: {g10_repairs}")

# Test Grade 8 quadratic topic
with open('data/grades/grade_8.json', 'r', encoding='utf-8') as f:
    g8 = json.load(f)

topic = g8['Riyaziyyat 8']['Kvadrat tənliklərin vuruqlara ayırma üsulu ilə həlli']
g8_repairs = 0
for i, q in enumerate(topic):
    opts = q.get('options', [])
    c = q.get('correctAnswer', 0)
    new_idx, reason = reconcile_answer_key(q.get('question'), opts, q.get('explanation'), c)
    if new_idx != c:
        g8_repairs += 1

print(f"Total Grade 8 quadratic topic repairs: {g8_repairs} / {len(topic)} (Expected: 18)")
