# KAG Falsifikasiya və Epistemik Sübut Protokolu (V1.0)
**Status:** RATIFIED PROTOCOL  
**İstehsalat Təsiri:** READ-ONLY / ZERO MUTATION (`NEW_ACTIVE_GOLD: 0`)  
**Tarix:** 2026-10-09  

---

## 1. Əsas Qanun (Foundational Axiom)
> **Falsifikasiyadan Sağ Çıxmaq (Falsification Survived) $\neq$ Zəruri Öyrənmə Önşərti (Prerequisite Proof).**
> Falsifier-in alternativ həll yolu tapmaması və ya əks-nümunə aşkar etməməsi iddianın doğruluğunu və ya tədris zəruriliyini avtomatik sübut etmir.

---

## 2. Ontoloji Kateqoriyaların Tam Ayrılması

KAG sistemində hər hansı namizəd iddia aşağıdakı 4 kateqoriyadan yalnız birinə aid edilə bilər:

1. **Riyazi Əməliyyat Qaydası (`SUPPORTED_OPERATION`):**
   * Məsələn: Bərabərsizliyi mənfi ədədə vurduqda işarənin dəyişməsi (`MULTIPLY_BY_NEGATIVE_FLIPS_INEQUALITY`), kəsrləri ortaq məxrəcə gətirmə alqoritmi (`COMMON_DENOMINATOR_EXPANSION`).
   * *Status:* Qayda kimi doğrudur, lakin **Önşərt (Prerequisite) deyil**. Şagird başqa üsulla (parabola, sınaq nöqtəsi) həll edə bilər.

2. **Riyazi Məhdudiyyət Şərti (`MATHEMATICAL_CONSTRAINT`):**
   * Məsələn: Diskriminantın işarəsi ($D < 0$), Məxrəcin sıfırdan fərqli olması ($Q(x) \neq 0$).
   * *Status:* Konstitusiyanın 6-cı maddəsinə əsasən **`Constraint != Prerequisite`**. Bu, bilik qrafında əlaqə yarada bilməz (`REJECTED`).

3. **Şagird Səhv Modeli (`STUDENT_DIAGNOSTIC_GRAPH`):**
   * Məsələn: Kəsrdə toplananların ixtisarı xətası ($\frac{x+2}{x+3} \rightarrow \frac{2}{3}$).
   * *Status:* Konstitusiyanın 5-ci maddəsinə əsasən **`Curriculum Graph != Knowledge Graph != Student Diagnostic Graph`**. Bilik qrafına deyil, yalnız diaqnostik xəta ağacına aiddir (`REJECTED from KG`).

### B. Status Sahələri və Rəsmi Enum-lar

1. **`claim_type`:** `EPISTEMIC_PREREQUISITE` | `SUPPORTED_OPERATION` | `MATHEMATICAL_CONSTRAINT` | `STUDENT_DIAGNOSTIC_GRAPH` | `ALTERNATIVE_PATH`
2. **`scope_status`:** 
   * `SCOPED` — Riyazi tətbiq sərhədi açıq şəkildə müəyyən edilmiş (məs: $D > 0$, dərəcəsi $\ge 2$).
   * `UNSCOPED` — Ümumi iddia irəli sürülüb, lakin sərhədlər hələ daraldılmayıb və ya qeyri-müəyyəndir.
   * `GENERAL` — Bütün sahə üçün ümumi tətbiq olunan əməliyyat aləti.
   * `NOT_APPLICABLE` — Önşərt olmayan hallar (Constraint, Misconception).
3. **`falsification_status`:** `FALSIFICATION_SURVIVED` | `REJECTED` | `UNPROVEN`
4. **`human_validation_status`:** `PENDING` | `REJECTED` | `VALIDATED`
5. **`production_status`:** `INACTIVE` (Bütün qeyri-gold namizədlər üçün məcburidir)

> [!IMPORTANT]
> **`REJECTED` Termininin Epistemik Mənası:**
> Namizədin `REJECTED` alması həmin riyazi qaydanın, faktın və ya teoremin riyazi cəhətdən səhv olması demək DEYİLDİR (məsələn, $D < 0$ və ya məxrəc $\neq 0$ riyazi həqiqətlərdir). Bu hökm sırf **"bu anlayış hədəf anlayış üçün zəruri PREREQUISITE_OF əlaqəsi deyildir və Knowledge Graph-da önşərt kənarı yarada bilməz"** deməkdir.

---

## 3. İki Mərhələli Namizəd Status Pilləsi

Köhnə və aldadıcı `PROVEN_CANDIDATE` statusu ləğv edilir. Əvəzində 3 dəqiq mərhələ müəyyən edilir:

