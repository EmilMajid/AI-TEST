"use server"

export function validateEnvironment() {
  const requiredEnvVars = {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  }

  const optionalEnvVars = {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    XAI_API_KEY: process.env.XAI_API_KEY,
    GROQ_API_KEY: process.env.GROQ_API_KEY,
    NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL,
  }

  const missing: string[] = []
  for (const [key, value] of Object.entries(requiredEnvVars)) {
    if (!value) missing.push(key)
  }

  const available: Record<string, boolean> = {}
  for (const [key, value] of Object.entries(optionalEnvVars)) {
    available[key] = !!value
  }

  return {
    allRequiredSet: missing.length === 0,
    missing,
    available,
  }
}

export function validateApiKey(key: string | undefined, type: "openai" | "xai" | "groq"): boolean {
  if (!key) return false

  const patterns = {
    openai: /^sk-[A-Za-z0-9_-]{20,}$/,
    xai: /^xai-[A-Za-z0-9_-]{20,}$/,
    groq: /^gsk_[A-Za-z0-9_-]{20,}$/,
  }

  return patterns[type].test(key)
}

export function maskApiKey(key: string): string {
  if (!key || key.length < 8) return "***"
  return key.substring(0, 4) + "..." + key.substring(key.length - 4)
}
