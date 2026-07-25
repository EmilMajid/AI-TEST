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
REPORT_FILE = os.path.join(BASE_DIR, "hybrid_grade7_audit_report.json")
PROGRESS_FILE = os.path.join(BASE_DIR, "hybrid_grade7_progress.json")

def clean_json_response(raw_text):
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

def run_deterministic_checks(t):
    """
    Python məntiqi ilə (LLM olmadan) testin strukturunu və Gold Standard 2.1 tələblərini yoxlayır.
    """
    errors = []
    
    required_keys = ['question', 'options', 'correctAnswer', 'explanation']
    for k in required_keys:
        if k not in t or t[k] is None:
            errors.append(f"Missing or null field: {k}")
            
    # Gold Standard 2.1: Options formatı
    opts = t.get('options')
    if isinstance(opts, dict):
        errors.append("Options is a dict, should be a list (GS 2.1)")
    elif isinstance(opts, list):
        if len(opts) != 4:
            errors.append(f"Options list has {len(opts)} items, expected 4")
    else:
        errors.append("Options is not a list")
        
    ans = t.get('correctAnswer')
    if not isinstance(ans, int) and not isinstance(ans, float): # some times it parses as float
        errors.append("correctAnswer is not an integer")
    elif isinstance(ans, (int, float)) and (ans < 0 or ans > 3):
        errors.append(f"correctAnswer {ans} is out of bounds (0-3)")
        
    # Gold Standard 2.1: Explanation variant reference check
    expl = str(t.get('pedagogical_explanation') or t.get('explanation') or '')
    if re.search(r'\b[A-D]\s+variantı\b|\bCavab\s+[A-D]\b', expl, re.IGNORECASE):
        errors.append("Explanation references explicit variant letters like 'A variantı' (GS 2.1 violation)")
        
    if not str(t.get('question', '')).strip():
        errors.append("Question text is empty")
        
    return errors

