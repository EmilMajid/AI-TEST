import json
import re

db = json.load(open('data/offline_tests.json', encoding='utf8'))
tests = db.get('Ədəbiyyat 5', [])

keywords = [
    (r'ana maral', '1. Ana maral (əfsanə)'),
    (r'xalq öz vətənini|quru daşı', '1. Xalq öz vətənini necə tapdı (Şimali Amerika əfsanəsi)'),
    (r'yetim i̇brahim|yetim ibrahim', '1. Yetim İbrahimin nağılı'),
    (r'üç qardaş', '1. Üç qardaş (özbək nağılı)'),
    
    (r'əhməd cavad|azərbaycan! azərbaycan!|himn', '2. Əhməd Cavad. Azərbaycan! Azərbaycan!'),
    (r'əli tudə|yaşayanlar görəcəkdir', '2. Əli Tudə. Yaşayanlar görəcəkdir'),
    (r'hüseyn arif|analar|ana məhəbbəti', '2. Hüseyn Arif. Analar'),
    
    (r'ənvər əlibəyli|i̇lan və qurbağa|ilan və qurbağa', '3. Ənvər Əlibəyli. İlan və Qurbağa'),
    (r'cek london|kiş', '3. Cek London. Kiş haqqında hekayət'),
    
    (r'xəlil rza|oğul həsrəti', '4. Xəlil Rza Ulutürk. Oğul həsrəti'),
    (r'maqsud i̇brahimbəyov|maqsud ibrahimbəyov|püstə ağacı', '4. Maqsud İbrahimbəyov. Püstə ağacı'),
    (r'elçin hüseynbəyli|firuzə qaşlı xəncər', '4. Elçin Hüseynbəyli. Firuzə qaşlı xəncər'),
    
    (r'əhməd cəmil|can nənə, bir nağıl de|can nənə', '5. Əhməd Cəmil. Can nənə, bir nağıl de'),
    (r'mark tven|fərasətli oğlan', '5. Mark Tven. Fərasətli oğlan'),
    
    (r'nizami gəncəvi|kərpickəsən|kərpic kəsən', '6. Nizami Gəncəvi. Kərpickəsən kişinin dastanı'),
    (r'süleyman rəhimov|qara torpaq və sarı qızıl|qara torpaq|qara torpağı', '6. Süleyman Rəhimov. Qara torpaq və sarı qızıl'),
    
    (r'abdulla şaiq|köç', '7. Abdulla Şaiq. Köç'),
    (r'səməd vurğun|çinarın şikayəti', '7. Səməd Vurğun. Çinarın şikayəti'),
    (r'fikrət qoca|şuşa', '7. Fikrət Qoca. Şuşa')
]

unmapped_list = []
mapped_count = 0
for t in tests:
    text = (t.get('question', '') + ' ' + t.get('explanation', '')).lower()
    mapped = False
    for pattern, top in keywords:
        if re.search(pattern, text):
            t['topic'] = top
            mapped = True
            mapped_count += 1
            break
    if not mapped:
        t['topic'] = 'Təyin edilməyib'
        unmapped_list.append(t)

print(f'Mapped: {mapped_count}')
print(f'Unmapped: {len(unmapped_list)}')

with open('data/offline_tests.json', 'w', encoding='utf8') as f:
    json.dump(db, f, ensure_ascii=False, indent=2)

topics = {}
for t in tests:
    tp = t.get('topic')
    topics[tp] = topics.get(tp, 0) + 1
for k, v in sorted(topics.items(), key=lambda x: -x[1]):
    print(f'- {k}: {v} test')
