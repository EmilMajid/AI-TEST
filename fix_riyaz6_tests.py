import json
import time
import os
import uuid
import re
from openai import OpenAI

# API setup
client = OpenAI(
  base_url = "https://integrate.api.nvidia.com/v1",
  api_key = "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"
)
MODEL = "meta/llama-3.1-70b-instruct"

# File paths
BASE_DIR = r"C:\Users\User\Downloads\azerbaijanaiplatform"
TESTS_FILE = os.path.join(BASE_DIR, "data", "offline_tests.json")
REPORT_FILE = r"C:\Users\User\.gemini\antigravity\scratch\riyaz6_yoxlama_hesabat.json"
PROGRESS_FILE = r"C:\Users\User\.gemini\antigravity\scratch\fix_riyaz6_progress.json"

def clean_json_response(raw_text):
    """Süni intellektin qaytardığı mətni təmizləyib JSON-a çevirir."""
    text = raw_text.strip()
    if text.startswith("```json"):
        text = text[7:]
    if text.startswith("```"):
        text = text[3:]
    if text.endswith("```"):
        text = text[:-3]
    text = text.strip()
    
    # JSON array-ı tapmaq üçün
    start_idx = text.find("{")
    end_idx = text.rfind("}")
    if start_idx != -1 and end_idx != -1:
        text = text[start_idx:end_idx+1]
        
    # Escape single backslashes that are not properly escaped, while ignoring already escaped backslashes
    text = re.sub(r'(?<!\\)\\(?!["\\/bfnrtu])', r'\\\\', text)
    
    try:
        return json.loads(text)
    except json.JSONDecodeError as e:
        print(f"JSON xətası: {e}\nRaw output: {raw_text}")
        return None

