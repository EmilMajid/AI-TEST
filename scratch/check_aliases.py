import sys
import json

sys.stdout.reconfigure(encoding='utf-8')

with open('data/grades/grade_7.json', 'r', encoding='utf-8') as f:
    d7 = json.load(f)

def compare_subjects(s1, s2):
    t1 = set(d7[s1].keys())
    t2 = set(d7[s2].keys())
    print(f"Comparing '{s1}' ({len(t1)}) vs '{s2}' ({len(t2)}): Common = {len(t1 & t2)}, s1-s2 = {len(t1 - t2)}, s2-s1 = {len(t2 - t1)}")

compare_subjects("İngilis dili 7", "English - 7 (əsas xarici dil)")
compare_subjects("İngilis dili 7", "English - 7 (ikinci xarici dil)")
compare_subjects("Rus dili 7", "Русский язык - 7 (əsas xarici dil)")
compare_subjects("Rus dili 7", "rus-dili-7")
compare_subjects("Русский язык - 7 (ikinci xarici dil)", "rus-dili-2-7")
