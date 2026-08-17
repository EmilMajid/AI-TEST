"""
=============================================================================
g7_guard.py — Test İnteqrasiya Keçidçisi (QA Gate)
=============================================================================
Bu modul hər hansı test generasiya və ya inteqrasiya skriptinə import
edilərək yeni sualların baza keçməzdən ƏVVƏL yoxlanılmasını təmin edir.

İSTİFADƏ NÜMUNƏSİ:
───────────────────
    from g7_guard import G7Guard

    guard = G7Guard()

    new_questions = [...]   # generasiya edilmiş yeni suallar

    clean, report = guard.filter(new_questions, subject="Biologiya 7")

    print(report)           # neçəsi keçdi / rədd edildi
    # clean → baza inteqrasiya oluna biləcək təmiz suallar

─────────────────────────────────────────────────────────────────────────────
YOXLAMA MƏNTİQİ:
  ① META-ŞABLON — variantlarda/sualda prompt templateları aşkarlanır
  ② DUBLİKAT    — SHA-256 fingerprint bazası ilə eyni sual blokunur
  ③ FORMAT       — correctAnswer indeksinin options uzunluğuna uyğunluğu
  ④ MİNİMUM UZUNLUQ — sual mətni çox qısa (junk) ola bilməz
=============================================================================
"""

import json
import os
import hashlib
from datetime import datetime
from typing import List, Dict, Tuple, Optional

# ─── Fingerprint faylının yolu ─────────────────────────────────────────────
_DEFAULT_FP_PATH = os.path.join(
    os.path.dirname(__file__),
    'g7_question_fingerprints.json'
)

# ─── Meta-şablon əlamətləri ─────────────────────────────────────────────────
_META_OPTION_PHRASES = [
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
    "Kitab:.*Bölmə:.*Alt Mövzu:",    # regex-like kontrol aşağıda
]

_META_QUESTION_PHRASES = [
    "anlayışının ən sadə tərifi və ya nümunəsi hansıdır?",
    "fikirlərdən/texnikalardan hansı tamamilə doğrudur?",
    "(Səviyyə: Asan) Mövzu:",
    "(Səviyyə: Orta) Mövzu:",
    "(Səviyyə: Çətin) Mövzu:",
    "(Səviyyə: sadə) Mövzu:",
]

_MIN_QUESTION_LENGTH = 15   # xarakter


# ─── Fingerprint hesablaması ────────────────────────────────────────────────
def _fingerprint(question_text: str) -> str:
    normalized = " ".join(question_text.strip().lower().split())
    return hashlib.sha256(normalized.encode('utf-8')).hexdigest()


