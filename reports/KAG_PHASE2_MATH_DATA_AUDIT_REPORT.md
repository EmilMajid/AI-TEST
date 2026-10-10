# KAG Mərhələ 02: Riyaziyyat (8–11-ci Siniflər) Dərin Məlumat Auditi və Dəqiqləşdirilmiş Sübut İnventarı
**Sənəd Kodu:** `KAG-DATA-AUDIT-PHASE2-MATH-8-11-DEEP-VERIFIED`  
**Status:** 🟢 **AUDİT DƏQİQLƏŞDİRİLDİ (STRICTLY READ-ONLY)**  
**Əlaqəli Sənədlər:** `docs/KAG_AUTONOMOUS_MINER_CONTRACT_V1.md`, `reports/KAG_PHASE2_DEEP_VERIFICATION_EVIDENCE.json`  

---

## 1. Məlumat İnventarı və Mənbələrin Dəqiq Ayrılması

Mövcud 4,210 riyaziyyat sualı üzrə iki müstəqil izah mənbəyi (`solution_steps` və `explanation/izah`) fərqləndirilmişdir:

| Sinif | Fayl Həcmi | Fənn Bölməsi | Mövzu Sayı | Bütün Suallar | `solution_steps` Sahəsi Olan | `explanation/izah` Sahəsi Olan |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **8** | 45.46 MB | Riyaziyyat 8 | 77 | 2,305 | **2,305 (100.0%)** | 2,305 (100.0%) |
| **9** | 31.21 MB | Riyaziyyat 9 | 66 | 990 | **0 (0.0% — sahə yoxdur)** | 990 (100.0%) |
| **10** | 21.14 MB | Riyaziyyat 10 | 24 | 360 | **0 (0.0% — sahə yoxdur)** | 360 (100.0%) |
| **11** | 24.57 MB | Riyaziyyat 11 | 37 | 555 | **0 (0.0% — sahə yoxdur)** | 555 (100.0%) |
| **CƏMİ** | **122.38 MB** | — | **204** | **4,210** | **2,305 (54.75%)** | **4,210 (100.0%)** |

### Vahid Təsnifat Üsulu (Deterministic Precedence Rule):
Hər suala vahid yekun statusun verilməsi üçün ardıcıllıq:
1. Əgər sualda `solution_steps` sahəsi mövcuddursa və boş deyilsə, onun təsnifatı yekun status kimi qəbul edilir.
2. Əgər `solution_steps` sahəsi yoxdursa (9, 10, 11-ci siniflərdə olduğu kimi), sualın `explanation` / `izah` sahəsi yekun statusu müəyyən edir.

---

## 2. İzah Keyfiyyətinin Siniflər Üzrə Təsnifatı (Uyğunsuzluğun Həlli)

İlkin auditdəki `2,424 TEMPLATE` rəqəminin mənbəyi dəqiqləşdirildi:
* **8-ci sinifdəki 2,305 sualın 100%-i** `TEMPLATE` çıxmışdır (bütün addımlar sintetik şablondur).
* **9-cu sinifdəki 990 sualın 119-u** `TEMPLATE` mətni daşıyır.
* Cəmi: $2,305 + 119 = 2,424$ (`TEMPLATE`).

### Siniflər Üzrə Faktiki Paylanma:

| Sinif | `TEMPLATE` (Şablon) | `FORMULA_REFERENCE` (Düstur) | `OPERATIONAL_TRACE` (Əməliyyat) | `REASONED_EXPLANATION` | `AMBIGUOUS` | Cəmi Suallar |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **8** | 2,305 (100.0%) | 0 (0.0%) | 0 (0.0%) | 0 (0.0%) | 0 (0.0%) | **2,305** |
| **9** | 119 (12.02%) | 6 (0.61%) | 632 (63.84%) | 1 (0.10%) | 232 (23.43%) | **990** |
| **10** | 0 (0.0%) | 262 (72.78%) | 98 (27.22%) | 0 (0.0%) | 0 (0.0%) | **360** |
| **11** | 0 (0.0%) | 438 (78.92%) | 115 (20.72%) | 1 (0.18%) | 1 (0.18%) | **555** |
| **CƏMİ** | **2,424 (57.58%)** | **706 (16.77%)** | **845 (20.07%)** | **2 (0.05%)** | **233 (5.53%)** | **4,210 (100%)** |

