import json
import re

raw_topics = """
Bölmə 1. Natural ədədlər və onlar üzərində əməllər
İlkin yoxlama
1.1 Natural ədədlər
1.2 Müqayisə və sıralama
1.3 Natural ədədlərin yuvarlaqlaşdırılması
1.4 Natural ədədlərin toplanması va çıxılması
1.5 Natural ədədin kvadratı va kubu
1.6 Natural ədədlərin vurulması və bölünməsi
1.7 Ədədi ifadələr
1.8 Ədədin bölən və bölünənləri
Xülasə
Ümumiləşdirici tapşırıqlar
STEAM. "Parker" Günəş Zondu
Bölmə 2. Adi kəsrlər
İlkin yoxlama
2.1 Düzgün kəsrlər və düzgün olmayan kəsrlər
2.2 Müqayisə və sıralama
2.3 Məxrəcləri müxtəlif olan kəsrlərin toplanması va çıxılması
2.4 Qarışıq ədədlərin toplanması
2.5 Qarışıq ədədlərin çıxılması
Məsələ və misallar
2.6 Adi kəsrlərin vurulması
2.7 Qarışıq ədədlərin vurulması
2.8 Adi kəsrlərin bölünməsi
2.9 Qarışıq ədədlərin bölünməsi
2.10 Ədədin hissəsinin və hissəsinə görə ədədin tapılması
Xülasə
Ümumiləşdirici tapşırıqlar
STEAM. Qurama
Bölmə 3. Onluq kəsrlər
İlkin yoxlama
3.1 Onluq kəsrlər
3.2 Müqayisə və sıralama
3.3 Onluq kəsrlərin yuvarlaqlaşdırılması
3.4 Adi kəsrin onluq kəsrə, onluq kəsrin adi kəsrə çevrilməsi
3.5 Onluq kəsrlərin toplanması və çıxılması
Məsələ və misallar
3.6 Onluq kəsrlərin 10-un qüvvətlərinə vurulması və bölünməsi
3.7 Onluq kəsrın natural ədədə vurulması
3.8 Onluq kəsrlərin vurulması
3.9 Onluq kəsrin natural ədədə bölünməsi
3.10 Ədədin onluq kəsrə bölünməsi
3.11 Adi və onluq kəsrlər üzərində əməllər
Xülasə
Ümumiləşdirici tapşırıqlar
STEAM. Yüksəksürətli qatarlar
Bölmə 4. Faiz
İlkin yoxlama
4.1 Faiz, adi kəsr, onluq kəsr
4.2 Ədədin faizi
4.3 Faizə görə ədədin tapılması
4.4 Kəmiyyətin qiymətinin müəyyən faiz artırılması və azaldılması
Xülasə
Ümumiləşdirici tapşırıqlar
STEAM. Genealogiya
Birinci yarımil üzrə ümumiləşdirici tapşırıqlar
Sözlük
Cavablar
Bölmə 5. Dəyişəni olan ifadələr. Tənlik. Bərabərsizlik
İlkin yoxlama
5.1 Dəyişəni olan ifadələr
5.2 Birdəyişənli ifadələrin sadələşdirilməsi
5.3 Bərabərlik və tənlik
5.4 Tənlik qurmaqla məsələ həlli
5.5 Bərabərsizliklər
5.6 Asılı dəyişənlər və asılı olmayan dəyişənlər
Xülasə
Ümumiləşdirici tapşırıqlar
STEAM. Qlobal istiləşmə
Bölmə 6. Müstəvi fiqurlar
İlkin yoxlama
6.1 Konqruyent bucaqlar. Bucağın tənböləni
6.2 Qonşu və qarşılıqlı bucaqlar
Məsələlər
6.3 Düzbucaqlı üçbucağın sahəsi
6.4 Düzbucaqlı və düzbucaqlı üçbucaqdan təşkil olunmuş fiqurun sahəsi
6.5 Paralel və perpendikulyar düz xətlərin çəkilməsi
6.6 Üçbucağın çəkilməsi
Xülasə
Ümumiləşdirici tapşırıqlar
STEAM. Avtomobil dayanacağı
Bölmə 7. Fəza fiqurları
İlkin yoxlama
7.1 Kub və kuboidın səthinin sahəsi
7.2 Oturacağı düzbucaqlı üçbucaq olan düz prizmanın səthinin sahəsi
Məsələlər
7.3 Düz prizmanın həcmi
7.4 Sahə vahidləri
7.5 Həcm vahidləri
Xülasə
Ümumiləşdirici tapşırıqlar
STEAM. "Quşlar bizim dostlarımızdır".
Bölmə 8. Statistika və məlumatların təsviri
İlkin yoxlama
8.1 Ədədi orta
8.2 Dairəvi diaqram
8.3 Məlumatların təsviri
Xülasə
Ümumiləşdirici tapşırıqlar
STEAM. "COVİD-19" infeksiyasının yayılma statistikası
5-ci sinif üzrə ümumiləşdirici tapşırıqlar
Sözlük
Cavablar
"""

# Build mapping dictionary: 'B1F01' -> '1.1 Natural ədədlər'
topic_map = {}
for line in raw_topics.split('\n'):
    line = line.strip()
    match = re.match(r'^(\d+)\.(\d+)\s+(.+)$', line)
    if match:
        b_num = int(match.group(1))
        f_num = int(match.group(2))
        key = f"B{b_num}F{f_num:02d}"
        topic_map[key] = line

print(f"Mapped {len(topic_map)} standard topics.")

db_path = 'data/offline_tests.json'
with open(db_path, 'r', encoding='utf8') as f:
    db = json.load(f)

math5_tests = db.get('Riyaziyyat 5', [])
mapped_count = 0
unmapped_count = 0

for t in math5_tests:
    passport = t.get('passport_id', '') or t.get('topic', '')
    
    # Extract BxFyy
    match = re.search(r'(B\d+F\d+)', passport)
    if match:
        code = match.group(1)
        if code in topic_map:
            t['topic'] = topic_map[code]
            mapped_count += 1
        else:
            t['topic'] = 'Təyin edilməyib'
            unmapped_count += 1
    else:
        t['topic'] = 'Təyin edilməyib'
        unmapped_count += 1

with open(db_path, 'w', encoding='utf8') as f:
    json.dump(db, f, ensure_ascii=False, indent=2)

print(f"Successfully mapped {mapped_count} tests.")
print(f"Failed to map {unmapped_count} tests.")
