import { createBrowserClient } from "@supabase/ssr"

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://hkwppwinuyxznjnkdius.supabase.co"
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhrd3Bwd2ludXl4em5qbmtkaXVzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgzOTQ0ODgsImV4cCI6MjEwMzk3MDQ4OH0.m2FHkW54N44Yx9Xe7ET5-zOPDpoK3CkCFUUHeYRAYVg"
  return createBrowserClient(url, key)

}
