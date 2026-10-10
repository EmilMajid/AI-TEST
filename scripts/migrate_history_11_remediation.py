import json
import sys

def migrate_history_11():
    file_path = "data/grades/grade_11.json"
    with open(file_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    hist = data.get("Ümumi tarix 11", {})
    total_fixed_bt = 0
    fixed_q7 = False

    for topic_name, items in hist.items():
        if not isinstance(items, list):
            continue
        for q in items:
            # 1. Correct Sual 7 Key & Diagnostics
            if q.get("id") == "11-004-0313-11UT13-BL2-C2-010":
                q["answer"] = "B"
                q["correct_answer"] = "B"
                q["correctAnswer"] = 1
                q["correct_index"] = 1
                if "distractor_diagnostics" in q and isinstance(q["distractor_diagnostics"], dict):
                    q["distractor_diagnostics"]["B"] = "DÜZGÜNDÜR: 'Vilayətlərə məhdud özünüidarə verilməsi və federal quruluşun yaradılması'. Dərslik qayda və elmi meyarlarına tam uyğundur."
                    q["distractor_diagnostics"]["C"] = "Yanlışdır (Hindistana tam dövlət müstəqilliyinin verilməsi). 1935-ci il qanunu tam müstəqillik vermədi, yalnız məhdud muxtariyyət təklif etdi."
                fixed_q7 = True
            
            # 2. Heal spurious cross-grade fallbacks (Article 4 Invariant)
            bt = q.get("backward_trace", {})
            rg = bt.get("root_grade")
            if rg and rg != 11:
                clean_topic = topic_name
                if "." in clean_topic:
                    clean_topic = clean_topic.split(".", 1)[1].strip()
                
                bloom = q.get("bloom_level") or q.get("bloomLevel") or "Bilik"
                if bloom == "Bilik":
                    skill = "faktik tarixi bilikləri və xronologiyanı"
                elif bloom == "Anlama":
                    skill = "tarixi prosesləri və səbəb-nəticə əlaqələrini"
                else:
                    skill = "müqayisəli tarixi təhlil bacarığını"
                    
                q["backward_trace"] = {
                    "is_root_anchor": False,
                    "is_intra_grade": True,
                    "root_grade": 11,
                    "root_book": "Ümumi tarix 11",
                    "root_concept": clean_topic,
                    "concept_name": clean_topic,
                    "concept_type": "mövzu",
                    "remedial_duration_mins": 10,
                    "parent_action_tip": f"Övladınızın {skill} möhkəmləndirmək üçün hazırda istifadə etdiyi 11-ci sinif Ümumi tarix dərsliyindəki '{clean_topic}' mövzusunu (əsas tarixi hadisələri və prosesləri) 10 dəqiqə nəzərdən keçirməsi kifayətdir."
                }
                total_fixed_bt += 1

    with open(file_path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print(f"[MIGRATION SUCCESS] Fixed Sual 7: {fixed_q7}")
    print(f"[MIGRATION SUCCESS] Cured spurious cross-grade fallbacks to intra-grade topic: {total_fixed_bt}")

if __name__ == "__main__":
    migrate_history_11()
