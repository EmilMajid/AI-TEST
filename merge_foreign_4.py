import json
import os
import glob

# Collect all generated json files
scratch_dir = r"C:\Users\User\.gemini\antigravity\scratch\data"
db_path = r"C:\Users\User\Downloads\azerbaijanaiplatform\data\offline_tests.json"

subjects = {
    "rus_4_generated": "Rus dili 4",
    "alman_4_generated": "Alman dili 4",
    "fra_4_generated": "Fransız dili 4"
}

with open(db_path, "r", encoding="utf-8") as f:
    db = json.load(f)

for subj_dir, db_key in subjects.items():
    full_dir = os.path.join(scratch_dir, subj_dir)
    if not os.path.exists(full_dir):
        print(f"Directory not found: {full_dir}")
        continue
        
    if db_key not in db:
        db[db_key] = []
        
    for file_path in glob.glob(os.path.join(full_dir, "*.json")):
        try:
            with open(file_path, "r", encoding="utf-8") as f:
                data = json.load(f)
                
            # If the subagent returned an array of items, we need to format them.
            # In SITG offline_tests format, it should be an array of {"topic_key": "topic", "topic": "topic", "questions": [...]}
            # But the subagents were instructed to generate:
            # [{"topic": "...", "question": "...", "options": [...], "answer": "..."}, ...]
            
            # Group by topic
            topic_groups = {}
            if isinstance(data, list):
                for item in data:
                    topic = item.get("topic", "Ümumi")
                    if topic not in topic_groups:
                        topic_groups[topic] = []
                    topic_groups[topic].append(item)
                    
            for topic, questions in topic_groups.items():
                db[db_key].append({
                    "topic_key": topic,
                    "topic": topic,
                    "questions": questions
                })
        except Exception as e:
            print(f"Error processing {file_path}: {e}")

with open(db_path, "w", encoding="utf-8") as f:
    json.dump(db, f, ensure_ascii=False, indent=2)

print("Foreign languages tests merged successfully!")
