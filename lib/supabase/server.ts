import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export async function createClient() {
  const cookieStore = await cookies()
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://hkwppwinuyxznjnkdius.supabase.co"
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhrd3Bwd2ludXl4em5qbmtkaXVzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgzOTQ0ODgsImV4cCI6MjEwMzk3MDQ4OH0.m2FHkW54N44Yx9Xe7ET5-zOPDpoK3CkCFUUHeYRAYVg"

  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
        } catch {
          // Ignore errors in Server Components
        }
      },
    },
  })
}