### Məxrəclər üzrə İkiqat Statistika:
1. **Məxrəc 1 (Bütün 4,210 suala nisbətən):**
   * `OPERATIONAL_TRACE`: **845 / 4,210 = 20.07%**
   * `FORMULA_REFERENCE`: **706 / 4,210 = 16.77%**
   * `TEMPLATE`: **2,424 / 4,210 = 57.58%**
   * `AMBIGUOUS`: **233 / 4,210 = 5.53%**
2. **Məxrəc 2 (Yalnız `solution_steps` olan 2,305 suala nisbətən — 8-ci sinif):**
   * `TEMPLATE`: **2,305 / 2,305 = 100.0%**
   * Digər kateqoriyalar: **0.0%** (8-ci sinfin `solution_steps` sahəsi tamamilə şablondur).

---

## 3. Nümunələrin Əl İlə Yoxlanması və Təsnifatın Səhv Payı

`OPERATIONAL_TRACE` kimi təsnif edilmiş 845 sualdan **15 real nümunə** təsadüfi qaydada çıxarılaraq birbaşa yoxlanıldı:

### Müşahidə Edilən Real Həll İzləri:
1. **[Q-900004 (Grade 9)] Dövri kəsr:** `0,2(6) = (26-2)/90 = 24/90 = 4/15` $\rightarrow$ Həqiqi hesablama əməliyyatı.
2. **[Q-900007 (Grade 9)] Müxtəsər vurma:** `(a+b)(a-b) = a^2 - b^2 = 3^2 - (√5)^2 = 9 - 5 = 4` $\rightarrow$ Həqiqi əməliyyat.
3. **[Q-900008 (Grade 9)] İrrasional kvadrat:** `(2-√3)^2 + 4√3 = 4 - 4√3 + 3 + 4√3 = 7` $\rightarrow$ Həqiqi əməliyyat.
4. **[Q-900014 (Grade 9)] Çoxhədli hasili:** `(x^2 - 9)(x^2 + 9) = x^4 - 81 = (√11)^4 - 81 = 40` $\rightarrow$ Həqiqi əməliyyat.
5. **[Q-900015 (Grade 9)] Tam kvadrat ayırma:** `(a-2)^2 + (b+3)^2 = 0 -> a=2, b=-3 -> ab = -6` $\rightarrow$ Həqiqi əməliyyat.
6. **[Q-900021 (Grade 9)] Modul tənliyi:** `|x - 5| = 7 -> x1 = 12; x2 = -2. Cəm: 10` $\rightarrow$ Həqiqi əməliyyat.
7. **[Q-900010 (Grade 9)] Xətalı Təsnifat (False Positive):** `|a| = a (a >= 0 olduqda), |a| = -a (a < 0 olduqda)` $\rightarrow$ Əslində parça-parça tərifdir (`FORMULA_REFERENCE`), lakin bərabərsizlik işarələrinə görə `OPERATIONAL_TRACE` kimi qeydə alınıb.

### Təsnifatın Ölçülən Səhv Payı (Error Rate):
* 15 nümunədən 14-ü tam həqiqi əməliyyat izidir (Precision = 93.3%).
* **Təsnifatın Səhv Payı:** **~6.7%** (Formula/Tərif bəzən əməliyyat kimi oxuna bilir).
* **Nəticə:** `HOLD` qərarı tamamilə əsaslıdır: 845 sual təsdiqlənmiş sübut deyil, yalnız **namizəd axtarış zonasıdır**.

---

## 4. 21 Gold Qaydasının Riyaziyyat Əhatəsi (Konkret Sual ID-ləri və Tətbiq Sərhədləri)

Blank "YÜKSƏK" qiymətləndirməsi ləğv edildi; 5 riyaziyyat qaydası konkret sual ID-ləri və sərhədləri ilə xəritələndirildi:

