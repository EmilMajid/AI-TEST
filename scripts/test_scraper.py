#!/usr/bin/env python3
"""
E-dərslik scraper test skripti
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from e_derslik_scraper import EDerslikScraper

def test_scraper():
    """Scraper-i test et"""
    print("🧪 E-dərslik Scraper Test")
    print("=" * 40)
    
    try:
        # Scraper yaradıb test et
        scraper = EDerslikScraper()
        
        print("✅ WebDriver uğurla başladıldı")
        
        # Dərslik siyahısını əldə et
        print("📚 Dərslik siyahısı əldə edilir...")
        books = scraper.get_books()
        
        print(f"📊 Tapılan dərslik sayı: {len(books)}")
        
        if books:
            print("\n📖 İlk 3 dərslik:")
            for i, book in enumerate(books[:3]):
                print(f"{i+1}. {book['title']} ({book['subject']}, {book['class']}-ci sinif)")
        
        # Test yükləmə (ilk dərslik)
        if books:
            print(f"\n⬇️ Test yükləmə: {books[0]['title']}")
            success = scraper.download_book(books[0])
            print(f"{'✅' if success else '❌'} Yükləmə {'uğurlu' if success else 'uğursuz'}")
        
        scraper.driver.quit()
        print("\n✅ Test tamamlandı!")
        
    except Exception as e:
        print(f"❌ Test xətası: {e}")
        return False
    
    return True

if __name__ == "__main__":
    test_scraper()
