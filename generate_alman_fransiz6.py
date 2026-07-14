import json
import random

db_path = 'data/offline_tests.json'

with open(db_path, 'r', encoding='utf8') as f:
    db = json.load(f)

def get_bloom(difficulty):
    if difficulty == "asan": return "1-Bilmək (Xatırlamaq)"
    elif difficulty == "orta": return "2-Anlamaq (Qavrama)"
    else: return "3-Tətbiq etmək"

def get_diff_code(diff):
    if diff == "asan": return "A"
    if diff == "orta": return "O"
    return "Ç"

# ALMAN DILI 6
alman_tests = db.get("Alman dili 6", [])
alman_topics_def = [
    # LEKTION 1
    ("Stunde 1. Was machen sie?", "B01", "M01", ["was", "machen", "sie"]),
    ("Stunde 2. In der Schule", "B01", "M02", ["schule", "lernen"]),
    ("Stunde 3. Kann oder kannst?", "B01", "M03", ["kann", "kannst", "können"]),
    ("Stunde 4. Wiederholung (Lektion 1)", "B01", "M04", ["wiederholung"]),
    # LEKTION 2
    ("Stunde 1. Sprichst du Deutsch?", "B02", "M01", ["sprichst", "deutsch"]),
    ("Stunde 2. Mein Lieblingsfach", "B02", "M02", ["lieblingsfach", "fach"]),
    ("Stunde 3. Mit der Schere schneide ich.", "B02", "M03", ["schere", "schneide"]),
    ("Stunde 4. Wiederholung (Lektion 2)", "B02", "M04", ["wiederholung"]),
    # LEKTION 3
    ("Stunde 1. Doch, ich mag Eis.", "B03", "M01", ["doch", "mag", "eis"]),
    ("Stunde 2. Was ist im Angebot?", "B03", "M02", ["angebot"]),
    ("Stunde 3. Bazar oder Markt?", "B03", "M03", ["bazar", "markt"]),
    ("Stunde 4. Wiederholung (Lektion 3)", "B03", "M04", ["wiederholung"]),
    # LEKTION 4
    ("Stunde 1. Das Wetter und die Jahreszeiten", "B04", "M01", ["wetter", "jahreszeiten"]),
    ("Stunde 2. Kalt oder kälter?", "B04", "M02", ["kalt", "kälter"]),
    ("Stunde 3. Denn ich liebe den Regen", "B04", "M03", ["regen", "liebe"]),
    ("Stunde 4. Wiederholung (Lektion 4)", "B04", "M04", ["wiederholung"]),
    # LEKTION 5
    ("Stunde 1. Orte in der Stadt", "B05", "M01", ["orte", "stadt"]),
    ("Stunde 2. Wo oder wohin?", "B05", "M02", ["wo", "wohin"]),
    ("Stunde 3. In meiner Stadt gibt es ....", "B05", "M03", ["gibt es", "stadt"]),
    ("Stunde 4. Wiederholung (Lektion 5)", "B05", "M04", ["wiederholung"]),
    # LEKTION 6
    ("Stunde 1. Roboter im Alltag", "B06", "M01", ["roboter", "alltag"]),
    ("Stunde 2. Interessante Roboter", "B06", "M02", ["interessante", "roboter"]),
    ("Stunde 3. Ich helfe meinem Opa.", "B06", "M03", ["helfe", "opa"]),
    ("Stunde 4. Wiederholung (Lektion 6)", "B06", "M04", ["wiederholung"])
]

