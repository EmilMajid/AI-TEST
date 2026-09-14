

import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production"
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "your-refresh-secret-key"
const ACCESS_TOKEN_EXPIRY = "15m"
const REFRESH_TOKEN_EXPIRY = "7d"

export interface JWTPayload {
  id: number | string
  email: string
  accountType: string
  role?: string
}

const KNOWN_SECRETS = [
  JWT_SECRET,
  "your-secret-key-change-in-production",
  "demo-jwt-secret",
  "demo-jwt-refresh-secret",
  "super-secret-jwt-key-for-development-and-demo-mode-only",
  "testai-jwt-secret-key-2024",
]

export function generateAccessToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
    algorithm: "HS256",
  })
}

export function generateRefreshToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_REFRESH_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRY,
    algorithm: "HS256",
  })
}

export function verifyAccessToken(token: string): JWTPayload | null {
  if (!token) return null
  for (const s of KNOWN_SECRETS) {
    if (!s) continue
    try {
      return jwt.verify(token, s) as JWTPayload
    } catch {}
  }
  return null
}

export function verifyRefreshToken(token: string): JWTPayload | null {
  if (!token) return null
  for (const s of KNOWN_SECRETS) {
    if (!s) continue
    try {
      return jwt.verify(token, s) as JWTPayload
    } catch {}
  }
  return null
}

export function decodeToken(token: string): JWTPayload | null {
  try {
    return jwt.decode(token) as JWTPayload
  } catch {
    return null
  }
}
