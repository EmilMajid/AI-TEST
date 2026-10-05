import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('scripts/forensic_findings.json', 'r', encoding='utf-8') as f:
    d = json.load(f)

print(f"TOTAL MISMATCHES RECORDED: {d['mismatched_questions_count']}")
print("================================================================")
for i, m in enumerate(d['mismatched_questions_sample'][:15], 1):
    print(f"\n[{i}] Sinif {m['grade']} | {m['subject']} | {m['topic']} | Sual {m['q_index']}")
    print(f"  Sual: {m['question']}")
    print(f"  ❌ Sistemdə qeyd olunan YANLIŞ cavab: {m['marked_answer']}) {m['marked_option']}")
    print(f"  ✅ Dərslik izahına uyğun DOĞRU cavab: {m['candidate_answer']}) {m['candidate_option']}")
    print(f"  📖 Dərslik izahı: {m['explanation']}")
    print(f"  🔑 İzahla variant arasındakı ortaq terminlər: {m['common_tokens']}")
