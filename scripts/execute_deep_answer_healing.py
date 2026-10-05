import json
import os
import glob
import re
import sys
import time

sys.stdout.reconfigure(encoding='utf-8')

# Azerbaijani and Cyrillic character helpers
AZ_LOWER_MAP = {
    'I': 'ı', 'İ': 'i', 'Ə': 'ə', 'Ö': 'ö', 'Ü': 'ü', 'Ç': 'ç', 'Ş': 'ş', 'Ğ': 'ğ'
}

def az_lower(text):
    if not text:
        return ""
    s = str(text)
    for k, v in AZ_LOWER_MAP.items():
        s = s.replace(k, v)
    return s.lower()

LETTERS = ['A', 'B', 'C', 'D', 'E']

# Suffixes to strip for stemming in Azerbaijani
SUFFIXES = sorted([
    'nın', 'nin', 'nun', 'nün', 'yın', 'yin', 'yun', 'yün',
    'lar', 'lər', 'dan', 'dən', 'tan', 'tən',
    'ya', 'yə', 'na', 'nə', 'da', 'də', 'ta', 'tə',
    'ın', 'in', 'un', 'ün', 'nı', 'ni', 'nu', 'nü',
    'sı', 'si', 'su', 'sü', 'li', 'lı', 'lu', 'lü',
    'la', 'lə', 'ilə', 'sız', 'siz', 'suz', 'süz',
    'mış', 'miş', 'muş', 'müş', 'dık', 'dik', 'duk', 'dük',
    'dım', 'dim', 'dum', 'düm', 'dır', 'dir', 'dur', 'dür',
    'tık', 'tik', 'tuk', 'tük', 'tı', 'ti', 'tu', 'tü',
    'acaq', 'əcək', 'malı', 'məli', 'ır', 'ir', 'ur', 'ür',
    'mirzəyə', 'padşahı', 'xanına', 'bəyinə'
], key=len, reverse=True)

def stem_word(w):
    w = az_lower(w)
    w = re.sub(r'[^a-z0-9\u0259\u0131\u00f6\u00fc\u00e7\u015f\u011f\u0400-\u04ff]', '', w)
    if len(w) <= 3:
        return w
    for suf in SUFFIXES:
        if len(w) > len(suf) + 3 and w.endswith(suf):
            return w[:-len(suf)]
    return w

STOP_WORDS = {
    'dövlət', 'hadisə', 'qeyd', 'olunan', 'olan',
    'kimi', 'üçün', 'düzgün', 'cavab', 'tarixi', 'əsasən', 'məsələ', 'şərt',
    'uyğun', 'deyil', 'edildi', 'edir', 'oldu', 'olmuşdur', 'olaraq', 'görə',
    'hansı', 'necə', 'biri', 'bütün', 'daha', 'çox', 'yaxın',
    'lakin', 'ancaq', 'bəzi', 'digər', 'etmişdir',
    'təşkil', 'edən', 'edir', 'edib', 'verilmişdir', 'verir', 'nəticəsində',
    'doğru', 'variant', 'variantıdır', 'həll', 'izah', 'şagird', 'sual'
}

def clean_book_display(book_name, grade_num):
    if not book_name:
        return ""
    b = str(book_name).strip()
    # If book ends with grade_num, e.g. "Azərbaycan tarixi 10", trim it for natural phrasing
    b_clean = re.sub(rf'\s+{grade_num}$', '', b).strip()
    return b_clean

def get_subject_rule_phrase(subj_name, is_literature=False, is_grammar=False):
    s = az_lower(subj_name)
    if 'tarix' in s:
        return "(əsas tarixi hadisələri və prosesləri)"
    elif 'riyaziyyat' in s or 'həndəsə' in s or 'cəbr' in s:
        return "(əsas qayda və həll üsullarını)"
    elif 'fizika' in s or 'kimya' in s:
        return "(əsas elmi qanun və düsturları)"
    elif 'biologiya' in s or 'coğrafiya' in s or 'təbiət' in s or 'həyat bilgisi' in s:
        return "(əsas elmi anlayış və xüsusiyyətləri)"
    elif 'ədəbiyyat' in s or is_literature:
        return "(bədii təhlilini)"
    elif is_grammar:
        return "(əsas qrammatik qaydaları)"
    elif 'informatika' in s:
        return "(əsas alqoritm və anlayışları)"
    return "(əsas qaydaları)"

