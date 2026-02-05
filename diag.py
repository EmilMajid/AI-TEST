import os
import sys
from scripts.llm_utils import get_api_key

print(f"PYTHONPATH: {sys.path}")
print(f"CWD: {os.getcwd()}")

# Load env vars manually to see what's happening
env_path = os.path.join(os.getcwd(), '.env')
if os.path.exists(env_path):
    print(f".env exists at {env_path}")
    with open(env_path, 'r') as f:
        for line in f:
            if 'MOCK_MODE' in line or 'GEMINI_API_KEY' in line:
                print(f"File line: {line.strip()}")

print(f"OS ENV MOCK_MODE: {os.environ.get('MOCK_MODE')}")
print(f"API KEY: {get_api_key('gemini')}")
