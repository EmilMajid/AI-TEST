"""
Alman dili 6 — Lektion-specific test generator (compact, no blocking)
"""
import json
import re
import sys
from openai import OpenAI

NVIDIA_KEY = "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"

client = OpenAI(
    base_url="https://integrate.api.nvidia.com/v1",
    api_key=NVIDIA_KEY,
    timeout=120.0
)

# Lektion data
LEKTIONEN = {
    6: {"title": "Freundschaft, Gefühle", "pages": range(100, 131), "code": "M06"},
    7: {"title": "Lust auf Sport", "pages": range(131, 150), "code": "M07"},
    8: {"title": "Baku-Berlin", "pages": range(150, 179), "code": "M08"},
}

def load_chunks_for_lektion(lektion_num):
    pages = LEKTIONEN[lektion_num]["pages"]
    chunks = []
    with open("data/textbook-chunks.jsonl", "r", encoding="utf-8", errors="replace") as f:
        for line in f:
            try:
                obj = json.loads(line.strip())
                if obj.get("source") == "alman-dili-6-asas" and obj.get("page") in pages:
                    chunks.append(obj.get("content", ""))
            except:
                pass
    chunks.sort(key=len, reverse=True)
    context = "\n\n".join(chunks[:3])
    return context[:2000]

def generate(lektion_num):
    info = LEKTIONEN[lektion_num]
    title = info["title"]
    code = info["code"]
    context = load_chunks_for_lektion(lektion_num)
    
    if len(context) < 50:
        context = f"Lektion {lektion_num}: {title}. Bu Alman dili dərsidir."

    prompt = f"""Alman dili 6 sinif, Lektion {lektion_num}: "{title}" mövzusu üçün QISA 10 test yarat.

Dərslik məzmunu:
{context[:2000]}

QAYDALAR:
- "options": Array ["A","B","C","D"]
- "correctAnswer": Integer 0-3
- "pedagogical_explanation": Qısa izah
- "topic": "Lektion {lektion_num} - {title}"
- "passport_id": "06-ALM-2024H1-B01-{code}-BL2-O-001"
- "difficulty": "medium"

YALNIZ JSON cavab ver:
{{"Alman dili 6": [
  {{"question": "...", "options": ["...","...","...","..."], "correctAnswer": 1, "pedagogical_explanation": "...", "topic": "Lektion {lektion_num} - {title}", "passport_id": "06-ALM-2024H1-B01-{code}-BL2-O-001", "difficulty": "medium"}},
  ...
]}}"""

    print(f"Lektion {lektion_num} ({title}) generasiya edilir...")
    try:
        r = client.chat.completions.create(
            model="meta/llama-3.1-70b-instruct",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.3,
            max_tokens=3000,
        )
        raw = r.choices[0].message.content.strip()
        m = re.search(r'\{.*\}', raw, re.DOTALL)
        if m:
            data = json.loads(m.group())
            tests = data.get("Alman dili 6", [])
            print(f"  ✅ {len(tests)} test")
            return tests
        else:
            print(f"  ⚠️ JSON tapılmadı. Raw: {raw[:100]}")
            return []
    except Exception as e:
        print(f"  ❌ Xəta: {str(e)[:200]}")
        return []

# Get lektion number from command line
if len(sys.argv) > 1:
    lnum = int(sys.argv[1])
    tests = generate(lnum)
    if tests:
        out = rf"C:\Users\User\.gemini\antigravity\scratch\alman6_L{lnum}.json"
        with open(out, "w", encoding="utf-8") as f:
            json.dump({"Alman dili 6": tests}, f, ensure_ascii=False, indent=2)
        print(f"  Saxlandı: {out}")
else:
    for i in [6, 7, 8]:
        tests = generate(i)
        if tests:
            out = rf"C:\Users\User\.gemini\antigravity\scratch\alman6_L{i}.json"
            with open(out, "w", encoding="utf-8") as f:
                json.dump({"Alman dili 6": tests}, f, ensure_ascii=False, indent=2)
            print(f"  Saxlandı: {out}")
