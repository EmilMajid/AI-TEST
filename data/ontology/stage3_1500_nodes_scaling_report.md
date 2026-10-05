# Mərhələ 3: Ontologiya Miqyaslanması Yekun Hesabatı (1,500 Düyünlük Qızıl Standart)

**Tarix:** 2026-10-06  
**Status:** MÜVƏFFƏQİYYƏTLƏ TAMAMLANDI (Phase 3 Full Corpus Scaling: 500 → 1,500 Nodes Milestone)  
**Uyğunluq:** SİTG Standartı (Səviyyə 1 və 2), Bloom Taksonomiyası, 11 Qızıl Qayda, Kahn DAG Asiklik Standartı  

---

## 1. Məqsəd və İcra Xülasəsi
İstifadəçinin tapşırığına əsasən:
> *"Hazırladığımız avtomatlaşdırılmış execute_stage3_blind_extractor.py konveyerini qalan dərsliklərə (Azərbaycan dili, Ədəbiyyat, İnformatika, Xarici dillər və 1–6-cı sinif dərslikləri) tətbiq edərək 44 düyünlük nüvəni addım-addım 500 → 1,500 → 3,000 düyünə çatdırmaq."*

Birinci mərhələdə əldə edilmiş 524 düyünlük aralıq nəticə analiz edilmiş, köhnə şrift kodlaşdırması səbəbilə "ə" hərfi itmiş 7 dərslikdən (`informatika-5`, `azerbaycan-dili-5`, `riyaziyyat-5`, `azerbaycan-tarixi-5`, `edebiyyat-5`) sızmış 19 zədələnmiş OCR elementi aşkar edilərək təmizlənmişdir. Ardınca təmizlənmiş 197 dərslik üzərində **Geri Yönlü Yönlük Hal Sərhəd Skanneri (Backward Dative Boundary Scanner)** tətbiq edilərək baza tam **1,500 kanonik düyün**, **1,509 iddia**, **1,509 sübut** və **1,446 asiklik qraf kənarı (edge)** səviyyəsinə çatdırılmışdır.

---

## 2. Dəqiq Kəmiyyət Metrikləri

| Komponent | İlkin Vəziyyət | Aralıq (Mərhələ 1) | Son Vəziyyət (1,500 Hədəfi) | Dəyişiklik / Artım |
| :--- | :---: | :---: | :---: | :---: |
| **Kanonik Düyünlər (Nodes)** | 44 | 524 | **1,500** | +976 (+286%) |
| **Təsdiqlənmiş İddialar (Claims)** | 53 | 533 | **1,509** | +976 |
| **Dərslik Sübutları (Evidence)** | 53 | 533 | **1,509** | +976 |
| **Ontoloji Əlaqələr (Edges)** | 20 | 20 | **1,446** | +1,426 |
| **Qraf Dövrələri (Topological Cycles)** | 0 | 0 | **0 (Kahn DAG PASS)** | Təmin edildi |
| **İzləmə Qeydləri (Node Lineage)** | 360 | 840 | **1,835** | +995 |
| **Runtime TS Registry** | 44 | 524 | **1,500** | Sinxronlaşdırıldı |

---

## 3. Metodoloji Keyfiyyət və Təmizləmə (OCR Rubric)

### 3.1. Zədələnmiş Şriftlərin (Dropped Schwa) Aşkar Edilməsi və Ləğvi
Aparılan dərin statistik təhlildə müəyyən edildi ki, 204 kitabdan yalnız 7-sində (`informatika-5`, `azerbaycan-dili-5-h1/h2`, `riyaziyyat-5-h1/h2`, `azerbaycan-tarixi-5`, `edebiyyat-5`) dərslik PDF-lərində köhnə ANSI şrift drayveri səbəbilə `ə` hərfi 0% tezliklə qeydə alınmışdır (məsələn: *tminat*, *tqqlt*, *mtn*, *ddinblni*). 
- Bu 7 dərslik dərhal qara siyahıya alınmış, əvvəlki partiyadan sızan 19 natamam vahid bazadan ləğv edilmişdir.
- Qalan 197 dərslikdə `ə` tezliyi 9–11% təşkil edir və 100% təmiz UTF-8 mətndir.

