"""
rebuild_universal_hybrid.py
Bütün siniflərdəki PDF dərsliklərini Hibrid Model (Səhifə + Bölmə Aqreqasiyası) səviyyəsinə qaldırır.
İngilis dili dərsliklərindəki 'vv' -> 'w' artefaktını düzəldir.
"""
import io
import sys
import json
import re
import logging
from pathlib import Path
from collections import defaultdict

# UTF-8 env for Windows
if sys.platform == "win32":
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

MAIN = Path(r'c:\Users\User\Downloads\azerbaijanaiplatform\data\textbook-chunks.jsonl')
TEMP = Path(r'c:\Users\User\Downloads\azerbaijanaiplatform\data\textbook-chunks-hybrid-v3.jsonl')

# ============================================================
# TOC Configuration (Detailed and Precise)
# ============================================================
TOCS = {
    "azerbaycan-tarixi-10": {
        "sections": [
            "AZƏRBAYCAN QƏDİM DÖVRDƏ",
            "AZƏRBAYCAN III-XI ƏSRLƏRDƏ",
            "Azərbaycan XI-XV ƏSRLƏRDƏ",
            "Azərbaycan XVI-XVIII ƏSRLƏRDƏ",
            "ƏLAVƏLƏR"
        ]
    },
    "hayat-bilgisi-9": {
        "sections": [
            "I bölmə - Sağlamlığımız və təhlükəsizliyimiz uğrunda",
            "II bölmə - Cəmiyyət və onun rifahı",
            "III bölmə - Mədəniyyət və tolerantlıq"
        ]
    },
    "rus-dili-8": {
        "sections": [
            "РАЗДЕЛ 1 ЗНАНИЕ - СИЛА",
            "РАЗДЕЛ 2 ХОРОША РОДИНА МОЯ",
            "РАЗДЕЛ 3 ДОСТОЯНИЯ ЧЕЛОВЕЧЕСТВА",
            "РАЗДЕЛ 4 АЗЕРБАЙДЖАН - СТРАНА ОГНЕЙ",
            "РАЗДЕЛ 5 ИСКУССТВО СЛОВА",
            "РАЗДЕЛ 6 ЖИЗНЬ ЗАМЕЧАТЕЛЬНЫХ ЛЮДЕЙ"
        ]
    },
    "ingilis-dili-8": {
        "sections": [
            "Unit 1 FREE TIME FUN",
            "Unit 2 FOOD AROUND THE WORLD",
            "Unit 3 NATURE",
            "Unit 4 MANNERS AND RULES",
            "Unit 5 A PLACE CALLED HOME",
            "Unit 6 CHANGE-MAKERS"
        ]
    },
    # Existing hybrid configs for g10 foreign
    "ingilis-dili-esas-10": {"sections": ["UNIT 1 KINDNESS", "UNIT 2 WE ARE VICTORIOUS!", "UNIT 3 CULTURES", "UNIT 4 ENVIRONMENTAL PROBLEMS", "UNIT 5 SUCCESS", "UNIT 6 HEALTH IS WEALTH!", "UNIT 7 STAGES OF LIFE", "UNIT 8 HAPPINESS", "UNIT 9 MEDIA"]},
    "rus-dili-esas-10": {"sections": ["I Ty dykhanye moyo, Azerbaydzhan!", "II Zastyvshaya v kamne muzyka", "III Zhizn v obrazakh i slovakh", "IV Universalnyy yazyk chelovechestva", "V Poeziya, kotoruyu vidyat", "VI Legendarnyye zhenshchiny Azerbaydzhana", "VII Velikoye iskusstvo kino"]},
    "alman-dili-esas-10": {"sections": ["I MEDIEN UND TECHNOLOGIE", "II GESUNDHEIT UND FITNESS", "III REISEN MACHT SPASS", "IV DAS BRAUCHE ICH!", "V FÜR MENSCH UND UMWELT", "VI ZEIT DER BERUFSWAHL"]},
    "fransiz-dili-esas-10": {"sections": ["UNITÉ 1 Vie scolaire", "UNITÉ 2 Vie sociale", "UNITÉ 3 Le français en Azerbaïdjan", "UNITÉ 4 L'Azerbaïdjan dans le monde"]},
    
    # Needs basic hybrid (automated distribution)
    "riyaziyyat-10": {"sections": ["1. Funksiyalar", "2. Fəzada həndəsə", "3. Triqonometriya", "4. Sinus/Kosinus Teoremi", "5. Triqonometrik Funksiyalar", "6. Çoxüzlülər", "7. Tənliklər", "8. Həcm", "9. Loqarifm", "10. Ehtimal"]},
    "azerbaycan-tarixi-9": {"sections": ["I bölmə: XIX-XX əvvəl", "II bölmə: 1918-1920", "III bölmə: 1920-1980", "IV bölmə: Müstəqillik dövrü"]},
    "biologiya-9": {"sections": ["Fəsil 1-3: Hüceyrə və Orqanizm", "Fəsil 4: Təkamül", "Fəsil 5: Sinir Fəaliyyəti", "Fəsil 6: Ekologiya", "Fəsil 7: Sağlamlıq"]},
    "riyaziyyat-8": {"sections": ["1. Kvadrat kök", "2. Pifaqor teoremi", "3. Kvadrat tənliklər", "4. Dördbucaqlılar", "5. Rasional ifadələr", "6. Sahə", "7. Rasional tənliklər", "8. Oxşarlıq", "9. Bərabərsizliklər", "10. Triqonometriya", "11. Ehtimal"]},
    "ingilis-dili-2-5": {"sections": ["STARTER", "UNIT 1-5", "UNIT 6-10", "UNIT 11-15", "UNIT 16-20", "UNIT 21-25"]},
    "ingilis-dili-2-6": {"sections": ["UNIT 1-4", "UNIT 5-8", "UNIT 9-12", "UNIT 13-17", "UNIT 18-22"]}
}

