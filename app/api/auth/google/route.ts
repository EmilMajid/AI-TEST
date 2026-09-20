export const dynamic = "force-dynamic"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const origin = request.nextUrl.origin
  const redirectUri = `${origin}/api/auth/google/callback`
  const clientId = process.env.GOOGLE_CLIENT_ID || process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID

  const role = request.nextUrl.searchParams.get("role") || "student"

  // If Google Client ID is configured in .env, redirect to real Google OAuth
  if (clientId && clientId.length > 10 && !clientId.includes("your-google-client-id")) {
    const scope = encodeURIComponent("openid email profile")
    const state = encodeURIComponent(JSON.stringify({ role }))
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&response_type=code&scope=${scope}&state=${state}&access_type=offline&prompt=select_account`

    return NextResponse.redirect(authUrl)
  }

  // Fallback Developer / Demo Mode:
  // If credentials are not yet added to .env, allow quick testing with simulated Google profile
  const demoAuthUrl = `${origin}/api/auth/google/callback?demo=true&role=${encodeURIComponent(role)}`
  return NextResponse.redirect(demoAuthUrl)
}