def get_auth_index(q, opts):
    for f in ('correctAnswer', 'correct_index'):
        v = q.get(f)
        if isinstance(v, int) and 0 <= v < len(opts):
            return v
    for f in ('correct_answer', 'answer', 'correct_letter'):
        v = q.get(f)
        if v is not None:
            s = str(v).strip().upper()
            if len(s) == 1 and s in LETTERS:
                idx = LETTERS.index(s)
                if idx < len(opts):
                    return idx
    return 0

def set_question_answer(q, opts, new_ci):
    new_letter = LETTERS[new_ci]
    q['answer'] = new_letter
    q['correct_answer'] = new_letter
    q['correctAnswer'] = new_ci
    q['correct_index'] = new_ci
    if 'correct_letter' in q:
        q['correct_letter'] = new_letter

    # Resync distractor_diagnostics
    dd = q.get('distractor_diagnostics')
    if isinstance(dd, dict) and dd:
        new_dd = {}
        for oi in range(len(opts)):
            ol = LETTERS[oi]
            if oi == new_ci:
                new_dd[ol] = f"DÜZGÜNDÜR: {ol} variantı sualın şərtinə və dərslik qaydalarına tam uyğun olan doğru cavabdır."
            else:
                old_val = dd.get(ol, '')
                if str(old_val).upper().startswith('DÜZGÜN'):
                    new_dd[ol] = f"{ol} variantı yanlışdır: mövzunun tədris faktlarına və ya şərtinə uyğun gəlmir."
                else:
                    new_dd[ol] = old_val or f"{ol} variantı yanlışdır: dərslik qaydalarına uyğun deyil."
        q['distractor_diagnostics'] = new_dd

target_patterns = [
    'data/grades/grade_*.json',
    'autonomous_kag/active_staging/grade_*.json'
]

all_files = []
for pat in target_patterns:
    for fp in sorted(glob.glob(pat)):
        if 'other' in fp: continue
        all_files.append(os.path.abspath(fp))
all_files = sorted(set(all_files))

stats = {
    'answer_keys_realigned': 0,
    'parent_tips_refined': 0,
    'distractors_cleaned': 0,
    'kök_anlayış_fixed': 0,
    'files_saved': 0
}

realigned_samples = []

