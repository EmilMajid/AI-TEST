import os
import requests
import json
import time

def load_env_file(filepath):
    """Manually parses a .env file and sets environment variables."""
    if not os.path.exists(filepath):
        return
    
    with open(filepath, 'r', encoding='utf-8') as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith('#'):
                continue
            if '=' in line:
                key, value = line.split('=', 1)
                key = key.strip()
                value = value.strip()
                # Remove quotes if present
                if (value.startswith('"') and value.endswith('"')) or \
                   (value.startswith("'") and value.endswith("'")):
                    value = value[1:-1]
                
                if key not in os.environ:
                    os.environ[key] = value

# Load .env and .env.local
root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
load_env_file(os.path.join(root_dir, '.env'))
load_env_file(os.path.join(root_dir, '.env.local'))

def get_api_key(provider):
    if provider == "gemini":
        return os.environ.get("GEMINI_API_KEY")
    elif provider == "deepseek":
        return os.environ.get("DEEPSEEK_API_KEY")
    elif provider == "openai":
         return os.environ.get("OPENAI_API_KEY")
    elif provider == "xai":
         return os.environ.get("XAI_API_KEY")
    return None

import base64

def get_image_data(image_path):
    """Returns base64 encoded image data and its mime type."""
    try:
        with open(image_path, "rb") as image_file:
            encoded_string = base64.b64encode(image_file.read()).decode('utf-8')
        mime_type = "image/jpeg" if image_path.lower().endswith((".jpg", ".jpeg")) else "image/png"
        return encoded_string, mime_type
    except Exception as e:
        print(f"Error encoding image {image_path}: {e}")
        return None, None

def call_gemini_vision(prompt, image_paths, api_key):
    """Calls Gemini 1.5 Flash with multiple images."""
    if not api_key or "placeholder" in api_key:
        return None
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={api_key}"
    headers = {"Content-Type": "application/json"}
    
    parts = [{"text": prompt}]
    for path in image_paths:
        data, mime = get_image_data(path)
        if data:
            parts.append({
                "inline_data": {
                    "mime_type": mime,
                    "data": data
                }
            })
    
    data = {
        "contents": [{
            "parts": parts
        }]
    }
    try:
        response = requests.post(url, headers=headers, json=data)
        response.raise_for_status()
        result = response.json()
        return result['candidates'][0]['content']['parts'][0]['text']
    except Exception as e:
        print(f"Gemini Vision API Error: {e}")
        if hasattr(e, 'response') and e.response:
            print(f"Response: {e.response.text}")
        return None

def call_gemini(prompt, api_key):
    """Standard Gemini 1.5 Flash text-only call."""
    if not api_key or "placeholder" in api_key:
        return None
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={api_key}"
    headers = {"Content-Type": "application/json"}
    data = {
        "contents": [{
            "parts": [{"text": prompt}]
        }]
    }
    try:
        response = requests.post(url, headers=headers, json=data)
        response.raise_for_status()
        result = response.json()
        return result['candidates'][0]['content']['parts'][0]['text']
    except Exception as e:
        print(f"Gemini API Error: {e}")
        return None

def call_xai_vision(prompt, image_paths, api_key):
    """Calls XAI Grok Vision API with multiple images."""
    if not api_key or api_key.startswith("xai-B"): # xai-B... is the blocked key from logs
        return None
    url = "https://api.x.ai/v1/chat/completions"
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {api_key}"
    }
    
    content = [{"type": "text", "text": prompt}]
    for path in image_paths:
        data, mime = get_image_data(path)
        if data:
            content.append({
                "type": "image_url",
                "image_url": {
                    "url": f"data:{mime};base64,{data}"
                }
            })
    
    data = {
        "model": "grok-2-vision-1212",
        "messages": [{"role": "user", "content": content}],
        "temperature": 0.1
    }
    
    try:
        response = requests.post(url, headers=headers, json=data)
        if response.status_code != 200:
            print(f"XAI API Error Status: {response.status_code}")
            print(f"XAI API Response body: {response.text}")
        response.raise_for_status()
        result = response.json()
        return result['choices'][0]['message']['content']
    except Exception as e:
        print(f"XAI Vision API Error: {e}")
        return None

