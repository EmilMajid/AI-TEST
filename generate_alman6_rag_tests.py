"""
Alman dili 6 — RAG-əsaslı test generasiyası
Textbook chunk-larından kontekst götürüb NVIDIA API ilə test yaradır
"""
import json
import re
import random
from openai import OpenAI

NVIDIA_KEY = "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"

client = OpenAI(
    base_url="https://integrate.api.nvidia.com/v1",
    api_key=NVIDIA_KEY
)

# Load chunks
alman6_chunks = []
with open('data/textbook-chunks.jsonl', 'r', encoding='utf-8', errors='replace') as f:
    for line in f:
        try:
            obj = json.loads(line.strip())
            if obj.get('source') == 'alman-dili-6-asas':
                alman6_chunks.append(obj)
        except:
            pass

print(f"Yuklunan chunk sayi: {len(alman6_chunks)}")

# Group chunks by Lektion
LEKTIONEN = {
    1: {"title": "Guten Tag/Hallo (Wiederholung)", "pages": range(9, 24)},
    2: {"title": "Reisen macht Spaß", "pages": range(24, 41)},
    3: {"title": "Was isst du gern?", "pages": range(41, 66)},
    4: {"title": "Einkaufen", "pages": range(66, 73)},
    5: {"title": "Schule, Schulsystem", "pages": range(73, 100)},
    6: {"title": "Freundschaft, Gefühle", "pages": range(100, 131)},
    7: {"title": "Lust auf Sport", "pages": range(8, 9)},  # Will be fixed
    8: {"title": "Baku-Berlin", "pages": range(131, 179)},
}

def get_context_for_lektion(lektion_num, max_chunks=5):
    """Lektion üçün ən uyğun chunk-ları götür"""
    lektion = LEKTIONEN.get(lektion_num, {})
    pages = lektion.get('pages', range(1, 180))
    title = lektion.get('title', '')
    
    # Get chunks for this lektion's pages
    relevant = [c for c in alman6_chunks if c.get('page') in pages]
    
    if not relevant:
        # Fallback: search by title keywords
        keywords = title.lower().split()
        relevant = [c for c in alman6_chunks
                   if any(kw in c.get('content', '').lower() for kw in keywords)]
    
    # Sort by content length (prefer richer chunks)
    relevant.sort(key=lambda x: len(x.get('content', '')), reverse=True)
    
    # Take top chunks
    top = relevant[:max_chunks]
    context = "\n\n---\n\n".join(c.get('content', '') for c in top)
    return context[:4000]  # Max 4000 char

def generate_tests_for_lektion(lektion_num, lektion_title, context):
    """NVIDIA API ilə bir Lektion üçün 15 test yarat"""
    
    prompt = f"""Sən Azərbaycan məktəbi üçün Alman dili 6 fənni test tapşırığları hazırlayan mütəxəssissən.

Aşağıda Alman dili 6-cı sinif dərsliyinin "Lektion {lektion_num}: {lektion_title}" mövzusuna aid real mətn parçası verilmişdir:

=== DƏRSLİK MƏTNİ ===
{context}
=========================

Bu REAL dərslik məzmununa əsasən DÜZGÜN 15 ədəd test tapşırığı yarat.

QAYDA (mütləq əməl et):
1. "options" — Array: ["Variant 1", "Variant 2", "Variant 3", "Variant 4"]
2. "correctAnswer" — Integer: 0, 1, 2 və ya 3 (doğru cavabın indeksi, qarışıq olsun)
3. "pedagogical_explanation" — Dərslik məzmununa əsasən konkret izah (şablon sözlər YAZMA)
4. "topic" — dəqiq: "Lektion {lektion_num} - {lektion_title}"
5. "passport_id" — məs: "06-ALM-2024H1-B01-M0{lektion_num}-BL2-O-001"
6. "difficulty" — "easy", "medium" və ya "hard" (5 easy, 5 medium, 5 hard)
7. Bloom taksonomiyasına görə müxtəlif səviyyəli suallar (bilik, anlama, tətbiq, analiz)

Çıxışı YALNIZ etibarlı JSON kimi ver (başqa heç nə):
{{
  "Alman dili 6": [
    {{
      "question": "...",
      "options": ["...", "...", "...", "..."],
      "correctAnswer": 1,
      "pedagogical_explanation": "...",
      "topic": "Lektion {lektion_num} - {lektion_title}",
      "passport_id": "06-ALM-2024H1-B01-M0{lektion_num}-BL2-O-001",
      "difficulty": "easy"
    }},
    ...
  ]
}}"""

    try:
        response = client.chat.completions.create(
            model="deepseek-ai/deepseek-v4-pro",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7,
            max_tokens=8000,
            stream=False
        )
        raw = response.choices[0].message.content.strip()
        
        # Extract JSON
        json_match = re.search(r'\{.*\}', raw, re.DOTALL)
        if json_match:
            data = json.loads(json_match.group())
            tests = data.get('Alman dili 6', [])
            return tests
        else:
            print(f"  ⚠️ JSON tapilmadi. Raw: {raw[:200]}")
            return []
    except Exception as e:
        print(f"  ❌ Xeta: {e}")
        return []

# Generate for Lektionen 1-8
all_tests = []

for lektion_num in range(1, 9):
    lektion = LEKTIONEN.get(lektion_num, {})
    title = lektion.get('title', f'Lektion {lektion_num}')
    
    print(f"\n=== Lektion {lektion_num}: {title} ===")
    context = get_context_for_lektion(lektion_num)
    print(f"  Kontekst: {len(context)} karakter")
    
    if len(context) < 100:
        print(f"  ⚠️ Kifayet etmeyen kontekst, atlaniladir")
        continue
    
    tests = generate_tests_for_lektion(lektion_num, title, context)
    print(f"  Yaradilan test: {len(tests)}")
    
    if tests:
        all_tests.extend(tests)
        # Quick save to scratch
        scratch_path = rf"C:\Users\User\.gemini\antigravity\scratch\alman6_L{lektion_num}.json"
        with open(scratch_path, 'w', encoding='utf-8') as f:
            json.dump({"Alman dili 6": tests}, f, ensure_ascii=False, indent=2)
        print(f"  ✅ Kaydedildi: {scratch_path}")

print(f"\n=== YEKUNİ ===")
print(f"Umumi yaradilan test: {len(all_tests)}")
