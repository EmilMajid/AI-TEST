

import { type NextRequest, NextResponse } from "next/server"
import { verifyAccessToken } from "./jwt"
import { prisma } from "./db"

import { getAllUsers } from "./user-store"

export interface AuthContext {
  user: {
    id: number | string
    email: string
    accountType: string
    role?: string
  }
  token: string
}

export function getTokenFromRequest(request: NextRequest): string | null {
  const authHeader = request.headers.get("authorization") || request.headers.get("x-authorization")
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.slice(7).trim()
  }
  if (authHeader && authHeader.length > 20 && !authHeader.includes(" ")) {
    return authHeader.trim()
  }
  
  try {
    const urlToken = request.nextUrl?.searchParams?.get("token")
    if (urlToken) return urlToken
    const cookieToken = request.cookies?.get("token")?.value || request.cookies?.get("session")?.value
    if (cookieToken) return cookieToken
  } catch (e) {}

  return null
}

export async function getAuthContext(request: NextRequest): Promise<AuthContext | null> {
  const token = getTokenFromRequest(request)

  if (token) {
    const payload = verifyAccessToken(token)
    if (payload) {
      return {
        user: {
          id: payload.id,
          email: payload.email,
          accountType: payload.accountType,
          role: payload.role || payload.accountType,
        },
        token,
      }
    }
  }

  return null
}

export async function requireAuth(request: NextRequest): Promise<AuthContext | NextResponse> {
  const auth = await getAuthContext(request)
  if (!auth) {
    return NextResponse.json({ error: "Giriş tələb olunur (Unauthorized)" }, { status: 401 })
  }

  return auth
}

export async function requireRole(request: NextRequest, allowedRoles: string[]): Promise<AuthContext | NextResponse> {
  const auth = await requireAuth(request)
  if (auth instanceof NextResponse) {
    return auth // Return 401 response directly
  }

  const userRole = auth.user.role || auth.user.accountType
  if (!allowedRoles.includes(userRole)) {
    return NextResponse.json(
      { error: `İcazə verilmədi. Tələb olunan rol: ${allowedRoles.join(", ")}` },
      { status: 403 }
    )
  }

  return auth
}

export async function requireAdmin(request: NextRequest): Promise<AuthContext | NextResponse> {
  return requireRole(request, ["admin"])
}

export async function logApiAccess(userId: number | string, action: string, resource: string, ipAddress?: string) {
  if (process.env.NODE_ENV !== "production") {
    console.log(`[API Log] User: ${userId}, Action: ${action}, Resource: ${resource}, IP: ${ipAddress}`)
  }
}

export async function checkParentStudentAccess(parentId: number | string, studentId: number | string): Promise<boolean> {
  if (!parentId || !studentId) return false
  if (String(parentId) === String(studentId)) return true
  try {
    const { loadLinksFromDisk, getAllUsers } = await import("./user-store")
    const links = loadLinksFromDisk()
    const isLinked = links.some(
      (l) => String(l.parentId) === String(parentId) && String(l.studentId) === String(studentId)
    )
    if (isLinked) return true

    const users = getAllUsers()
    const student = users.find((u) => String(u.id) === String(studentId))
    if (student && String(student.parentId) === String(parentId)) {
      return true
    }
  } catch (e) {
    console.error("checkParentStudentAccess error:", e)
  }
  return false
}
