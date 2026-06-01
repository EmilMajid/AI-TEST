#!/usr/bin/env python3
"""
Offline Test Database Verification Script
Verifies that the offline test loading works correctly
"""

import json
import sys
from pathlib import Path


def verify_offline_database():
    """Verify the offline tests JSON structure"""
    
    db_path = Path(__file__).parent.parent / "data" / "offline_tests.json"
    
    if not db_path.exists():
        print("❌ offline_tests.json not found")
        return False
    
    try:
        with open(db_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        print("✅ offline_tests.json loaded successfully")
        print(f"\n📊 Database Structure:")
        print(f"   Total subjects: {len(data)}")
        
        total_questions = 0
        
        for subject, questions in data.items():
            if not isinstance(questions, list):
                print(f"❌ Subject '{subject}' is not a list")
                return False
            
            question_count = len(questions)
            total_questions += question_count
            
            print(f"\n📌 Subject: {subject}")
            print(f"   Questions: {question_count}")
            
            # Verify first question structure
            if questions:
                q = questions[0]
                required_fields = ['question', 'options', 'correctAnswer', 'explanation']
                missing = [f for f in required_fields if f not in q]
                
                if missing:
                    print(f"   ⚠️  Missing fields in first question: {missing}")
                else:
                    print(f"   ✅ Question structure valid")
                    print(f"      - Question: {q['question'][:50]}...")
                    print(f"      - Options: {len(q['options'])} choices")
                    print(f"      - Correct Answer: {q['correctAnswer']}")
        
        print(f"\n📈 Total Questions: {total_questions}")
        
        # Simulate offline lookup
        print(f"\n🔍 Testing Offline Lookup:")
        test_topics = [
            ('İngilis dili', 'English'),
            ('Riyaziyyat', 'Math'),
            ('Ədəbiyyat', 'Literature'),
            ('Azərbaycan dili', 'Azerbaijani'),
        ]
        
        for subject, label in test_topics:
            if subject in data:
                questions = data[subject]
                print(f"   ✅ {label}: {len(questions)} questions available")
            else:
                print(f"   ❌ {label} ({subject}): NOT FOUND")
        
        return True
        
    except json.JSONDecodeError as e:
        print(f"❌ JSON parsing error: {e}")
        return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False


def simulate_offline_api_call():
    """Simulate what the API does"""
    
    db_path = Path(__file__).parent.parent / "data" / "offline_tests.json"
    
    with open(db_path, 'r', encoding='utf-8') as f:
        all_tests = json.load(f)
    
    # Test 1: Lookup by exact subject
    print("\n🧪 Test 1: Exact Subject Lookup")
    topic = "İngilis dili"
    if topic in all_tests:
        questions = all_tests[topic]
        print(f"   ✅ Found {len(questions)} questions for '{topic}'")
        if questions:
            q = questions[0]
            print(f"   📝 Sample: {q['question'][:60]}...")
    
    # Test 2: Lookup with case insensitivity
    print("\n🧪 Test 2: Case-Insensitive Lookup")
    topic_lower = "english"
    found = False
    for subject in all_tests:
        if topic_lower in subject.lower() or subject.lower() in topic_lower:
            questions = all_tests[subject]
            print(f"   ✅ Found {len(questions)} questions for '{subject}' (searching for '{topic_lower}')")
            found = True
            break
    if not found:
        print(f"   ℹ️  No exact match for '{topic_lower}'")
    
    # Test 3: Difficulty filtering
    print("\n🧪 Test 3: Difficulty Filtering")
    if "Riyaziyyat" in all_tests:
        questions = all_tests["Riyaziyyat"]
        difficulties = {}
        for q in questions:
            diff = q.get('difficulty', 'unknown')
            difficulties[diff] = difficulties.get(diff, 0) + 1
        
        print(f"   Difficulty distribution:")
        for diff, count in difficulties.items():
            print(f"      - {diff}: {count} questions")


if __name__ == '__main__':
    print("=" * 60)
    print("OFFLINE TEST DATABASE VERIFICATION")
    print("=" * 60)
    
    success = verify_offline_database()
    
    if success:
        simulate_offline_api_call()
        print("\n✅ All verifications passed!")
        sys.exit(0)
    else:
        print("\n❌ Verification failed!")
        sys.exit(1)
