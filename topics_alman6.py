import json
import re
from collections import Counter

with open('data/offline_tests.json', 'r', encoding='utf8') as f:
    db = json.load(f)

tests = db.get('Alman dili 6', [])

# Extract unique question patterns to understand underlying topics mentioned
topic_mentions = []
for t in tests:
    q = t.get('question', '')
    # Check for topic-style questions like «In der Schule» mövzusu
    m = re.findall(r'«([^»]+)»\s+mövzusu', q)
    if m:
        topic_mentions.extend(m)
    # Also check in options
    for opt in t.get('options', []):
        pass  # just checking questions for now

topic_counter = Counter(topic_mentions)
print(f"Suallardan çıxarılan mövzu adları ({len(topic_counter)} unikal):")
for t, c in sorted(topic_counter.items(), key=lambda x: -x[1]):
    print(f"  [{c:3d}] {t}")

# Unique question stems
print("\n=== Unikal sual tipi/şablonu ===")
q_patterns = Counter()
for t in tests:
    q = t.get('question', '')
    if '«' in q and '»' in q:
        m = re.sub(r'«[^»]+»', '«TOPIC»', q)
        q_patterns[m[:80]] += 1
    else:
        q_patterns[q[:60]] += 1
for p, c in sorted(q_patterns.items(), key=lambda x: -x[1])[:20]:
    print(f"  [{c:3d}] {p}")
