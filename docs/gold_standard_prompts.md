# 🎯 Gold Standard Test Generation - İxtisaslaşmış Fənn Promt Şablonları

> **Məqsəd:** Hər fənn üçün yüksək keyfiyyətli, kontekst-əsaslı test tapşırıqları yaratmaq

## 📋 Ümumi Struktur

Hər şablon aşağıdakı dəyişənləri istifadə edir:

- **{Mövzu}** - Konkret mövzu adı
- **{Sinif}** - Tələbə səviyyəsi (V-XI)
- **{Testin Məqsədi}** - Nəyi ölçmək istəyirik
- **{Bloom Səviyyəsi}** - Xatırlama / Anlama / Tətbiq / Təhlil / Qiymətləndirmə / Yaradıcılıq
- **{Çətinlik}** - Asan / Orta / Çətin
- **{Mənbə}** - Dərslik səhifə / RAG chunk ID

---

## ⚠️ KRİTİK QAYDALAR (Bütün Fənlər Üçün)

```
🚫 ANTI-HALLUCINATION QAYDASI:
1. Yalnız verilmiş kontekstdəki faktlardan istifadə et
2. Kontekstdə olmayan məlumat əlavə ETMƏ
3. Əgər kontekst kifayət deyilsə, "Məlumat çatışmır" cavabı ver
4. Ümumi biliklərindən istifadə etmə

✅ KEYFİYYƏT STANDARTLARI:
1. Bloom Taksonomiyası: Sadə xatırlama yox, anlama və tətbiq
2. Distraktorlar: İnandırıcı və məntiqi səhvlər (aşkar yanlış yox)
3. Sual Əsası: Tam və aydın (inkar suallardan qaçın)
4. Düzgün Cavab: Yalnız 1 ən yaxşı variant
```

---

## 1️⃣ Azərbaycan Dili və Ədəbiyyat

**Sualı Hazırlayan:** Müəllim  
**Mövzu:** {Məsələn: "Sintaksis", "XIX əsr Azərbaycan ədəbiyyatı", "Şeir analizi"}  
**Tələbə Səviyyəsi:** {V-IX sinif}  
**Testin Məqsədi:** {Dil qaydalarını anlama / Ədəbi analiz bacarığı / Mətn şərh etmə}  
**Bloom Səviyyəsi:** {Anlama / Tətbiq / Təhlil}  
**Çətinlik:** {Asan / Orta / Çətin}  
**Mənbə Məlumat:** {Dərslik səhifə X-Y / RAG chunk_id}  
**Sual Tipi:** Çoxcavablı test (4 variant)

**Promt:**
```
Azərbaycan dili və ədəbiyyatından {Mövzu} mövzusunda, {Sinif} sinif səviyyəsi üçün bir sual yarat.

Kontekst (Mənbə): {Verilmiş mətn}

Sual {Testin Məqsədi} məqsədinə xidmət etsin və {Bloom Səviyyəsi} səviyyəsində olsun.

Sual Əsası: [Nümunə: 'Aşağıdakı cümlələrdən hansında təyin tam tərkib hissəsi kimi işlənib?']

Cavab Variantları (1 düzgün, 3 inandırıcı fırıldaqçı):
A) [Seçim A]
B) [Seçim B]
C) [Seçim C]
D) [Seçim D]

JSON Format:
{
  "question": "...",
  "options": ["A", "B", "C", "D"],
  "correct_index": 0,
  "bloom_level": "Anlama",
  "difficulty": "Orta",
  "explanation": {
    "correct": "Düzgün cavabın əsaslandırılması",
    "distractors": {
      "A": "Niyə səhvdir",
      "B": "Niyə səhvdir",
      "C": "Niyə səhvdir"
    }
  },
  "metadata": {
    "subject": "azerbaycan-dili",
    "grade": 6,
    "topic_id": "...",
    "source_chunks": ["chunk_123"]
  }
}
```

---

## 2️⃣ Riyaziyyat (Riyaziyyat, Cəbr, Həndəsə)

**Sualı Hazırlayan:** Müəllim  
**Mövzu:** {Məsələn: "Kvadrat tənliklər", "Üçbucaqların oxşarlığı", "Törəmə"}  
**Tələbə Səviyyəsi:** {V-IX sinif / X-XI sinif}  
**Testin Məqsədi:** {Hesablama bacarığı / Məsələ həll etmə / Həndəsi təfəkkür}  
**Bloom Səviyyəsi:** {Tətbiq / Təhlil}  
**Çətinlik:** {Asan / Orta / Çətin}  
**Sual Tipi:** Çoxcavablı test (5 variant)

