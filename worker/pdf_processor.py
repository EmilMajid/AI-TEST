import logging
import os
from io import BytesIO
from typing import List, Optional

import pdfplumber
from dotenv import load_dotenv
from supabase import create_client
from sentence_transformers import SentenceTransformer
from langchain.text_splitter import RecursiveCharacterTextSplitter

load_dotenv()

logger = logging.getLogger(__name__)

# Initialize Supabase client
supabase_url = os.getenv("SUPABASE_URL") or os.getenv("NEXT_PUBLIC_SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

if not supabase_url or not supabase_key:
    raise ValueError("Missing Supabase configuration")

supabase = create_client(supabase_url, supabase_key)

# Initialize embedding model
try:
    # Use local sentence-transformers model for better performance
    embedding_model = SentenceTransformer('all-MiniLM-L6-v2')
    use_local_embeddings = True
    logger.info("Using local sentence-transformers for embeddings")
except Exception as e:
    logger.warning(f"Local embeddings not available: {e}. Falling back to OpenAI.")
    use_local_embeddings = False


def extract_text_from_pdf(pdf_bytes: bytes) -> str:
    """Extract text from PDF file using pdfplumber for better accuracy"""
    try:
        text = ""
        with pdfplumber.open(BytesIO(pdf_bytes)) as pdf:
            for page in pdf.pages:
                # Extract text with layout preservation
                page_text = page.extract_text(x_tolerance=1, y_tolerance=1)
                if page_text:
                    text += page_text + "\n"
                    
                # Optional: Extract tables if needed
                # tables = page.extract_tables()
                # for table in tables:
                #     for row in table:
                #         text += " | ".join([str(cell) for cell in row if cell]) + "\n"
                        
        return text
    except Exception as e:
        logger.error(f"Failed to extract text from PDF: {e}")
        raise


def chunk_text(text: str, chunk_size: int = 1000, chunk_overlap: int = 200) -> List[str]:
    """
    Split text into chunks using RecursiveCharacterTextSplitter
    """
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=chunk_size,
        chunk_overlap=chunk_overlap,
        separators=["\n\n", "\n", ". ", " ", ""]
    )
    return splitter.split_text(text)


def generate_embeddings(texts: List[str]) -> List[List[float]]:
    """
    Generate embeddings for texts using local model or OpenAI fallback
    """
    if use_local_embeddings:
        # Use local sentence-transformers model
        embeddings = embedding_model.encode(texts, convert_to_numpy=False)
        return [emb.tolist() if hasattr(emb, 'tolist') else list(emb) for emb in embeddings]
    else:
        # Fallback to OpenAI
        import openai
        
        openai_key = os.getenv("OPENAI_API_KEY")
        if not openai_key:
            raise ValueError("OpenAI API key not configured")
        
        client = openai.OpenAI(api_key=openai_key)
        model = os.getenv("OPENAI_EMBED_MODEL", "text-embedding-3-small")
        
        response = client.embeddings.create(
            input=texts,
            model=model
        )
        
        return [item.embedding for item in response.data]


async def process_pdf_and_upsert(
    document_id: str,
    storage_path: str,
    user_id: str
) -> None:
    """
    Download PDF from Supabase Storage, extract text, chunk it,
    generate embeddings, and upsert to rag_chunks table.
    """
    try:
        logger.info(f"Processing document {document_id}")
        
        # Download file from Supabase Storage
        response = supabase.storage.from_('textbooks').download(storage_path)
        
        if not response:
            raise ValueError("Failed to download file from storage")
        
        # Extract text from PDF
        logger.info(f"Extracting text from PDF: {storage_path}")
        text = extract_text_from_pdf(response)
        
        # Chunk the text
        logger.info(f"Chunking text for document {document_id}")
        chunks = chunk_text(text, chunk_size=1000, chunk_overlap=200)
        
        # Generate embeddings
        logger.info(f"Generating embeddings for {len(chunks)} chunks")
        embeddings = generate_embeddings(chunks)
        
        # Prepare records for upsert
        records = [
            {
                "document_id": document_id,
                "chunk_index": idx,
                "chunk_text": chunk,
                "embedding": embedding,
                "metadata": {
                    "source": storage_path,
                    "chunk_size": len(chunk)
                }
            }
            for idx, (chunk, embedding) in enumerate(zip(chunks, embeddings))
        ]
        
        # Upsert to rag_chunks table
        logger.info(f"Upserting {len(records)} chunks to database")
        response = supabase.table('rag_chunks').upsert(records).execute()
        
        logger.info(f"Successfully processed document {document_id}: {len(records)} chunks")
        
        # Update document status
        supabase.table('rag_documents').update({
            'metadata': {
                'storage_path': storage_path,
                'chunks_count': len(records),
                'processed': True,
                'processed_at': 'now()'
            }
        }).eq('id', document_id).execute()
        
    except Exception as e:
        logger.error(f"Failed to process document {document_id}: {e}")
        # Log error to database
        try:
            supabase.table('platform_logs').insert({
                'log_level': 'ERROR',
                'message': f'Document processing failed: {str(e)}',
                'context': {
                    'document_id': document_id,
                    'storage_path': storage_path
                }
            }).execute()
        except Exception as log_err:
            logger.error(f"Failed to log error: {log_err}")
