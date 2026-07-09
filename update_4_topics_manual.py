import json
import re

text_input = """Azərbaycan dili - 4 I hissə
Mövzular
Fəsil 1. FƏRD VƏ TOPLUM
Giriş
1. DOSTLUĞUN GÜCÜ
2. ÖZÜNƏ İNAN
3. ÜNSİYYƏT
4. HÜQUQLARIMIZ
Ümumiləşdirici təkrar
Fəsil 2. QARABAĞ-ANA YURDUM
Giriş
1. QARABAĞ XANLIĞI
2. YADDAN ÇIXMAZ QARABAĞ
3. QARABAĞ AZƏRBAYCANDIR!
4. QƏHRƏMANLARIMIZI TANIYAQ
Ümumiləşdirici təkrar
Fəsil 3. SEVİMLİ QƏHRƏMANLARIM
Giriş
1. VƏFALI DOST
2. DƏNİZ GÖZƏLİ
3. MACƏRALAR ALƏMİNDƏ
4. YENİLMƏZ QƏHRƏMANLAR
Ümumiləşdirici təkrar
Fəsil 4. İŞARƏLƏR VƏ SİMVOLLAR
Giriş
1. YAZIDA İŞARƏLƏR
2. MUSİQİDƏ İŞARƏLƏR
3. SİMVOLLAR
4. HƏYATIMIZDA İŞARƏLƏR
Ümumiləşdirici təkrar
1 yarımil üzrə ümumiləşdirici təkrar
İzahlı sözlük

Azərbaycan dili - 4 II hissə
Mövzular
Fəsil 5. BİRİNCİLƏR: "İLK" VƏ "ƏN"
Giriş
1. ŞƏRQDƏ İLK DƏFƏ...
2. GİNNESİN REKORDLAR KİTABI
3. AMERİKANIN KƏŞFİ
4. SÜRƏT,SÜRƏT,SÜRƏT
Ümumiləşdirici təkrar
Fəsil 6. TARİXİ ŞƏXSİYYƏTLƏR
Giriş
1. ELM DÜNYASININ ŞAHI
2. FATEHLƏR
3. ADİL HÖKMDAR
4. TARİXDƏ İZ QOYAN QADINLAR
Ümumiləşdirici təkrar
Fəsil 7. ELMİ FANTASTİKA
Giriş
1. YAD PLANETLİLƏR
2. KEÇMİŞƏ SƏYAHƏT
3. KOSMOSA SƏYAHƏT
Ümumiləşdirici təkrar
Fəsil 8. İXTİRALAR VƏ KƏŞFLƏR
Giriş
1. COĞRAFİ KƏŞFLƏR
2. SÜNİ İNTELLEKT
3. ÖLÇÜ VAHİDLƏRİ
4. TİBDƏ İXTİRALAR
İzahlı sözlük
Terminlərin izahı

Riyaziyyat - 4 I hissə
Mövzular
1. Ədədlər (1 000 000-a qədər)
Yada salın
1. Çoxrəqəmli ədədlər
2. Müqayisə və sıralama
3. Yuvarlaqlaşdırma
Ümumiləşdirici tapşırıqlar
2. Toplama və çıxma
Yada salın
4. Çoxrəqəmli ədədlərin toplanması
5. Çoxrəqəmli ədədlərin çıxılması
Məsələ və misallar
6. Toplama və çıxmanın digər üsulları
Ümumiləşdirici tapşırıqlar
3. Vurma və bölmə
Yada salın
7. Dördrəqəmli ədədin birrəqəmli ədədə vurulması
8. Çoxrəqəmli ədədin birrəqəmli ədədə vurulması
Məsələ və misallar
9. Dördrəqəmli ədədin birrəqəmli ədədə bölünməsi
10. Çoxrəqəmli ədədin birrəqəmli ədədə bölünməsi
11. Ədədin bölənləri və bölünənləri
12. Vurma və bölmənin digər üsulları
Ümumiləşdirici tapşırıqlar
4. Riyazi ifadələr. Tənlik
13. Ədədi ifadələr
14. Dəyişəni olan ifadələr
15. Tənlik
16. Tənlik qurmaqla məsələ həlli
17. Riyazi qanunauyğunluq
Ümumiləşdirici tapşırıqlar
5. Vurma və bölmə
18. İkirəqəmli ədədə vurma
19. Üçrəqəmli ədədə vurma
Məsələ və misallar
20. İkirəqəmli ədədin ikirəqəmli ədədə bölünməsi.
21. Çoxrəqəmli ədədin ikirəqəmli ədədə bölünməsi
Ümumiləşdirici tapşırıqlar
6. Həndəsi fiqurlar
Yada salın
22. Sadə həndəsi fiqurlar.Çevrə
23. Bucaq.Bucağın ölçüsü
24. Bucağın ölçülməsi.Transportir
25. Koordinat şəbəkəsi
26. Həndəsi ornamentlər
Məsələlər
27. Fəza fiqurlarının açılışı
28. Fiqurların müxtəlif tərəflərdən görünüşü
Ümumiləşdirici tapşırıqlar
1-ci yarımil üzrə ümumiləşdirici tapşırıqlar
Sözlük

Riyaziyyat - 4 II hissə
Mövzular
7. Adi və onluq kəsrlər
Yada salın
29. Bərabər kəsrlər
30. Kəsrlərin müqayisəsi
31. Məxrəcləri bərabər olan kəsrlərin toplanması və çıxılması
32. Qarışıq ədədlər
Məsələ və misallar
33. Onluq kəsrlər
34. Onluq kəsrlərin müqayisəsi
35. Onluq kəsrlərin toplanması və çıxılması
Ümumiləşdirici tapşırıqlar
Məsələ həllinin bəzi üsulları
8. Pullar
36. Pullar və onluq kəsrlər
37. Pullarla hesablamalar
38. Dəyişən və dəyişməyən xərclər
Ümumiləşdirici tapşırıqlar
9. Ölçmə
39. Uzunluq
40. Perimetr
41. Sahə
42. Kütlə və tutum
43. Həcm
Məsələlər
44. Zaman
45. Sürət
Ümumiləşdirici tapşırıqlar
10. Məlumatların təsviri
46. Cədvəl. Piktoqram
47. Dairəvi diaqram
48. Xətti diaqram
Ümumiləşdirici tapşırıqlar
4-cü sinif üzrə ümumiləşdirici tapşırıqlar
Sözlük

Həyat bilgisi - 4
Mövzular
I BÖLMƏ. CANLI HƏYAT
1. Orqanlarımız
2. Bitkilərin həyatımızda rolu
3. Heyvanların həyatımızda rolu
4. İnsan və mikroorqanizmlər
5. İnsana təsir edən amillər
6. Sağlamlığımızın qayğısına qalaq
7. Mühit amillərinin canlılara təsiri
8. Ətraf mühitin qorunması
II BÖLMƏ. FƏRD, AİLƏ VƏ CƏMİYYƏT
9. İnsan sosial varlıq kimi
10. Ailənin cəmiyyətdə rolu
11. Ailədə və kollektivdə vəzifələrimiz
12. Cəmiyyətdə ünsiyyətin rolu
13. Mənəvi keyfiyyətlərimiz
14. Mənəvi borc
15. Dini dəyərlər
III BÖLMƏ. DÖVLƏT VƏ HÜQUQ
16. Dövlət orqanları
17. Hüquqlarımız
18. Dövlət büdcəsi
19. Pullar
IV BÖLMƏ. SAĞLAMLIQ VƏ TƏHLÜKƏSİZLİK
20. Fövqəladə hallar və nişanlar
21. Fövqəladə hallarda davranış qaydaları
22. Planın çəkilməsi
23. İlk tibbi yardım
24. Yol hərəkəti qaydaları
V. HƏRƏKƏT VƏ ENERJİ
25. Coğrafi obyektlər xəritədə
26. Təbii zonalar
27. Təbii ehtiyatlar

Texnologiya - 4
Mövzular
TEXNOLOGİYALAR YƏ TEXNOLOJİ VASİTƏLƏR
Dərs 1. Texnologiyaların inkişafı
Dərs 2. İstehsalat müəssisələri və istehsal
Dərs 3. Emal texnologiyaları və vasitələri
Dərs 4. Texnoloji vasitələrin və maşınların təsnifatı. Məişət texnikası
Dərs 5. Robot texnikası
MƏİŞƏT MƏDƏNİYYƏTİ
Dərs 6. Özümüzə xidmət edək, sağlamlığımızı və ətraf mühiti qoruyaq
Dərs 7. Yemək süfrələri və onların tərtibatı
Dərs 8. Qonaq və bayram süfrələri
Dərs 9. Yemək masası ətrafında davranış qaydaları
KAĞIZ YƏ KARTONUN EMALI
Dərs 10. Cildlənmiş məmulatlar. Nazik dəftər
Dərs 11. Bədii işlər üçün çərçivə
Dərs 12. Kartondan karandaşqabının hazırlanması
Dərs 13. Xırdavat üçün mücrü
KAĞIZQATLAMA VƏ NAXIŞKƏSMƏ
Dərs 14. Kağızqatlama sxemləri
Dərs 15. Kağızdan baş geyimləri
Dərs 16. Ornamentlər
YAPMA
Dərs 17. Çoxqatlı cızma
Dərs 18. Dərinləşdirilmiş relyef
Dərs 19. Plastilin lentdən hazırlanmış kompozisiya
Dərs 20. Qabların dizaynı
TİKMƏ VƏ NAXIŞLAMA
Dərs 21. Çarpaz tikmə
Dərs 22. İlgək tikişi
Dərs 23. Dəm çayniki üçün istiliyi qoruyan gəlincik. Əlcək-gəlincik
MÜXTƏLİF MATERİALLARDAN QURAŞDIRMA
Dərs 24. Qablaşdırmanın bağlanması
Dərs 25. Bədii quraşdırma. Dizayn
Dərs 26. Papye-maşedən hazırlanmış məmulatlar
Dərs 27. Yarıqlı kilidi olan həcmli məmulatlar
Dərs 28. Dəridən məmulatların hazırlanması
Dərs 29. Plastik butulkadan məmulatlar
Dərs 30. Oduncaq, onun xassələri, tədarükü və emalı
Dərs 31. Lobziklə mişarlama
Dərs 32. Hərəkətli oyuncaqlar

İnformatika - 4
Mövzular
1. İNFORMASİYA
1. TEXNİKADA İNFORMASİYA
2. İNFORMASİYA TEXNOLOGİYALARI
3. KOMPÜTER VƏ İNFORMASİYA
4. İNFORMASİYANI ÖTÜRMƏ VASİTƏLƏRİ
5. ELEKTRON POÇT VƏ İNTERNET
Yoxlama sualları
2. ALQORİTM
MƏNTİQ
6. ƏLAMƏTLƏRİN CƏDVƏL ŞƏKLİNDƏ TƏSVİRİ
7. QRUP VƏ ALTQRUP
8. “VƏ”, “VƏ YA" SÖZLƏRİ OLAN MÜRƏKKƏB MÜLAHİZƏLƏR
9. MÜLAHİZƏLƏRİN SXEMLƏRLƏ GÖSTƏRİLMƏSİ
10. “ƏGƏR - ONDA" QAYDASI
11. MƏNTİQİ MÜHAKİMƏLƏR
ALQORİTM VƏ İCRAÇILAR
12. ALQORİTMİN İCRAÇISI
13. MƏŞHUR İCRAÇILAR
14. ALQORİTMLƏRDƏ BUDAQLANMA
15. DÖVRİ ALQORİTMLƏR
Yoxlama suallar
3. KOMPÜTERDƏ İŞ
QRAFİK REDAKTOR
16. QRAFİK REDAKTORUN ALƏTLƏRİ
17. ŞƏKLİN FORMASININ DƏYİŞDİRİLMƏSİ
18. SİMMETRİK FİQURLARIN ÇƏKİLMƏSİ
19. MOZAİKA VƏ NAXIŞLARIN QURULMASI
20. RƏSMİN ÇAP EDİLMƏSİ
21. MƏTNLİ ŞƏKİLLƏR
MƏTN REDAKTORU
22. MƏTNLƏRİN YIĞILMASI
23. MƏTNLƏRLƏ İŞ
24. MƏTNİN NİZAMLANMASI
25. SƏNƏDİN ÇAPA HAZIRLANMASI
BU KİTAB NECƏ HAZIRLANIB
Yoxlama suallar

İngilis dili - 4
Mövzular
Units
Unit 1
Unit 2
Unit 3
Unit 4
Unit 5
Unit 6
Unit 7
Unit 8

Rus dili - 4 əsas xarici dil
Mövzular
I. Что уо́сени в корзи́нке?
1. Прекра́сная пора́
2. Матери́нское напу́тствие
3. День учи́теля
4. Обобща́ющие зада́ния
II. Желéзный кулáк
5. Письмо́ солда́ту
6. Письмо́ с фро́нта
7. День Побе́ды
8. Обобща́ющие зада́ния
III. В ми́ре ска́зок
9. Путеше́ствие во Врунля́ндию. Часть I
10. Путеше́ствие во Врунля́ндию. Часть II
11. Путеше́ствие во Врунля́ндию. Часть III
12. Путеше́ствие во Врунля́ндию. Часть IV
13. Обобща́ющие зада́ния
IV. По́дмощь бли́зким
14. Дуб под окно́м
15. Кому́ же идти́ за дрова́ми?
16. Волше́бные ша́хматы
17. Обобща́ющие зада́ния
V. Сини́чкин календа́рь
18. Как зако́нчилась зима́?
19. Март
20. Весна́
21. Обобща́ющие зада́ния
VI. Уме́й дружи́ть
22. Ска́зка про жа́дность. Часть I
23. Ска́зка про жа́дность. Часть II
24. Тык-ты́к ханы́м. Часть I
25. Тык-ты́к ханы́м. Часть II

Alman dili - 4 əsas xarici dil
Mövzular
LEKTION 1. KENNENLERNEN
Stunde 1. Wer bist du?
Stunde 2. Woher kommen die Personen?
Stunde 3. Kommst du aus Baku?
Stunde 4. Wiederholung
LEKTION 2. WAS IST DEIN HOBBY?
Stunde 1. Ich höre gern Musik
Stunde 2. Spielst du gern Fußball?
Stunde 3. Mein Hobby ist Tanzen
Stunde 4. Wiederholung
LEKTION 3. WIE FINDEST DU DEUTSCH?
Stunde 1. Ich finde Musik super
Stunde 2. Sein Hobby ist Basketball spielen
Stunde 3. Die Blume ist rot
Stunde 4. Wiederholung
LEKTION 4. WOCHENTAGE
Stunde 1. Am Montag ist Mathe
Stunde 2. Wann hast du Musik?
Stunde 3. Am Freitag hat Arif Schwimmen
Stunde 4. Wiederholung
LEKTION 5. MEINE FAMILIE
Stunde 1. Ich habe einen Opa
Stunde 2. Hast du einen Bruder?
Stunde 3. Wie ist er?
Stunde 4. Wiederholung
LEKTION 6. MEINE SACHEN
Stunde 1. Was hast du?
Stunde 2. Was haben die Personen?
Stunde 3. Wie ist sein Kuli?
Stunde 4. Wiederholung

Fransız dili - 4 əsas xarici dil
Mövzular
Module 1. J'aime mon école !
Leçon 1. Youpiii, je revois mes camarades !
Leçon 2. J'habite en Azerbaïdjan
Leçon 3. Je vais à l'école à pied
Révision
Module 2. La ronde des saisons
Leçon 1. Au jardin botanique
Leçon 2. Il pleut, prends ton parapluie !
Leçon 3. Les activités amusantes par saisons
Révision
Module 3. J’ai faim
Leçon 1. Au restaurant
Leçon 2. Petit déjeuner à l'école
Leçon 3. Les règles à table
Révision
Module 4. Nos amis: les animaux!
Leçon 1. À la ferme de mon grand-père
Leçon 2. Au zoo
Leçon 3. L'animal de compagnie de 4e année
Révision
Module 5. Je me sens bien !
Leçon 1. Faisons l'exercice !
Leçon 2. Mes émotions
Leçon 3. Je vais chez le médecin
Révision
Module 6. Je découvre la France !
Leçon 1. Les curiosités de Paris
Leçon 2. Chez nos amis
Leçon 3. La fête des Rois
Révision
"""

