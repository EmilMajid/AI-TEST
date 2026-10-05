import json

t_path = 'C:/Users/User/.gemini/antigravity/brain/6da0f08f-5eda-410e-b966-f2e6c5e3d27a/.system_generated/logs/transcript.jsonl'

with open(t_path, 'r', encoding='utf-8') as f:
    for line in f:
        if 'biliyin-geriy' in line:
            data = json.loads(line)
            txt = data.get('content', '')
            print("STEP:", data.get('step_index'), "TYPE:", data.get('type'))
            print("TEXT:", txt[:500])
            print("="*60)
