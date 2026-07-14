import json
from collections import Counter

with open('data/offline_tests.json', 'r', encoding='utf8') as f:
    db = json.load(f)

tests = db.get('Ümumi tarix 6', [])
heap = [t for t in tests if t.get('topic') == '1. Tarixdə il hesabı']

print(f'Cəmi "1. Tarixdə il hesabı" mövzusunda: {len(heap)} test\n')

# Check passport_ids to understand structure
print('=== İlk 5 testin passport_id-si ===')
for t in heap[:5]:
    print(f'  {t.get("passport_id", "N/A")}')

print('\n=== Hər testin sualı (bütün 75) ===')
for i, t in enumerate(heap):
    pid = t.get('passport_id', 'N/A')
    q = t.get('question', '')[:80]
    ca = t.get('correctAnswer', t.get('correct_answer', '?'))
    diff = t.get('difficulty', '?')
    print(f'[{i+1:02d}] PID={pid} | Çətinlik={diff} | Sual: {q}')

# Check if passport_ids hint at different topics
print('\n=== Passport_id strukturu analizi ===')
for i, t in enumerate(heap):
    print(f'  {t.get("passport_id")}')
