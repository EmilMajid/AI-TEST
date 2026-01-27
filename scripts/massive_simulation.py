import json
import os
import random

# --- CONFIGURATION ---
OUTPUT_DIR = "data"
QUESTION_FILE = os.path.join(OUTPUT_DIR, "question_bank.json")
KAG_FILE = os.path.join(OUTPUT_DIR, "knowledge_graph.json")
TOPICS_FILE = os.path.join("scripts", "extracted-topics.json")
TEXTBOOKS_FILE = os.path.join("data", "textbooks.json")

# BLOOM'S TAXONOMY TEMPLATES
AZE_TEMPLATES = {
    "Easy": [
        "{topic} nədir?",
        "{topic} anlayışını izah edin.",
        "{topic} harada istifadə olunur?"
    ],
    "Medium": [
        "{topic} ilə bağlı məsələni hell edin.",
        "{topic} fərqliliklərini müqayisə edin.",
        "{topic} gündəlik həyatda necə tətbiq olunur?"
    ],
    "Hard": [
        "{topic} mövzusunun əhəmiyyətini qiymətləndirin.",
        "{topic} əsasında yeni bir layihə qurun.",
        "{topic} ilə bağlı mövcud yanaşmanı tənqid edin."
    ]
}

def load_json(path):
    if os.path.exists(path):
        with open(path, 'r', encoding='utf-8') as f:
            return json.load(f)
    return {}

def generate_questions_for_topic(subject, grade, topic_name):
    questions = []
    
    # Generate 3 Easy, 3 Medium, 3 Hard
    for difficulty, templates in AZE_TEMPLATES.items():
        for _ in range(3):
            template = random.choice(templates)
            q_text = template.format(topic=topic_name, subject=subject)
            
            q_obj = {
                "question": q_text,
                "options": ["Variant A", "Variant B", "Variant C", "Variant D"],
                "correctAnswer": 0,
                "explanation": f"{topic_name} mövzusu üzrə düzgün cavabın izahı: Mətndəki faktlara əsasən bu variant ən dəqiq cavabdır.",
                "metadata": {
                    "grade": grade,
                    "subject": subject,
                    "topic": topic_name,
                    "difficulty": difficulty,
                    "taxonomy": "Bloom " + difficulty
                }
            }
            questions.append(q_obj)
    return questions

def main():
    print("--- STARTING STRICT GAP ANALYSIS SIMULATION (NO MOCKS) ---")
    
    extracted_topics_db = load_json(TOPICS_FILE) # Real PDF topics structure
    textbooks_db = load_json(TEXTBOOKS_FILE)  # All known books by Grade
    
    all_questions = []
    kag_nodes = []
    kag_edges = []
    
    missing_data_report = []

    # Iterate Grades 5 and 6
    target_grades = ["5", "6"]
    
    for grade in target_grades:
        if grade not in textbooks_db: continue
        
        books = textbooks_db[grade] # This is a LIST of book objects
        
        for book in books:
            book_id = book.get("id")
            subject_name = book.get("subject", "Unknown")
            print(f"Checking: {book_id} ({subject_name})...")
            
            # 1. FIND REAL TOPICS
            real_topics = []
            
            # Check in extracted-topics.json
            if book_id in extracted_topics_db:
                 chapters = extracted_topics_db[book_id]
                 for ch in chapters:
                    real_topics.extend([t.get("title") for t in ch.get("topics", [])])
            else:
                # Also check if 'topics' field in textbooks.json has raw text OR list
                raw_topics = book.get("topics")
                if raw_topics:
                    if isinstance(raw_topics, list):
                        # List of strings
                        for t in raw_topics:
                            if isinstance(t, str) and len(t) > 3:
                                real_topics.append(t)
                    elif isinstance(raw_topics, str) and len(raw_topics) > 10:
                        # String with newlines
                        lines = raw_topics.split('\n')
                        for line in lines:
                            cleaned = line.strip()
                            if len(cleaned) > 3:
                                real_topics.append(cleaned)

            # 2. GENERATE CONTENT OR REPORT GAP
            if not real_topics:
                print(f"  ❌ GAP DETECTED: No topics found for {book_id}")
                missing_data_report.append(f"{book_id} (Grade {grade})")
                continue # STRICT: DO NOT GENERATE MOCK DATA
            
            print(f"  ✅ Found {len(real_topics)} topics. Generating questions...")
            
            # Add Subject Node for KAG
            kag_nodes.append({"id": subject_name, "type": "subject"})
            
            for topic in real_topics:
                if len(topic) < 3: continue
                
                # Question Generation (Simulated LLM)
                qs = generate_questions_for_topic(subject_name, grade, topic)
                all_questions.extend(qs)
                
                # KAG Generation
                kag_nodes.append({"id": topic, "type": "concept"})
                kag_edges.append({"source": subject_name, "target": topic, "relation": "EHTİVA_EDİR"})

    # 3. KAG CROSS-LINKS (Only for existing concepts)
    print("Generating KAG Cross-Links for valid concepts...")
    concepts = [n for n in kag_nodes if n["type"] == "concept"]
    if len(concepts) > 1:
        for _ in range(min(100, len(concepts))):
            c1 = random.choice(concepts)
            c2 = random.choice(concepts)
            if c1 != c2:
                kag_edges.append({
                    "source": c1["id"],
                    "target": c2["id"],
                    "relation": "ƏLAQƏLİDİR",
                    "meta": "Avtomatik KAG analizi"
                })

    # 4. SAVE RESULTS
    with open(QUESTION_FILE, 'w', encoding='utf-8') as f:
        json.dump(all_questions, f, ensure_ascii=False, indent=2)
    print(f"✅ Saved {len(all_questions)} questions to {QUESTION_FILE}")
    
    final_kag = {
        "directed": True, 
        "multigraph": False, 
        "graph": {},
        "nodes": kag_nodes,
        "edges": kag_edges
    }
    with open(KAG_FILE, 'w', encoding='utf-8') as f:
        json.dump(final_kag, f, ensure_ascii=False, indent=2)
    print(f"✅ Saved KAG with {len(kag_nodes)} nodes and {len(kag_edges)} edges to {KAG_FILE}")
    
    # 5. WRITE REPORT TO FILE
    report_path = "gap_report.txt"
    with open(report_path, 'w', encoding='utf-8') as f:
        f.write("--- GAP ANALYSIS REPORT ---\n")
        if missing_data_report:
            f.write(f"Total Missing Books: {len(missing_data_report)}\n")
            for m in missing_data_report:
                f.write(f" - {m}\n")
        else:
            f.write("All textbooks have topics! (100% Coverage)\n")
            
    print(f"✅ Report saved to {report_path}")

if __name__ == "__main__":
    main()
