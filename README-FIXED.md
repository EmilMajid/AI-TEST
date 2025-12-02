# Azerbaijan AI Platform - Production Setup Guide

Complete instructions for setting up and deploying the refactored platform.

## Prerequisites

- Node.js 18+ and npm
- Python 3.9+ (for worker service)
- Supabase account with project created
- GitHub account (for CI/CD)

## Step 1: Supabase Setup

### 1.1 Create Database Tables

In Supabase SQL Editor, run the migration scripts in order:

\`\`\`bash
# Run scripts in your Supabase SQL editor
# 1. scripts/001_init.sql - Extensions
# 2. scripts/002_create_rag_tables.sql - RAG tables
# 3. scripts/003_finalize_schema.sql - Settings & logs
# 4. scripts/004_add_watermark_config.sql - Branding config
\`\`\`

### 1.2 Create Storage Bucket

In Supabase Storage:
1. Click "New Bucket"
2. Name it `textbooks`
3. Make it private (authenticated access only)

### 1.3 Get Credentials

From your Supabase project settings:
- Copy Project URL → `NEXT_PUBLIC_SUPABASE_URL`
- Copy Anon Key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Copy Service Role Key → `SUPABASE_SERVICE_ROLE_KEY`

## Step 2: Environment Configuration

### 2.1 Create .env.local

\`\`\`bash
cp .env.example .env.local
\`\`\`

Edit `.env.local` with your values:

\`\`\`
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

WORKER_URL=http://localhost:8000
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000

OPENAI_API_KEY=sk-...
OPENAI_EMBED_MODEL=text-embedding-3-small

JWT_SECRET=your-long-random-string
JWT_REFRESH_SECRET=another-long-random-string
\`\`\`

## Step 3: Frontend Setup

### 3.1 Install Dependencies

\`\`\`bash
npm install
\`\`\`

### 3.2 Run Type Check

\`\`\`bash
npx tsc --noEmit
\`\`\`

### 3.3 Start Development Server

\`\`\`bash
npm run dev
\`\`\`

The frontend runs on `http://localhost:3000`

## Step 4: Worker Service Setup

### 4.1 Create Python Environment

\`\`\`bash
cd worker
python -m venv venv

# On Windows
venv\Scripts\activate
# On macOS/Linux
source venv/bin/activate
\`\`\`

### 4.2 Install Dependencies

\`\`\`bash
pip install -r requirements.txt
\`\`\`

### 4.3 Configure Worker .env

Create `worker/.env`:

\`\`\`
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co

OPENAI_API_KEY=sk-...
OPENAI_EMBED_MODEL=text-embedding-3-small

WORKER_PORT=8000
\`\`\`

### 4.4 Start Worker

\`\`\`bash
python app.py
\`\`\`

The worker runs on `http://localhost:8000`

## Step 5: Testing

### 5.1 Run Tests

\`\`\`bash
npm test
\`\`\`

### 5.2 Run with Coverage

\`\`\`bash
npm test -- --coverage
\`\`\`

### 5.3 Test API Endpoints Manually

#### Upload a Document
\`\`\`bash
curl -X POST http://localhost:3000/api/ingest \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "file=@textbook.pdf"
\`\`\`

#### Search Documents
\`\`\`bash
curl -X POST http://localhost:3000/api/search \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"query": "Matematika", "limit": 5}'
\`\`\`

#### Save Test Result
\`\`\`bash
curl -X POST http://localhost:3000/api/save-test-result \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "textbook": "Matematika",
    "topic": "Həndəsə",
    "class": "9",
    "score": 85,
    "timeSpen": 1200,
    "answers": {}
  }'
\`\`\`

## Step 6: GitHub Secrets (for CI/CD)

1. Go to GitHub → Settings → Secrets and variables → Actions
2. Add these secrets:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `OPENAI_API_KEY`

## Step 7: Production Deployment

### 7.1 Build for Production

\`\`\`bash
npm run build
\`\`\`

### 7.2 Start Production Server

\`\`\`bash
npm start
\`\`\`

### 7.3 Deploy to Vercel (Recommended)

\`\`\`bash
npm install -g vercel
vercel deploy
\`\`\`

### 7.4 Deploy Worker to Railway/Fly.io

See `worker/README.md` for worker deployment instructions.

## Troubleshooting

### Issue: "Missing Supabase credentials"
- Check `.env.local` has correct URL and keys
- Verify keys in Supabase project settings

### Issue: "Worker not responding"
- Ensure worker is running on port 8000
- Check `WORKER_URL` points to correct address
- Look for errors in worker terminal

### Issue: "Rate limit exceeded"
- Wait 60 seconds (default window)
- Configure limits in `lib/middleware/rate-limit.ts`

### Issue: "PDF upload fails"
- Verify file is valid PDF (not corrupted)
- Check file size < 50MB
- Ensure Supabase storage bucket exists

## Monitoring

### Check Logs
\`\`\`sql
-- In Supabase SQL Editor
SELECT * FROM platform_logs 
ORDER BY created_at DESC 
LIMIT 50;
\`\`\`

### Monitor Errors
\`\`\`sql
SELECT * FROM platform_logs 
WHERE log_level = 'ERROR' 
ORDER BY created_at DESC;
\`\`\`

### Test RAG System
\`\`\`sql
SELECT * FROM rag_documents 
WHERE user_id = 'your-user-id';

SELECT COUNT(*) FROM rag_chunks 
WHERE document_id = 'document-id';
\`\`\`

## Architecture

\`\`\`
┌─────────────────┐
│   Next.js       │
│   Frontend      │
└────────┬────────┘
         │ API calls
         ▼
┌─────────────────┐         ┌──────────────┐
│   Next.js       │────────▶│  Supabase    │
│   Backend       │◀────────│  PostgreSQL  │
│   Routes        │         └──────────────┘
└────────┬────────┘              ▲
         │                       │
         │ Job queue             │ Vector search
         ▼                       │
┌─────────────────┐              │
│   FastAPI       │──────────────┘
│   Worker        │ (PDF → chunks → embeddings)
└─────────────────┘
\`\`\`

## Performance Tuning

### Increase Worker Concurrency
In `worker/app.py`, use worker pool:
\`\`\`python
import asyncio
from concurrent.futures import ProcessPoolExecutor

executor = ProcessPoolExecutor(max_workers=4)
\`\`\`

### Upgrade Rate Limits
In `lib/middleware/rate-limit.ts`, adjust `RATE_LIMIT_CONFIG`:
\`\`\`typescript
const RATE_LIMIT_CONFIG = {
  search: { maxRequests: 50, windowMs: 60 * 1000 },
  ingest: { maxRequests: 20, windowMs: 60 * 1000 },
}
\`\`\`

### Use Redis for Rate Limiting (Production)
Replace in-memory store with Redis for distributed rate limiting across multiple instances.

## Support

For issues or questions:
1. Check `platform_logs` table for error messages
2. Review GitHub Actions workflow results
3. Enable debug logging: `console.log("[v0] ...")`

---

**Last Updated**: November 2025  
**Platform Version**: 1.0.0  
**Owner**: Emil Məcidov