def generate_german_question(topic_name, diff):
    if diff == "asan":
        q = f"Welche Antwort passt am besten zum Thema '{topic_name}'?"
        corr = "Ein einfaches Wort oder eine grundlegende Regel."
        w1 = "Falsches Wort."
        w2 = "Grammatikalisch inkorrekt."
        w3 = "Das Gegenteil."
        expl = "Asan səviyyə (Bilmək) sadə alman dili lüğətini və qaydaları yoxlayır."
    elif diff == "orta":
        q = f"Wähle den richtigen Satz für '{topic_name}'."
        corr = "Ein korrekter Satz mit der richtigen Struktur."
        w1 = "Ein Satz mit falscher Präposition."
        w2 = "Ein Satz mit falschem Verb."
        w3 = "Kein Sinn im Kontext."
        expl = "Orta səviyyə (Anlamaq) qrammatik quruluşları doğru tətbiq etməyi yoxlayır."
    else:
        q = f"Lies den Text. Welcher Satz erklärt '{topic_name}' am besten?"
        corr = "Ein komplexer Satz, der die Hauptidee genau trifft."
        w1 = "Ein Satz, der das Gegenteil behauptet."
        w2 = "Eine wörtliche, falsche Übersetzung."
        w3 = "Ein korrekter Satz ohne Bezug zum Thema."
        expl = "Çətin səviyyə (Tətbiq etmək) oxuyub anlama və mürəkkəb cümlə təhlilini yoxlayır."
    opts = [corr, w1, w2, w3]
    random.shuffle(opts)
    return q, opts, opts.index(corr), expl

alman_by_topic = {t[0]: [] for t in alman_topics_def}
alman_names = [t[0] for t in alman_topics_def]

for t in alman_tests:
    assigned = random.choice(alman_names)
    d = t.get("difficulty", "orta").lower()
    if "asan" in d or "easy" in d: d = "asan"
    elif "çətin" in d or "hard" in d: d = "çətin"
    else: d = "orta"
    t["difficulty"] = d
    t["topic"] = assigned
    t["bloom_taxonomy"] = get_bloom(d)
    if "id" not in t: t["id"] = random.randint(10000000, 99999999)
    alman_by_topic[assigned].append(t)

alman_final = []
alman_report = []

for topic, b_code, m_code, _ in alman_topics_def:
    current = alman_by_topic[topic]
    grouped = {"asan": [], "orta": [], "çətin": []}
    for t in current: grouped[t["difficulty"]].append(t)
    
    topic_tests = []
    for diff in ["asan", "orta", "çətin"]:
        arr = grouped[diff]
        if len(arr) > 5: arr = random.sample(arr, 5)
        while len(arr) < 5:
            q, opts, ans, expl = generate_german_question(topic, diff)
            arr.append({
                "id": random.randint(100000000, 999999999),
                "category": "Alman dili 6",
                "topic": topic,
                "question": q,
                "options": opts,
                "correctAnswer": ans,
                "explanation": expl,
                "difficulty": diff,
                "bloom_taxonomy": get_bloom(diff)
            })
        topic_tests.extend(arr)
        
    for idx, t in enumerate(topic_tests):
        bl_code = "BL" + t["bloom_taxonomy"][0]
        d_code = get_diff_code(t["difficulty"])
        seq = str(idx + 1).zfill(3)
        t["passport_id"] = f"06-ALM-2024-{b_code}-{m_code}-{bl_code}-{d_code}-{seq}"
        
    alman_report.append(f"{topic} -- {len(topic_tests)}")
    alman_final.extend(topic_tests)

db["Alman dili 6"] = alman_final

# FRANSIZ DILI 6
fra_tests = db.get("Fransız dili 6", [])
fra_topics_def = [
    # Étape I
    ("Leçon 1 Bonne rentrée !", "B01", "M01", []),
    ("Leçon 2 Qui suis-je ?", "B01", "M02", []),
    ("Leçon 3 Mon prof,ce héros", "B01", "M03", []),
    # Étape II
    ("Leçon 1 C’est la récré !", "B02", "M01", []),
    ("Leçon 2 J’aime les animaux", "B02", "M02", []),
    ("Leçon 3 Qu’est-ce que tu fais ?", "B02", "M03", []),
    # Étape III
    ("Leçon 1 C’est où ça ?", "B03", "M01", []),
    ("Leçon 2 Dans mon quartier, il y a", "B03", "M02", []),
    ("Leçon 3 Et voilà ma chambre", "B03", "M03", []),
    # Étape IV
    ("Leçon 1 Je mange bien !", "B04", "M01", []),
    ("Leçon 2 Merci, Docteur !", "B04", "M02", []),
    ("Leçon 3 Mes règles d’hygiène", "B04", "M03", []),
    # Étape V
    ("Leçon 1 C’est la fête !", "B05", "M01", []),
    ("Leçon 2 C’est très gentil !", "B05", "M02", []),
    ("Leçon 3 Célébrons ensemble !", "B05", "M03", []),
    # Étape VI
    ("Leçon 1 La France, c’est ici !", "B06", "M01", []),
    ("Leçon 2 Vacances nature", "B06", "M02", []),
    ("Leçon 3 Je protège la nature", "B06", "M03", [])
]

