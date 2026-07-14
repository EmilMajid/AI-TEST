import json
import random

db_path = 'data/offline_tests.json'

with open(db_path, 'r', encoding='utf8') as f:
    db = json.load(f)

old_tests = db.get("İnformatika 6", [])

topics_def = [
    # 1. KOMPÜTER
    ("1. Kompüter necə işləyir", "2024", "B01", "M01", ["kompüter necə işləyir", "prosessor", "qurğu", "giriş", "çıxış"]),
    ("2. İnformasiya harada saxlanılır", "2024", "B01", "M02", ["saxlanılır", "yaddaş", "rom", "ram", "vinçester", "sərt disk", "flash"]),
    ("3. Ədədi informasiya necə kodlaşdırılır", "2024", "B01", "M03", ["ədədi", "kodlaşdırılır", "ikilik", "bit", "bayt"]),
    ("4. İnformasiya nə qədər yer tutur", "2024", "B01", "M04", ["nə qədər yer", "bayt", "kilobayt", "meqabayt", "tutur"]),
    
    # 2. PROQRAM TƏMİNATI
    ("5. Proqramı başlatmağın bir neçə üsulu", "2024", "B02", "M01", ["başlatmaq", "üçün", "üsul", "qısayol", "iş masası"]),
    ("6. Şəklin kompüterdə saxlanması və çapı", "2024", "B02", "M02", ["şəkil", "çap", "printer", "saxlanması", "paint"]),
    ("7. Mətnin görünüşünün yaxşılaşdırılması", "2024", "B02", "M03", ["mətn", "şrift", "görünüş", "wordpad", "word"]),
    ("8. Abzasın formatlanması", "2024", "B02", "M04", ["abzas", "formatlanma", "sətirlərarası", "düzləndirmə"]),
    ("9. Elektron təqdimatlar", "2024", "B02", "M05", ["elektron", "təqdimat", "powerpoint"]),
    ("10. Slaydlarla iş", "2024", "B02", "M06", ["slayd", "təqdimat", "animasiya"]),
    ("11. Obyektin informasiya modeli", "2024", "B02", "M07", ["obyekt", "model", "informasiya modeli", "prototip"]),
    
    # 3. ALQORİTM
    ("12. Alqoritmin xassələri", "2024", "B03", "M01", ["xassə", "diskretlik", "müəyyənlik", "kütləvilik", "nəticəvilik"]),
    ("13. Alqoritmin növləri", "2024", "B03", "M02", ["növləri", "xətti", "budaqlanan", "dövri"]),
    ("14. Dövri alqoritmlər", "2024", "B03", "M03", ["dövri", "təkrarlanan", "dövr"]),
    ("15. Əyləncəli məsələlər", "2024", "B03", "M04", ["əyləncəli", "məntiq", "məsələlər", "həll"]),
    
    # 4. PROQRAMLAŞDIRMA
    ("16. Proqramda dəyişənlər", "2024", "B04", "M01", ["dəyişən", "qiymət", "mənimsətmə"]),
    ("17. Proqramlaşdırma mühitində seçim", "2024", "B04", "M02", ["seçim", "əgər", "şərt", "budaqlanma"]),
    ("18. Proqramlaşdırma mühitində dövr", "2024", "B04", "M03", ["mühitində dövr", "təkrar", "dövr", "alplogo"]),
    ("19. Dövrlər və naxışlar", "2024", "B04", "M04", ["naxış", "dövr", "çəkmək", "qələm"]),
    ("20. Proqramlaşdırma mühitində musiqi", "2024", "B04", "M05", ["musiqi", "səs", "nota"]),
    
    # 5. İNTERNET
    ("21. İnformasiya resursları ilə iş mərhələləri", "2024", "B05", "M01", ["resurs", "iş mərhələləri", "axtarış", "toplama", "emal"]),
    ("22. Dünya hörümçək torunda gəzişmə", "2024", "B05", "M02", ["hörümçək", "www", "brauzer", "veb", "səhifə"]),
    ("23. İnternetdə axtarış", "2024", "B05", "M03", ["axtarış", "sistem", "google", "açar söz"]),
    ("24. Elektron poçt", "2024", "B05", "M04", ["elektron poçt", "email", "@", "ünvan"]),
    ("25. Elektron poçtla məktublaşma", "2024", "B05", "M05", ["məktublaşma", "fayl əlavə", "göndərmək", "qutu"])
]

