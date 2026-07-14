import json
import re

raw_topics = """
Bölmə 1. İnsan orqanizmi
1. Hüceyrədən orqanizmə
2. Biz necə hərəkət edirik?
3. Yediyimiz qidalar hansı prosesdən keçir?
4. Hava bizə nə üçün lazımdır?
5. Bədənimizdə maddələr necə daşınır?
6. Qan dövranı və tənəffüs sistemləri birlikdə necə işləyir?
7. Qan bədənimizdə necə təmizlənir?
8. İnsan orqanizmi necə idarə olunur?
Bölmə 2. Canlıların müxtəlifliyi
9. Canlıları necə təsnif edirik?
10. Heyvanları necə qruplaşdırırıq?
11. Bitkiləri necə təsnif edə bilərik?
Bölmə 3. Maddənin halları və çevrilməsi
12. Bərk, maye və qazların oxşar xassələri
13. Bərk, maye və qazların fərqli xassələri
14. Maddənin halının dəyişməsi
15. Təbiətdə su dövranı
Bölmə 4. Fiziki və kimyəvi hadisələr
16. Fiziki hadisələr
17. Kimyəvi hadisələr
Bölmə 5. Qarışıqlar
18. Saf maddələr və qarışıqlar nədir?
19. Maddələrin suda həll olması
20. Qarışıqların ayrılması
Bölmə 6. Enerji və fəaliyyət
21. Enerji bizə nə üçün lazımdır?
22. Enerjinin hansı növləri var?
23. Enerjinin bir növü başqa növünə çevrilə bilərmi?
24. Bərpa olunmayan və bərpa olunan enerji mənbələri hansılardır?
25. Enerjiyə necə qənaət edə bilərik?
Bölmə 7. Qida zənciri
26. Canlılar enerjini haradan əldə edir?
27. Canlılar arasında enerjinin ötürülməsi prosesi necə baş verir?
28. Qida zəncirinə daxil olan halqalar bir-birindən necə asılıdır?
Bölmə 8. İşıq və görmə
29. Biz cisimləri necə görürük?
30. İşıq hansı istiqamətdə əks olunur?
31. İşıq şüası digər mühitə keçəndə nə baş verir?
Bölmə 9. Təbii fəlakətlər
32. Yerin daxili təbəqələri hansılardır?
33. Zəlzələlər necə baş verir?
34. Vulkanlar necə yaranır?
35. Sel və daşqınlar necə baş verir?
36. Quraqlıq necə baş verir?
Bölmə 10. Ətraf mühit və biz
37. Təbii ehtiyatlar dedikdə nə başa düşürük?
38. İnsanlar ətraf mühitə mənfi təsir göstərirmi?
39. Ətraf mühit necə çirklənir?
40. Biz ətraf mühiti necə qoruya bilərik?
"""

lines = [l.strip() for l in raw_topics.split('\n') if l.strip()]

topic_map = {}
current_b = None
current_f = 0

for line in lines:
    b_match = re.match(r'^Bölmə (\d+)\.', line)
    if b_match:
        current_b = int(b_match.group(1))
        current_f = 0
        continue
    
    t_match = re.match(r'^(\d+)\.\s+(.+)$', line)
    if t_match:
        current_f += 1
        global_topic_num = t_match.group(1)
        title = t_match.group(2)
        key = f"B{current_b}F{current_f:02d}"
        topic_map[key] = f"{global_topic_num}. {title}"

print(f"Mapped {len(topic_map)} standard topics.")

db_path = 'data/offline_tests.json'
with open(db_path, 'r', encoding='utf8') as f:
    db = json.load(f)

tebiet_tests = db.get('Təbiət 5', [])
mapped_count = 0
unmapped_count = 0

for t in tebiet_tests:
    passport = t.get('passport_id', '') or t.get('topic', '')
    match = re.search(r'(B\d+F\d+)', passport)
    if match:
        code = match.group(1)
        if code in topic_map:
            t['topic'] = topic_map[code]
            mapped_count += 1
        else:
            t['topic'] = 'Təyin edilməyib'
            unmapped_count += 1
    else:
        t['topic'] = 'Təyin edilməyib'
        unmapped_count += 1

if unmapped_count > 0:
    print(f"Failed to map {unmapped_count} tests.")

with open(db_path, 'w', encoding='utf8') as f:
    json.dump(db, f, ensure_ascii=False, indent=2)

print(f"Successfully mapped {mapped_count} tests.")

topics = {}
for t in tebiet_tests:
    tp = t.get('topic')
    topics[tp] = topics.get(tp, 0) + 1
print('Təbiət 5 Mövzu Statistikası:')
for k, v in sorted(topics.items(), key=lambda x: -x[1]):
    print(f'- {k}: {v} test')
