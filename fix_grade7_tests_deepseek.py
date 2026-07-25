import json
import time
import os
import re
import sys
from openai import OpenAI
import argparse

sys.stdout.reconfigure(encoding='utf-8')

client = OpenAI(
  base_url = "https://integrate.api.nvidia.com/v1",
  api_key = "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"
)
MODELS = [
    "deepseek-ai/deepseek-v4-pro",
    "meta/llama-3.3-70b-instruct",
    "mistralai/mistral-large",
    "deepseek-ai/deepseek-v4-flash"
]

BASE_DIR = r"C:\Users\User\Downloads\azerbaijanaiplatform"
TESTS_FILE = os.path.join(BASE_DIR, "data", "offline_tests.json")
CHUNKS_FILE = os.path.join(BASE_DIR, "data", "textbook-chunks.jsonl")

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
    return "\n---\n".join(top_chunks)[:4000]

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
    try: return json.loads(text)
    except Exception as e: 
        print(f"JSON Parse Error: {e}")
        return None

def is_boilerplate(test):
    q_text = str(test.get('question', '')).lower()
    opts = test.get('options', [])
    
    # Check question patterns
    if 'aşağıdakı fikirlərdən' in q_text and 'hansı tamamilə doğrudur' in q_text:
        return True
        
    # Check option patterns
    for o in opts:
        o_lower = str(o).lower()
        if 'tamamilə başqa bir fənnin' in o_lower: return True
        if 'müasir dərslik proqramı çərçivəsində səhv' in o_lower: return True
        if 'standartlarına qətiyyən uyğun gəlmir' in o_lower: return True
        if 'standartlarına tam şəkildə uyğundur' in o_lower: return True
        
    return False

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--subject", required=True, help="Məsələn: 'Texnologiya 7'")
    args = parser.parse_args()
    
    subject = args.subject
    print(f"[{subject}] analizinə başlanılır...")
    
    with open(TESTS_FILE, 'r', encoding='utf-8') as f:
        db = json.load(f)
        
    if subject not in db:
        print(f"XƏTA: {subject} fənni bazada tapılmadı!")
        return
        
    tests = db[subject]
    all_chunks = load_rag_chunks()
    
    PROGRESS_FILE = os.path.join(BASE_DIR, "scratch", f"fix_{subject.replace(' ', '_').lower()}_progress.json")
    if os.path.exists(PROGRESS_FILE):
        with open(PROGRESS_FILE, 'r', encoding='utf-8') as f:
            fixed_indices = json.load(f)
    else:
        fixed_indices = []
        
    # Find all boilerplate tests
    tests_to_fix = []
    for i, t in enumerate(tests):
        if is_boilerplate(t):
            if i not in fixed_indices:
                tests_to_fix.append((i, t))
                
    print(f"Ümumi tapılan şablon (boilerplate) test sayı: {len(tests_to_fix)}")
    
    for count, (idx, orig_test) in enumerate(tests_to_fix):
        print(f"\n[{count+1}/{len(tests_to_fix)}] Index {idx} yenidən yaradılır...")
        topic = orig_test.get('topic', 'Naməlum Mövzu')
        difficulty = orig_test.get('difficulty', 'orta')
        bloom = orig_test.get('bloom_level', 'tətbiq')
        
        context = get_context_for_query(topic, all_chunks)
        if not context:
            context = "Dərslik konteksti tapılmadı. Mövzuya uyğun real, məntiqli və praktik bir sual yaradın."
            
        print(f"   Mövzu: {topic}")
        
        prompt = f"""Sən mükəmməl müəllimsən. "Gold Standard 2.1" test yazma qaydalarını bilirsən.
Aşağıdakı test tamamilə şablondur (Boilerplate) və sən onu sıfırdan, təqdim olunan dərslik mətni əsasında yeni, real, öyrədici bir test ilə əvəzləməlisən.

DƏRSLİK KONTEKSTİ (Bura əsasən sual çıxar):
{context}

TƏLƏB OLUNAN YENİ TESTİN PARAMETRLƏRİ:
- Mövzu: {topic} (Kontekstdən kənara çıxma, sırf bu mövzudan soruş)
- Çətinlik: {difficulty}
- Taksonomiya (Bloom level): {bloom}

TƏLƏBATLAR:
1. "Bu fənnə aiddir", "Dərsliyə uyğundur" kimi şablon ifadələrdən QƏTİYYƏN İSTİFADƏ ETMƏ. Suallar kitabdan konkret fakt, anlayış və ya situasiya barədə olmalıdır.
2. "explanation" hissəsində doğru cavabın izahını verərkən HÖKMƏN yuxarıdakı DƏRSLİK KONTEKSTİNDƏN orijinal bir cümləni/hissəni olduğu kimi (sitat formasında) daxil et ki, testin bilavasitə dərsliyə əsaslandığı sübut olunsun.
3. Çıxış FORMATI YALNIZ JSON OLMALIDIR. Heç bir əlavə mətn, Markdown (```json) yazma. JSON strukturu:
{{
  "question": "Sualın mətni",
  "options": ["Variant A", "Variant B", "Variant C", "Variant D"],
  "correctAnswer": 0,
  "explanation": "Doğru variantın izahı və dərslikdən götürülmüş orijinal sitat (Dərslikdə qeyd olunur ki: '...')",
  "pedagogical_explanation": "Bu sualın şagirdə nə öyrətdiyinə dair pedaqoji izah"
}}
"""
        
        success = False
        
        for model_name in MODELS:
            if success: break
            
            for attempt in range(3):
                try:
                    response = client.chat.completions.create(
                        model=model_name,
                        messages=[{"role": "user", "content": prompt}],
                        temperature=0.7,
                        top_p=0.95,
                        max_tokens=2048,
                        extra_body={"chat_template_kwargs": {"thinking": False}},
                        stream=False
                    )
                    
                    content = response.choices[0].message.content
                    new_test_data = clean_json_response(content)
                    
                    if new_test_data and "question" in new_test_data and "options" in new_test_data and "correctAnswer" in new_test_data:
                        # Update DB
                        db[subject][idx]["question"] = new_test_data["question"]
                        db[subject][idx]["options"] = new_test_data["options"]
                        db[subject][idx]["correctAnswer"] = new_test_data["correctAnswer"]
                        db[subject][idx]["explanation"] = new_test_data.get("explanation", "")
                        db[subject][idx]["pedagogical_explanation"] = new_test_data.get("pedagogical_explanation", "")
                        
                        with open(TESTS_FILE, 'w', encoding='utf-8') as f:
                            json.dump(db, f, ensure_ascii=False, indent=2)
                            
                        fixed_indices.append(idx)
                        os.makedirs(os.path.dirname(PROGRESS_FILE), exist_ok=True)
                        with open(PROGRESS_FILE, 'w', encoding='utf-8') as f:
                            json.dump(fixed_indices, f, ensure_ascii=False)
                            
                        print(f"      ✅ Uğurla yeniləndi! (Model: {model_name})")
                        success = True
                        break
                    else:
                        print(f"      ⚠️ Səhv JSON strukturu. (Model: {model_name}, Cəhd {attempt+1})")
                except Exception as e:
                    print(f"      ❌ API Xətası ({model_name}): {e}. Cəhd {attempt+1}")
                    time.sleep(3)
                    
            if not success:
                print(f"      🔄 Model {model_name} uğursuz oldu. Növbəti modelə keçilir...")
                
        if not success:
            print(f"      ❌ Test {idx} heç bir model ilə düzəldilə bilmədi.")

if __name__ == "__main__":
    main()
