

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

export const KNOWN_SECRETS = [
  process.env.JWT_SECRET,
].filter(Boolean) as string[]

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET
  if (!secret) {
    throw new Error("CRITICAL: JWT_SECRET environment variable is not set")
  }
  return secret
}

function getJwtRefreshSecret(): string {
  const secret = process.env.JWT_REFRESH_SECRET
  if (!secret) {
    throw new Error("CRITICAL: JWT_REFRESH_SECRET environment variable is not set")
  }
  return secret
}

export function generateAccessToken(payload: JWTPayload): string {
  const secret = getJwtSecret()
  return jwt.sign(payload, secret, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
    algorithm: "HS256",
  })
}

export function generateRefreshToken(payload: JWTPayload): string {
  const secret = getJwtRefreshSecret()
  return jwt.sign(payload, secret, {
    expiresIn: REFRESH_TOKEN_EXPIRY,
    algorithm: "HS256",
  })
}

export function verifyAccessToken(token: string): JWTPayload | null {
  if (!token) return null
  for (const secret of KNOWN_SECRETS) {
    try {
      return jwt.verify(token, secret) as JWTPayload
    } catch {
      // Continue trying next secret
    }
  }
  return null
}

export function verifyRefreshToken(token: string): JWTPayload | null {
  if (!token) return null
  const secrets = [process.env.JWT_REFRESH_SECRET].filter(Boolean) as string[]
  for (const secret of secrets) {
    try {
      return jwt.verify(token, secret) as JWTPayload
    } catch {
      // Continue trying next secret
    }
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
