import json
import time
import os
import re
from openai import OpenAI
from collections import Counter

# API setup
client = OpenAI(
  base_url = "https://integrate.api.nvidia.com/v1",
  api_key = "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"
)
MODEL = "meta/llama-3.1-70b-instruct"

# File paths
BASE_DIR = r"C:\Users\User\Downloads\azerbaijanaiplatform"
TESTS_FILE = os.path.join(BASE_DIR, "data", "offline_tests.json")
CHUNKS_FILE = os.path.join(BASE_DIR, "data", "textbook-chunks.jsonl")
REPORT_FILE = os.path.join(BASE_DIR, "advanced_audit_report.json")
PROGRESS_FILE = os.path.join(BASE_DIR, "advanced_audit_progress.json")

def load_rag_chunks():
    chunks = []
    if os.path.exists(CHUNKS_FILE):
        with open(CHUNKS_FILE, 'r', encoding='utf-8', errors='replace') as f:
            for line in f:
                try:
                    chunks.append(json.loads(line.strip()))
                except: pass
    return chunks

def get_context_for_topic(topic, all_chunks, max_chunks=3):
    if not topic or not all_chunks: return ""
    topic_words = set(topic.lower().replace('-', ' ').replace('_', ' ').split())
    topic_words = {w for w in topic_words if len(w) > 3}
    if not topic_words: return ""
    
    scored_chunks = []
    for c in all_chunks:
        content = c.get('content', '').lower()
        score = sum(1 for w in topic_words if w in content)
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
    if start_idx != -1 and end_idx != -1:
        text = text[start_idx:end_idx+1]
        
    text = re.sub(r'(?<!\\)\\(?!["\\/bfnrtu])', r'\\\\', text)
    try:
        return json.loads(text)
    except Exception:
        return None

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
    
    if not isinstance(opts, list) or len(opts) != 4:
        errors.append("Options must be exactly 4 items in a list")
    else:
        if any(not str(o).strip() for o in opts):
            errors.append("Empty option found")
        clean_opts = [str(o).strip().lower() for o in opts]
        if len(set(clean_opts)) < 4:
            errors.append("Duplicate options found")
            
    if not isinstance(ans, (int, float)):
        errors.append("correctAnswer is not an integer")
    elif ans < 0 or ans > 3:
        errors.append(f"correctAnswer {ans} is out of bounds (0-3)")
        
    if not expl:
        errors.append("Explanation is empty")
    elif len(expl) < 10:
        errors.append("Explanation too short")
    elif re.search(r'\b[A-D]\s+variantı\b|\bCavab\s+[A-D]\b', expl, re.IGNORECASE):
        errors.append("Explanation references explicit variant letters (A/B/C/D variantı)")
        
    valid_blooms = ['xatırlama', 'anlama', 'tətbiq', 'təhlil', 'dəyərləndirmə', 'yaratma', 'bilmə', 'analiz', 'təhliletmə', 'tədbiq', 'remember', 'understand', 'apply', 'analyze', 'evaluate', 'create']
    if bloom and not any(b in bloom for b in valid_blooms):
        errors.append(f"Invalid bloom level: {bloom}")
        
    q_hash = hash(q_text.lower())
    if q_hash in db_hashes:
        errors.append("Duplicate question text in database")
    else:
        db_hashes.add(q_hash)
        
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
                stream=False
            )
            content = response.choices[0].message.content
            res = clean_json_response(content)
            if res and "overall_decision" in res:
                return res
        except Exception as e:
            time.sleep(3)
    return None

def main():
    print("Loading textbooks for RAG...")
    all_chunks = load_rag_chunks()
    print(f"Loaded {len(all_chunks)} chunks.")
    
    with open(TESTS_FILE, 'r', encoding='utf-8') as f:
        db = json.load(f)
        
    tests_to_check = []
    db_hashes = set()
    
    for subject_key, tests in db.items():
        if isinstance(tests, list) and re.search(r'\b7\b', subject_key):
            for t in tests:
                tests_to_check.append({
                    "subject": subject_key,
                    "test": t
                })
                
    print(f"Ümumi yoxlanmalı olan 7-ci sinif test sayı: {len(tests_to_check)}")
    
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
            
        topic = test_obj.get('topic', '')
        context = get_context_for_topic(topic, all_chunks)
        
        # Determine original letter
        ans_idx = int(test_obj.get('correctAnswer', 0))
        letter = chr(65 + ans_idx) if 0 <= ans_idx <= 3 else "?"
        
        prompt = f"""Sən təhsil ölçmə-nəzəriyyəsi (Testologiya) və AI Evaluation üzrə baş ekspertsən.

Aşağıda 7-ci sinif "{subj}" fənni üçün yaradılmış bir test verilmişdir. 

=== DƏRSLİK KONTEKSTİ (Mövzu: {topic}) ===
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
1. Construct Validity & Fact-checking: Dərslik kontekstinə əsasən faktoloji doğru vardırmı?
2. Correct Answer Verification: Özün sualı addım-addım həll et və verilmiş doğru cavabın düzgünlüyünü təsdiqlə! 
3. Bloom Taxonomy: İddia edilən koqnitiv yükə uyğundurmu?
4. Distractor Efficiency: Səhv variantlar cəlbedicidirmi və şagird səhvinə əsaslanırmı?
5. Language & Ambiguity: İkidəyərlilik varmı?

DİQQƏT YALNIZ JSON QAYTAR. JSON sxemi:
{{
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
            
            # Select the response that matches final decision
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
        
    print("\nBÜTÜN 7-Cİ SİNİF TESTLƏRİNİN YOXLANIŞI TAMAMLANDI!")

if __name__ == "__main__":
    main()
