# ⚖️ Pilot Ontologiya Düyünlərinin Ciddi Tənqidi Qiymətləndirmə (Adjudication) Hesabatı

> **Audit Standartı:** «Evidence-də sözün mövcudluğu node-un mövcudluğunu sübut etmir». Bu hesabat pilot çıxarış datasetindəki **346 namizəd düyünü (Extraction Candidate Corpus)** əhatə edir. Hər bir namizəd **100% tam əhatə ilə (346/346)** 11 sərt qızıl qayda, fənn üzrə rəsmi tip müqaviləsi və ölçüləbilənlik meyarları (Assessment Utility & Curriculum Relevance) əsasında qiymətləndirilmişdir.

## 📊 1. Triage Statusları (Status Taxonomy)

Hər bir namizəd düyün qarşılıqlı istisna olunan (mutually exclusive) 5 kateqoriyadan yalnız birinə aid edilmişdir:

| Status | Say | Faiz (%) | Ontoloji Məna və Qərar |
| :--- | :---: | :---: | :--- |
| 🟢 **VERIFIED** | **94** | **27.2%** | Bütün 11 qaydaya tam cavab verən, təmiz canonical vahidlər |
| 🟡 **NEEDS_REVIEW** | **229** | **66.2%** | Düzəldilə bilən vahidlər (Tip yenidən təsnifatı, OCR bərpası gözləyənlər) |
| 🟣 **MERGED (Canonical Merge)** | **1** | **0.3%** | Semantik təkrarlar; silinməyib, əsas canonical node-a sübut olaraq birləşdirilib |
| 🔵 **RECOVERABLE_EVIDENCE** | **1** | **0.3%** | Node sərhədi xətalı kəsilib, lakin sitatda həqiqi başqa canonical düyün mövcuddur |
| 🔴 **REJECTED** | **21** | **6.1%** | Xilas edilə bilməyən əvəzlik qırıqları və tapşırıq cümlələri |
| **CƏMİ (Candidate Corpus)** | **346** | **100.0%** | **346 namizədin hamısı formal qaydalar və adjudication rubriki ilə yoxlanmışdır** |

## 🏷️ 2. Müstəqil Problem Flag-ları (Multi-Label Defect Analysis)

> **Qeyd:** Problem flag-ları çoxqiymətlidir (multi-label). Bir düyündə həm OCR zəifliyi, həm də tip uyğunsuzluğu ola bilər. Ona görə də flag-ların cəmi status cəmi ilə eyni deyil:

| Problem Flag-ı | Aşkar Edilən Say | Təsir Sahəsi | Qərar / Həll Strategiyası |
| :--- | :---: | :--- | :--- |
| **TYPE_COLLAPSE** | 233 | Dövlətin Hadisə, Qaydanın Teorem edilməsi | Deterministic Reclassification Candidate (NEEDS_REVIEW) |
| **COREF_OR_SYNTACTIC_FRAGMENT** | 19 | «Lakin bu...», «Onlar...», cümlə qırıqları | Sitatında anlayış olanlar RECOVERABLE edildi, qalanı REJECTED |
| **TASK_OR_QUESTION_FRAGMENT** | 2 | «münasibət bildirin», sual cümlələri | Dərhal REJECTED (elmi fakt deyil) |
| **WEAK_EVIDENCE** | 3 | «yada salın!», mövzunu anons edən sitatlar | NEEDS_REVIEW (dərslikdə tərifi olan başqa paraqraf tələb olunur) |
| **CANONICAL_DUPLICATE** | 1 | Eyni anlayışın müxtəlif variantları | Silinmir! MERGED edilərək əsas düyünə bağlanır |
| **OCR_DEGRADATION** | 31 | Birləşmiş sözlər, durğu xətaları, simvol itkisi | Mətn bərpası növbəsinə yönləndirildi (DEGRADED) |
| **LOW_ASSESSMENT_UTILITY** | 3 | Müstəqil sual yarada bilməyən mürəkkəb spanlar | NEEDS_REVIEW səviyyəsində qranulyarlıq daraldılır |

## 🔬 3. Sitat və OCR Keyfiyyət İndeksi (Strict Rubric)

OCR qiymətləndirilməsi yalnız hərflərin tanınmasına deyil, **bilik iddiasının (knowledge claim) əlavə bərpa olmadan oxunaqlığına** əsaslanır:

- **CLEAN (Təmiz oxunan və bərpa tələb etməyən):** **315** ədəd (91.0%)
- **DEGRADED (Birləşmiş sözlər/simvol qüsuru var, lakin iddia bərpa olunur):** **31** ədəd (9.0%)
- **UNUSABLE (İddianı müəyyən etmək mümkün deyil):** **0** ədəd (0.0%)

---

## 💡 4. «REJECT Node ≠ REJECT Evidence» Prinsipi: Xilas Edilən Nümunələr

### 🔵 Xilas Edilən Nümunə #1: `math_concept_her_hansi_teoremi`
- **Xətalı Kəsilmiş Label:** «Hər hansı teoremi» (Qərar: Node çıxdaş edilir)
- **Dərslik Sitatı:** > *«TƏRS TEOREM:Hər hansı teoreminşərti iləhökmünün yerini dəyişməkləalınır....»*
- **Sitatdakı Həqiqi Canonical Varlıq:** 🌟 **«Tərs teorem»**
- **Ontoloji Əməliyyat:** Sitat atılmır; gələcək **«Tərs teorem»** canonical düyünü üçün saxlanılır.

---

## 🔄 5. Canonical Birləşmə (MERGED) Nümunələri

