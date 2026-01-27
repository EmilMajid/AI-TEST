import json
import os
import random

# MOCK CHUNK RETRIEVAL (In production, this would use vector DB)
def get_topic_context(textbook_id, topic):
    # This simulates retrieving ONLY the chunks relevant to the specific topic
    # The user emphasized: "Sİ isə ANCAQ (!) həmin mövzu əhatə edən məlumatlar əsasında test tapşırığı hazırlayır."
    
    # In a real system, we'd query: select chunks where meta.topic = topic and meta.book = textbook_id
    context_data = f"""
    [Mənbə: {textbook_id}]
    Mövzu: {topic}
    
    Əsas məlumatlar:
    Albaniya dövləti e.ə. IV əsrdə yaranmışdır. Paytaxtı Kabalaka (Qəbələ) şəhəri olmuşdur.
    Albaniya əhalisi çoxallahlı idi. Onlar müxtəlif təbiət qüvvələrinə, səma cisimlərinə (Ay, Günəş) sitayiş edirdilər.
    Ən hörmətli tanrı Ay tanrısı idi. Ay məbədinin kahini ölkədə çardan sonra ikinci şəxs hesab olunurdu.
    Bütpərəstlik geniş yayılmışdı. İnsanlar daşdan, ağacdan bütlər düzəldib onlara tapınırdılar.
    Xristianlıq Albaniyada I əsrdə yayılmağa başlamışdır.
    """
    return context_data

def generate_test_prompt(topic, context):
    return f"""
    Sən peşəkar təhsil ekspertisən. Tələb: 6-cı sinif şagirdi üçün aşağıdakı mövzu üzrə 1 ədəd test tapşırığı hazırla.
    
    Mövzu: {topic}
    İstifadə ediləcək Mətn (Kontekst):
    {context}
    
    QAYDALAR (Bunlara ciddi əməl et):
    1. Testin Məqsədi: Sadə xatırlama yox, kritik düşüncə və anlamanı yoxla (Blum Taksonomiyası).
    2. Sual Əsası (Stem): Tam problemi ifadə et. "Aşağıdakılardan hansı səhvdir?" kimi inkar suallardan qaçın. Müsbət suallar ver.
    3. Düzgün Cavab: Yalnız bir ən yaxşı cavab olsun. Mətndəki cümləni eynilə təkrarlama (parafrız et).
    4. Distraktorlar (Səhv variantlar): 3 yanlış variant yaz. Bunlar "aşkar səhv" və ya "məzəli" olmasın. Şagirdin qarışdıra biləcəyi məntiqi səhvlər olsun.
    5. Format: JSON formatında ver.
    
    JSON Strukturu:
    {{
        "question": "Sual mətni...",
        "options": ["A variantı", "B variantı", "C variantı", "D variantı"],
        "correct_index": 0, (0-3 arası indeks)
        "bloom_level": "Anlama/Tətbiq/Təhlil",
        "explanation": "Niyə bu cavab düzgündür və digərləri səhvdir?"
    }}
    """

def main():
    # User's Example Scenario
    textbook_id = "azerbaycan-tarixi-6"
    topic = "7. Albaniya dövləti mədəniyyət"
    
    print(f"--- SİSTEM SİMULYASİYASI: {topic} ---")
    
    # 1. Retrieve ONLY relevant context
    context = get_topic_context(textbook_id, topic)
    print(f"✅ Kontekst yükləndi ({len(context)} simvol)")
    
    # 2. Build Prompt
    prompt = generate_test_prompt(topic, context)
    
    # 3. Simulate LLM Response (Mocking the user's desired output quality)
    mock_llm_response = {
        "question": "Albaniya əhalisinin dini inancları ilə bağlı hansı fikir mətndəki məlumatlara əsasən doğrudur?",
        "options": [
            "Ay tanrısına sitayiş edən kahinlər ölkənin idarəçiliyində mühüm rol oynayırdı.",
            "Əhali yalnız tək bir tanrıya inanır və bütpərəstliyi rədd edirdi.",
            "Zərdüştlük rəsmi dövlət dini kimi qəbul edilmişdi.",
            "Xristianlıq eradan əvvəl IV əsrdən etibarən əsas dinə çevrilmişdi."
        ],
        "correct_index": 0,
        "bloom_level": "Anlama",
        "explanation": "Mətndə qeyd olunur ki, Ay məbədinin kahini çardan sonra ikinci şəxs idi, bu da onların idarəçilikdəki rolunu göstərir. Digər variantlar mətndəki faktlarla (çoxallahlılıq, I əsr xristianlıq) ziddiyyət təşkil edir."
    }
    
    print("\n--- YARADILAN TEST TAPŞIRIĞI ---")
    print(json.dumps(mock_llm_response, ensure_ascii=False, indent=2))
    
    print("\n--- İZAHAT (USER SUALINA CAVAB) ---")
    print("Siz haqlısınız. Sistem məhz bu məntiqlə işləməlidir:")
    print("1. 'Chunking' (Hissələrə bölmə) ona görə lazımdır ki, bütün 200 səhifəlik kitabı LLM-ə göndərmək olmaz.")
    print("   Biz kitabı kiçik, mənalı hissələrə bölürük.")
    print("2. Şagird 'Mövzu 7' seçəndə, biz ANCAQ o mövzuya aid olan 'chunk'ları tapıb LLM-ə göndəririk.")
    print("3. Nəticədə LLM sizin istədiyiniz kimi, kənar məlumatlar (Zərdüştlük və s.) olmadan, yalnız verilən kontekstə uyğun sual hazırlayır.")

if __name__ == "__main__":
    main()
