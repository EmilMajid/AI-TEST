import re

filepath = r"C:\Users\User\Downloads\azerbaijanaiplatform\data\umumitarix6_chunks\full_book.txt"

with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
    text = f.read()

lower = text.lower()

searches = [
    'zərdüşt', 'avesta', 'oda sitayiş',
    'böyük çin səddi', 'çin imperiyası', 'çin imperiyasının',
    'afinada demokratiya', 'sparta dövləti e.ə',
    'qədim yunanıstan', 'yunan mədəniyyəti',
    'yunanıstanın tarixi', 'afinada demokratiya',
    'afina polisi', 'yunan polisləri', 'polis dövləti'
]

for s in searches:
    idx = lower.find(s.lower())
    if idx != -1:
        ctx = text[idx:idx+120].replace('\n', ' ')
        print(f"FOUND '{s}' at {idx}: {ctx}")
    else:
        print(f"NOT FOUND: '{s}'")

# Also show what's at specific positions
print("\n--- At pos 50000-55000 ---")
print(text[50000:51500].replace('\n', ' '))

print("\n--- At pos 55000-60000 ---")
print(text[55000:56500].replace('\n', ' '))

print("\n--- At pos 80000-85000 ---")
print(text[80000:81500].replace('\n', ' '))

print("\n--- At pos 88000-93000 ---")
print(text[88000:89500].replace('\n', ' '))

print("\n--- At pos 105000-110000 ---")
print(text[105000:106500].replace('\n', ' '))
