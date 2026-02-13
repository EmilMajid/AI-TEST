import os
import requests
import sys
import io

# Force UTF-8 for console output
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

def download_file(url, target_path):
    print(f"Downloading {url} \nTo: {target_path}...")
    os.makedirs(os.path.dirname(target_path), exist_ok=True)
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        response = requests.get(url, stream=True, timeout=60, headers=headers)
        if response.status_code == 200:
            total_size = int(response.headers.get('content-length', 0))
            block_size = 8192
            downloaded = 0
            
            with open(target_path, 'wb') as f:
                for chunk in response.iter_content(chunk_size=block_size):
                    if chunk:
                        f.write(chunk)
                        downloaded += len(chunk)
                        if total_size > 0:
                            percent = downloaded * 100 / total_size
                            if downloaded % (block_size * 50) == 0:
                                print(f"  Progress: {percent:.1f}%", end='\r')
            print(f"\nSuccessfully downloaded: {target_path}")
            return True
        else:
            print(f"Failed to download {url}: {response.status_code}")
    except Exception as e:
        print(f"Error downloading {url}: {e}")
    return False

def main():
    # 1. Alman Dili 5
    alman_url = "https://www.trims.edu.az/noduploads/book/quot-deutsch-quot-alman-dili-asas-xarici-dil-fanni-uzra-5-ci-sinif-ucun-darslik.pdf"
    alman_path = "public/textbooks/5/alman-dili-5-asas/alman-asas-5.pdf"
    
    download_file(alman_url, alman_path)

if __name__ == "__main__":
    main()
