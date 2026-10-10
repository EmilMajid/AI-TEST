import json

with open("data/grades/grade_9.json", "r", encoding="utf-8") as f:
    d = json.load(f)

print("Keys in grade_9.json:")
for k, v in d.items():
    if isinstance(v, list):
        print(f"  Key: {k.encode('ascii', 'backslashreplace').decode()} -> list with {len(v)} items")
    elif isinstance(v, dict):
        print(f"  Key: {k.encode('ascii', 'backslashreplace').decode()} -> dict with keys: {list(v.keys())[:5]}")
    else:
        print(f"  Key: {k.encode('ascii', 'backslashreplace').decode()} -> {type(v)}")
