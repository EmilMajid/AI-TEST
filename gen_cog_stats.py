import json
from collections import Counter

syllabus = [
    'Coğrafiya 6 (1-ci hissə)',
    'Mövzular',
    'Bölmə 1. MƏKANI TANIYAQ',
    '1.1 Məkan',
    'Harada yaşayırıq?',
    'Coğrafi məkan necə fərqlənir?',
    'Yaşadığımız məkanı necə fərqləndirmək olar?',
    'Dəyərləndirmə',
    '1.2 Məkanın miqyası',
    'Məkanın miqyası fərqlənirmi?',
    'Lokal məkandan qlobal məkana',
    'Ölkəmizdən dünyaya',
    'Dəyərləndirmə',
    'Ümumiləşdirici tapşırıqlar',
    'Bölmə 2. MƏKANIN BƏLƏDÇİSİ',
    '2.1. Məkanın təsvir edilməsi',
    'Plan tərtib etmək üçün hansı biliklər tələb olunur?',
    'Planın tərtib edilməsi',
    'Dəyərləndirmə',
    '2.2. Məkanın kodlaşdırılması',
    'Planetimiz necə təsvir edilir?',
    'Dərəcə torunun elementləri',
    'Xəritə necə tərtib edilir?',
    'Xəritələr niyə müxtəlif rənglərdə çəkilir?',
    'Müasir xəritələr necə tərtib edilir?',
    'Coğrafi informasiya sistemlərindən harada istifadə olunur?',
    'Dəyərləndirmə',
    'Ümumiləşdirici tapşırıqlar',
    'Bölmə 3. ÇÖL TƏDQİQATI',
    '3.1. Ərazidə tədqiqat',
    'Çöl tədqiqatı nədir?',
    'Tədqiqat çantanız varmı?',
    'Məktəb ərazisində çöl tədqiqatını necə aparmaq olar?',
    'Dəyərləndirmə',
    'Ümumiləşdirici tapşırıqlar',
    'Bölmə 4. KAİNATI SEYR EDİRƏM',
    '4.1. Nə üçün səma cisimlərinə maraq göstəririk?',
    'Səmanı seyr edərkən nələri görürük?',
    'Yerin öz oxu ətrafında hərəkəti',
    'Yerin Günəş ətrafında hərəkəti',
    'Ay',
    'Çin mütəxəssislərinin uğurları',
    'Dəyərləndirmə',
    'Ümumiləşdirici tapşırıqlar',
    'SÖZLÜK',
    'Coğrafiya 6 (2-ci hissə)',
    'Mövzular',
    'Bölmə 5. TƏBİƏTİ KƏŞF EDİRƏM',
    '5.1. Təbiətdəki müxtəliflik',
    'Yer kürəsinin təbii mənzərəsi',
    'Təbiətdə hansı komponentlər var?',
    'Təbii komponentlər fərqli mənzərələr yaradır',
    'Dəyərləndirmə',
    '5.2. Təbiət bir sistemdir',
    'Təbii sistemin formalaşması',
    'Fotosintezin coğrafiyası',
    'Manqr meşələri lokal təbii sistemdir',
    'Dəyərləndirmə',
    'Ümumiləşdirici tapşırıqlar',
    'Bölmə 6. YURDUMUZUN TƏBİƏTİNƏ SƏYAHƏT',
    '6.1. Ölkəmizin təbiətini tanıyaq',
    'Təbiətimizin zənginlikləri',
    'Azərbaycan təbiətinin formalaşmas',
    'Şirvan qoruğu nə üçün yaradıldı?',
    'Dəyərləndirmə',
    'Ümumiləşdirici tapşırıqlar',
    'Bölmə 7. DÜNYA BİZİM EVİMİZDİR!',
    '7.1. Yer kürəsinin sosial mənzərəsi',
    'Sosial həyat nədir?',
    'Fərdlər sosial həyatın əsasıdır',
    'Ailə kiçik dövlətdir',
    'Cəmiyyət sosial həyatın əsas hissəsidir',
    'Dövlət cəmiyyətin siyasi qurumudur',
    'Novruz şənlikləri',
    'Dəyərləndirmə',
    '7.2. Cəmiyyətin inkişafında qurumların rolu',
    'İş mühiti və sosial həyat',
    'Qeyri-hökumət təşkilatları',
    'Şirkətlərin sosial həyatdakı rolu',
    'Dəyərləndirmə',
    '7.3. Lokal və qlobal əlaqələr',
    'Vətəndaşın vəzifələri',
    'Milli məsuliyyət hissi',
    'Dünya həqiqətən də böyükdürmü?',
    'Azərbaycanın dünya dövlətləri ilə münasibətləri',
    'Dəyərləndirmə',
    'Ümumiləşdirici tapşırıqlar',
    'SÖZLÜK'
]

with open('data/offline_tests.json', 'r', encoding='utf8') as f:
    db = json.load(f)

tests = db.get('Coğrafiya 6', [])
topics = Counter([t.get('topic', 'Unknown').strip() for t in tests])

with open('cog_6_stats.txt', 'w', encoding='utf8') as f:
    for topic in syllabus:
        if topic in ['Coğrafiya 6 (1-ci hissə)', 'Coğrafiya 6 (2-ci hissə)', 'Mövzular', 'SÖZLÜK']:
            f.write(f'{topic}\n')
        else:
            match_count = 0
            for k, v in topics.items():
                if k.lower() == topic.lower():
                    match_count += v
            f.write(f'{topic} - {match_count} test\n')
print('Done!')
