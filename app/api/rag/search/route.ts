import { type NextRequest, NextResponse } from "next/server"
import { AppError, errorResponse, ErrorCode } from "@/lib/error-handler"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { query, grade, subject, k = 5, userId } = body

    if (!query) throw new AppError(ErrorCode.VALIDATION_ERROR, "Sual tələb olunur")
    if (!grade) throw new AppError(ErrorCode.VALIDATION_ERROR, "Sinif tələb olunur")
    if (!subject) throw new AppError(ErrorCode.VALIDATION_ERROR, "Fənn tələb olunur")

    if (query.length < 2) {
      throw new AppError(ErrorCode.VALIDATION_ERROR, "Sual ən azı 2 simvol olmalıdır")
    }

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000"

    console.log("[v0] RAG search initiated:", { query, grade, subject, k, userId })

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 30000)

    try {
      const response = await fetch(`${backendUrl}/api/rag/search`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query,
          grade: Number.parseInt(grade),
          subject,
          k: Math.min(Number.parseInt(k), 10),
          userId,
        }),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: "Unknown error" }))
        throw new AppError(ErrorCode.INTERNAL_ERROR, error.detail || "RAG axtarışı uğursuz oldu", response.status)
      }

      const results = await response.json()

      return NextResponse.json({
        success: true,
        results: results.results || [],
        context: results.context || "",
        metadata: {
          query,
          resultsCount: results.results?.length || 0,
          grade,
          subject,
          searchedAt: new Date().toISOString(),
        },
      })
    } catch (fetchError: any) {
      clearTimeout(timeoutId)

      if (fetchError.name === "AbortError") {
        throw new AppError(ErrorCode.INTERNAL_ERROR, "RAG axtarışı zaman aşımına uğradı (30 saniyə)", 408)
      }
      throw fetchError
    }
  } catch (error) {
    return errorResponse(error)
  }
}
