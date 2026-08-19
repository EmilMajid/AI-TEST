import json, sys, io, re, collections
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

print("=== 7-ci Sinif Test Bazasi Analizi Bashlayir ===\n")

with open('data/offline_tests.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

all_keys = list(data.keys())

def get_questions(subj_data):
    """Flatten subject data to a list of question dicts."""
    if isinstance(subj_data, list):
        result = []
        for item in subj_data:
            if isinstance(item, dict) and 'question' in item:
                result.append(item)
            elif isinstance(item, list):
                for q in item:
                    if isinstance(q, dict) and 'question' in q:
                        result.append(q)
        return result
    elif isinstance(subj_data, dict):
        result = []
        for v in subj_data.values():
            if isinstance(v, list):
                for item in v:
                    if isinstance(item, dict) and 'question' in item:
                        result.append(item)
        return result
    return []

def analyze_questions(questions):
    n = len(questions)
    if n == 0:
        return {'count': 0, 'has_explanation': 0, 'has_topic': 0, 'has_4_options': 0,
                'correct_valid': 0, 'unique_topics': 0, 'top_topics': [], 'correct_dist': {},
                'bloom_levels': {}, 'explanation_pct': 0, 'topic_pct': 0,
                'options4_pct': 0, 'answer_pct': 0}

    has_explanation = 0
    has_topic = 0
    has_4_options = 0
    correct_valid = 0
    topics = collections.Counter()
    bloom_levels = collections.Counter()
    correct_dist = collections.Counter()
    missing_issues = []

    for q in questions:
        expl = q.get('explanation', '')
        if expl and str(expl).strip() not in ['', 'null', '{}', 'None']:
            has_explanation += 1

        topic = q.get('topic', '') or ''
        topic = str(topic).strip()
        if topic:
            has_topic += 1
            topics[topic] += 1

        opts = q.get('options', [])
        if isinstance(opts, list) and len(opts) == 4:
            has_4_options += 1
        elif isinstance(opts, list) and len(opts) != 4:
            missing_issues.append(f"options count={len(opts)}")

        ca = q.get('correctAnswer')
        if ca in [0, 1, 2, 3]:
            correct_valid += 1
            correct_dist[ca] += 1

        # Bloom level detection from explanation or metadata
        bloom = q.get('bloom_level') or q.get('bloomLevel') or ''
        if bloom:
            bloom_levels[str(bloom)] += 1

    return {
        'count': n,
        'has_explanation': has_explanation,
        'has_topic': has_topic,
        'has_4_options': has_4_options,
        'correct_valid': correct_valid,
        'unique_topics': len(topics),
        'top_topics': topics.most_common(15),
        'correct_dist': dict(correct_dist),
        'bloom_levels': dict(bloom_levels),
        'explanation_pct': round(has_explanation / n * 100, 1),
        'topic_pct': round(has_topic / n * 100, 1),
        'options4_pct': round(has_4_options / n * 100, 1),
        'answer_pct': round(correct_valid / n * 100, 1),
    }

# ============================================================
# GRADE 7 SUBJECTS
# ============================================================
grade7_keys = sorted([k for k in all_keys if k.endswith(' 7')])
print(f"7-ci sinif fenn sayi: {len(grade7_keys)}\n")

grade7_stats = {}
total_grade7 = 0

for subj in grade7_keys:
    qs = get_questions(data[subj])
    stats = analyze_questions(qs)
    grade7_stats[subj] = stats
    total_grade7 += stats['count']

# ============================================================
# PRINT GRADE 7 DETAIL
# ============================================================
print("=" * 72)
print("7-CI SINIF - FENN UZRE STATISTIKA")
print("=" * 72)

for subj in grade7_keys:
    s = grade7_stats[subj]
    n = s['count']
    print(f"\n[{subj}]")
    print(f"  Sual sayi         : {n}")
    print(f"  Movzu olanlar     : {s['has_topic']} ({s['topic_pct']}%)")
    print(f"  Unikal movzular   : {s['unique_topics']}")
    print(f"  Izah olanlar      : {s['has_explanation']} ({s['explanation_pct']}%)")
    print(f"  4 variant olanlar : {s['has_4_options']} ({s['options4_pct']}%)")
    print(f"  Dogru cavab OK    : {s['correct_valid']} ({s['answer_pct']}%)")

    if s['correct_dist']:
        cd = s['correct_dist']
        total_ans = sum(cd.values())
        dist_str = ', '.join([f"{chr(65+int(k))}={v}({round(v/total_ans*100)}%)" for k, v in sorted(cd.items())])
        print(f"  Cavab dagilimi    : {dist_str}")

    if s['bloom_levels']:
        bl_str = ', '.join([f"{k}={v}" for k, v in sorted(s['bloom_levels'].items())])
        print(f"  Bloom levelları   : {bl_str}")

    if s['top_topics']:
        print(f"  Top movzular      :")
        for t, c in s['top_topics'][:10]:
            print(f"    [{c:4d}] {t[:65]}")

# ============================================================
# GRADE 7 SUMMARY TABLE
# ============================================================
print()
print("=" * 72)
print("7-CI SINIF - XULASE CEDVEL")
print("=" * 72)
header = f"  {'Fenn':<35} {'Sual':>5} {'Movzu%':>7} {'Izah%':>7} {'4opt%':>6} {'OK%':>5}"
print(header)
print("  " + "-" * 65)
for subj in grade7_keys:
    s = grade7_stats[subj]
    name = subj.replace(' 7', '').strip()[:34]
    print(f"  {name:<35} {s['count']:>5} {s['topic_pct']:>6}% {s['explanation_pct']:>6}% {s['options4_pct']:>5}% {s['answer_pct']:>4}%")
print("  " + "-" * 65)
print(f"  {'UMUMI':<35} {total_grade7:>5}")

# ============================================================
# FULL DATABASE STATS
# ============================================================
print()
print("=" * 72)
print("BUTUN TEST BAZASI STATISTIKASI")
print("=" * 72)

grade_agg = {}
total_all = 0
total_exp_all = 0
total_top_all = 0
total_4opt_all = 0
total_ans_all = 0
dup_check = collections.Counter()

for k in all_keys:
    parts = k.rsplit(' ', 1)
    if len(parts) == 2 and parts[1].isdigit():
        grade = int(parts[1])
    else:
        grade = 0

    qs = get_questions(data[k])
    stats = analyze_questions(qs)

    if grade not in grade_agg:
        grade_agg[grade] = {'subjects': 0, 'questions': 0,
                            'exp': 0, 'top': 0, 'opt4': 0, 'ans': 0}
    grade_agg[grade]['subjects'] += 1
    grade_agg[grade]['questions'] += stats['count']
    grade_agg[grade]['exp'] += stats['has_explanation']
    grade_agg[grade]['top'] += stats['has_topic']
    grade_agg[grade]['opt4'] += stats['has_4_options']
    grade_agg[grade]['ans'] += stats['correct_valid']

    total_all += stats['count']
    total_exp_all += stats['has_explanation']
    total_top_all += stats['has_topic']
    total_4opt_all += stats['has_4_options']
    total_ans_all += stats['correct_valid']

    # Duplicate fingerprinting
    for q in qs:
        txt = str(q.get('question', '')).strip()[:100]
        if txt:
            dup_check[txt] += 1

print(f"\n  Umumi fenn sayi   : {len(all_keys)}")
print(f"  Umumi sual sayi   : {total_all}")
print()

print(f"  {'Sinif':>6} | {'Fenn':>5} | {'Sual':>7} | {'Movzu%':>7} | {'Izah%':>6} | {'OK%':>5}")
print("  " + "-" * 52)
for grade in sorted(grade_agg.keys()):
    s = grade_agg[grade]
    n = s['questions']
    tp = round(s['top'] / n * 100, 1) if n else 0
    ep = round(s['exp'] / n * 100, 1) if n else 0
    ap = round(s['ans'] / n * 100, 1) if n else 0
    label = f"{grade}" if grade > 0 else "?"
    print(f"  {label:>6} | {s['subjects']:>5} | {n:>7} | {tp:>6}% | {ep:>5}% | {ap:>4}%")
print("  " + "-" * 52)
print(f"  {'UMUMI':>6} | {len(all_keys):>5} | {total_all:>7}")

# ============================================================
# OVERALL QUALITY METRICS
# ============================================================
print()
print("=" * 72)
print("KEYFIYYYET GOSTERICILERI (BUTUN BAZA)")
print("=" * 72)
print(f"  Umumi sual            : {total_all}")
print(f"  Movzu etiketli        : {total_top_all} ({round(total_top_all/total_all*100,1)}%)")
print(f"  Izah/Pedaqoji izah    : {total_exp_all} ({round(total_exp_all/total_all*100,1)}%)")
print(f"  4 variant tamamligi   : {total_4opt_all} ({round(total_4opt_all/total_all*100,1)}%)")
print(f"  Dogru cavab keyfiyyeti: {total_ans_all} ({round(total_ans_all/total_all*100,1)}%)")

dup_count = sum(1 for v in dup_check.values() if v > 1)
dup_q_count = sum(v - 1 for v in dup_check.values() if v > 1)
print(f"  Potensial dublikat    : {dup_count} qrup, ~{dup_q_count} artiq sual")

print()
print("=== Analiz tamamlandi ===")
