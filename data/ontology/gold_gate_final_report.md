# 🏛️ Gold Gate Final Hesabatı: Tam Lineage Uçotu, Təmiz İddialar və Yüksək Dəqiqlikli Qraf Əlaqələri

> **Gold Gate Zəmanəti:** Heç bir auditor meta-mətni daxil edilmədi, subyektiv ehtimallar aradan qaldırıldı, qraf əlaqələri 100% deterministik və sübutlu nüvəyə endirildi və **346 namizədin hər biri üçün tam riyazi uçot və lineage matrisi (`node_lineage.jsonl`)** quruldu.

## 📊 1. Tam Lineage və Uçot Balansı (346 / 346 Namizəd)

Hər bir xammal çıxarış vahidinin taleyi riyazi dəqiqliklə izlənir:

| Mərhələ və Kateqoriya | Say | Təyinat və Fayl |
| :--- | :---: | :--- |
| **Xammal Namizəd Korpusu (Raw Extraction Candidates)** | **346** | `pilot_nodes.jsonl` |
| ├── **Qızıl Nüvəyə Qəbul Edilən Namizədlər (Claim & Evidence-ə çevrilən)** | **39** | `claims.jsonl` & `evidence_registry.jsonl` |
| ├── **İncələmə Növbəsində Saxlanılanlar (Review Queue)** | **280** | `audit/review_queue.jsonl` |
| └── **Reqressiya Test Setinə Ayrılan Çıxdaşlar (Rejected Regression Set)** | **27** | `audit/rejected_regression_set.jsonl` |
| **YEKUN UÇOT BALANSI** | **346 / 346** | **0 itki, 100% şəffaf qeydiyyat** |

### 🏆 Formal Qızıl Nüvə Çıxışı (Production Knowledge Core):
- **Saf Kanonik Düyünlər (`nodes.jsonl`):** **30 ədəd** (Bütün 11 qaydadan tam keçən təsdiqli anlayışlar)
- **Təmiz Dərslik İddiaları (`claims.jsonl`):** **39 ədəd** (0 meta-mətn, formal `claim_type` təsnifatı ilə)
- **Hərfi Sitat Reyestri (`evidence_registry.jsonl`):** **39 ədəd**
- **Yüksək Dəqiqlikli Deterministik Əlaqələr (`edges.jsonl`):** **5 ədəd** (Zəif ehtimallar təmizləndi)

---

## 🔬 2. Auditor Meta-Mətninin Tam Təmizlənməsi (Claims Hygiene)

Tənqidinizdə haqlı olaraq vurğulandığı kimi, *«Dərslikdə təsdiqlənən elmi fakt: ...»* kimi model izahları `claims.jsonl`-dən tamamilə təmizləndi. Hər bir iddiaya rəsmi `claim_type` verildi:

