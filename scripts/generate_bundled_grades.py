import os
import gzip
import base64

os.makedirs('data/bundled', exist_ok=True)

for g in range(1, 12):
    json_path = f'data/grades/grade_{g}.json'
    if os.path.exists(json_path):
        with open(json_path, 'rb') as f:
            data = f.read()
        gz = gzip.compress(data, compresslevel=9)
        b64 = base64.b64encode(gz).decode('ascii')
        ts_path = f'data/bundled/grade_{g}.ts'
        with open(ts_path, 'w', encoding='utf-8') as f:
            f.write(f'// Auto-generated bundled grade {g} database\nexport const gradeGz = "{b64}";\n')
        print(f'Wrote {ts_path}: {len(b64)/(1024*1024):.2f} MB')

if os.path.exists('data/grades/grade_other.json'):
    with open('data/grades/grade_other.json', 'rb') as f:
        data = f.read()
    gz = gzip.compress(data, compresslevel=9)
    b64 = base64.b64encode(gz).decode('ascii')
    with open('data/bundled/grade_other.ts', 'w', encoding='utf-8') as f:
        f.write(f'// Auto-generated bundled grade other database\nexport const gradeGz = "{b64}";\n')
    print('Wrote data/bundled/grade_other.ts')

print('All bundled grade files generated successfully!')
