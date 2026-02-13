import requests

def check_access():
    base_url = "https://www.e-derslik.edu.az/player/books/451/units/unit-1/page1.xhtml"
    print(f"Checking access to: {base_url}")
    
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Referer': 'https://www.e-derslik.edu.az/player/index3.php?book_id=451'
    }
    
    try:
        response = requests.get(base_url, headers=headers, timeout=10)
        print(f"Status Code: {response.status_code}")
        if response.status_code == 200:
            print("Access SUCCESS!")
            print("Content Preview:")
            print(response.text[:500])
        else:
            print("Access FAILED.")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    check_access()
