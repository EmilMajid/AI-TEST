import sys

with open('scripts/inject_kimya8_tests.js', 'r', encoding='utf-8') as f:
    content = f.read()

replacements = [
    ('onu Mendeleyevin şərəfinə "Mendelevium" adlandırmışlar.', 'onu Mendeleyevin şərəfinə Mendelevium adlandırmışlar.'),
    ('buna "Triadalar qanunu" adını vermişdir.',                 'buna Triadalar qanunu adını vermişdir.'),
    ('ona "Oktavalar qanunu" adını vermişdir.',                  'ona Oktavalar qanunu adını vermişdir.'),
]

for old, new in replacements:
    if old in content:
        content = content.replace(old, new)
        print(f'Fixed: {old[:60]}')
    else:
        print(f'NOT FOUND: {old[:60]}')

with open('scripts/inject_kimya8_tests.js', 'w', encoding='utf-8') as f:
    f.write(content)

print('Done.')
