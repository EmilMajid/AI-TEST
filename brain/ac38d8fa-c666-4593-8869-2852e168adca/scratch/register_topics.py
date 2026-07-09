import json

topics_11 = [
  {
    "chapter": "1. İNFORMASİYA SİSTEMLƏRİ",
    "topics": [
      { "title": "1.1. informasiya sistemi və onun elementləri", "page": 1 },
      { "title": "1.2. informasiya sistemlərinin təsnifatı", "page": 2 },
      { "title": "1.3. Coğrafi informasiya sistemləri", "page": 3 },
      { "title": "1.4. Süni intellekt", "page": 4 },
      { "title": "1.5. Ekspert sistemləri", "page": 5 },
      { "title": "1.6. Axtarış sistemləri", "page": 6 },
      { "title": "1.7. \"Böyük verilənlər\"texnologiyası", "page": 7 },
      { "title": "1.8. informasiya cəmiyyəti", "page": 8 },
      { "title": "Ümumiləşdirici sual və tapşırıqlar", "page": 9 }
    ]
  },
  {
    "chapter": "2. MODELLƏŞDİRMƏ",
    "topics": [
      { "title": "2.1. Kompüter modelləşdirməsi", "page": 10 },
      { "title": "2.2. Elektron cədvəl proqramında modelləşdirmə", "page": 11 },
      { "title": "2.3. Statistik verilənlər əsasında proseslərin modelləşdirilməsi", "page": 12 },
      { "title": "2.4. Proqramlaşdırma dillərinin köməyi ilə riyazi məsələlərin modelləşdirilməsi", "page": 13 },
      { "title": "2.5. Üçölçülü qrafik modellər", "page": 14 },
      { "title": "Ümumiləşdirici sual və tapşırıqlar", "page": 15 }
    ]
  },
  {
    "chapter": "3. VERİLƏNLƏR BAZASI",
    "topics": [
      { "title": "3.1. Layihə və onun mərhələləri", "page": 16 },
      { "title": "3.2. Verilənlər bazasının layihələndirilməsi", "page": 17 },
      { "title": "3.3. \"Tələbələr\" verilənlər bazası layihəsi", "page": 18 },
      { "title": "3.4. \"Azərbaycan kinosu\" verilənlər bazası", "page": 19 },
      { "title": "Ümumiləşdirici sual və tapşırıqlar", "page": 20 }
    ]
  },
  {
    "chapter": "4. ŞƏBƏKƏ TEXNOLOGİYALARI",
    "topics": [
      { "title": "4.1. Şəbəkədə kompüterlərin \"ünsiyyəti\"", "page": 21 },
      { "title": "4.2. Şəbəkə arxitekturası", "page": 22 },
      { "title": "4.3. Simsiz şəbəkə texnologiyaları", "page": 23 },
      { "title": "4.4. Mobil rabitə texnologiyaları", "page": 24 },
      { "title": "4.5. internet xidmətləri", "page": 25 },
      { "title": "Ümumiləşdirici sual və tapşırıqlar", "page": 26 }
    ]
  },
  {
    "chapter": "5. KOMPÜTER",
    "topics": [
      { "title": "5.1. idarəetmə paneli", "page": 27 },
      { "title": "5.2. Səsin idarə edilməsi", "page": 28 },
      { "title": "5.3. Kompüterin elektrik enerjisi sərfiyyatının idarə edilməsi", "page": 29 },
      { "title": "5.4. İstifadəçi hesabları və ailə təhlükəsizliyi", "page": 30 },
      { "title": "5.5. Kompüterin uzaqdan idarə edilməsi", "page": 31 },
      { "title": "Ümumiləşdirici sual və tapşırıqlar", "page": 32 }
    ]
  },
  {
    "chapter": "6. VEB-LAYİHƏ",
    "topics": [
      { "title": "6.1. Veb-sayt layihəsi", "page": 33 },
      { "title": "6.2. Word proqramında veb-səhifənin hazırlanması", "page": 34 },
      { "title": "6.3. Excel cədvəllərinin veb-səhifə kimi saxlanması", "page": 35 },
      { "title": "6.4. PowerPoint proqramında veb-təqdimat", "page": 36 },
      { "title": "6.5. Saytların internetdə nəşri və onların qiymətləndirilməsi", "page": 37 },
      { "title": "Ümumiləşdirici sual və tapşırıqlar", "page": 38 }
    ]
  },
  {
    "chapter": "LAYİHƏLƏR ÜÇÜN YARDIMÇI MATERİALLAR",
    "topics": [
      { "title": "A. Hesablama texnikasının tarixi", "page": 39 },
      { "title": "B. Kompüterlərin nəsilləri", "page": 40 },
      { "title": "C. Məntiqi əməllər", "page": 41 },
      { "title": "D. Kompüterin məntiqi əsasları", "page": 42 },
      { "title": "E. Məntiqi məsələlərin həlli", "page": 43 }
    ]
  },
  {
    "chapter": "\"İNFORMATİKA\" KURSU ÜZRƏ TESTLƏR",
    "topics": [
      { "title": "1. informasiya və informasiya prosesləri", "page": 44 },
      { "title": "2. Saysistemləri", "page": 45 },
      { "title": "3. informasiyanın kodlaşdırılması və miqdarının ölçülməsi", "page": 46 },
      { "title": "4. Modelləşdirmə", "page": 47 },
      { "title": "5. Kompüterin aparat və proqram təminatı", "page": 48 },
      { "title": "6. Elektron cədvəllər", "page": 49 },
      { "title": "7. Verilənlər bazası", "page": 50 },
      { "title": "8. Alqoritm", "page": 51 },
      { "title": "9. Proqramlaşdırma", "page": 52 },
      { "title": "10. Kompüter şəbəkələri", "page": 53 },
      { "title": "11. internet", "page": 54 },
      { "title": "12. Veb-proqramlaşdırma", "page": 55 },
      { "title": "Terminlər lüğəti", "page": 56 }
    ]
  }
]

with open('scripts/manual-topics.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

data['informatika-11'] = topics_11

with open('scripts/manual-topics.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("SUCCESS: Registered informatika-11 in manual-topics.json")
