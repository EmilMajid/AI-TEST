import sys; sys.stdout.reconfigure(encoding='utf-8')
from openai import OpenAI

NVIDIA_BASE = 'https://integrate.api.nvidia.com/v1'
DEFAULT_KEY = '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'

models = [
    'meta/llama-3.3-70b-instruct',
    'qwen/qwen2.5-72b-instruct',
    'mistralai/mistral-large-2-instruct',
]

client = OpenAI(base_url=NVIDIA_BASE, api_key=DEFAULT_KEY)
msg = [{'role':'user','content':'Azerbaycan dilinde bir matematik test suali yaz. Yalniz JSON formatinda: {"question":"...sual...","options":["A","B","C","D"],"correctAnswer":0}'}]

for m in models:
    try:
        r = client.chat.completions.create(model=m, messages=msg, max_tokens=300, temperature=0.7)
        print(f'OK  {m}: {r.choices[0].message.content[:100]}')
    except Exception as e:
        print(f'ERR {m}: {str(e)[:100]}')
