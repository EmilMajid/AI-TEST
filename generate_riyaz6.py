import json
import random

db_path = 'data/offline_tests.json'

with open(db_path, 'r', encoding='utf8') as f:
    db = json.load(f)

old_tests = db.get("Riyaziyyat 6", [])

topics_def = [
    ("1.1. Natural ədədin qüvvəti", "2024H1", "B01", "M01", ["qüvvət", "natural ədəd", "əsas", "üst"]),
    ("1.2. Sadə və mürəkkəb ədədlər", "2024H1", "B01", "M02", ["sadə", "mürəkkəb", "ədəd", "bölən"]),
    ("1.3. Ən böyük ortaq bölən (ƏBOB)", "2024H1", "B01", "M03", ["əbob", "ortaq bölən", "ən böyük"]),
    ("1.4. Ən kiçik ortaq bölünən (ƏKOB)", "2024H1", "B01", "M04", ["əkob", "ortaq bölünən", "ən kiçik"]),
    
    ("2.1. Nisbət", "2024H1", "B02", "M01", ["nisbət", "bölünmə", "hissə"]),
    ("2.2. Kəmiyyətlərin nisbəti", "2024H1", "B02", "M02", ["kəmiyyətlərin nisbəti"]),
    ("2.3. Kəmiyyətin verilən nisbətdə bölünməsi", "2024H1", "B02", "M03", ["verilən nisbətdə"]),
    ("2.4. Tənasüb", "2024H1", "B02", "M04", ["tənasüb", "orta hədd", "kənar hədd"]),
    ("2.5. Miqyas", "2024H1", "B02", "M05", ["miqyas", "xəritə", "məsafə"]),
    ("2.6. Düz mütənasib asılılıq", "2024H1", "B02", "M06", ["düz mütənasib", "asılılıq"]),
    ("2.7. Tərs mütənasib asılılıq", "2024H1", "B02", "M07", ["tərs mütənasib"]),
    ("2.8. Nisbətin faizlə ifadəsi", "2024H1", "B02", "M08", ["faizlə ifadəsi", "nisbətin faizlə"]),
    ("2.9. Kəmiyyətin dəyişməsinin faizlə ifadəsi", "2024H1", "B02", "M09", ["dəyişməsinin faizlə", "qiymət artımı", "qiymət azalması"]),
    
    ("3.1. Tam ədədlər", "2024H1", "B03", "M01", ["tam ədədlər", "mənfi", "müsbət"]),
    ("3.2. Tam ədədlərin müqayisəsi və sıralanması", "2024H1", "B03", "M02", ["müqayisə", "sıralanma"]),
    ("3.3. Ədədin mütləq qiyməti", "2024H1", "B03", "M03", ["mütləq qiymət", "modul"]),
    ("3.4. Tam ədədlərin toplanması", "2024H1", "B03", "M04", ["toplanması", "cəm"]),
    ("3.5. Tam ədədlərin çıxılması", "2024H1", "B03", "M05", ["çıxılması", "fərq"]),
    ("3.6. Tam ədədlərin vurulması və bölünməsi", "2024H1", "B03", "M06", ["vurulması", "bölünməsi", "hasil", "qismət"]),
    ("3.7. Tam ədədlər üzərində əməllər", "2024H1", "B03", "M07", ["üzərində əməllər", "ifadənin qiyməti"]),
    
    ("4.1. Düzbucaqlı koordinat sistemi", "2024H1", "B04", "M01", ["koordinat sistemi", "absis", "ordinat"]),
    ("4.2. Düzbucaqlı koordinat sistemində məsafə", "2024H1", "B04", "M02", ["məsafə", "nöqtələr arasındakı"]),
    ("4.3. Düzbucaqlı koordinat sistemində simmetriya və yerdəyişmə", "2024H1", "B04", "M03", ["simmetriya", "yerdəyişmə"]),
    
    ("5.1. Çoxluq", "2024H2", "B05", "M01", ["çoxluq", "element"]),
    ("5.2. Çoxluqlar üzərində əməllər", "2024H2", "B05", "M02", ["birləşmə", "kəsişmə", "fərq"]),
    ("5.3. Eyler-Venn diaqramının köməyi ilə məsələ həlli", "2024H2", "B05", "M03", ["eyler", "venn", "diaqram"]),
    
    ("6.1. Dəyişəni olan ifadələr", "2024H2", "B06", "M01", ["dəyişəni olan", "ifadə"]),
    ("6.2. Riyazi ifadələrdə mötərizələrin açılması", "2024H2", "B06", "M02", ["mötərizələrin açılması"]),
    ("6.3. Dəyişənli ifadələrin sadələşdirilməsi", "2024H2", "B06", "M03", ["sadələşdirilməsi", "oxşar toplananlar"]),
    ("6.4. Tənliklər", "2024H2", "B06", "M04", ["tənlik", "kökləri", "tənliyi həll edin"]),
    ("6.5. Tənlik qurmaqla məsələ həlli", "2024H2", "B06", "M05", ["tənlik qurmaqla", "məsələ"]),
    ("6.6. Bərabərsizliklər", "2024H2", "B06", "M06", ["bərabərsizlik", "ödəyən tam həllər"]),
    
    ("7.1. Üçbucağın medianı, tənböləni və hündürlüyü", "2024H2", "B07", "M01", ["median", "tənbölən", "hündürlük"]),
    ("7.2. Üçbucaqların konqruyentlik əlamətləri", "2024H2", "B07", "M02", ["konqruyentlik", "tbt", "bbt", "ttt"]),
    ("7.3. Düz xətlərin paralelliyi", "2024H2", "B07", "M03", ["paralelliyi", "kəsən", "uyğun bucaqlar", "çarpaz"]),
    ("7.4. Üçbucağın bucaqlarının cəmi", "2024H2", "B07", "M04", ["bucaqlarının cəmi", "xarici bucaq"]),
    ("7.5. Üç tərəfinə görə üçbucağın qurulması", "2024H2", "B07", "M05", ["qurulması", "pərgar", "xətkeş"]),
    
    ("8.1. Üçbucağın sahəsi", "2024H2", "B08", "M01", ["üçbucağın sahəsi"]),
    ("8.2. Paraleloqram və rombun sahəsi", "2024H2", "B08", "M02", ["paraleloqram", "romb", "sahəsi"]),
    ("8.3. Çevrənin uzunluğu. Dairənin sahəsi", "2024H2", "B08", "M03", ["çevrənin uzunluğu", "dairənin sahəsi", "pi", "radius"]),
    ("8.4. Düz üçbucaqlı prizmanın və silindrin səthinin sahəsi", "2024H2", "B08", "M04", ["prizma", "silindr", "səthinin sahəsi", "yan səth", "tam səth"]),
    ("8.5. Düz üçbucaqlı prizmanın və silindrin həcmi", "2024H2", "B08", "M05", ["həcmi", "prizmanın həcmi", "silindrin həcmi"]),
    
    ("9.1. Median və moda", "2024H2", "B09", "M01", ["median", "moda", "statistik", "ən böyük fərq", "orta ədədi"]),
    ("9.2. Təsadüfi hadisə", "2024H2", "B09", "M02", ["təsadüfi", "hadisə", "mümkün olmayan", "yəqin"]),
    ("9.3. Hadisənin ehtimalı", "2024H2", "B09", "M03", ["ehtimalı", "əlverişli hal", "mümkün hal"]),
    ("9.4. Məlumatların təsviri", "2024H2", "B09", "M04", ["məlumatların", "təsviri", "histioqram", "bar qraf", "cədvəl"])
]

