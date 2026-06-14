import sys
sys.stdout.reconfigure(encoding='utf-8')
t = open('data/umumitarix6_chunks/full_book.txt', encoding='utf-8', errors='ignore').read()
# find Misir start
for kw in ['misir tarixi', 'qedim misir', 'qədim misir', 'nil çayı', 'misirin coğrafi', 'misir e.ə']:
    i = t.lower().find(kw.lower(), 10000)
    if i != -1:
        print(f'FOUND "{kw}" at {i}:', t[i:i+100].replace('\n',' '))
    else:
        print(f'NOT FOUND: {kw}')
print('---')
print('At pos 17000:', t[17000:17500].replace('\n',' '))
print('At pos 19000:', t[19000:19500].replace('\n',' '))
print('At pos 21000:', t[21000:21500].replace('\n',' '))
