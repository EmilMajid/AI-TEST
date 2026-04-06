import json
import os

def clear_bad_chunks():
    fpath = 'data/azerbaycan-tarixi-7-chunks.jsonl'
    if not os.path.exists(fpath):
        return
        
    with open(fpath, 'r', encoding='utf-8') as f:
        lines = f.readlines()
        
    good_lines = []
    for line in lines:
        try:
            data = json.loads(line)
            # We ONLY keep Page 7 (which was the manually provided Gold text)
            if data.get('page') == 7:
                good_lines.append(line)
        except:
            pass
            
    with open(fpath, 'w', encoding='utf-8') as f:
        f.writelines(good_lines)
        
    print(f"Cleared {len(lines) - len(good_lines)} bad/old chunks.")
    print(f"Kept {len(good_lines)} chunks.")

if __name__ == "__main__":
    clear_bad_chunks()
