import re
import json

with open("lib/runtime-kag-guard.ts", "r", encoding="utf-8") as f:
    text = f.read()

# Find all canonical items
ids = re.findall(r'"id":\s*"([^"]+)"', text)
print(f"Total IDs in runtime-kag-guard: {len(ids)}")

# Look for gold rules or relations
gold_matches = re.findall(r'GOLD-[A-Z0-9]+', text)
print(f"Direct GOLD string matches: {set(gold_matches)}")

# Check git commit history of runtime-kag-guard.ts
