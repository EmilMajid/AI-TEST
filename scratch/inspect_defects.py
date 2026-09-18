import sys
import json
import re

sys.stdout.reconfigure(encoding='utf-8')

with open('data/grades/grade_7.json', 'r', encoding='utf-8') as f:
    d7 = json.load(f)

# Find L2 issues
regex_lazy = [
    re.compile(r'^(?:heç\s+biri|heç\s+biri\s+doğru\s+deyil|heç\s+biri\s+uyğun\s+deyil)$', re.I),
    re.compile(r'^(?:bütün\s+variantlar|bütün\s+cavablar|hamısı\s+doğrudur|hər\s+üçü|hər\s+ikisi)$', re.I),
    re.compile(r'^(?:a\s+və\s+b\s+bəndləri|a\s+və\s+b\s+variantları|həm\s+a,\s*həm\s+b)$', re.I)
]

l2_found = []
dup_opts = []

for s, topics in d7.items():
    for t, qs in topics.items():
        for q_idx, q in enumerate(qs):
            opts = q.get('options', [])
            # check dup
            clean_opts = [str(o).strip().lower() for o in opts]
            if len(set(clean_opts)) < len(opts):
                dup_opts.append((s, t, q_idx, opts))
            # check lazy
            for o_idx, opt in enumerate(opts):
                for reg in regex_lazy:
                    if reg.search(str(opt).strip()):
                        l2_found.append((s, t, q_idx, o_idx, opt, q.get('question')[:50]))

print(f"L2 Lazy Distractors: {len(l2_found)}")
for x in l2_found:
    print(x)

print(f"\nDuplicate Options: {len(dup_opts)}")
for x in dup_opts[:10]:
    print(x)
