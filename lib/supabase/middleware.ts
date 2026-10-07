import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // If Supabase is not configured, allow request to proceed
  if (!supabaseUrl || !supabaseAnonKey) {
    return supabaseResponse
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
        supabaseResponse = NextResponse.next({
          request,
        })
        cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options))
      },
    },
  })

  // Check for demo mode
  const isDemoMode = process.env.NEXT_PUBLIC_SUPABASE_URL?.includes("demo") || process.env.NODE_ENV === "development"

  if (isDemoMode) {
    return supabaseResponse
  }

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      // Define public routes that must never be redirected to /login
      const publicPrefixes = [
        "/about",
        "/privacy",
        "/terms",
        "/contact",
        "/blog",
        "/open-tests",
        "/az",
        "/tr",
        "/ru",
      ]

      const pathname = request.nextUrl.pathname
      const isPublicRoute =
        pathname === "/" ||
        pathname.startsWith("/login") ||
        pathname.startsWith("/register") ||
        pathname.startsWith("/api") ||
        publicPrefixes.some((prefix) => pathname === prefix || pathname.startsWith(prefix + "/"))

      if (!user && !isPublicRoute) {
        const url = request.nextUrl.clone()
        url.pathname = "/login"
        return NextResponse.redirect(url)
      }
    } catch (authError) {
      // Gracefully continue without throwing 500 on Supabase timeouts/errors
      console.error("[Middleware] Supabase auth check error:", authError)
    }

    return supabaseResponse
}
