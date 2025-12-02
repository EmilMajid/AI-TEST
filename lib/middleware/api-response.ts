import { NextResponse } from "next/server"

/**
 * Standardized API response format for all endpoints
 * Ensures consistent response structure across the platform
 */
export interface ApiResponse<T = any> {
  success: boolean
  data: T | null
  error: string | null
  timestamp?: string
}

/**
 * Create a standardized success response
 */
export function createSuccessResponse<T>(data: T, status = 200): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      data,
      error: null,
      timestamp: new Date().toISOString(),
    },
    { status },
  )
}

/**
 * Create a standardized error response
 */
export function createErrorResponse(error: string, status = 400): NextResponse<ApiResponse<null>> {
  return NextResponse.json(
    {
      success: false,
      data: null,
      error,
      timestamp: new Date().toISOString(),
    },
    { status },
  )
}

/**
 * Wrapper for API handlers to ensure standardized responses
 */
export function createApiHandler(handler: (request: Request) => Promise<NextResponse>) {
  return async (request: Request) => {
    try {
      return await handler(request)
    } catch (error: any) {
      console.error("[ERROR] Unhandled API error:", error)
      return createErrorResponse(error?.message || "Internal server error", 500)
    }
  }
}
