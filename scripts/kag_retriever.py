import json
import re

DB_PATH = r'c:\Users\User\Downloads\azerbaijanaiplatform\data\textbook-chunks.jsonl'

def clean_text(text):
    text = re.sub(r'\s+', ' ', text)
    return text.strip()

def get_topic_context(grade, subject, topic_keyword, max_tokens=1500):
    context_chunks = []
    keywords = [k.lower() for k in topic_keyword.split() if len(k) > 3]
    if not keywords: keywords = [topic_keyword.lower()]
        
    with open(DB_PATH, 'r', encoding='utf-8') as f:
        for line in f:
            try:
                d = json.loads(line)
                d_grade = str(d.get('grade', ''))
                d_subject = str(d.get('subject', '')).lower()
                
                if grade and d_grade != str(grade): continue
                if subject and subject.lower() not in d_subject: continue
                
                text = d.get('text', '')
                if len(text) < 20: continue 
                
                section = str(d.get('section', '')).lower()
                text_lower = text.lower()
                
                score = 0
                for kw in keywords:
                    if kw in section: score += 3
                    if kw in text_lower: score += 1
                    
                if score > 0:
                    context_chunks.append({
                        'score': score,
                        'text': clean_text(text),
                        'source': f"{d.get('book_id', 'unknown')} | Səhifə: {d.get('page', 'N/A')} | Bölmə: {d.get('section', 'N/A')}"
                    })
            except: pass
                
    context_chunks.sort(key=lambda x: x['score'], reverse=True)
    
    final_context = ""
    current_len = 0
    max_chars = max_tokens * 4 
    used_sources = set()
    
    for c in context_chunks:
        chunk_len = len(c['text'])
        if current_len + chunk_len > max_chars: break
            
        source_header = f"\n[Mənbə: {c['source']}]\n"
        final_context += source_header + c['text'] + "\n"
        current_len += len(source_header) + chunk_len
        used_sources.add(c['source'])
        
    return final_context.strip(), list(used_sources)