def main():
    with open(REPORT_FILE, 'r', encoding='utf-8') as f:
        report = json.load(f)
    
    with open(TESTS_FILE, 'r', encoding='utf-8') as f:
        db = json.load(f)
        
    riyaz6_tests = db.get("Riyaziyyat 6", [])
    
    # İzləmə faylı
    if os.path.exists(PROGRESS_FILE):
        with open(PROGRESS_FILE, 'r', encoding='utf-8') as f:
            fixed_ids = json.load(f)
    else:
        fixed_ids = []

    # Düzəldiləcək testləri toplamaq
    tests_to_fix = []
    
    # Əvvəlcə Warning-lər
    for w in report.get("warning_tests", []):
        if w.get("id") not in fixed_ids:
            tests_to_fix.append({
                "id": w.get("id"),
                "issues": w.get("issues", [])
            })
            
    # Sonra Failed-lər
    for f in report.get("failed_tests", []):
        if f.get("id") not in fixed_ids:
            tests_to_fix.append({
                "id": f.get("id"),
                "issues": f.get("issues", [])
            })
            
    print(f"Ümumi düzəldilməli olan test sayı: {len(tests_to_fix)}")
    
    for idx, target in enumerate(tests_to_fix):
        tid = target["id"]
        issues = target["issues"]
        
        # Orijinal testi tapmaq
        orig_test = next((t for t in riyaz6_tests if t.get("id") == tid), None)
        if not orig_test:
            print(f"[{idx+1}/{len(tests_to_fix)}] Diqqət: {tid} bazada tapılmadı!")
            continue
            
        print(f"\n[{idx+1}/{len(tests_to_fix)}] Test ID: {tid} düzəldilir...")
        print(f"   Mövzu: {orig_test.get('topic')} | Çətinlik: {orig_test.get('difficulty')} | Bloom: {orig_test.get('bloom_level')}")
        print(f"   Xətalar: {', '.join(issues)}")
        
        prompt = f"""Sən mükəmməl Riyaziyyat müəllimisən və "Gold Standard 2.1" test yazma qaydalarını bilirsən.
Aşağıda 6-cı sinif "Riyaziyyat" fənni üçün əvvəllər yaradılmış, lakin keyfiyyət yoxlamasından (Audit) KEÇMƏYƏN bir test verilmişdir.

KÖHNƏ TESTİN XƏTALARI:
{json.dumps(issues, ensure_ascii=False, indent=2)}

KÖHNƏ TEST BAZASI:
{json.dumps({
    "question": orig_test.get("question"),
    "options": orig_test.get("options"),
    "correctAnswer": orig_test.get("correctAnswer"),
    "explanation": orig_test.get("explanation"),
    "pedagogical_explanation": orig_test.get("pedagogical_explanation")
}, ensure_ascii=False, indent=2)}

TƏLƏB OLUNAN YENİ TESTİN PARAMETRLƏRİ:
- Mövzu: {orig_test.get('topic')} (Dərslikdəki mətndən və qaydalardan qətiyyən kənara çıxma, mövzuya 100% uyğun olmalıdır)
- Çətinlik: {orig_test.get('difficulty')}
- Taksonomiya (Bloom level): {orig_test.get('bloom_level')}

TƏLƏBATLAR:
1. Səndən KÖHNƏ TESTİ UNUDUB bu parametrlərə uyğun YEPYENİ VƏ İDEAL bir test (sualları, variantları, izahları) yaratmağını istəyirəm. Lakin xətalara diqqət edərək eyni səhvləri təkrarlama.
2. Çıxış FORMATI YALNIZ JSON OLMALIDIR. Heç bir əlavə mətn, izah yazma. JSON bu açarlardan ibarət olmalıdır:
   - "question": (Sualın mətni, Riyazi formullar $...$ (inline) içində yazılmalıdır. Məsələn: $x^2 + 5$)
   - "options": (4 ədəd cavab variantı massiv (array) şəklində, sətir kimi)
   - "correctAnswer": (Düzgün variantın indeksi, 0, 1, 2 və ya 3)
   - "explanation": (Sualın riyazi həlli və qısa izahı, riyazi ifadələr $ işarəsi ilə)
   - "pedagogical_explanation": (Sualın öyrədici, pedaqoji izahı)

DİQQƏT: JSON obyekti qaytar. Əlavə şərh və Markdown (```json) filan YAZMA.
"""

        success = False
        for attempt in range(5):
            try:
                response = client.chat.completions.create(
                    model=MODEL,
                    messages=[{"role": "user", "content": prompt}],
                    temperature=0.3,
                    top_p=0.95,
                    max_tokens=2048,
                    extra_body={"chat_template_kwargs": {"thinking": False}},
                    stream=False
                )
                
                content = response.choices[0].message.content
                new_test_data = clean_json_response(content)
                
                if new_test_data and "question" in new_test_data and "options" in new_test_data and "correctAnswer" in new_test_data:
                    # Gələn dataları köhnə testə tətbiq etmək
                    orig_test["question"] = new_test_data["question"]
                    orig_test["options"] = new_test_data["options"]
                    orig_test["correctAnswer"] = new_test_data["correctAnswer"]
                    orig_test["explanation"] = new_test_data.get("explanation", orig_test.get("explanation"))
                    orig_test["pedagogical_explanation"] = new_test_data.get("pedagogical_explanation", orig_test.get("pedagogical_explanation"))
                    
                    print(f"      ✅ Test yeniləndi! Sual: {orig_test['question'][:50]}...")
                    success = True
                    break
                else:
                    print(f"      ⚠️ Gələn JSON düzgün struktura malik deyil. (Cəhd {attempt+1}/5)")
            except Exception as e:
                print(f"      ❌ API xətası: {e} (Cəhd {attempt+1}/5)")
                
            time.sleep(10)
            
        if success:
            fixed_ids.append(tid)
            # Bazanı yadda saxlamaq
            with open(TESTS_FILE, 'w', encoding='utf-8') as f:
                json.dump(db, f, ensure_ascii=False, indent=2)
            # Progressi yadda saxlamaq
            with open(PROGRESS_FILE, 'w', encoding='utf-8') as f:
                json.dump(fixed_ids, f, ensure_ascii=False, indent=2)
        else:
            print(f"      ❌ {tid} düzəldilə bilmədi! Atlanır...")
            
        # API limitlərini qorumaq üçün fasilə
        time.sleep(5)
        
    print("BÜTÜN TESTLƏRİN DÜZƏLDİLMƏSİ TAMAMLANDI!")

if __name__ == "__main__":
    main()
