# KAG Autonomous Gold Expansion & Falsifier — Master Konsolidasiya və Yaddaş Sənədi (V1.0)
**Tarix:** 2026-10-09  
**Status:** DONDURULMUŞ / RATIFIED  
**Məqsəd:** Çat tarixçəsinin və uzun müzakirələrin itməməsi, əldə edilmiş konsensusların və audit sübutlarının daimi qorunması.

---

## 1. İlkin Tələb və Strateji Çərçivə
* **İlkin Tələb:** 21 `ACTIVE_GOLD` qaydasının sayını bütün 11 sinif və 14 fənn üzrə insan iştirakı olmadan artırmaq təklifi.
* **Qəbul Edilən Fundamental Mövqe:** 
  * 🟡 **GO for Research & Offline Mining** / 🔴 **NO-GO for Automatic Production Activation**.
  * Avtonom agent namizəd tapa və falsifikasiya edə bilər, lakin **istehsalatda avtomatik Gold yarada bilməz**.
  * `NEW_ACTIVE_GOLD: 0` invaryantı tam qorunur (21 Gold qaydası toxunulmazdır).

---

## 2. Ratifikasiya Edilmiş Əsas Qanunlar və Müqavilələr

### A. KAG Contract V1 (10 Dəyişməz İnvaryant)
1. `Candidate generation != Gold activation`
2. `Mathematical equivalence != dependency direction` ($A \iff B \not\implies A \to B$)
3. `Grade direction is necessary, not sufficient` ($\text{grade}(source) \le \text{grade}(target)$)
4. `Dual-solver agreement != dependency proof` (Ortaq kor nöqtə riski)
5. `Suspicion score != proof status`
6. `Generated trace != source-grounded trace`
7. `Curriculum precedence != prerequisite` (Dərslik sırası önşərt sübutu deyil)
8. `Missing or conflicting evidence => UNPROVEN`
9. `No fallback to nearest topic, previous lesson, candidates[0], or cross-subject relations`
10. `The miner is strictly read-only` (Runtime, DB və ya istehsal fayllarına yazı qadağandır)

### B. KAG Falsifikasiya və Sübut Protokolu (Dörd Ontoloji Qat)
1. **Riyazi Əməliyyat Qaydası (`SUPPORTED_OPERATION`):** Məs: Bərabərsizliyi mənfiyə vurma (`MULTIPLY_BY_NEGATIVE_FLIPS_INEQUALITY`), ortaq məxrəcə gətirmə. *Prerequisite deyil, əməliyyat alətidir.*
2. **Riyazi Məhdudiyyət Şərti (`MATHEMATICAL_CONSTRAINT`):** Məs: $D < 0$, məxrəc $\neq 0$. *Konstitusiya Maddə 6: Constraint != Prerequisite. Önşərt kənarı yarada bilməz.*
3. **Şagird Səhv Modeli (`STUDENT_DIAGNOSTIC_GRAPH`):** Məs: Toplananların ixtisarı xətası. *Konstitusiya Maddə 5: Diagnostic Graph != Knowledge Graph. Önşərt deyil.*
4. **Zəruri Öyrənmə Önşərti (`EPISTEMIC_PREREQUISITE`):** *Falsification Survived $\neq$ Prerequisite Proof.* Yalnız insan ekspertin təsdiqindən (`HUMAN_VALIDATED_PREREQUISITE`) sonra Gold statusu ala bilər.

---

## 3. Mərhələ 02: Riyaziyyat Məlumat Bazası Dərin Auditi (4,210 Sual)

### A. Sahələrin Dəqiq Vəziyyəti
* **8-ci sinif (2,305 sual):** `solution_steps` sahəsi mövcuddur, lakin 100%-i sintetik şablondur (`TEMPLATE`). Real hesablama zənciri yoxdur.
* **9–11-ci siniflər (1,905 sual):** `solution_steps` sahəsi yoxdur; izahlar `explanation`/`izah` sahələrindədir.
* **Birləşdirilmiş Təsnifat (Cəmi 4,210 sual):**
  * `TEMPLATE`: 2,424 sual (57.58%) — 2,305 (Gr8) + 119 (Gr9)
  * `OPERATIONAL_TRACE`: 845 sual (20.07%) — Gr9: 632, Gr10: 98, Gr11: 115
  * `FORMULA_REFERENCE`: 706 sual (16.77%)
  * `AMBIGUOUS`: 233 sual (5.53%)
  * `REASONED_EXPLANATION`: 2 sual (0.05%)
* **845 Sualın Epistemik Hökmü:** Bu suallar avtomatik sübut deyil, yalnız **namizəd axtarış sahəsidir (Candidate Search Zone)**.
* **`standard_code` Boşluğu:** Suallarda rəsmi kurikulum standart kodları yoxdur; əlaqələr yalnız mövzu adları ilədir.

---

