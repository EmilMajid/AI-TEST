export const dynamic = "force-dynamic"
import { type NextRequest, NextResponse } from "next/server"
import { getAuthContext } from "@/lib/auth-utils"
import { incrementProfileWarning, getAllUsers } from "@/lib/user-store"

export async function GET(request: NextRequest) {
  try {
    const auth = await getAuthContext(request)
    const urlKey = request.nextUrl.searchParams.get("userId") || auth?.user?.id || auth?.user?.email

    if (!urlKey) {
      return NextResponse.json({ warningsCount: 0, isLocked: false, isProfileDone: true })
    }

    const allUsers = getAllUsers()
    const user = allUsers.find(
      (u) => String(u.id) === String(urlKey) || (u.email && u.email.toLowerCase() === String(urlKey).toLowerCase())
    )

    if (!user) {
      return NextResponse.json({ warningsCount: 0, isLocked: false, isProfileDone: true })
    }

    const isProfileDone = Boolean(user.isProfileDone || (user.school && user.region && user.class))
    const warningsCount = user.profileWarningsCount || 0
    const isLocked = !isProfileDone && warningsCount >= 4

    return NextResponse.json({
      warningsCount,
      isLocked,
      isProfileDone,
    })
  } catch (e) {
    return NextResponse.json({ warningsCount: 0, isLocked: false, isProfileDone: true })
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await getAuthContext(request)
    const body = await request.json().catch(() => ({}))
    const targetKey = auth?.user?.id || auth?.user?.email || body?.userId || body?.email

    if (!targetKey) {
      return NextResponse.json({ warningsCount: 0, isLocked: false, isProfileDone: true })
    }

    const result = incrementProfileWarning(targetKey)
    return NextResponse.json(result)
  } catch (error) {
    console.error("profile-warning increment error:", error)
    return NextResponse.json({ warningsCount: 0, isLocked: false, isProfileDone: true })
  }
}
