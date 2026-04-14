import json
import sys
from pathlib import Path

# Force UTF-8 environment
if sys.platform == "win32":
    import _locale
    _locale._getdefaultlocale = lambda *args: ('en_US', 'utf8')
if sys.stdout.encoding != 'utf-8':
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')

PROJECT_ROOT = Path(r'c:\Users\User\Downloads\azerbaijanaiplatform')
MAIN_DB = PROJECT_ROOT / "data" / "textbook-chunks.jsonl"
TEMP_DB = PROJECT_ROOT / "data" / "textbook-chunks-tagged.jsonl"

sys.path.append(str(PROJECT_ROOT / "scripts"))
from llm_utils import call_gemini, get_api_key

TOCS = {
    "rus-dili-esas-10": [
        "I Ty dykhanye moyo, Azerbaydzhan!",
        "II Zastyvshaya v kamne muzyka",
        "III Zhizn v obrazakh i slovakh",
        "IV Universalnyy yazyk chelovechestva",
        "V Poeziya, kotoruyu vidyat",
        "VI Legendarnyye zhenshchiny Azerbaydzhana",
        "VII Velikoye iskusstvo kino"
    ],
    "ingilis-dili-esas-10": [
        "UNIT 1 KINDNESS",
        "UNIT 2 WE ARE VICTORIOUS!",
        "UNIT 3 CULTURES",
        "UNIT 4 ENVIRONMENTAL PROBLEMS",
        "UNIT 5 SUCCESS",
        "UNIT 6 HEALTH IS WEALTH!",
        "UNIT 7 STAGES OF LIFE",
        "UNIT 8 HAPPINESS",
        "UNIT 9 MEDIA"
    ],
    "alman-dili-esas-10": [
        "I MEDIEN UND TECHNOLOGIE",
        "II GESUNDHEIT UND FITNESS",
        "III REISEN MACHT SPASS",
        "IV DAS BRAUCHE ICH!",
        "V FÜR MENSCH UND UMWELT",
        "VI ZEIT DER BERUFSWAHL"
    ],
    "fransiz-dili-esas-10": [
        "UNITÉ 1 Vie scolaire",
        "UNITÉ 2 Vie sociale",
        "UNITÉ 3 Le français en Azerbaïdjan",
        "UNITÉ 4 L'Azerbaïdjan dans le monde"
    ]
}

def get_best_section(book_id, text, api_key):
    if book_id not in TOCS:
        return None
    
    sections = TOCS[book_id]
    prompt = f"""
Given the following text from a Grade 10 textbook ({book_id}), determine which Unit/Section it belongs to.
Text: {text[:800]}

Available Sections:
{chr(10).join([f"- {s}" for s in sections])}

Return ONLY the title of the best matching section. If none match clearly, return 'Other'.
"""
    result = call_gemini(prompt, api_key)
    if result:
        result = result.strip().replace('"', '').replace("'", "")
        # Validate result is in TOCS
        for s in sections:
            if s.lower() in result.lower() or result.lower() in s.lower():
                return s
    return "Introduction/Misc"

if __name__ == "__main__":
    api_key = get_api_key("gemini")
    if not api_key:
        print("Error: No Gemini API Key found.")
        sys.exit(1)

    print(f"Tagging chunks in {MAIN_DB}...")
    
    # We will process books one by one to save costs/time if interrupted
    tagged_count = 0
    with open(MAIN_DB, 'r', encoding='utf-8') as fin, open(TEMP_DB, 'w', encoding='utf-8') as fout:
        for line in fin:
            try:
                c = json.loads(line)
                bid = c.get('book_id')
                
                # Only tag the 4 foreign language books that need hybrid model
                if bid in TOCS and not c.get('section'):
                    print(f"Tagging {bid} P{c.get('page')}...")
                    section = get_best_section(bid, c.get('text', ''), api_key)
                    c['section'] = section
                    tagged_count += 1
                
                fout.write(json.dumps(c, ensure_ascii=False) + "\n")
            except Exception as e:
                print(f"Error processing line: {e}")
                
    print(f"Successfully tagged {tagged_count} chunks.")
    # MAIN_DB.unlink()
    # TEMP_DB.rename(MAIN_DB)
