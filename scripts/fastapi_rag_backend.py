"""
FastAPI RAG Backend - RAG əsaslı test generasiya serveri
"""
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import os
import tempfile
from pathlib import Path

# Import RAG components
from rag_system import RAGSystem
from rag_content_extractor import ContentExtractor
from rag_vectorizer import VectorIndexer

app = FastAPI(
    title="EduTest RAG API",
    description="RAG əsaslı test generasiya sistemi",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize RAG system
rag_system = RAGSystem()
content_extractor = ContentExtractor()
vector_indexer = VectorIndexer()

class SearchRequest(BaseModel):
    query: str
    grade: int
    subject: str
    k: int = 5

class SearchResult(BaseModel):
    text: str
    score: float
    source: str
    page: int
    grade: int
    subject: str

class SearchResponse(BaseModel):
    success: bool
    results: List[SearchResult]
    context: str

@app.get("/")
async def root():
    return {
        "service": "EduTest RAG API",
        "status": "running",
        "rag_loaded": rag_system.index is not None,
        "vectors_count": rag_system.index.ntotal if rag_system.index else 0
    }

@app.post("/api/rag/ingest")
async def ingest_textbook(
    file: UploadFile = File(...),
    grade: int = Form(...),
    subject: str = Form(...)
):
    """Dərsliyi yükləyib RAG sisteminə əlavə edir"""
    
    try:
        # Validate file
        if not file.filename.endswith('.pdf'):
            raise HTTPException(400, "Only PDF files are supported")
        
        # Save uploaded file temporarily
        with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as tmp_file:
            content = await file.read()
            tmp_file.write(content)
            tmp_path = tmp_file.name
        
        try:
            # Extract content
            output_path = content_extractor.process_textbook(
                tmp_path, 
                grade, 
                subject
            )
            
            # Update vector index
            vector_indexer.load_index()
            vector_indexer.create_index()
            
            # Reload RAG system
            rag_system.load_index()
            
            return {
                "success": True,
                "message": "Textbook ingested successfully",
                "file": file.filename,
                "grade": grade,
                "subject": subject,
                "output": output_path,
                "total_vectors": rag_system.index.ntotal if rag_system.index else 0
            }
            
        finally:
            # Clean up temp file
            os.unlink(tmp_path)
            
    except Exception as e:
        raise HTTPException(500, f"Ingestion failed: {str(e)}")

@app.post("/api/rag/search", response_model=SearchResponse)
async def search_context(request: SearchRequest):
    """RAG sistemində kontekst axtarır"""
    
    try:
        # Search in RAG system
        results = rag_system.retrieve_context(
            query=request.query,
            grade=request.grade,
            subject=request.subject,
            k=request.k
        )
        
        # Get detailed results
        detailed_results = []
        if hasattr(rag_system, 'search'):
            detailed_results = rag_system.search(
                request.query,
                request.grade,
                request.subject,
                request.k
            )
        
        return SearchResponse(
            success=True,
            results=[
                SearchResult(
                    text=r["text"],
                    score=r["score"],
                    source=r["source"],
                    page=r["page"],
                    grade=r["grade"],
                    subject=r["subject"]
                )
                for r in detailed_results
            ],
            context=results if isinstance(results, str) else ""
        )
        
    except Exception as e:
        raise HTTPException(500, f"Search failed: {str(e)}")

@app.get("/api/rag/stats")
async def get_rag_stats():
    """RAG sistem statistikasını qaytarır"""
    
    try:
        stats = {
            "system_loaded": rag_system.index is not None,
            "total_vectors": rag_system.index.ntotal if rag_system.index else 0,
            "total_metadata": len(rag_system.metadata),
            "model": "paraphrase-multilingual-MiniLM-L12-v2",
            "index_type": "FAISS IndexFlatIP"
        }
        
        # Get grade and subject distribution
        if rag_system.metadata:
            grades = {}
            subjects = {}
            
            for meta in rag_system.metadata:
                grade = meta.get("grade", "unknown")
                subject = meta.get("subject", "unknown")
                
                grades[grade] = grades.get(grade, 0) + 1
                subjects[subject] = subjects.get(subject, 0) + 1
            
            stats["grades"] = grades
            stats["subjects"] = subjects
        
        return stats
        
    except Exception as e:
        return {
            "error": str(e),
            "system_loaded": False
        }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
