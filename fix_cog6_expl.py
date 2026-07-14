import json
import re

with open('data/offline_tests.json', 'r', encoding='utf8') as f:
    db = json.load(f)

tests = db.get('Coğrafiya 6', [])
fixed = 0

for t in tests:
    if 'Arxiv' in t.get('topic', ''):
        continue
    
    expl = t.get('pedagogical_explanation', '')
    ans = t.get('correctAnswer', -1)
    
    if ans != -1:
        correct_letter = chr(65 + ans)
        new_expl = expl
        
        # Replace specific patterns
        new_expl = re.sub(r'\b[A-D]\s+variantı\s+doğru', f'{correct_letter} variantı doğru', new_expl)
        new_expl = re.sub(r'\b[A-D]\s+bəndi\s+doğru', f'{correct_letter} bəndi doğru', new_expl)
        new_expl = re.sub(r'Cavab\s+[A-D]\b', f'Cavab {correct_letter}', new_expl)
        new_expl = re.sub(r'Cavab:\s+[A-D]\b', f'Cavab: {correct_letter}', new_expl)
        
        if new_expl != expl:
            t['pedagogical_explanation'] = new_expl
            fixed += 1

with open('data/offline_tests.json', 'w', encoding='utf8') as f:
    json.dump(db, f, ensure_ascii=False, indent=2)

print(f"Fixed {fixed} explanations.")
