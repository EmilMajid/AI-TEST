import json
import re

cache_file = "data/fransiz6_ocr_cache.json"

if __name__ == "__main__":
    with open(cache_file, "r", encoding="utf-8") as f:
        cache = json.load(f)
        
    for page_key, text in cache.items():
        if text:
            # Look for Unit or Lecon mentions
            lines = text.split('\n')
            for line in lines:
                if 'unité' in line.lower() or 'leçon' in line.lower() or 'unite' in line.lower() or 'lecon' in line.lower():
                    print(f"{page_key}: {line.strip()}")
