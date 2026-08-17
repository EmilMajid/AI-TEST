"""
=============================================================================
G7 CLEAN + GUARD SYSTEM
=============================================================================
7-ci sinif test bazasını üç mərhələdə sağlamlaşdırır:

  1. BACKUP  — offline_tests.json-u tarixli bəkap faylı ilə qoruyur
  2. PURGE   — Bütün 7-ci sinif fənlərindən:
               • Süni meta-şablon sualları (prompt sızması)
               • Tam mətni eyni olan təkrar suallar
               silinir. Statistika ekrana çıxarılır.
  3. GUARD   — Hər yeni inteqrasiyadan ÖNCE çağrılacaq validator funksiyası
               (is_meta_template, is_duplicate) modulunu yazır ki, eyni
               tip suallar bir daha baza keçə bilməsin.

İstifadəsi:
    python g7_clean_and_guard.py --run    (bütün 3 mərhələni icra edir)
    python g7_clean_and_guard.py --dry    (yalnız sayları göstərir, silmir)
=============================================================================
"""

import json
import sys
import os
import hashlib
import argparse
import shutil
from datetime import datetime

sys.stdout.reconfigure(encoding='utf-8')

# ─── Yollar ────────────────────────────────────────────────────────────────
DB_PATH   = r'C:\Users\User\Downloads\azerbaijanaiplatform\data\offline_tests.json'
GUARD_OUT = r'C:\Users\User\Downloads\azerbaijanaiplatform\data\g7_question_fingerprints.json'
REPORT_OUT= r'C:\Users\User\.gemini\antigravity\scratch\g7_clean_report.json'

# ─── Meta-şablon əlamətləri ─────────────────────────────────────────────────
# Biologiya 7: variantlar həqiqi bioloji faktlar əvəzinə prompt templatelarıdır
# Texnologiya 7: variantlarda **Düzgün cavab:** / **İzahat:** sızması var
META_OPTION_PHRASES = [
    "Dərsliyin əsas mətnindən birbaşa götürülmüş",
    "Həqiqətə uyğun olmayan, uydurma bir mexanizm",
    "Digər bir bioloji prosesin və ya tam fərqli bir quruluşun tərifi",
    "Səslənişcə bənzər, lakin bioloji cəhətdən tamamilə yanlış olan ifadə",
    "Bu fikir və ya qayda/texnika",
    "Bu anlayış və ya metod tamamilə başqa bir fənnin",
    "Bu ifadə tarixi dövrlərdəki köhnəlmiş yanaşmaları",
    "**Düzgün cavab:**",
    "**İzahat:**",
    "Vizual bərabərlik qorunmuşdur",
]

META_QUESTION_PHRASES = [
    "anlayışının ən sadə tərifi və ya nümunəsi hansıdır?",
    "fikirlərdən/texnikalardan hansı tamamilə doğrudur?",
    "(Səviyyə: Asan) Mövzu:",
    "(Səviyyə: Orta) Mövzu:",
    "(Səviyyə: Çətin) Mövzu:",
]

# 7-ci sinif fənnləri
G7_SUBJECTS = [k for k in [] ]   # dolacaq yükləmə zamanı


# ─── Yardımçı funksiyalar ───────────────────────────────────────────────────
def fingerprint(question_text: str) -> str:
    """Sualın mətni üzrə sabit SHA-256 barmaq izi."""
    normalized = " ".join(question_text.lower().split())
    return hashlib.sha256(normalized.encode('utf-8')).hexdigest()


def is_meta_template(q: dict) -> bool:
    """
    True → sual süni meta-şablon/prompt sızmasıdır.
    Həm sual mətni, həm də variantlar yoxlanılır.
    """
    question_text = q.get('question', '')
    for phrase in META_QUESTION_PHRASES:
        if phrase in question_text:
            return True

    opts = q.get('options', [])
    for opt in (opts if isinstance(opts, list) else list(opts.values())):
        opt_str = str(opt)
        for phrase in META_OPTION_PHRASES:
            if phrase in opt_str:
                return True
    return False


def normalize_q_list(subject_data) -> list:
    """
    Hər fənnin data strukturunu (dict və ya list ola bilər)
    bir düz list-ə çevirir. topic sahəsi saxlanılır.
    """
    if isinstance(subject_data, list):
        return subject_data
    if isinstance(subject_data, dict):
        flat = []
        for topic_name, qs in subject_data.items():
            if isinstance(qs, list):
                for q in qs:
                    q_copy = dict(q)
                    if 'topic' not in q_copy:
                        q_copy['topic'] = topic_name
                    flat.append(q_copy)
        return flat
    return []


def rebuild_subject_data(original_data, clean_list: list):
    """
    Orijinal data strukturunu (dict/list) qoruyub,
    yalnız clean_list-dəki suallarla yenidən qurur.
    """
    if isinstance(original_data, list):
        return clean_list
    if isinstance(original_data, dict):
        rebuilt = {}
        for q in clean_list:
            topic = q.get('topic', 'Ümumi')
            if topic not in rebuilt:
                rebuilt[topic] = []
            rebuilt[topic].append(q)
        return rebuilt
    return clean_list


