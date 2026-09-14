import { updateSession } from "@/lib/supabase/middleware"
import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { jwtVerify } from "jose"

const KNOWN_SECRETS = [
  process.env.JWT_SECRET,
  "demo-jwt-secret",
  "testai-jwt-secret-key-2024",
  "super-secret-jwt-key-for-development-and-demo-mode-only",
  "your-secret-key-change-in-production",
].filter(Boolean) as string[]

async function verifyAdminFromRequest(request: NextRequest): Promise<boolean> {
  // 1. Get token from cookies or Authorization header
  let token: string | undefined =
    request.cookies.get("token")?.value ||
    request.cookies.get("auth-token")?.value ||
    request.cookies.get("session")?.value

  if (!token) {
    const authHeader = request.headers.get("authorization") || request.headers.get("x-authorization")
    if (authHeader?.startsWith("Bearer ")) {
      token = authHeader.slice(7).trim()
    } else if (authHeader && authHeader.length > 20 && !authHeader.includes(" ")) {
      token = authHeader.trim()
    }
  }

  if (!token) {
    return false
  }

  // 2. Cryptographically verify token signature with known secrets
  for (const secret of KNOWN_SECRETS) {
    try {
      const secretKey = new TextEncoder().encode(secret)
      const { payload } = await jwtVerify(token, secretKey)
      const role = (payload.role as string) || (payload.accountType as string)
      const email = (payload.email as string)?.toLowerCase()
      const id = String(payload.id || "").toLowerCase()

      if (role === "admin" || email === "admin@edu.az" || id === "admin-main") {
        return true
      }
    } catch {
      // Continue trying remaining secrets
    }
  }

  return false
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // CRITICAL SECURITY GUARD: Protect /admin pages and /api/admin endpoints
  const isAdminPage = pathname === "/admin" || pathname.startsWith("/admin/")
  const isAdminApi = pathname.startsWith("/api/admin")

  if (isAdminPage || isAdminApi) {
    const isAdmin = await verifyAdminFromRequest(request)

    if (!isAdmin) {
      if (isAdminApi) {
        return NextResponse.json(
          {
            success: false,
            error: "Giriş qadağandır. Bu əməliyyat üçün administrator hüquqları tələb olunur.",
            code: "UNAUTHORIZED_ADMIN_ACCESS",
          },
          { status: 401 }
        )
      }

      // For browser requests to /admin, redirect immediately to login with alert
      const loginUrl = request.nextUrl.clone()
      loginUrl.pathname = "/login"
      loginUrl.searchParams.set("error", "admin_required")
      loginUrl.searchParams.set("redirect", pathname)
      return NextResponse.redirect(loginUrl)
    }

    return NextResponse.next()
  }

  // For non-admin routes: Check demo mode
  const isDemoMode = process.env.DEMO_MODE === "true" || process.env.NEXT_PUBLIC_DEMO_MODE === "true"
  if (isDemoMode) {
    return NextResponse.next()
  }

  return await updateSession(request)
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
}
