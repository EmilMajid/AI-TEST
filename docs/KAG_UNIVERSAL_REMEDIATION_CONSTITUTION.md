# KAG Universal Remediation Engine — Konstitusiya və Təhlükəsizlik Arxitekturası
**TestAI.az / Milli AI Platforması — Rəsmi Arxitektura Sənədi**
**Status:** FROZEN & RATIFIED
**Versiya:** 1.0 (CF-V1 + AG-V1 + UASH-V1)

---

## 1. Əsas Konstitusion Prinsiplər

1. **`UNKNOWN > WRONG`**:
   Sübut olunmayan heç bir əlaqə `ACTIVE` ola bilməz. Təsdiqlənməmiş ehtimal təqdim etməkdənsə, heç bir xəritələmə etməmək (`NO_VALIDATED_PREREQUISITE`) sistemin normal və dürüst nəticəsidir.
2. **`RULES ARE DOMAIN-SPECIFIC. PROOF STANDARD IS UNIVERSAL.`**:
   Qaydalar fənnə, bilik sahəsinə və arxetipə görə dəyişə bilər. Lakin hər hansı dependency-nin `ACTIVE` Gold Edge statusu alması üçün tələb olunan 7 pilləli təhlükəsizlik qapısı bütün 14 fənn üçün mütləq və dəyişməzdir.
3. **KAG "Ən yaxın bilik" axtarmır:**
   KAG "ən oxşar mövzu", "əvvəlki dərs" və ya "leksik ən yaxın söz" axtarmır. Yalnız və yalnız sübut olunmuş `PREREQUISITE_OF` bağını izləyir.
4. **Qəti Qadağan Olunan Fallback-lar:**
   `candidates[0]`, `previous_lesson`, `nearest_topic`, `same_strand_fallback`, `cross_subject_fallback` və onların bütün ekvivalentləri istehsalatda qəti qadağandır (`STRICT_INVARIANT_VIOLATION`).

---

## 2. Üç Qrafın Ayrılması (Decoupled Reference Modeli)

Sistem üç ayrı qatı bir-birinə qarışdırmadan saxlayır:

```text
1. Curriculum Graph (İnzibati / Dərslik Naviqasiyası)
   Grade -> Subject -> Strand -> Topic
   (Dərslikdə əvvəl gəlmək != Prerequisite)

2. Knowledge Dependency Graph (Konseptual Asılılıq)
   Prerequisite Concept -> PREREQUISITE_OF -> Dependent Concept
   (Yalnız zəruri öyrənmə önşərtləri)

3. Student Diagnostic Graph (Şagird Performansı / Səhv Modeli)
   Answer State -> Observed Error -> Misconception Hypothesis
   (Səhv cavab və ya cavabsızlıq qrafda yeni edge yaratmır)
```

---

## 3. Asılılıq Arxetipləri (Dependency Archetypes)

Hər bir potensial əlaqə əvvəlcə arxetip səviyyəsində təsnif edilir:

| Arxetip | Təsviri | `PREREQUISITE_OF` Namizədi? | AUTO-GOLD Statusu |
|---|---|:---:|:---:|
| **Operational** | $B$ əməliyyatının icrası $A$ olmadan qeyri-mümkündür. | **BƏLİ** | `PROOF_CLASS_A` ilə `ACTIVE` |
| **Definitional / Structural** | $B$-nin formal tərifi birbaşa $A$-nın üzərində qurulub. | **BƏLİ** | `PROOF_CLASS_A` ilə `ACTIVE` |
| **Contextual / Chronological** | $A$ və $B$ tarixi/xronoloji səbəb-nəticədir. | **XEYR** | `REJECTED` (V1 Remediation-a buraxılmır) |
| **Taxonomic / Associative** | $A$ və $B$ eyni təsnifat sahəsindədir (məs: Məməlilər $\leftrightarrow$ Quşlar). | **XEYR** | `NO_VALIDATED_PREREQUISITE` |

---

## 4. Constraint vs Prerequisite Ayrımı

* **Constraint (Məhdudiyyət Şərti):** Əməliyyatın riyazi/fiziki qüvvədə olma şərtidir (Məsələn, $f \circ g$ üçün domain-range uyğunluğu, $F=ma$ üçün $m > 0$). Bu şərtlər **Constraint Engine** tərəfindən yoxlanır və **heç vaxt remediation prerequisite edge yaratmır**.
* **Prerequisite (Öyrənmə Önşərti):** Şagirdin həmin əməliyyatı yerinə yetirə bilməsi üçün əvvəlcədən mənimsəməli olduğu zəruri bilik vahididir.

---

## 5. Universal İcra Qərar Ağacı (Production Decision Tree)

