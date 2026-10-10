import json
import sys

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

with open("reports/rational_fractions_pilot_dataset.json", "r", encoding="utf-8") as f:
    data = [d for d in json.load(f) if d["grade"] == 8]

print(f"Total Grade 8 rational fraction questions: {len(data)}")

# Let's inspect representative samples across the 4 key operations
categories = {
    "Domain / Məxrəc != 0 (MQO)": [],
    "Vuruqlara ayırma və İxtisar": [],
    "Ortaq məxrəc və Toplama/Çıxma": [],
    "Vurma / Bölmə": []
}

for q in data:
    txt = (q["question"] + " " + q["explanation"] + " " + q["topic"]).lower()
    if any(k in txt for k in ["mümkün qiymət", "məxrəc sıfır", "məxrəci sıfıra", "mənası yoxdur", "dəyişənin hansı"]):
        categories["Domain / Məxrəc != 0 (MQO)"].append(q)
    elif any(k in txt for k in ["ixtisar", "əsas xassəsi", "sadələşdirin"]):
        categories["Vuruqlara ayırma və İxtisar"].append(q)
    elif any(k in txt for k in ["toplan", "çıxıl", "ortaq məxrəc", "cəmini tapın", "fərqini"]):
        categories["Ortaq məxrəc və Toplama/Çıxma"].append(q)
    elif any(k in txt for k in ["vurul", "bölün", "hasili", "qismət"]):
        categories["Vurma / Bölmə"].append(q)

for cat, qlist in categories.items():
    print(f"\n==========================================")
    print(f"Category: {cat} (Total: {len(qlist)})")
    print(f"==========================================")
    for q in qlist[:3]:
        print(f"  ID: {q['id']} | Topic: {q['topic']}")
        print(f"  Q: {q['question'][:120]}")
        print(f"  Expl: {q['explanation'][:150]}")
        print("  ---")
