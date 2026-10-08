# SİTG Standartı (Milli AI Test Generasiya Standartı)

Bütün test generasiya və təsdiq edici (Validator) agentlər aşağıdakı **SİTG Standartlarına** şərtsiz əməl etməlidir:

## SƏVİYYƏ 0: Platforma Missiyası
- Biliyi deyil, bacarığı ölçmək.
- Əzbərçiliyin qarşısını almaq.

## SƏVİYYƏ 1: Universal Testologiya Standartı
1. **Validlik və Etibarlılıq:** Ölçülən bacarıqla cavab arasında birbaşa əlaqə.
2. **Əzbərçiliyin Qarşısının Alınması (Gizli Məlumat Qadağası):** Suallar tərif yox, tətbiq və hesablama tələb etməlidir.
3. **Bloom Taksonomiyası:** Təhlil və Tətbiq səviyyəli suallara üstünlük verilməlidir.
4. **Distraktor Standartı:** Yanlış variantlar (A,B,C,D) uydurma olmamalı, tipik tələbə səhvlərinə əsaslanmalı və bir-birini məntiqi kəsməməlidir.
5. **Vahidlik:** Eyni terminologiya, 4 variant (A,B,C,D), və 1 doğru cavab prinsipi hər sual üçün mütləqdir.

(Səviyyə 2 və 3 xüsusi fənn generatorlarının daxili prinsipləridir və onların öz agent təlimatlarında yerləşir).

## SƏVİYYƏ 4: KAG Universal Remediation & Epistemik Təhlükəsizlik Konstitusiyası (Frozen v1.0)
1. **UNKNOWN > WRONG:** Sübut olunmayan heç bir əlaqə `ACTIVE` ola bilməz. Təsdiqlənməmiş ehtimal təqdim etməkdənsə, heç bir xəritələmə etməmək (`NO_VALIDATED_PREREQUISITE`) sistemin normal və dürüst nəticəsidir.
2. **RULES ARE DOMAIN-SPECIFIC. PROOF STANDARD IS UNIVERSAL:** Qaydalar fənnə görə dəyişə bilər, lakin hər hansı asılılığın `ACTIVE` statusu alması üçün tələb olunan sübut standartı bütün 14 fənn üçün mütləq və dəyişməzdir.
3. **KAG "Ən yaxın bilik" axtarmır:** "Ən oxşar mövzu", "əvvəlki dərs" (previous_lesson) və ya "leksik yaxın söz" axtarışı qəti qadağandır.
4. **Qəti Qadağan Olunan Fallback-lar:** `candidates[0]`, `previous_lesson`, `nearest_topic`, `same_strand_fallback`, `cross_subject_fallback` istehsalatda qəti qadağandır (`STRICT_INVARIANT_VIOLATION`).
5. **Qrafların Ayrılması:** Curriculum Graph (Dərslik mündəricatı) $\neq$ Knowledge Graph (Önşərt asılılığı) $\neq$ Student Diagnostic Graph (Səhv modeli).
6. **Constraint != Prerequisite:** Riyazi/fiziki məhdudiyyət şərtləri (məs: domain-range uyğunluğu, $m > 0$) heç vaxt remediation edge yarada bilməz.
7. **Adversarial Fail-Fast:** 56 Universal Adversarial Testdən biri belə səhvən `ACTIVE` alarsa, CI/CD dərhal dayanır.
Ətraflı rəsmi sənəd: `docs/KAG_UNIVERSAL_REMEDIATION_CONSTITUTION.md`.