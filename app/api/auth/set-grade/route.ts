export const dynamic = "force-dynamic"
import { type NextRequest, NextResponse } from "next/server"
import { getAuthContext } from "@/lib/auth-utils"
import { setUserGrade, getAllUsers } from "@/lib/user-store"
import { generateAccessToken } from "@/lib/jwt"
import { getUserUniqueId } from "@/lib/profile-utils"

export async function POST(request: NextRequest) {
  try {
    const auth = await getAuthContext(request)
    const body = await request.json()
    const { grade, role = "student", userIdOrEmail } = body

    // Identify user: from auth session or client fallback identifier
    const targetKey = (auth?.user?.id || auth?.user?.email || userIdOrEmail || "").toString()

    if (!targetKey) {
      return NextResponse.json({ error: "İstifadəçi tapılmadı. Zəhmət olmasa daxil olun." }, { status: 401 })
    }

    if (role === "student" && (!grade || String(grade).trim().length === 0)) {
      return NextResponse.json({ error: "Zəhmət olmasa oxuduğunuz sinfi seçin (1-11)" }, { status: 400 })
    }

    const updatedUser = setUserGrade(targetKey, grade, role)

    if (!updatedUser) {
      return NextResponse.json({ error: "İstifadəçi bazada tapılmadı" }, { status: 404 })
    }

    // Refresh JWT
    const numericId =
      typeof updatedUser.id === "number"
        ? updatedUser.id
        : Number(String(updatedUser.id).replace(/\D/g, "")) || Date.now()

    const newToken = generateAccessToken({
      id: numericId,
      email: updatedUser.email,
      accountType: updatedUser.accountType || role,
      role: updatedUser.role || role,
    })

    const isParent = role === "parent"

    const clientUser = {
      id: updatedUser.id,
      email: updatedUser.email,
      accountType: isParent ? "parent" : (updatedUser.accountType || role),
      role: isParent ? "parent" : (updatedUser.role || role),
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      fatherName: updatedUser.fatherName || "",
      school: updatedUser.school || "",
      class: isParent ? "" : (updatedUser.class || grade),
      region: updatedUser.region || "Bakı",
      uniqueId: getUserUniqueId(updatedUser),
      googleId: updatedUser.googleId,
      avatarUrl: updatedUser.avatarUrl,
      isProfileDone: isParent ? true : (updatedUser.isProfileDone ?? false),
      profileWarningsCount: isParent ? 0 : (updatedUser.profileWarningsCount ?? 0),
    }

    const redirectPath = isParent ? "/parent-dashboard" : "/dashboard"

    const response = NextResponse.json({
      success: true,
      message: isParent ? "Valideyn profili aktivləşdirildi" : `${grade}-ci sinif uğurla təyin edildi`,
      user: clientUser,
      redirectUrl: redirectPath,
    })

    // Update Cookies
    response.cookies.set("token", newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 3600 * 24 * 7,
    })
    response.cookies.set("user_role", String(updatedUser.role || updatedUser.accountType || "student"), {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 3600 * 24 * 7,
    })

    return response
  } catch (error) {
    console.error("set-grade error:", error)
    return NextResponse.json({ error: "Sinif seçimi zamanı daxili xəta baş verdi" }, { status: 500 })
  }
}