def parse_text_to_groups(text):
    groups = []
    current_group = None
    lines = text.strip().split('\n')
    
    chapter_regex = re.compile(r'^(Fəsil\s+\d+|I+ BÖLMƏ|V\.\s|TEXNOLOGİYALAR|MƏİŞƏT|KAĞIZ|YAPMA|TİKMƏ|MÜXTƏLİF|1\. İNFORMASİYA|2\. ALQORİTM|MƏNTİQ|ALQORİTM VƏ İCRAÇILAR|3\. KOMPÜTERDƏ İŞ|QRAFİK REDAKTOR|MƏTN REDAKTORU|I+\. |LEKTION|Module\s+\d+|1\. Ədədlər|2\. Toplama|3\. Vurma|4\. Riyazi|5\. Vurma|6\. Həndəsi|7\. Adi və|8\. Pullar|9\. Ölçmə|10\. Məlumat|Units)', re.IGNORECASE)
    topic_regex = re.compile(r'^(Giriş|Ümumiləşdirici|İzahlı|Yada|Məsələ|Dərs\s+\d+|Stunde\s+\d+|Leçon\s+\d+|Unit\s+\d+|\d+\.)', re.IGNORECASE)
    
    for line in lines:
        line = line.strip()
        if not line or line.lower() == 'mövzular' or line.endswith('hissə') or 'əsas xarici dil' in line:
            continue
        
        is_chapter = False
        is_topic = False
        
        if chapter_regex.match(line):
            is_chapter = True
        elif topic_regex.match(line):
            is_topic = True
        elif line.isupper():
            is_chapter = True
        else:
            is_topic = True
            
        if is_chapter:
            if current_group:
                groups.append(current_group)
            current_group = {
                "chapter": line,
                "topics": []
            }
        elif is_topic:
            if not current_group:
                current_group = {
                    "chapter": "Ümumi",
                    "topics": []
                }
            title = re.sub(r'^(Dərs|Stunde|Leçon)\s*\d+\.\s*', '', line)
            title = re.sub(r'^\d+\.\s*', '', title)
            current_group["topics"].append({
                "title": title.strip(),
                "page": 0
            })
            
    if current_group:
        groups.append(current_group)
    
    return groups