## 4. Mərhələ 03: İki Dar Pilot Sınağının Yekun Nəticələri

### A. Pilot 1: Kvadrat Bərabərsizliklər (Mövzu 34, 15 Sual: `900496`–`900510`)
* `CAND-QUAD-01` (Köklər $\to$ İntervallar): **`HOLD / SCOPED CANDIDATE`** ($D > 0$ dar şərti; $D \le 0$ üçün keçərsizdir).
* `CAND-QUAD-02` ($D < 0$ $\to$ Parametrik bərabərsizlik): **`REJECTED (CONSTRAINT)`** ($D < 0$ parametr şərtidir).
* `CAND-QUAD-03` (Modul $\to$ Kvadrat bərabərsizlik): **`REJECTED (ALTERNATIVE_PATH)`** (Çoxhədli açılışı modulu kənarlaşdırır).
* `CAND-QUAD-04` (Xətti sistem $\to$ Kvadrat sistem): **`UNPROVEN`** (Kəsişmə əməliyyatdır; xətti sistemlər nəzəriyyəsi önşərt kimi sübut olunmayıb).
* `CAND-QUAD-05` ($-1$-ə vurma $\to$ İşarə dəyişməsi): **`SUPPORTED_OPERATION`** (Parabola alternativi var; zərurilik sübut olunmayıb).

### B. Pilot 2: Rasional Kəsrlər (243 Sualın Semantik Ayrılması)
* **Semantik Audit Nəticəsi:**
  * `IN_SCOPE`: **141 sual** (Təmiz 8-ci sinif çoxhədli kəsrləri, ixtisar, ortaq məxrəc).
  * `OUT_OF_SCOPE`: **87 sual** (İrrasional köklər, Viyet düsturu $\frac{1}{x_1}+\frac{1}{x_2}$, funksiya təyin oblastı).
  * `NEEDS_REVIEW`: **15 sual**.
* **Hökm Reyestri:**
  * `CAND-RAT-01` (Vuruqlara ayırma $\to$ İxtisar): **`HOLD / SCOPED CANDIDATE`** (Dərəcəsi $\ge 2$ olan çoxhədlilər üçün; polinomial bölmə alternatividir; insan təsdiqi gözləyir).
  * `CAND-RAT-02` (Məxrəc $\neq 0$ $\to$ Kəsr əməlləri): **`REJECTED (CONSTRAINT)`** (Sıfıra bölmə qadağası təyin oblastı məhdudiyyətidir).
  * `CAND-RAT-03` (Ortaq məxrəc / ƏKOB $\to$ Toplama): **`SUPPORTED_OPERATION / UNPROVEN`** (Cəbri alqoritmdir; 5-ci sinif ƏKOB-un müstəqil önşərt olması sübut olunmayıb).
  * `CAND-RAT-04` (Toplananların ixtisarı xətası): **`STUDENT_DIAGNOSTIC_GRAPH`** (Diaqnostik anti-pattern; KG önşərti deyil).

---

## 5. Sistem və Fayl İzlənməsi (Traceability)

Bütün yaradılmış və dondurulmuş sənədlər:
1. `docs/KAG_AUTONOMOUS_MINER_CONTRACT_V1.md` — Müqavilə və 10 invaryant.
2. `docs/KAG_FALSIFICATION_AND_PROOF_PROTOCOL.md` — Falsifikasiya və sübut protokolu.
3. `docs/KAG_AUTONOMOUS_MINING_SYNTHESIS_AND_HISTORY.md` — Bu master konsolidasiya sənədi.
4. `reports/KAG_PHASE2_MATH_DATA_AUDIT_REPORT.md` — 4,210 riyaziyyat sualının dərin auditi.
5. `reports/KAG_PHASE2_DEEP_VERIFICATION_EVIDENCE.json` — 15 əl yoxlaması nümunəsi və 5 Gold xəritəsi.
6. `reports/quadratic_inequalities_pilot_dataset.json` — Kvadrat bərabərsizlik sualları (68 sual, 15 Mövzu 34 sualı).
7. `reports/rational_fractions_pilot_dataset.json` — Rasional kəsrlər ilkin axtarışı (243 sual).
8. `reports/rational_fractions_scoped_audit.json` — 243 sualın semantik audit nəticəsi (141 IN_SCOPE, 87 OUT_OF_SCOPE, 15 NEEDS_REVIEW).
9. `reports/offline_candidate_staging.json` — Bütün pilot nəticələrinin dondurulmuş reyestri.
10. `scripts/falsifier_quad_inequalities.py` — Kvadrat bərabərsizliklər falsifikasiya mühərriki.
11. `scripts/falsifier_rational_fractions.py` — Rasional kəsrlər falsifikasiya mühərriki.

**İstehsalat Təsiri:** `NEW_ACTIVE_GOLD: 0`, mövcud 21 Gold qaydası və `lib/runtime-kag-guard.ts` tam toxunulmazdır.
