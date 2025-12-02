-- RAG Queries table for storing user queries and responses
CREATE TABLE IF NOT EXISTS public.rag_queries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    query_text TEXT NOT NULL,
    response_text TEXT,
    related_documents UUID[] REFERENCES public.rag_documents(id),
    created_at TIMESTAMP DEFAULT NOW(),
    tokens_used INT,
    model_used VARCHAR(255)
);

CREATE INDEX idx_rag_queries_user_id ON public.rag_queries(user_id);
CREATE INDEX idx_rag_queries_created_at ON public.rag_queries(created_at);

-- Platform settings and configuration
CREATE TABLE IF NOT EXISTS public.platform_settings (
    id SERIAL PRIMARY KEY,
    key TEXT UNIQUE NOT NULL,
    value JSONB NOT NULL,
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Insert default watermark setting
INSERT INTO public.platform_settings (key, value)
VALUES ('watermark', jsonb_build_object('enabled', true, 'text', 'Emil Məcidov'))
ON CONFLICT (key) DO NOTHING;

-- Platform logs for audit and debugging
CREATE TABLE IF NOT EXISTS public.platform_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    log_level VARCHAR(50),
    message TEXT,
    context JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_platform_logs_user_id ON public.platform_logs(user_id);
CREATE INDEX idx_platform_logs_created_at ON public.platform_logs(created_at);
CREATE INDEX idx_platform_logs_level ON public.platform_logs(log_level);

-- Enable RLS
ALTER TABLE public.rag_queries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_logs ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "users_can_view_own_queries" ON public.rag_queries 
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "logs_admin_only" ON public.platform_logs 
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'director'
    )
  );
