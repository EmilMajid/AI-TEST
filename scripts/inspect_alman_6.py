import sys
sys.stdout.reconfigure(encoding='utf-8')
import PyPDF2
import requests

url = 'https://www.trims.edu.az/noduploads/book/quot-alman-dili-quot-asas-xarici-dil-fanni-uzra-6-ci-sinif-ucun-darslik-1631279917-903.pdf'
save_path = 'temp_alman_6.pdf'

print(f"Downloading {url}...")
r = requests.get(url)
with open(save_path, 'wb') as f:
    f.write(r.content)

print("Extracting text from pages 6, 7, 8...")
with open(save_path, 'rb') as f:
    reader = PyPDF2.PdfReader(f)
    for p in [5, 6, 7]: # 0-indexed
        print(f"--- Page {p+1} ---")
        print(reader.pages[p].extract_text())
