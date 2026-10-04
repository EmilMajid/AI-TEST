#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
deep_audit_v2.py — Systematic, read-only audit of the whole question bank.
Every check is a named defect class with: count, per-subject breakdown, samples.
Nothing is modified. Output: scripts/audit_v2_results.json + stdout summary.
"""
import json, glob, os, re
from collections import Counter, defaultdict

ORD = {1: 'ci', 2: 'ci', 3: 'cü', 4: 'cü', 5: 'ci', 6: 'cı', 7: 'ci', 8: 'ci', 9: 'cu', 10: 'cu', 11: 'ci'}
BLOOM_MIN = {'Bilik': 10, 'Anlama': 10, 'Tətbiq': 15, 'Təhlil': 20}
LETTERS = 'ABCDEF'

def az_lower(s):
    return str(s or '').replace('İ', 'i').replace('I', 'ı').lower()

def norm(s):
    s = az_lower(s)
    s = re.sub(r'^\s*([0-9]+(\.[0-9]+)*|[ivxlcdm]+)[\.\:\-\)]\s*', '', s)
    s = re.sub(r'^elmi anlayış:\s*', '', s)
    s = re.sub(r'[«»“”„"\'`’‘()\[\]\.,:;!?—–\-]', ' ', s)
    return re.sub(r'\s+', ' ', s).strip()

def base_subject(s):
    return re.sub(r'\s*\(hissə\s*\d+\)', '', s).strip()

def subj_core(s):
    return norm(re.sub(r'\d+', '', base_subject(s)))

def cyr_ratio(t):
    letters = [c for c in t if c.isalpha()]
    if not letters: return 0.0
    return sum(1 for c in letters if '\u0400' <= c <= '\u04FF') / len(letters)

def to_idx(v, opts):
    if v is None or v == '': return None
    if isinstance(v, bool): return None
    if isinstance(v, int): return v
    s = str(v).strip()
    if len(s) == 1 and s.upper() in LETTERS: return LETTERS.index(s.upper())
    if s.isdigit(): return int(s)
    m = re.match(r'^([A-F])[\)\.]', s)
    if m: return LETTERS.index(m.group(1))
    for i, o in enumerate(opts or []):
        if norm(o) == norm(s): return i
    return None

R = defaultdict(lambda: {'count': 0, 'by_subject': Counter(), 'samples': []})
GROUP = {}
DESC = {}

def flag(code, group, desc, ctx, detail=''):
    GROUP[code] = group; DESC[code] = desc
    r = R[code]; r['count'] += 1; r['by_subject'][ctx['subj']] += 1
    if len(r['samples']) < 5:
        r['samples'].append(f"{ctx['file']} | {ctx['subj']} | {ctx['topic']} | Q{ctx['i']+1}: {ctx['text'][:90]} || {detail}"[:400])

GRAMMAR = re.compile(r'(cümlə|nitq hissə|isim|sifət|feil|şəkilçi|mübtəda|durğu|orfoqraf|sintaktik|morfoloji|sinonim|antonim|omonim|söz birləşmə|zərf|əvəzlik|'
                     r'предложени|словообразов|суффикс|приставк|падеж|склонени|спряжени|причасти|деепричасти|синоним|антоним|морфолог|синтаксич|орфограф|'
                     r'существительн|прилагательн|глагол|наречи|местоимени|частиц|обособлен|'
                     r'\btense\b|grammar|passive voice|plural|\bverb\b|\bnoun\b|adjective|preposition|conditional|gerund|infinitive)', re.I)
ANALYSIS = re.compile(r'(проанализируй|сравните|сопоставьте|обоснуйте|təhlil ed|müqayisə ed|əsaslandır|\banaly[sz]e\b|\bcompare\b|\bjustify\b)', re.I)
CALC = re.compile(r'(hesablay|вычисли|\bcalculate\b|найдите значение)', re.I)
ALL_NONE = re.compile(r'(hamısı doğru|heç biri|bütün cavablar|all of the above|none of the above|все ответы|все перечисленн|ни один из)', re.I)
TEMPLATE_DIAG = re.compile(r'tədris standartına uyğun deyil|mövzusunun tədris standartına', re.I)
PAGE = re.compile(r'\b(səh(ifə)?|s\.|page|стр\.)\s*\d+', re.I)
LANG_SUBJ = re.compile(r'dili|ədəbiyyat|rus|ingilis|alman|fransız', re.I)

totals = Counter()
topic_bloom = {}
topic_diff = {}
topic_letters = {}
topic_longest = {}
global_text = defaultdict(list)
staging_counts = {}

for fp in sorted(glob.glob('data/grades/grade_*.json')):
    if 'other' in fp: continue
    fname = os.path.basename(fp)
    print(f"Auditing {fname}...", flush=True)
    fgrade = int(re.search(r'\d+', fname).group())
    data = json.load(open(fp, encoding='utf-8'))
    subj_names = [s for s in data if isinstance(data[s], dict)]

    # S10: hissə duplication (base subject + part subject both present)
    base_cache = {}
    for s in subj_names:
        if '(hissə' in s:
            bs = base_subject(s)
            if bs in data:
                if bs not in base_cache:
                    base_cache[bs] = {norm(q.get('question') or q.get('q')) for qs in data[bs].values() if isinstance(qs, list) for q in qs if isinstance(q, dict)}
                base_texts = base_cache[bs]
                for t, qs in data[s].items():
                    if not isinstance(qs, list): continue
                    for i, q in enumerate(qs):
                        if isinstance(q, dict) and norm(q.get('question') or q.get('q')) in base_texts:
                            flag('S10', 'STRUKTUR', "Eyni sual həm '<Fənn N>' həm də '<Fənn N (hissə k)>' altında təkrar saxlanılır",
                                 {'file': fname, 'subj': s, 'topic': t, 'i': i, 'text': str(q.get('question') or q.get('q'))})

    for subj in subj_names:
        topics = data[subj]
        is_lang = bool(LANG_SUBJ.search(subj))
        is_rus = 'rus' in az_lower(subj)
        is_eng = 'ingilis' in az_lower(subj)
        sibling = {}
        for t in topics:
            sibling[norm(t)] = t
        for topic, qs in topics.items():
            if not isinstance(qs, list): continue
            tkey = (fname, subj, topic)
            tn = norm(topic)
            seen_in_topic = {}
            for i, q in enumerate(qs):
                if not isinstance(q, dict): continue
                totals['questions'] += 1
                text = str(q.get('question') or q.get('q') or '')
                opts = q.get('options') or q.get('opts') or q.get('options_array') or []
                expl = str(q.get('explanation') or q.get('izah') or '')
                bloom = str(q.get('bloom_level') or '')
                bt = q.get('backward_trace') or {}
                ctx = {'file': fname, 'subj': subj, 'topic': topic, 'i': i, 'text': text}

                # ---------------- STRUKTUR ----------------
                # Pedaqoji yaşa uyğunluq: 1-ci sinif 3 variant (A, B, C); 2-11-ci siniflər 4 variant
                if fgrade == 1:
                    if len(opts) != 3:
                        flag('S1', 'STRUKTUR', '1-ci sinifdə variant sayı 3 deyil (Yaşa uyğun standart: 3 variant)', ctx, f"{len(opts)} variant")
                else:
                    if len(opts) != 4:
                        flag('S1', 'STRUKTUR', 'Variant sayı 4 deyil (SİTG: 4 variant mütləqdir)', ctx, f"{len(opts)} variant, sinif {fgrade}")
                nopts = [norm(o) for o in opts]
                if len(set(nopts)) != len(nopts):
                    flag('S2', 'STRUKTUR', 'Təkrarlanan (eyni) variantlar', ctx, ' / '.join(map(str, opts))[:150])
                if any(not str(o).strip() for o in opts):
                    flag('S3', 'STRUKTUR', 'Boş variant', ctx)
                idxs = {}
                for f in ('correctAnswer', 'correct_index', 'correct_answer', 'answer', 'correct_letter'):
                    if f in q:
                        v = to_idx(q.get(f), opts)
                        if v is not None: idxs[f] = v
                distinct = set(idxs.values())
                ci = None
                if not distinct:
                    flag('S4', 'STRUKTUR', 'Doğru cavab müəyyən edilə bilmir', ctx)
                elif len(distinct) > 1:
                    flag('S5', 'STRUKTUR', 'Cavab sahələri bir-birinə ziddir (correctAnswer/correct_answer/answer/correct_index)', ctx, str(idxs))
                    ci = idxs.get('correctAnswer', next(iter(distinct)))
                else:
                    ci = next(iter(distinct))
                if ci is not None and opts and not (0 <= ci < len(opts)):
                    flag('S6', 'STRUKTUR', 'Doğru cavab indeksi variant sayından kənardadır', ctx, f"idx={ci}, n={len(opts)}"); ci = None
                dd = q.get('distractor_diagnostics') or {}
                if isinstance(dd, dict) and ci is not None:
                    ok_keys = [k for k, v in dd.items() if str(v).upper().startswith('DÜZGÜN')]
                    if ok_keys and ok_keys != [LETTERS[ci]]:
                        flag('S7', 'STRUKTUR', 'Distraktor diaqnostikasında "DÜZGÜNDÜR" yanlış hərfdədir', ctx, f"diag={ok_keys}, cavab={LETTERS[ci]}")
                    if len(dd) != len(opts) and opts:
                        flag('S8', 'STRUKTUR', 'Diaqnostika sayı variant sayına bərabər deyil', ctx, f"diag={len(dd)}, opts={len(opts)}")
                qt = q.get('topic')
                if qt and norm(qt) != tn and norm(qt) not in tn and tn not in norm(qt):
                    flag('S9', 'STRUKTUR', "Sualın daxili 'topic' sahəsi yerləşdiyi mövzu ilə uyğun deyil", ctx, f"topic sahəsi='{qt}'")
                g = q.get('grounding') or {}
                if isinstance(g, dict) and g.get('grade') not in (None, '') and str(g.get('grade')) != str(fgrade):
                    flag('S11', 'STRUKTUR', 'grounding.grade fayl sinfinə uyğun deyil', ctx, f"grounding.grade={g.get('grade')}")
                if isinstance(g, dict) and g.get('book') and subj_core(g.get('book')) != subj_core(subj):
                    flag('S12', 'STRUKTUR', 'grounding.book başqa fənnə aiddir', ctx, f"book={g.get('book')}")
                pid = str(q.get('passport_id') or '')
                m = re.match(r'^(\d{2})-', pid)
                if m and int(m.group(1)) != fgrade:
                    flag('S13', 'STRUKTUR', 'passport_id sinif kodu fayl sinfinə uyğun deyil', ctx, pid)
                if q.get('bloomLevel') and az_lower(q.get('bloomLevel')) != az_lower(bloom):
                    flag('S14', 'STRUKTUR', 'bloom_level ilə bloomLevel uyğun deyil', ctx, f"{bloom} vs {q.get('bloomLevel')}")

                # ---------------- KAG ----------------
                rc = str(bt.get('root_concept') or '')
                cn = str(bt.get('concept_name') or '')
                tip = str(bt.get('parent_action_tip') or '')
                rb = str(bt.get('root_book') or '')
                try: rg = int(bt.get('root_grade'))
                except Exception: rg = None
                rcn = norm(rc)
                if not rcn:
                    flag('K0', 'KAG', 'root_concept boşdur', ctx)
                same = (rcn == tn) or (rcn and (rcn in tn or tn in rcn))
                if rcn and not same and rcn in sibling and (rg is None or rg == fgrade):
                    code = 'K1L' if is_lang else 'K1O'
                    flag(code, 'KAG', ('DİL/ƏDƏBİYYAT: ' if is_lang else 'DİGƏR FƏNLƏR: ') + 'Kök anlayış eyni kitabın BAŞQA mövzusudur (qonşu mövzuya sürüşmə)',
                         ctx, f"mövzu='{topic}' -> kök='{rc}'")
                if cn and rcn and norm(cn) != rcn and rcn in sibling and not same:
                    flag('K2', 'KAG', "Kartda başlıq (concept_name) ilə bərpa dərsi (root_concept) fərqli mövzudur — görünən ziddiyyət", ctx, f"başlıq='{cn}' / bərpa='{rc}'")
                rc_clean = norm(rc)
                if rc_clean and rc_clean not in norm(tip):
                    flag('K3', 'KAG', 'Valideyn bələdçisi root_concept-i göstərmir (bələdçi ilə kök desinxrondur)', ctx, f"kök='{rc[:60]}' tip='{tip[:120]}'")
                if rb and subj_core(rb) != subj_core(subj):
                    flag('K4', 'KAG', 'root_book başqa fənnə aiddir (fənlərarası sızma)', ctx, f"root_book='{rb}'")
                if rg is not None and rg > fgrade:
                    flag('K5', 'KAG', 'Kök sinif sualın sinfindən YUXARIDIR (gələcək sinfə istinad)', ctx, f"root_grade={rg}")
                mb = re.search(r'(\d+)\s*$', rb)
                if mb and rg is not None and int(mb.group(1)) != rg:
                    flag('K6', 'KAG', 'root_book-dakı sinif rəqəmi root_grade ilə uyğun deyil', ctx, f"{rb} / {rg}")
                exp_min = BLOOM_MIN.get(bloom)
                md = re.search(r'(\d+)\s*dəqiqə', tip)
                if exp_min and md and int(md.group(1)) != exp_min:
                    flag('K7', 'KAG', 'Bələdçidəki dəqiqə Bloom səviyyəsinə uyğun deyil', ctx, f"{bloom}->{exp_min}, tip={md.group(1)}")
                if exp_min and bt.get('remedial_duration_mins') not in (None, exp_min):
                    flag('K8', 'KAG', 'remedial_duration_mins Bloom səviyyəsinə uyğun deyil', ctx, f"{bloom}->{exp_min}, field={bt.get('remedial_duration_mins')}")
                if exp_min is None:
                    flag('K9', 'KAG', 'Bloom səviyyəsi standart 4 dəyərdən biri deyil', ctx, f"bloom='{bloom}'")
                if is_lang and GRAMMAR.search(text) and 'oxuyub-anlama' in tip:
                    flag('K10', 'KAG', "Qrammatika sualına 'oxuyub-anlama' bacarığı yazılıb (bacarıq tipi səhv)", ctx)
                if 'ədəbiyyat' in az_lower(subj) and 'əsas qaydaları' in tip:
                    flag('K11', 'KAG', "Ədəbiyyat mətni üçün 'əsas qaydaları' ifadəsi (mənasız şablon)", ctx)
                if PAGE.search(tip):
                    flag('K12', 'KAG', 'Bələdçidə səhifə nömrəsi var (Zero-Page pozuntusu)', ctx, tip[:120])
                if re.search(r'bacarığı\s+bacarığını|bacarığını\s+bacarığını', tip):
                    flag('K13', 'KAG', 'Bələdçidə tavtologiya', ctx)
                for m2 in re.finditer(r'\b(\d{1,2})-(ci|cı|cu|cü)\s+sinif', tip):
                    gnum = int(m2.group(1))
                    if gnum in ORD and m2.group(2) != ORD[gnum]:
                        flag('K14', 'KAG', 'Sıra şəkilçisi səhvdir (məs. 10-ci -> 10-cu)', ctx, m2.group(0)); break
                mg = re.search(r'\b(\d{1,2})-(?:ci|cı|cu|cü)\s+sinif', tip)
                if mg and rg is not None and int(mg.group(1)) not in (rg, fgrade):
                    flag('K15', 'KAG', 'Bələdçidəki sinif rəqəmi nə root_grade, nə sual sinfidir', ctx, mg.group(0))
                if 'elmi anlayış:' in az_lower(rc) or 'elmi anlayış:' in az_lower(tip):
                    flag('K16', 'KAG', "'Elmi Anlayış:' qalığı kök/bələdçidə", ctx)

                # ---------------- BLOOM / ÇƏTİNLİK ----------------
                if ANALYSIS.search(text) and bloom in ('Bilik', 'Anlama'):
                    flag('B1', 'BLOOM', 'Təhlil feli olan sual Bilik/Anlama kimi işarələnib', ctx, bloom)
                if CALC.search(text) and bloom == 'Bilik':
                    flag('B2', 'BLOOM', 'Hesablama sualı Bilik kimi işarələnib', ctx)
                topic_bloom.setdefault(tkey, []).append(bloom)
                topic_diff.setdefault(tkey, []).append(az_lower(q.get('difficulty') or ''))

                # ---------------- MƏZMUN ----------------
                core = re.sub(r'^\s*Doğru cavab\s+[A-F]\s+variantıdır\.?\s*', '', expl).strip()
                if len(core) < 30:
                    flag('C1', 'MƏZMUN', 'İzah boş və ya qısa (<30 simvol) — elmi izah yoxdur', ctx, f"izah='{expl[:80]}'")
                if ci is not None and opts and core and norm(core) == norm(opts[ci]):
                    flag('C2', 'MƏZMUN', 'İzah sadəcə doğru cavabı təkrarlayır', ctx)
                ml = re.search(r'Doğru cavab\s+([A-F])\b', expl)
                if ml and ci is not None and LETTERS.index(ml.group(1)) != ci:
                    flag('C3', 'MƏZMUN', 'İzahda göstərilən doğru hərf cavab açarına ziddir', ctx, f"izah={ml.group(1)}, açar={LETTERS[ci]}")
                if any(ALL_NONE.search(str(o)) for o in opts):
                    flag('C4', 'MƏZMUN', "'Hamısı doğrudur/Heç biri' tipli variant (SİTG distraktor qadağası)", ctx)
                if isinstance(dd, dict) and dd:
                    wrong = [str(v) for v in dd.values() if not str(v).upper().startswith('DÜZGÜN')]
                    if wrong and all(TEMPLATE_DIAG.search(w) for w in wrong):
                        flag('C5', 'MƏZMUN', 'Distraktor diaqnostikası şablondur — tipik şagird səhvi göstərilmir', ctx)
                tn_q = norm(text)
                if tn_q in seen_in_topic:
                    flag('C6', 'MƏZMUN', 'Eyni mövzuda təkrar sual', ctx, f"Q{seen_in_topic[tn_q]+1} ilə eyni")
                else:
                    seen_in_topic[tn_q] = i
                if '(hissə' not in subj:
                    global_text[tn_q].append((fname, subj, topic))
                cr = cyr_ratio(text)
                if is_rus and len(text) > 20 and cr < 0.3:
                    flag('C7', 'MƏZMUN', 'Rus dili sualı kiril əlifbasında deyil', ctx)
                if not is_rus and cr > 0.3:
                    flag('C8', 'MƏZMUN', 'Rus dili olmayan fəndə kiril mətnli sual', ctx)
                if text.count('$') % 2 == 1 or any(str(o).count('$') % 2 == 1 for o in opts):
                    flag('C9', 'MƏZMUN', 'LaTeX pozulub ($ sayı tək)', ctx)
                if ci is not None and len(opts) >= 3:
                    lens = [len(str(o)) for o in opts]
                    others = [l for j, l in enumerate(lens) if j != ci]
                    topic_longest.setdefault(tkey, []).append(lens[ci] > 1.5 * (sum(others) / len(others)) if others and sum(others) else False)
                if ci is not None:
                    topic_letters.setdefault(tkey, []).append(ci)

# ---------------- Topic-level checks ----------------
def tflag(code, group, desc, tkey, detail, n):
    GROUP[code] = group; DESC[code] = desc
    r = R[code]; r['count'] += 1; r['by_subject'][tkey[1]] += 1
    r.setdefault('questions_affected', 0); r['questions_affected'] += n
    if len(r['samples']) < 5:
        r['samples'].append(f"{tkey[0]} | {tkey[1]} | {tkey[2]} || {detail}")

for tkey, bl in topic_bloom.items():
    if len(bl) >= 10 and len(set(bl)) == 1:
        tflag('B3', 'BLOOM', 'Mövzunun BÜTÜN sualları eyni Bloom səviyyəsindədir (mexaniki işarələmə) [mövzu sayı]', tkey, bl[0], len(bl))
DORD = {'sadə': 0, 'orta': 1, 'çətin': 2}
for tkey, dl in topic_diff.items():
    vals = [DORD.get(d) for d in dl]
    if len(vals) >= 10 and None not in vals and len(set(vals)) >= 2 and vals == sorted(vals):
        tflag('B4', 'BLOOM', 'Çətinlik sıra nömrəsinə görə mexaniki paylanıb (sadə→orta→çətin) [mövzu sayı]', tkey, ''.join(str(v) for v in vals), len(vals))
for tkey, ls in topic_letters.items():
    if len(ls) >= 10:
        top, cnt = Counter(ls).most_common(1)[0]
        if cnt / len(ls) >= 0.6:
            tflag('C10', 'MƏZMUN', 'Doğru cavab mövqeyi bir hərfdə toplanıb (≥60%) [mövzu sayı]', tkey, f"{LETTERS[top]}: {cnt}/{len(ls)}", len(ls))
for tkey, fl in topic_longest.items():
    if len(fl) >= 10 and sum(fl) / len(fl) >= 0.5:
        tflag('C11', 'MƏZMUN', 'Doğru cavab sistematik olaraq ən uzun variantdır (≥50% sualda) — ipucu verir [mövzu sayı]', tkey, f"{sum(fl)}/{len(fl)}", len(fl))
cross = 0; cross_samples = []
for t, locs in global_text.items():
    if len(t) > 25 and len(set(locs)) > 1:
        cross += len(locs) - 1
        if len(cross_samples) < 5: cross_samples.append(f"'{t[:80]}' -> {sorted(set(locs))[:3]}")
GROUP['C12'] = 'MƏZMUN'; DESC['C12'] = 'Eyni sual mətni bazanın müxtəlif mövzularında/siniflərində təkrarlanır'
R['C12']['count'] = cross; R['C12']['samples'] = cross_samples

# ---------------- Staging drift ----------------
drift = {}
for fp in sorted(glob.glob('data/grades/grade_*.json')):
    if 'other' in fp: continue
    sp = os.path.join('autonomous_kag', 'active_staging', os.path.basename(fp))
    if not os.path.exists(sp): continue
    def cnt(p):
        d = json.load(open(p, encoding='utf-8')); return sum(len(v) for s in d.values() if isinstance(s, dict) for v in s.values() if isinstance(v, list))
    a, b = cnt(fp), cnt(sp)
    if a != b: drift[os.path.basename(fp)] = {'data': a, 'staging': b}
GROUP['X1'] = 'STRUKTUR'; DESC['X1'] = 'data/grades ilə active_staging arasında sual sayı fərqi (fayl sayı)'
R['X1']['count'] = len(drift); R['X1']['samples'] = [f"{k}: {v}" for k, v in drift.items()]

# ---------------- Output ----------------
out = {'totals': dict(totals), 'checks': {}}
for code in sorted(R, key=lambda c: (GROUP.get(c, ''), c)):
    r = R[code]
    out['checks'][code] = {'group': GROUP.get(code), 'desc': DESC.get(code), 'count': r['count'],
                           'questions_affected': r.get('questions_affected'),
                           'top_subjects': dict(Counter(r['by_subject']).most_common(8)), 'samples': r['samples']}
json.dump(out, open('scripts/audit_v2_results.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)

print(f"TOTAL QUESTIONS: {totals['questions']}")
for grp in ('STRUKTUR', 'KAG', 'BLOOM', 'MƏZMUN'):
    print(f"\n######## {grp} ########")
    for code, c in out['checks'].items():
        if c['group'] != grp: continue
        qa = f" (sual: {c['questions_affected']})" if c['questions_affected'] else ''
        print(f"[{code}] {c['count']}{qa} — {c['desc']}")
        print(f"      top: {list(c['top_subjects'].items())[:4]}")