```
[Namizəd İddia]
       │
       ▼
[Falsifier Sınaqları: Test A, B, C, D, E]
       │
       ├── Əks-nümunə / Alternativ yol tapıldı ──► REJECTED / UNPROVEN
       ├── Məhdudiyyət / Səhv modeli qarışdırılıb ──► REJECTED (Constraint / Misconception)
       └── Sınaqlardan sağ çıxdı ──────────────────► FALSIFICATION_SURVIVED (və ya HOLD / SCOPED CANDIDATE)
                                                               │
                                                               ▼
                                              [İnsan Ekspert Təsdiqi]
                                                               │
                                                               └──► HUMAN_VALIDATED_PREREQUISITE
                                                                           │
                                                                           └──► (Yalnız xüsusi qərarla) ACTIVE_GOLD
```

* **`FALSIFICATION_SURVIVED`:** Avtomatlaşdırılmış sınaqlarda əks-nümunə tapılmayıb. İstehsalata keçid qadağandır.
* **`HOLD / SCOPED CANDIDATE`:** Əlaqə yalnız dar şərt daxilində (məsələn, $D > 0$, dərəcəsi $\ge 2$ olan çoxhədlilər) işləyir.
* **`HUMAN_VALIDATED_PREREQUISITE`:** Metodoloji zərurilik ekspert tərəfindən sübut edilib və imzalanıb.

---

## 4. İki Pilotun Yekun Hökm Reyestri

| ID | Sahə | İddia Edilən Əlaqə | Kateqoriya | Yekun Hökm | Pedaqoji / Epistemik Əsaslandırma |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `CAND-QUAD-01` | Kvadrat bərabərsizliklər | Köklər $\rightarrow$ İntervallar üsulu | Öyrənmə Önşərti | `HOLD / SCOPED CANDIDATE` | $D > 0$ olduqda köklər intervalları bölür. $D \le 0$ üçün tətbiq edilmir. Ümumi önşərt sübut olunmayıb. |
| `CAND-QUAD-02` | Kvadrat bərabərsizliklər | $D < 0$ $\rightarrow$ Parametrik bərabərsizlik | Məhdudiyyət | `REJECTED (CONSTRAINT)` | $D < 0$ parametr şərtidir; bilik düyünü deyil. |
| `CAND-QUAD-03` | Kvadrat bərabərsizliklər | Modul $\rightarrow$ Kvadrat bərabərsizlik | Alternativ Yol | `REJECTED (ALTERNATIVE_PATH)` | Standart çoxhədli açılışı modul nəzəriyyəsini kənarlaşdırır. |
| `CAND-QUAD-04` | Kvadrat bərabərsizliklər | Xətti sistem $\rightarrow$ Kvadrat sistem | Əməliyyat Qaydası | `UNPROVEN` | Aralıqların kəsişməsi ortaq alətdir; xətti sistemlər nəzəriyyəsinin müstəqil önşərt olduğu sübut olunmayıb. |
| `CAND-QUAD-05` | Kvadrat bərabərsizliklər | $-1$-ə vurma $\rightarrow$ İşarə dəyişməsi | Əməliyyat Qaydası | `SUPPORTED_OPERATION` | `MULTIPLY_BY_NEGATIVE_FLIPS_INEQUALITY` əməliyyat qaydasıdır. Parabola ilə həll alternativdir. |
| `CAND-RAT-01` | Rasional kəsrlər | Vuruqlara ayırma $\rightarrow$ İxtisar | Öyrənmə Önşərti | `HOLD / SCOPED CANDIDATE` | Dərəcəsi $\ge 2$ olan çoxhədlilərdə ortaq vuruğu tapmaq üçün zəruridir. Polinomial bölmə alternatividir. |
| `CAND-RAT-02` | Rasional kəsrlər | Məxrəc $\neq 0$ $\rightarrow$ Əməllər | Məhdudiyyət | `REJECTED (CONSTRAINT)` | Sıfıra bölmənin qadağası təyin oblastı məhdudiyyətidir. Önşərt yarada bilməz. |
| `CAND-RAT-03` | Rasional kəsrlər | Ortaq məxrəc (ƏKOB) $\rightarrow$ Toplama | Əməliyyat Qaydası | `SUPPORTED_OPERATION / UNPROVEN` | Ortaq məxrəc cəbri alqoritmdir. 5-ci sinif ədədi ƏKOB-un cəbr üçün müstəqil önşərt olması sübut edilməyib. |
| `CAND-RAT-04` | Rasional kəsrlər | Toplananların ixtisarı xətası | Səhv Modeli | `STUDENT_DIAGNOSTIC_GRAPH` | Diaqnostik xəta modelidir; Knowledge Graph-da önşərt kənarı yarada bilməz. |

---

## 5. İstehsalat Zəmanəti
* **Aktiv Gold Qayda Sayı:** Dəqiq 21 qayda (Dondurulub).
* **Yeni Əlavə Edilən Gold:** 0 (`NEW_ACTIVE_GOLD: 0`).
* **Runtime statusu:** Toxunulmaz (`lib/runtime-kag-guard.ts` tam dəyişməzdir).
