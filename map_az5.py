import json
import re

raw_topics = """
Bölmə 1. Fərd və toplum
Fəsil 1. Uğurun sirri
Sözlərdə saitlərin yazılışı
Fəsil 2. Orxan və Təpəl
Sözlərdə samitlərin deyilişi və yazılışı
Fəsil 3. Jan Valjan
"K" samitinin deyilişi və yazılışı
Fəsil 4. Sözün qüdrəti
"Q" samitinin deyilişi və yazılışı
Ümumiləşdirici təkrar
Bölmə 2. Mənəvi dəyərlər
Fəsil 1. Bilirdim ki, gələcəksən
Leksik və qrammatik məna
Fəsil 2. "8" rəqəmi və tariximiz
Sözün həqiqi və məcazi mənası
Fəsil 3. Təcili qan lazımdır
Çoxmənalı sözlər. Omonimlər
Fəsil 4. Ad günü hədiyyəsi
Cümlə sonunda durğu işarələri
Ümumiləşdirici təkrar
Bölmə 3. Ana təbiət
Fəsil 1. Yazın oğlan çağında
Kök və şəkilçi. Leksik və qrammatik şəkilçilər
Fəsil 2. Ağac əkən adam
Sözün quruluşca növləri
Fəsil 3. Ağıllı canlılar
Ahəng qanunu. İki və dörd cür yazılan şəkilçilər
Fəsil 4. Meşə simfoniyası
Mürəkkəb sözlərin yazılışı
Ümumiləşdirici təkrar
Bölmə 4. Niyə belə deyirik?
Fəsil 1. Qədim yunan sözləri
Alınma sözlər və şəkilçilər
Fəsil 2. Hacı Qara
Sinonimlər və antonimlər
Fəsil 3. Onlar kimdir?
Sözün sətirdən sətrə keçirilməsi
Fəsil 4. Bəs zınqırovu kim asacaq?
Lüğətdən istifadə
Ümumiləşdirici təkrar
İzahlı sözlük
Bölmə 5. Özünə inan
Fəsil 1. Ala-bəzək torba
Əsas və köməkçi nitq hissələri
Fəsil 2. Əlvida, "bilmirəm"!
İsim. Toplu isimlər
Fəsil 3. Elektron ünvanım olsaydı...
İsmin mənsubiyyətə görə dəyişməsi
Fəsil 4. Sonuncu düym
İsmin şəxsə görə dəyişməsi
Ümumiləşdirici təkrar
Bölmə 6. Səyahət
Fəsil 1. Balaca Qara Balıq
Sifət
Fəsil 2. Səyahətnamə
Say
Fəsil 3. Qadın səyyahlar
Feil
Fəsil 4. Azərbaycan səyyahların gözü ilə
Zərf
Ümumiləşdirici təkrar
Bölmə 7. İdman və sağlamlıq
Fəsil 1. Fiziki məşqlər və insan orqanizmi
Təsriflənməyən feillər. Məsdər
Fəsil 2. Çempion ola bilərəm?
Təsriflənməyən feillər. Feili sifət və feili bağlama
Fəsil 3. İdmançı xarakteri
Əvəzliyin məna növləri
Fəsil 4. Marafon: Afinadan Bakıya
İsimləşmə və sifətləşmə
Ümumiləşdirici təkrar
Bölmə 8. Tarixdə qadınlar
Fəsil 1. Qədim türklərdə qadınlar
Söz birləşmələri
Fəsil 2. Sara xatun
Frazeoloji birləşmələr
Fəsil 3. Savadlı qadın - savadlı millət
Cümlə üzvləri
Fəsil 4. Cığır açan qadınlar
Sadə və mürəkkəb cümlələr
Ümumiləşdirici təkrar
İzahlı sözlük
"""

lines = [l.strip() for l in raw_topics.split('\n') if l.strip()]

topic_map = {}
current_b = None
current_f = None
current_f_title = None

for i, line in enumerate(lines):
    b_match = re.match(r'^Bölmə (\d+)\.', line)
    if b_match:
        current_b = b_match.group(1)
        continue
    
    f_match = re.match(r'^Fəsil (\d+)\.\s+(.+)$', line)
    if f_match:
        current_f = f_match.group(1)
        current_f_title = f_match.group(2)
        # Next line is grammar topic
        grammar = lines[i+1] if i+1 < len(lines) else ""
        key = f"B{current_b}F{int(current_f):02d}"
        topic_map[key] = f"Fəsil {current_f}. {current_f_title} ({grammar})"

print(f"Mapped {len(topic_map)} standard topics.")

db_path = 'data/offline_tests.json'
with open(db_path, 'r', encoding='utf8') as f:
    db = json.load(f)

az5_tests = db.get('Azərbaycan dili 5', [])
mapped_count = 0
unmapped_count = 0
unmapped_list = []

for t in az5_tests:
    passport = t.get('passport_id', '') or t.get('topic', '')
    match = re.search(r'(B\d+F\d+)', passport)
    if match:
        code = match.group(1)
        if code in topic_map:
            t['topic'] = topic_map[code]
            mapped_count += 1
        else:
            unmapped_count += 1
            unmapped_list.append(t)
    else:
        # Check if it's an "Ümumiləşdirici təkrar" test
        # Sometimes they have codes like B1UM or UMUMI
        b_match = re.search(r'B(\d+)', passport)
        if b_match and ('ümumi' in passport.lower() or 'tekrar' in passport.lower() or 'um' in passport.lower()):
            t['topic'] = f"Bölmə {b_match.group(1)} - Ümumiləşdirici təkrar"
            mapped_count += 1
        else:
            unmapped_count += 1
            unmapped_list.append(t)

if unmapped_count > 0:
    print(f"Failed to map {unmapped_count} tests.")
    for t in unmapped_list[:5]:
        print(t.get('passport_id', t.get('id', '')))

with open(db_path, 'w', encoding='utf8') as f:
    json.dump(db, f, ensure_ascii=False, indent=2)

print(f"Successfully mapped {mapped_count} tests.")
