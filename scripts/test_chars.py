import json
import codecs

with codecs.open('data/textbook-chunks.jsonl', 'r', 'utf-8') as f:
    chunks = [json.loads(l) for l in f if l.strip()]

html_errs = 0
pdf_errs = 0

print("Scanning for 't hsil' or 'm d niyy' patterns...")
for c in chunks:
    t = c.get('text', '')
    ctype = c.get('type', '')
    
    if 't hsil' in t.lower() or 'm d niyy' in t.lower():
        if ctype in ['html', 'html_page', 'ederslik_html']:
            html_errs += 1
            if html_errs < 5:
                print(f"HTML Error in {c.get('book_id')}, page {c.get('page')}")
        else:
            pdf_errs += 1
            if pdf_errs < 5:
                print(f"PDF Error in {c.get('book_id')}, page {c.get('page')}")

print(f"Total HTML errors found: {html_errs}")
print(f"Total PDF errors found: {pdf_errs}")