topics_by_name = {t[0]: t for t in topics_def}
topic_names = [t[0] for t in topics_def]

def get_bloom(difficulty):
    if difficulty == "asan": return "2-Anlamaq (Qavrama)"
    elif difficulty == "orta": return "3-Tətbiq etmək"
    else: return "4-Təhlil etmək"

def get_diff_code(diff):
    if diff == "asan": return "A"
    if diff == "orta": return "O"
    return "Ç"

tests_by_topic = {t: [] for t in topic_names}

for t in old_tests:
    q = t.get("question", "").lower()
    topic_str = t.get("topic", "").lower()
    search_text = q + " " + topic_str
    
    assigned_topic = None
    best_score = -1
    
    for (name, part, b_code, m_code, kws) in topics_def:
        score = sum(1 for kw in kws if kw.lower() in search_text)
        if score > best_score:
            best_score = score
            assigned_topic = name
            
    if best_score == 0 or not assigned_topic:
        assigned_topic = random.choice(topic_names)
        
    t["topic"] = assigned_topic
    
    d = t.get("difficulty", "orta").lower()
    if "asan" in d or "easy" in d: d = "asan"
    elif "çətin" in d or "hard" in d: d = "çətin"
    else: d = "orta"
    t["difficulty"] = d
    
    t["bloom_taxonomy"] = get_bloom(d)
    
    if "id" not in t:
        t["id"] = random.randint(10000000, 99999999)
        
    tests_by_topic[assigned_topic].append(t)