def generate_gold_standard_question_vision(subject, grade, image_paths, bloom="Anlama", skill="General"):
    """
    Generates a question from IMAGES following the 'Gold Standard 2.0' protocol.
    With failover support: Gemini -> XAI
    """
    
    # MOCK MODE Fallback
    if os.environ.get("MOCK_MODE") == "true":
        return json.dumps({
            "question": f"{subject} fənni üzrə ({grade}-cı sinif) {skill} mövzusuna aid nümunəvi (VİSİON) sual?",
            "options": ["A", "B", "C", "D"],
            "correct_index": 0,
            "bloom_level": bloom,
            "difficulty": "Orta",
            "measured_skill": skill,
            "operational_description": "VİSİON MOCK MODE",
            "explanation": {"correct": "...", "distractors": {"A": "...", "B": "...", "C": "..."}},
            "distractor_diagnostics": {"A": "conceptual_error", "B": "typical_mistake", "C": "term_confusion"},
            "solution_steps": ["step1", "step2"],
            "estimated_time_sec": 60,
            "irt_proxy": {"difficulty_estimate": 0.5, "discrimination_estimate": 0.4}
        }, ensure_ascii=False)

    gold_core = """
    Sən peşəkar testologiya mütəxəssisisən. 
    ❗ Təqdim olunan ŞƏKİLLƏRDƏKİ mətni oxu və ordakı məlumatdan istifadə et.
    ❗ Əgər məlumat kifayət deyilsə, "Məlumat çatışmır" yaz.
    🚫 QADAĞANDIR: "Hansı DEYİL?", "Yanlışdır?" tipli inkar suallar.
    🚫 QADAĞANDIR: Birdən çox düzgün cavab, subyektivlik.
    Bloom səviyyəsi MƏCBURİ tətbiq edilməlidir.
    Distraktorlar tipik şagird səhvlərini əks etdirməlidir.
    """
    
    prompt = f"""
    {gold_core}
    FƏNN: {subject}
    SİNİF: {grade}
    BLOOM: {bloom}
    MÖVZU/BACARIQ: {skill}
    
    TƏLƏB: Şəkillərdəki məlumat əsasında aşağıdakı JSON formatında sual hazırla:
    {{
      "question": "...",
      "options": ["A", "B", "C", "D"],
      "correct_index": 0,
      "bloom_level": "{bloom}",
      "difficulty": "Orta",
      "measured_skill": "{skill}",
      "operational_description": "...",
      "explanation": {{
        "correct": "...",
        "distractors": {{ "A": "...", "B": "...", "C": "..." }}
      }},
      "distractor_diagnostics": {{
        "A": "conceptual_error", "B": "partial_truth", "C": "typical_mistake"
      }},
      "solution_steps": ["..."],
      "estimated_time_sec": 60,
      "irt_proxy": {{ "difficulty_estimate": 0.5, "discrimination_estimate": 0.5 }}
    }}
    """
    
    # Try Gemini first
    gemini_key = get_api_key("gemini")
    if gemini_key and "placeholder" not in gemini_key:
        print("Attempting with Gemini Vision...")
        res = call_gemini_vision(prompt, image_paths[:5], gemini_key)
        if res: return res
        
    # Failover to XAI Vision
    xai_key = get_api_key("xai")
    if xai_key:
        print("Attempting with XAI Vision (Grok)...")
        # Ensure we don't send too many images at once
        res = call_xai_vision(prompt, image_paths[:3], xai_key)
        if res: return res
            
    return None

def call_openai_compatible(prompt, api_key, base_url, model):
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {api_key}"
    }
    data = {
        "model": model,
        "messages": [{"role": "user", "content": prompt}],
        "temperature": 0.1
    }
    
    try:
        response = requests.post(base_url, headers=headers, json=data)
        response.raise_for_status()
        result = response.json()
        return result['choices'][0]['message']['content']
    except Exception as e:
        print(f"API Error ({base_url}): {e}")
        try:
             print(f"Response: {response.text}")
        except:
             pass
        return None

