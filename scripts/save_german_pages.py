import sys
sys.stdout.reconfigure(encoding='utf-8')
import fitz # PyMuPDF
import requests
import os

url = 'https://www.trims.edu.az/noduploads/book/quot-alman-dili-quot-asas-xarici-dil-fanni-uzra-6-ci-sinif-ucun-darslik-1631279917-903.pdf'
save_path = 'german_6_toc.pdf'

if not os.path.exists(save_path):
    print(f"Downloading {url}...")
    r = requests.get(url)
    with open(save_path, 'wb') as f:
        f.write(r.content)

print("Converting pages 6, 7, 8 to images...")
doc = fitz.open(save_path)
for i in [5, 6, 7]: # Pages 6, 7, 8
    page = doc.load_page(i)
    pix = page.get_pixmap()
    img_path = f"german_6_page_{i+1}.png"
    pix.save(img_path)
    print(f"Saved {img_path}")
doc.close()
