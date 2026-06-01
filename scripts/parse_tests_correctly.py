#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Əsl test fayllarını parse edib doğru strukturda offline_tests.json yaratmaq
Struktur: Subject → Textbook → Topic → Difficulty → Questions
"""

import json
import os
import re
from pathlib import Path

def parse_test_file(file_path):
    """Test faylını parse edib sualları çıxart"""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    questions = []
    
    # Fərqli pattern-lər axtarışı
    # Pattern: Sual N: ... Cavab: ... İzahat: ... Orijinal mətn: ...
    
    # İlk olaraq bütün suallara ayırmağa çalış
    question_blocks = re.split(r'\n(?=Sual \d+:|\d+\.)', content)
    
    for block in question_blocks:
        if not block.strip():
            continue
        
        # Sual mətni çıxart
        question_match = re.search(r'(?:Sual \d+:|^\d+\.)\s*(.+?)(?=\n(?:A\)|1\)|\[A\]|Cavab:|Options:))', block, re.DOTALL)
        if not question_match:
            continue
        
        question_text = question_match.group(1).strip()
        
        # Cavab variantlarını çıxart (A, B, C, D və ya 1, 2, 3, 4)
        options = []
        option_pattern = r'(?:A\)|B\)|C\)|D\)|1\)|2\)|3\)|4\)|1\.|2\.|3\.|4\.|\[A\]|\[B\]|\[C\]|\[D\])\s*(.+?)(?=\n(?:A\)|B\)|C\)|D\)|1\)|2\)|3\)|4\)|Cavab|Answer|Düzgün))'
        option_matches = re.findall(option_pattern, block, re.DOTALL)
        
        if not option_matches or len(option_matches) < 4:
            continue
        
        options = [opt.strip()[:200] for opt in option_matches[:4]]
        
        # Düzgün cavabı tapşır
        correct_answer = 0
        answer_pattern = r'(?:Cavab|Answer|Düzgün cavab):\s*([A-D]|[1-4])'
        answer_match = re.search(answer_pattern, block, re.IGNORECASE)
        if answer_match:
            ans = answer_match.group(1).upper()
            if ans in ['A', '1']:
                correct_answer = 0
            elif ans in ['B', '2']:
                correct_answer = 1
            elif ans in ['C', '3']:
                correct_answer = 2
            elif ans in ['D', '4']:
                correct_answer = 3
        
        # İzahatı çıxart
        explanation = ""
        explanation_pattern = r'(?:İzahat|Explanation|Ətraflı izahat):\s*(.+?)(?=\n(?:Orijinal|Original|Source|Kaynak|Dərslik))'
        explanation_match = re.search(explanation_pattern, block, re.DOTALL | re.IGNORECASE)
        if explanation_match:
            explanation = explanation_match.group(1).strip()[:500]
        
        # Orijinal mətnini çıxart
        source_context = ""
        source_pattern = r'(?:Orijinal mətn|Original text|Source|Dərslik mətn|Mətn):\s*(.+?)(?=\n(?:Sual|Question|$))'
        source_match = re.search(source_pattern, block, re.DOTALL | re.IGNORECASE)
        if source_match:
            source_context = source_match.group(1).strip()[:500]
        
        # Çətinlik səviyyəsini təyin et (əgər spesifikləşdirildimi)
        difficulty = "orta"
        if "sadə" in block.lower() or "easy" in block.lower():
            difficulty = "sadə"
        elif "çətin" in block.lower() or "hard" in block.lower() or "difficult" in block.lower():
            difficulty = "çətin"
        
        if question_text and options:
            questions.append({
                "question": question_text[:300],
                "options": options,
                "correctAnswer": correct_answer,
                "explanation": explanation if explanation else f"Bu sualın izahatı mövcud deyil.",
                "sourceContext": source_context if source_context else "Orijinal mətn mövcud deyil.",
                "difficulty": difficulty,
                "bloomLevel": "anlama"
            })
    
    return questions

def create_hierarchical_database():
    """Fərdi test fayllarından hierarchical offline_tests.json yaratmaq"""
    
    database = {}
    
    # Test fayllarının xəritəsi
    test_files = {
        'user_read_only_context/text_attachments/azərbaycan-dili-7-NK6A8.txt': {
            'subject': 'Azərbaycan dili',
            'textbook': 'Azərbaycan dili 7-ci sinif',
            'topics_mapping': {}  # Otomatik mövzuları birləşdir
        },
        'user_read_only_context/text_attachments/ing-7-test-BQFia.txt': {
            'subject': 'İngilis dili',
            'textbook': 'İngilis dili 7-ci sinif',
            'topics_mapping': {}
        },
        'user_read_only_context/text_attachments/edebiyyat-7-tests-jdhg1.txt': {
            'subject': 'Ədəbiyyat',
            'textbook': 'Ədəbiyyat 7-ci sinif',
            'topics_mapping': {}
        },
        'user_read_only_context/text_attachments/7-ci-Sinif-Riyaziyyat---hisse1-5p2RP.txt': {
            'subject': 'Riyaziyyat',
            'textbook': 'Riyaziyyat 7-ci sinif Hissə 1',
            'topics_mapping': {}
        },
        'user_read_only_context/text_attachments/7-ci-Sinif-Riyaziyyat---hisse2-CORKn.txt': {
            'subject': 'Riyaziyyat',
            'textbook': 'Riyaziyyat 7-ci sinif Hissə 2',
            'topics_mapping': {}
        }
    }
    
    for file_path, metadata in test_files.items():
        if not os.path.exists(file_path):
            print(f"⚠️ Fayl tapılmadı: {file_path}")
            continue
        
        print(f"📖 Parsing: {metadata['subject']}...")
        questions = parse_test_file(file_path)
        print(f"   ✅ {len(questions)} sual parse edildi")
        
        subject = metadata['subject']
        textbook = metadata['textbook']
        
        # Fənn və dərslik strukturu yaratmaq
        if subject not in database:
            database[subject] = {}
        
        if textbook not in database[subject]:
            database[subject][textbook] = {}
        
        # Suallart çətinlik səviyyəsinə görə qruplaştır
        # Əgər mövzu spesifikləşdirmə yoxdur, "Ümumi" istifadə et
        topic_name = "Ümumi mövzular"
        
        if topic_name not in database[subject][textbook]:
            database[subject][textbook][topic_name] = {
                "sadə": [],
                "orta": [],
                "çətin": []
            }
        
        # Suallart çətinlik səviyyəsinə paylandır
        for q in questions:
            difficulty = q.get('difficulty', 'orta')
            database[subject][textbook][topic_name][difficulty].append(q)
    
    # Hər çətinlik səviyyəsində 5 sual olmasını təmin et
    for subject in database:
        for textbook in database[subject]:
            for topic in database[subject][textbook]:
                for difficulty in ['sadə', 'orta', 'çətin']:
                    questions = database[subject][textbook][topic].get(difficulty, [])
                    # ID-lər təyin et
                    for idx, q in enumerate(questions):
                        q['id'] = idx + 1
    
    return database

def main():
    print("=== Offline Tests Database Yaradılması ===\n")
    
    # Hierarchical database yaratmaq
    database = create_hierarchical_database()
    
    # Çıxış faylı
    output_path = '/vercel/share/v0-project/data/offline_tests.json'
    
    # JSON-ə yazm
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(database, f, ensure_ascii=False, indent=2)
    
    print(f"\n✅ Database yaradılmışdır: {output_path}")
    
    # Statistika göstər
    print("\n📊 Statistika:")
    for subject in database:
        print(f"\n{subject}:")
        for textbook in database[subject]:
            print(f"  📚 {textbook}:")
            for topic in database[subject][textbook]:
                print(f"    📝 {topic}:")
                for difficulty in ['sadə', 'orta', 'çətin']:
                    count = len(database[subject][textbook][topic].get(difficulty, []))
                    print(f"       {difficulty}: {count} sual")

if __name__ == '__main__':
    main()
