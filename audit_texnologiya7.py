import json
import time
import os
import re
import sys
from openai import OpenAI
from collections import Counter

sys.stdout.reconfigure(encoding='utf-8')

client = OpenAI(
  base_url = "https://integrate.api.nvidia.com/v1",
  api_key = "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"
)
MODEL = "meta/llama-3.1-70b-instruct"

BASE_DIR = r"C:\Users\User\Downloads\azerbaijanaiplatform"
TESTS_FILE = os.path.join(BASE_DIR, "data", "offline_tests.json")
CHUNKS_FILE = os.path.join(BASE_DIR, "data", "textbook-chunks.jsonl")
REPORT_FILE = os.path.join(BASE_DIR, "texnologiya7_audit_report.json")
PROGRESS_FILE = os.path.join(BASE_DIR, "texnologiya7_audit_progress.json")

TOPICS_LIST = """Məişət mədəniyyəti
1. İctimai yerlərdə davranış və ünsiyyət mədəniyyəti
2. Ailə xərclərinin təyin edilməsi. Qidalanmaya ayrılmış vəsait
3. Ev quşlarının bəslənməsi texnologiyası
4. Şagird partalarının və məişət masalarının təmiri
5. Stulların təmiri
Oduncağın emalı texnologiyası
6. Quraşdırma elementləri olan məmulatların spesifikasiyası
7. Oduncağın əsas fiziki və mexaniki xassələri
8. Oduncağın zivana ilə birləşdirilməsi
9. Nəfəslik üçün çərçivənin hazırlanması texnologiyası
Elektrotexniki işlər
10. Maşın və mexanizmlər haqqında məlumat
11. Elektrik çaydanının quruluşu və iş prinsipi
12. Elektrik ütüsünün quruluşu və iş prinsipi
13. Fenin quruluşu və iş prinsipi
Metalın emalı texnologiyası
14. Metalların növləri və xassələri. Prokat haqqında məlumat
15. Metalın çapılma texnologiyası
16. Mətbəx bıçağının itilənmə texnologiyası
17. Detalların yivli birləşmələri
18. Burğu dəzgahının quruluşu və iş prinsipi
Ərzaq məhsullarının emalı texnologiyası
19. Balığın mexaniki emalı texnologiyası
20. Balığın isti emalı. Balıq yeməkləri
21. Quş ətinin mexaniki mətbəx emalı texnologiyası
22. Ətin mexaniki emalı texnologiyası
23. Duru yeməklərin hazırlanması texnologiyası
Parçanın emalı texnologiyası
24. Süni və sintetik liflərdən parçalar
25. Əl ilə yerinə yetirilən tikiş əməliyyatları
26. Naxışvurma texnologiyası"""

def load_rag_chunks():
    chunks = []
    if os.path.exists(CHUNKS_FILE):
        with open(CHUNKS_FILE, 'r', encoding='utf-8', errors='replace') as f:
            for line in f:
                try: chunks.append(json.loads(line.strip()))
                except: pass
    return chunks

def get_context_for_query(query, all_chunks, max_chunks=3):
    if not query or not all_chunks: return ""
    query_words = set(query.lower().replace('-', ' ').replace('_', ' ').split())
    query_words = {w for w in query_words if len(w) > 3}
    if not query_words: return ""
    
    scored_chunks = []
    for c in all_chunks:
        content = c.get('content', '').lower()
        score = sum(1 for w in query_words if w in content)
        if score > 0:
            scored_chunks.append((score, c.get('content', '')))
            
    scored_chunks.sort(key=lambda x: x[0], reverse=True)
    top_chunks = [c[1] for c in scored_chunks[:max_chunks]]
    return "\n---\n".join(top_chunks)[:3000]

def clean_json_response(raw_text):
    text = raw_text.strip()
    if text.startswith("```json"): text = text[7:]
    if text.startswith("```"): text = text[3:]
    if text.endswith("```"): text = text[:-3]
    text = text.strip()
    start_idx = text.find("{")
    end_idx = text.rfind("}")
    if start_idx != -1 and end_idx != -1: text = text[start_idx:end_idx+1]
    text = re.sub(r'(?<!\\)\\(?!["\\/bfnrtu])', r'\\\\', text)
    try: return json.loads(text)
    except Exception: return None

