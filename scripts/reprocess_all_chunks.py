import json
import os
import sys
from pathlib import Path

# Add scripts directory to path to find RAGCleaner
scripts_dir = Path(__file__).parent
sys.path.append(str(scripts_dir))

from rag_cleaner import RAGCleaner

def reprocess_all_chunks():
    cleaner = RAGCleaner()
    input_path = Path(r"c:\Users\User\Downloads\azerbaijanaiplatform\data\textbook-chunks.jsonl")
    temp_path = input_path.with_suffix('.tmp')
    
    if not input_path.exists():
        print(f"File not found: {input_path}")
        return

    updated_count = 0
    total_count = 0

    print(f"Starting sweep of {input_path}...")
    
    with open(input_path, 'r', encoding='utf-8') as f_in, \
         open(temp_path, 'w', encoding='utf-8') as f_out:
        
        for line in f_in:
            if not line.strip(): continue
            total_count += 1
            chunk = json.loads(line)
            
            old_text = chunk.get('text', '')
            # We preserve internal newlines if the cleaner allows, 
            # but HyphenNormalizer.normalize currently collapses whitespace to single spaces 
            # as per the user's GOLD PROMPT request: 
            # "dövlətin\ngüclən-\ndirilməsi ... → dövlətin gücləndirilməsi ..."
            
            new_text = cleaner.clean(old_text)
            
            if old_text != new_text:
                chunk['text'] = new_text
                updated_count += 1
            
            f_out.write(json.dumps(chunk, ensure_ascii=False) + "\n")

    # Replace old file
    os.replace(temp_path, input_path)
    
    print(f"Sweep complete!")
    print(f"Total chunks processed: {total_count}")
    print(f"Chunks updated: {updated_count}")

if __name__ == "__main__":
    reprocess_all_chunks()
