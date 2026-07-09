import json
import os
import sys
import re

# Windows üçün UTF-8 kodlaşdırması
if sys.platform == 'win32':
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

# Add project root to sys.path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
sys.path.append(os.path.abspath(os.path.dirname(__file__)))

from llm_utils import generate_gold_standard_question

def clean_bloom(bloom):
    bloom = bloom.lower().strip()
    mapping = {
        "bilmə": "bilmə", "bilik": "bilmə", "xatırlama": "bilmə",
        "anlama": "anlama",
        "tətbiq": "tətbiq",
        "təhlil": "təhlil",
        "analiz": "təhlil",
        "qiymətləndirmə": "qiymətləndirmə", "dəyərləndirmə": "qiymətləndirmə",
        "yaratma": "yaratma"
    }
    return mapping.get(bloom, "anlama")

def clean_difficulty(diff):
    diff = diff.lower().strip()
    mapping = {
        "sadə": "sadə", "easy": "sadə",
        "orta": "orta", "medium": "orta",
        "çətin": "çətin", "hard": "çətin", "difficult": "çətin"
    }
    return mapping.get(diff, "orta")

def generate_passport(topic_idx, q_idx, bloom, difficulty):
    # Sinif: 11
    # Fənn: İnformatika -> Kod: 008
    # Nəşr: 01, Hissə: 01 -> 0101
    # Fəsil: 1 -> B01 (Bölmə 01)
    # Mövzu indeksi -> AM01 (Alt Mövzu 01)
    bloom_codes = {
        "bilmə": "01", "anlama": "02", "tətbiq": "03", "təhlil": "04", "qiymətləndirmə": "05", "yaratma": "06"
    }
    bloom_code = bloom_codes.get(bloom, "02")

    diff_codes = {
        "sadə": "01", "orta": "02", "çətin": "03"
    }
    diff_code = diff_codes.get(difficulty, "02")

    tc = f"B01AM{str(topic_idx + 1).zfill(2)}"
    q_num = str(q_idx + 1).zfill(4)

    return f"11-008-0101-{tc}-{bloom_code}-{diff_code}-{q_num}"

