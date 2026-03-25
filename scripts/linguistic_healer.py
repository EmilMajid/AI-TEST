import json
import re

def linguistic_healer(text):
    if not text:
        return text
    
    # 1. Join words split by hyphen at newline (Defis logic)
    # Pattern: Letter + hyphen + newline + Letter
    # We use [a-zA-ZçəğıöşüÇƏĞİÖŞÜ] to cover all Azerbaijani characters
    az_alpha = "a-zA-ZçəğıöşüÇƏĞİÖŞÜ"
    pattern = rf'([{az_alpha}]+)-\n([{az_alpha}]+)'
    text = re.sub(pattern, r'\1\2', text)
    
    # 2. Handle hyphen + space + newline (some layout engines add extra space)
    pattern_space = rf'([{az_alpha}]+)-\s*\n\s*([{az_alpha}]+)'
    # Only join if there's no space BEFORE the hyphen
    # (Matches "word-\npart" but not "word -\npart")
    text = re.sub(pattern_space, r'\1\2', text)
    
    return text

def process_file(file_path):
    lines = []
    updated_count = 0
    
    with open(file_path, 'r', encoding='utf-8') as f:
        for line in f:
            if line.strip():
                chunk = json.loads(line)
                # Apply healing to all chunks, especially Grade 5 math
                old_text = chunk.get('text', '')
                new_text = linguistic_healer(old_text)
                
                if old_text != new_text:
                    chunk['text'] = new_text
                    updated_count += 1
                
                lines.append(json.dumps(chunk, ensure_ascii=False) + '\n')
                
    with open(file_path, 'w', encoding='utf-8') as f:
        f.writelines(lines)
        
    print(f"Linguistic healing complete. Updated {updated_count} chunks in {file_path}")

if __name__ == "__main__":
    target_file = r"c:\Users\User\Downloads\azerbaijanaiplatform\data\textbook-chunks.jsonl"
    process_file(target_file)
