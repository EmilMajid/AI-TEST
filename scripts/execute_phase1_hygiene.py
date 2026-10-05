import json
import re
import sys
import os

sys.stdout.reconfigure(encoding='utf-8')

print("Starting Phase 1: Corpus Hygiene & Registry Normalization...")

INPUT_PATH = 'data/textbook-chunks.jsonl'
OUTPUT_DIR = 'data/ontology'
OUTPUT_CLEAN = os.path.join(OUTPUT_DIR, 'corpus_clean.jsonl')
REGISTRY_PATH = 'autonomous_kag/data/canonical_curriculum_registry.json'

os.makedirs(OUTPUT_DIR, exist_ok=True)
os.makedirs(os.path.join(OUTPUT_DIR, 'audit'), exist_ok=True)

# 1. Load Canonical Registry for Lesson Mapping
with open(REGISTRY_PATH, 'r', encoding='utf-8') as f:
    registry = json.load(f)

# Build normalized lesson map: (grade, subject_normalized) -> list of lessons
lesson_catalog = {}
for g_str, subjs in registry.get('grades', {}).items():
    g = int(g_str)
    for s_name, s_data in subjs.items():
        base_subj = s_data.get('subject', s_name)
        lessons = s_data.get('lessons', [])
        key = (g, base_subj.lower().strip())
        lesson_catalog[key] = lessons

print(f"Loaded {len(lesson_catalog)} subject-grade curriculum catalogs.")

# Noise blacklist regex
BLACKLIST_PATTERNS = [
    re.compile(r'creative\s+commons', re.I),
    re.compile(r'noncommercial-sharealike', re.I),
    re.compile(r'bütün\s+hüquqlar\s+qorunur', re.I),
    re.compile(r'nəşriyyat\s+redaktoru', re.I),
    re.compile(r'texniki\s+redaktor', re.I),
    re.compile(r'buraxılışa\s+məsul', re.I),
    re.compile(r'tiraj\s*:\s*\d+', re.I),
    re.compile(r'formatı\s*:\s*\d+x\d+', re.I),
    re.compile(r'dərslik\s+komplektinə\s+daxildir', re.I),
    re.compile(r'qiymətləndirmə\s+meyarları', re.I),
    re.compile(r'məzmun\s+standartları', re.I),
    re.compile(r'derslik@edu\.gov\.az', re.I)
]

def is_noise(text):
    if len(text.strip()) < 40:
        return True
    return any(p.search(text) for p in BLACKLIST_PATTERNS)

def normalize_grade(grade_raw, book_id):
    if isinstance(grade_raw, int):
        return grade_raw
    if isinstance(grade_raw, str) and grade_raw.strip().isdigit():
        return int(grade_raw.strip())
    # infer from book_id e.g. "azerbaycan-tarixi-10"
    m = re.search(r'-(\d{1,2})(?:-|$)', str(book_id))
    if m:
        return int(m.group(1))
    return None

def compute_az_quality(text):
    if not text:
        return 0.0
    # ratio of recognized characters
    total_len = len(text)
    # broken OCR characters like 'VV' instead of 'W', isolated strange symbols
    vv_count = len(re.findall(r'\bVV\b|VVe', text))
    az_letters = len(re.findall(r'[a-zA-Z0-9\u0259\u018f\u0131\u0130\u00f6\u00d6\u00fc\u00dc\u00e7\u00c7\u011f\u011e\u015f\u015e\s\.,;:!\?\-\(\)«»"\'\$\+\=]', text))
    ratio = az_letters / max(1, total_len)
    if vv_count > 2:
        ratio -= 0.1
    return max(0.0, min(1.0, round(ratio, 4)))

total_read = 0
noise_skipped = 0
clean_written = 0
grade_repaired = 0
lesson_anchored = 0
unanchored_samples = []

with open(INPUT_PATH, 'r', encoding='utf-8') as fin, \
     open(OUTPUT_CLEAN, 'w', encoding='utf-8') as fout:
    
    for line_idx, line in enumerate(fin):
        total_read += 1
        try:
            c = json.loads(line)
        except Exception:
            continue
            
        raw_text = c.get('text', '')
        if is_noise(raw_text):
            noise_skipped += 1
            continue
            
        book_id = c.get('book_id', '')
        orig_g = c.get('grade')
        norm_g = normalize_grade(orig_g, book_id)
        if norm_g != orig_g:
            grade_repaired += 1
            
        subj = c.get('subject', '')
        quality_score = compute_az_quality(raw_text)
        
        # Match with lesson in curriculum registry
        section = str(c.get('section', '') or c.get('section_title', '')).strip()
        matched_lesson = None
        matched_strand = None
        
        cat_key = (norm_g, subj.lower().strip())
        lessons = lesson_catalog.get(cat_key, [])
        for les in lessons:
            clean_t = les.get('clean_title', '').lower()
            raw_t = les.get('raw_title', '').lower()
            sec_l = section.lower()
            if sec_l and (clean_t in sec_l or sec_l in clean_t or raw_t in sec_l):
                matched_lesson = les.get('raw_title')
                matched_strand = les.get('strand_name')
                break
                
        if matched_lesson:
            lesson_anchored += 1
        else:
            if len(unanchored_samples) < 5:
                unanchored_samples.append({'book_id': book_id, 'grade': norm_g, 'subj': subj, 'section': section})
                
        clean_record = {
            'chunk_id': f"chunk_{norm_g}_{book_id}_{clean_written+1}",
            'book_id': book_id,
            'grade': norm_g,
            'subject': subj,
            'section': section,
            'lesson_anchor': matched_lesson,
            'strand_anchor': matched_strand,
            'quality_score': quality_score,
            'text': raw_text
        }
        
        fout.write(json.dumps(clean_record, ensure_ascii=False) + '\n')
        clean_written += 1

print("\n================ FAZA 1 NƏTİCƏSİ ================")
print(f"Cəmi oxunan parça: {total_read}")
print(f"Küy (Lisenziya, redaksiya, boş) çıxarılan: {noise_skipped}")
print(f"Sinif (grade) normallaşdırılan/bərpa edilən: {grade_repaired}")
print(f"Kurikulum dərsinə birbaşa lövbərlənən (anchored): {lesson_anchored}")
print(f"Təmizlənmiş korpus parça sayı: {clean_written}")
print(f"Çıxış faylı: {OUTPUT_CLEAN}")

with open('data/ontology/audit/phase1_hygiene_report.json', 'w', encoding='utf-8') as f:
    json.dump({
        'total_read': total_read,
        'noise_skipped': noise_skipped,
        'clean_written': clean_written,
        'grade_repaired': grade_repaired,
        'lesson_anchored': lesson_anchored,
        'unanchored_samples': unanchored_samples
    }, f, ensure_ascii=False, indent=2)

print("Ətraflı hesabat data/ontology/audit/phase1_hygiene_report.json faylına yazıldı.")
