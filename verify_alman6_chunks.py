import json

# Verify chunks added correctly
alman6_chunks = []
with open('data/textbook-chunks.jsonl', 'r', encoding='utf-8', errors='replace') as f:
    for line in f:
        try:
            obj = json.loads(line.strip())
            if obj.get('source') == 'alman-dili-6-asas':
                alman6_chunks.append(obj)
        except:
            pass

print(f"Alman dili 6 chunk sayi: {len(alman6_chunks)}")
pages = [c['page'] for c in alman6_chunks]
print(f"Sehife aralighi: {min(pages)} - {max(pages)}")
total_chars = sum(len(c['content']) for c in alman6_chunks)
print(f"Umumi metn uzunlugu: {total_chars:,} karakter")
print()
print("=== Ilk 5 chunk nümunesı ===")
for c in alman6_chunks[:5]:
    page = c['page']
    content = c['content'][:250]
    print(f"  Sehife {page}: {content}")
    print()

# Extract Lektionen from the content
print("=== Lektion esdyasi ===")
lektion_pages = {}
for c in alman6_chunks:
    content = c['content']
    import re
    m = re.search(r'Lektion\s+(\d+)', content)
    if m:
        lnum = int(m.group(1))
        if lnum not in lektion_pages:
            lektion_pages[lnum] = c['page']
            
for lnum in sorted(lektion_pages.keys()):
    print(f"  Lektion {lnum}: ilk sehife {lektion_pages[lnum]}")
