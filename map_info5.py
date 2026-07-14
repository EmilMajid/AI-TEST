import json
import re

raw_topics = """
Giriş
Dərsliklə necə işləməli?
1. İNFORMASİYA
1.1. İnformasiya nədir
1.2. İnformasiyanın kodlaşdırılması
1.3. İnformasiya modeli
1.4. İnformasiyanı ölçmək olarmı?
Ümumiləşdirici sual və tapşırıqlar
2. KOMPÜTER
2.1. Fərdi kompüterlər
2.2. Kompüter necə işləyir
2.3. İş masası
2.4. Menyu
2.5. Fayllar və qovluqlar
2.6. Pəncərə
Ümumiləşdirici sual və tapşırıqlar
3. TƏTBİQİ PROQRAMLAR
3.1. Kompüterdə şəkil çəkirəm
3.2. Şəklin fraqmenti ilə iş
3.3. Fraqmentin əyilməsi və döndərilməsi
3.4. Mətn redaktoru
3.5. Şəkilli mətnlər
3.6. Mətn redaktorunda şəkli necə çəkmək olar
Ümumiləşdirici sual və tapşırıqlar
4. ALQORİTM VƏ PROQRAM
4.1. Alqoritm
4.2. Alqoritmi necə təqdim etmək olar
4.3. Əyləncəli məsələlər
4.4. Proqram nədir
4.5. Bağa işə başlayır
4.6. Bağa sadə fiqurlar çəkir
Ümumiləşdirici sual və tapşırıqlar
5. İNTERNET
5.1. İnformasiya resursları
5.2. İnternet
5.3. Dünya hörümçək toru
5.4. İnternetdə informasiyanın axtarışı
Ümumiləşdirici sual və tapşırıqlar
"""

lines = [l.strip() for l in raw_topics.split('\n') if l.strip()]

topic_map = {}
current_b = None

for line in lines:
    b_match = re.match(r'^(\d+)\.\s+([A-ZƏŞÇÖÜİIĞ\s]+)$', line)
    if b_match:
        current_b = b_match.group(1)
        continue
    
    f_match = re.match(r'^(\d+)\.(\d+)\.\s+(.+)$', line)
    if f_match:
        b_num = f_match.group(1)
        f_num = f_match.group(2)
        title = f_match.group(3)
        key = f"B{b_num}F{int(f_num):02d}"
        topic_map[key] = f"{b_num}.{f_num}. {title}"

print(f"Mapped {len(topic_map)} standard topics.")

db_path = 'data/offline_tests.json'
with open(db_path, 'r', encoding='utf8') as f:
    db = json.load(f)

info5_tests = db.get('İnformatika 5', [])
mapped_count = 0
unmapped_count = 0
unmapped_list = []

for t in info5_tests:
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
        b_match = re.search(r'B(\d+)', passport)
        if b_match and ('ümumi' in passport.lower() or 'tekrar' in passport.lower() or 'um' in passport.lower() or 'sual' in passport.lower() or 'tapşırıq' in passport.lower()):
            t['topic'] = f"Bölmə {b_match.group(1)} - Ümumiləşdirici sual və tapşırıqlar"
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
