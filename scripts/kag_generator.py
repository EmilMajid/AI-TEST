import json
import os
import sys
from llm_utils import extract_triples

def generate_kag_for_textbook(subject_key, data):
    print(f"Processing {subject_key}...")
    all_triples = []
    
    for chapter_data in data:
        chapter_name = chapter_data.get("chapter", "Nameless Chapter")
        topics = chapter_data.get("topics", [])
        
        # Link topic to chapter
        all_triples.append({
            "subject": chapter_name,
            "predicate": "MÖVZUDUR",
            "object": subject_key
        })
        
        for topic in topics:
            title = topic.get("title")
            # Extract internal relations from topic title
            triples_json = extract_triples(title)
            try:
                triples = json.loads(triples_json)
                if isinstance(triples, list):
                    all_triples.extend(triples)
                
                # Link topic to chapter
                all_triples.append({
                    "subject": title,
                    "predicate": "MƏZMUNUDUR",
                    "object": chapter_name
                })
            except Exception as e:
                print(f"Error parsing triples for '{title}': {e}")
                
    return all_triples

def main():
    manual_topics_path = os.path.join(os.getcwd(), "scripts", "manual-topics.json")
    output_path = os.path.join(os.getcwd(), "data", "kag_graph.json")
    
    if not os.path.exists(manual_topics_path):
        print(f"Error: {manual_topics_path} not found.")
        return

    with open(manual_topics_path, "r", encoding="utf-8") as f:
        manual_data = json.load(f)

    # For prototyping, we only process 2 Grade 6 textbooks: Math and Science (part 1)
    target_keys = ["riyaziyyat-6-h1", "tebiet-6-h1"]
    
    master_graph = []
    
    for key in target_keys:
        if key in manual_data:
            textbook_triples = generate_kag_for_textbook(key, manual_data[key])
            master_graph.extend(textbook_triples)
        else:
            print(f"Warning: {key} not found in manual-topics.json")

    # Ensure data directory exists
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(master_graph, f, ensure_ascii=False, indent=2)
    
    print(f"Successfully generated {len(master_graph)} triples in {output_path}")

if __name__ == "__main__":
    main()
