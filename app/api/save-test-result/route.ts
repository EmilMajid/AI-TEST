import { supabaseServer } from "@/utils/supabaseClient"
import type { NextRequest } from "next/server"
import { createSuccessResponse, createErrorResponse } from "@/lib/middleware/api-response"
import { getRateLimitKey, checkRateLimit } from "@/lib/middleware/rate-limit"
import { logError } from "@/lib/middleware/error-handler"

interface TestResult {
  textbook: string
  topic: string
  class: string
  score: number
  timeSpen: number
  answers: Record<string, any>
  completedAt?: string
}

/**
 * Save test results for authenticated user with rate limiting
 */
export async function POST(request: NextRequest) {
  try {
    const rateLimitKey = getRateLimitKey(request)
    const limitError = await checkRateLimit(rateLimitKey, "saveResult")
    if (limitError) return limitError

    // Validate Authorization header
    const authHeader = request.headers.get("Authorization")
    if (!authHeader?.startsWith("Bearer ")) {
      return createErrorResponse("Unauthorized", 401)
    }

    const token = authHeader.slice(7)

    // Verify token
    const {
      data: { user },
      error: authError,
    } = await supabaseServer.auth.getUser(token)

    if (authError || !user) {
      return createErrorResponse("Invalid token", 401)
    }

    const body: TestResult = await request.json()

    // Validate required fields
    if (!body.textbook || body.score === undefined) {
      return createErrorResponse("Missing required fields", 400)
    }

    // Validate score range
    if (body.score < 0 || body.score > 100) {
      return createErrorResponse("Score must be between 0 and 100", 400)
    }

    // Insert test result
    const { data: result, error: insertError } = await supabaseServer
      .from("test_results")
      .insert({
        user_id: user.id,
        textbook: body.textbook,
        topic: body.topic,
        class: body.class,
        score: body.score,
        time_spent: body.timeSpen,
        answers: body.answers,
        completed_at: body.completedAt || new Date().toISOString(),
      })
      .select()
      .single()

    if (insertError) {
      console.error("[ERROR] Test result insert failed:", insertError)
      await logError({
        endpoint: "POST /api/save-test-result",
        userId: user.id,
        error: insertError,
      })
      return createErrorResponse("Failed to save test result", 500)
    }

    return createSuccessResponse(result, 201)
  } catch (error: any) {
    console.error("[ERROR] Save test result error:", error)
    await logError({
      endpoint: "POST /api/save-test-result",
      error,
    })
    return createErrorResponse("Internal server error", 500)
  }
}
