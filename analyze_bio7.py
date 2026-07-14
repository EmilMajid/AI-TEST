import json

db_path = 'data/offline_tests.json'

with open(db_path, 'r', encoding='utf8') as f:
    db = json.load(f)

old_tests = db.get("Biologiya 7", [])

topics_def = [
    # Part 1
    ("Biologiya nəyi öyrənir", ["biologiya", "öyrənir", "canlı", "elm"]),
    ("Biologiyanı öyrənmək bizə nə verir", ["öyrənmək", "fayda", "əhəmiyyət"]),
    ("1.1 Canlıların əsas xüsusiyyətləri", ["canlı", "xüsusiyyət", "həyat"]),
    ("1.2 İşıq mikroskopunun quruluşu", ["mikroskop", "quruluş", "işıq", "okulyar", "obyektiv"]),
    ("1.3 İşıq mikroskopundan istifadə", ["mikroskop", "istifadə", "preparat", "baxmaq"]),
    ("1.4 Hüceyrənin ümumi quruluşu", ["hüceyrə", "quruluş", "qişa", "sitoplazma", "nüvə"]),
    ("1.5 Bitki və heyvan hüceyrələrinin quruluşu", ["bitki", "heyvan", "hüceyrə", "fərq"]),
    ("1.6 Bakteriyalar", ["bakteriya", "prokaryot"]),
    ("1.7 İxtisaslaşmış hüceyrələr", ["ixtisas", "toxuma", "hüceyrə"]),
    ("2.1 Orqanizmin təşkili səviyyələri", ["orqanizm", "səviyyə", "orqan", "toxuma", "sistem"]),
    ("2.2 Çiçəkli bitkilərin orqanları. Kök", ["kök", "sistem", "mil", "saçaqlı"]),
    ("2.3 Çiçəkli bitkilərin orqanları. Gövdə", ["gövdə", "oduncaq", "qabıq"]),
    ("2.4 Çiçəkli bitkilərin orqanları. Yarpaq", ["yarpaq", "damar", "lət"]),
    ("3.1 Çiçək və onun quruluşu", ["çiçək", "ləçək", "erkəkcik", "dişicik"]),
    ("3.2 Tozlanma", ["tozlanma", "həşərat", "külək"]),
    ("3.3 Çiçəkli bitkilərdə cinsiyyətli çoxalma. Mayalanma", ["mayalanma", "cinsiyyətli", "ikiqat"]),
    ("3.4 Toxumun quruluşu", ["toxum", "quruluş", "ləpə", "rüşeym"]),
    ("3.5 Toxumların cücərməsi", ["cücərmə", "şərait", "istilik", "su", "hava"]),
    ("3.6 Meyvə", ["meyvə", "quru", "şirəli"]),
    ("3.7 Meyvə və toxumların yayılması", ["yayılma", "külək", "heyvan"]),
    ("3.8 Çiçəkli bitkilərdə qeyri-cinsi çoxalma", ["qeyri-cinsi", "çoxalma", "vegetativ"]),
    ("3.9 Bitkilərin həyat dövrü", ["həyat dövrü", "inkişaf"]),
    # Part 2
    ("4.1 Onurğalı heyvanların xarici bədən örtükləri", ["onurğalı", "örtük", "dəri", "pulcuq"]),
    ("4.2 Onurğalı heyvanların bədən hissələri", ["onurğalı", "bədən hissələri", "baş", "gövdə", "ətraflar"]),
    ("4.3 Onurğasız heyvanlarda bədənin əsas hissələri. Həlqəvi qurdlar və bağırsaqboşluqlular", ["onurğasız", "həlqəvi", "qurd", "bağırsaqboşluqlu"]),
    ("4.4 Onurğasız heyvanlarda bədənin əsas hissələri.Buğumayaqlılar", ["buğumayaq", "cücü", "hörümçək"]),
    ("4.5 Onurğasız heyvanlarda bədənin əsas hissələri.Molyusklar", ["molyusk", "ilbiz", "sədəf"]),
    ("5.1 Ekoloji amillər", ["ekoloji", "amil", "mühit"]),
    ("5.2 Təbii yaşayış mühitləri", ["yaşayış", "mühit", "su", "quru"]),
    ("5.3 Biomüxtəliflik", ["biomüxtəliflik", "növ", "müxtəlif"]),
    ("6.1 Ekosistemlərdə qida münasibətləri. Qida zəncirləri", ["qida", "zəncir", "münasibət", "produksent", "konsument"]),
    ("6.2 Ekosistemlərdə qida münasibətləri. Qida şəbəkəsi", ["qida şəbəkəsi", "şəbəkə"]),
    ("6.3 Su və quru ekosistemlərində qida şəbəkələri", ["su", "quru", "ekosistem", "qida şəbəkəsi"]),
    ("6.4 Ekoloji piramidalar", ["ekoloji", "piramida", "kütlə", "enerji"]),
    ("7.1 Fiziki sağlamlıq", ["fiziki", "sağlam", "idman"]),
    ("7.2 Bədən kütlə indeksi və sağlamlıq", ["bədən kütlə", "indeks", "piylənmə"]),
    ("7.3 Psixi sağlamlıq", ["psixi", "stres", "yuxu"]),
    ("7.4 Zərərli vərdişlər və sağlamlıq", ["zərərli", "vərdiş", "siqaret", "alkoqol"])
]

topic_counts = {t[0]: 0 for t in topics_def}

for t in old_tests:
    q = t.get("question", "").lower()
    topic_str = t.get("topic", "").lower()
    search_text = q + " " + topic_str
    
    assigned_topic = None
    best_score = -1
    
    for (name, kws) in topics_def:
        score = sum(1 for kw in kws if kw.lower() in search_text)
        if score > best_score:
            best_score = score
            assigned_topic = name
            
    if best_score == 0 or not assigned_topic:
        assigned_topic = topics_def[0][0]
        
    topic_counts[assigned_topic] += 1

print("--- BİOLOGİYA 7 TEST ANALİZİ ---")
print(f"Bazada mövcud test sayı: {len(old_tests)}")
print(f"Mövzu sayı: {len(topics_def)}")
print(f"Hədəflənən ümumi test sayı (hər mövzuda 15): {len(topics_def) * 15}")
print("===================================\n")

total_missing = 0
for topic, _ in topics_def:
    cnt = topic_counts[topic]
    # We will limit up to 15, if more than 15, we sample down to 15 later.
    useful_cnt = min(cnt, 15)
    missing = 15 - useful_cnt
    total_missing += missing
    print(f"{topic} -> Mövcud: {cnt} test | Çatışmayan (generasiya olunacaq): {missing} test")

print(f"\n===================================")
print(f"Cəmi GENERASİYA OLUNACAQ YENİ TEST SAYI: {total_missing}")
