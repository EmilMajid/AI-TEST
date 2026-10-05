import json
import sys
import re

sys.stdout.reconfigure(encoding='utf-8')

# 1. Inspect the 5 questions provided by the user in detail
print("======================================================================")
print("USER TEST ANALYSIS: 10-cu sinif Azərbaycan tarixi, '26. Ağqoyunlu dövləti'")
print("======================================================================")

with open('data/grades/grade_10.json', 'r', encoding='utf-8') as f:
    d = json.load(f)

qs = d.get('Azərbaycan tarixi 10', {}).get('26. Ağqoyunlu dövləti', [])

LETTERS = ['A', 'B', 'C', 'D', 'E']

user_indices = [7, 12, 0, 13, 10] # Q8, Q13, Q1, Q14, Q11 in the topic (1-indexed)

for num, idx in enumerate(user_indices, 1):
    q = qs[idx]
    print(f"\n--- SUAL {num} (Bazada Sual {idx+1}) ---")
    print("Mətn:", q.get('question'))
    opts = q.get('options', [])
    for oi, opt in enumerate(opts):
        marker = "===> [SİSTEMİN İŞARƏLƏDİYİ CAVAB]" if LETTERS[oi] == q.get('answer') else ""
        print(f"  {LETTERS[oi]}) {opt} {marker}")
    print("Bazada 'answer':", q.get('answer'))
    print("İzah (explanation):", q.get('explanation'))
    print("Kök səbəb (root_concept):", q.get('backward_trace', {}).get('root_concept'))
    print("Valideyn bələdçisi:", q.get('backward_trace', {}).get('parent_action_tip'))
    print("Bloom səviyyəsi:", q.get('cognitive_level'))
    print("Çətinlik:", q.get('difficulty'))

