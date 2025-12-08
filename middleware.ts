import { updateSession } from "@/lib/supabase/middleware"
import type { NextRequest } from "next/server"
import { NextResponse } from "next/server" // Added to allow NextResponse.next()

export async function middleware(request: NextRequest) {
  // Check for demo mode
  // FORCE MOCK MODE as per user request
  const isDemoMode = true;

  if (isDemoMode) {
    // In demo mode, bypass strict session checks by allowing the request to proceed.
    // This might mean returning a simple next response or a mocked session response.
    // Assuming the intent is to let the request pass without session validation.
    return NextResponse.next();
  }

  return await updateSession(request)
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
}
