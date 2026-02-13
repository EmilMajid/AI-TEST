import json
from collections import Counter
from pathlib import Path

def check_indexing():
    chunks_path = Path("data/textbook-chunks.jsonl")
    textbooks_path = Path("data/textbooks.json")
    
    if not chunks_path.exists() or not textbooks_path.exists():
        print("Required files missing.")
        return

    with open(textbooks_path, "r", encoding="utf-8") as f:
        textbooks = json.load(f).get("5", [])
    
    book_ids = {b["id"]: b["title"] for b in textbooks}
    indexed_counts = Counter()
    
    with open(chunks_path, "r", encoding="utf-8") as f:
        for line in f:
            try:
                chunk = json.loads(line)
                if chunk.get("grade") == 5 or str(chunk.get("grade")) == "5":
                    bid = chunk.get("book_id")
                    if bid:
                        indexed_counts[bid] += 1
            except:
                pass
    
    print(f"{'Book ID':<25} | {'Title':<40} | {'Chunks':<6}")
    print("-" * 75)
    for bid, title in book_ids.items():
        count = indexed_counts.get(bid, 0)
        print(f"{bid:<25} | {title[:40]:<40} | {count:<6}")

if __name__ == "__main__":
    check_indexing()
