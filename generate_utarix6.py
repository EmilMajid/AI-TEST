import json
import random

db_path = 'data/offline_tests.json'

with open(db_path, 'r', encoding='utf8') as f:
    db = json.load(f)

old_tests = db.get("Ümumi tarix 6", [])

topics_def = [
    # Bölmə 1: Tarix
    ("1. Tarixdə il hesabı", "2024", "B01", "M01", ["il hesabı", "əsr", "qərinə", "tarix"]),
    ("2. İbtidai cəmiyyət", "2024", "B01", "M02", ["ibtidai", "cəmiyyət", "icma", "qəbilə"]),
    
    # Bölmə 2: Qədim Şərq sivilizasiyaları
    ("3. Ehramlar ölkəsi", "2024", "B02", "M01", ["ehram", "misir", "firon", "nil"]),
    ("4. Şumerdən başlanan tarix", "2024", "B02", "M02", ["şumer", "mixi yazı", "mesopotamiya"]),
    ("5. ikiçayarasının digər dövlətləri", "2024", "B02", "M03", ["ikiçayarası", "akkad", "babil", "assuriya"]),
    ("6. Oda sitayiş edənlər", "2024", "B02", "M04", ["zərdüştlük", "oda sitayiş", "midiya", "əhəməni"]),
    ("7. Parfiya dövləti.", "2024", "B02", "M05", ["parfiya", "arşakilər"]),
    ("8. Tanrının döyüşçüləri", "2024", "B02", "M06", ["tanrının döyüşçüləri", "hunlar", "teoman", "mete"]),
    ("9. Böyük ipək yolunun başlandığı ölkə", "2024", "B02", "M07", ["ipək yolu", "çin", "xuanxe", "yantszı"]),
    ("10. Şahmatın vətəni", "2024", "B02", "M08", ["şahmat", "hindistan", "hind", "qanq"]),
    
    # Bölmə 3: Qədim Qərb sivilizasiyaları
    ("11. Avropa mədəniyyətinin beşiyi", "2024", "B03", "M01", ["avropa mədəniyyətinin", "yunanıstan", "atina", "sparta"]),
    ("12. ilk Respublika yaradanlar", "2024", "B03", "M02", ["respublika", "roma", "patrisi", "plebey", "senat"])
]

topics_by_name = {t[0]: t for t in topics_def}
topic_names = [t[0] for t in topics_def]

def get_bloom(difficulty):
    if difficulty == "asan": return "1-Bilmək (Xatırlamaq)"
    elif difficulty == "orta": return "2-Anlamaq (Qavrama)"
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

def generate_history_question(topic_name, diff):
    if diff == "asan":
        q = f"'{topic_name}' mövzusu ilə bağlı ən sadə və tanınmış tarixi fakt hansıdır?"
        corr = f"Dövlətin əsasının qoyulması və ya mühüm bir şəxsiyyətin adı ilə bağlı yadda qalan bir fakt."
        w1 = f"Bu fakt tamamilə başqa bir əsrə və başqa bir qitəyə aiddir."
        w2 = f"Tarixdə heç vaxt belə bir hadisə mövcud olmayıb."
        w3 = f"Bu, əslində müasir dövrə aid bir hadisədir və qədim dünyaya aidiyyəti yoxdur."
        expl = f"Tarixdə asan suallar (Bilmək/Xatırlamaq səviyyəsi) konkret tarixi şəxsiyyət, il və ya təməl hadisənin yadda saxlanılmasını yoxlayır."
    elif diff == "orta":
        q = f"'{topic_name}' dövründə baş vermiş hansı siyasi və ya mədəni proses dövlətin inkişafına əhəmiyyətli dərəcədə təsir göstərmişdir?"
        corr = f"Tarixi səbəblərlə əlaqədar olaraq həyata keçirilən islahat və ya müharibənin məntiqi nəticəsi."
        w1 = f"Bu hadisə dövlətin güclənməsinə yox, məhvinə səbəb olmuşdu."
        w2 = f"Bu, qonşu bir dövlətin fəaliyyətidir və bu mövzuya heç bir aidiyyəti yoxdur."
        w3 = f"Göstərilən proses iqtisadi geriləmə yaratmışdır, halbuki sual inkişafı soruşur."
        expl = f"Orta səviyyə (Anlamaq) şagirddən sadəcə əzbərləməyi deyil, hadisələrin siyasi və ya mədəni mahiyyətini başa düşməsini tələb edir."
    else:
        q = f"Əgər '{topic_name}' mövzusundakı aparıcı dövlət müəyyən bir strateji qərarı fərqli qəbul etsəydi, bu dövrün beynəlxalq münasibətlərində hansı dəyişiklik gözlənilərdi?"
        corr = f"Bütün mövcud tarixi reallıqları nəzərə alaraq çıxarılan ən məntiqli, çoxşaxəli tənqidi nəticə."
        w1 = f"Siyasi reallığa tamamilə zidd olan və qeyri-mümkün, utopik bir ssenari."
        w2 = f"Digər sivilizasiyaların varlığını inkar edən yanlış və dar düşüncəli bir fərziyyə."
        w3 = f"Yalnız mədəniyyətə təsir edən, lakin siyasi mənzərəni dəyişməyən səthli iddia."
        expl = f"Çətin testlər (Təhlil) tarixi situasiyaları dəyərləndirməyi, dövlətlərarası əlaqələri analiz etməyi tələb edir."
        
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
            q, opts, ans, expl = generate_history_question(topic, diff)
            bloom = get_bloom(diff)
            new_t = {
                "id": random.randint(100000000, 999999999),
                "category": "Ümumi tarix 6",
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
        t["passport_id"] = f"06-ÜTA-{part}-{b_code}-{m_code}-{bl_code}-{d_code}-{seq}"
        
    report.append(f"{topic} -- {len(topic_final_tests)}")
    final_all_tests.extend(topic_final_tests)

db["Ümumi tarix 6"] = final_all_tests

with open(db_path, 'w', encoding='utf8') as f:
    json.dump(db, f, ensure_ascii=False, indent=2)

print("\n--- HESABAT ---")
for r in report:
    print(r)
print(f"Cəmi Test Sayı: {len(final_all_tests)}")
