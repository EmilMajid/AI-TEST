export const dynamic = "force-dynamic"
import { type NextRequest, NextResponse } from "next/server"
import { getOrCreateGoogleUser, saveUser } from "@/lib/user-store"
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

  // Extract requested role from OAuth state parameter (if passed) or query params
  const stateParam = searchParams.get("state")
  let requestedRole = searchParams.get("role") || "student"
  if (stateParam) {
    try {
      const parsed = JSON.parse(decodeURIComponent(stateParam))
      if (parsed.role) requestedRole = parsed.role
    } catch (e) {
      if (stateParam === "parent" || stateParam === "student") {
        requestedRole = stateParam
      }
    }
  }

  // 3. User Store get or create with requested role
  const { user, isNew } = getOrCreateGoogleUser(googleProfile, requestedRole)

  // 3.1. Query persistent cloud database (Prisma / Supabase) to restore existing class if missing in-memory
  try {
    const cleanEmail = (googleProfile.email || "").trim().toLowerCase()
    const { prisma } = await import("@/lib/db")
    const dbUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: cleanEmail },
          { googleId: googleProfile.sub },
        ],
      },
    })

    if (dbUser) {
      if (dbUser.class && (!user.class || user.class.trim().length === 0)) {
        user.class = dbUser.class
      }
      if (dbUser.school && !user.school) user.school = dbUser.school
      if (dbUser.region && !user.region) user.region = dbUser.region
      if (dbUser.accountType) user.accountType = dbUser.accountType
      if (dbUser.role) user.role = dbUser.role
      if (dbUser.isProfileDone !== undefined) user.isProfileDone = dbUser.isProfileDone
      saveUser(user)
    } else {
      const { supabaseAdmin } = await import("@/lib/user-store")
      if (supabaseAdmin) {
        const { data: supaUser } = await supabaseAdmin
          .from("User")
          .select("*")
          .or(`email.eq.${cleanEmail},googleId.eq.${googleProfile.sub}`)
          .maybeSingle()

        if (supaUser) {
          if (supaUser.class && (!user.class || user.class.trim().length === 0)) {
            user.class = supaUser.class
          }
          if (supaUser.school && !user.school) user.school = supaUser.school
          if (supaUser.region && !user.region) user.region = supaUser.region
          if (supaUser.accountType) user.accountType = supaUser.accountType
          if (supaUser.role) user.role = supaUser.role
          saveUser(user)
        }
      }
    }
  } catch (dbErr) {
    console.warn("DB user lookup in Google callback:", dbErr)
  }

  const isParent = user.accountType === "parent" || user.role === "parent" || requestedRole === "parent"
  const hasGrade = Boolean(user.class && String(user.class).trim().length > 0)

  // 4. Generate JWT Access Token
  const numericId = typeof user.id === "number" ? user.id : (Number(String(user.id).replace(/\D/g, "")) || Date.now())
  const token = generateAccessToken({
    id: numericId,
    email: user.email,
    accountType: isParent ? "parent" : (user.accountType || "student"),
    role: isParent ? "parent" : (user.role || user.accountType || "student"),
  })

  // 5. Determine Initial Server Redirect Target
  const targetPath = isParent
    ? `/parent-dashboard`
    : !hasGrade
    ? `/dashboard?showGradeModal=true&welcomeGoogle=true`
    : `/dashboard`

  // 6. Return HTML with Client-side localStorage sync + Cookies
  const clientUserObj = {
    id: user.id,
    email: user.email,
    accountType: isParent ? "parent" : (user.accountType || "student"),
    role: isParent ? "parent" : (user.role || user.accountType || "student"),
    firstName: user.firstName,
    lastName: user.lastName,
    fatherName: user.fatherName || "",
    school: user.school || "",
    class: isParent ? "" : (user.class || ""),
    region: user.region || "Bakı",
    uniqueId: getUserUniqueId(user),
    googleId: user.googleId,
    avatarUrl: user.avatarUrl,
    isProfileDone: isParent ? true : (user.isProfileDone ?? false),
    profileWarningsCount: isParent ? 0 : (user.profileWarningsCount ?? 0),
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
      const serverUser = ${JSON.stringify(clientUserObj)};
      const localRaw = localStorage.getItem("userData") || localStorage.getItem("user");
      let mergedUser = Object.assign({}, serverUser);

      if (localRaw) {
        try {
          const localParsed = JSON.parse(localRaw);
          const sameEmail = localParsed && localParsed.email && serverUser.email && 
            localParsed.email.toLowerCase() === serverUser.email.toLowerCase();
          const sameGoogleId = localParsed && localParsed.googleId && serverUser.googleId && 
            localParsed.googleId === serverUser.googleId;

          if (sameEmail || sameGoogleId) {
            // Qoruyucu birləşdirmə: Əvvəl seçilmiş sinif varsa, heç vaxt silinməsin!
            const rememberedClass = (serverUser.class && serverUser.class.trim().length > 0) 
              ? serverUser.class 
              : (localParsed.class || "");

            mergedUser = Object.assign({}, localParsed, serverUser, {
              class: rememberedClass,
              school: serverUser.school || localParsed.school || "",
              region: serverUser.region || localParsed.region || "Bakı",
              accountType: (serverUser.accountType === "parent" || localParsed.accountType === "parent") ? "parent" : (serverUser.accountType || localParsed.accountType || "student"),
              role: (serverUser.role === "parent" || localParsed.role === "parent") ? "parent" : (serverUser.role || localParsed.role || "student"),
              isProfileDone: serverUser.isProfileDone || localParsed.isProfileDone || false,
            });

            // Əgər serverdə sinif yox idisə, amma brauzer yaddaşında vardısa, serverə arxa planda sinfi göndər
            if (!serverUser.class && rememberedClass) {
              fetch("/api/auth/set-grade", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  grade: rememberedClass,
                  role: mergedUser.role || "student",
                  userIdOrEmail: mergedUser.id || mergedUser.email,
                }),
              }).catch(function() {});
            }
          }
        } catch(err) {
          console.error("Local user merge error:", err);
        }
      }

      const session = { access_token: "${token}", token_type: "bearer", user: { id: mergedUser.id, email: mergedUser.email } };
      localStorage.setItem("user", JSON.stringify(mergedUser));
      localStorage.setItem("userData", JSON.stringify(mergedUser));
      localStorage.setItem("session", JSON.stringify(session));

      const isParent = mergedUser.accountType === "parent" || mergedUser.role === "parent";
      const hasGrade = Boolean(mergedUser.class && String(mergedUser.class).trim().length > 0);

      let finalTarget = "/dashboard";
      if (isParent) {
        finalTarget = "/parent-dashboard";
      } else if (!hasGrade) {
        finalTarget = "/dashboard?showGradeModal=true&welcomeGoogle=true";
      }

      window.location.replace(finalTarget);
    } catch(e) {
      console.error(e);
      window.location.replace("${targetPath}");
    }
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
