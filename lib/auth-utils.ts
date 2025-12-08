

import { type NextRequest, NextResponse } from "next/server"
import { verifyAccessToken } from "./jwt"
import { prisma } from "./db"

export interface AuthContext {
  user: {
    id: number
    email: string
    accountType: string
    role?: string
  }
  token: string
}

export function getTokenFromRequest(request: NextRequest): string | null {
  const authHeader = request.headers.get("authorization")
  if (!authHeader?.startsWith("Bearer ")) {
    return null
  }
  return authHeader.slice(7)
}

export async function getAuthContext(request: NextRequest): Promise<AuthContext | null> {
  const token = getTokenFromRequest(request)
  console.log('[getAuthContext] Token extracted:', token ? `${token.substring(0, 20)}...` : 'null')

  if (!token) {
    console.log('[getAuthContext] No token found')
    return null
  }

  const payload = verifyAccessToken(token)
  console.log('[getAuthContext] Token verification result:', payload ? 'SUCCESS' : 'FAILED')

  if (!payload) {
    console.log('[getAuthContext] Token verification failed')
    return null
  }

  console.log('[getAuthContext] Payload:', { id: payload.id, email: payload.email, accountType: payload.accountType })

  return {
    user: {
      id: payload.id,
      email: payload.email,
      accountType: payload.accountType,
      role: payload.role,
    },
    token,
  }
}

export async function requireAuth(request: NextRequest) {
  console.log('[requireAuth] Checking authorization...')
  console.log('[requireAuth] Authorization header:', request.headers.get("authorization"))

  const auth = await getAuthContext(request)
  if (!auth) {
    console.log('[requireAuth] Auth failed - returning 401')
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  console.log('[requireAuth] Auth successful for user:', auth.user.email)
  return auth
}

export async function requireRole(request: NextRequest, allowedRoles: string[]) {
  const auth = await requireAuth(request)
  if (auth instanceof NextResponse) {
    return null // Auth failed
  }

  const userRole = auth.user.role || auth.user.accountType
  if (!allowedRoles.includes(userRole)) {
    return NextResponse.json({ error: "Access denied. Required role: " + allowedRoles.join(", ") }, { status: 403 })
  }

  return auth
}

export async function logApiAccess(userId: number, action: string, resource: string, ipAddress?: string) {
  console.log(`[Mock Log] User: ${userId}, Action: ${action}, Resource: ${resource}, IP: ${ipAddress}`)
  // Mocked - no DB call
}

export async function checkParentStudentAccess(parentId: number, studentId: number): Promise<boolean> {
  // Mocked - always allow access in demo mode
  return true
}
