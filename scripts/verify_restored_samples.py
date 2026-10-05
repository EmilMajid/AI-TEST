import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

checks = [
    (1, 'Riyaziyyat 1', 'Əşyanın əlaməti', 10, 'A'),
    (7, 'Riyaziyyat 7', '25. Çoxhədli və onun standart şəkli', 17, 'A')
]

for g, s, t, qi, exp in checks:
    d = json.load(open(f'data/grades/grade_{g}.json', encoding='utf-8'))
    q = d[s][t][qi-1]
    ans = q.get('answer')
    q_txt = q.get('question')
    print(f"Grade {g} {s} Q{qi}: Ans={ans} (Expected: {exp}) | Question: {q_txt}")