def main():
    # Load chunks
    chunks_path = "data/textbook-chunks.jsonl"
    inf11_chunks = []
    
    with open(chunks_path, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            try:
                c = json.loads(line)
                if c.get("book_id") == "informatika-11":
                    inf11_chunks.append(c)
            except:
                pass
                
    # Group chunks by section (topic)
    topic_chunks = {}
    for chunk in inf11_chunks:
        sec = chunk.get("section")
        if sec:
            if sec not in topic_chunks:
                topic_chunks[sec] = []
            topic_chunks[sec].append(chunk)
            
    # Topics configuration for Chapter 1
    chapter1_topics = [
        {"title": "1.1. informasiya sistemi və onun elementləri", "questions": [
            {"difficulty": "sadə", "bloom": "bilmə"},
            {"difficulty": "orta", "bloom": "anlama"}
        ]},
        {"title": "1.2. informasiya sistemlərinin təsnifatı", "questions": [
            {"difficulty": "sadə", "bloom": "bilmə"}
        ]},
        {"title": "1.3. Coğrafi informasiya sistemləri", "questions": [
            {"difficulty": "orta", "bloom": "anlama"},
            {"difficulty": "çətin", "bloom": "tətbiq"}
        ]},
        {"title": "1.4. Süni intellekt", "questions": [
            {"difficulty": "orta", "bloom": "tətbiq"},
            {"difficulty": "çətin", "bloom": "təhlil"}
        ]},
        {"title": "1.5. Ekspert sistemləri", "questions": [
            {"difficulty": "orta", "bloom": "anlama"},
            {"difficulty": "çətin", "bloom": "təhlil"}
        ]},
        {"title": "1.6. Axtarış sistemləri", "questions": [
            {"difficulty": "sadə", "bloom": "bilmə"},
            {"difficulty": "orta", "bloom": "anlama"}
        ]},
        {"title": "1.7. \"Böyük verilənlər\"texnologiyası", "questions": [
            {"difficulty": "orta", "bloom": "anlama"},
            {"difficulty": "çətin", "bloom": "təhlil"}
        ]},
        {"title": "1.8. informasiya cəmiyyəti", "questions": [
            {"difficulty": "sadə", "bloom": "bilmə"},
            {"difficulty": "orta", "bloom": "anlama"}
        ]}
    ]
    
    generated_questions = []
    total_q_count = 0
    
    print("Starting targeted test generation for Chapter 1 (15 questions total)...")
    
    for t_idx, t_config in enumerate(chapter1_topics):
        title = t_config["title"]
        q_specs = t_config["questions"]
        
        # Get context from chunks of this topic
        chunks_list = topic_chunks.get(title, [])
        if not chunks_list:
            print(f"Warning: No chunks found for topic: {title}. Skipping.")
            continue
            
        context_text = "\n\n".join([c.get("text", "") for c in chunks_list if c.get("text")])
        pages_set = set([str(c.get("page")) for c in chunks_list if c.get("page")])
        pages_str = "-".join(sorted(list(pages_set))) if pages_set and None not in pages_set else "1"
        
        print(f"\nTopic: {title} | Chunks: {len(chunks_list)} | Pages: {pages_str}")
        
        for q_idx, spec in enumerate(q_specs):
            diff = spec["difficulty"]
            bloom = spec["bloom"]
            
            print(f"  -> Generating Question {q_idx+1} ({diff}, Bloom: {bloom})...")
            
            # Gold standard prompt asks for specific bloom and difficulty
            raw_res = generate_gold_standard_question(
                subject="İnformatika",
                grade="11",
                context=context_text[:8000], # Keep within token limit safely
                bloom=bloom.capitalize(),
                skill=title
            )
            
            if not raw_res:
                print("  [!] Failed to generate question. Retrying...")
                continue
                
            try:
                # Parse JSON
                # Clean code blocks if present
                clean_json = raw_res
                if "```json" in clean_json:
                    clean_json = clean_json.split("```json")[1].split("```")[0]
                elif "```" in clean_json:
                    clean_json = clean_json.split("```")[1].split("```")[0]
                clean_json = clean_json.strip()
                
                obj = json.loads(clean_json)
                
                # Extract and map values to offline_tests.json format
                options_list = obj.get("options", [])
                correct_idx = obj.get("correct_index", 0)
                
                if len(options_list) != 4:
                    print("  [!] Invalid options list length. Expected 4, got:", len(options_list))
                    continue
                    
                opt_keys = ["A", "B", "C", "D"]
                options_dict = {opt_keys[i]: options_list[i] for i in range(4)}
                correct_letter = opt_keys[correct_idx]
                
                # Format explanation from correct and distractors explanations
                exp_data = obj.get("explanation", {})
                correct_exp = exp_data.get("correct", "")
                distractors_exp = " ".join([f"{k}: {v}" for k, v in exp_data.get("distractors", {}).items()])
                full_exp = f"Düzgün cavab: {correct_exp}. Digər variantlar: {distractors_exp}"
                
                q_formatted = {
                    "grade": 11,
                    "subject": "İnformatika",
                    "topic": title,
                    "book_id": "informatika-11",
                    "pages": pages_str,
                    "passport": generate_passport(t_idx, q_idx, bloom, diff),
                    "question": obj.get("question"),
                    "options": options_dict,
                    "answer": correct_letter,
                    "difficulty": clean_difficulty(obj.get("difficulty", diff)),
                    "bloom": clean_bloom(obj.get("bloom_level", bloom)),
                    "explanation": full_exp
                }
                
                generated_questions.append(q_formatted)
                total_q_count += 1
                print(f"  [+] Success: {q_formatted['passport']}")
                
            except Exception as e:
                print("  [!] Error parsing response:", e)
                print("Raw response was:", raw_res[:500])
                
    # Integrate into offline_tests.json
    if generated_questions:
        print(f"\nSuccessfully generated {len(generated_questions)} questions!")
        
        offline_path = "data/offline_tests.json"
        with open(offline_path, "r", encoding="utf-8") as f:
            offline_data = json.load(f)
            
        # Group by topic for subject
        topics_grouped = {}
        for q in generated_questions:
            t_title = q["topic"]
            if t_title not in topics_grouped:
                topics_grouped[t_title] = []
            topics_grouped[t_title].append(q)
            
        topics_list = []
        for t_title, qs in topics_grouped.items():
            topics_list.append({
                "topic": t_title,
                "questions": qs
            })
            
        offline_data["İnformatika 11"] = topics_list
        
        with open(offline_path, "w", encoding="utf-8") as f:
            json.dump(offline_data, f, ensure_ascii=False, indent=2)
            
        print("SUCCESS: Integrated all questions into data/offline_tests.json under key 'İnformatika 11'")
    else:
        print("Error: No questions were successfully generated.")

if __name__ == "__main__":
    main()
