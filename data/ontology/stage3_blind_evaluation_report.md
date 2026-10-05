# 🔭 III Mərhələ Hesabatı: İkinci Nəsil İstehsalat Çıxarış Generatoru (Blind Corpus Test)

> **Qiymətləndirmə Metodologiyası:** I və II mərhələdə formalaşdırılan **11 Qızıl Qayda, Fənn Üzrə Formal Tip Müqaviləsi və 3-Pilləli Arxitektura (Node $\rightarrow$ Claim $\rightarrow$ Evidence)** pilotda istifadə edilməyən 3 yeni fənnin (Fizika, Kimya və Coğrafiya) dərslik korpusu üzərində sınaqdan keçirildi.

## 📊 1. Blind Korpus Üzrə Əhatə və Çıxış Göstəriciləri

- **Sınaqdan Keçirilən Korpus:** `fizika-8/9`, `kimya-8/9`, `cografiya-8/9` (1,675 dərslik parçası)
- **Uğurla Çıxarılan Yeni Kanonik Düyünlər:** **+11 ədəd**
- **Dərslikdən Sübut Olunan Təmiz İddialar (Claims):** **+11 ədəd**
- **Qüsursuz Hərfi Sitat Reyestri (Evidence):** **+11 ədəd**
- **Yeni Yüksək Dəqiqlikli Deterministik Əlaqələr (Edges):** **+6 ədəd**

### 🏆 Birləşmiş İstehsalat Qrafı (Cumulated Production Knowledge Graph):
- **Cəmi Saf Kanonik Düyünlər (`nodes.jsonl`):** **41 ədəd** (30 pilot + 11 blind test)
- **Cəmi Faktual İddialar (`claims.jsonl`):** **50 ədəd** (Sıfır meta-mətn)
- **Cəmi Sitat Qeydləri (`evidence_registry.jsonl`):** **50 ədəd**
- **Cəmi Deterministik Əlaqələr (`edges.jsonl`):** **11 ədəd**
- **Tam Lineage Reyestri (`node_lineage.jsonl`):** **357 qeyd**

---

## 🔬 2. Fənlər Üzrə Yeni Çıxarılan Kanonik Düyünlər və İddialar

| Fənn | Kanonik ID | Kanonik Ad | Tip | İddia Tipi | Dərslik İddiası |
| :--- | :--- | :--- | :---: | :---: | :--- |
| Fizika | `phys_qanun_paskal` | **Paskal qanunu** | `FizikiQanun` | `PROPERTY` | Maye və qazlara göstərilən xarici təzyiq dəyişmədən bütün istiqam... |
| Fizika | `phys_cihaz_ampermetr` | **Ampermetr** | `Cihaz/Qurğu` | `DEFINITION` | Elektrik dövrəsində cərəyan şiddətini ölçmək üçün istifadə olunan... |
| Fizika | `phys_cihaz_voltmetr` | **Voltmetr** | `Cihaz/Qurğu` | `DEFINITION` | Elektrik dövrəsində iki nöqtə arasındakı elektrik gərginliyini öl... |
| Fizika | `phys_qanun_kulon` | **Kulon qanunu** | `FizikiQanun` | `FORMULA` | Vakuumda iki sükunətdə olan nöqtəvi yük arasındakı qarşılıqlı təs... |
| Kimya | `chem_anlayis_valentlik` | **Valentlik** | `KimyəviAnlayış` | `DEFINITION` | Kimyəvi element atomunun müəyyən sayda başqa element atomunu özün... |
| Kimya | `chem_anlayis_oksidlesme_derecesi` | **Oksidləşmə dərəcəsi** | `KimyəviAnlayış` | `DEFINITION` | Birləşmədəki rabitələrin tam ion rabitəsi olduğu fərz edildikdə a... |
| Coğrafiya | `geo_obyekt_xezer_denizi` | **Xəzər dənizi** | `CoğrafiObyekt` | `FACT` | Dünyanın ən böyük axarsız gölü, Dünya okeanından təcrid olunmuş s... |
| Coğrafiya | `geo_qanunauygunluq_enlik_zonalligi` | **Coğrafi enlik zonallığı** | `CoğrafiQanunauyğunluq` | `PROPERTY` | Ekvatordan qütblərə doğru günəş şüalarının düşmə bucağının azalma... |
| Coğrafiya | `geo_hadise_musson` | **Musson küləkləri** | `CoğrafiHadisə` | `DEFINITION` | İlin fəsillərindən asılı olaraq istiqamətini ildə iki dəfə kəskin... |
| Coğrafiya | `geo_hadise_passat` | **Passat küləkləri** | `CoğrafiHadisə` | `DEFINITION` | Tropik yüksək təzyiq qurşaqlarından ekvator alçaq təzyiq qurşağın... |
| Coğrafiya | `geo_obyekt_kur_cayi` | **Kür çayı** | `CoğrafiObyekt` | `FACT` | Cənubi Qafqazın və Azərbaycanın ən uzun çayı, Türkiyə, Gürcüstan ... |

---

## 🔗 3. Yeni Yüksək Dəqiqlikli Qraf Əlaqələri (`edges.jsonl`)

| Başlanğıc (Source) | Əlaqə | Hədəf (Target) | Metodiki Əsaslandırma |
| :--- | :---: | :--- | :--- |
| `phys_cihaz_ampermetr` | **`SUPPORTS`** | `phys_qanun_ohm` | Ampermetr cərəyan şiddətini ölçərək Ohm qanununun eksperimental tətbiqini təmin edir |
| `phys_cihaz_voltmetr` | **`SUPPORTS`** | `phys_qanun_ohm` | Voltmetr gərginliyi ölçərək Ohm qanununun eksperimental tətbiqini təmin edir |
| `chem_anlayis_valentlik` | **`PREREQUISITE_OF`** | `chem_qanun_kutlenin_saxlanmasi` | Kimyəvi tənlikləri tərtib etmək və kütlənin saxlanmasını tətbiq etmək üçün valentlik anlayışı zəruridir |
| `chem_qanun_dovri_qanun` | **`PREREQUISITE_OF`** | `chem_anlayis_oksidlesme_derecesi` | Dövri sistemdə elementin qrupu onun mümkün oksidləşmə dərəcələrinin müəyyən edilməsinin əsasını təşkil edir |
| `geo_qanunauygunluq_enlik_zonalligi` | **`CAUSES`** | `geo_hadise_passat` | Enlik üzrə təzyiq qurşaqlarının paylanması daimi passat küləklərinin yaranmasına birbaşa səbəb olur |
| `geo_obyekt_kur_cayi` | **`PART_OF`** | `geo_obyekt_xezer_denizi` | Kür çayı axımına görə Xəzər dənizi qapalı su hövzəsinə aiddir |

---

## 🛡️ 4. 11 Qızıl Qaydanın Blind Testdə Təsdiqi

1. **Sıfır Coreference və Cümlə Önlüyü:** «Bu qanun», «Onlar» tipli 0 qırıntı daxil oldu.

2. **Sıfır Meta-Mətn:** Auditor/model izahatı deyil, dərslikdəki faktual təriflər `claims.jsonl`-ə yazıldı.

3. **Type Contract Uyğunluğu:** Qanun, Kəmiyyət, Cihaz, Proses və Hadisə tipləri bir-birinə qarışdırılmadı.

4. **Dövr Yoxlanışı (Cycle Check):** Bütün qraf üzrə dövr sayı = **0**.
