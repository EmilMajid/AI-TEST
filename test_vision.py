import os
import sys
from scripts.llm_utils import call_gemini_vision, get_api_key

# Load ENV manually if diag.py failed before
def load_env_file(filepath):
    if not os.path.exists(filepath): return
    with open(filepath, 'r', encoding='utf-8') as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith('#'): continue
            if '=' in line:
                k, v = line.split('=', 1)
                os.environ[k.strip()] = v.strip().strip('"').strip("'")

load_env_file('.env')
load_env_file('.env.local')

api_key = get_api_key("gemini")
print(f"API KEY: {api_key}")

test_image = "public/textbooks/8/azerbaycan-tarixi/azerbaycan-tarixi-8-az/assets/img/page10/1.jpg"
if not os.path.exists(test_image):
    print(f"ERROR: Image not found at {test_image}")
    sys.exit(1)

print(f"Calling Gemini Vision for {test_image}...")
prompt = "Bu şəkil dərslik səhifəsidir? Sadəcə BƏLİ və ya XEYR de."
try:
    response = call_gemini_vision(prompt, [test_image], api_key)
    print(f"RESPONSE: {response}")
except Exception as e:
    print(f"FAILED: {e}")
