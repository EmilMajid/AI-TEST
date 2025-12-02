import "@testing-library/jest-dom"

// Mock environment variables
process.env.NEXT_PUBLIC_SUPABASE_URL = "http://localhost:3000"
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "test-key"
process.env.SUPABASE_SERVICE_ROLE_KEY = "test-service-key"
