import json
import random

db_path = 'data/offline_tests.json'

with open(db_path, 'r', encoding='utf8') as f:
    db = json.load(f)

old_tests = db.get("Təbiət 6", [])

topics_def = [
    # Hissə 1
    ("1.1 Qüvvənin təsirinədən asılıdır", "2024H1", "B01", "M01", ["qüvvə", "təsir"]),
    ("1.2 Ağırlıq qüvvəsi", "2024H1", "B01", "M02", ["ağırlıq", "qüvvəsi", "cazibə"]),
    ("1.3 Sürtünmə qüvvəsi", "2024H1", "B01", "M03", ["sürtünmə", "hərəkət", "mane"]),
    ("1.4 Arximed qüvvəsi", "2024H1", "B01", "M04", ["arximed", "qüvvəsi", "maye", "qalxan"]),
    ("1.5 Tarazlaşan və tarazlaşmayan qüvvələr", "2024H1", "B01", "M05", ["tarazlaşan", "tarazlaşmayan", "əvəzləyici"]),
    
    ("2.1 Ürək necə işləyir", "2024H1", "B02", "M01", ["ürək", "qan damar", "nasos"]),
    ("2.2 Bədəndə qan necə hərəkət edir", "2024H1", "B02", "M02", ["qan", "hərəkət", "damar", "dövran"]),
    ("2.3 Ağciyərlərdə qazlar mübadiləsi necə başverir", "2024H1", "B02", "M03", ["ağciyər", "qaz", "mübadilə", "oksigen", "karbon"]),
    
    ("3.1 Göbələk nədir", "2024H1", "B03", "M01", ["göbələk", "kif", "maya"]),
    ("3.2 Bakteriya nədir", "2024H1", "B03", "M02", ["bakteriya", "mikroorqanizm"]),
    
    ("4.1 Xəstəlik nədir", "2024H1", "B04", "M01", ["xəstəlik", "infeksiya", "patogen"]),
    ("4.2 Yoluxucu xəstəliklərin qarşısını necə almaq olar", "2024H1", "B04", "M02", ["yoluxucu", "qarşısını", "profilaktika", "gigiyena", "peyvənd"]),
    ("4.3 Bitki və heyvanların yoluxucu xəstəlikləri hansılardır", "2024H1", "B04", "M03", ["bitki", "heyvan", "xəstəlik"]),
    
    ("5.1 Maddənin fiziki xassələri", "2024H1", "B05", "M01", ["fiziki xassə", "rəng", "iy", "dad"]),
    ("5.2 Maddənin sıxlığı", "2024H1", "B05", "M02", ["sıxlıq", "kütlə", "həcm"]),
    ("5.3 Maddəni təşkil edən zərrəciklər", "2024H1", "B05", "M03", ["zərrəcik", "atom", "molekul"]),
    ("5.4 Su molekulu", "2024H1", "B05", "M04", ["su molekulu", "hidrogen", "oksigen", "h2o"]),
    ("5.5 Diffuziya", "2024H1", "B05", "M05", ["diffuziya", "qarışma", "nüfuz etmə"]),
    
    ("6.1 Qarışıqlar", "2024H1", "B06", "M01", ["qarışıq", "maddə"]),
    ("6.2 Maddalarin hallolması", "2024H1", "B06", "M02", ["həllolma", "həlledici", "həll olan"]),
    ("6.3 Eynicinsli və müxtəlifcinsli qarışıqlar", "2024H1", "B06", "M03", ["eynicinsli", "müxtəlifcinsli", "homogen", "heterogen"]),
    ("6.4 Saf maddələr", "2024H1", "B06", "M04", ["saf maddə", "tərkib"]),
    ("6.5 Suyun əhəmiyyəti", "2024H1", "B06", "M05", ["su", "əhəmiyyət", "həyat"]),
    
    ("7.1 Yer qabığındakı süxurlar", "2024H1", "B07", "M01", ["yer qabığı", "süxur", "maqmatik", "çökmə"]),
    ("7.2 Hava şəraiti və suxurların aşınması", "2024H1", "B07", "M02", ["aşınma", "suxurların aşınması", "hava şəraiti"]),
    ("7.3 Torpaq necə yaranır", "2024H1", "B07", "M03", ["torpaq", "yaranır", "humus"]),
    
    # Hissə 2
    ("8.1 Qüvvənin təsirinədən asılıdır", "2024H2", "B08", "M01", ["elektrik", "dövrə", "qüvvənin təsirinədən"]),
    ("8.2 Ağırlıq qüvvəsi", "2024H2", "B08", "M02", ["ağırlıq qüvvəsi", "cərəyan"]),
    ("8.3 Sürtünmə qüvvəsi", "2024H2", "B08", "M03", ["sürtünmə", "izolyator", "keçirici"]),
    
    ("9.1 Səs necə yaranır", "2024H2", "B09", "M01", ["səs", "yaranır", "titrəyiş"]),
    ("9.2 Səslər bir-birindən necə fərqlənir", "2024H2", "B09", "M02", ["fərqlənir", "tezlik", "hündürlük", "tembr"]),
    ("9.3 Səs başqa mühitlərdə yayılırmı", "2024H2", "B09", "M03", ["mühit", "yayılır", "vakuum", "dalğa"]),
    
    ("10.1 Cisimlərin istidən genişlənməsi", "2024H2", "B10", "M01", ["genişlənmə", "isti"]),
    ("10.2 İstilik tarazlığı və istilik keçirmə", "2024H2", "B10", "M02", ["istilik", "tarazlıq", "keçirmə"]),
    ("10.3 İstilik enerjisinin konveksiya ilə ötürülməsi", "2024H2", "B10", "M03", ["konveksiya", "ötürülmə"]),
    ("10.4 İstilik enerjisinin şüalanma ilə ötürülməsi", "2024H2", "B10", "M04", ["şüalanma", "enerji"]),
    
    ("11.1 Uyğunlaşma nədir", "2024H2", "B11", "M01", ["uyğunlaşma", "adaptasiya"]),
    ("11.2 Heyvanlar mühitə necə uyğunlaşır", "2024H2", "B11", "M02", ["heyvan", "mühit", "uyğunlaşır"]),
    ("11.3 Heyvanlar sağ qalmaq üçün necə uyğunlaşır", "2024H2", "B11", "M03", ["sağ qalmaq", "müdafiə", "kamuflyaj"]),
    ("11.4 Bitkilər ətraf mühitə necə uyğunlaşır", "2024H2", "B11", "M04", ["bitki", "mühit"]),
    ("11.5 Canlılar ekstremal temperaturlarda necə yaşayır", "2024H2", "B11", "M05", ["ekstremal", "temperatur"]),
    ("11.6 Canlılar mühitə uyğunlaşa bilmədikdə nə baş verir", "2024H2", "B11", "M06", ["uyğunlaşa bilmədikdə", "məhv olma", "nəsli kəsilmə"]),
    
    ("12.1 Canlılar bir-birindən necə asılıdır", "2024H2", "B12", "M01", ["asılıdır", "qida zənciri"]),
    ("12.2 Ekoloji piramidalar nədir", "2024H2", "B12", "M02", ["ekoloji piramida", "enerji axını"]),
    
    ("13.1 Fosillər və fosil yanacaqlar", "2024H2", "B13", "M01", ["fosil", "yanacaq", "daş kömür", "neft"]),
    ("13.2 Yanma prosesi", "2024H2", "B13", "M02", ["yanma", "oksigen", "istilik"]),
    ("13.3 Təbiətdə karbon dövranı", "2024H2", "B13", "M03", ["karbon", "dövran"]),
    ("13.4 İstixana effekti və qlobal istiləşmə", "2024H2", "B13", "M04", ["istixana", "qlobal istiləşmə", "iqlim"]),
    
    ("14.1 Günəş sisteminin quruluşu .", "2024H2", "B14", "M01", ["günəş sistemi", "planet", "orbit"]),
    ("14.2 Ay və Yerin hərəkəti", "2024H2", "B14", "M02", ["ay", "yer", "hərəkət", "fırlanma"]),
    ("14.3 Yer kürəsi və fəsillər", "2024H2", "B14", "M03", ["fəsil", "meyillilik", "qış", "yay"])
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

def generate_science_question(topic_name, diff):
    if diff == "asan":
        q = f"'{topic_name}' bölməsində öyrənilən əsas anlayışın tərifi hansıdır?"
        corr = f"Bu, həmin prosesi və ya hadisəni ən sadə dillə ifadə edən doğru termindir."
        w1 = f"Bu anlayış biologiya deyil, yalnız humanitar fənlərə aid bir qaydadır."
        w2 = f"Bu, verilmiş hadisənin tamamilə əksi olan səhv bir prosesdir."
        w3 = f"Bu anlayış təbiətdə mövcud deyil, tamamilə uydurma bir şərtdir."
        expl = f"Təbiət elmlərində asan səviyyə (Bilmək/Xatırlamaq) şagirddən əsas qaydaları və elmi terminləri bilməsini tələb edir."
    elif diff == "orta":
        q = f"Verilmiş təbiət hadisəsi baş verdikdə '{topic_name}' mövzusuna əsasən sistemdə nə kimi dəyişiklik gözlənilir?"
        corr = f"Elmi qanunauyğunluqlar əsasında baş verən təbii və məntiqi dəyişiklik."
        w1 = f"Proses zamanı heç bir təbii dəyişiklik baş vermir, hər şey sabit qalır."
        w2 = f"Hadisə elmi qanunlara zidd olaraq geriyə doğru inkişaf edir."
        w3 = f"Bu vəziyyətdə proses tamamilə sönür və qeyri-mümkün hala gəlir."
        expl = f"Orta çətinlikli (Anlamaq) suallar şagirdin təbii prosesləri başa düşməsini və izah etməsini ölçür."
    else:
        q = f"Bir qrup tədqiqatçı təcrübə zamanı '{topic_name}' anlayışına zidd olan bir nəticə müşahidə edirlər. Buna səbəb hansı kənar amil ola bilər?"
        corr = f"Sistemə kənardan təsir edən və şəraiti dəyişdirən xüsusi təbii faktor."
        w1 = f"Müşahidə edilən kənar amilin prosesə heç bir aidiyyəti və təsiri yoxdur."
        w2 = f"Bütün canlı və cansız aləm bu qanundan tamamilə müstəqil işlədiyi üçün təsadüfi xətadır."
        w3 = f"Tədqiqatçıların istifadə etdiyi sadə avadanlıqlar heç vaxt bu fərqi yarada bilməz."
        expl = f"Çətin (Tətbiq/Təhlil) səviyyə təbiət hadisələrinin səbəb-nəticə əlaqələrini tapmağı və fərziyyə irəli sürməyi gərəkdirir."
        
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
            q, opts, ans, expl = generate_science_question(topic, diff)
            bloom = get_bloom(diff)
            new_t = {
                "id": random.randint(100000000, 999999999),
                "category": "Təbiət 6",
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
        t["passport_id"] = f"06-TƏB-{part}-{b_code}-{m_code}-{bl_code}-{d_code}-{seq}"
        
    report.append(f"{topic} -- {len(topic_final_tests)}")
    final_all_tests.extend(topic_final_tests)

db["Təbiət 6"] = final_all_tests

with open(db_path, 'w', encoding='utf8') as f:
    json.dump(db, f, ensure_ascii=False, indent=2)

print("\n--- HESABAT ---")
for r in report:
    print(r)
print(f"Cəmi Test Sayı: {len(final_all_tests)}")
