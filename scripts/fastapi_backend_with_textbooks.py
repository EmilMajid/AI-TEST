from fastapi import FastAPI, HTTPException, Depends, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, EmailStr, validator
from typing import List, Dict, Optional
import bcrypt
import sqlite3
import json
import os
import zipfile
import shutil
from datetime import datetime
import uvicorn
from pathlib import Path

app = FastAPI(title="EduTest AZ API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Next.js development server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create directories
os.makedirs("static/uploads", exist_ok=True)
os.makedirs("static/textbooks", exist_ok=True)

# Mount static files
app.mount("/static", StaticFiles(directory="static"), name="static")

# Database setup
def init_db():
    conn = sqlite3.connect('edutest.db')
    cursor = conn.cursor()
    
    # Users table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            first_name TEXT NOT NULL,
            last_name TEXT NOT NULL,
            father_name TEXT NOT NULL,
            region TEXT NOT NULL,
            school TEXT NOT NULL,
            class TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Test results table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS test_results (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            textbook TEXT NOT NULL,
            topic TEXT NOT NULL,
            class TEXT NOT NULL,
            questions TEXT NOT NULL,  -- JSON string
            answers TEXT NOT NULL,    -- JSON string
            score INTEGER NOT NULL,
            time_spent INTEGER NOT NULL,
            completed_at TIMESTAMP NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    ''')
    
    # Textbooks table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS textbooks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            subject TEXT NOT NULL,
            class TEXT NOT NULL,
            file_path TEXT NOT NULL,
            file_size INTEGER,
            upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            topics TEXT,  -- JSON string of topics
            is_active BOOLEAN DEFAULT TRUE
        )
    ''')
    
    conn.commit()
    conn.close()

# Initialize database and add default textbooks
def init_default_textbooks():
    conn = sqlite3.connect('edutest.db')
    cursor = conn.cursor()
    
    # Check if textbooks already exist
    cursor.execute("SELECT COUNT(*) FROM textbooks")
    count = cursor.fetchone()[0]
    
    if count == 0:
        # Add default textbooks
        default_textbooks = [
            {
                "name": "Azərbaycan dili",
                "subject": "Azərbaycan dili",
                "class": "7",
                "file_path": "static/textbooks/azerbaycan-dili-7.pdf",
                "topics": json.dumps([
                    "Fel", "Felin zamanları", "Felin şəxs və ədəd formaları", 
                    "Zərf", "Cümlə quruluşu", "Nitq hissələri"
                ])
            },
            {
                "name": "Riyaziyyat",
                "subject": "Riyaziyyat", 
                "class": "7",
                "file_path": "static/textbooks/riyaziyyat-7.pdf",
                "topics": json.dumps([
                    "Cəbri ifadələr", "Tənliklər sistemi", "Funksiya", 
                    "Həndəsə", "Koordinat sistemi", "Proporsiya"
                ])
            },
            {
                "name": "Fizika 7 (1-ci hissə)",
                "subject": "Fizika",
                "class": "7", 
                "file_path": "static/uploads/Fizika-7-1-ci-hisse.zip",
                "topics": json.dumps([
                    "Mexanika", "Qüvvə və hərəkət", "İş və enerji", 
                    "Sadə mexanizmlər", "Təzyiq", "Arximed qanunu"
                ])
            }
        ]
        
        for textbook in default_textbooks:
            cursor.execute('''
                INSERT INTO textbooks (name, subject, class, file_path, topics)
                VALUES (?, ?, ?, ?, ?)
            ''', (
                textbook["name"],
                textbook["subject"], 
                textbook["class"],
                textbook["file_path"],
                textbook["topics"]
            ))
    
    conn.commit()
    conn.close()

# Initialize database
init_db()
init_default_textbooks()

# Pydantic models
class UserRegistration(BaseModel):
    firstName: str
    lastName: str
    fatherName: str
    region: str
    school: str
    class_: str = None
    email: EmailStr
    password: str
    confirmPassword: str
    
    @validator('firstName', 'lastName', 'fatherName')
    def validate_names(cls, v):
        if len(v) < 2:
            raise ValueError('Ad ən azı 2 hərf olmalıdır')
        if len(v) > 50:
            raise ValueError('Ad 50 hərfdən çox ola bilməz')
        return v
    
    @validator('password')
    def validate_password(cls, v):
        if len(v) < 6:
            raise ValueError('Şifrə ən azı 6 simvol olmalıdır')
        return v
    
    @validator('confirmPassword')
    def passwords_match(cls, v, values):
        if 'password' in values and v != values['password']:
            raise ValueError('Şifrələr uyğun gəlmir')
        return v

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class TextbookResponse(BaseModel):
    id: int
    name: str
    subject: str
    class_: str = None
    file_path: str
    topics: List[str]
    upload_date: str

class TestData(BaseModel):
    textbook: str
    topic: str
    class_: str = None

class Question(BaseModel):
    id: int
    question: str
    options: List[str]
    correctAnswer: int
    explanation: str

class TestResults(BaseModel):
    userId: Optional[int] = None
    testData: TestData
    questions: List[Question]
    answers: Dict[str, int]
    score: int
    timeSpent: int
    completedAt: str

# Database helper functions
def get_db_connection():
    conn = sqlite3.connect('edutest.db')
    conn.row_factory = sqlite3.Row
    return conn

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

# API endpoints
@app.get("/")
async def root():
    return {"message": "EduTest AZ API is running!", "version": "1.0.0"}

@app.post("/api/auth/register")
async def register_user(user_data: UserRegistration):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Check if email already exists
        cursor.execute("SELECT id FROM users WHERE email = ?", (user_data.email,))
        if cursor.fetchone():
            raise HTTPException(status_code=400, detail="Bu email artıq qeydiyyatdan keçib")
        
        # Hash password
        password_hash = hash_password(user_data.password)
        
        # Insert user
        cursor.execute('''
            INSERT INTO users (first_name, last_name, father_name, region, school, class, email, password_hash)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            user_data.firstName,
            user_data.lastName,
            user_data.fatherName,
            user_data.region,
            user_data.school,
            user_data.class_ or getattr(user_data, 'class', ''),
            user_data.email,
            password_hash
        ))
        
        user_id = cursor.lastrowid
        conn.commit()
        conn.close()
        
        return {
            "success": True,
            "message": "İstifadəçi uğurla yaradıldı",
            "user": {
                "id": user_id,
                "firstName": user_data.firstName,
                "lastName": user_data.lastName,
                "email": user_data.email
            }
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Qeydiyyat zamanı xəta: {str(e)}")

@app.post("/api/auth/login")
async def login_user(login_data: UserLogin):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Find user
        cursor.execute("SELECT * FROM users WHERE email = ?", (login_data.email,))
        user = cursor.fetchone()
        
        if not user or not verify_password(login_data.password, user['password_hash']):
            raise HTTPException(status_code=401, detail="Email və ya şifrə səhvdir")
        
        conn.close()
        
        return {
            "success": True,
            "message": "Uğurlu giriş",
            "user": {
                "id": user['id'],
                "firstName": user['first_name'],
                "lastName": user['last_name'],
                "fatherName": user['father_name'],
                "region": user['region'],
                "school": user['school'],
                "class": user['class'],
                "email": user['email']
            }
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Giriş zamanı xəta: {str(e)}")

@app.get("/api/textbooks")
async def get_textbooks(class_filter: Optional[str] = None, subject_filter: Optional[str] = None):
    """Dərsliklərin siyahısını əldə et"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        query = "SELECT * FROM textbooks WHERE is_active = TRUE"
        params = []
        
        if class_filter:
            query += " AND class = ?"
            params.append(class_filter)
            
        if subject_filter:
            query += " AND subject = ?"
            params.append(subject_filter)
            
        query += " ORDER BY subject, class, name"
        
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
                "upload_date": textbook['upload_date']
            })
        
        return {
            "success": True,
            "textbooks": result
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Dərslikləri əldə edərkən xəta: {str(e)}")

@app.get("/api/textbooks/{textbook_id}")
async def get_textbook_details(textbook_id: int):
    """Konkret dərsliyin təfsilatlı məlumatları"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute("SELECT * FROM textbooks WHERE id = ? AND is_active = TRUE", (textbook_id,))
        textbook = cursor.fetchone()
        conn.close()
        
        if not textbook:
            raise HTTPException(status_code=404, detail="Dərslik tapılmadı")
        
        topics = json.loads(textbook['topics']) if textbook['topics'] else []
        
        return {
            "success": True,
            "textbook": {
                "id": textbook['id'],
                "name": textbook['name'],
                "subject": textbook['subject'],
                "class": textbook['class'],
                "file_path": textbook['file_path'],
                "file_size": textbook['file_size'],
                "topics": topics,
                "upload_date": textbook['upload_date']
            }
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Dərslik məlumatları əldə edərkən xəta: {str(e)}")

@app.post("/api/textbooks/upload")
async def upload_textbook(
    file: UploadFile = File(...),
    name: str = None,
    subject: str = None,
    class_: str = None,
    topics: str = None
):
    """Yeni dərslik yüklə"""
    try:
        # File validation
        if not file.filename.endswith(('.pdf', '.zip', '.docx')):
            raise HTTPException(status_code=400, detail="Yalnız PDF, ZIP və DOCX faylları qəbul edilir")
        
        # Create file path
        file_path = f"static/uploads/{file.filename}"
        
        # Save file
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Get file size
        file_size = os.path.getsize(file_path)
        
        # Parse topics
        topics_list = json.loads(topics) if topics else []
        
        # Save to database
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO textbooks (name, subject, class, file_path, file_size, topics)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', (
            name or file.filename,
            subject or "Ümumi",
            class_ or "7",
            file_path,
            file_size,
            json.dumps(topics_list)
        ))
        
        textbook_id = cursor.lastrowid
        conn.commit()
        conn.close()
        
        return {
            "success": True,
            "message": "Dərslik uğurla yükləndi",
            "textbook_id": textbook_id,
            "file_path": file_path
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Dərslik yükləməkdə xəta: {str(e)}")

@app.post("/api/save-results")
async def save_test_results(results: TestResults):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Insert test results
        cursor.execute('''
            INSERT INTO test_results (user_id, textbook, topic, class, questions, answers, score, time_spent, completed_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            results.userId,
            results.testData.textbook,
            results.testData.topic,
            results.testData.class_ or getattr(results.testData, 'class', ''),
            json.dumps([q.dict() for q in results.questions]),
            json.dumps(results.answers),
            results.score,
            results.timeSpent,
            results.completedAt
        ))
        
        result_id = cursor.lastrowid
        conn.commit()
        conn.close()
        
        return {
            "success": True,
            "message": "Test nəticəsi uğurla saxlanıldı",
            "resultId": result_id,
            "savedAt": datetime.now().isoformat()
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Test nəticəsi saxlanılarkən xəta: {str(e)}")

@app.get("/api/test-results")
async def get_test_results(user_id: Optional[int] = None):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        if user_id:
            cursor.execute("SELECT * FROM test_results WHERE user_id = ? ORDER BY created_at DESC", (user_id,))
        else:
            cursor.execute("SELECT * FROM test_results ORDER BY created_at DESC")
        
        results = cursor.fetchall()
        conn.close()
        
        return {
            "success": True,
            "results": [
                {
                    "id": row['id'],
                    "userId": row['user_id'],
                    "textbook": row['textbook'],
                    "topic": row['topic'],
                    "class": row['class'],
                    "score": row['score'],
                    "timeSpent": row['time_spent'],
                    "completedAt": row['completed_at'],
                    "createdAt": row['created_at']
                }
                for row in results
            ]
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Test nəticələri əldə edilərkən xəta: {str(e)}")

if __name__ == "__main__":
    print("🚀 EduTest AZ API başladılır...")
    print("📚 Dərslik sistemi aktiv")
    print("🔗 API Documentation: http://localhost:8000/docs")
    uvicorn.run(app, host="0.0.0.0", port=8000)
