import json
import time
import os
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
REPORT_FILE = os.path.join(BASE_DIR, "grade7_audit_report.json")
PROGRESS_FILE = os.path.join(BASE_DIR, "verify_grade7_progress.json")

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
    
    start_idx = text.find("{")
    end_idx = text.rfind("}")
    if start_idx != -1 and end_idx != -1:
        text = text[start_idx:end_idx+1]
        
    text = re.sub(r'(?<!\\)\\(?!["\\/bfnrtu])', r'\\\\', text)
    
    try:
        return json.loads(text)
    except json.JSONDecodeError as e:
        print(f"JSON xətası: {e}\nRaw output: {raw_text}")
        return None

def main():
    # Bütün testləri yükləyirik
    with open(TESTS_FILE, 'r', encoding='utf-8') as f:
        db = json.load(f)
        
    # Yalnız 7-ci sinif testlərini seçirik
    tests_to_check = []
    for subject_key, tests in db.items():
        if isinstance(tests, list) and re.search(r'\b7\b', subject_key):
            for t in tests:
                tests_to_check.append({
                    "subject": subject_key,
                    "test": t
                })
                
    print(f"Ümumi yoxlanmalı olan 7-ci sinif test sayı: {len(tests_to_check)}")
    
    # İzləmə faylı (qaldığımız yerdən davam etmək üçün)
    if os.path.exists(PROGRESS_FILE):
        with open(PROGRESS_FILE, 'r', encoding='utf-8') as f:
            checked_ids = json.load(f)
    else:
        checked_ids = []

    # Hesabat faylı
    if os.path.exists(REPORT_FILE):
        with open(REPORT_FILE, 'r', encoding='utf-8') as f:
            report = json.load(f)
    else:
        report = {"failed_tests": [], "warning_tests": [], "passed_tests": []}

    for idx, item in enumerate(tests_to_check):
        subj = item["subject"]
        test_obj = item["test"]
        tid = test_obj.get("id") or test_obj.get("passport_id", f"unknown_{idx}")
        
        if tid in checked_ids:
            continue
            
        print(f"\n[{idx+1}/{len(tests_to_check)}] Test ID: {tid} ({subj}) yoxlanılır...")
        
        prompt = f"""Sən təhsil keyfiyyəti üzrə ekspertsən və SİTG (Milli AI Test Generasiya Standartı) Qaydalarını bilirsən.
Aşağıda 7-ci sinif "{subj}" fənni üçün yaradılmış bir test verilmişdir. 

KÖHNƏ TEST BAZASI:
{json.dumps({
    "question": test_obj.get("question"),
    "options": test_obj.get("options"),
    "correctAnswer": test_obj.get("correctAnswer"),
    "explanation": test_obj.get("explanation"),
    "difficulty": test_obj.get("difficulty"),
    "bloom_level": test_obj.get("bloom_level")
}, ensure_ascii=False, indent=2)}

SİTG STANDARTLARI:
1. Validlik və Etibarlılıq: Ölçülən bacarıqla cavab arasında birbaşa əlaqə.
2. Əzbərçiliyin Qarşısının Alınması: Suallar tərif yox, tətbiq və təhlil tələb etməlidir.
3. Distraktor Standartı: Yanlış variantlar (A,B,C,D) uydurma olmamalı, tipik tələbə səhvlərinə əsaslanmalı və bir-birini məntiqi kəsməməlidir.

TƏLƏB: 
Bu testi diqqətlə oxu və standartlara uyğun olub-olmadığını yoxla. 
Çıxış FORMATI YALNIZ JSON OLMALIDIR. Heç bir əlavə mətn yazma. JSON bu açarlardan ibarət olmalıdır:
- "is_valid": (True və ya False. Test idealdırsa True, deyilə False)
- "issues": (Əgər testdə problem varsa, problemlərin siyahısı massiv şəklində. Problem yoxdursa boş massiv [])
- "severity": ("high", "warning" və ya "none")

DİQQƏT: Yalnız JSON obyekti qaytar.
"""

        success = False
        for attempt in range(3):
            try:
                response = client.chat.completions.create(
                    model=MODEL,
                    messages=[{"role": "user", "content": prompt}],
                    temperature=0.1,
                    top_p=0.95,
                    max_tokens=1024,
                    stream=False
                )
                
                content = response.choices[0].message.content
                audit_result = clean_json_response(content)
                
                if audit_result is not None and "is_valid" in audit_result:
                    is_valid = audit_result.get("is_valid")
                    issues = audit_result.get("issues", [])
                    severity = audit_result.get("severity", "none")
                    
                    record = {
                        "id": tid,
                        "subject": subj,
                        "issues": issues
                    }
                    
                    if is_valid:
                        report["passed_tests"].append(record)
                        print("      ✅ Test təsdiqləndi! Problem yoxdur.")
                    elif severity == "warning":
                        report["warning_tests"].append(record)
                        print(f"      ⚠️ Xəbərdarlıq tapıldı: {issues[0] if issues else 'Naməlum'}")
                    else:
                        report["failed_tests"].append(record)
                        print(f"      ❌ Kritik xəta tapıldı: {issues[0] if issues else 'Naməlum'}")
                        
                    success = True
                    break
                else:
                    print(f"      ⚠️ Gələn JSON düzgün deyil. (Cəhd {attempt+1}/3)")
            except Exception as e:
                print(f"      ❌ API xətası: {e} (Cəhd {attempt+1}/3)")
                
            time.sleep(5)
            
        if success:
            checked_ids.append(tid)
            # Hesabatı və progressi tez-tez yadda saxlamaq
            with open(REPORT_FILE, 'w', encoding='utf-8') as f:
                json.dump(report, f, ensure_ascii=False, indent=2)
            with open(PROGRESS_FILE, 'w', encoding='utf-8') as f:
                json.dump(checked_ids, f, ensure_ascii=False, indent=2)
        else:
            print(f"      ❌ {tid} yoxlanıla bilmədi! Atlanır...")
            
        # API limitlərini qorumaq üçün qısa fasilə
        time.sleep(2)
        
    print("\nBÜTÜN 7-Cİ SİNİF TESTLƏRİNİN YOXLANIŞI TAMAMLANDI!")

if __name__ == "__main__":
    main()
