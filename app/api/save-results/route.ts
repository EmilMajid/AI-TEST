import { type NextRequest, NextResponse } from "next/server"
import { testResultsSchema } from "@/lib/validations"
import { prisma } from "@/lib/db"
import { requireAuth, logApiAccess } from "@/lib/auth-utils"
import { errorResponse, AppError, ErrorCode } from "@/lib/error-handler"

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuth(request)
    if (auth instanceof NextResponse) return auth

    const body = await request.json()

    const validatedData = testResultsSchema.parse(body)

    const testResult = await prisma.testResult.create({
      data: {
        userId: auth.user.id,
        textbook: validatedData.testData.textbook,
        topic: validatedData.testData.topic,
        class: validatedData.testData.class,
        score: validatedData.score,
        timeSpent: validatedData.timeSpent,
        completedAt: validatedData.completedAt,
        answers: validatedData.answers,
      },
    })

    await logApiAccess(auth.user.id, "save_test_result", "test_result", request.ip)

    return NextResponse.json(
      {
        success: true,
        message: "Test nəticəsi uğurla saxlanıldı",
        resultId: testResult.id,
        savedAt: testResult.savedAt,
      },
      { status: 201 },
    )
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return errorResponse(new AppError(ErrorCode.VALIDATION_ERROR, "Test məlumatları düzgün formatda deyil", 400))
    }
    return errorResponse(error)
  }
}

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAuth(request)
    if (auth instanceof NextResponse) return auth

    const results = await prisma.testResult.findMany({
      where: { userId: auth.user.id },
      orderBy: { completedAt: "desc" },
      select: {
        id: true,
        textbook: true,
        topic: true,
        class: true,
        score: true,
        timeSpent: true,
        completedAt: true,
        savedAt: true,
      },
    })

    await logApiAccess(auth.user.id, "view_test_results", "test_result", request.ip)

    return NextResponse.json({
      success: true,
      results,
    })
  } catch (error) {
    return errorResponse(error)
  }
}
