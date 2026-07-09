import json
import re
import os

def clean_title(title):
    if not title:
        return ""
    # Remove chapter numbers, punctuation, lowercase
    cleaned = title.lower()
    cleaned = re.sub(r'^\d+(\.\d+)*\.?\s*', '', cleaned) # Remove 1.1., etc.
    cleaned = re.sub(r'[^\w\s]', '', cleaned)
    return cleaned.strip()

def main():
    jsonl_path = "data/textbook-chunks.jsonl"
    backup_path = "data/textbook-chunks_backup.jsonl"
    
    # 1. Load topics from manual-topics.json
    with open("scripts/manual-topics.json", "r", encoding="utf-8") as f:
        manual_data = json.load(f)
    
    topics_list = []
    for chap in manual_data.get("informatika-11", []):
        for top in chap["topics"]:
            topics_list.append({
                "chapter": chap["chapter"],
                "topic": top["title"],
                "cleaned": clean_title(top["title"])
            })
            
    # 2. Read all chunks
    all_chunks = []
    inf11_chunks = []
    
    with open(jsonl_path, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            try:
                chunk = json.loads(line)
                if chunk.get("book_id") == "informatika-11":
                    inf11_chunks.append(chunk)
                else:
                    all_chunks.append(chunk)
            except Exception as e:
                print("Error parsing line:", e)
                
    print(f"Total other chunks: {len(all_chunks)}")
    print(f"Total informatika-11 chunks: {len(inf11_chunks)}")
    
    # 3. Classify informatika-11 chunks
    # Since they are ordered, we will keep track of the last successfully mapped topic
    last_mapped_topic = topics_list[0]["topic"] # Default to first
    
    mapped_count = 0
    generic_count = 0
    
    # Define mapping heuristics for section names
    section_mapping = {
        "coğrafi": "1.3. Coğrafi informasiya sistemləri",
        "gis": "1.3. Coğrafi informasiya sistemləri",
        "süni intellekt": "1.4. Süni intellekt",
        "intellekt": "1.4. Süni intellekt",
        "ekspert": "1.5. Ekspert sistemləri",
        "axtarış sistem": "1.6. Axtarış sistemləri",
        "böyük verilənlər": "1.7. \"Böyük verilənlər\"texnologiyası",
        "big data": "1.7. \"Böyük verilənlər\"texnologiyası",
        "cəmiyyət": "1.8. informasiya cəmiyyəti",
        "modelləşdirmə": "2.1. Kompüter modelləşdirməsi",
        "elektron cədvəl": "2.2. Elektron cədvəl proqramında modelləşdirmə",
        "statistik": "2.3. Statistik verilənlər əsasında proseslərin modelləşdirilməsi",
        "riyazi məsələlər": "2.4. Proqramlaşdırma dillərinin köməyi ilə riyazi məsələlərin modelləşdirilməsi",
        "üçölçülü": "2.5. Üçölçülü qrafik modellər",
        "3d": "2.5. Üçölçülü qrafik modellər",
        "layihə": "3.1. Layihə və onun mərhələləri",
        "layihələndirilməsi": "3.2. Verilənlər bazasının layihələndirilməsi",
        "tələbələr": "3.3. \"Tələbələr\" verilənlər bazası layihəsi",
        "kinosu": "3.4. \"Azərbaycan kinosu\" verilənlər bazası",
        "ünsiyyət": "4.1. Şəbəkədə kompüterlərin \"ünsiyyəti\"",
        "arxitekturası": "4.2. Şəbəkə arxitekturası",
        "simsiz": "4.3. Simsiz şəbəkə texnologiyaları",
        "mobil": "4.4. Mobil rabitə texnologiyaları",
        "internet xidmət": "4.5. internet xidmətləri",
        "paneli": "5.1. idarəetmə paneli",
        "səsin": "5.2. Səsin idarə edilməsi",
        "elektrik": "5.3. Kompüterin elektrik enerjisi sərfiyyatının idarə edilməsi",
        "hesabları": "5.4. İstifadəçi hesabları və ailə təhlükəsizliyi",
        "uzaqdan": "5.5. Kompüterin uzaqdan idarə edilməsi",
        "veb-sayt layihəsi": "6.1. Veb-sayt layihəsi",
        "word": "6.2. Word proqramında veb-səhifənin hazırlanması",
        "excel": "6.3. Excel cədvəllərinin veb-səhifə kimi saxlanması",
        "powerpoint": "6.4. PowerPoint proqramında veb-təqdimat",
        "nəşri": "6.5. Saytların internetdə nəşri və onların qiymətləndirilməsi",
        "tarixi": "A. Hesablama texnikasının tarixi",
        "nəsillər": "B. Kompüterlərin nəsilləri",
        "əməllər": "C. Məntiqi əməllər",
        "əsasları": "D. Kompüterin məntiqi əsasları",
        "həlli": "E. Məntiqi məsələlərin həlli"
    }

    for chunk in inf11_chunks:
        sec = chunk.get("section", "")
        text = chunk.get("text", "")
        
        # Check if generic
        is_generic = False
        if not sec or any(g in sec.lower() for g in ["özünüzü yoxlayın", "ümumiləşdirici", "təkrar", "ilkin yoxlama", "tapşırıq"]):
            is_generic = True
            
        mapped_topic = None
        
        # 1. Try mapping based on section title
        if not is_generic and sec:
            cleaned_sec = clean_title(sec)
            # Find best match in topics_list
            for t in topics_list:
                if t["cleaned"] in cleaned_sec or cleaned_sec in t["cleaned"]:
                    mapped_topic = t["topic"]
                    break
            
            # If not found, try mapping using section_mapping keys
            if not mapped_topic:
                for key, val in section_mapping.items():
                    if key in sec.lower():
                        mapped_topic = val
                        break
                        
        # 2. Try text matching if still not mapped and not generic
        if not mapped_topic and not is_generic:
            for key, val in section_mapping.items():
                if key in text.lower()[:300]: # Look at beginning of text
                    mapped_topic = val
                    break
                    
        # 3. If generic or not found, carry forward last mapped topic
        if not mapped_topic:
            mapped_topic = last_mapped_topic
            generic_count += 1
        else:
            last_mapped_topic = mapped_topic
            mapped_count += 1
            
        # Update chunk section to mapped topic title
        chunk["section"] = mapped_topic
        
    print(f"Mapped: {mapped_count} chunks using rules, {generic_count} chunks carried forward.")
    
    # 4. Save chunks back to database
    # Write a backup first
    if not os.path.exists(backup_path):
        os.rename(jsonl_path, backup_path)
        print("Created backup of textbook-chunks.jsonl")
        
    with open(jsonl_path, "w", encoding="utf-8") as f:
        # Write other chunks
        for chunk in all_chunks:
            f.write(json.dumps(chunk, ensure_ascii=False) + "\n")
        # Write updated inf11 chunks
        for chunk in inf11_chunks:
            f.write(json.dumps(chunk, ensure_ascii=False) + "\n")
            
    print("SUCCESS: Structured and updated all chunks for informatika-11 in database.")

if __name__ == "__main__":
    main()
