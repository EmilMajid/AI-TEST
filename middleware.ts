import { updateSession } from "@/lib/supabase/middleware"
import type { NextRequest } from "next/server"
import { NextResponse } from "next/server" // Added to allow NextResponse.next()

export async function middleware(request: NextRequest) {
  // Check for demo mode via environment variable (DEMO_MODE=true)
  // In production, when DEMO_MODE is false or unset, session verification is enforced.
  const isDemoMode = process.env.DEMO_MODE === "true" || process.env.NEXT_PUBLIC_DEMO_MODE === "true";

  if (isDemoMode) {
    return NextResponse.next();
  }

  return await updateSession(request)
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
}
