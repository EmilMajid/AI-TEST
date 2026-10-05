import json
import sys
import re

sys.stdout.reconfigure(encoding='utf-8')

print("Starting deep dislocation analysis...")

LETTERS = ['A', 'B', 'C', 'D', 'E']

def az_lower(text):
    if not text:
        return ""
    return str(text).replace('I', 'ı').replace('İ', 'i').lower()

def clean_word(w):
    w = re.sub(r'[^a-zA-Z0-9\u00C0-\u024F\u0400-\u04FF]', '', az_lower(w))
    return w

STOP_WORDS = {
    'dövləti', 'dövlətinin', 'hadisə', 'hadisəsi', 'qeyd', 'olunan', 'olan',
    'kimi', 'üçün', 'düzgün', 'cavab', 'tarixi', 'əsasən', 'məsələ', 'şərti',
    'uyğun', 'deyil', 'edildi', 'edir', 'oldu', 'olmuşdur', 'olaraq', 'görə',
    'hansı', 'hansıdır', 'necə', 'biri', 'bütün', 'daha', 'çox', 'yaxın',
    'üçün', 'həmçinin', 'lakin', 'ancaq', 'bəzi', 'digər', 'etmişdir',
    'təşkil', 'edən', 'edir', 'edib', 'verilmişdir', 'verir', 'nəticəsində'
}

dislocations = []
category_stats = {}

for g in range(1, 12):
    fname = f'data/grades/grade_{g}.json'
    with open(fname, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    for subj, topics in data.items():
        if not isinstance(topics, dict):
            continue
        for topic, qs in topics.items():
            if not isinstance(qs, list) or len(qs) == 0:
                continue

            for qi, q in enumerate(qs):
                if not isinstance(q, dict):
                    continue
                opts = q.get('options')
                expl = q.get('explanation')
                ans = q.get('answer')
                if not opts or not expl or not ans or not isinstance(opts, list) or len(opts) < 2:
                    continue
                if ans not in LETTERS:
                    continue
                ans_idx = LETTERS.index(ans)
                if ans_idx >= len(opts):
                    continue

                marked_opt = str(opts[ans_idx])
                
                # Check 1: Explanation literally quotes or contains the full text of an option
                matched_by_quote = []
                for oi, opt in enumerate(opts):
                    opt_str = str(opt).strip()
                    # Strip leading quotes/parenthetical notes
                    opt_core = re.sub(r'\(.*?\)', '', opt_str).strip(' "\'«»')
                    if len(opt_core) >= 8 and opt_core.lower() in expl.lower():
                        matched_by_quote.append((oi, opt_core))

                if matched_by_quote and not any(m[0] == ans_idx for m in matched_by_quote):
                    # Explanation explicitly contains another option's exact text!
                    candidate_idx = matched_by_quote[0][0]
                    dislocations.append({
                        'type': 'EXACT_SUBSTRING_IN_EXPLANATION',
                        'grade': g,
                        'subject': subj,
                        'topic': topic,
                        'q_index': qi + 1,
                        'question': q.get('question'),
                        'marked_answer': ans,
                        'marked_option': marked_opt,
                        'true_answer': LETTERS[candidate_idx],
                        'true_option': str(opts[candidate_idx]),
                        'explanation': expl,
                        'match_detail': matched_by_quote[0][1]
                    })
                    category_stats['exact_substring'] = category_stats.get('exact_substring', 0) + 1
                    continue

                # Check 2: Strong token overlap
                expl_clean = re.sub(r'^\s*Doğru cavab\s+[A-F]\s+variantıdır\.?\s*', '', expl)
                expl_words = set(clean_word(w) for w in expl_clean.split() if len(clean_word(w)) >= 4) - STOP_WORDS
                
                opt_matches = []
                for oi, opt in enumerate(opts):
                    opt_clean = re.sub(r'\(.*?\)', '', str(opt))
                    opt_words = set(clean_word(w) for w in opt_clean.split() if len(clean_word(w)) >= 4) - STOP_WORDS
                    common = expl_words.intersection(opt_words)
                    opt_matches.append((len(common), oi, opt, common))

                opt_matches.sort(key=lambda x: x[0], reverse=True)
                top_match = opt_matches[0]
                marked_match = next((m for m in opt_matches if m[1] == ans_idx), (0, ans_idx, marked_opt, set()))

                # If another option has at least 3 matching informative keywords and marked option has 0 or 1
                if top_match[0] >= 3 and top_match[1] != ans_idx and (top_match[0] >= marked_match[0] + 2):
                    candidate_idx = top_match[1]
                    dislocations.append({
                        'type': 'TOKEN_OVERLAP_CONTRADICTION',
                        'grade': g,
                        'subject': subj,
                        'topic': topic,
                        'q_index': qi + 1,
                        'question': q.get('question'),
                        'marked_answer': ans,
                        'marked_option': marked_opt,
                        'true_answer': LETTERS[candidate_idx],
                        'true_option': str(opts[candidate_idx]),
                        'explanation': expl,
                        'match_detail': list(top_match[3])
                    })
                    category_stats['token_overlap'] = category_stats.get('token_overlap', 0) + 1

print(f"Total dislocations discovered: {len(dislocations)}")
print("Categories:", category_stats)

# Save full summary
with open('scripts/dislocations_summary.json', 'w', encoding='utf-8') as f:
    json.dump({
        'total_dislocations': len(dislocations),
        'by_category': category_stats,
        'sample': dislocations[:50]
    }, f, ensure_ascii=False, indent=2)

print("Saved to scripts/dislocations_summary.json")
