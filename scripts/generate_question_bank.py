import sys
sys.stdout.reconfigure(encoding='utf-8')
import json
import os
from pathlib import Path
from llm_utils import generate_gold_standard_question

# Output files
CHUNKS_FILE = "data/textbook-chunks.jsonl"
OUTPUT_BANK = "data/question_bank.json"

def load_prompt_template():
    # Load from llm-config.json if possible, else default
    try:
        with open("scripts/llm-config.json", "r", encoding="utf-8") as f:
            config = json.load(f)
            return config.get("promptTemplate", "")
    except Exception:
        return ""

def generate_question_bank():
    print("🚀 Starting Offline Question Generator...")
    
    if not os.path.exists(CHUNKS_FILE):
        print(f"❌ Chunks file not found: {CHUNKS_FILE}")
        return

    # 1. Load Chunks
    print("Reading chunks...")
    chunks = []
    with open(CHUNKS_FILE, "r", encoding="utf-8") as f:
        for line in f:
            if line.strip():
                try:
                    chunks.append(json.loads(line))
                except:
                    pass

    print(f"Loaded {len(chunks)} chunks.")
    
    # Group chunks by source/page to create meaningful context blocks
    # (Generating questions for every single small chunk might be redundant/expensive)
    # Strategy: Group by source & page.
    grouped_content = {}
    for chunk in chunks:
        key = f"{chunk.get('source', 'unknown')}_page_{chunk.get('page', '0')}"
        if key not in grouped_content:
            grouped_content[key] = {
                "text": [],
                "grade": chunk.get("grade"),
                "subject": chunk.get("subject"),
                "source": chunk.get("source"),
                "page": chunk.get("page")
            }
        grouped_content[key]["text"].append(chunk.get("text", ""))

    print(f"Grouped into {len(grouped_content)} logical units (pages).")
    
    template = load_prompt_template()
    question_bank = []
    
    # Limit for demo/prototype to avoid huge wait/cost if mocked
    LIMIT = 5 
    count = 0
    
    print(f"Processing first {LIMIT} units for prototype...")

    for key, data in grouped_content.items():
        if count >= LIMIT:
            break
            
        full_text = " ".join(data["text"])
        if len(full_text) < 50: # Skip empty/short pages
            continue
            
        print(f"Generating questions for: {key}...")
        
        # Prepare Prompt
        # Inject info into template if available, else use generic
        current_prompt = template.replace("{count}", "3") \
                                 .replace("{topic}", f"Səhifə {data['page']} Məzmunu") \
                                 .replace("{topicContent}", full_text[:2000]) \
                                 .replace("{difficulty}", "orta") \
                                 .replace("{bloomLevel}", "tətbiq")
        
        if not current_prompt:
             current_prompt = f"Aşağıdakı mətndən 3 ədəd test sualı (JSON formatında) yarat:\n\n{full_text[:2000]}"

        # Call Gold Standard Generator
        response = generate_gold_standard_question(
            subject=data["subject"],
            grade=data["grade"],
            context=full_text,
            bloom="Təhlil" if count % 2 == 0 else "Anlama", # Simple distribution for prototype
            skill=f"Səhifə {data['page']} Analizi"
        )
        
        if not response:
            print("  -> AI failed, skipping this chunk.")
            questions = []
        else:
            try:
                # Clean up markdown
                clean_json = response.replace("```json", "").replace("```", "").strip()
                # If there are multiple JSON blocks or extra text, attempt to find the JSON
                if "{" in clean_json:
                    start = clean_json.find("{")
                    end = clean_json.rfind("}") + 1
                    clean_json = clean_json[start:end]
                
                parsed = json.loads(clean_json)
                
                # The generator now returns a single question JSON by default, 
                # but let's handle both single and multiple for robustness.
                if isinstance(parsed, list):
                    questions = parsed
                elif "questions" in parsed:
                    questions = parsed["questions"]
                else:
                    questions = [parsed]
                    
                print(f"  -> Generated {len(questions)} Gold Standard questions.")
            except Exception as e:
                print(f"  -> JSON Parse Error: {e}")
                questions = []

        # Add to bank
        for q in questions:
            q["metadata"] = {
                "grade": data["grade"],
                "subject": data["subject"],
                "source": data["source"],
                "page": data["page"]
            }
            question_bank.append(q)
            
        count += 1

    # Save Bank
    os.makedirs(os.path.dirname(OUTPUT_BANK), exist_ok=True)
    with open(OUTPUT_BANK, "w", encoding="utf-8") as f:
        json.dump(question_bank, f, ensure_ascii=False, indent=2)
        
    print(f"✅ Question Bank generated with {len(question_bank)} questions.")
    print(f"Saved to: {OUTPUT_BANK}")

if __name__ == "__main__":
    generate_question_bank()
