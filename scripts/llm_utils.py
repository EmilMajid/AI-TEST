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
                
                os.environ[key] = value

# Load .env and .env.local
root_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
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

def call_gemini(prompt, api_key):
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
        try:
             print(f"Response: {response.text}")
        except:
             pass
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
            
    # Mock fallback if everything fails (useful for prototyping without paying)
    print("All providers failed. Returning MOCK data.")
    return None

def extract_triples(text, provider="gemini"):
    """
    Extracts Subject-Predicate-Object triples from a given text using an LLM.
    Specifically tuned for Azerbaijan curriculum topics and definitions.
    """
    
    prompt = f"""
    Sən Azərbaycan dərslikləri üçün Bilik Qrafiki (Knowledge Graph) quran süni intellekt köməkçisisən.
    Vəzifən: Aşağıdakı dərslik mövzusundan və ya mətndən əsas anlayışları və onların əlaqələrini "Üçlüklər" (Triples) şəklində çıxarmaqdır.

    Qaydalar:
    1. Predicate (əlaqə) qısa, böyük hərflərlə və Azərbaycan dilində olsun.
    2. Tez-tez istifadə olunan əlaqə növləri:
       - DAXİLDİR: Bir anlayışın digərinin tərkib hissəsi olması (məs: "İsim" -> DAXİLDİR -> "Nitq hissələri").
       - NÜMUNƏDİR: Bir anlayışın digərinə misal olması (məs: "Bakı" -> NÜMUNƏDİR -> "Şəhər").
       - SƏBƏB_OLUR: Səbəb-nəticə əlaqəsi.
       - TƏQDİM_EDİR: Mövzu nəyi izah edir.
       - ƏLAQƏDARDIR: Ümumi əlaqə.
       - ÖYRƏNİR: Elm sahəsinin nəyi araşdırdığı.
    3. Mövzu başlıqlarından (TOC) çıxarış edərkən mövzunun əsas mahiyyətinə diqqət yetir.
    
    Format: JSON
    Struktur: [{{ "subject": "...", "predicate": "...", "object": "..." }}]
    
    Mətn:
    {text}
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
