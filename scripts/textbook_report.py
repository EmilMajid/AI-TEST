import json
from pathlib import Path

def generate_textbook_report():
    json_path = Path(r"c:\Users\User\Downloads\azerbaijanaiplatform\data\textbooks.json")
    chunks_path = Path(r"c:\Users\User\Downloads\azerbaijanaiplatform\data\textbook-chunks.jsonl")
    
    with open(json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
        
    # Get current chunk counts per book
    counts = {}
    if chunks_path.exists():
        with open(chunks_path, 'r', encoding='utf-8') as f:
            for line in f:
                if line.strip():
                    item = json.loads(line)
                    bid = item.get('book_id')
                    counts[bid] = counts.get(bid, 0) + 1
                    
    print("| Grade | Subject | ID | Format | e-derslik | Status | Chunks |")
    print("| :--- | :--- | :--- | :--- | :--- | :--- | :--- |")
    
    for grade in sorted(data.keys(), key=int):
        for book in data[grade]:
            book_id = book.get('id')
            title = book.get('title')
            btype = book.get('type')
            eid = book.get('e_derslik_id', '-')
            count = counts.get(book_id, 0)
            
            # Simple status heuristic
            status = "Indexed" if count > 0 else "Pending"
            if btype == 'ederslik_html' and count > 100:
                status = "GOLD (Digital)"
            elif btype == 'pdf' and count > 0:
                status = "OCR (Partial)"
                
            print(f"| {grade} | {title} | {book_id} | {btype} | {eid} | {status} | {count} |")

if __name__ == "__main__":
    generate_textbook_report()
