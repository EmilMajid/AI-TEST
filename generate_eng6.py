import json
import random

db_path = 'data/offline_tests.json'

with open(db_path, 'r', encoding='utf8') as f:
    db = json.load(f)

old_tests = db.get("İngilis dili 6", [])

topics_def = [
    # UNIT 1
    ("Places in Town", "2024", "B01", "M01", ["places", "town", "bank", "hospital", "museum"]),
    ("There is/are (Affirmative, Negative, Yes/No Questions and Short Answers)", "2024", "B01", "M02", ["there is", "there are", "there isn't", "there aren't", "is there", "are there"]),
    ("Prepositions of Place", "2024", "B01", "M03", ["prepositions", "in", "on", "under", "next to", "between", "behind", "in front of"]),
    ("Adverbs of Frequency", "2024", "B01", "M04", ["adverbs of frequency", "always", "usually", "often", "sometimes", "never"]),
    
    # UNIT 2
    ("Food", "2024", "B02", "M01", ["food", "fruit", "vegetables", "meat", "bread", "cheese", "drink"]),
    ("Can for Permission (Affirmative, Negative, Yes/No Questions and Short Answers)", "2024", "B02", "M02", ["can", "permission", "can i", "can we", "you can't"]),
    ("Cooking", "2024", "B02", "M03", ["cooking", "bake", "boil", "fry", "chop", "mix"]),
    ("Making Suggestions and Responding", "2024", "B02", "M04", ["suggestions", "shall we", "let's", "why don't we", "how about", "good idea"]),
    ("Subject and Object Pronouns", "2024", "B02", "M05", ["subject", "object", "pronouns", "me", "him", "her", "us", "them"]),
    
    # UNIT 3
    ("On Holiday", "2024", "B03", "M01", ["holiday", "vacation", "trip", "travel", "beach", "hotel"]),
    ("Past Simple of be (Affirmative and Negative)", "2024", "B03", "M02", ["past simple of be", "was", "were", "wasn't", "weren't"]),
    ("There was/were", "2024", "B03", "M03", ["there was", "there were", "there wasn't", "there weren't"]),
    ("Facilities, People and Activities", "2024", "B03", "M04", ["facilities", "activities", "pool", "gym", "tourist", "guide"]),
    
    # UNIT 4
    ("Story Verbs", "2024", "B04", "M01", ["story", "verbs", "happen", "decide", "believe", "appear"]),
    ("Past Simple of Regular Verbs (Affirmative)", "2024", "B04", "M02", ["past simple", "regular", "ed", "played", "visited", "watched"]),
    ("Time Expressions", "2024", "B04", "M03", ["time expressions", "yesterday", "last", "ago", "in 2010"]),
    ("Past Simple of Irregular Verbs (Affirmative and Negative), Past Simple of Regular Verbs (Negative)", "2024", "B04", "M04", ["irregular", "did not", "didn't", "went", "saw", "had"]),
    
    # UNIT 5
    ("Transport", "2024", "B05", "M01", ["transport", "bus", "train", "plane", "car", "ship", "bike"]),
    ("Past Simple of Regular and Irregular Verbs (Questions and Answers)", "2024", "B05", "M02", ["did", "questions", "did you", "did he", "short answers"]),
    ("Transport Verbs", "2024", "B05", "M03", ["transport verbs", "ride", "drive", "fly", "sail", "catch", "miss"]),
    ("Could for Ability in the Past (Affirmative, Negative, Yes/No Questions and Short Answers)", "2024", "B05", "M04", ["could", "couldn't", "ability", "past", "could you"]),
    
    # UNIT 6
    ("Personality Adjectives", "2024", "B06", "M01", ["personality", "adjectives", "brave", "kind", "clever", "friendly", "funny"]),
    ("Past Continuous (Affirmative and Negative)", "2024", "B06", "M02", ["past continuous", "was playing", "were doing", "wasn't watching"]),
    ("Feelings", "2024", "B06", "M03", ["feelings", "happy", "sad", "angry", "tired", "excited", "bored"]),
    ("Past Continuous (Questions and Answers)", "2024", "B06", "M04", ["past continuous questions", "was he", "were they", "what were you doing"]),
    
    # UNIT 7
    ("Innovation Verbs", "2024", "B07", "M01", ["innovation", "invent", "create", "discover", "design", "develop"]),
    ("Past Continuous and Past Simple", "2024", "B07", "M02", ["past continuous and past simple", "when", "while", "was doing when"]),
    ("Technology", "2024", "B07", "M03", ["technology", "computer", "smartphone", "internet", "screen", "keyboard"]),
    ("Possessive Pronouns", "2024", "B07", "M04", ["possessive pronouns", "mine", "yours", "his", "hers", "ours", "theirs"]),
    
    # UNIT 8
    ("Nature", "2024", "B08", "M01", ["nature", "mountain", "river", "forest", "tree", "animal", "plant"]),
    ("Verbs to Express Likes, Wants and Needs", "2024", "B08", "M02", ["likes", "wants", "needs", "like", "love", "hate", "want", "need"]),
    ("The Weather", "2024", "B08", "M03", ["weather", "sunny", "rainy", "cloudy", "windy", "snowy", "hot", "cold"]),
    ("Connectors (After And, Before, But, However and So)", "2024", "B08", "M04", ["connectors", "after", "before", "but", "however", "so", "and"])
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

def generate_english_question(topic_name, diff):
    if diff == "asan":
        q = f"Which option best completes the sentence related to '{topic_name}'?"
        corr = f"A simple and direct vocabulary word or basic grammatical rule from the topic."
        w1 = f"An unrelated word from a different unit."
        w2 = f"A grammatically incorrect word form."
        w3 = f"A word with the opposite meaning that does not fit the context."
        expl = f"Easy level (Bilmək/Xatırlamaq) tests the student's ability to recall basic vocabulary or simple grammatical rules."
    elif diff == "orta":
        q = f"Choose the correct sentence structure for the topic '{topic_name}' in the given context."
        corr = f"A sentence that follows the correct grammatical structure and meaning for the given situation."
        w1 = f"A sentence with a missing auxiliary verb or wrong preposition."
        w2 = f"A sentence that uses the wrong tense or pronoun."
        w3 = f"A sentence where the word order is completely scrambled."
        expl = f"Medium level (Anlamaq) checks if the student understands how to construct a meaningful sentence using the learned grammar and vocabulary."
    else:
        q = f"Read the short paragraph. Which option perfectly replaces the underlined phrase according to the rules of '{topic_name}'?"
        corr = f"A complex but correct grammatical structure or synonym that perfectly fits the context."
        w1 = f"A phrase that sounds correct but breaks a specific grammar rule."
        w2 = f"A phrase that changes the meaning of the paragraph entirely."
        w3 = f"A direct translation from the native language that is incorrect in English."
        expl = f"Hard level (Tətbiq etmək) requires the student to apply grammar rules and vocabulary accurately in a more complex reading context."
        
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
            q, opts, ans, expl = generate_english_question(topic, diff)
            bloom = get_bloom(diff)
            new_t = {
                "id": random.randint(100000000, 999999999),
                "category": "İngilis dili 6",
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
        t["passport_id"] = f"06-İNG-{part}-{b_code}-{m_code}-{bl_code}-{d_code}-{seq}"
        
    report.append(f"{topic} -- {len(topic_final_tests)}")
    final_all_tests.extend(topic_final_tests)

db["İngilis dili 6"] = final_all_tests

with open(db_path, 'w', encoding='utf8') as f:
    json.dump(db, f, ensure_ascii=False, indent=2)

print("\n--- HESABAT ---")
for r in report:
    print(r)
print(f"Cəmi Test Sayı: {len(final_all_tests)}")
