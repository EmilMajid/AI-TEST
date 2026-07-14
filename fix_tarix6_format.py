import json
import random
import re

with open('data/offline_tests.json', 'r', encoding='utf8') as f:
    db = json.load(f)

tests = db.get('Ümumi tarix 6', [])
fixed_options = 0
fixed_expl = 0

for t in tests:
    # Check if options is a dict, which means it's the old invalid format
    options_val = t.get('options')
    if isinstance(options_val, dict):
        correct_key = t.get('correct_answer') or t.get('correctAnswer')
        if not correct_key or not isinstance(correct_key, str):
            correct_key = 'A' # fallback
            
        correct_text = options_val.get(correct_key, '')
        opt_list = list(options_val.values())
        random.shuffle(opt_list)
        
        try:
            new_correct_index = opt_list.index(correct_text)
        except ValueError:
            new_correct_index = 0
            
        t['options'] = opt_list
        t['correctAnswer'] = new_correct_index
        
        if 'correct_answer' in t:
            del t['correct_answer']
        fixed_options += 1
        
    # Check if explanations have "A variantı" etc. and fix them based on current correctAnswer
    ans = t.get('correctAnswer', -1)
    if ans != -1 and isinstance(ans, int):
        expl = t.get('pedagogical_explanation') or t.get('explanation', '')
        if expl:
            correct_letter = chr(65 + ans)
            new_expl = expl
            new_expl = re.sub(r'\b[A-D]\s+variantı\s+doğru', f'{correct_letter} variantı doğru', new_expl)
            new_expl = re.sub(r'\b[A-D]\s+bəndi\s+doğru', f'{correct_letter} bəndi doğru', new_expl)
            new_expl = re.sub(r'Cavab\s+[A-D]\b', f'Cavab {correct_letter}', new_expl)
            new_expl = re.sub(r'Cavab:\s+[A-D]\b', f'Cavab: {correct_letter}', new_expl)
            
            if new_expl != expl:
                if 'pedagogical_explanation' in t:
                    t['pedagogical_explanation'] = new_expl
                if 'explanation' in t:
                    t['explanation'] = new_expl
                fixed_expl += 1

with open('data/offline_tests.json', 'w', encoding='utf8') as f:
    json.dump(db, f, ensure_ascii=False, indent=2)

print(f"Fixed {fixed_options} options formats and {fixed_expl} explanations in Ümumi tarix 6.")