def run_advanced_deterministic_checks(t, db_hashes):
    errors = []
    q_text = str(t.get('question', '')).strip()
    opts = t.get('options', [])
    ans = t.get('correctAnswer')
    expl = str(t.get('explanation') or t.get('pedagogical_explanation') or '').strip()
    bloom = str(t.get('bloom_level', '')).lower().strip()
    
    if not q_text: errors.append("Empty question")
    if len(q_text) < 10: errors.append("Question too short")
    if "  " in q_text: errors.append("Double spaces in question")
    if "<br>" in q_text or "<div>" in q_text: errors.append("HTML tags found in question")
    
    if not isinstance(opts, list) or len(opts) != 4: errors.append("Options must be exactly 4 items in a list")
    else:
        if any(not str(o).strip() for o in opts): errors.append("Empty option found")
        clean_opts = [str(o).strip().lower() for o in opts]
        if len(set(clean_opts)) < 4: errors.append("Duplicate options found")
            
    if not isinstance(ans, (int, float)): errors.append("correctAnswer is not an integer")
    elif ans < 0 or ans > 3: errors.append(f"correctAnswer {ans} is out of bounds (0-3)")
        
    if not expl: errors.append("Explanation is empty")
    elif len(expl) < 10: errors.append("Explanation too short")
    elif re.search(r'\b[A-D]\s+variantı\b|\bCavab\s+[A-D]\b', expl, re.IGNORECASE):
        errors.append("Explanation references explicit variant letters (A/B/C/D variantı)")
        
    q_hash = hash(q_text.lower())
    if q_hash in db_hashes: errors.append("Duplicate question text in database")
    else: db_hashes.add(q_hash)
    return errors

def call_llm(prompt):
    for attempt in range(3):
        try:
            response = client.chat.completions.create(
                model=MODEL,
                messages=[{"role": "user", "content": prompt}],
                temperature=0.0,
                top_p=0.95,
                max_tokens=2048,
                stream=False,
                timeout=45
            )
            content = response.choices[0].message.content
            res = clean_json_response(content)
            if res and "overall_decision" in res: return res
        except Exception as e:
            print(f"      API xetasi (cehddd {attempt+1}/3): {type(e).__name__}")
            time.sleep(3)
    return None

