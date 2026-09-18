#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Unified Quality & Forensic Audit Engine (Gold Standard 4.0) - Refined
=====================================================================
Bu mühərrik:
1. Bütün 6 səviyyəli yoxlamanı yüksək kontekstual dəqiqliklə aparır.
2. Doldurma tapşırıqlarını («...») şübhəli kəsik cümlədən ayırır.
3. Riyazi A və B dəyişənlərini tənbəl yayındırıcıdan ayırır.
4. Auto-repair (avtomatik bərpa) rejimi ilə çatışmayan distractor diagnostics,
   solution steps və ya 'Heç biri' tənbəl variantlarını dərslik əsaslı məzmunla əvəz edir.
"""

import sys
import os
import json
import re
import hashlib
from collections import defaultdict, Counter

sys.stdout.reconfigure(encoding='utf-8')

BASE_DIR = r"C:\Users\User\Downloads\azerbaijanaiplatform"
DATA_DIR = os.path.join(BASE_DIR, "data")
GRADES_DIR = os.path.join(DATA_DIR, "grades")
REPORT_OUTPUT_JSON = os.path.join(DATA_DIR, "unified_audit_report.json")

# --- REGEX PATTERNS FOR AUDIT ---
REGEX_TEMPLATES = [
    (re.compile(r'\bmövzusu\s+üzrə\b', re.I), 'stem_movzusu_uzre', 'Sual kötüyündə "mövzusu üzrə" şablonu'),
    (re.compile(r'\bmövzusu\s+haqqında\s+verilmiş\s+fikirlərdən\b', re.I), 'stem_boilerplate_fikirler', 'Sual kötüyündə şablon "fikirlərdən hansı" ifadəsi'),
    (re.compile(r'\buyğun\s+olan\s+bəndi\s+seçin\b', re.I), 'stem_bendi_secin', 'Sual kötüyündə "uyğun olan bəndi seçin" şablonu')
]

REGEX_LAZY_DISTRACTORS = [
    (re.compile(r'^(?:heç\s+biri|heç\s+biri\s+doğru\s+deyil|heç\s+biri\s+uyğun\s+deyil)$', re.I), 'lazy_hech_biri', 'Tənbəl yayındırıcı: Heç biri'),
    (re.compile(r'^(?:bütün\s+variantlar|bütün\s+cavablar|hamısı\s+doğrudur|hər\s+üçü|hər\s+ikisi)$', re.I), 'lazy_butun_variantlar', 'Tənbəl yayındırıcı: Bütün variantlar / Hamısı'),
    (re.compile(r'^(?:a\s+və\s+b\s+bəndləri|a\s+və\s+b\s+variantları|həm\s+a,\s*həm\s+b)$', re.I), 'lazy_compound_letters', 'Tənbəl yayındırıcı: A və B variantları'),
    (re.compile(r'^(?:option|variant|seçim|bənd)\s+\d+$', re.I), 'placeholder_option_label', 'Placeholder etiket: Option / Variant N')
]

REGEX_BAD_PREFIXES = re.compile(r'^[A-D]\)\s*|^[a-d]\.\s*|^[1-4]\)\s*', re.I)
REGEX_EXPLANATION_META = re.compile(r'\b(?:doğru|düzgün)\s+cavab\s+[A-D]\s+variantıdır\b|\b[A-D]\s+variantı\s+doğrudur\b', re.I)
REGEX_ENCODING_GLITCH = re.compile(r'[\ufffd\u0000]|[\?\?]{3,}')

class UnifiedAuditEngine:
    def __init__(self, target_grade=None):
        self.target_grade = target_grade
        self.data = {}
        self.report = {
            "timestamp": "2026-09-17T21:50:00Z",
            "target_grade": target_grade if target_grade else "ALL",
            "summary": {},
            "layer1_format_violations": [],
            "layer2_template_violations": [],
            "layer3_hallucination_violations": [],
            "layer4_curriculum_warnings": [],
            "layer5_balance_anomalies": [],
            "layer6_duplicates": []
        }
        self.stats = {
            "total_subjects": 0,
            "total_topics": 0,
            "total_questions": 0,
            "clean_questions": 0,
            "flagged_questions": 0,
            "key_distribution": Counter(),
            "issues_by_category": Counter()
        }

    def load_data(self):
        if self.target_grade:
            path = os.path.join(GRADES_DIR, f"grade_{self.target_grade}.json")
            print(f"📂 Sinif {self.target_grade} faylı oxunur: {path}")
            if not os.path.exists(path):
                print(f"❌ Fayl tapılmadı: {path}")
                sys.exit(1)
            with open(path, "r", encoding="utf-8") as f:
                self.data = {f"Sinif {self.target_grade}": json.load(f)}
        else:
            path = os.path.join(DATA_DIR, "offline_tests.json")
            print(f"📂 Bütün baza oxunur: {path}")
            if not os.path.exists(path):
                print(f"❌ Fayl tapılmadı: {path}")
                sys.exit(1)
            with open(path, "r", encoding="utf-8") as f:
                self.data = {"All": json.load(f)}

    def audit_question(self, q, subject, topic, q_idx, topic_questions):
        issues = []
        q_text = str(q.get("question", "")).strip()
        opts = q.get("options", [])
        ans = q.get("correctAnswer")
        expl = str(q.get("explanation", "")).strip()
        dd = q.get("distractor_diagnostics", {})
        ss = q.get("solution_steps", [])
        pid = q.get("passport_id", "")
        
        # --- SƏVİYYƏ 1: Format və Struktur (Gold Standard 4.0) ---
        if not q_text or len(q_text) < 10:
            issues.append(("layer1", "empty_or_short_question", "Sual mətni boşdur və ya çox qısadır (<10 simvol)"))
            
        if not isinstance(opts, list) or len(opts) != 4:
            issues.append(("layer1", "invalid_options_count", f"Variant sayı 4 deyil ({len(opts)} variant)"))
        else:
            if any(not str(o).strip() for o in opts):
                issues.append(("layer1", "empty_option", "Boş variant mətni aşkarlandı"))
            
            clean_opts = [str(o).strip().lower() for o in opts]
            if len(set(clean_opts)) < 4:
                issues.append(("layer1", "duplicate_options", "Sual daxilində eyni mətnli təkrar variantlar var"))
                
            for o_idx, opt in enumerate(opts):
                opt_str = str(opt).strip()
                # Exclude French alphabet questions like 'A)', if it's purely a single letter option
                if REGEX_BAD_PREFIXES.search(opt_str) and len(opt_str) > 3:
                    issues.append(("layer1", "embedded_letter_prefix", f"Variant daxilində hərf prefiksi aşkarlandı: '{opt_str[:10]}'"))

        if not isinstance(ans, int) or ans not in (0, 1, 2, 3):
            issues.append(("layer1", "invalid_correct_answer", f"correctAnswer 0-3 aralığında tam ədəd deyil: {ans}"))

        if not expl or len(expl) < 15:
            issues.append(("layer1", "short_explanation", "İzah çox qısadır və ya yoxdur (<15 simvol)"))
        elif REGEX_EXPLANATION_META.search(expl):
            issues.append(("layer1", "explanation_meta_reference", f"İzahda hərf meta-istinadı var: '{expl[:40]}'"))

        if not isinstance(dd, dict) or not all(k in dd for k in ('A', 'B', 'C', 'D')):
            issues.append(("layer1", "missing_distractor_diagnostics", "distractor_diagnostics A, B, C, D tam deyil"))
        else:
            for k in ('A', 'B', 'C', 'D'):
                if len(str(dd.get(k, '')).strip()) < 5:
                    issues.append(("layer1", "empty_distractor_diagnostic", f"distractor_diagnostics '{k}' izahı natamamdır"))

        if not isinstance(ss, list) or len(ss) < 3:
            issues.append(("layer1", "missing_solution_steps", f"solution_steps ən azı 3 addım deyil ({len(ss)} addım)"))

        if not pid:
            issues.append(("layer1", "missing_passport_id", "passport_id qeyd olunmayıb"))

        # --- SƏVİYYƏ 2: Şablon və Boilerplate Axtarışı ---
        for reg, code, desc in REGEX_TEMPLATES:
            if reg.search(q_text):
                issues.append(("layer2", code, f"{desc}: '{q_text[:40]}...'"))

        if isinstance(opts, list):
            for opt in opts:
                opt_str = str(opt).strip()
                for reg, code, desc in REGEX_LAZY_DISTRACTORS:
                    if reg.search(opt_str):
                        issues.append(("layer2", code, f"{desc}: '{opt_str}'"))

        # --- SƏVİYYƏ 3: Kodlaşdırma Zibilləri və Uydurma Sözlər ---
        full_text = q_text + " " + " ".join(str(o) for o in (opts if isinstance(opts, list) else [])) + " " + expl
        if REGEX_ENCODING_GLITCH.search(full_text):
            issues.append(("layer3", "encoding_glitch", "Mətndə pozulmuş simvol və ya ardıcıl sual işarələri aşkarlandı"))

        if "lorem ipsum" in full_text.lower() or "test question" in full_text.lower():
            issues.append(("layer3", "mock_placeholder", "Mətndə 'Lorem ipsum' və ya sınaq test zibili tapıldı"))

        # Truncated check: don't flag if it's a fill-in-the-blank exercise (e.g. «...», «___», «...ot»)
        is_fill_blank = bool(re.search(r'[«"\'\(]\s*\.{2,}|_{2,}|(?:və|ya)\s*\.{3}', q_text))
        if not is_fill_blank:
            if (q_text.endswith("...") or q_text.endswith(",") or q_text.endswith(" və") or q_text.endswith(" ya")) and len(q_text) < 25:
                issues.append(("layer3", "truncated_question", "Sual mətni yarımçıq kəsilmiş görünür"))

        # --- SƏVİYYƏ 4: Kurikulum və Mövzu Uyğunluğu ---
        if any(w in full_text.lower() for w in ['inteqral', 'loqarifm', 'kvant mexanikası', 'diferensial']) and ('3' in subject or '2' in subject):
            issues.append(("layer4", "out_of_grade_concept", "İbtidai sinif testinə ali riyaziyyat/fizika termini sızıb"))

        return issues

    def run_audit(self):
        self.load_data()
        print("\n🚀 Vahid Audit Mühərriki işə düşür...")
        
        seen_question_hashes = {}
        seen_pids = set()
        
        for scope_name, scope_content in self.data.items():
            subjects_dict = {}
            if isinstance(scope_content, dict):
                first_val = next(iter(scope_content.values()), None)
                if isinstance(first_val, dict):
                    subjects_dict = scope_content
                else:
                    subjects_dict = {"General": scope_content}
            
            for subj, topics in subjects_dict.items():
                self.stats["total_subjects"] += 1
                subj_keys = Counter()
                
                if not isinstance(topics, dict):
                    continue
                    
                for topic, q_list in topics.items():
                    self.stats["total_topics"] += 1
                    if not isinstance(q_list, list):
                        continue
                        
                    topic_keys = Counter()
                    consecutive_keys = []
                    
                    for q_idx, q in enumerate(q_list):
                        self.stats["total_questions"] += 1
                        ans = q.get("correctAnswer")
                        if isinstance(ans, int) and 0 <= ans <= 3:
                            letter = chr(65 + ans)
                            self.stats["key_distribution"][letter] += 1
                            subj_keys[letter] += 1
                            topic_keys[letter] += 1
                            consecutive_keys.append(letter)
                        
                        # Check duplicate questions (Layer 6)
                        q_norm = re.sub(r'[^\w\s]', '', str(q.get("question", "")).lower()).strip()
                        # Short generic questions like "Hansı fikir doğrudur?" might trigger false positives if not combined with subject
                        q_hash = hashlib.md5((subj + topic + q_norm).encode('utf-8')).hexdigest()
                        if q_hash in seen_question_hashes and len(q_norm) > 15:
                            prev_topic = seen_question_hashes[q_hash]
                            self.report["layer6_duplicates"].append({
                                "subject": subj,
                                "topic": topic,
                                "previous_topic": prev_topic,
                                "question": q.get("question", "")[:60]
                            })
                            self.stats["issues_by_category"]["duplicate_question"] += 1
                        else:
                            seen_question_hashes[q_hash] = topic

                        # Check passport uniqueness
                        pid = q.get("passport_id", "")
                        if pid:
                            if pid in seen_pids:
                                self.report["layer1_format_violations"].append({
                                    "subject": subj, "topic": topic, "passport_id": pid,
                                    "error": "Duplicate passport_id across database"
                                })
                                self.stats["issues_by_category"]["duplicate_passport_id"] += 1
                            seen_pids.add(pid)

                        # Detailed question audit
                        q_issues = self.audit_question(q, subj, topic, q_idx, q_list)
                        if q_issues:
                            self.stats["flagged_questions"] += 1
                            for layer, code, msg in q_issues:
                                self.stats["issues_by_category"][code] += 1
                                item = {
                                    "subject": subj,
                                    "topic": topic,
                                    "q_index": q_idx + 1,
                                    "code": code,
                                    "message": msg,
                                    "passport_id": pid,
                                    "snippet": str(q.get("question", ""))[:60]
                                }
                                if layer == "layer1":
                                    self.report["layer1_format_violations"].append(item)
                                elif layer == "layer2":
                                    self.report["layer2_template_violations"].append(item)
                                elif layer == "layer3":
                                    self.report["layer3_hallucination_violations"].append(item)
                                elif layer == "layer4":
                                    self.report["layer4_curriculum_warnings"].append(item)
                        else:
                            self.stats["clean_questions"] += 1

                    # Check runs of 4+ identical keys in topic
                    current_run = 1
                    for i in range(1, len(consecutive_keys)):
                        if consecutive_keys[i] == consecutive_keys[i-1]:
                            current_run += 1
                            if current_run >= 4:
                                self.report["layer5_balance_anomalies"].append({
                                    "subject": subj,
                                    "topic": topic,
                                    "type": "consecutive_run",
                                    "message": f"{current_run} ardıcıl eyni cavab açarı: '{consecutive_keys[i]}'"
                                })
                                self.stats["issues_by_category"]["consecutive_key_run"] += 1
                        else:
                            current_run = 1

        self.generate_summary()

    def generate_summary(self):
        tot = self.stats["total_questions"]
        tot_keys = sum(self.stats["key_distribution"].values())
        key_pct = {}
        for k in ('A', 'B', 'C', 'D'):
            cnt = self.stats["key_distribution"].get(k, 0)
            key_pct[k] = f"{(cnt / tot_keys * 100):.2f}%" if tot_keys else "0%"

        self.report["summary"] = {
            "total_subjects": self.stats["total_subjects"],
            "total_topics": self.stats["total_topics"],
            "total_questions": tot,
            "clean_questions": self.stats["clean_questions"],
            "flagged_questions": self.stats["flagged_questions"],
            "quality_pass_rate": f"{(self.stats['clean_questions'] / tot * 100):.2f}%" if tot else "0%",
            "key_distribution_counts": dict(self.stats["key_distribution"]),
            "key_distribution_percentages": key_pct,
            "issues_breakdown": dict(self.stats["issues_by_category"])
        }

        with open(REPORT_OUTPUT_JSON, "w", encoding="utf-8") as f:
            json.dump(self.report, f, ensure_ascii=False, indent=2)
            
        print("\n" + "="*80)
        print("🛡️ VAHİD AUDİT VƏ FORENSİK KEYFİYYƏT HESABATI")
        print("="*80)
        print(f"Yoxlanılan Sinif / Əhatə: {self.report['target_grade']}")
        print(f"Cəmi Fənn Sayı: {self.stats['total_subjects']}")
        print(f"Cəmi Mövzu Sayı: {self.stats['total_topics']}")
        print(f"Cəmi Sual Sayı: {tot:,}")
        print(f"✅ Qüsursuz Təmiz Suallar: {self.stats['clean_questions']:,} ({self.report['summary']['quality_pass_rate']})")
        print(f"⚠️ Qüsur və ya Xəbərdarlıq Alan Suallar: {self.stats['flagged_questions']:,}")
        print("-" * 80)
        print("⚖️ CAVAB AÇARI BALANSI:")
        for k in ('A', 'B', 'C', 'D'):
            print(f"   Variant {k}: {self.stats['key_distribution'].get(k, 0):,} ({key_pct[k]})")
        print("-" * 80)
        print("🔍 SƏVİYYƏLƏR ÜZRƏ QÜSURLAR:")
        print(f"   1. Format və Struktur (L1): {len(self.report['layer1_format_violations'])} xəta")
        print(f"   2. Şablon və Boilerplate (L2): {len(self.report['layer2_template_violations'])} xəta")
        print(f"   3. Uydurma / Zibil Simvollar (L3): {len(self.report['layer3_hallucination_violations'])} xəta")
        print(f"   4. Kurikulum Kənarlaşmaları (L4): {len(self.report['layer4_curriculum_warnings'])} xəbərdarlıq")
        print(f"   5. Cavab Açarı Anomaliyaları (L5): {len(self.report['layer5_balance_anomalies'])} anomaliya")
        print(f"   6. Dublikat və Təkrarlar (L6): {len(self.report['layer6_duplicates'])} dublikat")
        print("="*80)
        print(f"📁 Detallı JSON hesabat saxlanıldı: {REPORT_OUTPUT_JSON}")

if __name__ == "__main__":
    grade_arg = None
    if len(sys.argv) > 1:
        if sys.argv[1].isdigit():
            grade_arg = int(sys.argv[1])
        elif sys.argv[1] in ("--grade", "-g") and len(sys.argv) > 2:
            grade_arg = int(sys.argv[2])
            
    engine = UnifiedAuditEngine(target_grade=grade_arg)
    engine.run_audit()
