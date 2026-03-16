import json
import sys
import io

if sys.platform == 'win32':
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

targets = ['ingilis-dili-2-5']
found_any = False

print('--- Last 20 Chunks for ingilis-dili-2-5 ---')
try:
    with open('data/textbook-chunks.jsonl', 'r', encoding='utf-8') as f:
        # Instead of readlines (which is slow for huge files), we'll do a simple scan
        # or just read the last 1000 lines.
        lines = f.readlines()
        count = 0
        for line in reversed(lines):
            try:
                obj = json.loads(line)
                if obj.get('book_id') == 'ingilis-dili-2-5':
                    print(json.dumps(obj, ensure_ascii=False))
                    found_any = True
                    count += 1
                    if count >= 20:
                        break
            except: pass
except Exception as e:
    print(f'Error reading file: {e}')

if not found_any:
    print('No chunks found for ingilis-dili-2-5 in the final file!')