**Promt:**
```
Riyaziyyat ({Mövzu}) mövzusunda, {Sinif} sinif səviyyəsi üçün bir sual yarat.

Sual {Testin Məqsədi} bacarığını ölçsün və {Bloom Səviyyəsi} səviyyəsində olsun.

Sual Əsası: [Nümunə: 'Tərəfləri 6 sm və 8 sm olan düzbucaqlının diaqonalının uzunluğu neçə sm-dir?']

Cavab Variantları (1 düzgün, 4 inandırıcı fırıldaqçı - ümumi hesablama səhvlərini əks etdirən):
A) [Seçim A]
B) [Seçim B]
C) [Seçim C]
D) [Seçim D]
```

---

## 3️⃣ Xarici Dil (İngilis/Rus/Alman/Fransız)

**Sualı Hazırlayan:** Müəllim  
**Mövzu:** {Məsələn: "Present Perfect Tense", "Sifət və zərflər", "Mətn başa düşmə"}  
**Tələbə Səviyyəsi:** {V-IX sinif / X-XI sinif}  
**Testin Məqsədi:** {Qrammatik anlama / Lüğət bilikləri / Oxuduğunu başa düşmə}  
**Bloom Səviyyəsi:** {Anlama / Tətbiq}  
**Çətinlik:** {Asan / Orta / Çətin}  
**Sual Tipi:** Çoxcavablı test (4 variant)

**Promt:**
```
Xarici dil ({Mövzu}) mövzusunda, {Sinif} sinif səviyyəsi üçün bir sual yarat.

Sual {Testin Məqsədi} məqsədinə xidmət etsin.

Sual Əsası: [Nümunə: 'Choose the correct word to complete the sentence: She _____ to the library every weekend.']

Cavab Variantları (1 düzgün, 3 inandırıcı fırıldaqçı - qarışıq zamanlar, səhv qrammatik quruluşlar):
A) [Seçim A]
B) [Seçim B]
C) [Seçim C]
D) [Seçim D]
```

---

## 4️⃣ Tarix (Azərbaycan Tarixi, Ümumi Tarix)

**Sualı Hazırlayan:** Müəllim  
**Mövzu:** {Məsələn: "Azərbaycan Xalq Cümhuriyyəti", "İkinci Dünya Müharibəsi", "Orta əsrlər"}  
**Tələbə Səviyyəsi:** {V-IX sinif / X-XI sinif}  
**Testin Məqsədi:** {Tarixi faktları bilmə / Səbəb-nəticə əlaqələrini təhlil etmə}  
**Bloom Səviyyəsi:** {Anlama / Təhlil}  
**Çətinlik:** {Asan / Orta / Çətin}  
**Mənbə Məlumat:** {Dərslik səhifə X-Y / RAG chunk_id}  
**Sual Tipi:** Çoxcavablı test (4 variant)

**Promt:**
```
Tarix ({Mövzu}) mövzusunda, {Sinif} sinif səviyyəsi üçün bir sual yarat.

⚠️ KRİTİK: Yalnız verilmiş kontekstdəki faktlardan istifadə et!

Kontekst (Mənbə): {Verilmiş mətn}

Sual {Testin Məqsədi} məqsədinə xidmət etsin.

Sual Əsası: [Nümunə: '1918-ci ildə Azərbaycan Xalq Cümhuriyyətinin yaradılmasının əsas səbəblərindən biri aşağıdakılardan hansı idi?']

Cavab Variantları (1 düzgün, 3 inandırıcı fırıldaqçı - tarixi anlama səhvləri, digər dövrlərə aid hadisələr):
A) [Seçim A]
B) [Seçim B]
C) [Seçim C]
D) [Seçim D]
```

---

## 5️⃣ Coğrafiya

**Sualı Hazırlayan:** Müəllim  
**Mövzu:** {Məsələn: "İqlim qurşaqları", "Azərbaycanın iqtisadi coğrafiyası", "Dünya okeanları"}  
**Tələbə Səviyyəsi:** {V-IX sinif / X-XI sinif}  
**Testin Məqsədi:** {Coğrafi anlayışları bilmə / Xəritə oxuma bacarığı / Təbii hadisələri şərh etmə}  
**Bloom Səviyyəsi:** {Anlama / Tətbiq}  
**Çətinlik:** {Asan / Orta / Çətin}  
**Sual Tipi:** Çoxcavablı test (4 variant)

**Promt:**
```
Coğrafiya ({Mövzu}) mövzusunda, {Sinif} sinif səviyyəsi üçün bir sual yarat.

Sual {Testin Məqsədi} məqsədinə xidmət etsin.

Sual Əsası: [Nümunə: 'Aşağıdakı iqlim tipi hansı qitə üçün xarakterikdir: musson iqlimi?']

Cavab Variantları (1 düzgün, 3 inandırıcı fırıldaqçı - başqa iqlim tipləri, səhv coğrafi regionlar):
A) [Seçim A]
B) [Seçim B]
C) [Seçim C]
D) [Seçim D]
```

