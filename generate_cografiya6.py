import json
import random

db_path = 'data/offline_tests.json'

with open(db_path, 'r', encoding='utf8') as f:
    db = json.load(f)

old_tests = db.get("Coğrafiya 6", [])

topics_def = [
    # Hissə 1
    ("1.1 Məkan", "2024H1", "B01", "M01", ["məkan", "harada yaşayırıq", "coğrafi məkan"]),
    ("1.2 Məkanın miqyası", "2024H1", "B01", "M02", ["miqyas", "lokal", "qlobal", "dünyaya"]),
    ("2.1. Məkanın təsvir edilməsi", "2024H1", "B02", "M01", ["təsvir", "plan", "tərtib"]),
    ("2.2. Məkanın kodlaşdırılması", "2024H1", "B02", "M02", ["kodlaşdırılma", "xəritə", "dərəcə toru", "informasiya sistemi", "coğrafi informasiya"]),
    ("3.1. Ərazidə tədqiqat", "2024H1", "B03", "M01", ["çöl tədqiqatı", "çanta", "məktəb ərazisi"]),
    ("4.1. Nə üçün səma cisimlərinə maraq göstəririk?", "2024H1", "B04", "M01", ["səma cisim", "ay", "günəş", "kainat"]),
    
    # Hissə 2
    ("5.1. Təbiətdəki müxtəliflik", "2024H2", "B05", "M01", ["müxtəliflik", "təbiət", "komponent", "mənzərə"]),
    ("5.2. Təbiət bir sistemdir", "2024H2", "B05", "M02", ["sistem", "fotosintez", "manqr"]),
    ("6.1. Ölkəmizin təbiətini tanıyaq", "2024H2", "B06", "M01", ["ölkə", "azərbaycan", "şirvan", "qoruq"]),
    ("7.1. Yer kürəsinin sosial mənzərəsi", "2024H2", "B07", "M01", ["sosial", "fərd", "cəmiyyət", "dövlət", "novruz"]),
    ("7.2. Cəmiyyətin inkişafında qurumların rolu", "2024H2", "B07", "M02", ["qurum", "iş mühiti", "qeyri-hökumət", "şirkət"]),
    ("7.3. Lokal və qlobal əlaqələr", "2024H2", "B07", "M03", ["lokal", "qlobal", "əlaqə", "milli", "dünya"])
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

def generate_geo_question(topic_name, diff):
    if diff == "asan":
        q = f"'{topic_name}' mövzusuna əsasən bu coğrafi anlayışın ən düzgün xüsusiyyəti hansıdır?"
        corr = f"O, təbiətin və ya cəmiyyətin təməl bir hissəsini təşkil edir və asanlıqla müşahidə olunur."
        w1 = f"O, yalnız fantastik əsərlərdə mövcuddur və coğrafiyaya aidiyyəti yoxdur."
        w2 = f"Bu, tamamilə yanlış bir mülahizədir və reallığı əks etdirmir."
        w3 = f"O, yalnız okeanların ən dərin yerlərində mövcud olan uydurma bir sistemdir."
        expl = f"Asan suallar (Anlamaq səviyyəsi) şagirdin coğrafi tərifləri və təməl xüsusiyyətləri dərk etməsini yoxlayır."
    elif diff == "orta":
        q = f"Verilmiş xəritə və ya məkan xüsusiyyətlərinə görə '{topic_name}' prosesi hansı praktiki əhəmiyyət daşıyır?"
        corr = f"Bu proses insanların məkanı düzgün planlaşdırmasına və ya təbiəti daha dərindən öyrənməsinə kömək edir."
        w1 = f"Bu prosesin heç bir praktiki əhəmiyyəti yoxdur, yalnız nəzəri olaraq yazılır."
        w2 = f"Bu proses cəmiyyətin inkişafına birbaşa mane olur və zərərlidir."
        w3 = f"Bu xüsusiyyət coğrafiyadan daha çox riyazi bir teorem kimi çıxış edir."
        expl = f"Orta çətinlik (Tətbiq etmək) öyrənilmiş coğrafi biliklərin konkret ərazilərə, cəmiyyətə və ya planlaşdırmaya tətbiqini tələb edir."
    else:
        q = f"Təsəvvür edin ki, '{topic_name}' ilə bağlı lokal miqyasda qəbul edilmiş bir qərar var. Bu qərarın qlobal təbii və sosial sistemlərə necə təsir göstərəcəyini necə izah edərdiniz?"
        corr = f"Lokal dəyişikliklər təbii və sosial sistemlərin zəncirvari əlaqəsi sayəsində zamanla qlobal proseslərə təsir edəcək."
        w1 = f"Lokal hadisələrin qlobal aləmə heç bir aidiyyəti olmadığı üçün sistem dəyişməz qalacaq."
        w2 = f"Təbiət hər zaman eyni qaldığı üçün verilmiş qərarlar ekologiyada heç nəyi dəyişməyəcək."
        w3 = f"Bu hadisə dərhal və sürətlə bütün planetin strukturunu məhv edəcək."
        expl = f"Çətin suallar (Təhlil etmək) lokal və qlobal hadisələr arasındakı coğrafi və sosial-iqtisadi bağları mühakimə etməyi yoxlayır."
        
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
            q, opts, ans, expl = generate_geo_question(topic, diff)
            bloom = get_bloom(diff)
            new_t = {
                "id": random.randint(100000000, 999999999),
                "category": "Coğrafiya 6",
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
        t["passport_id"] = f"06-COĞ-{part}-{b_code}-{m_code}-{bl_code}-{d_code}-{seq}"
        
    report.append(f"{topic} -- {len(topic_final_tests)}")
    final_all_tests.extend(topic_final_tests)

db["Coğrafiya 6"] = final_all_tests

with open(db_path, 'w', encoding='utf8') as f:
    json.dump(db, f, ensure_ascii=False, indent=2)

print("\n--- HESABAT ---")
for r in report:
    print(r)
print(f"Cəmi Test Sayı: {len(final_all_tests)}")
