"use client"

import { createBrowserClient } from "@supabase/ssr"
import { createClient as createServerClient } from "@supabase/supabase-js"

// Client-side Supabase client (anon key)
export const supabaseClient = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
)

// Server-side Supabase client (service role key) - use only in server actions/routes
export const supabaseServer = (() => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key) {
    console.warn("[WARN] Supabase service role not configured. Server operations may fail.")
  }

  return createServerClient(url || "", key || "", {
    auth: {
      persistSession: false,
    },
  })
})()

export default supabaseClient
