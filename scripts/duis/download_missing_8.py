import os
import requests

# Final verified links from TRIMS
books = {
    "biologiya-8-h1": "https://www.trims.edu.az/noduploads/book/quot-biologiya-quot-fanni-uzra-8-ci-sinif-ucun-darslik-1-ci-hissa.pdf",
    "biologiya-8-h2": "https://www.trims.edu.az/noduploads/book/quot-biologiya-quot-fanni-uzra-8-ci-sinif-ucun-darslik-2-ci-hissa-1757933306-765.pdf",
    "fizika-8-h1": "https://www.trims.edu.az/noduploads/book/quot-fizika-quot-fanni-uzra-8-ci-sinif-ucun-darslik-1-ci-hissa-1757931842-467.pdf",
    "fizika-8-h2": "https://www.trims.edu.az/noduploads/book/quot-fizika-quot-fanni-uzra-8-ci-sinif-ucun-darslik-2-ci-hissa.pdf",
    "kimya-8-h1": "https://www.trims.edu.az/noduploads/book/quot-kimya-quot-fanni-uzra-8-ci-sinif-ucun-darslik-1-ci-hissa.pdf",
    "kimya-8-h2": "https://www.trims.edu.az/noduploads/book/quot-kimya-quot-fanni-uzra-8-ci-sinif-ucun-darslik-2-ci-hissa-1757926398-498.pdf",
    "cografiya-8": "https://www.trims.edu.az/noduploads/book/quot-cografiya-quot-fanni-uzra-8-ci-sinif-ucun-darslik-1693824166-861.pdf",
    "edebiyyat-8": "https://www.trims.edu.az/noduploads/book/quot-adabiyyat-quot-fanni-uzra-8-ci-sinif-ucun-darslik-1691674088-465.pdf",
    "riyaziyyat-8": "https://www.trims.edu.az/noduploads/book/quot-riyaziyyat-quot-fanni-uzra-8-ci-sinif-ucun-darslik.pdf",
    "umumi-tarix-8": "https://www.trims.edu.az/noduploads/book/quot-umumi-tarix-quot-fanni-uzra-8-ci-sinif-ucun-darslik-1745847476-764.pdf",
    "azerbaycan-tarixi-8": "https://www.trims.edu.az/noduploads/book/quot-azarbaycan-tarixi-quot-fanni-uzra-8-ci-sinif-ucun-darslik-1693826547-679.pdf",
    "azerbaycan-dili-8": "https://www.trims.edu.az/noduploads/book/quot-azarbaycan-dili-quot-tadris-dili-fanni-uzra-8-ci-sinif-ucun-darslik-1692871106-160.pdf",
    "musiqi-8": "https://www.trims.edu.az/noduploads/book/quot-musiqi-quot-fanni-uzra-8-ci-sinif-ucun-darslik-890.pdf",
    "fiziki-terbiye-8": "https://www.trims.edu.az/noduploads/book/quot-fiziki-tarbiya-quot-fanni-uzra-8-ci-sinif-ucun-darslik-902.pdf"
}

base_dir = "public/textbooks/8"
headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
}

def download_book(name, url):
    subj = name.split('-8')[0]
    folder = os.path.join(base_dir, subj)
    if not os.path.exists(folder):
        os.makedirs(folder)
    
    filename = "book.pdf"
    if "-h1" in name: filename = "book_h1.pdf"
    if "-h2" in name: filename = "book_h2.pdf"
        
    file_path = os.path.join(folder, filename)
    if os.path.exists(file_path):
        print(f"Skipping {name}, already exists.")
        return

    print(f"Downloading {name}...")
    try:
        response = requests.get(url, headers=headers, stream=True, timeout=60)
        response.raise_for_status()
        with open(file_path, "wb") as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)
        print(f"Successfully downloaded {name}")
    except Exception as e:
        print(f"Failed to download {name}: {e}")

if __name__ == "__main__":
    for name, url in books.items():
        download_book(name, url)