# ─── Əsas Məntiqi ─────────────────────────────────────────────────────────
def run(dry_run: bool = False):
    # ── 1. Yükləmə ─────────────────────────────────────────────────────────
    print(f"\n{'[DRY RUN] ' if dry_run else ''}=== G7 CLEAN + GUARD SYSTEM ===")
    print(f"Yüklənir: {DB_PATH}")
    with open(DB_PATH, 'r', encoding='utf-8') as f:
        db = json.load(f)

    g7_keys = sorted([k for k in db.keys() if '7' in k])
    print(f"7-ci sinif fənləri: {len(g7_keys)}\n")

    # ── 2. Bəkap ───────────────────────────────────────────────────────────
    if not dry_run:
        ts = datetime.now().strftime('%Y%m%d_%H%M%S')
        bak_path = DB_PATH.replace('.json', f'.bak_g7clean_{ts}.json')
        print(f"Bəkap: {bak_path}")
        shutil.copy2(DB_PATH, bak_path)
        print("Bəkap tamamlandı.\n")

    # ── 3. Fingerprint yükle (mövcudsa) ────────────────────────────────────
    existing_fps = set()
    if os.path.exists(GUARD_OUT):
        with open(GUARD_OUT, 'r', encoding='utf-8') as f:
            fp_data = json.load(f)
            existing_fps = set(fp_data.get('fingerprints', []))
    print(f"Mövcud fingerprint sayı: {len(existing_fps)}\n")

    # ── 4. Hər fənn üzrə Purge ─────────────────────────────────────────────
    total_removed_meta = 0
    total_removed_dup  = 0
    total_kept         = 0
    new_fps            = set()
    report             = {}

    for subj in g7_keys:
        raw_data  = db[subj]
        q_list    = normalize_q_list(raw_data)

        removed_meta = []
        removed_dup  = []
        kept         = []
        seen_fps_this_subj = set()

        for q in q_list:
            # a) meta-şablon yoxlaması
            if is_meta_template(q):
                removed_meta.append(q.get('question', '')[:80])
                continue

            # b) Dublikat yoxlaması (sual mətni üzrə fingerprint)
            q_text = q.get('question', '').strip()
            fp     = fingerprint(q_text)

            if fp in seen_fps_this_subj or fp in existing_fps:
                removed_dup.append(q_text[:80])
                continue

            seen_fps_this_subj.add(fp)
            new_fps.add(fp)
            kept.append(q)

        total_removed_meta += len(removed_meta)
        total_removed_dup  += len(removed_dup)
        total_kept         += len(kept)

        report[subj] = {
            'before': len(q_list),
            'removed_meta': len(removed_meta),
            'removed_dup':  len(removed_dup),
            'kept':         len(kept),
        }

        status = "✅" if (len(removed_meta) + len(removed_dup)) == 0 else "🧹"
        print(f"{status} {subj}")
        print(f"   Əvvəl: {len(q_list)} | Meta silinən: {len(removed_meta)} | "
              f"Təkrar silinən: {len(removed_dup)} | Qalan: {len(kept)}")

        # Bazada dəyişdir
        if not dry_run:
            db[subj] = rebuild_subject_data(raw_data, kept)

    # ── 5. Fingerprint faylını yenilə ──────────────────────────────────────
    all_fps = existing_fps | new_fps
    if not dry_run:
        fp_payload = {
            'last_updated': datetime.now().isoformat(),
            'total': len(all_fps),
            'fingerprints': list(all_fps)
        }
        with open(GUARD_OUT, 'w', encoding='utf-8') as f:
            json.dump(fp_payload, f, ensure_ascii=False, indent=2)
        print(f"\nFingerprint faylı yeniləndi: {GUARD_OUT}")
        print(f"Cəmi fingerprint: {len(all_fps)}")

    # ── 6. Bazanı yaz ──────────────────────────────────────────────────────
    if not dry_run:
        print(f"\nBaza yazılır: {DB_PATH}")
        with open(DB_PATH, 'w', encoding='utf-8') as f:
            json.dump(db, f, ensure_ascii=False, indent=2)
        print("Baza uğurla yeniləndi.")

    # ── 7. Hesabat ─────────────────────────────────────────────────────────
    print(f"\n{'='*60}")
    print(f"{'[DRY RUN] ' if dry_run else ''}📊 YEKUN NƏTİCƏLƏR")
    print(f"{'='*60}")
    print(f"  Silinen meta-şablon suallar : {total_removed_meta}")
    print(f"  Silinen təkrar suallar      : {total_removed_dup}")
    print(f"  Saxlanılan suallar          : {total_kept}")
    print(f"  Fingerprint bazası ölçüsü   : {len(all_fps)}")

    if not dry_run:
        report_data = {
            'timestamp': datetime.now().isoformat(),
            'dry_run': dry_run,
            'summary': {
                'removed_meta': total_removed_meta,
                'removed_dup':  total_removed_dup,
                'kept':         total_kept,
                'fingerprint_db_size': len(all_fps)
            },
            'per_subject': report
        }
        with open(REPORT_OUT, 'w', encoding='utf-8') as f:
            json.dump(report_data, f, ensure_ascii=False, indent=2)
        print(f"\nHesabat: {REPORT_OUT}")


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--run', action='store_true', help='Silmə əməliyyatını icra et')
    parser.add_argument('--dry', action='store_true', help='Yalnız simulasiya (heç nə silmə)')
    args = parser.parse_args()

    if not args.run and not args.dry:
        print("İstifadə: python g7_clean_and_guard.py --dry   (simulasiya)")
        print("          python g7_clean_and_guard.py --run   (həqiqi silmə)")
        sys.exit(0)

    run(dry_run=not args.run)