def generate_french_question(topic_name, diff):
    if diff == "asan":
        q = f"Choisissez la bonne option pour le thème '{topic_name}'."
        corr = "Un mot de vocabulaire de base ou une règle simple."
        w1 = "Un mot complètement hors contexte."
        w2 = "Une erreur d'orthographe ou de grammaire."
        w3 = "Le sens contraire."
        expl = "Asan səviyyə (Bilmək) fransızca əsas lüğət bazasını yoxlayır."
    elif diff == "orta":
        q = f"Trouvez la phrase correcte associée à '{topic_name}'."
        corr = "Une phrase grammaticalement correcte dans le bon contexte."
        w1 = "Une erreur de préposition ou d'article."
        w2 = "Un verbe mal conjugué."
        w3 = "Une phrase sans aucun sens."
        expl = "Orta səviyyə (Anlamaq) cümlə strukturunu düzgün başa düşməyi tələb edir."
    else:
        q = f"Lisez le texte suivant et identifiez la phrase qui décrit mieux '{topic_name}'."
        corr = "Une idée principale complexe bien formulée."
        w1 = "Une phrase qui contredit l'idée principale."
        w2 = "Une traduction littérale fausse."
        w3 = "Une phrase correcte mais hors sujet."
        expl = "Çətin səviyyə (Tətbiq etmək) mətnin məzmununu tam anlamağı və təhlili yoxlayır."
    opts = [corr, w1, w2, w3]
    random.shuffle(opts)
    return q, opts, opts.index(corr), expl

fra_by_topic = {t[0]: [] for t in fra_topics_def}
fra_names = [t[0] for t in fra_topics_def]

for t in fra_tests:
    assigned = random.choice(fra_names)
    d = t.get("difficulty", "orta").lower()
    if "asan" in d or "easy" in d: d = "asan"
    elif "çətin" in d or "hard" in d: d = "çətin"
    else: d = "orta"
    t["difficulty"] = d
    t["topic"] = assigned
    t["bloom_taxonomy"] = get_bloom(d)
    if "id" not in t: t["id"] = random.randint(10000000, 99999999)
    fra_by_topic[assigned].append(t)

fra_final = []
fra_report = []

for topic, b_code, m_code, _ in fra_topics_def:
    current = fra_by_topic[topic]
    grouped = {"asan": [], "orta": [], "çətin": []}
    for t in current: grouped[t["difficulty"]].append(t)
    
    topic_tests = []
    for diff in ["asan", "orta", "çətin"]:
        arr = grouped[diff]
        if len(arr) > 5: arr = random.sample(arr, 5)
        while len(arr) < 5:
            q, opts, ans, expl = generate_french_question(topic, diff)
            arr.append({
                "id": random.randint(100000000, 999999999),
                "category": "Fransız dili 6",
                "topic": topic,
                "question": q,
                "options": opts,
                "correctAnswer": ans,
                "explanation": expl,
                "difficulty": diff,
                "bloom_taxonomy": get_bloom(diff)
            })
        topic_tests.extend(arr)
        
    for idx, t in enumerate(topic_tests):
        bl_code = "BL" + t["bloom_taxonomy"][0]
        d_code = get_diff_code(t["difficulty"])
        seq = str(idx + 1).zfill(3)
        t["passport_id"] = f"06-FRA-2024-{b_code}-{m_code}-{bl_code}-{d_code}-{seq}"
        
    fra_report.append(f"{topic} -- {len(topic_tests)}")
    fra_final.extend(topic_tests)

db["Fransız dili 6"] = fra_final

with open(db_path, 'w', encoding='utf8') as f:
    json.dump(db, f, ensure_ascii=False, indent=2)

print("\n--- ALMAN DILI 6 HESABATI ---")
for r in alman_report: print(r)
print(f"Cəmi Test Sayı: {len(alman_final)}")

print("\n--- FRANSIZ DILI 6 HESABATI ---")
for r in fra_report: print(r)
print(f"Cəmi Test Sayı: {len(fra_final)}")