# ─── G7Guard Sinfi ─────────────────────────────────────────────────────────
class G7Guard:
    """
    Parametrlər:
        fp_path  — fingerprint json faylının yolu (default: qonşu g7_question_fingerprints.json)
        verbose  — True olduqda hər rədd edilən sual üçün log yazdırılır
    """

    def __init__(self, fp_path: Optional[str] = None, verbose: bool = False):
        self.fp_path = fp_path or _DEFAULT_FP_PATH
        self.verbose = verbose
        self._load_fingerprints()

    # ── Fingerprint Bazası ──────────────────────────────────────────────────
    def _load_fingerprints(self):
        if os.path.exists(self.fp_path):
            with open(self.fp_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
            self._fps: set = set(data.get('fingerprints', []))
        else:
            self._fps: set = set()

    def _save_fingerprints(self):
        payload = {
            'last_updated': datetime.now().isoformat(),
            'total': len(self._fps),
            'fingerprints': list(self._fps)
        }
        with open(self.fp_path, 'w', encoding='utf-8') as f:
            json.dump(payload, f, ensure_ascii=False, indent=2)

    @property
    def fingerprint_count(self) -> int:
        return len(self._fps)

    # ── Yoxlama Funksiyaları ────────────────────────────────────────────────
    def is_meta_template(self, q: dict) -> Tuple[bool, str]:
        """(is_bad, reason) qaytarır."""
        q_text = q.get('question', '')
        for phrase in _META_QUESTION_PHRASES:
            if phrase in q_text:
                return True, f"META_QUESTION: '{phrase[:40]}'"

        opts = q.get('options', [])
        opt_list = opts if isinstance(opts, list) else list(opts.values())
        for opt in opt_list:
            opt_str = str(opt)
            for phrase in _META_OPTION_PHRASES:
                if phrase in opt_str:
                    return True, f"META_OPTION: '{phrase[:40]}'"
        return False, ""

    def is_duplicate(self, q: dict) -> Tuple[bool, str]:
        """Sual mətni fingerprint bazasında artıq varsa True qaytarır."""
        q_text = q.get('question', '').strip()
        fp = _fingerprint(q_text)
        if fp in self._fps:
            return True, f"DUPLICATE: fp={fp[:16]}…"
        return False, ""

    def is_format_valid(self, q: dict) -> Tuple[bool, str]:
        """correctAnswer indeksi, variant sayı, sual uzunluğu yoxlaması."""
        q_text = q.get('question', '').strip()
        if len(q_text) < _MIN_QUESTION_LENGTH:
            return False, f"SHORT_QUESTION: len={len(q_text)}"

        opts = q.get('options', [])
        opt_list = opts if isinstance(opts, list) else list(opts.values())
        if len(opt_list) < 2:
            return False, f"TOO_FEW_OPTIONS: {len(opt_list)}"

        ans = q.get('correctAnswer', q.get('correct_answer', None))
        if isinstance(ans, int) and (ans < 0 or ans >= len(opt_list)):
            return False, f"INVALID_KEY: {ans} >= {len(opt_list)}"

        return True, ""

    # ── Əsas Filter Funksiyası ──────────────────────────────────────────────
    def filter(
        self,
        questions: List[dict],
        subject: str = "",
        commit_fingerprints: bool = True
    ) -> Tuple[List[dict], dict]:
        """
        Suallar siyahısını yoxlayır, keçənləri qaytarır.

        Qaytarır:
            (clean_list, report_dict)
              clean_list  — baza inteqrasiya oluna biləcək suallar
              report_dict — statistika və rədd edilmə səbəbləri
        """
        clean   : List[dict] = []
        rejected: List[dict] = []
        session_fps = set()

        stats = {
            'total_input':  len(questions),
            'passed':       0,
            'rejected_meta': 0,
            'rejected_dup':  0,
            'rejected_fmt':  0,
        }

        for q in questions:
            # ① Meta-şablon
            bad, reason = self.is_meta_template(q)
            if bad:
                stats['rejected_meta'] += 1
                rejected.append({'reason': reason, 'q': q.get('question', '')[:80]})
                if self.verbose:
                    print(f"  [RƏDD — META] {reason}")
                continue

            # ② Format
            valid, reason = self.is_format_valid(q)
            if not valid:
                stats['rejected_fmt'] += 1
                rejected.append({'reason': reason, 'q': q.get('question', '')[:80]})
                if self.verbose:
                    print(f"  [RƏDD — FORMAT] {reason}")
                continue

            # ③ Dublikat (qlobal + sessiya daxili)
            q_text = q.get('question', '').strip()
            fp = _fingerprint(q_text)
            dup_global  = fp in self._fps
            dup_session = fp in session_fps

            if dup_global or dup_session:
                stats['rejected_dup'] += 1
                rejected.append({'reason': 'DUPLICATE', 'q': q_text[:80]})
                if self.verbose:
                    print(f"  [RƏDD — DUP] {q_text[:60]}")
                continue

            # ✅ Keçdi
            session_fps.add(fp)
            clean.append(q)
            stats['passed'] += 1

        # Fingerprint bazasını yenilə
        if commit_fingerprints and clean:
            self._fps.update(session_fps)
            self._save_fingerprints()

        report = {
            'subject': subject,
            'timestamp': datetime.now().isoformat(),
            'stats': stats,
            'rejected_samples': rejected[:10]   # ilk 10 nümunə
        }

        return clean, report

    # ── Kolaylık metodu: direkt yoxla (inteqrasiya etmə) ───────────────────
    def check_only(self, questions: List[dict], subject: str = "") -> dict:
        """filter() çağırır, amma fingerprint bazasını yeniləmir."""
        _, report = self.filter(questions, subject, commit_fingerprints=False)
        return report


# ─── CLI Test Modu ──────────────────────────────────────────────────────────
if __name__ == '__main__':
    import sys
    sys.stdout.reconfigure(encoding='utf-8')

    print("=== G7Guard — Özünü Test Edir ===")
    guard = G7Guard(verbose=True)
    print(f"Mövcud fingerprint sayı: {guard.fingerprint_count}")

    # Nümunə: 1 meta, 1 normal, 1 gələcəkdə dublikat
    test_qs = [
        {
            "question": "Biologiyada 'Biologiya nəyi öyrənir' anlayışının ən sadə tərifi və ya nümunəsi hansıdır?",
            "options": ["Həqiqətə uyğun olmayan...", "Digər bir bioloji...", "Dərsliyin əsas mətnindən...", "Səslənişcə bənzər..."],
            "correctAnswer": 2
        },
        {
            "question": "Fotosentez prosesinin əsas məhsulu nədir?",
            "options": ["Karbon qazı", "Su", "Oksigen", "Azot"],
            "correctAnswer": 2
        },
        {
            "question": "Fotosentez prosesinin əsas məhsulu nədir?",   # ← dublikat
            "options": ["Karbon qazı", "Su", "Oksigen", "Azot"],
            "correctAnswer": 2
        },
    ]

    clean, report = guard.filter(test_qs, subject="Biologiya 7 Test")
    print(f"\nNəticə: {report['stats']}")
    print(f"Keçən suallar: {len(clean)}")
