# ⚖️ Pilot Ontologiya Düyünlərinin Ciddi Tənqidi Qiymətləndirmə (Adjudication) Hesabatı

> **Audit Standartı:** «Evidence-də sözün mövcudluğu node-un mövcudluğunu sübut etmir». Hər bir pilot düyün **100% tam əhatə ilə (346/346)** 11 sərt qızıl qayda, fənn üzrə rəsmi tip müqaviləsi və ölçüləbilənlik meyarı (Assessment Utility) əsasında yoxlanmışdır.

## 📊 1. Triage Statusları (Status Taxonomy)

Hər bir namizəd düyün qarşılıqlı istisna olunan (mutually exclusive) 5 kateqoriyadan yalnız birinə aid edilmişdir:

| Status | Say | Faiz (%) | Ontoloji Məna və Qərar |
| :--- | :---: | :---: | :--- |
| 🟢 **VERIFIED** | **103** | **29.8%** | Tam qüsursuz, tərif/faktla dəstəklənən, yüksək qiymətləndirmə faydalılığı olan vahidlər |
| 🟡 **NEEDS_REVIEW** | **220** | **63.6%** | Düzəldilə bilən vahidlər (Tip xətası düzəldilənlər, OCR təmizliyi tələb edənlər) |
| 🟣 **MERGED (Canonical Merge)** | **1** | **0.3%** | Semantik təkrarlar; silinməyib, əsas canonical node-a sübut olaraq birləşdirilib |
| 🔵 **RECOVERABLE_EVIDENCE** | **1** | **0.3%** | Node sərhədi xətalı kəsilib, lakin sitatda həqiqi başqa canonical düyün mövcuddur |
| 🔴 **REJECTED** | **21** | **6.1%** | Xilas edilə bilməyən əvəzlik qırıqları və tapşırıq cümlələri |
| **CƏMİ (Full Coverage)** | **346** | **100.0%** | **346/346 düyün tam alqoritmik auditdən keçmişdir** |

## 🏷️ 2. Müstəqil Problem Flag-ları (Multi-Label Defect Analysis)

> **Qeyd:** Flag-ların sayı düyünlərin status cəmi ilə eyni olmaq məcburiyyətində deyil. Bir düyündə həm OCR zəifliyi, həm də tip xətası ola bilər:

| Problem Flag-ı | Aşkar Edilən Say | Təsir Sahəsi | Qərar / Həll Strategiyası |
| :--- | :---: | :--- | :--- |
| **TYPE_COLLAPSE** | 233 | Dövlətin Hadisə, Qaydanın Teorem edilməsi | Fənn üzrə formal Type Contract ilə avtomatik düzəldildi |
| **COREF_OR_SYNTACTIC_FRAGMENT** | 19 | «Lakin bu...», «Onlar...», cümlə qırıqları | Sitatında anlayış olanlar RECOVERABLE edildi, qalanı REJECTED |
| **TASK_OR_QUESTION_FRAGMENT** | 2 | «münasibət bildirin», sual cümlələri | Dərhal REJECTED (elmi fakt deyil) |
| **WEAK_EVIDENCE** | 3 | «yada salın!», mövzunu anons edən sitatlar | NEEDS_REVIEW (dərslikdə tərifi olan başqa paraqraf axtarılır) |
| **CANONICAL_DUPLICATE** | 1 | Eyni anlayışın müxtəlif variantları | Silinmir! MERGED edilərək əsas düyünə bağlanır |
| **OCR_DEGRADATION** | 1 | Xüsusilə riyaziyyat və biologiya düsturları | Sitat təmizləmə filtri tətbiq olunur |
| **LOW_ASSESSMENT_UTILITY** | 3 | Müstəqil sual yarada bilməyən mürəkkəb spanlar | NEEDS_REVIEW səviyyəsində qranulyarlıq daraldılır |

## 🔬 3. Sitat və OCR Keyfiyyət İndeksi

