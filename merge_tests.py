import json
import uuid
import datetime

# The 9 hardcoded questions for Skelet ve ezeler
hb3_questions = [
    {
        "question": "İnsanın bədəninə forma verən və daxili orqanları qoruyan nədir?",
        "options": ["Skelet", "Dəri", "Qan", "Əzələ"],
        "answer": "Skelet",
        "explanation": "Skelet insan bədəninin dayaq nöqtəsidir, ona forma verir və orqanları xarici təsirlərdən qoruyur.",
        "difficulty": "asan",
        "topic": "Skelet və əzələlər",
        "type": "Çoxseçimli"
    },
    {
        "question": "Skeletimiz nələrdən təşkil olunmuşdur?",
        "options": ["Sümüklərdən", "Damarlardan", "Sinirlərdən", "Tüklərdən"],
        "answer": "Sümüklərdən",
        "explanation": "Skelet sistemi tamamilə müxtəlif forma və ölçüdə olan sümüklərdən ibarətdir.",
        "difficulty": "asan",
        "topic": "Skelet və əzələlər",
        "type": "Çoxseçimli"
    },
    {
        "question": "Hərəkət etməyimiz üçün skeletə nə birləşir?",
        "options": ["Əzələlər", "Dəri", "Mədə", "Ürək"],
        "answer": "Əzələlər",
        "explanation": "Əzələlər sümüklərə birləşərək onların hərəkətini təmin edir.",
        "difficulty": "orta",
        "topic": "Skelet və əzələlər",
        "type": "Çoxseçimli"
    },
    {
        "question": "Əzələlərimizi gücləndirmək üçün nə etməliyik?",
        "options": ["İdmanla məşğul olmalıyıq", "Çoxlu şirniyyat yeməliyik", "Bütün günü yatmalıyıq", "Yalnız televizora baxmalıyıq"],
        "answer": "İdmanla məşğul olmalıyıq",
        "explanation": "Aktiv həyat tərzi və idman əzələləri möhkəmləndirir.",
        "difficulty": "asan",
        "topic": "Skelet və əzələlər",
        "type": "Çoxseçimli"
    },
    {
        "question": "Hansı qida sümüklərimizin daha möhkəm olmasına kömək edir?",
        "options": ["Süd və süd məhsulları", "Çipsi və qazlı sular", "Şokolad", "Qızardılmış yeməklər"],
        "answer": "Süd və süd məhsulları",
        "explanation": "Süd və süd məhsulları kalsiumla zəngindir və sümükləri bərkidir.",
        "difficulty": "orta",
        "topic": "Skelet və əzələlər",
        "type": "Çoxseçimli"
    },
    {
        "question": "Baş beyni zədələnməkdən qoruyan hansı sümükdür?",
        "options": ["Kəllə sümüyü", "Qabırğa", "Onurğa", "Qol sümüyü"],
        "answer": "Kəllə sümüyü",
        "explanation": "Beyin kəllə qutusunun içərisində yerləşir və sümüklər onu qoruyur.",
        "difficulty": "orta",
        "topic": "Skelet və əzələlər",
        "type": "Çoxseçimli"
    },
    {
        "question": "Ürək və ağciyərləri hansı sümüklər qoruyur?",
        "options": ["Qabırğalar", "Kəllə", "Ayaq sümükləri", "Barmaq sümükləri"],
        "answer": "Qabırğalar",
        "explanation": "Döş qəfəsini təşkil edən qabırğalar ürəyi və ağciyərləri zərbələrdən qoruyur.",
        "difficulty": "çətin",
        "topic": "Skelet və əzələlər",
        "type": "Çoxseçimli"
    },
    {
        "question": "Sümüklər və əzələlər birlikdə bədənimizin hansı sistemini yaradır?",
        "options": ["Dayaq-hərəkət sistemi", "Həzm sistemi", "Tənəffüs sistemi", "Qan dövranı sistemi"],
        "answer": "Dayaq-hərəkət sistemi",
        "explanation": "Sümüklər dayaq, əzələlər hərəkət funksiyası daşıyır və birlikdə dayaq-hərəkət sistemini qurur.",
        "difficulty": "çətin",
        "topic": "Skelet və əzələlər",
        "type": "Çoxseçimli"
    },
    {
        "question": "Əgər bir insanın əzələləri zəifləyərsə, onda hansı çətinliklər yaranar?",
        "options": ["Hərəkət etməkdə və ağır əşya qaldırmaqda çətinlik çəkər", "Daha yaxşı görər", "Daha sürətli qaçar", "Daha yaxşı eşidər"],
        "answer": "Hərəkət etməkdə və ağır əşya qaldırmaqda çətinlik çəkər",
        "explanation": "Əzələ zəifliyi bilavasitə hərəkət və fiziki qüvvənin azalmasına gətirib çıxarır.",
        "difficulty": "orta",
        "topic": "Skelet və əzələlər",
        "type": "Çoxseçimli"
    }
]