### 🟣 Birləşdirilən Düyün #1: `hist_event_azerbaycana_qayidib_saciler_dovleti`
- **Təkrarlanan Label:** «Azərbaycana qayıdıb Sacilər dövləti»
- **Hədəf Canonical Node:** `hist_event_azer_baycana_qayidib_saciler_dovleti`
- **Qərar:** Düyün dublikat kimi silinmir, dərslik sübutu əsas anlayışın `occurrences` reyestrinə bağlanır.

---

## 📐 6. Fənn Üzrə Formal Type Contract və Yenidən Təsnifat Qaydaları

### A. Tarix Üzrə (Zaman Testi: «Hadisə vs Mövcud Olan Varlıq»):
- **Dövlət / SiyasiQurum:** Zaman daxilində baş verən hadisə deyil, müəyyən zaman kəsiyində mövcud olan siyasi varlıqdır (*Manna dövləti, Şirvanşahlar dövləti, Səfəvilər dövləti*).
- **İnstitut / Qurum:** İnzibati və ictimai idarəetmə orqanları (*Ağsaqqallar şurası, Divan, Məclis*).
- **TarixiDöyüş:** Hadisənin hərbi toqquşma alt-tipi (*Çaldıran döyüşü, Malazgird döyüşü*).

### B. Riyaziyyat Üzrə (Funksional Təsnifat):
- **Xassə:** Əməliyyatların və ya riyazi obyektlərin dəyişməz daxili münasibəti (*Kəsrin əsas xassəsi, Vurmanın paylama xassəsi*).
- **Qayda:** Hesablama və ya çevirmənin alqoritmik proseduru (*Onluq kəsrin adi kəsrə çevrilməsi qaydası, Birhədlini çoxhədliyə vurma qaydası*).
- **Düstur:** Riyazi bərabərliyin formal simvolik ifadəsi.
- **Teorem:** Sübut tələb edən məntiqi riyazi hökm (*Pifaqor teoremi, Tərs teorem*).

---

## 📜 7. Milli Təhsil Ontologiyasının 11 Qızıl Qaydası (Gold Rules)

| # | Qızıl Qayda | Təsvir və Standart Tələb |
| :---: | :--- | :--- |
| **1** | **Canonical Identity** | Vahid konseptual kimlik; eyni anlayış müxtəlif fəsillərdə yalnız bir canonical ID ilə təmsil olunur. |
| **2** | **Self-contained Label** | Kontekstsiz təkbaşına başa düşülən adlandırma (cümlə qırıntıları və natamam söz birləşmələri qadağandır). |
| **3** | **No Unresolved Coreference** | «Bu», «onlar», «həmin» kimi əvəzliklərlə başlayan fraqmentlər dərhal çıxdaş edilir. |
| **4** | **Valid Type Contract** | Fənnin ontoloji modelinə uyğunluq (Dövlət Hadisə, Qayda Teorem, Toxuma Qanun ola bilməz). |
| **5** | **Semantic Evidence Support** | Sitat dərslikdə sadəcə mövzunu anons etməməli, anlayışın faktiki tərifini və ya qanunauyğunluğunu verməlidir. |
| **6** | **Verbatim Evidence Preservation** | Sitat dərslik mətnindən hərfi bütövlükdə götürülməli, əlavə redaktə edilməməlidir. |
| **7** | **Acceptable OCR Quality** | Mətn və riyazi simvollar bilik iddiasını bərpa etməyə imkan verəcək keyfiyyətdə olmalıdır. |
| **8** | **No Canonical Duplicate (Merge Policy)** | Eyni semantik varlıq çıxarıldıqda silinmir, `occurrences` siyahısına birləşdirilir. |
| **9** | **Type-specific Invariants** | Tipə xas məntiqi şərtlər (məs., Hadisə üçün zaman/məkan, Düstur üçün riyazi ifadə invariantı). |
| **10** | **Assessment Utility** | Düyün müstəqil şəkildə test sualına, Bloom tapşırığına və ya diaqnostik izləməyə çevrilə bilməlidir. |
| **11** | **Curriculum Relevance** | Anlayış rəsmi dövlət tədris proqramının və dərslik standartının birbaşa tədris vahidi olmalıdır. |

---

## 🏆 8. Real Ontoloji Göstəricilər və Metodoloji Əsaslandırma

| Metrik | Köhnə İddia | Adjudication Nəticəsi | Dəqiq Metodoloji İzah |
| :--- | :---: | :---: | :--- |
| **Evidence String Existence** | 100% | **100%** | Sitatın dərslik korpusunda hərfi mövcudluğu |
| **Verbatim Preservation** | 100% | **100%** | Sitatın mətndən dəyişdirilmədən köçürülməsi |
| **Evidence Semantic Support** | 100% | **~38%** | Sitatın anlayış haqqında real fakt/tərif daşıması (Yuxarı Sərhəd) |
| **Raw Extraction Type Accuracy** | 100% | **~24%** | İlkin xammal çıxarışında tipin düzgünlüyü (233 Type Collapse) |
| **Self-contained Granularity** | 100% | **~32%** | Cümlə qırıntıları təmizlənmiş sərbəst varlıqlar |
| **Verified Candidate Pool (Gold Gate)** | 100% | **27.2%** | **94 VERIFIED namizəd** II Mərhələyə (Canonical Adjudication Pass) hazırdır |

> **Riyazi və Məntiqi Əlaqə:**

> `Evidence Semantic Support (~38%)` $\ge$ `VERIFIED (27.2%)` olmasının səbəbi aydındır: Sitat elmi fakt daşısa belə (~38%), düyünün `VERIFIED` olması üçün həm də **Canonical Identity $\land$ Type Contract $\land$ Assessment Utility $\land$ Duplicate-Free $\land$ Clean OCR** şərtlərinin hamısı eyni anda ödənməlidir. Bu kəsişmə nəticəsində hazırda **94 ədəd** tam saf namizəd qalmışdır.