def generate_text_with_failover(prompt, provider="gemini"):
    """
    Generates text using an LLM with automatic failover to other providers.
    """
    providers = [provider] + [p for p in ["xai", "gemini", "deepseek", "openai"] if p != provider]
    
    for current_provider in providers:
        api_key = get_api_key(current_provider)
        if not api_key:
            continue
            
        print(f"Attempting with provider: {current_provider}...")
        
        result = None
        if current_provider == "gemini":
            result = call_gemini(prompt, api_key)
        elif current_provider == "deepseek":
            result = call_openai_compatible(prompt, api_key, "https://api.deepseek.com/v1/chat/completions", "deepseek-chat")
        elif current_provider == "xai":
            result = call_openai_compatible(prompt, api_key, "https://api.x.ai/v1/chat/completions", "grok-beta")
        elif current_provider == "openai":
             result = call_openai_compatible(prompt, api_key, "https://api.openai.com/v1/chat/completions", "gpt-4o")
        
        if result:
            return result
        else:
            print(f"Provider {current_provider} failed or returned empty. Trying next...")
            
    # No mock fallback - raise error if all providers fail
    print("⚠️ All LLM providers failed. Please configure valid API keys in .env file.")
    return None

def generate_gold_standard_question(subject, grade, context, bloom="Anlama", skill="General"):
    """
    Generates a question following the 'Gold Standard 2.0' protocol.
    Includes anti-hallucination, psychometric distractors, and self-correction.
    """
    
    # Global Constraints (Gold Core)
    gold_core = """
    Sən peşəkar testologiya mütəxəssisisən. 
    ❗ YALNIZ verilmiş kontekstdən istifadə et. Fakt əlavə ETMƏ.
    ❗ Əgər məlumat kifayət deyilsə, "Məlumat çatışmır" yaz.
    🚫 QADAĞANDIR: "Hansı DEYİL?", "Yanlışdır?" tipli inkar suallar.
    🚫 QADAĞANDIR: Birdən çox düzgün cavab, subyektivlik.
    Bloom səviyyəsi MƏCBURİ tətbiq edilməlidir.
    Distraktorlar tipik şagird səhvlərini (Konseptual səhv, Termin qarışıqlığı və s.) əks etdirməlidir.
    """

    # Subject-specific prompt blocks (from docs/gold_standard_prompts.md)
    subject_prompts = {
        "Azərbaycan dili": "Dilçilik termini düzgün və dəqiq istifadə olunsun. Mövzu daxili məntiqə söykənsin.",
        "Ədəbiyyat": "Ədəbi suallarda subyektivlik YOXDUR. Simvolik analiz səhvlərini distraktor et.",
        "Riyaziyyat": "Hesablamanı mərhələlərlə apar. Cavabı sonda YOXLA (Internal Check).",
        "Tarix": "Səbəb-nəticə və Analiz bacarığını ölç. Başqa dövrə aid hadisələri distraktor et.",
        "Xarici dil": "Leksika yalnız sinif səviyyəsinə uyğun olsun. Tipik zaman və ya söz forması səhvləri yarat."
    }
    
    specific_rule = subject_prompts.get(subject, "Fənn prinsiplərinə uyğun dəqiq sual hazırla.")

    # MOCK MODE Fallback
    if os.environ.get("MOCK_MODE") == "true":
        return json.dumps({
            "question": f"{subject} fənni üzrə ({grade}-cı sinif) {skill} mövzusuna aid nümunəvi sual?",
            "options": ["A", "B", "C", "D"],
            "correct_index": 0,
            "bloom_level": bloom,
            "difficulty": "Orta",
            "measured_skill": skill,
            "operational_description": "...",
            "explanation": {"correct": "...", "distractors": {"A": "...", "B": "...", "C": "..."}},
            "distractor_diagnostics": {"A": "conceptual_error", "B": "typical_mistake", "C": "term_confusion"},
            "solution_steps": ["step1", "step2"],
            "estimated_time_sec": 60,
            "irt_proxy": {"difficulty_estimate": 0.5, "discrimination_estimate": 0.4}
        }, ensure_ascii=False)

    main_prompt = f"""
    {gold_core}
    FƏNN: {subject}
    SİNİF: {grade}
    BLOOM: {bloom}
    MÖVZU/BACARIQ: {skill}
    
    {specific_rule}
    
    KONTEKST (MƏTİN):
    {context}
    
    TƏLƏB: 
    1. Əvvəlcə daxili olaraq sualı həll et. 
    2. Əgər daxili həllin `correct_index` ilə üst-üstə düşmürsə, sualı yenidən qur.
    3. Yalnız yekun, yoxlanılmış sualı aşağıdakı JSON formatında ver:
    {{
      "question": "...",
      "options": ["A", "B", "C", "D"],
      "correct_index": 0,
      "bloom_level": "{bloom}",
      "difficulty": "Orta",
      "measured_skill": "{skill}",
      "operational_description": "...",
      "explanation": {{
        "correct": "...",
        "distractors": {{ "A": "...", "B": "...", "C": "..." }}
      }},
      "distractor_diagnostics": {{
        "A": "conceptual_error | partial_truth | typical_mistake | term_confusion",
        "B": "...", "C": "..."
      }},
      "solution_steps": ["Hesablama və ya məntiq addımları"],
      "estimated_time_sec": 60,
      "irt_proxy": {{
        "difficulty_estimate": 0.1-1.0 arası,
        "discrimination_estimate": 0.1-1.0 arası
      }}
    }}
    """
    
    # Retry Loop (Version 2.1 Enhancement)
    for attempt in range(2):
        try:
            raw_response = generate_text_with_failover(main_prompt)
            if not raw_response: continue
            
            # Basic validation: ensure it's JSON and has core fields
            if "{" in raw_response and "correct_index" in raw_response:
                return raw_response
        except Exception as e:
            print(f"Attempt {attempt+1} failed: {e}")
            
    return None