def main():
    with open(TESTS_FILE, 'r', encoding='utf-8') as f:
        db = json.load(f)
        
    tests_to_check = []
    all_passport_ids = set()
    duplicate_ids = set()
    
    # Check for duplicates across the database
    for key, tests in db.items():
        if isinstance(tests, list):
            for t in tests:
                pid = t.get('passport_id')
                if pid:
                    if pid in all_passport_ids:
                        duplicate_ids.add(pid)
                    all_passport_ids.add(pid)
                    
    # Select only 7th grade tests
    for subject_key, tests in db.items():
        if isinstance(tests, list) and re.search(r'\b7\b', subject_key):
            for t in tests:
                tests_to_check.append({
                    "subject": subject_key,
                    "test": t
                })
                
    print(f"Ümumi yoxlanmalı olan 7-ci sinif test sayı: {len(tests_to_check)}")
    
    if os.path.exists(PROGRESS_FILE):
        with open(PROGRESS_FILE, 'r', encoding='utf-8') as f:
            checked_ids = json.load(f)
    else:
        checked_ids = []

    if os.path.exists(REPORT_FILE):
        with open(REPORT_FILE, 'r', encoding='utf-8') as f:
            report = json.load(f)
    else:
        report = {"failed_tests": [], "warning_tests": [], "passed_tests": []}

    for idx, item in enumerate(tests_to_check):
        subj = item["subject"]
        test_obj = item["test"]
        
        tid = test_obj.get("id") or test_obj.get("passport_id") or f"unknown_{idx}"
        
        if tid in checked_ids:
            continue
            
        print(f"\n[{idx+1}/{len(tests_to_check)}] Test ID: {tid} ({subj}) yoxlanılır...")
        
        # --- PHASE 1: DETERMINISTIC VALIDATION ---
        det_errors = run_deterministic_checks(test_obj)
        if test_obj.get('passport_id') in duplicate_ids:
            det_errors.append("Duplicate passport_id across database")
            
        if det_errors:
            print(f"      ❌ Deterministik xəta: {det_errors[0]}")
            report["failed_tests"].append({
                "id": tid,
                "subject": subj,
                "test": test_obj,
                "audit_type": "deterministic",
                "issues": det_errors
            })
            checked_ids.append(tid)
            with open(REPORT_FILE, 'w', encoding='utf-8') as f: json.dump(report, f, ensure_ascii=False, indent=2)
            with open(PROGRESS_FILE, 'w', encoding='utf-8') as f: json.dump(checked_ids, f, ensure_ascii=False, indent=2)
            continue
            
        # --- PHASE 2: LLM EXPERT VALIDATION ---
        prompt = f"""Sən təhsil ölçmə-nəzəriyyəsi (Testologiya) və AI Evaluation üzrə baş ekspertsən.
Aşağıda 7-ci sinif "{subj}" fənni üçün yaradılmış bir test verilmişdir. 

KÖHNƏ TEST BAZASI:
{json.dumps({
    "question": test_obj.get("question"),
    "options": test_obj.get("options"),
    "correctAnswer": test_obj.get("correctAnswer"),
    "explanation": test_obj.get("explanation"),
    "difficulty": test_obj.get("difficulty"),
    "bloom_level": test_obj.get("bloom_level"),
    "topic": test_obj.get("topic")
}, ensure_ascii=False, indent=2)}

QİYMƏTLƏNDİRMƏ MEYARLARI (SİTG və Gold Standard 2.1):
1. Construct Validity (Məzmun etibarlılığı): Sual elmi/faktoloji cəhətdən tam doğrudurmu? Mövzuya ("{test_obj.get('topic')}") uyğundurmu?
2. Bloom Taxonomy: Sualın koqnitiv yükü iddia edilən Bloom səviyyəsinə ({test_obj.get('bloom_level')}) həqiqətən uyğundurmu? (Məsələn, "Tətbiq" deyilibsə, tərif soruşmamalıdır).
3. Distractor Efficiency (Distraktorların keyfiyyəti): Səhv variantlar (A,B,C,D) uydurma deyil ki? Tipik şagird səhvlərinə əsaslanırmı? Bir-birini və ya doğru cavabı istisna etmir ki?
4. Formatting & Ambiguity: Sual aydındırmı? İkidəyərlilik yoxdur ki? İzah (explanation) pedaqoji cəhətdən əsaslandırılıbmı və sadəcə doğru cavabı bildirməklə kifayətlənmir ki?

TƏLƏB: 
Bu testi diqqətlə, hər bir meyar üzrə analiz et. Çıxış FORMATI YALNIZ JSON OLMALIDIR. 
JSON sxemi (başqa heç nə yazma):
{{
  "validity": {{"score": [1-dən 5-ə qədər bal], "reasoning": "[Qısa izah]"}},
  "bloom": {{"score": [1-dən 5-ə qədər bal], "reasoning": "[Qısa izah]"}},
  "distractors": {{"score": [1-dən 5-ə qədər bal], "reasoning": "[Qısa izah]"}},
  "overall_decision": "[PASS, WARNING, və ya FAIL]",
  "main_issues": ["[Əsas problemlər siyahısı, problem yoxdursa boş massiv]"]
}}

Qeyd: Hər bir səhv/şübhəli məqam üçün score-u aşağı sal. Əgər ciddi faktoloji xəta və ya aşkar struktur qüsuru varsa overall_decision FAIL olsun. Kiçik qüsurlara WARNING, mükəmməl testlərə PASS ver.
"""

        success = False
        for attempt in range(3):
            try:
                response = client.chat.completions.create(
                    model=MODEL,
                    messages=[{"role": "user", "content": prompt}],
                    temperature=0.0,
                    top_p=0.95,
                    max_tokens=1024,
                    stream=False
                )
                
                content = response.choices[0].message.content
                audit_result = clean_json_response(content)
                
                if audit_result is not None and "overall_decision" in audit_result:
                    decision = audit_result.get("overall_decision", "FAIL")
                    
                    record = {
                        "id": tid,
                        "subject": subj,
                        "test": test_obj,
                        "audit_type": "llm_expert",
                        "audit_details": audit_result
                    }
                    
                    if decision == "PASS":
                        report["passed_tests"].append(record)
                        print("      ✅ LLM Ekspert: PASS")
                    elif decision == "WARNING":
                        report["warning_tests"].append(record)
                        print(f"      ⚠️ LLM Ekspert: WARNING - {audit_result.get('main_issues', [''])[0]}")
                    else:
                        report["failed_tests"].append(record)
                        print(f"      ❌ LLM Ekspert: FAIL - {audit_result.get('main_issues', [''])[0]}")
                        
                    success = True
                    break
                else:
                    print(f"      ⚠️ Gələn JSON düzgün deyil. (Cəhd {attempt+1}/3)")
            except Exception as e:
                print(f"      ❌ API xətası: {e} (Cəhd {attempt+1}/3)")
                
            time.sleep(5)
            
        if success:
            checked_ids.append(tid)
            with open(REPORT_FILE, 'w', encoding='utf-8') as f: json.dump(report, f, ensure_ascii=False, indent=2)
            with open(PROGRESS_FILE, 'w', encoding='utf-8') as f: json.dump(checked_ids, f, ensure_ascii=False, indent=2)
        else:
            print(f"      ❌ {tid} yoxlanıla bilmədi! Atlanır...")
            
        time.sleep(2)
        
    print("\nBÜTÜN 7-Cİ SİNİF TESTLƏRİNİN YOXLANIŞI TAMAMLANDI!")

if __name__ == "__main__":
    main()
