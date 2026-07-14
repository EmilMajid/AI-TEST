import json
from collections import Counter

with open('data/offline_tests.json', 'r', encoding='utf8') as f:
    db = json.load(f)

tests = db.get('İnformatika 6', [])

# Map of topic to keywords
TOPIC_RULES = [
    ('4. İnformasiya nə qədər yer tutur', 
     ['ölçü vahidi', 'kilobayt', 'meqabayt', 'heqabayt', 'faylın ölçüsü', 'bayt', 'bit', 'yer tutur']),
     
    ('3. Ədədi informasiya necə kodlaşdırılır', 
     ['ikilik', 'onluq', 'say sistem', 'kodlaşdırılır', '0 və 1', 'qalıqlar']),
     
    ('7. Mətnin görünüşünün yaxşılaşdırılması', 
     ['şrift', 'tərtibat verilməsi', 'bəzəmə', 'başlıqlar', 'mətnin görünüşü', 'rəng', 'qalın', 'maili']),
     
    ('8. Abzasın formatlanması', 
     ['abzas', 'düzləndirmə', 'mərkəzə', 'sola', 'sağa', 'məsafə']),
     
    ('5. Proqramı başlatmağın bir neçə üsulu', 
     ['iş masasında', 'qısayol', 'baş menyu', 'başlatma', 'shortcut', 'simgəni', 'qoşa çıqqıldatdıqda', 'qovluq pəncərəsindən', 'tez başlatma', 'start']),
]

reclassified = Counter()
fixed = 0

for t in tests:
    q_full = (t.get('question', '') + ' ' + t.get('pedagogical_explanation', '')).lower()
    
    new_topic = None
    for topic_name, keywords in TOPIC_RULES:
        if any(kw in q_full for kw in keywords):
            new_topic = topic_name
            break
            
    if new_topic:
        t['topic'] = new_topic
        reclassified[new_topic] += 1
        fixed += 1
    else:
        # Keep original if unclassified or put in archive
        reclassified['[Naməlum / Arxiv]'] += 1
        t['topic'] = '[Arxiv] Xətalı Köhnə Generasiya'

with open('data/offline_tests.json', 'w', encoding='utf8') as f:
    json.dump(db, f, ensure_ascii=False, indent=2)

print(f"Reclassified {fixed} out of 85 tests.")
for k, v in sorted(reclassified.items()):
    print(f"  {k}: {v}")

ALL_TOPICS = [
    "1. Kompüter necə işləyir",
    "2. İnformasiya harada saxlanılır",
    "3. Ədədi informasiya necə kodlaşdırılır",
    "4. İnformasiya nə qədər yer tutur",
    "5. Proqramı başlatmağın bir neçə üsulu",
    "6. Şəklin kompüterdə saxlanması və çapı",
    "7. Mətnin görünüşünün yaxşılaşdırılması",
    "8. Abzasın formatlanması",
    "9. Elektron təqdimatlar",
    "10. Slaydlarla iş",
    "11. Obyektin informasiya modeli",
    "12. Alqoritmin xassələri",
    "13. Alqoritmin növləri",
    "14. Dövri alqoritmlər",
    "15. Əyləncəli məsələlər",
    "16. Proqramda dəyişənlər",
    "17. Proqramlaşdırma mühitində seçim",
    "18. Proqramlaşdırma mühitində dövr",
    "19. Dövrlər və naxışlar",
    "20. Proqramlaşdırma mühitində musiqi",
    "21. İnformasiya resursları ilə iş mərhələləri",
    "22. Dünya hörümçək torunda gəzişmə",
    "23. İnternetdə axtarış",
    "24. Elektron poçt",
    "25. Elektron poçtla məktublaşma"
]

print('\n=== ÜMUMİ STATİSTİKA (YENİLƏNMİŞ) ===')
for t in ALL_TOPICS:
    c = reclassified.get(t, 0)
    print(f'  {c}/15 : {t}')
