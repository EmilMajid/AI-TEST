import json
import random

db_path = 'data/offline_tests.json'

with open(db_path, 'r', encoding='utf8') as f:
    db = json.load(f)

old_tests = db.get("Texnologiya 6", [])

topics_def = [
    # I. Məişət mədəniyyəti
    ("1. Məktəbdə ünsiyyət və davranış mədəniyyəti", "2024", "B01", "M01", ["məktəbdə", "ünsiyyət", "davranış", "mədəniyyət", "nizam-intizam"]),
    ("2. Ailə büdcəsinin formalaşdırılması. Gəlir və xərc", "2024", "B01", "M02", ["büdcə", "gəlir", "xərc", "ailə", "qənaət"]),
    ("3. Divar əşyalarının bərkidilməsi və bərkitmə yerlərinin təmiri texnologiyası", "2024", "B01", "M03", ["divar", "əşya", "bərkitmə", "təmir", "şurup", "mismar"]),
    ("4. Qapı kilidlərinin növləri, quruluşu və quraşdırılması", "2024", "B01", "M04", ["qapı", "kilid", "quraşdırma", "qıfıl"]),
    ("5. Sanitar-texniki avadanlıqların sadə təmiri", "2024", "B01", "M05", ["sanitar", "texniki", "təmir", "kran", "su borusu"]),
    ("6. Meyvə ağaclarının əkilməsi və meyvələrin saxlanma texnologiyası", "2024", "B01", "M06", ["meyvə", "ağac", "əkilməsi", "saxlanma", "ting"]),
    
    # II.Oduncağın emalı texnologiyası
    ("7. Oduncağın tədarükü və mişar materiallarının istehsalı", "2024", "B02", "M01", ["oduncaq", "tədarük", "mişar", "istehsal", "ağac", "taxta"]),
    ("8. Məmulatların konstruksiya edilməsi. Düzbucaqlı və müxtəlif formalı detalların çertyoju", "2024", "B02", "M02", ["konstruksiya", "çertyoj", "detal", "düzbucaqlı"]),
    ("9. Tirciklərin birləşdirilməsi", "2024", "B02", "M03", ["tircik", "birləşdirmə", "yapışqan", "mismar"]),
    ("10. Əl alətləri ilə silindrik və konusşəkilli detalların hazırlanması", "2024", "B02", "M04", ["əl alət", "silindrik", "konus", "hazırlanma", "yeyə"]),
    ("11. Oduncaq və metal məmulatların bəzədilməsi", "2024", "B02", "M05", ["oduncaq", "bəzədilmə", "oyma", "naxış", "laklama"]),
    
    # III.Metalların emalı texnologiyası
    ("12. Metal pəstahlann kəsilməsi", "2024", "B03", "M01", ["metal", "pəstah", "kəsilmə", "mişar", "qayçı"]),
    ("13. Metal pəstahların yeyələnməsi. Ştangenpərgar", "2024", "B03", "M02", ["metal", "yeyələnmə", "ştangenpərgar", "ölçmə"]),
    ("14. Mexanikləşdirilmiş əl alətləri", "2024", "B03", "M03", ["mexanik", "əl alət", "drel", "burğu"]),
    ("15. Elektrik enerjisinin ötürülməsi və istifadəsi yolları", "2024", "B03", "M04", ["elektrik", "enerji", "ötürülmə", "istifadə"]),
    ("16. Sadə elektrik dövrəsi", "2024", "B03", "M05", ["elektrik dövrəsi", "mənbə", "işlədici", "naqil", "açar"]),
    ("17. Detallann lehimləmə ilə birləşdirilməsi", "2024", "B03", "M06", ["lehim", "lehimləmə", "birləşdirilmə", "metal"]),
    
    # IV. Ərzaq məhsullarının emalı texnologiyası
    ("18. Mexanikləşdirilmiş mətbəx avadanlığının quruluşu və iş prinsipi", "2024", "B04", "M01", ["mətbəx", "avadanlıq", "mexanik", "mikser", "kombayn"]),
    ("19. İnsan həyatmda qida məhsulları", "2024", "B04", "M02", ["insan", "həyat", "qida", "zülal", "karbohidrat", "vitamin"]),
    ("20. Südlü xörəklərin hazırlanma texnologiyası", "2024", "B04", "M03", ["süd", "xörək", "hazırlanma", "sıyıq"]),
    ("21. Yarmadan, paxlalı bitkilərdən və makaron məmulatlarından xörəklərin hazırlanma texnologiyası", "2024", "B04", "M04", ["yarma", "paxlalı", "makaron", "xörək"]),
    ("22. Duru xəmirdən məmulatların hazırlanma texnologiyası", "2024", "B04", "M05", ["duru xəmir", "xəmir", "blinçik", "pankek"]),
    ("23. Tərəvəz xörəklərinin hazırlanma texnologiyası", "2024", "B04", "M06", ["tərəvəz", "xörək", "salat", "bişirmə"]),
    
    # V. Parçanın emalı texnologiyası və naxıştikmə
    ("24. Məişət tikiş maşınının quruluşu", "2024", "B05", "M01", ["məişət", "tikiş", "maşın", "quruluş"]),
    ("25. Tikiş maşınının işə hazırlanması", "2024", "B05", "M02", ["tikiş maşını", "hazırlanma", "sap", "iynə"]),
    ("26. Tikiş maşınında əməliyyatlar", "2024", "B05", "M03", ["tikiş maşını", "əməliyyat", "tikmə", "tikiş"]),
    ("27. Naxıştikmə üçün alət və tərtibatlar. Hesab naxıştikməsinə hazırlıq", "2024", "B05", "M04", ["naxıştikmə", "alət", "tərtibat", "hesab naxıştikməsi", "kasnaq"]),
    ("28. Geyimin təmiri texnologiyası", "2024", "B05", "M05", ["geyim", "təmir", "yamaq", "düymə", "sökmək"])
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

def generate_tex_question(topic_name, diff):
    if diff == "asan":
        q = f"'{topic_name}' prosesi və ya mövzusu zamanı istifadə olunan əsas alət və ya qayda hansıdır?"
        corr = f"Bu, həmin fəaliyyət sahəsində ən çox tətbiq edilən təməl təhlükəsizlik qaydası və ya ən vacib avadanlıqdır."
        w1 = f"Bu alət (və ya qayda) tamam başqa bir sahəyə – məsələn, tibbə və ya ağır sənayeyə aiddir."
        w2 = f"Bu, tamamilə uydurulmuş bir sözdür və heç bir iş prosesində iştirak etmir."
        w3 = f"Bu tərtibat mövcud olsa da, verilmiş əməliyyat üçün istifadəsi qəti qadağandır."
        expl = f"Texnologiya fənnində asan suallar (Bilmək/Xatırlamaq səviyyəsi) alətlərin adlarını, sadə təyinatını və təməl qaydaları xatırlamağı yoxlayır."
    elif diff == "orta":
        q = f"İşçi '{topic_name}' ilə bağlı əməliyyat apararkən ardıcıllığı pozsa və ya səhv bir alət seçsə nə baş verə bilər?"
        corr = f"Əməliyyatın keyfiyyəti kəskin aşağı düşər, detal zədələnər və ya istehsalat xətası yaranar."
        w1 = f"Heç nə baş verməz, iş bütün hallarda tam eyni dərəcədə uğurla tamamlanacaqdır."
        w2 = f"Səhv edildikdə avtomatik olaraq digər maşınlar işə düşüb detalı düzəldəcəklər."
        w3 = f"Bu zaman əşya qəfildən tamamilə fərqli bir alətə çevrilərək formasını dəyişər."
        expl = f"Orta çətinlikli suallar (Anlamaq) texnoloji prosesin gedişatını, alətlərin düzgün ardıcıllığını və səhvlərin məntiqi nəticəsini dərk etməyi yoxlayır."
    else:
        q = f"Sizdən '{topic_name}' sahəsinə aid yeni və daha səmərəli bir yanaşma tətbiq etmək tələb olunsa, verilmiş şərtlər daxilində ən optimal texnoloji qərar hansı olar?"
        corr = f"Mövcud materiallara, vaxta və təhlükəsizlik qaydalarına ən uyğun olan, rasional və iqtisadi baxımdan sərfəli həll üsulu."
        w1 = f"Ən bahalı və ən çox enerji tələb edən maşınları alıb sadə bir detalı onlarla düzəltmək."
        w2 = f"Təhlükəsizlik texnikası qaydalarını tamamilə gözardı edərək işi sürətlə, lakin riskli şəkildə bitirmək."
        w3 = f"İşin ümumiyyətlə mümkün olmadığını bildirərək, materialı və alətləri tullamaq."
        expl = f"Çətin suallar (Tətbiq etmək / Təhlil) öyrənilmiş texnoloji bilikləri real və ya yeni iş situasiyalarında tətbiq edərək optimal həll tapmağı gərəkdirir."
        
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
            q, opts, ans, expl = generate_tex_question(topic, diff)
            bloom = get_bloom(diff)
            new_t = {
                "id": random.randint(100000000, 999999999),
                "category": "Texnologiya 6",
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
        t["passport_id"] = f"06-TEX-{part}-{b_code}-{m_code}-{bl_code}-{d_code}-{seq}"
        
    report.append(f"{topic} -- {len(topic_final_tests)}")
    final_all_tests.extend(topic_final_tests)

db["Texnologiya 6"] = final_all_tests

with open(db_path, 'w', encoding='utf8') as f:
    json.dump(db, f, ensure_ascii=False, indent=2)

print("\n--- HESABAT ---")
for r in report:
    print(r)
print(f"Cəmi Test Sayı: {len(final_all_tests)}")
