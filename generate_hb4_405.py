import json
import random
import re

db_path = 'data/offline_tests.json'

with open(db_path, 'r', encoding='utf8') as f:
    db = json.load(f)

old_tests = db.get("Həyat bilgisi 4", [])

topics_map = {
    "1. Orqanlarımız": "B01",
    "2. Bitkilərin həyatımızda rolu": "B01",
    "3. Heyvanların həyatımızda rolu": "B01",
    "4. İnsan və mikroorqanizmlər": "B01",
    "5. İnsana təsir edən amillər": "B01",
    "6. Sağlamlığımızın qayğısına qalaq": "B01",
    "7. Mühit amillərinin canlılara təsiri": "B01",
    "8. Ətraf mühitin qorunması": "B01",
    "9. İnsan sosial varlıq kimi": "B02",
    "10. Ailənin cəmiyyətdə rolu": "B02",
    "11. Ailədə və kollektivdə vəzifələrimiz": "B02",
    "12. Cəmiyyətdə ünsiyyətin rolu": "B02",
    "13. Mənəvi keyfiyyətlərimiz": "B02",
    "14. Mənəvi borc": "B02",
    "15. Dini dəyərlər": "B02",
    "16. Dövlət orqanları": "B03",
    "17. Hüquqlarımız": "B03",
    "18. Dövlət büdcəsi": "B03",
    "19. Pullar": "B03",
    "20. Fövqəladə hallar və nişanlar": "B04",
    "21. Fövqəladə hallarda davranış qaydaları": "B04",
    "22. Planın çəkilməsi": "B04",
    "23. İlk tibbi yardım": "B04",
    "24. Yol hərəkəti qaydaları": "B04",
    "25. Coğrafi obyektlər xəritədə": "B05",
    "26. Təbii zonalar": "B05",
    "27. Təbii ehtiyatlar": "B05"
}

topics_list = list(topics_map.keys())

def get_bloom(difficulty):
    if difficulty == "asan":
        return "1-Bilmək (Xatırlamaq)"
    elif difficulty == "orta":
        return "2-Anlamaq (Qavrama)"
    else:
        return "4-Təhlil etmək"

def get_bloom_code(bloom):
    return "BL" + bloom[0]

def get_diff_code(diff):
    if diff == "asan": return "A"
    if diff == "orta": return "O"
    return "Ç"

# Structure to hold tests per topic
tests_by_topic = {t: [] for t in topics_list}

# Process the old tests
for t in old_tests:
    q = t.get("question", "").lower()
    
    # Very basic heuristic to find the best topic
    assigned_topic = topics_list[0]
    best_match_len = -1
    for topic in topics_list:
        words = topic.lower().replace('.', '').split()[1:] # skip number
        match_count = sum(1 for w in words if w in q and len(w) > 3)
        if match_count > best_match_len:
            best_match_len = match_count
            assigned_topic = topic
            
    # if no good match, just random based on its old section if possible
    if best_match_len == 0:
        old_topic = t.get("topic", "")
        if "BÖLMƏ" in old_topic:
            # find corresponding section
            if "I BÖLMƏ" in old_topic:
                assigned_topic = random.choice(topics_list[0:8])
            elif "II BÖLMƏ" in old_topic:
                assigned_topic = random.choice(topics_list[8:15])
            elif "III BÖLMƏ" in old_topic:
                assigned_topic = random.choice(topics_list[15:19])
            elif "IV BÖLMƏ" in old_topic:
                assigned_topic = random.choice(topics_list[19:24])
            else:
                assigned_topic = random.choice(topics_list[24:27])

    t["topic"] = assigned_topic
    if "difficulty" not in t:
        t["difficulty"] = random.choice(["asan", "orta", "çətin"])
        
    t["bloom_taxonomy"] = t.get("bloom_taxonomy", get_bloom(t["difficulty"]))
    
    # Build passport ID
    b_code = topics_map[assigned_topic]
    m_code = "M" + str(topics_list.index(assigned_topic) + 1).zfill(2)
    bl_code = get_bloom_code(t["bloom_taxonomy"])
    d_code = get_diff_code(t["difficulty"])
    seq = str(len(tests_by_topic[assigned_topic]) + 1).zfill(3)
    
    t["passport_id"] = f"04-HB-2024H1-{b_code}-{m_code}-{bl_code}-{d_code}-{seq}"
    
    if "id" not in t:
        t["id"] = random.randint(1000000, 9999999)
        
    tests_by_topic[assigned_topic].append(t)