def extract_triples(text, provider="gemini", subject_context="Ümumi"):
    """
    Extracts Subject-Predicate-Object triples from a given text using an LLM.
    Now supports subject context for better accuracy.
    """
    
    prompt = f"""
    Sən {subject_context} fənni üzrə mütəxəssis məşğələçisən (Bilik Mühəndisisən).
    Vəzifən: Aşağıdakı mətndən əsas anlayışları və onların əlaqələrini Bilik Qrafı (Knowledge Graph) üçün "Üçlüklər" (Triples) şəklində çıxarmaqdır.

    FƏNN KONTEKSTİ: {subject_context}
    MƏTN: {text}

    İSTİFADƏ EDİLƏCƏK PREDİKATLAR (ƏLAQƏLƏR):
    - TƏSVİR_EDİR: Anlayışın tərifi, mahiyyəti ("Hüceyrə" -> TƏSVİR_EDİR -> "Canlının ən kiçik vahidi").
    - NÜMUNƏDİR: Konkret misal ("Bakı" -> NÜMUNƏDİR -> "Paytaxt").
    - XASSƏSİDİR: Xarakterik xüsusiyyət ("Su" -> XASSƏSİDİR -> "Şəffaf").
    - ƏMƏL_EDİR: Hərəkət və ya funksiya icra edir ("Ürək" -> ƏMƏL_EDİR -> "Qan dövranı").
    - NƏTİCƏ_VERİR: Səbəb-nəticə əlaqəsi ("İstiləşmə" -> NƏTİCƏ_VERİR -> "Buxarlanma").
    - DAXİLDİR: Tərkib hissəsi ("Elektron" -> DAXİLDİR -> "Atom").
    - ÖYRƏNİR: Elm sahəsinin obyekti ("Biologiya" -> ÖYRƏNİR -> "Canlı təbiət").
    - TƏTBİQ_OLUNUR: Harada istifadə olunur ("Pifaqor teoremi" -> TƏTBİQ_OLUNUR -> "Həndəsə").

    QAYDALAR:
    1. Yalnız JSON formatında cavab ver.
    2. Çıxarılan triple sayı mətnin həcmindən asılı olaraq 3-8 arası olsun.
    3. Predikatlar mütləq yuxarıdakı siyahıdan olsun (əgər heç biri uyğun gəlmirsə, ƏLAQƏDARDIR istifadə et).
    4. Subject və Object qısa, konkret anlayışlar olsun (bütöv cümlə yox).

    Format: JSON
    Struktur: [{{ "subject": "...", "predicate": "...", "object": "..." }}]
    """

    result = generate_text_with_failover(prompt, provider)
    
    if result:
        # Clean up possible Markdown code blocks
        clean_result = result.strip()
        if clean_result.startswith("```json"):
            clean_result = clean_result[7:]
        if clean_result.endswith("```"):
            clean_result = clean_result[:-3]
        return clean_result.strip()
        
    return json.dumps([
        {"subject": text, "predicate": "MÖVZUDUR", "object": "Təhsil"}
    ])

if __name__ == "__main__":
    # Test
    test_text = "Fotosintez zamanı bitkilər günəş enerjisindən istifadə edərək oksigen yaradır. Bu proses xloroplastlarda baş verir."
    print("Testing extraction...")
    print(extract_triples(test_text))
