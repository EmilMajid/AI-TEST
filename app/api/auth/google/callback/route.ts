export const dynamic = "force-dynamic"
import { type NextRequest, NextResponse } from "next/server"
import { getOrCreateGoogleUser } from "@/lib/user-store"
import { generateAccessToken } from "@/lib/jwt"
import { getUserUniqueId } from "@/lib/profile-utils"

export async function GET(request: NextRequest) {
  const origin = request.nextUrl.origin
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get("code")
  const isDemo = searchParams.get("demo") === "true"

  let googleProfile: {
    sub: string
    email: string
    name?: string
    given_name?: string
    family_name?: string
    picture?: string
  } | null = null

  // 1. Demo Mode Fallback (If Google Client ID is not yet in .env)
  if (isDemo || !code) {
    const demoEmailParam = searchParams.get("email")
    const demoNameParam = searchParams.get("name")

    googleProfile = {
      sub: `google-sim-${Date.now().toString().slice(-6)}`,
      email: demoEmailParam || "google.telebe@gmail.com",
      name: demoNameParam || "Sənan Əliyev",
      given_name: (demoNameParam || "Sənan Əliyev").split(" ")[0],
      family_name: (demoNameParam || "Sənan Əliyev").split(" ").slice(1).join(" "),
      picture: "https://lh3.googleusercontent.com/a/default-user=s96-c",
    }
  } else {
    // 2. Real Google OAuth Token Exchange
    try {
      const clientId = process.env.GOOGLE_CLIENT_ID || process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
      const clientSecret = process.env.GOOGLE_CLIENT_SECRET
      const redirectUri = `${origin}/api/auth/google/callback`

      if (!clientId || !clientSecret) {
        return NextResponse.redirect(`${origin}/login?error=google_config_missing`)
      }

      const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          code,
          client_id: clientId,
          client_secret: clientSecret,
          redirect_uri: redirectUri,
          grant_type: "authorization_code",
        }),
      })

      if (!tokenRes.ok) {
        console.error("Google token exchange error:", await tokenRes.text())
        return NextResponse.redirect(`${origin}/login?error=google_token_error`)
      }

      const tokenData = await tokenRes.json()
      const accessToken = tokenData.access_token

      // Fetch User Info
      const userInfoRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: { Authorization: `Bearer ${accessToken}` },
      })

      if (!userInfoRes.ok) {
        return NextResponse.redirect(`${origin}/login?error=google_userinfo_error`)
      }

      googleProfile = await userInfoRes.json()
    } catch (e) {
      console.error("Google OAuth callback exception:", e)
      return NextResponse.redirect(`${origin}/login?error=google_failed`)
    }
  }

  if (!googleProfile || !googleProfile.email) {
    return NextResponse.redirect(`${origin}/login?error=google_no_profile`)
  }

  // 3. User Store get or create
  const { user, isNew, hasGrade } = getOrCreateGoogleUser(googleProfile)

  // 4. Generate JWT Access Token
  const numericId = typeof user.id === "number" ? user.id : (Number(String(user.id).replace(/\D/g, "")) || Date.now())
  const token = generateAccessToken({
    id: numericId,
    email: user.email,
    accountType: user.accountType || "student",
    role: user.role || user.accountType || "student",
  })

  // 5. Determine Redirect Target
  // If user does not have class/grade set yet, mandatory quick grade modal must appear!
  const targetPath = !hasGrade
    ? `/dashboard?showGradeModal=true&welcomeGoogle=true`
    : user.accountType === "parent"
    ? `/parent-dashboard`
    : `/dashboard`

  // 6. Return HTML with Client-side localStorage sync + Cookies
  // This ensures BOTH server-side HTTP cookies AND client-side localStorage are populated immediately!
  const clientUserObj = {
    id: user.id,
    email: user.email,
    accountType: user.accountType || "student",
    role: user.role || user.accountType || "student",
    firstName: user.firstName,
    lastName: user.lastName,
    fatherName: user.fatherName || "",
    school: user.school || "",
    class: user.class || "",
    region: user.region || "Bakı",
    uniqueId: getUserUniqueId(user),
    googleId: user.googleId,
    avatarUrl: user.avatarUrl,
    isProfileDone: user.isProfileDone ?? false,
    profileWarningsCount: user.profileWarningsCount ?? 0,
  }

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>testai.az — Giriş edilir...</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; background: #f8fafc; color: #1e293b; }
    .loader { text-align: center; }
    .spinner { width: 44px; height: 44px; border: 4px solid #e2e8f0; border-top-color: #3b82f6; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 16px; }
    @keyframes spin { to { transform: rotate(360deg); } }
  </style>
</head>
<body>
  <div class="loader">
    <div class="spinner"></div>
    <h3>Google ilə giriş edilir...</h3>
    <p>Zəhmət olmasa gözləyin, yönləndirilirsiniz.</p>
  </div>
  <script>
    try {
      const user = ${JSON.stringify(clientUserObj)};
      const session = { access_token: "${token}", token_type: "bearer", user: { id: user.id, email: user.email } };
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("userData", JSON.stringify(user));
      localStorage.setItem("session", JSON.stringify(session));
    } catch(e) {
      console.error(e);
    }
    window.location.replace("${targetPath}");
  </script>
</body>
</html>`

  const response = new NextResponse(html, {
    status: 200,
    headers: { "Content-Type": "text/html; charset=utf-8" },
  })

  // Set HTTP-only cookies for server-side auth & middleware
  response.cookies.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 3600 * 24 * 7,
  })
  response.cookies.set("user_role", String(user.role || user.accountType || "student"), {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 3600 * 24 * 7,
  })

  return response
}