| Qayda ID | Asılılıq | Sinif | Bazada Real Sual Sayı | Konkret Sual ID-lərindən Nümunələr | Asılılıq İstiqamətinin Əsaslandırılması | KAG Qaydasının Tətbiq Sərhədi |
| :--- | :--- | :---: | :---: | :--- | :--- | :--- |
| `GOLD-M01` | Viyet Teoremi $\rightarrow$ Kvadrat tənlik kökləri | 8 | 92 | `g8-riy8-7-37-e54fbb`<br>`g8-riy8-11-3-9320b2`<br>`g8-riy8-11-5-2b2df1` | $x_1+x_2 = -p, x_1 x_2 = q$ əməliyyatı üçün tənliyin kökləri anlayışı ilkindir. | Yalnız $x_1, x_2$ simmetrik ifadələrini kökləri tapmadan hesablamaq tapşırıqlarında keçərlidir. Bütün kvadrat tənliklərə şamil edilmir. |
| `GOLD-M02` | Pifaqor Teoremi $\rightarrow$ Düzbucaqlı üçbucaq anlayışı | 8 | 243 | `g8-riy8-2-21-13e7a3`<br>`g8-riy8-7-23-1d42e0`<br>`g8-riy8-7-24-8411c4` | $a^2+b^2=c^2$ düsturunu tətbiq etmək üçün hipotenuz və katet təyini zəruridir. | Yalnız tərəflərin metrik hesablanması məsələləri üçün keçərlidir. Çoxbucaqlı sahələrinə birbaşa şamil edilmir. |
| `GOLD-M03` | Rasional Kəsrlər $\rightarrow$ Çoxhədli vuruqlara ayırma | 8 | 130 | `g8-riy8-1-4-e694b9`<br>`g8-riy8-1-68-e6cd8e`<br>`g8-riy8-1-71-a2f269` | Ortaq məxrəcə gətirmək üçün məxrəclərin vuruqlara ayrılması məcburidir. | Yalnız müxtəlif məxrəcli cəbri kəsrlərin toplanması/çıxılması üçün keçərlidir. Tək hədlilərə şamil edilmir. |
| `GOLD-M04` | Kəsilməzlik $\rightarrow$ Funksiyanın Limiti | 11 | 65 | `10-001-0103-10MA03`<br>`11-001-0207-11MA07`<br>`11-001-0210-11MA10` | Nöqtədə kəsilməzliyin tərifi limitin varlığını tələb edir ($\lim_{x\to a} f(x) = f(a)$). | Yalnız analitik kəsilməzlik yoxlamalarında keçərlidir. Qrafik vizual müşahidələrdə limit hesablanmaya bilər. |
| `GOLD-M05` | Bölmə Teoremi $\rightarrow$ Çoxhədlinin bölünməsi | 10 | 39 | `11-001-0101-11MA01-BL3`<br>`11-001-0101-11MA01-BL1` | Bezu teoremi ilə qalığı tapmaq üçün çoxhədlilərin bölünmə alqoritmi idraki əsasdır. | Yalnız çoxhədlinin $x-a$ ikihədlisinə bölünməsində qalığın tapılması ilə məhdudlaşır. |

---

## 5. Mərhələ 03 Üçün Təsdiqlənmiş Qərarlar

Sizin qoyduğunuz üçqat qərar rəsmi olaraq tətbiq edilir:
1. 🟢 **GO — Hazırlıq və Falsifikasiya Dizaynı:**  
   `scripts/autonomous_gold_miner.py` yalnız namizəd yaratmaq və amansızcasına falsifikasiya etmək rejimində saxlanılır.
2. 🟡 **HOLD — 845 Əməliyyat İzi Sualı:**  
   Bu suallar birbaşa Gold sübutu sayılmır; onlar yalnız namizədlərin alternativ həll sınaqları üçün test poliqonu kimi istifadə edilir.
3. 🔴 **NO-GO — Avtomatik ACTIVE_GOLD Aktivləşməsi:**  
   Heç bir namizəd avtomatik istehsalat qaydasına çevrilmir. 21 Gold qaydası və canlı sistem toxunulmaz qalır.
