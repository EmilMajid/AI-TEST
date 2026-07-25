import json
import os

BASE_DIR = r'C:\Users\User\Downloads\azerbaijanaiplatform'
TESTS_FILE = os.path.join(BASE_DIR, 'data', 'offline_tests.json')

topics_map = {
    'I BÖLM?': ['H?r?nin öz imzasý', 'Mübariz', 'Son yarpaq', 'S?hv düþ?nd? yerimiz', 'Polyanna', 'Qayýqda dörd n?f?r', 'Ümumil?þdirici t?krar'],
    'II BÖLM?': ['Molla N?sr?ddin demiþk?n...', 'Onlar kimdir', 'Bunu kim deyib', 'Ay adlarý v? onlarýn m?nþ?yi', 'Barbarlar v? vandallar', 'Ümumil?þdirici t?krar'],
    'III BÖLM?': ['Gürz?', 'Ýþgüzar t?klif', 'T?bi?t \"müh?ndis\"l?ri', 'F?ryad. Maþuk meþ?si', 'Alternativ enerji', 'Ümumil?þdirici t?krar'],
    'IV BÖLM?': ['Zamanýn idar? olunmasý', 'Uðura ged?n yol', 'T?qvim', 'Yazý - piktoqramdan h?rfl?r?', 'Q?dim yazý materiallarý', 'Eynþteyn d?rsl?rind?n \"2\" alýrdý?', 'Ümumil?þdirici t?krar'],
    'V BÖLM?': ['H?sr?t', 'S?kkiz v? tariximiz', 'Þ?ki Xan sarayý', 'Dünya 20 Yanvardan nec? x?b?r tutdu', 'Neft daþlarý', 'Ümumil?þdirici t?krar'],
    'VI BÖLM?': ['Ýsaak Nyuton', 'Avtomobil', 'Bumeranqý kim icad edib', '?l-Xar?zmi', 'Kompüter oyunlarýný kim ixtira edib', 'Ümumil?þdirici t?krar'],
    'VII BÖLM?': ['Q?dimd? kitab iþi', 'Kitabxanalar', 'Kitab çapýnýn ixtirasý', 'Az?rbaycanda ilk m?tb??l?r', 'Elektron kitab', 'Ümumil?þdirici t?krar']
}

def map_topics():
    with open(TESTS_FILE, 'r', encoding='utf-8') as f:
        db = json.load(f)

    subject = 'Az?rbaycan dili 7'
    if subject not in db:
        print(f'Subject {subject} not found.')
        return

    topic_usage = {k: 0 for v in topics_map.values() for k in v}

    for test in db[subject]:
        old_topic = test.get('topic', '')
        if old_topic in topics_map:
            sub_topics = topics_map[old_topic]
            sub_topics.sort(key=lambda t: topic_usage[t])
            selected_topic = sub_topics[0]
            
            test['topic'] = selected_topic
            topic_usage[selected_topic] += 1

    with open(TESTS_FILE, 'w', encoding='utf-8') as f:
        json.dump(db, f, ensure_ascii=False, indent=2)

    print('Topics mapped successfully!')

map_topics()