---

## 6️⃣ Təbiət Fənləri (Fizika, Kimya, Biologiya)

**Sualı Hazırlayan:** Müəllim  
**Mövzu:** {Məsələn: "Elektrik dövrələri", "Kimyəvi reaksiyalar", "Hüceyrə quruluşu"}  
**Tələbə Səviyyəsi:** {V-IX sinif / X-XI sinif}  
**Testin Məqsədi:** {Konseptual anlama / Eksperimental nəticələri təhlil etmə / Düsturları tətbiq etmə}  
**Bloom Səviyyəsi:** {Anlama / Tətbiq / Təhlil}  
**Çətinlik:** {Asan / Orta / Çətin}  
**Sual Tipi:** Çoxcavablı test (5 variant)

**Promt:**
```
{Fizika/Kimya/Biologiya} ({Mövzu}) mövzusunda, {Sinif} sinif səviyyəsi üçün bir sual yarat.

Sual {Testin Məqsədi} məqsədinə xidmət etsin.

Sual Əsası: [Nümunə: 'Aşağıdakılardan hansı fotosintez zamanı baş verən əsas prosesdir?']

Cavab Variantları (1 düzgün, 4 inandırıcı fırıldaqçı - ümumi anlama səhvləri, əlaqəsiz proseslər):
A) [Seçim A]
B) [Seçim B]
C) [Seçim C]
D) [Seçim D]
```

---

## 7️⃣ İnformatika

**Sualı Hazırlayan:** Müəllim  
**Mövzu:** {Məsələn: "Alqoritmlər", "Proqramlaşdırma (Python, Pascal)", "Şəbəkə texnologiyaları"}  
**Tələbə Səviyyəsi:** {V-IX sinif / X-XI sinif}  
**Testin Məqsədi:** {Alqoritmik təfəkkür / Proqram kodu başa düşmə / Terminologiya bilikləri}  
**Bloom Səviyyəsi:** {Anlama / Tətbiq / Təhlil}  
**Çətinlik:** {Asan / Orta / Çətin}  
**Sual Tipi:** Çoxcavablı test (4 variant)

**Promt:**
```
İnformatika ({Mövzu}) mövzusunda, {Sinif} sinif səviyyəsi üçün bir sual yarat.

Sual {Testin Məqsədi} məqsədinə xidmət etsin.

Sual Əsası: [Nümunə: 'Aşağıdakı proqramlaşdırma dillərindən hansı obyekt-yönümlüdür?']

Cavab Variantları (1 düzgün, 3 inandırıcı fırıldaqçı - başqa paradigmalar, köhnə texnologiyalar):
A) [Seçim A]
B) [Seçim B]
C) [Seçim C]
D) [Seçim D]
```

---

## 8️⃣ Təsviri İncəsənət / Musiqi / Texnologiya

**Sualı Hazırlayan:** Müəllim  
**Mövzu:** {Məsələn: "Rəng nəzəriyyəsi", "Musiqi janrları", "Ağac emalı alətləri"}  
**Tələbə Səviyyəsi:** {V-IX sinif}  
**Testin Məqsədi:** {Əsas biliklər / Praktik bacarıqlar / Tarixi kontekst}  
**Bloom Səviyyəsi:** {Xatırlama / Anlama / Tətbiq}  
**Çətinlik:** {Asan / Orta / Çətin}  
**Sual Tipi:** Çoxcavablı test (4 variant)

**Promt:**
```
{Təsviri İncəsənət/Musiqi/Texnologiya} ({Mövzu}) mövzusunda, {Sinif} sinif səviyyəsi üçün bir sual yarat.

Sual {Testin Məqsədi} məqsədinə xidmət etsin.

Sual Əsası: [Nümunə: 'Aşağıdakı rəng cütlərindən hansı kontrast (tamamlayıcı) rənglər sayılır?']

Cavab Variantları (1 düzgün, 3 inandırıcı fırıldaqçı):
A) [Seçim A]
B) [Seçim B]
C) [Seçim C]
D) [Seçim D]
```

---

## 9️⃣ Fiziki Tərbiyə

**Sualı Hazırlayan:** Müəllim  
**Mövzu:** {Məsələn: "Olimpiya hərəkatı", "Komanda idman növləri", "Sağlam həyat tərzi"}  
**Tələbə Səviyyəsi:** {V-IX sinif / X-XI sinif}  
**Testin Məqsədi:** {Qaydaları bilmə / Sağlamlıq prinsipləri / Tarixi məlumatlar}  
**Bloom Səviyyəsi:** {Xatırlama / Anlama}  
**Çətinlik:** {Asan / Orta / Çətin}  
**Sual Tipi:** Çoxcavablı test (4 variant)

