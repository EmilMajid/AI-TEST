import json
import os
import time
from openai import OpenAI

client = OpenAI(
  base_url="https://integrate.api.nvidia.com/v1",
  api_key="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"
)

db = json.load(open('data/offline_tests.json', encoding='utf8'))
chunks = []
if os.path.exists('data/textbook-chunks.jsonl'):
    for line in open('data/textbook-chunks.jsonl', encoding='utf8'):
        if line.strip():
            chunks.append(json.loads(line))

grade4Subjects = [cat for cat in db.keys() if cat.endswith(' 4') or '4-cü' in cat or ' 4 ' in cat]

output_dir = 'data/gen_api_4'
os.makedirs(output_dir, exist_ok=True)

total_generated = 0
total_needed = 0

for cat in grade4Subjects:
    subName = cat.replace(' 4', '').strip()
    tests = db.get(cat, [])
    
    topicCounts = {}
    for t in tests:
        tp = t.get('topic', '').strip() or 'Mövzusuz'
        topicCounts[tp] = topicCounts.get(tp, 0) + 1
        
    subChunks = [c for c in chunks if c.get('subject') == subName and str(c.get('grade')) == '4']
    
    availableTopics = []
    for c in subChunks:
        tp = c.get('topic', '').strip() or c.get('section', '').strip()
        if tp and tp not in availableTopics:
            availableTopics.append(tp)
            
    for tp in availableTopics:
        count = topicCounts.get(tp, 0)
        needed = 15 - count
        if needed > 0:
            total_needed += needed
            print(f'Topic {cat} - {tp} needs {needed} tests.')
            
            topicTextList = [c.get('text', '') for c in subChunks if c.get('topic') == tp or c.get('section') == tp]
            topicText = '\n\n'.join(topicTextList)
            
            if len(topicText) < 20:
                print('Text too short, skipping...')
                continue
            
            if len(topicText) > 15000:
                topicText = topicText[:15000]
                
            safe_tp = ''.join([c if c.isalnum() else '_' for c in tp])
            out_file = os.path.join(output_dir, f"{cat.replace(' ', '')}_{safe_tp}.json")
            if os.path.exists(out_file):
                # count existing if needed
                try:
                    res_json = json.load(open(out_file, 'utf8'))
                    total_generated += len(res_json)
                except:
                    pass
                print('Already generated, skipping.')
                continue
            
            sys_prompt = f"Sən Azərbaycan Təhsil Nazirliyinin SİTG (Gold Standart 2.1) test yaradıcısısan. Verilmiş mətnə əsasən DƏQİQ {needed} ədəd, 4 variantlı (A, B, C, D) və bir-birini təkrarlamayan test yarat. E variantı YOXDUR. Doğru cavabı təsadüfi (Ziq-zaq) olaraq A, B, C, D arasında dəyiş. Yanlış variantlar üçün 'distractor_diagnostics' daxil et. 'passport_id' sahəsinə '04-GEN-{int(time.time())}' formatlı unik nömrə ver. İzahat (explanation) üçün YALNIZ mətndəki original cümlələrdən kopyala. Nəticəni başqa heç bir markdown olmadan sırf JSON array ([\n{{...}}\n]) kimi qaytar."
            user_prompt = f"Mətn: {topicText}"
            
            print(f"Calling NVIDIA API (Llama 3.1 70B) for {tp}...")
            
            for attempt in range(3):
                try:
                    response = client.chat.completions.create(
                      model="meta/llama-3.3-70b-instruct",
                      messages=[
                          {"role":"system","content":sys_prompt},
                          {"role":"user","content":user_prompt}
                      ],
                      temperature=0.3,
                      top_p=1,
                      max_tokens=3500,
                      timeout=120,
                      stream=False
                    )
                    
                    res_content = response.choices[0].message.content
                    start_idx = res_content.find('[')
                    end_idx = res_content.rfind(']')
                    if start_idx != -1 and end_idx != -1:
                        json_str = res_content[start_idx:end_idx+1]
                        res_json = json.loads(json_str)
                        if isinstance(res_json, list):
                            for item in res_json:
                                item['topic'] = tp
                            with open(out_file, 'w', encoding='utf8') as f:
                                json.dump(res_json, f, ensure_ascii=False, indent=2)
                            print(f'  --> Successfully generated {len(res_json)} tests for {tp}')
                            total_generated += len(res_json)
                            break
                    else:
                        print(f'  --> Failed to parse JSON for {tp}')
                        break
                except Exception as e:
                    print(f'  --> API error on {tp} (Attempt {attempt+1}): {e}')
                    time.sleep(10)
            
            time.sleep(5)

print(f'\nFinished API generation. Total tests generated: {total_generated} / {total_needed} needed.')
