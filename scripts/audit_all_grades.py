import json
from pathlib import Path

def audit():
    chunks_file = Path('data/textbook-chunks.jsonl')
    textbooks_file = Path('data/textbooks.json')

    if not textbooks_file.exists():
        print(f"Error: {textbooks_file} not found")
        return

    with open(textbooks_file, 'r', encoding='utf-8') as f:
        textbooks = json.load(f)

    indexed_counts = {}
    if chunks_file.exists():
        with open(chunks_file, 'r', encoding='utf-8') as f:
            for line in f:
                if line.strip():
                    try:
                        c = json.loads(line)
                        bid = c.get('book_id', 'UNKNOWN')
                        indexed_counts[bid] = indexed_counts.get(bid, 0) + 1
                    except: pass

    print('='*80)
    print(f'{"UNIVERSAL RAG AUDIT":^80}')
    print('='*80)
    print(f'{"BOOK ID":<35} | {"CHUNKS":<8} | {"STATUS":<10} | {"TYPE":<6}')
    print('-'*80)

    for grade in ['5', '6', '8', '7']:
        print(f'\n--- GRADE {grade} ---')
        books = textbooks.get(grade, [])
        for b in books:
            count = indexed_counts.get(b['id'], 0)
            btype = b.get('type', 'N/A')
            status = 'OK' if count > 20 else 'FAILED' if count == 0 else 'LOW'
            print(f'{b["id"]:<35} | {count:<8} | {status:<10} | {btype:<6}')

if __name__ == "__main__":
    audit()
