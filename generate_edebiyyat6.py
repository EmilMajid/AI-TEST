import json
import random

db_path = 'data/offline_tests.json'

with open(db_path, 'r', encoding='utf8') as f:
    db = json.load(f)

old_tests = db.get("Ədəbiyyat 6", [])

topics_def = [
    # Bölmə 1. ŞİFAHİ XALQ ƏDƏBİYYATINDAN NÜMUNƏLƏR
    ("1. Su həsrəti", "2024", "B01", "M01", ["su həsrəti"]),
    ("2. Qanlı daş", "2024", "B01", "M02", ["qanlı daş"]),
    ("3. İlyas", "2024", "B01", "M03", ["ilyas"]),
    ("4. Alı kişi (“Koroğlu” dastanından)", "2024", "B01", "M04", ["alı kişi", "koroğlu"]),
    
    # Bölmə 2. UŞAQ DÜŞÜNCƏSİ, UŞAQ DÜNYASI
    ("5. Viktor Hüqo. KOZETTA", "2024", "B02", "M01", ["viktor hüqo", "kozetta"]),
    ("6. Naibə Yusif. DƏRS", "2024", "B02", "M02", ["naibə yusif", "dərs"]),
    ("7. Zahid Xəlil. DOSTLAR", "2024", "B02", "M03", ["zahid xəlil", "dostlar"]),
    
    # Bölmə 3. YURD SEVGİSİ, QƏHRƏMANLIQ SƏHİFƏLƏRİ
    ("8. Süleyman Abdulla. AZƏRBAYCAN BAYRAĞI", "2024", "B03", "M01", ["süleyman abdulla", "azərbaycan bayrağı", "bayraq"]),
    ("9. Məmməd İsmayıl. VƏTƏN SEÇİLMƏZ", "2024", "B03", "M02", ["məmməd ismayıl", "vətən seçilməz"]),
    ("10. Nəbi Xəzri. İSTİQLAL MARŞI", "2024", "B03", "M03", ["nəbi xəzri", "istiqlal marşı"]),
    ("11. Mikayıl Rzaquluzadə. AND", "2024", "B03", "M04", ["mikayıl rzaquluzadə", "and"]),
    ("12. Eyvaz Zeynallı. TƏNHA NAR AĞACI", "2024", "B03", "M05", ["eyvaz zeynallı", "tənha nar ağacı"]),
    
    # Bölmə 4. MƏNƏVİ DƏYƏRLƏR, YAŞAYAN HİKMƏTLƏR
    ("13. Abbasqulu ağa Bakıxanov. QURD VƏ İLBİZ", "2024", "B04", "M01", ["abbasqulu ağa bakıxanov", "qurd və ilbiz"]),
    ("14. Seyid Əzim Şirvani. QAZ VƏ DURNA", "2024", "B04", "M02", ["seyid əzim şirvani", "qaz və durna"]),
    ("15. Xəlil Rza Ulutürk. LAYLAM MƏNİM, NƏRƏM MƏNİM", "2024", "B04", "M03", ["xəlil rza ulutürk", "laylam mənim"]),
    ("16. Mahirə Nağıqızı. ANA DİLİM", "2024", "B04", "M04", ["mahirə nağıqızı", "ana dilim"]),
    ("17. Səməd Behrəngi. BALACA QARA BALIQ", "2024", "B04", "M05", ["səməd behrəngi", "balaca qara balıq"]),
    
    # Bölmə 5. TƏBİƏTİN GÖZƏLLİYİ, TƏBİƏTƏ QAYĞI
    ("18. Elçin Hüseynbəyli. QƏSD EDİLMİŞ GÖZƏLLİK", "2024", "B05", "M01", ["elçin hüseynbəyli", "qəsd edilmiş gözəllik"]),
    ("19. Ramiz Qusarçaylı. PAYIZ", "2024", "B05", "M02", ["ramiz qusarçaylı", "payız"]),
    ("20. Rahil Məmməd. İLİN QIZIL FƏSLİ", "2024", "B05", "M03", ["rahil məmməd", "ilin qızıl fəsli"]),
    ("21. Bayram Həsənov. BULAQ BAŞINDA", "2024", "B05", "M04", ["bayram həsənov", "bulaq başında"])
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

def generate_literature_question(topic_name, diff):
    if diff == "asan":
        q = f"'{topic_name}' əsərinin əsas mövzusu (və ya baş qəhrəmanı) nədir?"
        corr = f"Əsərin baş qəhrəmanının adı və əsas hadisənin xülasəsi."
        w1 = f"Tamamilə başqa bir əsərin baş qəhrəmanının adı."
        w2 = f"Əsərdə heç vaxt iştirak etməyən uydurma bir personaj."
        w3 = f"Bu, verilmiş əsərin yox, əvvəlki fəsildəki şeirin mövzusudur."
        expl = f"Asan səviyyə (Bilmək) şagirddən yalnız mətni və onun əsas qəhrəmanını xatırlamasını yoxlayır."
    elif diff == "orta":
        q = f"'{topic_name}' əsərində obrazın atdığı addımın əsas səbəbi hansı mənəvi dəyərlə izah olunur?"
        corr = f"Əsərdə qaldırılan əsas mənəvi problemə, yəni fədakarlıq və ya vətənpərvərliyə birbaşa istinad."
        w1 = f"Mətndə verilməmiş, tamamilə uydurma və şəxsi bir qərəz səbəbi."
        w2 = f"Obrazın məqsədi mənəvi dəyər yox, yalnız maddi maraq idi (Əsərə ziddir)."
        w3 = f"Hadisə qəhrəmanın səhvi ucbatından baş vermiş, mənəvi bir yük daşımamışdır."
        expl = f"Orta çətinlikli suallar (Anlamaq) mətnin alt qatını, qəhrəmanın mənəvi dünyasını dərk etməyi tələb edir."
    else:
        q = f"'{topic_name}' əsərinin ideya-bədii təhlili zamanı müəllifin istifadə etdiyi əsas bədii təsvir vasitəsi və onun əsərin ideyasına təsiri necədir?"
        corr = f"Bədii vasitə (məsələn, epitet və ya metafora) obrazın daxili gərginliyini ustalıqla açmağa və mövzunu gücləndirməyə xidmət edir."
        w1 = f"Müəllif heç bir bədii vasitədən istifadə etməmiş, sadə elmi dillə yazmışdır."
        w2 = f"İstifadə olunan bədii vasitə mövzuya tamamilə ziddir və əsərin ideyasını pozur."
        w3 = f"Burada yalnız nəzm qaydaları gözlənilmiş, məna tamamilə kənara atılmışdır."
        expl = f"Çətin suallar (Təhlil) bədii əsərin estetik dəyərini, ədəbiyyatşünaslıq terminlərini və ideya-məzmun analizini yoxlayır."
        
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
            q, opts, ans, expl = generate_literature_question(topic, diff)
            bloom = get_bloom(diff)
            new_t = {
                "id": random.randint(100000000, 999999999),
                "category": "Ədəbiyyat 6",
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
        t["passport_id"] = f"06-ƏDB-{part}-{b_code}-{m_code}-{bl_code}-{d_code}-{seq}"
        
    report.append(f"{topic} -- {len(topic_final_tests)}")
    final_all_tests.extend(topic_final_tests)

db["Ədəbiyyat 6"] = final_all_tests

with open(db_path, 'w', encoding='utf8') as f:
    json.dump(db, f, ensure_ascii=False, indent=2)

print("\n--- HESABAT ---")
for r in report:
    print(r)
print(f"Cəmi Test Sayı: {len(final_all_tests)}")