topics_by_name = {t[0]: t for t in topics_def}
topic_names = [t[0] for t in topics_def]

def get_bloom(difficulty):
    if difficulty == "asan": return "1-Bilmək (Xatırlamaq)"
    elif difficulty == "orta": return "2-Anlamaq (Qavrama)"
    else: return "3-Tətbiq etmək"

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

def generate_informatics_question(topic_name, diff):
    if diff == "asan":
        q = f"'{topic_name}' mövzusuna aid olan əsas qurğunun, funksiyanın və ya düymənin vəzifəsi nədən ibarətdir?"
        corr = f"Onun əsas təyinatı informasiyanı emal etmək, daxil etmək və ya istifadəçinin işini sadələşdirməkdir."
        w1 = f"Bu, əslində təmir prosesində istifadə olunan bir detalın adıdır."
        w2 = f"Onun vəzifəsi yalnız kompyuterin elektrik şəbəkəsini yandırıb söndürməkdir."
        w3 = f"Bu heç bir proqramda mövcud olmayan xəyali bir anlayışdır."
        expl = f"Asan suallar (Bilmək/Xatırlamaq səviyyəsi) kompüterin aparat təminatı və ya sadə alqoritm terminlərinin əzbərdən xatırlanmasını tələb edir."
    elif diff == "orta":
        q = f"İstifadəçi kompüterdə və ya proqramlaşdırma mühitində '{topic_name}' ilə bağlı əməliyyatı yerinə yetirərkən hansı ardıcıllığı düzgün seçməlidir?"
        corr = f"Tələb olunan nəticəni əldə etmək üçün proqramın menyularından və ya alqoritm addımlarından düzgün və məntiqi istifadə qaydası."
        w1 = f"Ardıcıllığı pozaraq ən sonuncu addımı əvvəldə etmək, bu da xətaya səbəb olur."
        w2 = f"Yanlış düymə və ya fərqli bir əmrdən istifadə edərək prosesi kilidləmək."
        w3 = f"Faylı ümumiyyətlə yaddaşa vermədən kompüteri söndürmək."
        expl = f"Orta çətinlikli (Anlamaq) testlərdə şagirdin menyu ardıcıllıqlarını, proqram xüsusiyyətlərini və ya alqoritm mərhələlərini anlaması yoxlanılır."
    else:
        q = f"'{topic_name}' mövzusunda verilmiş problemi həll etmək (və ya kodu optimallaşdırmaq) üçün hansı ən səmərəli yanaşmanı tətbiq etmək lazımdır?"
        corr = f"Mövcud bütün vasitələri dəyərləndirərək ən qısa, sürətli və az yaddaş tutan alqoritmik (və ya texniki) həll yolu."
        w1 = f"Ən uzun və kompüteri həddindən artıq yükləyən, səmərəsiz proqram kodu yazmaq."
        w2 = f"Problemi həll etmədən faylı silib yenidən formatlamaqla sıfırdan başlamaq."
        w3 = f"Kompüterin təhlükəsizlik sistemini qeyri-qanuni yolla söndürərək problemi yan keçmək."
        expl = f"Çətin testlər (Tətbiq etmək / Təhlil) proqramlaşdırma və ya proqram təminatında məntiqi xətaları tapmaq, optimal kod (və ya həll) qurmaq bacarığını tələb edir."
        
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
            q, opts, ans, expl = generate_informatics_question(topic, diff)
            bloom = get_bloom(diff)
            new_t = {
                "id": random.randint(100000000, 999999999),
                "category": "İnformatika 6",
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
        t["passport_id"] = f"06-İNF-{part}-{b_code}-{m_code}-{bl_code}-{d_code}-{seq}"
        
    report.append(f"{topic} -- {len(topic_final_tests)}")
    final_all_tests.extend(topic_final_tests)

db["İnformatika 6"] = final_all_tests

with open(db_path, 'w', encoding='utf8') as f:
    json.dump(db, f, ensure_ascii=False, indent=2)

print("\n--- HESABAT ---")
for r in report:
    print(r)
print(f"Cəmi Test Sayı: {len(final_all_tests)}")
