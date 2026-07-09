import json

with open('data/offline_tests.json', 'r', encoding='utf-8') as f:
    db = json.load(f)

print("=== 3 və 4-cü Sinif Testləri Analizi ===")

def analyze_tests(tests, category):
    stats = {
        'total': len(tests),
        'mismatch_answer': 0,
        'wrong_options_count': 0,
        'missing_explanation': 0
    }
    
    for idx, t in enumerate(tests):
        options = t.get('options', [])
        if len(options) != 4:
            stats['wrong_options_count'] += 1
            
        ans = t.get('answer')
        
        # Clean options for matching
        clean_opts = []
        for o in options:
            import re
            o = re.sub(r'^[A-D]\)\s*', '', o).strip()
            clean_opts.append(o)
            
        if ans:
            ans = ans.strip()
            if ans not in clean_opts and ans not in [o.strip() for o in options]:
                stats['mismatch_answer'] += 1
                
        if not t.get('explanation'):
            stats['missing_explanation'] += 1
            
    print(f"\n[{category}]")
    print(f" - Ümumi test sayı: {stats['total']}")
    if stats['total'] > 0:
        print(f" - Yanlış variant sayı (4 dənə deyil): {stats['wrong_options_count']}")
        print(f" - Cavab ziddiyyəti (answer variantlarda yoxdur): {stats['mismatch_answer']}")
        print(f" - İzahı çatışmayan: {stats['missing_explanation']}")

for cat, tests in db.items():
    if '3' in cat or '4' in cat:
        analyze_tests(tests, cat)
