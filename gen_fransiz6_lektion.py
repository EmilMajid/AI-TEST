"""
Fransız dili 6 — Unité-specific test generator (compact, no blocking)
"""
import json
import re
import sys
import time
from openai import OpenAI

NVIDIA_KEY = "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"

client = OpenAI(
    base_url="https://integrate.api.nvidia.com/v1",
    api_key=NVIDIA_KEY,
    timeout=300.0
)

UNITES = {
    1: {"title": "Unité 1: Faisons connaissance, Je me présente, Les adjectifs", "code": "M01"},
    2: {"title": "Unité 2: Les verbes, C'est quand ton anniversaire, Les quatre saisons", "code": "M02"},
    3: {"title": "Unité 3: Les pronoms", "code": "M03"},
    4: {"title": "Unité 4: Les adverbes", "code": "M04"},
    5: {"title": "Unité 5: Les conjonctions", "code": "M05"},
    6: {"title": "Unité 6: Les prépositions", "code": "M06"},
}

def load_chunks_for_unite():
    chunks = []
    with open("data/textbook-chunks.jsonl", "r", encoding="utf-8", errors="replace") as f:
        for line in f:
            try:
                obj = json.loads(line.strip())
                if obj.get("source") == "fransiz-dili-6-asas":
                    chunks.append(obj.get("content", ""))
            except:
                pass
    chunks.sort(key=len, reverse=True)
    return chunks

def generate(unite_num, chunks):
    info = UNITES[unite_num]
    title = info["title"]
    code = info["code"]
    
    offset = (unite_num - 1) * 3
    context = "\n\n".join(chunks[offset:offset+4]) if len(chunks) > offset else ""
    
    if len(context) < 50:
        context = f"Unité {unite_num}: {title}. Bu Fransız dili 6 dərsi üçün məzmundur."

    prompt = f"""Fransız dili 6 sinif, {title} mövzusu üçün 15 test yarat. (5 asan, 5 orta, 5 çətin)

Dərslik məzmunu:
{context[:2500]}

QAYDALAR:
- "options": Array ["A","B","C","D"] — 4 variant
- "correctAnswer": Integer 0-3 (randomize!)
- "pedagogical_explanation": Konkret izah (şablon yox)
- "topic": "{title}"
- "passport_id": "06-FRA-2024H1-B01-{code}-BLX-Y-NNN"
- "difficulty": "easy" / "medium" / "hard"
- Suallar Fransız dilinin real leksikası və qrammatikasından olsun, Azərbaycan dilində verilsin.

YALNIZ JSON cavab ver (sonda və əvvəldə başqa heç nə yazma):
{{"Fransız dili 6": [
  {{"question": "...", "options": ["...","...","...","..."], "correctAnswer": 1, "pedagogical_explanation": "...", "topic": "{title}", "passport_id": "06-FRA-2024H1-B01-{code}-BL2-O-001", "difficulty": "easy"}},
  ...
]}}"""

    print(f"{title} generasiya edilir...")
    
    for attempt in range(2):
        try:
            r = client.chat.completions.create(
                model="meta/llama-3.1-70b-instruct",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.3,
                max_tokens=4000,
            )
            raw = r.choices[0].message.content.strip()
            m = re.search(r'\{.*\}', raw, re.DOTALL)
            if m:
                data = json.loads(m.group())
                tests = data.get("Fransız dili 6", [])
                print(f"  ✅ {len(tests)} test (Cəhd {attempt+1})")
                return tests
            else:
                print(f"  ⚠️ JSON tapılmadı. Raw: {raw[:50]}")
        except Exception as e:
            print(f"  ❌ Xəta (Cəhd {attempt+1}): {str(e)[:100]}")
            time.sleep(5)
    return []

if __name__ == "__main__":
    chunks = load_chunks_for_unite()
    if len(sys.argv) > 1:
        i = int(sys.argv[1])
        tests = generate(i, chunks)
        if tests:
            out = rf"C:\Users\User\.gemini\antigravity\scratch\fransiz6_U{i}.json"
            import os
            os.makedirs(os.path.dirname(out), exist_ok=True)
            with open(out, "w", encoding="utf-8") as f:
                json.dump({"Fransız dili 6": tests}, f, ensure_ascii=False, indent=2)
            print(f"  Saxlandı: {out}")
    else:
        for i in range(1, 7):
            tests = generate(i, chunks)
            if tests:
                out = rf"C:\Users\User\.gemini\antigravity\scratch\fransiz6_U{i}.json"
                import os
                os.makedirs(os.path.dirname(out), exist_ok=True)
                with open(out, "w", encoding="utf-8") as f:
                    json.dump({"Fransız dili 6": tests}, f, ensure_ascii=False, indent=2)
                print(f"  Saxlandı: {out}")
