import sys
import json

sys.stdout.reconfigure(encoding='utf-8')

with open('data/grades/grade_6.json', 'r', encoding='utf-8') as f:
    d6 = json.load(f)

c_main_pid = list(d6['Coğrafiya 6'].values())[0][0].get('passport_id')
c_h1_pid = list(d6['Coğrafiya 6 (hissə 1)'].values())[0][0].get('passport_id')
print(f"Coğrafiya 6 main pid: {c_main_pid}")
print(f"Coğrafiya 6 hissə 1 pid: {c_h1_pid}")