**Promt:**
```
Fiziki tərbiyə ({Mövzu}) mövzusunda, {Sinif} sinif səviyyəsi üçün bir sual yarat.

Sual {Testin Məqsədi} məqsədinə xidmət etsin.

Sual Əsası: [Nümunə: 'Yerimə zamanı düzgün vəziyyəti qorumaq üçün aşağıdakılardan hansı vacibdir?']

Cavab Variantları (1 düzgün, 3 inandırıcı fırıldaqçı):
A) [Seçim A]
B) [Seçim B]
C) [Seçim C]
D) [Seçim D]
```

---

## 🔟 Həyat Bilgisi

**Sualı Hazırlayan:** Müəllim  
**Mövzu:** {Məsələn: "Təhlükəsiz həyat qaydaları", "Mədəniyyət və davranış normaları", "Ətraf mühitə qayğı"}  
**Tələbə Səviyyəsi:** {V sinif}  
**Testin Məqsədi:** {Gündəlik həyat bilikləri / Sosial məsuliyyət / Təhlükəsizlik}  
**Bloom Səviyyəsi:** {Anlama / Tətbiq}  
**Çətinlik:** {Asan / Orta}  
**Sual Tipi:** Çoxcavablı test (4 variant)

**Promt:**
```
Həyat bilgisi ({Mövzu}) mövzusunda, {Sinif} sinif səviyyəsi üçün bir sual yarat.

Sual {Testin Məqsədi} məqsədinə xidmət etsin.

Sual Əsası: [Nümunə: 'Yanğın zamanı ilk növbədə nə etmək lazımdır?']

Cavab Variantları (1 düzgün, 3 inandırıcı fırıldaqçı - ümumi səhv tədbirlər):
A) [Seçim A]
B) [Seçim B]
C) [Seçim C]
D) [Seçim D]
```

---

## 1️⃣1️⃣ Çağırışaqədərki Hazırlıq

**Sualı Hazırlayan:** Müəllim  
**Mövzu:** {Məsələn: "Vətəndaşlıq vəzifələri", "Hərbi xidmət qaydaları", "Fiziki hazırlıq normaları"}  
**Tələbə Səviyyəsi:** {X-XI sinif}  
**Testin Məqsədi:** {Vətəndaşlıq bilikləri / Hərbi əsaslar / Fiziki hazırlıq}  
**Bloom Səviyyəsi:** {Xatırlama / Anlama}  
**Çətinlik:** {Asan / Orta}  
**Sual Tipi:** Çoxcavablı test (4 variant)

**Promt:**
```
Çağırışaqədərki hazırlıq ({Mövzu}) mövzusunda, {Sinif} sinif səviyyəsi üçün bir sual yarat.

Sual {Testin Məqsədi} məqsədinə xidmət etsin.

Sual Əsası: [Nümunə: 'Azərbaycan Respublikasının hərbi qulluğa çağırış yaşı neçədir?']

Cavab Variantları (1 düzgün, 3 inandırıcı fırıldaqçı):
A) [Seçim A]
B) [Seçim B]
C) [Seçim C]
D) [Seçim D]
```

---

## 📊 İstifadə Nümunəsi (Python İnteqrasiyası)

```python
def generate_test_question(subject, topic, grade, context):
    """
    Gold Standard şablonuna əsasən test sualı yaradır
    """
    template = GOLD_STANDARD_PROMPTS[subject]
    
    prompt = template.format(
        Mövzu=topic,
        Sinif=grade,
        Kontekst=context,
        Testin_Məqsədi="Anlama və tətbiq bacarığı",
        Bloom_Səviyyəsi="Anlama",
        Çətinlik="Orta"
    )
    
    response = llm_generate(prompt)
    
    # Anti-hallucination yoxlaması
    if not validate_context_alignment(response, context):
        return {"error": "Kontekstə uyğun olmayan cavab"}
    
    return response
```

---

## 🎓 Yekun Qeydlər

1. **Kontekst İzolyasiyası:** Hər sual YALNIZ verilmiş mövzunun məlumatlarından yaradılmalıdır
2. **Keyfiyyət Nəzarəti:** Hər yaradılan sual Bloom Taksonomiyası və distractor keyfiyyəti üzrə yoxlanılmalıdır
3. **Metadata İzləmə:** Hər sual üçün mənbə chunk ID-ləri saxlanılmalıdır (audit üçün)
4. **İnsan Nəzarəti:** LLM cavabları mütləq müəllim tərəfindən yoxlanılmalıdır

---

**Versiya:** 1.0  
**Tarix:** 2026-01-27  
**Status:** ✅ Təsdiq edilib
