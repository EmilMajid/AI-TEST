import json
import sys

def check_grade_8():
    try:
        with open('data/textbooks.json', 'r', encoding='utf-8') as f:
            books = json.load(f)
            
        grade8 = [b for b in books if b.get('grade') == '8']
        
        print(f"Total Grade 8 textbooks in DB: {len(grade8)}")
        for b in grade8:
            html_status = "HTML" if b.get("has_html") else "PDF"
            print(f"- {b.get('subject')} (ID: {b.get('id')}, Format: {html_status})")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    check_grade_8()
