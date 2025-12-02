import { supabaseServer } from "@/utils/supabaseClient"
import { NextResponse } from "next/server"

export interface ErrorContext {
  endpoint: string
  userId?: string
  error: any
  requestData?: any
  statusCode?: number
}

/**
 * Log errors to database and external services (Sentry placeholder)
 */
export async function logError(context: ErrorContext): Promise<void> {
  try {
    // Log to database
    await supabaseServer.from("platform_logs").insert({
      user_id: context.userId || null,
      log_level: "ERROR",
      message: context.error?.message || String(context.error),
      context: {
        endpoint: context.endpoint,
        requestData: context.requestData,
        stack: context.error?.stack,
        statusCode: context.statusCode,
      },
    })

    // TODO: Send to Sentry for production monitoring
    // if (process.env.SENTRY_DSN) {
    //   Sentry.captureException(context.error)
    // }
  } catch (logError) {
    console.error("[ERROR] Failed to log error:", logError)
  }
}

/**
 * Handle and standardize API errors
 */
export function handleApiError(error: any, defaultMessage = "Internal server error", statusCode = 500): NextResponse {
  const message = error?.message || error?.detail || defaultMessage

  console.error("[ERROR] API Error:", {
    message,
    statusCode,
    error,
  })

  return NextResponse.json(
    {
      success: false,
      error: message,
    },
    { status: statusCode },
  )
}