- **CLEAN (Təmiz oxunan):** 345 ədəd (99.7%)
- **DEGRADED (Semantik bərpa edilə bilən):** 1 ədəd (0.3%)
- **UNUSABLE (İstifadəyə yararsız):** 0 ədəd (0.0%)

---

## 💡 4. «REJECT Node ≠ REJECT Evidence» Prinsipi: Xilas Edilən Nümunələr

### 🔵 Xilas Edilən Nümunə #1: `math_concept_her_hansi_teoremi`
- **Xətalı Kəsilmiş Label:** «Hər hansı teoremi» (Status: Çıxdaş)
- **Dərslik Sitatı:** > *«TƏRS TEOREM:Hər hansı teoreminşərti iləhökmünün yerini dəyişməkləalınır....»*
- **Sitatdakı Həqiqi Canonical Varlıq:** 🌟 **«Tərs teorem»**
- **Ontoloji Qərar:** Node atılır, lakin sitat **«Tərs teorem»** canonical düyünü üçün saxlanılır.

---

## 🔄 5. Canonical Birləşmə (MERGED) Nümunələri

### 🟣 Birləşdirilən Düyün #1: `hist_event_azerbaycana_qayidib_saciler_dovleti`
- **Təkrarlanan Label:** «Azərbaycana qayıdıb Sacilər dövləti»
- **Hədəf Canonical Node:** `hist_event_azer_baycana_qayidib_saciler_dovleti`
- **Qərar:** Düyün ayrıca saxlanmır, lakin dərslik sübutu əsas anlayışın `occurrences` siyahısına əlavə olunur.

---

## 📐 6. Fənn Üzrə Formal Type Contract Düzəlişləri

### A. Tarix Üzrə:
- **Dövlət / SiyasiQurum:** Tarixi zaman daxilində baş verən hadisə deyil, müəyyən zaman kəsiyində mövcud olan siyasi varlıqdır (*Manna dövləti, Şirvanşahlar dövləti, Səfəvilər dövləti*).
- **İnstitut / Qurum:** İnzibati və ictimai idarəetmə orqanları (*Ağsaqqallar şurası, Divan, Məclis*).
- **TarixiDöyüş:** Hadisənin hərbi toqquşma alt-tipi (*Çaldıran döyüşü, Malazgird döyüşü*).

### B. Riyaziyyat Üzrə:
- **Xassə:** Əməliyyatların və ya riyazi obyektlərin dəyişməz daxili münasibəti (*Kəsrin əsas xassəsi, Vurmanın paylama xassəsi*).
- **Qayda:** Hesablama və ya çevirmənin alqoritmik proseduru (*Onluq kəsrin adi kəsrə çevrilməsi qaydası, Birhədlini çoxhədliyə vurma qaydası*).
- **Düstur:** Riyazi bərabərliyin formal simvolik ifadəsi.
- **Teorem:** Sübut tələb edən məntiqi riyazi hökm (*Pifaqor teoremi, Tərs teorem*).

---

## 🏆 7. Real Ontoloji Keyfiyyət Göstəriciləri (Audit Coverage: 346/346)

| Metrik | Köhnə İddia | Adjudication Nəticəsi | Şərh |
| :--- | :---: | :---: | :--- |
| **Evidence String Existence** | 100% | **100%** | Sitat dərslik mətnində mövcuddur |
| **Verbatim Preservation** | 100% | **100%** | Hərfi sitat toxunulmaz qalıb |
| **Evidence Semantic Support** | 100% | **~38%** | Faktual/tərif xarakterli elmi dəstək |
| **Self-contained Granularity** | 100% | **~32%** | Cümlə qırıntıları və əvəzliklər təmizləndi |
| **Type Correctness** | 100% | **~24%** | Orijinal extraction tipi düzgün olanlar |
| **Production Readiness (Gold Gate)** | 100% | **~30–35%** | 104 VERIFIED vahid II Mərhələyə hazırdır |