for fp in all_files:
    fname = os.path.basename(fp)
    file_modified = False
    
    with open(fp, 'r', encoding='utf-8') as f:
        data = json.load(f)

    for subj, topics in data.items():
        if not isinstance(topics, dict): continue
        is_lit = 'ədəbiyyat' in az_lower(subj) or 'литератур' in az_lower(subj)

        for topic, qs in topics.items():
            if not isinstance(qs, list) or len(qs) == 0: continue

            for qi, q in enumerate(qs):
                if not isinstance(q, dict): continue
                opts = q.get('options')
                expl = q.get('explanation')
                if not opts or not isinstance(opts, list) or len(opts) < 2: continue
                if not expl or not isinstance(expl, str): continue

                curr_ci = get_auth_index(q, opts)
                q_text = str(q.get('question', ''))

                # --- 1. SPECIAL CASE FIXES FOR TARGET QUESTIONS ---
                # A: Ağqoyunlu Q3 (Qanunnamə)
                if 'vergiləri nizama salmaq' in q_text and 'Ağqoyunlu' in q_text:
                    for oi, opt in enumerate(opts):
                        if 'Həsən padşah Qanunnaməsi' in opt or 'Qanunnamə' in opt:
                            if curr_ci != oi:
                                realigned_samples.append((subj, topic, qi+1, LETTERS[curr_ci], LETTERS[oi], opt))
                                set_question_answer(q, opts, oi)
                                curr_ci = oi
                                stats['answer_keys_realigned'] += 1
                                file_modified = True
                            break

                # B: Ağqoyunlu Q7 (Qərbi Avropa diplomatik əlaqələr)
                if 'Qərbi Avropa' in q_text and 'diplomatik' in q_text and 'Uzun Həsən' in q_text:
                    for oi, opt in enumerate(opts):
                        if 'Osmanlıya qarşı hərbi ittifaq' in opt:
                            if curr_ci != oi:
                                realigned_samples.append((subj, topic, qi+1, LETTERS[curr_ci], LETTERS[oi], opt))
                                set_question_answer(q, opts, oi)
                                curr_ci = oi
                                stats['answer_keys_realigned'] += 1
                                file_modified = True
                            break

                # C: Ağqoyunlu Q11 (Əbhər sülhü)
                if 'Əbhər' in q_text and ('bölündü' in q_text or 'müqavilə' in q_text):
                    for oi, opt in enumerate(opts):
                        if 'Əlvənd' in opt and 'Murad' in opt:
                            if curr_ci != oi:
                                realigned_samples.append((subj, topic, qi+1, LETTERS[curr_ci], LETTERS[oi], opt))
                                set_question_answer(q, opts, oi)
                                curr_ci = oi
                                stats['answer_keys_realigned'] += 1
                                file_modified = True
                            break

                # D: Ağqoyunlu Q15 (Tarixi rolu)
                if 'Ağqoyunlu dövlətinin Azərbaycan tarixindəki tarixi rolu' in q_text:
                    for oi, opt in enumerate(opts):
                        if 'beynəlxalq diplomatiya' in opt:
                            if curr_ci != oi:
                                realigned_samples.append((subj, topic, qi+1, LETTERS[curr_ci], LETTERS[oi], opt))
                                set_question_answer(q, opts, oi)
                                curr_ci = oi
                                stats['answer_keys_realigned'] += 1
                                file_modified = True
                            break

                # E: Ağqoyunlu Sual 1 Distraktor təmizliyi
                if 'Qurani-Kərimi ilk dəfə doğma Azərbaycan dilinə tərcümə' in str(opts):
                    if len(opts) >= 4:
                        if 'Bütün məktəbləri bağlatması' in opts:
                            b_idx = opts.index('Bütün məktəbləri bağlatması')
                            opts[b_idx] = 'Təbrizdə Göy məscidi inşa etdirməsi'
                            stats['distractors_cleaned'] += 1
                            file_modified = True
                        if 'Musiqini qadağan etməsi' in opts:
                            d_idx = opts.index('Musiqini qadağan etməsi')
                            opts[d_idx] = 'Şirvanşahlar dövləti ilə mədəni ittifaq qurması'
                            stats['distractors_cleaned'] += 1
                            file_modified = True

                # F: Ağqoyunlu Sual 3 root_concept təmizliyi
                bt = q.get('backward_trace')
                if isinstance(bt, dict):
                    rc = bt.get('root_concept', '')
                    if 'Hülakülər' in rc and 'Ağqoyunlu' in topic:
                        bt['root_concept'] = 'Ağqoyunlu dövləti'
                        stats['kök_anlayış_fixed'] += 1
                        file_modified = True

                # --- 2. GENERAL SEMANTIC & EXACT-QUOTE REALIGNMENT ---
                expl_clean = re.sub(r'^\s*Doğru cavab\s+[A-F]\s+variantıdır\.?\s*', '', expl).strip()
                expl_stems = set(stem_word(w) for w in re.findall(r'[\w\u0259\u018f\u0131\u0130\u00f6\u00d6\u00fc\u00dc\u00e7\u00c7\u011f\u011e\u015f\u015e]+', expl_clean)) - STOP_WORDS
                
                # Check 2A: Exact core substring match
                exact_candidates = []
                for oi, opt in enumerate(opts):
                    opt_str = str(opt).strip()
                    opt_core = re.sub(r'\(.*?\)', '', opt_str).strip(' "\'«»')
                    if len(opt_core) >= 8 and opt_core.lower() in expl_clean.lower():
                        exact_candidates.append(oi)

                if exact_candidates and curr_ci not in exact_candidates:
                    # Switch to the quoted candidate!
                    target_ci = exact_candidates[0]
                    realigned_samples.append((subj, topic, qi+1, LETTERS[curr_ci], LETTERS[target_ci], opts[target_ci]))
                    set_question_answer(q, opts, target_ci)
                    curr_ci = target_ci
                    stats['answer_keys_realigned'] += 1
                    file_modified = True
                elif len(expl_stems) >= 2:
                    # Check 2B: Informative Stem Overlap Contradiction
                    opt_overlaps = []
                    for oi, opt in enumerate(opts):
                        opt_str = re.sub(r'\(.*?\)', '', str(opt))
                        opt_stems = set(stem_word(w) for w in re.findall(r'[\w\u0259\u018f\u0131\u0130\u00f6\u00d6\u00fc\u00dc\u00e7\u00c7\u011f\u011e\u015f\u015e]+', opt_str)) - STOP_WORDS
                        common = expl_stems.intersection(opt_stems)
                        opt_overlaps.append((len(common), oi, common))

                    opt_overlaps.sort(key=lambda x: x[0], reverse=True)
                    top_len, top_oi, top_common = opt_overlaps[0]
                    curr_len = next((x[0] for x in opt_overlaps if x[1] == curr_ci), 0)

                    # Strict condition: top has at least 2 distinct meaningful stems AND curr has 0 or top >= curr + 2
                    if top_len >= 2 and top_oi != curr_ci and (curr_len == 0 or top_len >= curr_len + 2):
                        # High confidence dislocation detected
                        target_ci = top_oi
                        realigned_samples.append((subj, topic, qi+1, LETTERS[curr_ci], LETTERS[target_ci], opts[target_ci]))
                        set_question_answer(q, opts, target_ci)
                        curr_ci = target_ci
                        stats['answer_keys_realigned'] += 1
                        file_modified = True

                # --- 3. REFINE PARENT ACTION TIP IN KAG ---
                bt = q.get('backward_trace')
                if isinstance(bt, dict):
                    tip = str(bt.get('parent_action_tip', ''))
                    root_b = str(bt.get('root_book', ''))
                    root_c = str(bt.get('root_concept', ''))
                    q_g = int(str(q.get('grade', '')).replace('grade_', '') or '10') if q.get('grade') else 10

                    # Fix (əsas qaydaları)
                    rule_phrase = get_subject_rule_phrase(subj, is_literature=is_lit)
                    if '(əsas qaydaları)' in tip and rule_phrase != '(əsas qaydaları)':
                        tip = tip.replace('(əsas qaydaları)', rule_phrase)
                        bt['parent_action_tip'] = tip
                        stats['parent_tips_refined'] += 1
                        file_modified = True

                    # Fix double book name, e.g. "10-cu sinif Azərbaycan tarixi 10 dərsliyindəki"
                    m_dup = re.search(r'(\d+)-(?:ci|cı|cu|cü)\s+sinif\s+([^d]+?)\s+(\1)\s+dərsliyindəki', tip)
                    if m_dup:
                        gnum = m_dup.group(1)
                        bname = m_dup.group(2).strip()
                        # replace with cleaner phrasing
                        rep = f"{gnum}-cu sinif {bname} dərsliyindəki" if gnum == '10' else f"{gnum}-ci sinif {bname} dərsliyindəki"
                        tip = tip[:m_dup.start()] + rep + tip[m_dup.end():]
                        bt['parent_action_tip'] = tip
                        stats['parent_tips_refined'] += 1
                        file_modified = True

    if file_modified:
        tmp_fp = fp + '.tmp'
        for attempt in range(5):
            try:
                with open(tmp_fp, 'w', encoding='utf-8') as f:
                    json.dump(data, f, ensure_ascii=False, indent=2)
                if os.path.exists(fp):
                    os.replace(tmp_fp, fp)
                else:
                    os.rename(tmp_fp, fp)
                stats['files_saved'] += 1
                break
            except Exception as e:
                time.sleep(0.5)

print("\n================== HEALING SUMMARY ==================")
print(f"Files saved: {stats['files_saved']}")
print(f"Answer keys realigned: {stats['answer_keys_realigned']}")
print(f"Parent action tips refined: {stats['parent_tips_refined']}")
print(f"Distractors cleaned: {stats['distractors_cleaned']}")
print(f"Kök anlayış fixed: {stats['kök_anlayış_fixed']}")

with open('scripts/realigned_samples.json', 'w', encoding='utf-8') as f:
    json.dump({
        'total_realigned': stats['answer_keys_realigned'],
        'samples': realigned_samples[:100]
    }, f, ensure_ascii=False, indent=2)

print("Saved samples to scripts/realigned_samples.json")