def clean_str(s):
    # Fix corrupted chars from bad console output reading by subagents
    return str(s).replace('?', 'Ə').replace('t', 'ə').replace('Ǭ', 'ü').replace('o', 'Ü').replace('Y', 'ş').replace('y', 'y').replace('i', 'çi').replace('x', 'çx').replace('c', 'ç')

def fix_dict(d):
    for k, v in d.items():
        if isinstance(v, str):
            # specific manual fixes since simple replace might not be perfect
            v = v.replace('?', 'Ə').replace('t', 'ə').replace('Ǭ', 'ü').replace('o', 'Ü').replace('Y', 'ş').replace('i', 'i').replace('', 'ö').replace('ö?', 'Ə').replace('öt', 'ə').replace('öy', 'əy').replace('öz', 'öz').replace('öx', 'ç')
            v = v.replace('Söyəhət', 'Səyahət').replace('Söyahət', 'Səyahət')
            # I will just write a cleaner fix based on expected words
            v = v.replace('Styahtt', 'Səyahət').replace('oxrtqtmli', 'Çoxrəqəmli').replace('tdtdltrin', 'ədədlərin').replace('mǬqayistsi', 'müqayisəsi')
            d[k] = v
        elif isinstance(v, list):
            d[k] = [fix_dict({'v': x})['v'] if isinstance(x, str) else x for x in v]
    return d

import uuid

new_db_items = {
    'Riyaziyyat 4': [],
    'Həyat bilgisi 4': [],
    'Azərbaycan dili 3': [],
    'Həyat bilgisi 3': []
}

# Add HB 3 hardcoded
for q in hb3_questions:
    q['passport_id'] = f"3-hb-merge-{uuid.uuid4().hex[:8]}"
    q['category'] = "Həyat bilgisi 3"
    new_db_items['Həyat bilgisi 3'].append(q)

scratch_file = r'C:\Users\User\.gemini\antigravity\scratch\offline_tests.json'
with open(scratch_file, 'r', encoding='utf-8') as f:
    scratch_data = json.load(f)

for item in scratch_data:
    # Some items are wrapped in fix_dict
    topic = item.get('topic', '')
    if 'müqayisəsi' in topic or 'qayis' in topic:
        item['topic'] = 'Çoxrəqəmli ədədlərin müqayisəsi'
        item['category'] = 'Riyaziyyat 4'
        item['type'] = 'Riyaziyyat'
        new_db_items['Riyaziyyat 4'].append(item)
    elif 'çıxılması' in topic or 'xılmas' in topic:
        item['topic'] = 'Çoxrəqəmli ədədlərin çıxılması'
        item['category'] = 'Riyaziyyat 4'
        item['type'] = 'Riyaziyyat'
        new_db_items['Riyaziyyat 4'].append(item)
    elif 'Orqan' in topic:
        item['topic'] = 'Orqanlarımız'
        item['category'] = 'Həyat bilgisi 4'
        item['type'] = 'Həyat bilgisi'
        new_db_items['Həyat bilgisi 4'].append(item)
    else:
        # All others are Az Dili 3 - SƏYAHƏT
        item['topic'] = 'SƏYAHƏT'
        item['category'] = 'Azərbaycan dili 3'
        item['type'] = 'Azərbaycan dili'
        new_db_items['Azərbaycan dili 3'].append(item)

# Assign UUIDs
for cat, items in new_db_items.items():
    for item in items:
        if 'passport_id' not in item:
            item['passport_id'] = f"merged-{uuid.uuid4().hex[:8]}"

# Load main DB
main_db_path = r'data\offline_tests.json'
with open(main_db_path, 'r', encoding='utf-8') as f:
    main_db = json.load(f)

for cat, items in new_db_items.items():
    if cat not in main_db:
        main_db[cat] = []
    main_db[cat].extend(items)

with open(main_db_path, 'w', encoding='utf-8') as f:
    json.dump(main_db, f, ensure_ascii=False, indent=2)

print("Merged all tests successfully!")
