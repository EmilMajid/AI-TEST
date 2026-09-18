import sys
import json

sys.stdout.reconfigure(encoding='utf-8')

with open('data/grades/grade_7.json', 'r', encoding='utf-8') as f:
    d7 = json.load(f)

targets = [
    ('Riyaziyyat 7', '3. Proqnozlaşdırma', 8),
    ('Riyaziyyat 7', '10. Rasional ədədlərin ədəd oxunda göstərilməsi', 14),
    ('Riyaziyyat 7', '33. Üçbucağın elementləri: tənbölən, median, hündürlük', 8),
    ('Riyaziyyat 7', '57. Bərabəryanlı və bərabərtərəfli üçbucağın xassələri', 6),
    ('Fizika 7', 'Elm, texnologiya, həyat (Bölmə 1)', 1),
    ('Kimya 7', '1.5 Qeyri-metallar və onların xassələri. Allotropiya', 13),
    ('Kimya 7', '2.3 İzotoplar və ionlar', 10),
    ('Kimya 7', '5.3 Durultma üsulu', 7)
]

for s, t, idx in targets:
    q = d7[s][t][idx]
    print(f"[{s}] {t} (Q#{idx}):")
    print(f"  Q: {q.get('question')}")
    print(f"  Opts: {q.get('options')}")
    print(f"  CA: {q.get('correctAnswer')}")
    print(f"  Expl: {q.get('explanation')}")