subjects = []
current_subj = []
for line in text_input.split('\n'):
    if ' - 4 ' in line or line.startswith('Riyaziyyat') or line.startswith('Həyat bilgisi - 4') or line.startswith('Texnologiya - 4') or line.startswith('İnformatika - 4'):
        if current_subj:
            subjects.append('\n'.join(current_subj))
        current_subj = [line]
    else:
        current_subj.append(line)
if current_subj:
    subjects.append('\n'.join(current_subj))

parsed_subjects = {}

for subj_text in subjects:
    if not subj_text.strip(): continue
    lines = subj_text.strip().split('\n')
    subj_name = lines[0].strip()
    
    if 'Azərbaycan dili' in subj_name:
        if 'II hissə' in subj_name: key = 'azerbaycan-dili-4-h2'
        elif 'I hissə' in subj_name: key = 'azerbaycan-dili-4-h1'
    elif 'Riyaziyyat' in subj_name:
        if 'II hissə' in subj_name: key = 'riyaziyyat-4-h2'
        elif 'I hissə' in subj_name: key = 'riyaziyyat-4-h1'
    elif 'Həyat bilgisi' in subj_name: key = 'hayat-bilgisi-4'
    elif 'Texnologiya' in subj_name: key = 'texnologiya-4'
    elif 'İnformatika' in subj_name: key = 'informatika-4'
    elif 'İngilis dili' in subj_name: key = 'ingilis-dili-4'
    elif 'Rus dili' in subj_name: key = 'rus-dili-4'
    elif 'Alman dili' in subj_name: key = 'alman-dili-4'
    elif 'Fransız dili' in subj_name: key = 'fransiz-dili-4'
    else: key = subj_name
    
    groups = parse_text_to_groups('\n'.join(lines[1:]))
    parsed_subjects[key] = groups

import json

with open('scripts/manual-topics.json', 'r', encoding='utf-8') as f:
    db = json.load(f)

for key, val in parsed_subjects.items():
    db[key] = val

with open('scripts/manual-topics.json', 'w', encoding='utf-8') as f:
    json.dump(db, f, ensure_ascii=False, indent=2)

print("scripts/manual-topics.json updated successfully!")
