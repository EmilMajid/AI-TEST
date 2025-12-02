-- Initialize Supabase extensions required for RAG
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "vector";

-- Enable all extensions
SELECT * FROM pg_available_extensions WHERE name = 'pgcrypto' OR name = 'vector';
