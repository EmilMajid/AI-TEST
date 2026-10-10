# KAG Autonomous Candidate Miner & Falsifier — Contract V1 (Frozen v1.0)
**Sənəd Kodu:** `KAG-AUTONOMOUS-MINER-CONTRACT-V1-2026-10-09`  
**Status:** 🟢 **RATIFIED & FROZEN FOR RESEARCH**  
**Rejim:** STRICTLY READ-ONLY (Sıfır canlı istehsalat modifikasiyası)  
**Təyinat:** Offline Namizəd İstehsalı, Falsifikasiya və Sübut Auditi  

---

## 1. Giriş və Əsas Missiya

Bu müqavilə TestAI.az KAG (Knowledge Augmented Generation) sistemində önşərt (prerequisite) əlaqələrinin sayını genişləndirmək üçün **namizəd istehsalı və falsifikasiya standartını** rəsmiləşdirir.

### Əsas Fərq:
* **Namizəd yaratmaq $\neq$ Təkzib etməyə çalışmaq $\neq$ Qaydanın doğruluğunu sübut etmək.**
* Miner birbaşa `ACTIVE_GOLD` yaradan mühərrik deyil; o, **namizədləri yaradan, amansızcasına falsifikasiya edən və sübut çatışmazlığı olan hallarda dürüst şəkildə dayanan** oflayn tədqiqat alətidir.

---

## 2. On Dəyişməz İnvariant (10 Immutable Contract Invariants)

Bütün avtomatlaşdırılmış skriptlər, tədqiqat axınları və pilot testlər aşağıdakı 10 konstitusion invariantı pozulmaz qanun kimi qəbul edir:

1. **`Candidate generation != Gold activation.`**  
   Namizədin yaradılması heç bir halda onun qanuniləşməsi və ya aktivləşməsi demək deyil.
2. **`Mathematical equivalence != dependency direction.`**  
   Riyazi eynilik və ya çevrilmə ($A \iff B$) istiqaməti müəyyən etmir; asimmetrik idraki asılılıq ayrıca sübut tələb edir.
3. **`Grade direction is necessary, not sufficient.`**  
   $$\text{grade}(\text{source}) \le \text{grade}(\text{target}) \quad (\text{source}=\text{prerequisite}, \, \text{target}=\text{dependent})$$
   Bu şərt zəruri süzgəcdir, lakin əlaqənin özünü sübut etmir.
4. **`Dual-solver agreement != dependency proof.`**  
   Deterministik solver ilə LLM-in (və ya iki müstəqil modelin) eyni həll addımına gəlməsi müsbət namizəd siqnalıdır, lakin prerequisite sübutu deyil.
5. **`Suspicion score != proof status.`**  
   Şübhə indeksinin 0 olması yalnız insan araşdırmasının prioritetini müəyyən edir; sübut statusunu əvəz etmir.
6. **`Generated trace != source-grounded trace.`**  
   Modelin generasiya etdiyi həll addımları dərslikdə və ya rəsmi sənəddə olan faktiki müəllif izahı ilə eyniləşdirilə bilməz.
7. **`Curriculum precedence != prerequisite.`**  
   Dərslikdə və ya tədris planında $A$-nın $B$-dən əvvəl gəlməsi ($A \prec B$) kontekstdir, idraki zərurət sübutu deyil.
8. **`Missing or conflicting evidence => UNPROVEN.`**  
   Sübut çatışmazlığı, alternativ həll yolu və ya ziddiyyət aşkarlandıqda sistem dürüst şəkildə `UNPROVEN` statusunda dayanmalıdır.
9. **`No fallback to nearest topic, previous lesson, candidates[0], or cross-subject relations.`**  
   Heç bir heuristik və kor geriçəkilmə qəbul edilmir (`UNKNOWN > WRONG`).
10. **`The miner is strictly read-only:`**  
    Canlı kod bazasına (`lib/runtime-kag-guard.ts`), `data/grades/` fayllarına, aktiv registrə, Supabase-ə və ya mövcud 21 Gold qaydaya yazmaq qəti qadağandır.

