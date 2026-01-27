import json
import re
import os

def clean_topics():
    filepath = "data/textbooks.json"
    if not os.path.exists(filepath):
        print(f"File not found: {filepath}")
        return

    with open(filepath, "r", encoding="utf-8") as f:
        data = json.load(f)

    # Patterns for garbage/placeholders
    garbage_patterns = [
        r'[§°ùל࠯ŐƔƨǂǁ]', 
        r'\\u[0-9a-fA-F]{4}',
        r'[\u0000-\u001F]', # Non-printable control characters
        r'cid:',
        r'^[0-9.]{5,}\s', # Long garbage numbers
        r'[A-Z]{2,}\s[A-Z]{2,}', # All caps garbage like "ZL QARBI"
        r'л\s*\d\s*м',
        r'ˎ', # Special modifier char used in riyaziyyat-6-h2 garbage
        r'᎑',
        r'•'
    ]
    
    placeholder_patterns = [
        r'(Lektion|Unit|Stunde|Mövzu|Unité)\s+\d+',
        r'Mövzular'
    ]

    cleaned_ids = []

    for grade in data:
        for book in data[grade]:
            topics = book.get("topics")
            if not topics:
                continue
            
            should_clean = False
            
            # 1. Check for "Mövzular" string
            if isinstance(topics, str):
                if topics.strip() == "Mövzular" or any(re.search(p, topics) for p in garbage_patterns):
                    should_clean = True
            
            # 2. Check list topics
            elif isinstance(topics, list):
                if not topics:
                    should_clean = True
                else:
                    garbage_count = 0
                    placeholder_count = 0
                    fragment_count = 0
                    
                    for t in topics:
                        t_str = str(t)
                        # Garbage check
                        if any(re.search(p, t_str) for p in garbage_patterns):
                            garbage_count += 1
                        # Placeholder check
                        if any(re.search(p, t_str, re.I) for p in placeholder_patterns):
                            placeholder_count += 1
                        # Fragment check: no capital letter at start, or too many words without a number
                        if len(t_str) > 30 and not re.search(r'^[A-ZƏİÖÜŞÇA-Z]', t_str): # Doesn't start with capital (incl. Aze)
                            fragment_count += 1
                        if len(t_str) > 80 and not re.search(r'\d', t_str): # Long sentence without a number
                            fragment_count += 1
                        if "Bakı," in t_str or "2018" in t_str: # Bibliographic
                            fragment_count += 1
                            
                    # Aggressive cleaning for Grade 6 & 8
                    if (garbage_count > 0 or 
                        (placeholder_count > 0 and placeholder_count == len(topics)) or 
                        (fragment_count > len(topics) / 3)):
                        should_clean = True
            
            # Special case for Azerbaycan Dili 6 which has many sentence fragments
            if book.get("id") in ["azerbaycan-dili-6-h1", "azerbaycan-dili-6-h2", "riyaziyyat-6-h2", "fiziki-terbiye-6", "tebiet-6-h1", "tebiet-6-h2"]:
                should_clean = True

            if should_clean:
                cleaned_ids.append(book.get("id"))
                del book["topics"]

    if cleaned_ids:
        with open(filepath, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        print(f"Cleaned topics for: {', '.join(cleaned_ids)}")
    else:
        print("No corrupted topics found to clean.")

if __name__ == "__main__":
    clean_topics()
