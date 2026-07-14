import json
import re

raw_topics = """
I Bölmə. Qədim Azərbaycan
1. Tarix necə öyrənilir?
2. Vətənim Azərbaycan
3. Azərbaycanda ilk insan məskənləri
4. Əmək alətləri necə yarandı?
5. Dövlətlər nə üçün lazımdır?
6. Azərbaycanın qədim dövlətləri
II Bölmə. Azərbaycan dövlətləri
7. Əsarətlə barışmayan qəhrəman
8. Azərbaycanı birləşdirən ilk hökmdar
9. Səlcuqlar və Azərbaycan
10. Atabəy Şəmsəddin Eldəniz
11. Qara Yusif kim idi?
12. Həsən padşah Bayandur
13. Şeyx necə şah oldu?
14. Tariximizdə qadınlar
15. Şərqin son fatehi
16. Birlik yoxdursa, dirilik də yoxdur
17. Azərbaycan necə parçalandı?
III Bölmə. Qalalar və şəhərlər
18. Daş keşikçilər
19. Şəhərlər necə yarandı?
20. Qədim Azərbaycan şəhərləri
21. Azərbaycanın taxtı - Təbriz
IV Bölmə. Azərbaycan respublikaları
22. Müsəlman Şərqinin ilk Cümhuriyyəti
23. Sovet işğalı
24. Azərbaycan xalqı faşizmə qarşı
25. Dövlət müstəqilliyinin bərpası
26. Birinci Qarabağ müharibəsi
27. Dövlətin xilaskarı
28. Müzəffər Ali Baş Komandan
29. Böyük Zəfərin ilk qaranquşu - Aprel döyüşləri
30. Qanı ilə tarix yazan qəhrəmanlar
31. Vətən müharibəsi
32. Qarabağda quruculuq
V Bölmə. Mədəniyyət inciləri
33. “Kitabi-Dədə Qorqud”.
34. Nizami Gəncəvi
35. Elmlə siyasət yürüdən alimlər
36. Azərbaycan tarixinin atası
37. “Əkinçi”dən başlanan yol
38. Milli operanın banisi
39. Lütfi Zadə
"""

lines = [l.strip() for l in raw_topics.split('\n') if l.strip()]

topic_map = {}
roman_to_int = {'I': 1, 'II': 2, 'III': 3, 'IV': 4, 'V': 5}
current_b = None
current_f = 0

for line in lines:
    b_match = re.match(r'^(I|II|III|IV|V) Bölmə', line)
    if b_match:
        current_b = roman_to_int[b_match.group(1)]
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

azt_tests = db.get('Azərbaycan tarixi 5', [])
mapped_count = 0
unmapped_count = 0
unmapped_list = []

for t in azt_tests:
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
            unmapped_list.append(t)
    else:
        t['topic'] = 'Təyin edilməyib'
        unmapped_count += 1
        unmapped_list.append(t)

if unmapped_count > 0:
    print(f"Failed to map {unmapped_count} tests.")

with open(db_path, 'w', encoding='utf8') as f:
    json.dump(db, f, ensure_ascii=False, indent=2)

print(f"Successfully mapped {mapped_count} tests.")