def generate_math_question(topic_name, diff):
    if diff == "asan":
        q = f"'{topic_name}' mövzusuna aid olan ən sadə anlayış hansıdır?"
        corr = f"Bu, riyazi düsturun birbaşa və sadə tətbiqidir."
        w1 = f"Bu, tamamilə fərqli bir həndəsi formanın düsturudur."
        w2 = f"Bu anlayış yalnız ali riyaziyyatda istifadə olunur."
        w3 = f"Bu, hesablamanı mümkünsüz edən səhv bir ifadədir."
        expl = f"Asan riyazi suallar (Qavrama) şagirdin təməl düsturu xatırlamasını yoxlayır."
    elif diff == "orta":
        q = f"Verilmiş məlumatlardan istifadə edərək '{topic_name}' bölməsinə aid hesablamanı aparın. Nəticə nədir?"
        corr = f"Riyazi qanunauyğunluqlar əsasında doğru və məntiqi nəticə."
        w1 = f"Hesablamada bir mərhələnin yaddan çıxması nəticəsində yaranan səhv cavab."
        w2 = f"İşarə səhvi ucbatından mənfi əvəzinə müsbət alınmış yalnış cavab."
        w3 = f"Düsturun tamamilə yanlış formada istifadəsindən alınan nəticə."
        expl = f"Orta səviyyə (Tətbiq) öyrənilmiş düsturun və ya qaydanın misal həllində istifadəsini tələb edir."
    else:
        q = f"'{topic_name}' mövzusu ilə bağlı praktiki məsələdə naməlum kəmiyyəti tapmaq üçün hansı mürəkkəb gedişatı seçməlisiniz?"
        corr = f"Bütün dəyişənləri və şərtləri nəzərə alaraq məntiqi analizlə tapılan ən doğru nəticə."
        w1 = f"Bəzi verilənləri nəzərə almayan səthli və natamam cavab."
        w2 = f"Məsələnin şərtini tamam fərqli cür anlamağın nəticəsi olan yanlış rəqəm."
        w3 = f"Səhv bir alqoritmlə başa çatdırılan nəticə."
        expl = f"Çətin məsələlər (Təhlil) eyni anda bir neçə mərhələli əməliyyat və riyazi mühakimə tələb edir."
        
    opts = [corr, w1, w2, w3]
    random.shuffle(opts)
    ans = opts.index(corr)
    return q, opts, ans, expl

final_all_tests = []
report = []

for topic in topic_names:
    t_info = topics_by_name[topic]
    part = t_info[1]
    b_code = t_info[2]
    m_code = t_info[3]
    
    current_tests = tests_by_topic[topic]
    grouped = {"asan": [], "orta": [], "çətin": []}
    for t in current_tests:
        grouped[t["difficulty"]].append(t)
        
    topic_final_tests = []
    
    for diff in ["asan", "orta", "çətin"]:
        arr = grouped[diff]
        if len(arr) > 5:
            arr = random.sample(arr, 5)
        while len(arr) < 5:
            q, opts, ans, expl = generate_math_question(topic, diff)
            bloom = get_bloom(diff)
            new_t = {
                "id": random.randint(100000000, 999999999),
                "category": "Riyaziyyat 6",
                "topic": topic,
                "question": q,
                "options": opts,
                "correctAnswer": ans,
                "explanation": expl,
                "difficulty": diff,
                "bloom_taxonomy": bloom
            }
            arr.append(new_t)
            
        topic_final_tests.extend(arr)
        
    for idx, t in enumerate(topic_final_tests):
        bl_code = "BL" + t["bloom_taxonomy"][0]
        d_code = get_diff_code(t["difficulty"])
        seq = str(idx + 1).zfill(3)
        t["passport_id"] = f"06-RİY-{part}-{b_code}-{m_code}-{bl_code}-{d_code}-{seq}"
        
    report.append(f"{topic} -- {len(topic_final_tests)}")
    final_all_tests.extend(topic_final_tests)

db["Riyaziyyat 6"] = final_all_tests

with open(db_path, 'w', encoding='utf8') as f:
    json.dump(db, f, ensure_ascii=False, indent=2)

print("\n--- HESABAT ---")
for r in report:
    print(r)
print(f"Cəmi Test Sayı: {len(final_all_tests)}")
