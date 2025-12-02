import os
import time
import requests
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import sqlite3
import json
from datetime import datetime
import zipfile
import shutil

# Kök URL
BASE_URL = "https://www.e-derslik.edu.az"

# Yükləmə qovluğu
DOWNLOAD_DIR = "static/uploads/e_derslikler"
os.makedirs(DOWNLOAD_DIR, exist_ok=True)

class EDerslikScraper:
    def __init__(self):
        # Chrome seçimləri
        chrome_options = Options()
        chrome_options.add_argument("--headless")  # GUI olmadan işləmək üçün
        chrome_options.add_argument("--no-sandbox")
        chrome_options.add_argument("--disable-dev-shm-usage")
        chrome_options.add_argument("--disable-gpu")
        chrome_options.add_argument("--window-size=1920,1080")
        
        # Download preferences
        prefs = {
            "download.default_directory": os.path.abspath(DOWNLOAD_DIR),
            "download.prompt_for_download": False,
            "download.directory_upgrade": True,
            "safebrowsing.enabled": True
        }
        chrome_options.add_experimental_option("prefs", prefs)
        
        # Chrome driver yolu (sistem PATH-də olmalıdır)
        try:
            self.driver = webdriver.Chrome(options=chrome_options)
            print("✅ Chrome WebDriver uğurla başladıldı")
        except Exception as e:
            print(f"❌ Chrome WebDriver xətası: {e}")
            print("💡 ChromeDriver yükləyin: https://chromedriver.chromium.org/")
            raise

    def get_db_connection(self):
        """Verilənlər bazası bağlantısı"""
        conn = sqlite3.connect('edutest.db')
        conn.row_factory = sqlite3.Row
        return conn

    def login(self, username=None, password=None):
        """Sayta giriş funksiyası (əgər tələb olunursa)"""
        try:
            login_url = f"{BASE_URL}/login"
            self.driver.get(login_url)
            
            if username and password:
                # Giriş məlumatlarını daxil et
                username_field = WebDriverWait(self.driver, 10).until(
                    EC.presence_of_element_located((By.NAME, "username"))
                )
                password_field = self.driver.find_element(By.NAME, "password")
                submit_btn = self.driver.find_element(By.TYPE, "submit")
                
                username_field.send_keys(username)
                password_field.send_keys(password)
                submit_btn.click()
                
                # Girişin tamamlanmasını gözlə
                time.sleep(3)
                print("✅ Giriş uğurlu")
            else:
                print("ℹ️ Giriş məlumatları verilmədi, anonim olaraq davam edilir")
                
        except Exception as e:
            print(f"⚠️ Giriş xətası: {e}")

    def get_books(self):
        """Dərsliklərin siyahısını əldə et"""
        try:
            print("📚 Dərslik siyahısı əldə edilir...")
            self.driver.get(BASE_URL)
            
            # Səhifənin yüklənməsini gözlə
            WebDriverWait(self.driver, 15).until(
                EC.presence_of_element_located((By.TAG_NAME, "body"))
            )
            
            soup = BeautifulSoup(self.driver.page_source, 'html.parser')
            
            books = []
            
            # Müxtəlif mümkün selektorları yoxla
            selectors = [
                ".book-list a",
                ".textbook-item a", 
                ".derslik-item a",
                "a[href*='derslik']",
                "a[href*='book']",
                ".card a",
                ".item a"
            ]
            
            for selector in selectors:
                links = soup.select(selector)
                if links:
                    print(f"✅ {len(links)} dərslik tapıldı ({selector})")
                    break
            
            if not links:
                # Bütün linkləri yoxla
                all_links = soup.find_all('a', href=True)
                links = [link for link in all_links if 'derslik' in link['href'].lower() or 'book' in link['href'].lower()]
                print(f"🔍 Ümumi axtarışda {len(links)} potensial dərslik tapıldı")
            
            for link in links[:20]:  # İlk 20 dərslik
                try:
                    href = link.get('href', '')
                    if href:
                        book_url = BASE_URL + href if href.startswith('/') else href
                        book_title = link.get_text(strip=True) or link.get('title', '') or f"Dərslik_{len(books)+1}"
                        
                        if book_title and len(book_title) > 3:
                            books.append({
                                'title': book_title,
                                'url': book_url,
                                'subject': self.extract_subject(book_title),
                                'class': self.extract_class(book_title)
                            })
                except Exception as e:
                    continue
            
            print(f"📊 Cəmi {len(books)} dərslik hazırlandı")
            return books
            
        except Exception as e:
            print(f"❌ Dərslik siyahısı əldə edilərkən xəta: {e}")
            return []

    def extract_subject(self, title):
        """Başlıqdan fənni çıxar"""
        subjects = {
            'azərbaycan': 'Azərbaycan dili',
            'riyaziyyat': 'Riyaziyyat',
            'fizika': 'Fizika',
            'kimya': 'Kimya',
            'biologiya': 'Biologiya',
            'tarix': 'Tarix',
            'coğrafiya': 'Coğrafiya',
            'ingilis': 'İngilis dili',
            'ədəbiyyat': 'Ədəbiyyat',
            'informatika': 'İnformatika'
        }
        
        title_lower = title.lower()
        for key, value in subjects.items():
            if key in title_lower:
                return value
        return 'Ümumi'

    def extract_class(self, title):
        """Başlıqdan sinifi çıxar"""
        import re
        # Rəqəmləri tap
        numbers = re.findall(r'\d+', title)
        for num in numbers:
            if 1 <= int(num) <= 11:
                return num
        return '7'  # Default

    def download_book(self, book_info):
        """Fərdi dərsliyi yüklə"""
        try:
            print(f"⬇️ Yüklənir: {book_info['title']}")
            self.driver.get(book_info['url'])
            
            # Səhifənin yüklənməsini gözlə
            time.sleep(3)
            
            # PDF yükləmə linkini tap
            pdf_selectors = [
                "a[href$='.pdf']",
                ".download-pdf",
                ".pdf-download", 
                "a[download]",
                ".btn-download",
                "a[href*='download']",
                "a[href*='pdf']"
            ]
            
            pdf_link = None
            for selector in pdf_selectors:
                try:
                    element = WebDriverWait(self.driver, 5).until(
                        EC.presence_of_element_located((By.CSS_SELECTOR, selector))
                    )
                    pdf_link = element.get_attribute('href')
                    if pdf_link:
                        break
                except:
                    continue
            
            if not pdf_link:
                print(f"⚠️ PDF linki tapılmadı: {book_info['title']}")
                return False
            
            # PDF faylını yüklə
            response = requests.get(pdf_link, stream=True, timeout=30)
            response.raise_for_status()
            
            # Fayl adını təmizlə
            filename = f"{book_info['title']}.pdf".replace('/', '_').replace('\\', '_')
            filename = ''.join(c for c in filename if c.isalnum() or c in '._- ')
            filepath = os.path.join(DOWNLOAD_DIR, filename)
            
            with open(filepath, 'wb') as f:
                for chunk in response.iter_content(1024):
                    f.write(chunk)
            
            # Verilənlər bazasına əlavə et
            self.add_to_database(book_info, filepath)
            
            print(f"✅ {book_info['title']} uğurla yükləndi!")
            return True
            
        except Exception as e:
            print(f"❌ {book_info['title']} yüklənərkən xəta: {str(e)}")
            return False

    def add_to_database(self, book_info, filepath):
        """Dərsliyi verilənlər bazasına əlavə et"""
        try:
            conn = self.get_db_connection()
            cursor = conn.cursor()
            
            # Mövcudluğunu yoxla
            cursor.execute("SELECT id FROM textbooks WHERE name = ?", (book_info['title'],))
            if cursor.fetchone():
                print(f"ℹ️ {book_info['title']} artıq mövcuddur")
                conn.close()
                return
            
            # Mövzuları təxmin et
            topics = self.generate_topics(book_info['subject'], book_info['class'])
            
            file_size = os.path.getsize(filepath) if os.path.exists(filepath) else 0
            
            cursor.execute('''
                INSERT INTO textbooks (name, subject, class, file_path, file_size, topics, is_active)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            ''', (
                book_info['title'],
                book_info['subject'],
                book_info['class'],
                filepath,
                file_size,
                json.dumps(topics),
                True
            ))
            
            conn.commit()
            conn.close()
            print(f"💾 {book_info['title']} verilənlər bazasına əlavə edildi")
            
        except Exception as e:
            print(f"❌ Verilənlər bazası xətası: {e}")

    def generate_topics(self, subject, class_num):
        """Fənn və sinifə görə mövzuları təxmin et"""
        topics_map = {
            'Azərbaycan dili': {
                '7': ['Fel', 'Felin zamanları', 'Zərf', 'Cümlə quruluşu'],
                '8': ['Bağlayıcı', 'Ünlem', 'Sadə cümlə', 'Mürəkkəb cümlə'],
                '9': ['Mürəkkəb cümlə', 'Düzəltmə işarələri', 'Mətn təhlili']
            },
            'Riyaziyyat': {
                '7': ['Cəbri ifadələr', 'Tənliklər', 'Funksiya', 'Həndəsə'],
                '8': ['Kvadrat tənliklər', 'Həndəsi fiqurlar', 'Sahə və həcm'],
                '9': ['Kvadrat funksiya', 'Trigonometriya', 'Çevrə və dairə']
            },
            'Fizika': {
                '7': ['Mexanika', 'Qüvvə', 'İş və enerji', 'Sadə mexanizmlər'],
                '8': ['İstilik', 'Elektrik', 'Maqnetizm', 'İşıq'],
                '9': ['Mexaniki rəqslər', 'Səs', 'Elektromaqnit sahə']
            }
        }
        
        return topics_map.get(subject, {}).get(class_num, ['Ümumi mövzular'])

    def create_zip_archive(self):
        """Yüklənmiş dərslikləri ZIP arxivində birləşdir"""
        try:
            zip_path = os.path.join("static/uploads", "e_derslikler_archive.zip")
            
            with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
                for root, dirs, files in os.walk(DOWNLOAD_DIR):
                    for file in files:
                        file_path = os.path.join(root, file)
                        arcname = os.path.relpath(file_path, DOWNLOAD_DIR)
                        zipf.write(file_path, arcname)
            
            print(f"📦 ZIP arxivi yaradıldı: {zip_path}")
            return zip_path
            
        except Exception as e:
            print(f"❌ ZIP yaradılarkən xəta: {e}")
            return None

    def run_scraping(self, max_books=10):
        """Əsas scraping prosesi"""
        try:
            print("🚀 E-dərslik scraping başladı...")
            
            # Giriş (əgər lazımdırsa)
            # self.login("username", "password")
            
            # Dərslikləri əldə et
            books = self.get_books()
            
            if not books:
                print("❌ Heç bir dərslik tapılmadı")
                return
            
            print(f"📚 {len(books)} dərslik tapıldı, {min(max_books, len(books))} dərslik yüklənəcək")
            
            # Dərslikləri yüklə
            successful_downloads = 0
            for i, book in enumerate(books[:max_books]):
                print(f"\n📖 {i+1}/{min(max_books, len(books))}: {book['title']}")
                if self.download_book(book):
                    successful_downloads += 1
                time.sleep(2)  # Rate limiting
            
            print(f"\n✅ Scraping tamamlandı!")
            print(f"📊 Uğurlu yükləmə: {successful_downloads}/{min(max_books, len(books))}")
            
            # ZIP arxivi yarat
            self.create_zip_archive()
            
        except Exception as e:
            print(f"❌ Scraping xətası: {e}")
        
        finally:
            self.driver.quit()
            print("🔚 WebDriver bağlandı")

def main():
    """Əsas funksiya"""
    scraper = EDerslikScraper()
    scraper.run_scraping(max_books=5)  # İlk 5 dərslik

if __name__ == "__main__":
    main()
