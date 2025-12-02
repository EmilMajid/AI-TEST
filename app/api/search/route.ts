import { supabaseServer } from "@/utils/supabaseClient"
import { generateEmbedding } from "@/lib/rag/embeddings"
import type { NextRequest } from "next/server"
import { createSuccessResponse, createErrorResponse } from "@/lib/middleware/api-response"
import { getRateLimitKey, checkRateLimit } from "@/lib/middleware/rate-limit"
import { logError } from "@/lib/middleware/error-handler"

interface SearchRequest {
  query: string
  limit?: number
}

/**
 * Vector similarity search across user's documents using pgvector
 */
export async function POST(request: NextRequest) {
  try {
    const rateLimitKey = getRateLimitKey(request)
    const limitError = await checkRateLimit(rateLimitKey, "search")
    if (limitError) return limitError

    // Validate Authorization header
    const authHeader = request.headers.get("Authorization")
    if (!authHeader?.startsWith("Bearer ")) {
      return createErrorResponse("Unauthorized", 401)
    }

    const token = authHeader.slice(7)

    // Verify token server-side
    const {
      data: { user },
      error: authError,
    } = await supabaseServer.auth.getUser(token)

    if (authError || !user) {
      return createErrorResponse("Invalid token", 401)
    }

    const body: SearchRequest = await request.json()
    const { query, limit = 5 } = body

    if (!query || query.trim().length === 0) {
      return createErrorResponse("Query cannot be empty", 400)
    }

    if (limit > 20 || limit < 1) {
      return createErrorResponse("Limit must be between 1 and 20", 400)
    }

    // Generate embedding for query
    const queryEmbedding = await generateEmbedding(query)

    // Query rag_chunks with vector similarity using pgvector
    const { data: contexts, error: searchError } = await supabaseServer
      .from("rag_chunks")
      .select(
        `
        id,
        chunk_text,
        chunk_index,
        metadata,
        document_id,
        embedding
      `,
      )
      .eq("rag_documents.user_id", user.id)
      .order("embedding", {
        ascending: true,
      })
      .limit(limit)

    if (searchError) {
      console.error("[ERROR] Search failed:", searchError)
      await logError({
        endpoint: "POST /api/search",
        userId: user.id,
        error: searchError,
      })
      return createErrorResponse("Search operation failed", 500)
    }

    // Log query for analytics
    try {
      await supabaseServer.from("rag_queries").insert({
        user_id: user.id,
        query_text: query,
        tokens_used: Math.ceil(query.split(" ").length / 1.3),
        model_used: "pgvector-cosine",
      })
    } catch (logQueryError) {
      console.warn("[WARN] Failed to log query:", logQueryError)
    }

    return createSuccessResponse({
      contexts: (contexts || []).map((ctx: any) => ctx.chunk_text),
      totalMatches: contexts?.length || 0,
    })
  } catch (error: any) {
    console.error("[ERROR] Search API error:", error)
    await logError({
      endpoint: "POST /api/search",
      error,
    })
    return createErrorResponse("Internal server error", 500)
  }
}
