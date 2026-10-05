import json
import sys
import re

sys.stdout.reconfigure(encoding='utf-8')

print("Starting deep forensic analysis of answer key alignment...")

LETTERS = ['A', 'B', 'C', 'D', 'E']

total_questions = 0
cyclic_topics = []
mismatched_questions = []

def clean_word(w):
    w = re.sub(r'[^a-zA-Z0-9\u00C0-\u024F\u0400-\u04FF]', '', w.lower())
    return w

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
            
            # Check cyclic answers
            ans_list = [q.get('answer') for q in qs if isinstance(q, dict) and q.get('answer') in LETTERS]
            if len(ans_list) >= 8:
                idxs = [LETTERS.index(a) for a in ans_list]
                is_cyclic = all((idxs[j] - idxs[j-1]) % 4 == 1 for j in range(1, min(12, len(idxs))))
                if is_cyclic:
                    cyclic_topics.append({
                        'grade': g,
                        'subject': subj,
                        'topic': topic,
                        'count': len(qs),
                        'pattern': ans_list[:8]
                    })

            for qi, q in enumerate(qs):
                if not isinstance(q, dict):
                    continue
                total_questions += 1
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
                
                # Check for explicit contradiction
                # 1. Explanation mentions another option's specific text or name
                # Let's check token overlap between each option and the explanation
                expl_clean = re.sub(r'^\s*Doğru cavab\s+[A-F]\s+variantıdır\.?\s*', '', expl)
                expl_words = set(clean_word(w) for w in expl_clean.split() if len(clean_word(w)) >= 4)
                
                # Exclude generic words
                generic_stop = {'dövləti', 'dövlətinin', 'hadisə', 'hadisəsi', 'qeyd', 'olunan', 'olan', 'kimi', 'üçün', 'düzgün', 'cavab', 'tarixi', 'əsasən', 'məsələ', 'şərti', 'uyğun', 'deyil', 'edildi', 'edir', 'oldu', 'olmuşdur', 'olaraq'}
                expl_words = expl_words - generic_stop
                
                opt_matches = []
                for oi, opt in enumerate(opts):
                    opt_words = set(clean_word(w) for w in str(opt).split() if len(clean_word(w)) >= 4) - generic_stop
                    common = expl_words.intersection(opt_words)
                    opt_matches.append((len(common), oi, opt, common))
                
                opt_matches.sort(key=lambda x: x[0], reverse=True)
                top_match = opt_matches[0]
                marked_match = next((m for m in opt_matches if m[1] == ans_idx), (0, ans_idx, opts[ans_idx], set()))
                
                # If another option matches significantly more specific tokens than the marked option
                # E.g. marked has 0 match, but top option has 2+ specific tokens, or top has >= marked + 2
                if top_match[0] >= 2 and top_match[1] != ans_idx and top_match[0] > marked_match[0]:
                    # Verify it's a real contradiction
                    mismatched_questions.append({
                        'grade': g,
                        'subject': subj,
                        'topic': topic,
                        'q_index': qi + 1,
                        'question': q.get('question'),
                        'marked_answer': ans,
                        'marked_option': opts[ans_idx],
                        'marked_score': marked_match[0],
                        'candidate_answer': LETTERS[top_match[1]],
                        'candidate_option': top_match[2],
                        'candidate_score': top_match[0],
                        'common_tokens': list(top_match[3]),
                        'explanation': expl
                    })

print(f"Total questions checked: {total_questions}")
print(f"Cyclic pattern topics found: {len(cyclic_topics)} (affecting ~{sum(t['count'] for t in cyclic_topics)} questions)")
print(f"Explanation vs Answer mismatches found: {len(mismatched_questions)}")

with open('scripts/forensic_findings.json', 'w', encoding='utf-8') as f:
    json.dump({
        'cyclic_topics_count': len(cyclic_topics),
        'cyclic_topics': cyclic_topics[:20],
        'mismatched_questions_count': len(mismatched_questions),
        'mismatched_questions_sample': mismatched_questions[:30]
    }, f, ensure_ascii=False, indent=2)

print("Forensic report saved to scripts/forensic_findings.json")
