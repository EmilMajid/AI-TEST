from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr, validator
from typing import List, Dict, Optional
import bcrypt
import sqlite3
import json
from datetime import datetime
import uvicorn

app = FastAPI(title="TESTAI.AZ API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Next.js development server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database setup
def init_db():
    conn = sqlite3.connect('testai.az.db')
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
    
    conn.commit()
    conn.close()

# Initialize database
init_db()

# Pydantic models
class UserRegistration(BaseModel):
    firstName: str
    lastName: str
    fatherName: str
    region: str
    school: str
    class_: str = None  # Will be mapped from 'class'
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

class TestData(BaseModel):
    textbook: str
    topic: str
    class_: str = None  # Will be mapped from 'class'

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
    conn = sqlite3.connect('testai.az.db')
    conn.row_factory = sqlite3.Row
    return conn

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

# API endpoints
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

@app.get("/")
async def root():
    return {"message": "TESTAI.AZ API is running!"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