| Kanonik Düyün | İddia Tipi (`claim_type`) | Dərslik İddiası (Təmiz Faktual Məzmun) | Sitat |
| :--- | :---: | :--- | :---: |
| **Tərs teorem** | `DEFINITION` | Verilmiş teoremin şərti ilə hökmünün yerini dəyişməklə alınan yeni riyazi h... | `ev_gold_0001` |
| **İkidəyişənli xətti tənlik** | `DEFINITION` | ax + by = c (a və b eyni zamanda sıfır olmayan) şəklində verilən tənlik iki... | `ev_gold_0002` |
| **Pifaqor teoremi** | `FORMULA` | Düzbucaqlı üçbucaqda katetlərin kvadratları cəmi hipotenuzun kvadratına bər... | `ev_gold_0003` |
| **Kvadrat tənlik** | `DEFINITION` | ax² + bx + c = 0 (burada a ≠ 0) şəklində olan tənlik bir dəyişənli kvadrat ... | `ev_gold_0004` |
| **Viyet teoremi** | `PROPERTY` | Çevrilmiş kvadrat tənliyin köklərinin cəmi əks işarə ilə ikinci əmsala, has... | `ev_gold_0007` |
| **Heron düsturu** | `FORMULA` | Tərəfləri a, b, c və yarımperimetri p olan üçbucağın sahəsi S = √(p(p-a)(p-... | `ev_gold_0009` |
| **Fales teoremi** | `PROPERTY` | Bucağın tərəflərini kəsən paralel düz xətlər onun tərəfləri üzərində mütəna... | `ev_gold_0011` |
| **Zülalların denaturasiyası** | `DEFINITION` | Xarici amillərin təsiri ilə zülal molekulunun təbii quruluşunun (ikincili, ... | `ev_gold_0012` |
| **Qrip** | `FACT` | Virus mənşəli kəskin yoluxucu tənəffüs yolları xəstəliyi... | `ev_gold_0013` |
| **Qızılca** | `FACT` | Səpgi və yüksək hərarətlə müşayiət olunan hava-damcı yolu ilə yayılan kəski... | `ev_gold_0014` |

---

## 🔗 3. Əlaqələrin (Edges) Təmizlənməsi və Yüksək Dəqiqlik Qaydası

Zəif və ya dolayı münasibətlər qrafdan çıxarıldı:

1. ❌ `Pifaqor teoremi` $\rightarrow$ `Heron düsturu` (`PREREQUISITE_OF`) — **Ləğv edildi.** (Heron üçbucağın üç tərəfi ilə işləyir; Pifaqor onun birbaşa ön-şərti deyil).

2. ❌ `Translyasiya` $\rightarrow$ `Zülalların denaturasiyası` (`PRECEDES`) — **Ləğv edildi.** (Sintez və struktur pozulması ardıcıl bioloji yol deyil).

3. ❌ `Gəncə müqaviləsi` $\rightarrow$ `Muğan qurultayı` (`CAUSES`) — **Ləğv edildi.** («Zəmin yaratdı» $\ne$ deterministik səbəb).


### Saxlanılan 5 Daş Kimin Möhkəm Deterministik Əlaqə (`edges.jsonl`):

| Başlanğıc (Source) | Əlaqə | Hədəf (Target) | Riyazi / Tarixi Əsaslandırma |
| :--- | :---: | :--- | :--- |
| `math_anlayis_kvadrat_tenlik` | **`PREREQUISITE_OF`** | `math_teorem_viyet` | Viyet teoremi birbaşa çevrilmiş kvadrat tənliyin kökləri üzərində təyin edilir |
| `hist_doyus_caldiran` | **`PRECEDES`** | `hist_muqavile_amasiya_1555` | Xronoloji ardıcıllıq: Çaldıran döyüşü (1514) < Amasiya sülhü (1555) |
| `hist_muqavile_amasiya_1555` | **`PRECEDES`** | `hist_muqavile_serab_1618` | Xronoloji ardıcıllıq: Amasiya (1555) < Sərab (1618) |
| `hist_muqavile_serab_1618` | **`PRECEDES`** | `hist_muqavile_qesri_sirin_1639` | Xronoloji ardıcıllıq: Sərab (1618) < Qəsri-Şirin (1639) |
| `hist_muqavile_rest_1732` | **`PRECEDES`** | `hist_muqavile_gence_1735` | Xronoloji ardıcıllıq: Rəşt müqaviləsi (1732) < Gəncə müqaviləsi (1735) |

---

## 🛡️ 4. Lineage İzləmə Sxemi (`audit/node_lineage.jsonl`)

Hər bir xammal ID-si üçün aşağıdakı tam zəncir saxlanılır:

```json
{
  "raw_id": "math_concept_onluq_kesrin_adikesre_cevrilmesiqaydasi",
  "raw_label": "Onluq kəsrin adikəsrə çevrilməsiqaydası",
  "pass1_status": "NEEDS_REVIEW",
  "pass2_status": "REVIEW_QUEUE",
  "canonical_node_id": null,
  "claim_id": null,
  "evidence_id": null,
  "destination_file": "audit/review_queue.jsonl"
}
```
