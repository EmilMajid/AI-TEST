import os
import requests
import base64
import json

# Manual load of .env.local for XAI key
def load_xai():
    with open('.env.local', 'r') as f:
        for line in f:
            if 'XAI_API_KEY' in line:
                return line.split('=')[1].strip().strip('"').strip("'")
    return None

api_key = load_xai()
print(f"XAI API KEY Found: {api_key[:10]}...")

image_path = "public/textbooks/8/azerbaycan-tarixi/azerbaycan-tarixi-8-az/assets/img/page10/1.jpg"

with open(image_path, "rb") as image_file:
    encoded_string = base64.b64encode(image_file.read()).decode('utf-8')

url = "https://api.x.ai/v1/chat/completions"
headers = {
    "Content-Type": "application/json",
    "Authorization": f"Bearer {api_key}"
}

data = {
    "model": "grok-vision-beta",
    "messages": [
        {
            "role": "user",
            "content": [
                {"type": "text", "text": "Bu şəkildə nə təsvir olunub? (Çox qısa cavab ver)"},
                {
                    "type": "image_url",
                    "image_url": {
                        "url": f"data:image/jpeg;base64,{encoded_string}"
                    }
                }
            ]
        }
    ],
    "max_tokens": 100
}

print("Executing XAI Vision request...")
try:
    response = requests.post(url, headers=headers, json=data)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")
except Exception as e:
    print(f"Error: {e}")
