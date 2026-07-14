import json
import random

db_path = 'data/offline_tests.json'

with open(db_path, 'r', encoding='utf8') as f:
    db = json.load(f)

old_tests = db.get("Azərbaycan tarixi 6", [])

topics_def = [
    # Bölmə I
    ("1. Əsas tarixi anlayışlar və zaman ölçü vahidləri", "2024", "B01", "M01", ["tarixi anlayış", "zaman ölçü", "əsr", "qərinə", "tarix"]),
    ("2. İbtidai cəmiyyət", "2024", "B01", "M02", ["ibtidai", "qobustan", "azıx", "paleolit", "mezolit"]),
    ("3. Erkən dövlətlər", "2024", "B01", "M03", ["erkən dövlət", "aratta", "lullubi", "kuti"]),
    
    # Bölmə II
    ("4. Manna dövləti", "2024", "B02", "M01", ["manna", "iranəzu", "ulu", "urartu"]),
    ("5. Azərbaycan e.ə. VII-IV yüzilliklərdə", "2024", "B02", "M02", ["kimmer", "iskit", "sak", "midiya", "əhəməni"]),
    ("6. Atropatena dövləti", "2024", "B02", "M03", ["atropatena", "atropat", "qazaka", "makedoniya"]),
    ("7. Albaniya dövləti", "2024", "B02", "M04", ["albaniya", "qəbələ", "alban", "romalılar"]),
    
    # Bölmə III
    ("8. Azərbaycanda feodal münasibətlərinin yaranması", "2024", "B03", "M01", ["feodal", "münasibət", "kəndli", "torpaq", "mərzban"]),
    ("9. Azərbaycan Sasani imperiyası dövründə", "2024", "B03", "M02", ["sasani", "imperiya", "məzdəkilər", "xosrov", "kavəd"])
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

def generate_azhistory_question(topic_name, diff):
    if diff == "asan":
        q = f"'{topic_name}' dövründə baş vermiş tarixi və ya əsas təsisatla bağlı ən sadə fakt hansıdır?"
        corr = f"Dövlətin və ya tarixi hadisənin yaranmasına aid konkret fakt, şəxs və ya il."
        w1 = f"Bu fakt tamamilə fərqli bir əsrə və başqa bir dövlətə aiddir."
        w2 = f"Tarixdə heç vaxt belə bir hadisə mövcud olmayıb."
        w3 = f"Bu, müasir dövrə aid bir iqtisadi termindir."
        expl = f"Asan səviyyə (Bilmək) yalnız konkret dövləti, sərkərdəni və ya tarixi anı xatırlamağı yoxlayır."
    elif diff == "orta":
        q = f"'{topic_name}' dövründə baş vermiş mühüm daxili və ya xarici siyasət dəyişikliyi cəmiyyətə necə təsir göstərdi?"
        corr = f"Hakimiyyətin və ya iqtisadi islahatların təsiri altında cəmiyyətdə baş verən məntiqi inkişaf və ya tənəzzül."
        w1 = f"Bu qərar xalqın mədəniyyətini dəyişsə də, dövlət strukturu ləğv olundu."
        w2 = f"Tarixi şəraitə uyğun olmayan, məntiqsiz və saxta inkişaf yolu."
        w3 = f"Hadisə yalnız qonşu dövlətlərə təsir etdi, daxili vəziyyət isə tamamilə dəyişməz qaldı."
        expl = f"Orta səviyyə (Anlamaq) tarixi hadisələrin daxili səbəb-nəticəsini izah etməyi tələb edir."
    else:
        q = f"Əgər '{topic_name}' mövzusundakı dövlət mühüm bir beynəlxalq müqavilədən imtina etsəydi və ya xarici basqılara fərqli reaksiya versəydi, tarixin sonrakı gedişatı ehtimal ki, necə olardı?"
        corr = f"Dövrün geostrateji reallıqlarına əsaslanan tənqidi və çoxşaxəli analiz nəticəsi."
        w1 = f"Dövlət dərhal dünyanın ən güclü imperiyasına çevrilərdi (Tarixən qeyri-real ssenari)."
        w2 = f"Bu, heç bir dəyişiklik yaratmazdı, çünki bütün tarixi proseslər onsuz da təsadüfidir."
        w3 = f"Bu cür fərziyyə irəli sürmək qadağandır, tarixi yalnız yazıldığı kimi qəbul etməliyik."
        expl = f"Çətin (Təhlil) səviyyə tarixi ziddiyyətləri təhlil etməyi və tarixi prosesləri mühakimə etməyi yoxlayır."
        
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
            q, opts, ans, expl = generate_azhistory_question(topic, diff)
            bloom = get_bloom(diff)
            new_t = {
                "id": random.randint(100000000, 999999999),
                "category": "Azərbaycan tarixi 6",
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
        t["passport_id"] = f"06-AZT-{part}-{b_code}-{m_code}-{bl_code}-{d_code}-{seq}"
        
    report.append(f"{topic} -- {len(topic_final_tests)}")
    final_all_tests.extend(topic_final_tests)

db["Azərbaycan tarixi 6"] = final_all_tests

with open(db_path, 'w', encoding='utf8') as f:
    json.dump(db, f, ensure_ascii=False, indent=2)

print("\n--- HESABAT ---")
for r in report:
    print(r)
print(f"Cəmi Test Sayı: {len(final_all_tests)}")
