# Azerbaijan AI Platform - RAG Worker Service

FastAPI background worker service for processing PDF documents and generating embeddings for the RAG system.

## Installation

\`\`\`bash
cd worker
pip install -r requirements.txt
\`\`\`

## Configuration

Create a `.env` file in the worker directory with:

\`\`\`
SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
OPENAI_API_KEY=your-openai-key
OPENAI_EMBED_MODEL=text-embedding-3-small
WORKER_PORT=8000
\`\`\`

## Running the Worker

\`\`\`bash
python app.py
\`\`\`

Or with uvicorn directly:

\`\`\`bash
uvicorn app:app --host 0.0.0.0 --port 8000 --reload
\`\`\`

## API Endpoints

### POST /enqueue
Enqueue a document for processing.

\`\`\`bash
curl -X POST http://localhost:8000/enqueue \
  -H "Content-Type: application/json" \
  -d '{
    "document_id": "uuid",
    "storage_path": "user-id/timestamp-filename.pdf",
    "user_id": "user-uuid"
  }'
\`\`\`

### GET /health
Health check endpoint.

\`\`\`bash
curl http://localhost:8000/health
\`\`\`

## How It Works

1. Receives a document processing job via `/enqueue`
2. Downloads the PDF from Supabase Storage
3. Extracts text using PyPDF2
4. Chunks text with RecursiveCharacterTextSplitter (1000 chars, 200 overlap)
5. Generates embeddings using sentence-transformers (local) or OpenAI (fallback)
6. Stores chunks with embeddings in `rag_chunks` table
7. Updates document metadata with processing status

## Performance Notes

- Local sentence-transformers model (all-MiniLM-L6-v2) generates 384-dim embeddings and is fast (~100 docs/sec)
- OpenAI embeddings are 1536-dim and cost money but are more accurate
- Worker processes one document at a time; for large batches, consider queuing system
