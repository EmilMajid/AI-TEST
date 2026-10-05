import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('data/grades/grade_10.json', 'r', encoding='utf-8') as f:
    d = json.load(f)

qs = d['Azərbaycan tarixi 10']['26. Ağqoyunlu dövləti']

for i in [2, 6, 10, 14]:
    q = qs[i]
    ci = ord(q['answer']) - ord('A')
    print(f"Q{i+1}: {q['question'][:55]}")
    print(f"  Ans: {q['answer']}) {q['options'][ci]}")
    print(f"  Expl: {q['explanation'][:90]}")
    print()
