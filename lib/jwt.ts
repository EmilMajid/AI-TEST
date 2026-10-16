

import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production"
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "your-refresh-secret-key"
const ACCESS_TOKEN_EXPIRY = "7d"
const REFRESH_TOKEN_EXPIRY = "30d"

export interface JWTPayload {
  id: number | string
  email: string
  accountType: string
  role?: string
}

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET
  if (secret) return secret
  if (process.env.NODE_ENV === "production") {
    console.error("[Auth] CRITICAL: JWT_SECRET environment variable is missing in production!")
    return ""
  }
  return "dev-only-fallback-jwt-secret-key-do-not-use-in-prod"
}

function getJwtRefreshSecret(): string {
  const secret = process.env.JWT_REFRESH_SECRET
  if (secret) return secret
  if (process.env.NODE_ENV === "production") {
    console.error("[Auth] CRITICAL: JWT_REFRESH_SECRET environment variable is missing in production!")
    return ""
  }
  return "dev-only-fallback-refresh-secret-key-do-not-use-in-prod"
}

export function generateAccessToken(payload: JWTPayload): string {
  const secret = getJwtSecret()
  if (!secret) throw new Error("JWT_SECRET is not configured")
  return jwt.sign(payload, secret, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
    algorithm: "HS256",
  })
}

export function generateRefreshToken(payload: JWTPayload): string {
  const secret = getJwtRefreshSecret()
  if (!secret) throw new Error("JWT_REFRESH_SECRET is not configured")
  return jwt.sign(payload, secret, {
    expiresIn: REFRESH_TOKEN_EXPIRY,
    algorithm: "HS256",
  })
}

export function verifyAccessToken(token: string): JWTPayload | null {
  if (!token) return null
  const secret = getJwtSecret()
  if (!secret) return null
  try {
    return jwt.verify(token, secret) as JWTPayload
  } catch {
    return null
  }
}

export function verifyRefreshToken(token: string): JWTPayload | null {
  if (!token) return null
  const secret = getJwtRefreshSecret()
  if (!secret) return null
  try {
    return jwt.verify(token, secret) as JWTPayload
  } catch {
    return null
  }
}

export function decodeToken(token: string): JWTPayload | null {
  try {
    return jwt.decode(token) as JWTPayload
  } catch {
    return null
  }
}