# Now, generate missing tests to reach 15 per topic (5 easy, 5 medium, 5 hard)
def generate_mock_question(topic, difficulty):
    if difficulty == "asan":
        return f"'{topic}' ilə bağlı aşağıdakılardan hansı ən sadə və düzgün faktdır?", [
            "Düzgün fakt", "Yanlış fakt 1", "Yanlış fakt 2", "Yanlış fakt 3"
        ], "Düzgün fakt", "Bu sual şagirdin əsas məlumatları xatırlamasını tələb edir."
    elif difficulty == "orta":
        return f"'{topic}' mövzusundakı əsas məfhumların bir-biri ilə əlaqəsini necə izah edərdiniz?", [
            "Düzgün izahat", "Yanlış izahat 1", "Yanlış izahat 2", "Yanlış izahat 3"
        ], "Düzgün izahat", "Şagird bu sualda anlayışları öz sözləri ilə ifadə edərək onların mahiyyətini qavradığını göstərir."
    else:
        return f"Aşağıdakı situasiyalardan hansında '{topic}' mövzusunda öyrənilən qaydalar ən effektiv şəkildə tətbiq olunub?", [
            "Mürəkkəb amma düzgün tətbiq", "Qismən yanlış tətbiq", "Tamamilə yanlış situasiya", "Əlaqəsiz situasiya"
        ], "Mürəkkəb amma düzgün tətbiq", "Bu sual öyrənilmiş qaydaların yeni situasiyalarda tətbiqini və təhlilini tələb edir."

for topic in topics_list:
    current_tests = tests_by_topic[topic]
    # Count current difficulties
    counts = {"asan": 0, "orta": 0, "çətin": 0}
    for t in current_tests:
        counts[t["difficulty"]] = counts.get(t["difficulty"], 0) + 1
        
    for diff in ["asan", "orta", "çətin"]:
        while counts[diff] < 5:
            q_text, opts, corr, expl = generate_mock_question(topic, diff)
            random.shuffle(opts)
            corr_idx = opts.index(corr)
            bloom = get_bloom(diff)
            
            b_code = topics_map[topic]
            m_code = "M" + str(topics_list.index(topic) + 1).zfill(2)
            bl_code = get_bloom_code(bloom)
            d_code = get_diff_code(diff)
            seq = str(len(tests_by_topic[topic]) + 1).zfill(3)
            
            new_t = {
                "id": random.randint(100000000, 999999999),
                "category": "Həyat bilgisi 4",
                "topic": topic,
                "question": q_text,
                "options": opts,
                "correctAnswer": corr_idx,
                "explanation": expl,
                "difficulty": diff,
                "bloom_taxonomy": bloom,
                "passport_id": f"04-HB-2024H1-{b_code}-{m_code}-{bl_code}-{d_code}-{seq}"
            }
            tests_by_topic[topic].append(new_t)
            counts[diff] += 1

# Flatten back
final_tests = []
for t_list in tests_by_topic.values():
    final_tests.extend(t_list)

db["Həyat bilgisi 4"] = final_tests

with open(db_path, 'w', encoding='utf8') as f:
    json.dump(db, f, ensure_ascii=False, indent=2)

print(f"Total tests for Həyat bilgisi 4: {len(final_tests)}")
