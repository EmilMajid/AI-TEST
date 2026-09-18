import sys
import json

sys.stdout.reconfigure(encoding='utf-8')

with open('data/grades/grade_7.json', 'r', encoding='utf-8') as f:
    d7 = json.load(f)

print(f"Total subjects: {len(d7)}")
for s, topics in d7.items():
    t_names = list(topics.keys())
    q_counts = [len(qs) for qs in topics.values()]
    first_q = topics[t_names[0]][0] if t_names and q_counts and q_counts[0] > 0 else None
    pid = first_q.get("passport_id") if first_q else "NONE"
    q_text = first_q.get("question")[:50] if first_q else "NONE"
    print(f"[{s}] Topics: {len(topics)}, Total Qs: {sum(q_counts)}, Sample PID: {pid}")
    print(f"    Sample Q: {q_text}")
