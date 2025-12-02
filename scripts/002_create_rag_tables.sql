-- RAG Documents table for storing uploaded PDFs and texts
CREATE TABLE IF NOT EXISTS public.rag_documents (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    file_name TEXT NOT NULL,
    mime_type TEXT,
    file_size BIGINT,
    uploaded_at TIMESTAMP DEFAULT NOW(),
    text_content TEXT,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_rag_documents_user_id ON public.rag_documents(user_id);
CREATE INDEX idx_rag_documents_created_at ON public.rag_documents(created_at);

-- RAG Chunks table for storing document chunks with embeddings
CREATE TABLE IF NOT EXISTS public.rag_chunks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    document_id UUID NOT NULL REFERENCES public.rag_documents(id) ON DELETE CASCADE,
    chunk_index INT NOT NULL,
    chunk_text TEXT NOT NULL,
    embedding VECTOR(1536),
    metadata JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_rag_chunks_document_id ON public.rag_chunks(document_id);
CREATE INDEX idx_rag_chunks_embedding ON public.rag_chunks USING ivfflat (embedding vector_cosine_ops);

-- Enable RLS for RAG tables
ALTER TABLE public.rag_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rag_chunks ENABLE ROW LEVEL SECURITY;

-- RLS policies for rag_documents
CREATE POLICY "users_can_select_own_documents" ON public.rag_documents 
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "users_can_insert_documents" ON public.rag_documents 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "users_can_update_own_documents" ON public.rag_documents 
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "users_can_delete_own_documents" ON public.rag_documents 
  FOR DELETE USING (auth.uid() = user_id);

-- RLS policies for rag_chunks (inherit from document owner)
CREATE POLICY "users_can_select_chunks" ON public.rag_chunks 
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.rag_documents 
      WHERE id = document_id AND user_id = auth.uid()
    )
  );