---

## 3. Namizəd Statusları və Vəziyyət Sxemi (State Machine)

Miner tərəfindən istehsal edilən hər bir namizəd aşağıdakı ciddi təsnifatdan keçir:

```text
                  CANDIDATES_GENERATED
                           │
         ┌─────────────────┼─────────────────┐
         ▼                 ▼                 ▼
    [FALSIFIED]       [UNPROVEN]     [GUARD_REJECTED]
    • Alternativ yol  • Zəif sübut   • Strand pozuntusu
    • Topic collapse  • Seyrək fakt  • Grade tərsliyi
    • Constraint      • Qeyri-kafi   • Domain sızması
    • Xronologiya                    • Dövr (Cycle)
                           │
                           ▼ (Yalnız bütün qapılardan keçənlər)
                  [PROVEN_CANDIDATE]
               (Staging üçün ayrılmış)
                           │
                           ▼
                  NEW_ACTIVE_GOLD: 0
         (Phase 1-də avtomatik aktivləşmə = 0)
```

| Status | Tərifi | İstehsalat Təsiri |
| :--- | :--- | :--- |
| `CANDIDATES_GENERATED` | Xammal kimi generasiya edilmiş ilkin əlaqələr | Heç bir təsiri yoxdur |
| `FALSIFIED` | Red-Team tərəfindən təkzib edilmiş əlaqələr | Arxivləşdirilir, rədd səbəbi qeyd olunur |
| `UNPROVEN` | İddia məntiqli görünür, lakin formal sübutu çatmır | Backlog-da saxlanılır |
| `GUARD_REJECTED` | KAG Universal Guard baryerlərini keçməyənlər | Bloklanır |
| `PROVEN_CANDIDATE` | Falsifikasiyaya tab gətirmiş və sübutu tam olanlar | Oflayn staginq registrində saxlanılır |
| `NEW_ACTIVE_GOLD` | Canlı istehsalata qəbul edilən yeni qaydalar | **Faz 1-də DƏQİQ 0 (Qadağandır)** |

---

## 4. Üçqat Sübut Sinifləri (Three-Tier Proof Classes)

| Sübut Sinfi | Tərifi | Buraxılış Qaydası |
| :--- | :--- | :--- |
| **`FORMAL_PROOF`** | Asimmetrik istiqaməti təsdiqlənmiş dar formal riyazi/məntiqi əməliyyat qaydası | Bütün formal şərtlər və invariantlar ödəndikdə gələcəkdə avtomatik qəbul edilə bilər |
| **`SOURCE_GROUNDED_OPERATION`** | Dərslikdəki faktiki həll addımlarından (`SOURCE_GROUNDED_TRACE`) çıxarılan əməliyyat asılılığı | Yalnız diferensial build-time təsdiqi ilə qəbul edilə bilər |
| **`PEDAGOGICAL_INFERENCE`** | Modelin dərslik kontekstindən və ya izahlardan çıxardığı ümumi didaktik fərziyyə | **`ACTIVE_GOLD` üçün QƏTİ QADAĞANDIR** |

---

## 5. İcra Mərhələləri və Yol Xəritəsi

* **Mərhələ 01 (Cari):** `Contract V1` spesifikasiyasının dondurulması.
* **Mərhələ 02:** Riyaziyyatın 8–11-ci sinif cəbr və həndəsə məlumatları üzərində **Read-Only Data Auditi** (Standartlar, dərslik paraqrafları, sual izahlarının seyrəkliyi).
* **Mərhələ 03:** `Candidate Miner & Falsifier` pilotunun işə salınması (Namizədlərin falsifikasiyası və `UNPROVEN` dürüstlüyü).
* **Mərhələ 04:** Pilot hesabatı və nəticələrin birgə müzakirəsi.

---
**Qərar:** `Contract V1` spesifikasiyası donduruldu. Heç bir canlı istehsalat dəyişikliyinə icazə verilmir.
