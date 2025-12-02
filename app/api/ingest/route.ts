import { supabaseServer } from "@/utils/supabaseClient"
import type { NextRequest } from "next/server"
import { createSuccessResponse, createErrorResponse } from "@/lib/middleware/api-response"
import { getRateLimitKey, checkRateLimit } from "@/lib/middleware/rate-limit"
import { logError } from "@/lib/middleware/error-handler"

// Helper function to validate JWT and extract user ID
async function getUserFromRequest(request: NextRequest) {
  const authHeader = request.headers.get("Authorization")
  if (!authHeader?.startsWith("Bearer ")) {
    return null
  }

  const token = authHeader.slice(7)
  try {
    const { data } = await supabaseServer.auth.getUser(token)
    return data.user?.id
  } catch {
    return null
  }
}

export async function POST(request: NextRequest) {
  try {
    const rateLimitKey = getRateLimitKey(request)
    const limitError = await checkRateLimit(rateLimitKey, "ingest")
    if (limitError) return limitError

    const userId = await getUserFromRequest(request)
    if (!userId) {
      return createErrorResponse("Unauthorized", 401)
    }

    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return createErrorResponse("No file provided", 400)
    }

    // Validate PDF file
    if (!file.name.endsWith(".pdf") || file.type !== "application/pdf") {
      return createErrorResponse("File must be a PDF", 400)
    }

    // Validate file size (max 50MB)
    const MAX_FILE_SIZE = 50 * 1024 * 1024
    if (file.size > MAX_FILE_SIZE) {
      return createErrorResponse("File size exceeds 50MB limit", 400)
    }

    // Upload to Supabase Storage
    const buffer = await file.arrayBuffer()
    const filePath = `${userId}/${Date.now()}-${file.name}`

    const { data: uploadData, error: uploadError } = await supabaseServer.storage
      .from("textbooks")
      .upload(filePath, buffer, {
        contentType: "application/pdf",
        upsert: false,
      })

    if (uploadError) {
      console.error("[ERROR] Supabase upload failed:", uploadError)
      await logError({
        endpoint: "POST /api/ingest",
        userId,
        error: uploadError,
      })
      return createErrorResponse("Failed to upload file", 500)
    }

    // Insert document record into rag_documents
    const { data: docData, error: dbError } = await supabaseServer
      .from("rag_documents")
      .insert({
        user_id: userId,
        file_name: file.name,
        mime_type: file.type,
        file_size: file.size,
        metadata: {
          storage_path: uploadData.path,
          uploaded_at: new Date().toISOString(),
        },
      })
      .select()
      .single()

    if (dbError) {
      console.error("[ERROR] Database insert failed:", dbError)
      await logError({
        endpoint: "POST /api/ingest",
        userId,
        error: dbError,
      })
      return createErrorResponse("Failed to save document metadata", 500)
    }

    // Enqueue document processing job to worker
    const workerUrl = process.env.WORKER_URL
    if (workerUrl) {
      try {
        await fetch(`${workerUrl}/enqueue`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            document_id: docData.id,
            storage_path: uploadData.path,
            user_id: userId,
          }),
        })
      } catch (err) {
        console.warn("[WARN] Failed to enqueue worker job:", err)
        // Continue anyway, worker may be offline
      }
    }

    return createSuccessResponse(
      {
        document: docData,
        message: "File uploaded and processing started",
      },
      201,
    )
  } catch (error: any) {
    console.error("[ERROR] Ingest error:", error)
    await logError({
      endpoint: "POST /api/ingest",
      error,
    })
    return createErrorResponse("Internal server error", 500)
  }
}
