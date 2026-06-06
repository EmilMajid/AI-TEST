import { type NextRequest, NextResponse } from "next/server"
import { AppError, errorResponse, ErrorCode } from "@/lib/error-handler"

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get("file") as File
    const grade = formData.get("grade") as string
    const subject = formData.get("subject") as string
    const userId = formData.get("userId") as string

    if (!file) throw new AppError(ErrorCode.VALIDATION_ERROR, "PDF faylı tələb olunur")
    if (!grade) throw new AppError(ErrorCode.VALIDATION_ERROR, "Sinif tələb olunur")
    if (!subject) throw new AppError(ErrorCode.VALIDATION_ERROR, "Fənn tələb olunur")

    if (!file.name.endsWith(".pdf")) {
      throw new AppError(ErrorCode.VALIDATION_ERROR, "Yalnız PDF faylları qəbul olunur")
    }

    if (file.size > 10 * 1024 * 1024) {
      throw new AppError(ErrorCode.VALIDATION_ERROR, "Fayl 10MB-dan böyük ola bilməz")
    }

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000"

    const backendFormData = new FormData()
    backendFormData.append("file", file)
    backendFormData.append("grade", grade)
    backendFormData.append("subject", subject)
    if (userId) backendFormData.append("userId", userId)
    backendFormData.append("filename", file.name)
    backendFormData.append("timestamp", new Date().toISOString())

    const response = await fetch(`${backendUrl}/api/rag/ingest`, {
      method: "POST",
      body: backendFormData,
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: "Unknown error" }))
      throw new AppError(ErrorCode.INTERNAL_ERROR, error.detail || "Dərslik yüklənməsi uğursuz oldu", response.status)
    }

    const result = await response.json()

    return NextResponse.json({
      success: true,
      message: "Dərslik uğurla yükləndi və indeksə əlavə edildi",
      data: {
        ...result,
        metadata: {
          filename: file.name,
          uploadedAt: new Date().toISOString(),
          uploadedBy: userId || "anonymous",
          fileSize: file.size,
          grade,
          subject,
        },
      },
    })
  } catch (error) {
    return errorResponse(error)
  }
}

// Deleted deprecated config export
