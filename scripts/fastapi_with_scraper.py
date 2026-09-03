from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import List, Dict, Optional
import sqlite3
import json
import os
from datetime import datetime
import uvicorn
from e_derslik_scraper import EDerslikScraper

app = FastAPI(title="TESTAI.AZ API with Scraper", version="1.1.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create directories
os.makedirs("static/uploads", exist_ok=True)
os.makedirs("static/uploads/e_derslikler", exist_ok=True)

# Mount static files
app.mount("/static", StaticFiles(directory="static"), name="static")

# Global scraper status
scraper_status = {
    "is_running": False,
    "progress": 0,
    "message": "Hazır",
    "last_run": None,
    "books_found": 0,
    "books_downloaded": 0
}

class ScrapingRequest(BaseModel):
    max_books: Optional[int] = 5
    username: Optional[str] = None
    password: Optional[str] = None

class ScrapingStatus(BaseModel):
    is_running: bool
    progress: int
    message: str
    last_run: Optional[str]
    books_found: int
    books_downloaded: int

def get_db_connection():
    conn = sqlite3.connect('testai.az.db')
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    """Verilənlər bazasını başlat"""
    conn = sqlite3.connect('testai.az.db')
    cursor = conn.cursor()
    
    # Scraping logs table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS scraping_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            completed_at TIMESTAMP,
            books_found INTEGER DEFAULT 0,
            books_downloaded INTEGER DEFAULT 0,
            status TEXT DEFAULT 'running',
            error_message TEXT
        )
    ''')
    
    # Textbooks table (əgər yoxdursa)
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS textbooks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            subject TEXT NOT NULL,
            class TEXT NOT NULL,
            file_path TEXT NOT NULL,
            file_size INTEGER,
            upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            topics TEXT,
            is_active BOOLEAN DEFAULT TRUE,
            source TEXT DEFAULT 'manual'
        )
    ''')
    
    conn.commit()
    conn.close()

# Initialize database
init_db()

async def run_scraping_task(request: ScrapingRequest):
    """Background scraping task"""
    global scraper_status
    
    try:
        scraper_status.update({
            "is_running": True,
            "progress": 0,
            "message": "Scraping başladı...",
            "books_found": 0,
            "books_downloaded": 0
        })
        
        # Log başlat
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("INSERT INTO scraping_logs (started_at) VALUES (?)", (datetime.now(),))
        log_id = cursor.lastrowid
        conn.commit()
        conn.close()
        
        # Scraper yaradıb işə sal
        scraper = EDerslikScraper()
        
        # Custom progress callback
        def update_progress(current, total, message):
            scraper_status.update({
                "progress": int((current / total) * 100) if total > 0 else 0,
                "message": message,
                "books_found": total,
                "books_downloaded": current
            })
        
        # Scraping işlədi
        scraper_status["message"] = "Dərslik siyahısı əldə edilir..."
        books = scraper.get_books()
        
        scraper_status.update({
            "books_found": len(books),
            "message": f"{len(books)} dərslik tapıldı, yüklənir..."
        })
        
        successful_downloads = 0
        max_books = min(request.max_books, len(books))
        
        for i, book in enumerate(books[:max_books]):
            scraper_status.update({
                "progress": int((i / max_books) * 100),
                "message": f"Yüklənir: {book['title']}"
            })
            
            if scraper.download_book(book):
                successful_downloads += 1
            
            scraper_status["books_downloaded"] = successful_downloads
        
        # ZIP arxivi yarat
        scraper_status["message"] = "ZIP arxivi yaradılır..."
        scraper.create_zip_archive()
        
        # Log tamamla
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('''
            UPDATE scraping_logs 
            SET completed_at = ?, books_found = ?, books_downloaded = ?, status = 'completed'
            WHERE id = ?
        ''', (datetime.now(), len(books), successful_downloads, log_id))
        conn.commit()
        conn.close()
        
        scraper_status.update({
            "is_running": False,
            "progress": 100,
            "message": f"Tamamlandı! {successful_downloads}/{max_books} dərslik yükləndi",
            "last_run": datetime.now().isoformat()
        })
        
    except Exception as e:
        # Xəta loqu
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('''
            UPDATE scraping_logs 
            SET completed_at = ?, status = 'error', error_message = ?
            WHERE id = ?
        ''', (datetime.now(), str(e), log_id))
        conn.commit()
        conn.close()
        
        scraper_status.update({
            "is_running": False,
            "message": f"Xəta: {str(e)}",
            "last_run": datetime.now().isoformat()
        })

@app.get("/")
async def root():
    return {
        "message": "TESTAI.AZ API with E-dərslik Scraper",
        "version": "1.1.0",
        "features": ["textbook_management", "web_scraping", "auto_download"]
    }

@app.post("/api/scraping/start")
async def start_scraping(request: ScrapingRequest, background_tasks: BackgroundTasks):
    """E-dərslik scraping başlat"""
    if scraper_status["is_running"]:
        raise HTTPException(status_code=400, detail="Scraping artıq işləyir")
    
    background_tasks.add_task(run_scraping_task, request)
    
    return {
        "success": True,
        "message": "Scraping başladıldı",
        "max_books": request.max_books
    }

@app.get("/api/scraping/status", response_model=ScrapingStatus)
async def get_scraping_status():
    """Scraping statusunu əldə et"""
    return ScrapingStatus(**scraper_status)

@app.get("/api/scraping/logs")
async def get_scraping_logs():
    """Scraping tarixçəsini əldə et"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT * FROM scraping_logs 
            ORDER BY started_at DESC 
            LIMIT 10
        ''')
        
        logs = cursor.fetchall()
        conn.close()
        
        return {
            "success": True,
            "logs": [
                {
                    "id": log["id"],
                    "started_at": log["started_at"],
                    "completed_at": log["completed_at"],
                    "books_found": log["books_found"],
                    "books_downloaded": log["books_downloaded"],
                    "status": log["status"],
                    "error_message": log["error_message"]
                }
                for log in logs
            ]
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Log əldə edilərkən xəta: {str(e)}")

@app.get("/api/textbooks")
async def get_textbooks(class_filter: Optional[str] = None, source_filter: Optional[str] = None):
    """Dərsliklərin siyahısını əldə et"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        query = "SELECT * FROM textbooks WHERE is_active = TRUE"
        params = []
        
        if class_filter:
            query += " AND class = ?"
            params.append(class_filter)
            
        if source_filter:
            query += " AND source = ?"
            params.append(source_filter)
            
        query += " ORDER BY source, subject, class, name"
        
        cursor.execute(query, params)
        textbooks = cursor.fetchall()
        conn.close()
        
        result = []
        for textbook in textbooks:
            topics = json.loads(textbook['topics']) if textbook['topics'] else []
            result.append({
                "id": textbook['id'],
                "name": textbook['name'],
                "subject": textbook['subject'],
                "class": textbook['class'],
                "file_path": textbook['file_path'],
                "topics": topics,
                "upload_date": textbook['upload_date'],
                "source": textbook.get('source', 'manual')
            })
        
        return {
            "success": True,
            "textbooks": result,
            "total": len(result)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Dərslikləri əldə edərkən xəta: {str(e)}")

if __name__ == "__main__":
    print("🚀 TESTAI.AZ API with Scraper başladılır...")
    print("🕷️ Web scraping funksiyası aktiv")
    print("📚 E-dərslik.edu.az inteqrasiyası hazır")
    print("🔗 API Documentation: http://localhost:8000/docs")
    uvicorn.run(app, host="0.0.0.0", port=8000)
