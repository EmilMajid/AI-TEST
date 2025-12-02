import asyncio
import logging
from contextlib import asynccontextmanager
from typing import Optional

from fastapi import FastAPI, BackgroundTasks
from pydantic import BaseModel
from dotenv import load_dotenv
import os

from pdf_processor import process_pdf_and_upsert

load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


class EnqueueRequest(BaseModel):
    document_id: str
    storage_path: str
    user_id: str


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Worker service starting...")
    yield
    logger.info("Worker service shutting down...")


app = FastAPI(title="Azerbaijan AI Platform - RAG Worker", lifespan=lifespan)


@app.post("/enqueue")
async def enqueue_document(request: EnqueueRequest, background_tasks: BackgroundTasks):
    """
    Enqueue a document for RAG processing.
    The document will be downloaded from Supabase Storage,
    processed into chunks, and embeddings will be generated.
    """
    try:
        logger.info(f"Enqueueing document {request.document_id}")
        
        # Add background task to process document
        background_tasks.add_task(
            process_pdf_and_upsert,
            document_id=request.document_id,
            storage_path=request.storage_path,
            user_id=request.user_id
        )
        
        return {
            "success": True,
            "message": f"Document {request.document_id} queued for processing"
        }
    except Exception as e:
        logger.error(f"Failed to enqueue document: {e}")
        return {
            "success": False,
            "error": str(e)
        }, 500


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "rag-worker"
    }


if __name__ == "__main__":
    import uvicorn
    
    port = int(os.getenv("WORKER_PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
