import sys; sys.stdout.reconfigure(encoding='utf-8')
from openai import OpenAI

NVIDIA_BASE = 'https://integrate.api.nvidia.com/v1'
DEFAULT_KEY = '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'

# NVIDIA-da mövcud olan məlum modellər
models = [
    'meta/llama-3.1-405b-instruct',
    'meta/llama-3.3-70b-instruct',
    'nvidia/llama-3.1-nemotron-70b-instruct',
    'nvidia/llama-3.3-nemotron-super-49b-v1',
    'google/gemma-3-27b-it',
    'microsoft/phi-4',
    'deepseek-ai/deepseek-v4-0324',
]

client = OpenAI(base_url=NVIDIA_BASE, api_key=DEFAULT_KEY)
msg = [{'role':'user','content':'Say "OK" in JSON: {"status":"ok"}'}]

for m in models:
    try:
        r = client.chat.completions.create(model=m, messages=msg, max_tokens=50, temperature=0.1)
        out = r.choices[0].message.content[:60].replace('\n',' ')
        print(f'OK  {m}: {out}')
    except Exception as e:
        print(f'ERR {m}: {str(e)[:80]}')
