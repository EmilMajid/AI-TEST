import json
import re

def get_standard_topics(subj_key, topics_db):
    if subj_key not in topics_db:
        return []
    res = []
    for chap in topics_db[subj_key]:
        for t in chap['topics']:
            res.append(t['title'])
    return res

def clean_words(s):
    s = s.lower().replace('.', ' ').replace(',', ' ').replace('(', ' ').replace(')', ' ').replace('/', ' ')
    return set(w for w in s.split() if len(w) > 2)

def best_match(topic, standard_topics):
    topic_words = clean_words(topic)
    best_t = None
    best_score = -1
    for st in standard_topics:
        if topic.lower() == st.lower() or topic.lower() in st.lower() or st.lower() in topic.lower():
            return st
        
        st_words = clean_words(st)
        score = len(topic_words.intersection(st_words))
        if score > best_score:
            best_score = score
            best_t = st
            
    if best_score > 0:
        return best_t
    
    # Fallback to the first topic of the chapter? Or just 'Unknown'
    return standard_topics[0] if standard_topics else topic

def main():
    with open('scripts/manual-topics.json', 'r', encoding='utf-8') as f:
        manual_topics = json.load(f)
        
    std_topics = {
        'Fransız dili 3': get_standard_topics('fransiz-dili-esas-3', manual_topics),
        'İngilis dili 3': get_standard_topics('ingilis-dili-3', manual_topics),
        'Texnologiya 3': get_standard_topics('texnologiya-3', manual_topics),
        'Texnologiya 4': get_standard_topics('texnologiya-4', manual_topics)
    }
    
    with open('data/offline_tests.json', 'r', encoding='utf-8') as f:
        db = json.load(f)
        
    updated = 0
    for subj, subj_key in [('Fransız dili 3', 'fransiz-dili-esas-3'), 
                           ('İngilis dili 3', 'ingilis-dili-3'), 
                           ('Texnologiya 3', 'texnologiya-3'), 
                           ('Texnologiya 4', 'texnologiya-4')]:
        if subj not in db: continue
        stds = std_topics[subj]
        if not stds: continue
        
        for item in db[subj]:
            if 'questions' in item and isinstance(item['questions'], list):
                for q in item['questions']:
                    old_topic = q.get('topic', '')
                    if old_topic not in stds:
                        new_topic = best_match(old_topic, stds)
                        q['topic'] = new_topic
                        updated += 1
            else:
                old_topic = item.get('topic', '')
                if old_topic not in stds:
                    new_topic = best_match(old_topic, stds)
                    item['topic'] = new_topic
                    updated += 1
                    
    with open('data/offline_tests.json', 'w', encoding='utf-8') as f:
        json.dump(db, f, indent=2, ensure_ascii=False)
        
    print(f"Mapped {updated} topics successfully.")

if __name__ == '__main__':
    main()