def main():
    print("Loading textbooks for RAG...")
    all_chunks = load_rag_chunks()
    
    with open(TESTS_FILE, 'r', encoding='utf-8') as f: db = json.load(f)
        
    tests_to_check = []
    db_hashes = set()
    
    for subject_key, tests in db.items():
        if isinstance(tests, list) and "Texnologiya" in subject_key and "7" in subject_key:
            for t in tests:
                tests_to_check.append({"subject": subject_key, "test": t})
                
    print(f"Ümumi yoxlanmalı olan Texnologiya 7 test sayı: {len(tests_to_check)}")
    
    if os.path.exists(PROGRESS_FILE):
        with open(PROGRESS_FILE, 'r', encoding='utf-8') as f: checked_ids = json.load(f)
    else: checked_ids = []

    if os.path.exists(REPORT_FILE):
        with open(REPORT_FILE, 'r', encoding='utf-8') as f: report = json.load(f)
    else: report = {"failed_tests": [], "warning_tests": [], "passed_tests": []}

    for idx, item in enumerate(tests_to_check):
        subj = item["subject"]
        test_obj = item["test"]
        tid = test_obj.get("id") or test_obj.get("passport_id") or f"unknown_{idx}"
        
        if tid in checked_ids: continue
            
        print(f"\n[{idx+1}/{len(tests_to_check)}] Test ID: {tid} ({subj}) yoxlanılır...")
        
        det_errors = run_advanced_deterministic_checks(test_obj, db_hashes)
        if det_errors:
            print(f"      ❌ Deterministik xəta: {det_errors[0]}")
            report["failed_tests"].append({"test_id": tid, "audit_type": "deterministic", "issues": det_errors})
            checked_ids.append(tid)
            with open(REPORT_FILE, 'w', encoding='utf-8') as f: json.dump(report, f, ensure_ascii=False, indent=2)
            with open(PROGRESS_FILE, 'w', encoding='utf-8') as f: json.dump(checked_ids, f, ensure_ascii=False, indent=2)
            continue
            
        # RAG context - we use the question text to find relevant textbook chunks since 'topic' is just "Texnologiya"
        context_query = test_obj.get('question', '')
        context = get_context_for_query(context_query, all_chunks)
        
        ans_idx = int(test_obj.get('correctAnswer', 0))
        letter = chr(65 + ans_idx) if 0 <= ans_idx <= 3 else "?"
        
        prompt = f"""Sən təhsil ölçmə-nəzəriyyəsi (Testologiya) və AI Evaluation üzrə baş ekspertsən.

Aşağıda 7-ci sinif "{subj}" fənni üçün yaradılmış bir test verilmişdir. Hazırda bu testin mövzusu ümumi olaraq qeyd edilib, sənin vəzifələrindən biri onu uyğun mövzuya bağlamaqdır.

=== DƏRSLİK KONTEKSTİ (Axtarış əsasında tapılan mətn) ===
{context if context else "(Mövzu ilə bağlı dərslik konteksti tapılmadı. Ümumi elmi-pedaqoji biliyinlə yoxla.)"}
======================================================

KÖHNƏ TEST BAZASI:
Sual: {test_obj.get('question')}
A) {test_obj.get('options')[0]}
B) {test_obj.get('options')[1]}
C) {test_obj.get('options')[2]}
D) {test_obj.get('options')[3]}
Doğru cavab indeksi: {ans_idx} (Yəni doğru variant {letter})
İzah: {test_obj.get('explanation') or test_obj.get('pedagogical_explanation')}
Çətinlik: {test_obj.get('difficulty')}
Bloom: {test_obj.get('bloom_level')}

QİYMƏTLƏNDİRMƏ MEYARLARI:
1. Topic Classification: MÖVZULAR SİYAHISI-ndan testə ən uyğun olanı seç.
2. Construct Validity & Fact-checking: Dərslik kontekstinə əsasən faktoloji doğru vardırmı?
3. Correct Answer Verification: Özün sualı həll et və verilmiş doğru cavabın düzgünlüyünü təsdiqlə.
4. Bloom Taxonomy: İddia edilən koqnitiv yükə uyğundurmu?
5. Distractor Efficiency: Səhv variantlar cəlbedicidirmi və şagird səhvinə əsaslanırmı?
6. Language & Ambiguity: İkidəyərlilik varmı?

MÖVZULAR SİYAHISI:
{TOPICS_LIST}

DİQQƏT YALNIZ JSON QAYTAR. JSON sxemi:
{{
  "assigned_topic": "[Yuxarıdakı 26 mövzudan ən uyğun gələnin tam adı. Əgər heç birinə qətiyyən uyğun gəlmirsə 'Unknown' yaz]",
  "correct_answer_verification": {{
    "computed_correct_answer": "[Öz tapdığın variant hərfi, məsələn A, B, C və ya D]",
    "expected_correct_answer": "{letter}",
    "answer_matches": true,
    "justification": "[Qısa əsaslandırma. Məsələn: 'Mətnə əsasən B variantı düzgündür.']"
  }},
  "scores": {{
    "validity": [1-dən 5-ə qədər bal],
    "bloom_alignment": [1-5],
    "distractors": [1-5]
  }},
  "overall_decision": "[PASS, WARNING, və ya FAIL]",
  "main_issues": ["[Əsas problemlər siyahısı, problem yoxdursa boş massiv]"]
}}
"""

        res1 = call_llm(prompt)
        if not res1:
            print("      ❌ API xətası və ya JSON oxunmadı.")
            continue
            
        decision = res1.get("overall_decision", "FAIL")
        final_res = res1
        
        if decision == "WARNING":
            print("      ⚠️ Qərar şübhəlidir (WARNING). Consensus Engine işə salınır (Majority Voting)...")
            res2 = call_llm(prompt)
            res3 = call_llm(prompt)
            
            decisions = [decision]
            if res2: decisions.append(res2.get("overall_decision", "FAIL"))
            if res3: decisions.append(res3.get("overall_decision", "FAIL"))
            
            counts = Counter(decisions)
            final_decision = counts.most_common(1)[0][0]
            for r in [res1, res2, res3]:
                if r and r.get("overall_decision") == final_decision:
                    final_res = r
                    break
            decision = final_decision
            print(f"      🔎 Consensus Nəticəsi: {decision} (Səslər: {dict(counts)})")
        else:
            if decision == "PASS": print("      ✅ LLM Ekspert: PASS")
            else: print(f"      ❌ LLM Ekspert: FAIL - {final_res.get('main_issues', [''])[0][:100]}")

        record = {
            "test_id": tid,
            "assigned_topic": final_res.get("assigned_topic", "Unknown"),
            "audit_type": "llm_expert",
            "scores": final_res.get("scores", {}),
            "correct_answer_verification": final_res.get("correct_answer_verification", {}),
            "issues": final_res.get("main_issues", [])
        }
        
        if decision == "PASS": report["passed_tests"].append(record)
        elif decision == "WARNING": report["warning_tests"].append(record)
        else: report["failed_tests"].append(record)
            
        checked_ids.append(tid)
        with open(REPORT_FILE, 'w', encoding='utf-8') as f: json.dump(report, f, ensure_ascii=False, indent=2)
        with open(PROGRESS_FILE, 'w', encoding='utf-8') as f: json.dump(checked_ids, f, ensure_ascii=False, indent=2)
            
        time.sleep(1)
        
    print("\nBÜTÜN TEXNOLOGİYA 7 TESTLƏRİNİN YOXLANIŞI TAMAMLANDI!")

if __name__ == "__main__":
    main()