```text
[Tələbənin Sualla Qarşılıqlı Əlaqəsi]
             │
             ├── UNANSWERED ─────────────────────► Status: NOT_REQUESTED
             │                                     (Spekulyativ diaqnoz qadağandır)
             │
             └── WRONG_WITH_OPTION
                   │
                   ▼
     1. Assessment Concept Resolved?
       ├── XEYR ─────────────────────────────────► Status: CONCEPT_UNRESOLVED
       │
       └── BƏLİ
             │
             ▼
     2. Active Dependency Rule Varmı?
       ├── XEYR ─────────────────────────────────► Status: NO_VALIDATED_PREREQUISITE
       │
       └── BƏLİ
             │
             ▼
     3. Candidate Edge Yaranırmı?
       ├── XEYR ─────────────────────────────────► Status: NO_VALIDATED_PREREQUISITE
       │
       └── BƏLİ
             │
             ▼
     4. Dependency Evidence Varmı?
       ├── XEYR ─────────────────────────────────► Status: NO_VALIDATED_PREREQUISITE
       │
       └── BƏLİ
             │
             ▼
     5. Proof Class == PROOF_CLASS_A?
       ├── XEYR (Class B / C) ───────────────────► Status: NO_VALIDATED_PREREQUISITE (Unverified)
       │
       └── BƏLİ
             │
             ▼
     6. Bütün Guards Keçirmi? (Domain, Strand, Grade Direction, Archetype)
       ├── XEYR (Pozuntu var) ───────────────────► Status: REJECTED (Audit/Negative Registry)
       │
       └── BƏLİ
             │
             ▼
     7. STATUS: REMEDIATION_READY
        (Dəqiq Kök Dərslik + Mövzu + SİTG Deterministik Vaxt Qaydası)
```

---

## 6. SİTG Standartı ilə Harmonizasiya (Vaxt və UI Müqaviləsi)

Remediation yalnız `REMEDIATION_READY` olduqda Blum taksonomiyası üzrə deterministik müddət təyin edilir:
- **Bilik / Anlama:** 10 dəqiqə
- **Tətbiq:** 15 dəqiqə
- **Təhlil:** 20 dəqiqə

İstifadəçi interfeysində dürüstlük prinsipi:
- `REMEDIATION_READY` $\rightarrow$ 🎯 10/15/20 Dəqiqəlik Valideyn Bərpa Bələdçisi (KAG).
- `NO_VALIDATED_PREREQUISITE` $\rightarrow$ ℹ️ Cari Mövzu İcmalı ("Əvvəlki siniflərdən təsdiqlənmiş zəncirvari boşluq qeydə alınmadı. Cari dərslikdəki nümunələrin təkrarı tövsiyə olunur").
- `NOT_REQUESTED` (Unanswered) $\rightarrow$ ⏱️ Cavablandırılmayıb ("Konkret bilik boşluğu qeydə alınmadı").

---

## 7. Universal Adversarial Safety Harness (56 Testlik Fail-Fast Şəbəkəsi)

Hər bir fənn üçün 4 zəhərli sinif (14 fənn $\times$ 4 = 56 test):
1. **Class A (False Prerequisite):** Məntiqli görünən, lakin önşərt olmayan əlaqə (Məs: *WWI $\rightarrow$ AXC*).
2. **Class B (Cross-Strand Trap):** Eyni fənn daxilində fərqli məzmun xəttinə sızma (Məs: *Funksiya $\rightarrow$ Həndəsə*).
3. **Class C (Cross-Subject Trap):** Başqa fəndən leksik sızma (Məs: *İnformatika fayl $\rightarrow$ Coğrafiya fay*).
4. **Class D (No-Proof Case):** Sübut olmayan halda dürüst dayanma (Məs: *Dalğaların interferensiyası $\rightarrow$ qayıtması*).

**CI/CD Qaydası:** Əgər testlərin 1 dənəsi belə gözlənilmədən `ACTIVE` alarsa $\rightarrow$ **Build uğursuz olur (Exit Code 1), istehsalata buraxılış dərhal bloklanır.**

---

## 8. Tarixi Düzəlişlər və Reyesterlər

- `scripts/heal_math11_vector_prerequisites.py` vasitəsilə 11-ci sinif Riyaziyyat bazasındakı 16 mövzu (240 sual) üzrə "Vektor" xətası tam təmizlənmiş, rəsmi 10-cu və 7-ci sinif kökləri bərpa edilmişdir.
- `data/ontology/adversarial_safety_corpus_20.json` ilk 20 sınaq korpusunu saxlayır.
- `scripts/test_safety_harness_runner.py` avtomatlaşdırılmış test icraçısıdır (20/20 PASS).
