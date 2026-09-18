import sys
import json

sys.stdout.reconfigure(encoding='utf-8')

with open('data/grades/grade_7.json', 'r', encoding='utf-8') as f:
    d7 = json.load(f)

t_cog = set(d7["Coğrafiya 7"].keys())
t_c1 = set(d7["Coğrafiya 7 (1-ci hissə)"].keys())
t_c2 = set(d7["Coğrafiya 7 (2-ci hissə)"].keys())
print("Coğrafiya union == full:", (t_c1 | t_c2) == t_cog)

t_bio = set(d7["Biologiya 7"].keys())
t_b1 = set(d7["Biologiya 7 (1-ci hissə)"].keys())
t_b2 = set(d7["Biologiya 7 (2-ci hissə)"].keys())
print("Biologiya union == full:", (t_b1 | t_b2) == t_bio)
print("Biologiya diff (t_bio - (t_b1 | t_b2)):", t_bio - (t_b1 | t_b2))
