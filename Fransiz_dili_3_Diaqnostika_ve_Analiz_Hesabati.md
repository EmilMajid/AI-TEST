# 🇫🇷 Fransız dili 3 — Rəsmi Dərslik Əsasında Tam Dərin Analiz və Diaqnostika Hesabatı

**Dərslik Mənbəyi:** Azərbaycan Respublikası Elm və Təhsil Nazirliyinin Rəsmi Dərsliyi:  
📖 **"Fransız dili – 3-cü sinif"**  
✍️ **Müəllif:** Çinarə Babaxanova (Ç. Babaxanova)  
🏢 **Nəşriyyat:** "Kövsər" nəşriyyatı  
🌐 **Elektron Dərslik Portalı Keçidi:** [e-derslik.edu.az — Kitab ID: 672](https://www.e-derslik.edu.az/player/index3.php?book_id=672#books/672/units/unit-1/page6.xhtml)

---

## 1. Dərslik Arxitekturası və Mövcud Bazanın Dəqiq Auditi

Rəsmi **Ç.Babaxanova — "Fransız dili 3" (Kövsər nəşriyyatı, ID: 672)** dərsliyi 6 əsas Unité (Bölmə) və 19 konkret dərsdən ibarətdir.

Platformanın test bazasında (`offline_tests.json`) mövcud olan 375 sual məhz bu dərslikdəki 19 dərsin adları ilə yazılmışdır. Lakin paylanmada ciddi disbalans yaranmışdır:

### 🔍 Dərslik üzrə Faktiki Mövzu və Sual Paylanması Cədvəli

| Dərslik Bölməsi (Unité) | Dərslikdəki Orijinal Dərs Başlığı | Dərslik Səhifələri | Bazadakı Mövcud Sual Sayı | Faktiki Problem / Kəsir |
| :--- | :--- | :---: | :---: | :--- |
| **Unité 1** | 1. Mon alphabet | Səh. 6 – 13 | **111 sual** | Həddindən artıq şişirdilib (bütün sualların 30%-i) |
| *(Bonjour!)* | 2. Comment t'appelles-tu? | Səh. 14 – 17 | 15 sual | Standart |
| | 3. Quel âge as-tu? | Səh. 18 – 21 | 15 sual | Standart |
| | 4. Ça va très bien! | Səh. 22 – 25 | 15 sual | Standart |
| **Unité 2** | 5. Je présente ma famille | Səh. 26 – 29 | 18 sual | Qeyri-bərabər |
| *(Ma famille)* | 6. Mes parents | Səh. 30 – 33 | 15 sual | Standart |
| | 7. Chez mon oncle | Səh. 34 – 37 | 15 sual | Standart |
| **Unité 3** | 8. Ma classe | Səh. 38 – 41 | 15 sual | Standart |
| *(Mon école)* | 9. Dans mon cartable | Səh. 42 – 45 | 15 sual | Standart |
| | 10. J'aime le français et toi? | Səh. 46 – 49 | **5 sual** | Ciddi kəsir (10 sual çatmır) |
| **Unité 4** | 11. Notre jardin | Səh. 50 – 53 | 15 sual | Standart |
| *(L'environnement)* | 12. Des vitamines | Səh. 54 – 57 | 15 sual | Standart |
| | 13. Le supermarché | Səh. 58 – 61 | 15 sual | Standart |
| **Unité 5** | 14. Les quatre saisons | Səh. 62 – 65 | 16 sual | Qeyri-bərabər |
| *(Saisons et fêtes)* | 15. Bon anniversaire! | Səh. 66 – 69 | 15 sual | Standart |
| | 16. Les drapeaux | Səh. 70 – 73 | 15 sual | Standart |
| **Unité 6** | 17. Les enfants différents | Səh. 74 – 77 | 15 sual | Standart |
| *(Amis et lecture)* | 18. Mes amis | Səh. 78 – 81 | 15 sual | Standart |
| | 19. Hourraa! Je lis en français | Səh. 82 – 88 | 15 sual | Standart |
| **CƏMİ** | **19 Dərs** | **88 Səhifə** | **375 Sual** | **Struktur tənzimlənməlidir** |

---

## 2. Dərslik Məzmununa Əsaslanan Standartlaşdırma Planı (Gold Standard 4.1)

Ç.Babaxanovanın "Fransız dili 3" (Kövsər nəşriyyatı, ID: 672) dərsliyindəki bütün 19 dərsi və onların daxilindəki leksik-qrammatik alt-mövzuları dərslik ardıcıllığı ilə bərabər və simmetrik şəkildə strukturlaşdırırıq:

```
                            ┌────────────────────────────────────────────────────────┐
                            │    Ç. BABAXANOVA — FRANSIZ DİLİ 3 (KÖVSƏR / ID: 672)   │
                            │                 DƏRSLİK STRUKTURU                      │
                            └───────────────────────────┬────────────────────────────┘
                                                        │
         ┌──────────────────────────────┬───────────────┴──────────────┬──────────────────────────────┐
         │                              │                              │                              │
         ▼                              ▼                              ▼                              ▼
┌──────────────────┐          ┌──────────────────┐           ┌──────────────────┐           ┌──────────────────┐
│ UNITÉ 1:         │          │ UNITÉ 2:         │           │ UNITÉ 3:         │           │ UNITÉ 4:         │
│ BONJOUR!         │          │ MA FAMILLE       │           │ MON ÉCOLE        │           │ NOTRE JARDIN     │
│ (Səh. 6 - 25)    │          │ (Səh. 26 - 37)   │           │ (Səh. 38 - 49)   │           │ (Səh. 50 - 61)   │
├──────────────────┤          ├──────────────────┤           ├──────────────────┤           ├──────────────────┤
│• Alphabet/Sons   │          │• Ma famille      │           │• Ma classe       │           │• Notre jardin    │
│• Tu t'appelles   │          │• Mes parents     │           │• Dans mon cartabl│           │• Des vitamines   │
│• Quel âge as-tu? │          │• Chez mon oncle  │           │• J'aime français │           │• Le supermarché  │
│• Ça va très bien!│          │• Nombres 20-40   │           │• Les couleurs    │           │• Les aliments    │
└──────────────────┘          └──────────────────┘           └──────────────────┘           └──────────────────┘
```

---

## 3. Rəsmi Dərslik Əsasında Dəqiq Mövzu Xəritəsi

### 📘 UNITÉ 1: Bonjour! / Premiers pas (Səh. 6 – 25)
1. **MON ALPHABET — LES LETTRES ET LES SONS** *(Fransız əlifbası, sait və samit səslər, vurğu işarələri: é, è, ê, ç — Səh. 6-13)*
2. **COMMENT T'APPELLES-TU? — SE PRÉSENTER** *(Ad soruşma və özünü təqdim etmə, hecalama: Je m'appelle... — Səh. 14-17)*
3. **QUEL ÂGE AS-TU? — LES NOMBRES DE 1 À 20** *(1-dən 20-yə qədər saylar və yaş: J'ai huit ans — Səh. 18-21)*
4. **ÇA VA TRÈS BIEN! — LES SALUTATIONS ET POLITESSE** *(Salamlaşma və əhval soruşma: Ça va? Merci, au revoir — Səh. 22-25)*

### 📘 UNITÉ 2: Ma famille et mes proches (Səh. 26 – 37)
5. **JE PRÉSENTE MA FAMILLE** *(Ailə üzvləri: le père, la mère, le frère, la sœur — Səh. 26-29)*
6. **MES PARENTS ET LEURS MÉTIERS** *(Valideynlər, nənə-baba və peşələr: médecin, professeur — Səh. 30-33)*
7. **CHEZ MON ONCLE — LA GRANDE FAMILLE** *(Əmi/dayı, bibi/xala, kuzenlər və 20-40 sayları — Səh. 34-37)*

### 📘 UNITÉ 3: Mon école et ma classe (Səh. 38 – 49)
8. **MA CLASSE ET LE MOBILIER** *(Sinif otağı, parta, lövhə, stul, pəncərə, qapı — Səh. 38-41)*
9. **DANS MON CARTABLE — LES AFFAIRES SCOLAIRES** *(Məktəb ləvazimatları: le livre, le stylo, la règle, la gomme — Səh. 42-45)*
10. **J'AIME LE FRANÇAIS ET TOI? — LES COULEURS ET LES GOÛTS** *(Rənglər və sevimli dərslər: rouge, bleu, vert, jaune — Səh. 46-49)*

### 📘 UNITÉ 4: Notre environnement et les aliments (Səh. 50 – 61)
11. **NOTRE JARDIN — LA NATURE ET LES PLANTES** *(Həyətimiz, bağça, güllər və ağaclar — Səh. 50-53)*
12. **DES VITAMINES — LES FRUITS ET LES LÉGUMES** *(Meyvə və tərəvəzlər: la pomme, la poire, la carotte, la tomate — Səh. 54-57)*
13. **LE SUPERMARCHÉ — LES ALIMENTS ET LES ACHATS** *(Ərzaqlar: le pain, le fromage, le lait, l'eau, alış-veriş dialoqları — Səh. 58-61)*

### 📘 UNITÉ 5: Les saisons, le temps et les fêtes (Səh. 62 – 73)
14. **LES QUATRE SAISONS ET LA MÉTÉO** *(Dörd fəsil və hava şəraiti: le printemps, l'été, l'automne, l'hiver — Səh. 62-65)*
15. **BON ANNIVERSAIRE! — LES FÊTES ET LES CADEAUX** *(Ad günü, tort, şamlar, Novruz və Yeni il şənliyi — Səh. 66-69)*
16. **LES DRAPEAUX — LES PAYS ET LES NATIONALITÉS** *(Dövlət bayraqları, ölkələr və milliyyətlər: l'Azerbaïdjan, la France — Səh. 70-73)*

### 📘 UNITÉ 6: Les amis, la tolérance et la lecture (Səh. 74 – 88)
17. **LES ENFANTS DIFFÉRENTS — LA TOLÉRANCE** *(Müxtəlif ölkələrin uşaqları, dostluq və həmrəylik — Səh. 74-77)*
18. **MES AMIS — LES JEUX ET LES ACTIVITÉS** *(Dostlarla oyunlar, asudə vaxt: jouer au ballon, chanter — Səh. 78-81)*
19. **HOURRAA! JE LIS EN FRANÇAIS — BILAN ANNUEL** *(Mətn oxusu, şeirlər, nağıllar və ilin yekun təkrarları — Səh. 82-88)*

---

## 4. İcra Tələbləri (Gold Standard 4.1)

1. **Dərslik Səhifələrinə Dəqiq İstinad:** Hər bir sualın izahında Ç.Babaxanovanın dərsliyinin konkret səhifəsi və dərsi göstəriləcək.
2. **100% Variant Simmetriyası:** Variantlar vizual olaraq eyni həcmdə və qrammatik struktura malik olacaq.
3. **25% Balanslı Cavab Açarları:** $A, B, C, D$ variantları bərabər paylanacaq.
4. **İkidilli İzah:** Fransız dili qrammatik qaydası qeyd olunmaqla Azərbaycan dilində aydın izah veriləcək.