ENGLISH_BOOKS = {'ingilis-dili-2-5', 'ingilis-dili-2-6', 'ingilis-dili-8', 'ingilis-dili-esas-10', 'ingilis-dili-ikinci-10'}

def fix_vv_to_w(text):
    if not text: return text
    # Fix mid-word and word boundaries
    text = re.sub(r'(?<=[a-zA-Z])vv(?=[a-zA-Z])', 'w', text)
    text = re.sub(r'\bvv(?=[a-zA-Z])', 'w', text)
    text = re.sub(r'(?<=[a-zA-Z])vv\b', 'w', text)
    text = re.sub(r'\bVV(?=[a-zA-Z])', 'W', text)
    text = re.sub(r'\bvv\b', 'w', text, flags=re.IGNORECASE)
    # Common ones
    text = text.replace('vve ', 'we ').replace(' vvith ', ' with ').replace(' vvill ', ' will ')
    return text

def assign_section(bid, page, total_pages, toc_data):
    sections = toc_data.get("sections", [])
    if not sections: return None
    # Estimation
    content_start = 8 if total_pages > 20 else 1
    content_pages = max(1, total_pages - content_start)
    if page < content_start: return sections[0]
    pos = (page - content_start) / content_pages
    idx = min(int(pos * len(sections)), len(sections) - 1)
    return sections[max(0, idx)]

def main():
    logging.info("Starting Final Universal Hybrid Rebuild...")
    
    # Pass 1: Get page counts
    book_total_pages = defaultdict(int)
    if not MAIN.exists():
        logging.error("Main database not found!")
        return

    with open(MAIN, 'r', encoding='utf-8') as f:
        for line in f:
            try:
                c = json.loads(line)
                bid = c.get('book_id')
                if bid in TOCS and c.get('page'):
                    book_total_pages[bid] = max(book_total_pages[bid], c.get('page'))
            except: pass

    # Pass 2: Process and Aggregate
    section_cache = defaultdict(list)
    vv_fixed = 0
    tagged = 0

    with open(MAIN, 'r', encoding='utf-8') as fin, open(TEMP, 'w', encoding='utf-8') as fout:
        for line in fin:
            try:
                c = json.loads(line)
                bid = c.get('book_id', '')
                text = c.get('text', '')
                page = c.get('page')
                ctype = c.get('type', '')

                # Filter out old hybrid chunks to avoid duplication if running again
                if ctype == 'section_hybrid': continue

                # English Fix
                if bid in ENGLISH_BOOKS:
                    fixed = fix_vv_to_w(text)
                    if fixed != text:
                        c['text'] = fixed
                        vv_fixed += 1

                # Hybrid Mapping
                if bid in TOCS and page:
                    total = book_total_pages.get(bid, 200)
                    sect = assign_section(bid, page, total, TOCS[bid])
                    if sect:
                        c['section'] = sect
                        section_cache[(bid, sect)].append(c.get('text', ''))
                        tagged += 1

                fout.write(json.dumps(c, ensure_ascii=False) + '\n')
            except:
                fout.write(line)

        # Write Hybrid Sections
        logging.info("Generating aggregated section chunks...")
        for (bid, sname), texts in section_cache.items():
            if len(texts) < 2: continue
            combined = "\n\n---\n\n".join(texts)
            chunk = {
                'id': f'{bid}_{re.sub(r"[^a-zA-Z0-9]", "_", sname)}_hybrid_final',
                'grade': None, # will be populated by vector store later or inferred
                'book_id': bid,
                'title': f'{bid} | {sname}',
                'text': combined,
                'type': 'section_hybrid',
                'section': sname,
                'metadata': {'type': 'unit_aggregation', 'page_count': len(texts)}
            }
            fout.write(json.dumps(chunk, ensure_ascii=False) + '\n')

    logging.info(f"Fixed vv->w in {vv_fixed} chunks.")
    logging.info(f"Tagged {tagged} chunks with sections.")
    logging.info("REBUILD COMPLETE.")

if __name__ == "__main__":
    main()
