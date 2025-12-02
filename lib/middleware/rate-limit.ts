import { type NextRequest, NextResponse } from "next/server"
import { Redis } from "@upstash/redis"
import { Ratelimit } from "@upstash/ratelimit"

// Initialize Redis if configured
const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
    : null

interface RateLimitStore {
  [key: string]: {
    count: number
    resetTime: number
  }
}

// In-memory store fallback
const memoryStore: RateLimitStore = {}

// Configuration
const RATE_LIMIT_CONFIG = {
  search: { maxRequests: 10, windowMs: 60 * 1000 }, // 10 req/min
  ingest: { maxRequests: 5, windowMs: 60 * 1000 }, // 5 req/min
  saveResult: { maxRequests: 30, windowMs: 60 * 1000 }, // 30 req/min
}

/**
 * Rate limiter middleware using IP/token as key
 */
export function getRateLimitKey(request: NextRequest): string {
  // Use token if available, fallback to IP
  const authHeader = request.headers.get("Authorization")
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.slice(7).substring(0, 20) // Use first 20 chars of token
  }

  return request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown"
}

/**
 * Check and enforce rate limit
 * Returns null if within limit, otherwise returns error response
 */
export async function checkRateLimit(
  key: string,
  endpoint: keyof typeof RATE_LIMIT_CONFIG,
): Promise<NextResponse<any> | null> {
  const config = RATE_LIMIT_CONFIG[endpoint]

  // Use Redis if available
  if (redis) {
    try {
      const ratelimit = new Ratelimit({
        redis: redis,
        limiter: Ratelimit.slidingWindow(config.maxRequests, "60 s"),
        analytics: true,
        prefix: `@upstash/ratelimit/${endpoint}`,
      })

      const { success, limit, remaining, reset } = await ratelimit.limit(key)

      if (!success) {
        const retryAfter = Math.ceil((reset - Date.now()) / 1000)
        return NextResponse.json(
          {
            success: false,
            error: `Rate limit exceeded. Retry after ${retryAfter} seconds.`,
          },
          {
            status: 429,
            headers: {
              "Retry-After": retryAfter.toString(),
              "X-RateLimit-Limit": limit.toString(),
              "X-RateLimit-Remaining": remaining.toString(),
              "X-RateLimit-Reset": reset.toString(),
            },
          },
        )
      }
      return null
    } catch (error) {
      console.warn("Redis rate limit failed, falling back to memory", error)
      // Fallback to memory
    }
  }

  // In-memory fallback
  const now = Date.now()
  const storeKey = `${endpoint}:${key}`

  // Initialize or check existing limit
  if (!memoryStore[storeKey]) {
    memoryStore[storeKey] = {
      count: 1,
      resetTime: now + config.windowMs,
    }
    return null // First request, allow
  }

  const entry = memoryStore[storeKey]

  // Reset if window expired
  if (now > entry.resetTime) {
    entry.count = 1
    entry.resetTime = now + config.windowMs
    return null // Allow after reset
  }

  // Check if limit exceeded
  if (entry.count >= config.maxRequests) {
    const retryAfter = Math.ceil((entry.resetTime - now) / 1000)
    return NextResponse.json(
      {
        success: false,
        error: `Rate limit exceeded. Retry after ${retryAfter} seconds.`,
      },
      {
        status: 429,
        headers: {
          "Retry-After": retryAfter.toString(),
        },
      },
    )
  }

  // Increment counter
  entry.count++
  return null // Allow
}

/**
 * Rate limit middleware for API routes
 */
export function createRateLimitMiddleware(endpoint: keyof typeof RATE_LIMIT_CONFIG) {
  return (handler: (request: NextRequest) => Promise<NextResponse>) => {
    return async (request: NextRequest) => {
      const key = getRateLimitKey(request)
      const limitError = await checkRateLimit(key, endpoint)

      if (limitError) {
        return limitError
      }

      return handler(request)
    }
  }
}