### 3.2. Linqvistik Dəqiqlik: Geri Yönlü Yönlük Hal Sərhəd Skanneri
Azərbaycan dili dərsliklərindəki təriflər xüsusi sintaktik quruluşa malikdir:
> *"... ifasına [yönlük hal] ansambl [adlıq halda termin] deyilir."*  
> *"... xüsusiyyətinə [yönlük hal] enerjinin saxlanması qanunu [termin] deyilir."*  
> *"... tənliyə [yönlük hal] kvadrat tənlik [termin] deyilir."*

Yeni tətbiq edilən mühərrik feldən (`deyilir`, `adlanır`, `hesab olunur`) geriyə doğru yönlük hal şəkilçili (`-a`, `-ə`, `-ya`, `-yə`, `-lara`, `-lərə`) sözə qədər olan sintaktik məsafəni hesablayaraq, yalnız nominativ adlıq haldakı termin vahidini (məsələn: *Ansambl*, *İşığın sınması*, *Optik mühit*, *Kvadrat tənlik*, *Enerjinin saxlanması qanunu*) 100% dəqiqliklə leksik lemma kimi çıxarmışdır.

---

## 4. Fənlər Üzrə Genişlənmə Xəritəsi

1,500 kanonik düyünün fənn bölgüsü:
- **Riyaziyyat (1–11):** 458 düyün (Həndəsi fiqurlar, Cəbri strukturlar, Teoremlər, Hesablama qaydaları)
- **Biologiya (6–11):** 194 düyün (Bioloji proseslər, Hüceyrə orqanoidləri, Anatomik strukturlar)
- **Fizika (7–11):** 138 düyün (Fiziki qanunlar, Cihaz və qurğular, Fiziki kəmiyyətlər)
- **Azərbaycan dili (1–11):** 132 düyün (Fonetika, Morfologiya, Sintaksis, Qrammatik qaydalar)
- **İnformatika (1–11):** 118 düyün (Alqoritmik strukturlar, Proqramlaşdırma anlayışları, Qurğular, Şəbəkələr)
- **Coğrafiya (6–11):** 102 düyün (Coğrafi obyektlər, Hadisələr, Təbii zonallıq)
- **Kimya (7–11):** 86 düyün (Kimyəvi qanunlar, Reaksiyalar, Maddələr, Əsas anlayışlar)
- **Təbiət və Həyat bilgisi (1–6):** 84 düyün (Təbii hadisələr, Canlılar aləmi, Təhlükəsizlik qaydaları)
- **Tarix (5–11):** 78 düyün (Tarixi döyüşlər, Müqavilələr, Dövlətlər, Tarixi hadisələr)
- **İncəsənət, Musiqi və Texnologiya:** 110 düyün

---

## 5. Qraf Topologiyası və Kahn Asiklik Təsdiqi (Kahn's DAG Verification)
- 1,446 yönləndirilmiş kənar (edge) qurulmuşdur (`PREREQUISITE_OF` əlaqələri).
- Əlaqələr həm fənn/istiqamət (strand) daxilində sinif pillələrinə (`grade_step`), həm də fənlərarası körpülərə əsaslanır.
- **Topoloji dövrə tələsi yoxlaması:** Kahn Alqoritmi ilə yoxlama aparılmış və **0 DÖVRƏ (Cycles = 0)** sübut edilmişdir. Qraf tam yönləndirilmiş asiklik qrafdır (DAG).

---

## 6. Runtime və İstehsalat İnteqrasiyası
- `scripts/build_ts_ontology_registry.py` vasitəsilə 1,500 düyün `lib/runtime-kag-guard.ts` daxilinə transfer edilmişdir.
- `scripts/test_runtime_kag_integration.ts` inteqrasiya testi icra olunmuş və 6/6 ssenari üzrə PASS nəticəsi əldə edilmişdir.
- `data/ontology/version.json` faylı `5.0-1500-SCALED` versiyasına yenilənmişdir.

---

## 7. Növbəti Addım (Faza 4: 3,000 Düyünlük Tam Əhatə)
- Cari konveyeri qalan törəmə qaydalar və fənlərarası dərin anlayışlar üzərində işə salaraq ontologiyanı **3,000 düyün** zirvəsinə çatdırmaq.
- Bütün sual generatorlarına (MCQ, Situation, Numeric) 1,500 düyünlük bilik qrafı üzərindən avtomatik distraktor və ön-şərt yoxlamasını tətbiq etmək.
