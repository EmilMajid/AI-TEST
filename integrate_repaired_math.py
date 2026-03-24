import json

def integrate_repaired_chunks(master_path, repaired_path):
    # Load repaired chunks
    with open(repaired_path, 'r', encoding='utf-8') as f:
        repaired_chunks = json.load(f)
    
    repaired_book_id = "riyaziyyat-5-h1"
    
    # Read existing master chunks
    master_lines = []
    with open(master_path, 'r', encoding='utf-8') as f:
        for line in f:
            if line.strip():
                chunk = json.loads(line)
                # Keep if it's NOT the book we repaired
                if chunk.get('book_id') != repaired_book_id:
                    master_lines.append(line)
    
    # Append the repaired ones
    for chunk in repaired_chunks:
        master_lines.append(json.dumps(chunk, ensure_ascii=False) + '\n')
    
    # Write back to master
    with open(master_path, 'w', encoding='utf-8') as f:
        f.writelines(master_lines)
    
    print(f"Integrated {len(repaired_chunks)} chunks for {repaired_book_id} into {master_path}")

if __name__ == "__main__":
    master_file = r"c:\Users\User\Downloads\azerbaijanaiplatform\data\textbook-chunks.jsonl"
    repaired_file = r"c:\Users\User\Downloads\azerbaijanaiplatform\tmp_math1_full.json"
    integrate_repaired_chunks(master_file, repaired_file)
