import sys
import io
import json
from kag_retriever import get_topic_context
from llm_utils import generate_gold_standard_question

if sys.platform == "win32":
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

def generate_test_for_topic(grade, subject, topic, bloom_level="Anlama"):
    print(f"\n[{subject} {grade} | Mövzu: {topic}] üçün KAG Generasiyası Başlayır...")
    
    # 1. RETRIEVE CONTEXT
    print(f"1. RAG Bazasından kontekst axtarılır...")
    context, sources = get_topic_context(grade, subject, topic)
    
    if not context:
        print("❌ XƏTA: Mövzuya aid heç bir Mükəmməl/Yaxşı chunk tapılmadı.")
        return None
        
    print(f"✅ {len(sources)} mənbədən cəmi {len(context)} simvol kontekst tapıldı.")
    for s in sources:
        print(f"   - {s}")
        
    # 2. GENERATE QUESTION (KAG)
    print(f"\n2. LLM vasitəsilə test yaradılır (Bloom: {bloom_level})...")
    # Generate question using Gold Standard from llm_utils which has built-in failover and strict formatting
    response_json_str = generate_gold_standard_question(
        subject=subject,
        grade=str(grade),
        context=context,
        bloom=bloom_level,
        skill=topic
    )
    
    if not response_json_str:
        print("❌ XƏTA: LLM cavab vermədi və ya format xətası oldu.")
        return None
        
    # 3. VALIDATE JSON
    print("3. JSON formatı və tamlıq yoxlanılır (kag_validator.py məntiqi)...")
    try:
        # Clean potential markdown wrapping
        clean_str = response_json_str.strip()
        if clean_str.startswith("```json"): clean_str = clean_str[7:]
        elif clean_str.startswith("```"): clean_str = clean_str[3:]
        if clean_str.endswith("```"): clean_str = clean_str[:-3]
        
        test_obj = json.loads(clean_str.strip())
        
        required_keys = ["question", "options", "correct_index", "explanation"]
        missing = [k for k in required_keys if k not in test_obj]
        if missing:
            print(f"❌ XƏTA: Çıxarışda vacib açarlar yoxdur: {missing}")
            return None
            
        print("✅ Generasiya Uğurla Tamamlandı!\n")
        print("="*60)
        print(f"SUAL: {test_obj['question']}")
        for i, opt in enumerate(test_obj['options']):
            prefix = "🟢" if i == test_obj['correct_index'] else "⚪"
            print(f"  {prefix} {chr(65+i)}) {opt}")
        print("\nİZAHAT (Explanation):")
        
        if isinstance(test_obj['explanation'], dict):
            print(f"  Düzgün Cavab Məntiqi: {test_obj['explanation'].get('correct', '')}")
        else:
            print(f"  {test_obj['explanation']}")
            
        print("\nBLOOM SƏVİYYƏSİ:", test_obj.get('bloom_level', bloom_level))
        print("="*60)
        
        return test_obj
    except json.JSONDecodeError as e:
        print(f"❌ XƏTA: LLM JSON formatını pozdu: {e}\nRaw output:\n{response_json_str}")
        return None

if __name__ == "__main__":
    import os
    os.environ["MOCK_MODE"] = "true" # Set to false to trigger real API calls if keys exist
    
    # User's requested example: 7-ci sinif Azərbaycan Tarixi - "Xürrəmilər hərəkatı"
    result = generate_test_for_topic(
        grade=7, 
        subject="Azərbaycan tarixi", 
        topic="Xürrəmilər hərəkatı", 
        bloom_level="Təhlil" # Going for Analysis level since it's 7th grade history
    )
