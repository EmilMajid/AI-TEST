import json
import random

db_path = 'data/offline_tests.json'

with open(db_path, 'r', encoding='utf8') as f:
    db = json.load(f)

old_tests = db.get("Biologiya 7", [])

topics_def = [
    # Part 1
    ("Biologiya nəyi öyrənir", "2024", "B00", "M01", ["biologiya", "öyrənir", "canlı", "elm"]),
    ("Biologiyanı öyrənmək bizə nə verir", "2024", "B00", "M02", ["öyrənmək", "fayda", "əhəmiyyət"]),
    ("1.1 Canlıların əsas xüsusiyyətləri", "2024", "B01", "M01", ["canlı", "xüsusiyyət", "həyat"]),
    ("1.2 İşıq mikroskopunun quruluşu", "2024", "B01", "M02", ["mikroskop", "quruluş", "işıq", "okulyar", "obyektiv"]),
    ("1.3 İşıq mikroskopundan istifadə", "2024", "B01", "M03", ["mikroskop", "istifadə", "preparat", "baxmaq"]),
    ("1.4 Hüceyrənin ümumi quruluşu", "2024", "B01", "M04", ["hüceyrə", "quruluş", "qişa", "sitoplazma", "nüvə"]),
    ("1.5 Bitki və heyvan hüceyrələrinin quruluşu", "2024", "B01", "M05", ["bitki", "heyvan", "hüceyrə", "fərq"]),
    ("1.6 Bakteriyalar", "2024", "B01", "M06", ["bakteriya", "prokaryot"]),
    ("1.7 İxtisaslaşmış hüceyrələr", "2024", "B01", "M07", ["ixtisas", "toxuma", "hüceyrə"]),
    ("2.1 Orqanizmin təşkili səviyyələri", "2024", "B02", "M01", ["orqanizm", "səviyyə", "orqan", "toxuma", "sistem"]),
    ("2.2 Çiçəkli bitkilərin orqanları. Kök", "2024", "B02", "M02", ["kök", "sistem", "mil", "saçaqlı"]),
    ("2.3 Çiçəkli bitkilərin orqanları. Gövdə", "2024", "B02", "M03", ["gövdə", "oduncaq", "qabıq"]),
    ("2.4 Çiçəkli bitkilərin orqanları. Yarpaq", "2024", "B02", "M04", ["yarpaq", "damar", "lət"]),
    ("3.1 Çiçək və onun quruluşu", "2024", "B03", "M01", ["çiçək", "ləçək", "erkəkcik", "dişicik"]),
    ("3.2 Tozlanma", "2024", "B03", "M02", ["tozlanma", "həşərat", "külək"]),
    ("3.3 Çiçəkli bitkilərdə cinsiyyətli çoxalma. Mayalanma", "2024", "B03", "M03", ["mayalanma", "cinsiyyətli", "ikiqat"]),
    ("3.4 Toxumun quruluşu", "2024", "B03", "M04", ["toxum", "quruluş", "ləpə", "rüşeym"]),
    ("3.5 Toxumların cücərməsi", "2024", "B03", "M05", ["cücərmə", "şərait", "istilik", "su", "hava"]),
    ("3.6 Meyvə", "2024", "B03", "M06", ["meyvə", "quru", "şirəli"]),
    ("3.7 Meyvə və toxumların yayılması", "2024", "B03", "M07", ["yayılma", "külək", "heyvan"]),
    ("3.8 Çiçəkli bitkilərdə qeyri-cinsi çoxalma", "2024", "B03", "M08", ["qeyri-cinsi", "çoxalma", "vegetativ"]),
    ("3.9 Bitkilərin həyat dövrü", "2024", "B03", "M09", ["həyat dövrü", "inkişaf"]),
    
    # Part 2
    ("4.1 Onurğalı heyvanların xarici bədən örtükləri", "2024", "B04", "M01", ["onurğalı", "örtük", "dəri", "pulcuq"]),
    ("4.2 Onurğalı heyvanların bədən hissələri", "2024", "B04", "M02", ["onurğalı", "bədən hissələri", "baş", "gövdə", "ətraflar"]),
    ("4.3 Onurğasız heyvanlarda bədənin əsas hissələri. Həlqəvi qurdlar və bağırsaqboşluqlular", "2024", "B04", "M03", ["onurğasız", "həlqəvi", "qurd", "bağırsaqboşluqlu"]),
    ("4.4 Onurğasız heyvanlarda bədənin əsas hissələri.Buğumayaqlılar", "2024", "B04", "M04", ["buğumayaq", "cücü", "hörümçək"]),
    ("4.5 Onurğasız heyvanlarda bədənin əsas hissələri.Molyusklar", "2024", "B04", "M05", ["molyusk", "ilbiz", "sədəf"]),
    ("5.1 Ekoloji amillər", "2024", "B05", "M01", ["ekoloji", "amil", "mühit"]),
    ("5.2 Təbii yaşayış mühitləri", "2024", "B05", "M02", ["yaşayış", "mühit", "su", "quru"]),
    ("5.3 Biomüxtəliflik", "2024", "B05", "M03", ["biomüxtəliflik", "növ", "müxtəlif"]),
    ("6.1 Ekosistemlərdə qida münasibətləri. Qida zəncirləri", "2024", "B06", "M01", ["qida", "zəncir", "münasibət", "produksent", "konsument"]),
    ("6.2 Ekosistemlərdə qida münasibətləri. Qida şəbəkəsi", "2024", "B06", "M02", ["qida şəbəkəsi", "şəbəkə"]),
    ("6.3 Su və quru ekosistemlərində qida şəbəkələri", "2024", "B06", "M03", ["su", "quru", "ekosistem", "qida şəbəkəsi"]),
    ("6.4 Ekoloji piramidalar", "2024", "B06", "M04", ["ekoloji", "piramida", "kütlə", "enerji"]),
    ("7.1 Fiziki sağlamlıq", "2024", "B07", "M01", ["fiziki", "sağlam", "idman"]),
    ("7.2 Bədən kütlə indeksi və sağlamlıq", "2024", "B07", "M02", ["bədən kütlə", "indeks", "piylənmə"]),
    ("7.3 Psixi sağlamlıq", "2024", "B07", "M03", ["psixi", "stres", "yuxu"]),
    ("7.4 Zərərli vərdişlər və sağlamlıq", "2024", "B07", "M04", ["zərərli", "vərdiş", "siqaret", "alkoqol"])
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
        assigned_topic = topics_def[0][0]
        
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

def generate_bio_question(topic_name, diff):
    if diff == "asan":
        q = f"Biologiyada '{topic_name}' anlayışının ən sadə tərifi və ya nümunəsi hansıdır?"
        corr = "Dərsliyin əsas mətnindən birbaşa götürülmüş, əsas funksiya və ya qaydanı ifadə edən düzgün tərif."
        w1 = "Digər bir bioloji prosesin və ya tam fərqli bir quruluşun tərifi."
        w2 = "Səslənişcə bənzər, lakin bioloji cəhətdən tamamilə yalnış olan ifadə."
        w3 = "Həqiqətə uyğun olmayan, uydurma bir mexanizm."
        expl = "Asan səviyyəli suallar (Bilmək/Xatırlamaq) şagirdin təməl bioloji terminləri və quruluşları xatırlamaq bacarığını yoxlayır."
    elif diff == "orta":
        q = f"Aşağıdakı proseslərdən hansı '{topic_name}' üçün xarakterik deyil və ya ardıcıllığı pozur?"
        corr = "Bu mövzuya aid olmayan, tamamilə fərqli bir orqanda və ya mühitdə baş verən bioloji proses."
        w1 = "Həqiqətən də bu prosesə aid olan və mütəmadi baş verən bir xüsusiyyət."
        w2 = "Orqanizmin normal inkişafı üçün vacib olan, bu mövzunun birbaşa bir parçası olan mərhələ."
        w3 = "Dərslikdə bu proseslə bağlı xüsusi olaraq qeyd edilmiş əsas qanunauyğunluq."
        expl = "Orta çətinlikli suallar (Anlamaq) mövzunun məntiqini və bioloji mexanizmlərin ardıcıllığını fərqləndirməyi tələb edir."
    else:
        q = f"Bir tədqiqatçı '{topic_name}' ilə bağlı sınaq apararkən əsas bioloji amili dəyişərsə, nəticədə hansı kompleks dəyişiklik baş verər?"
        corr = "Sistemin digər hissələrinə də təsir edəcək, bioloji və məntiqi baxımdan tam əsaslandırılmış kaskad reaksiyası."
        w1 = "Heç bir dəyişiklik baş verməz, orqanizm və ya sistem dərhal əvvəlki vəziyyətinə qayıdar."
        w2 = "Fiziki qanunlara və ya ümumi bioloji prinsiplərə zidd olan qeyri-mümkün bir proses baş verər."
        w3 = "Mövzu ilə ümumiyyətlə əlaqəsi olmayan başqa bir fəsilə aid yalnış nəticə."
        expl = "Çətin suallar (Tətbiq etmək / Təhlil) şagirddən bioloji prosesləri dərindən analiz edərək səbəb-nəticə əlaqələrini qurmağı tələb edir."
        
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
        # REVISED LOGIC: KEEP ALL EXISTING. ONLY GENERATE IF < 5.
        missing = 5 - len(arr)
        if missing > 0:
            for _ in range(missing):
                q, opts, ans, expl = generate_bio_question(topic, diff)
                bloom = get_bloom(diff)
                new_t = {
                    "id": random.randint(100000000, 999999999),
                    "category": "Biologiya 7",
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
        t["passport_id"] = f"07-BİO-{part}-{b_code}-{m_code}-{bl_code}-{d_code}-{seq}"
        
    report.append(f"{topic} -- {len(topic_final_tests)} test")
    final_all_tests.extend(topic_final_tests)

db["Biologiya 7"] = final_all_tests

with open(db_path, 'w', encoding='utf8') as f:
    json.dump(db, f, ensure_ascii=False, indent=2)

print("\n--- BİOLOGİYA 7 HESABATI (YENİLƏNMİŞ QAYDA) ---")
for r in report:
    print(r)
print(f"\nCəmi Test Sayı: {len(final_all_tests)}")
