import os
import shutil
import sqlite3
import json

def setup_fizika_textbook():
    """Fizika 7 (1-ci hissə) dərsliyini sisteme əlavə et"""
    
    # Create directories if they don't exist
    os.makedirs("static/uploads", exist_ok=True)
    
    # Check if the ZIP file exists
    zip_file_path = "static/uploads/Fizika-7-1-ci-hisse.zip"
    
    if not os.path.exists(zip_file_path):
        print(f"⚠️  {zip_file_path} faylı tapılmadı!")
        print("Zəhmət olmasa Fizika 7 (1-ci hissə).zip faylını static/uploads/ qovluğuna yerləşdirin.")
        return False
    
    # Connect to database
    conn = sqlite3.connect('edutest.db')
    cursor = conn.cursor()
    
    # Check if textbook already exists
    cursor.execute("SELECT id FROM textbooks WHERE name = ?", ("Fizika 7 (1-ci hissə)",))
    existing = cursor.fetchone()
    
    if existing:
        print("✅ Fizika 7 (1-ci hissə) dərsliyi artıq mövcuddur.")
        conn.close()
        return True
    
    # Add textbook to database
    fizika_topics = [
        "Mexanika əsasları",
        "Qüvvə və hərəkət",
        "İş və enerji",
        "Sadə mexanizmlər",
        "Təzyiq və onun ölçülməsi", 
        "Arximed qanunu",
        "Mayelərdə və qazlarda təzyiq",
        "Atmosfer təzyiqi",
        "Hidravlik maşınlar",
        "Mexaniki rəqslər"
    ]
    
    file_size = os.path.getsize(zip_file_path)
    
    cursor.execute('''
        INSERT INTO textbooks (name, subject, class, file_path, file_size, topics, is_active)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    ''', (
        "Fizika 7 (1-ci hissə)",
        "Fizika",
        "7",
        zip_file_path,
        file_size,
        json.dumps(fizika_topics),
        True
    ))
    
    conn.commit()
    conn.close()
    
    print("✅ Fizika 7 (1-ci hissə) dərsliyi uğurla əlavə edildi!")
    print(f"📁 Fayl yolu: {zip_file_path}")
    print(f"📊 Fayl ölçüsü: {file_size / 1024 / 1024:.2f} MB")
    print(f"📚 Mövzu sayı: {len(fizika_topics)}")
    
    return True

def list_textbooks():
    """Mövcud dərslikləri göstər"""
    conn = sqlite3.connect('edutest.db')
    cursor = conn.cursor()
    
    cursor.execute("SELECT * FROM textbooks WHERE is_active = TRUE ORDER BY subject, class")
    textbooks = cursor.fetchall()
    
    if not textbooks:
        print("📚 Heç bir dərslik tapılmadı.")
        return
    
    print("\n📚 Mövcud dərsliklər:")
    print("-" * 60)
    
    for textbook in textbooks:
        topics = json.loads(textbook[7]) if textbook[7] else []
        print(f"ID: {textbook[0]}")
        print(f"Ad: {textbook[1]}")
        print(f"Fənn: {textbook[2]}")
        print(f"Sinif: {textbook[3]}")
        print(f"Fayl: {textbook[4]}")
        print(f"Mövzu sayı: {len(topics)}")
        print("-" * 60)
    
    conn.close()

if __name__ == "__main__":
    print("🚀 Dərslik quraşdırma skripti")
    print("=" * 40)
    
    # Setup Fizika textbook
    setup_fizika_textbook()
    
    # List all textbooks
    list_textbooks()
    
    print("\n✅ Quraşdırma tamamlandı!")
    print("💡 FastAPI serveri başlatmaq üçün: python scripts/fastapi_backend_with_textbooks.py")
