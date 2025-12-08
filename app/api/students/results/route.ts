import { type NextRequest, NextResponse } from "next/server"
import { requireAuth, checkParentStudentAccess, logApiAccess } from "@/lib/auth-utils"
import { errorResponse, AppError, ErrorCode } from "@/lib/error-handler"

const isDemoMode = true; // Forced for full mock mode

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAuth(request)
    if (auth instanceof NextResponse) return auth

    const { searchParams } = new URL(request.url)
    const studentId = searchParams.get("studentId")

    if (!studentId) {
      throw new AppError(ErrorCode.VALIDATION_ERROR, "Student ID tələb olunur", 400)
    }

    const studentIdNum = Number.parseInt(studentId)

    if (isDemoMode) {
      // Mock results for demo
      const mockResults = [
        { id: 1, textbook: "Azərbaycan dili", topic: "Sifət", class: "6", score: 85, timeSpent: 120, completedAt: new Date().toISOString() },
        { id: 2, textbook: "Riyaziyyat", topic: "Kəsrlər", class: "6", score: 90, timeSpent: 150, completedAt: new Date(Date.now() - 86400000).toISOString() },
        { id: 3, textbook: "Tarix", topic: "Səfəvilər", class: "6", score: 75, timeSpent: 100, completedAt: new Date(Date.now() - 172800000).toISOString() },
      ]

      const totalTests = mockResults.length
      const averageScore = Math.round(mockResults.reduce((sum: number, r: any) => sum + r.score, 0) / totalTests)
      const bestScore = Math.max(...mockResults.map((r: any) => r.score))

      const subjectBreakdown = [
        { subject: "Azərbaycan dili", count: 1, averageScore: 85 },
        { subject: "Riyaziyyat", count: 1, averageScore: 90 },
        { subject: "Tarix", count: 1, averageScore: 75 },
      ]

      return NextResponse.json({
        success: true,
        results: mockResults,
        statistics: {
          totalTests,
          averageScore,
          bestScore,
          subjectBreakdown,
          recentActivity: mockResults.map((r: any) => ({
            id: r.id,
            subject: r.textbook,
            topic: r.topic,
            score: r.score,
            date: new Date(r.completedAt).toLocaleDateString("az-AZ"),
            time: new Date(r.completedAt).toLocaleTimeString("az-AZ"),
          })),
          monthly: {
            testsThisMonth: 3,
            averageThisMonth: 83
          },
          strongAreas: [{ subject: "Riyaziyyat", averageScore: 90 }],
          weakAreas: [{ subject: "Tarix", averageScore: 75 }],
          performanceTrend: [
            { date: "01.11", score: 70 },
            { date: "05.11", score: 85 },
            { date: "10.11", score: 90 },
          ]
        },
      })
    }

    // Only import Prisma when not in demo mode
    const { prisma } = await import("@/lib/db")

    const hasAccess = await checkParentStudentAccess(auth.user.id, studentIdNum)
    if (!hasAccess) {
      throw new AppError(ErrorCode.FORBIDDEN, "Bu şagirdə giriş icazəniz yoxdur", 403)
    }

    const results = await prisma.testResult.findMany({
      where: { userId: studentIdNum },
      orderBy: { completedAt: "desc" },
      select: {
        id: true,
        textbook: true,
        topic: true,
        class: true,
        score: true,
        timeSpent: true,
        completedAt: true,
      },
    })

    const totalTests = results.length
    const averageScore = totalTests > 0 ? Math.round(results.reduce((sum: number, r: { score: number }) => sum + r.score, 0) / totalTests) : 0
    const bestScore = totalTests > 0 ? Math.max(...results.map((r: { score: number }) => r.score)) : 0

    const subjectStats = await prisma.testResult.groupBy({
      by: ["textbook"],
      where: { userId: studentIdNum },
      _avg: { score: true },
      _count: true,
    })

    const subjectBreakdown = subjectStats.map((stat: { textbook: string; _count: number; _avg: { score: number | null } }) => ({
      subject: stat.textbook,
      count: stat._count,
      averageScore: stat._avg.score ? Math.round(stat._avg.score) : 0,
    }))

    await logApiAccess(auth.user.id, "view_student_results", "test_result", request.ip)

    return NextResponse.json({
      success: true,
      results,
      statistics: {
        totalTests,
        averageScore,
        bestScore,
        subjectBreakdown,
        recentActivity: results.slice(0, 10).map((r: { id: number; textbook: string; topic: string; score: number; completedAt: Date }) => ({
          id: r.id,
          subject: r.textbook,
          topic: r.topic,
          score: r.score,
          date: new Date(r.completedAt).toLocaleDateString("az-AZ"),
        })),
      },
    })
  } catch (error) {
    return errorResponse(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuth(request)
    if (auth instanceof NextResponse) return auth

    const body = await request.json()
    const { studentId, timeRange } = body

    if (!studentId) {
      throw new AppError(ErrorCode.VALIDATION_ERROR, "Student ID tələb olunur", 400)
    }

    if (isDemoMode) {
      // Mock results for demo
      return NextResponse.json({
        success: true,
        results: [],
        count: 0,
      })
    }

    // Only import Prisma when not in demo mode
    const { prisma } = await import("@/lib/db")

    const hasAccess = await checkParentStudentAccess(auth.user.id, studentId)
    if (!hasAccess) {
      throw new AppError(ErrorCode.FORBIDDEN, "Bu şagirdə giriş icazəniz yoxdur", 403)
    }

    let dateFilter = {}
    if (timeRange) {
      const now = new Date()
      const cutoffDate = new Date()

      switch (timeRange) {
        case "week":
          cutoffDate.setDate(now.getDate() - 7)
          break
        case "month":
          cutoffDate.setMonth(now.getMonth() - 1)
          break
        case "3months":
          cutoffDate.setMonth(now.getMonth() - 3)
          break
        case "year":
          cutoffDate.setFullYear(now.getFullYear() - 1)
          break
      }

      dateFilter = { completedAt: { gte: cutoffDate } }
    }

    const results = await prisma.testResult.findMany({
      where: {
        userId: studentId,
        ...dateFilter,
      },
      orderBy: { completedAt: "desc" },
    })

    await logApiAccess(auth.user.id, "filter_student_results", "test_result", request.ip)

    return NextResponse.json({
      success: true,
      results,
      count: results.length,
    })
  } catch (error) {
    return errorResponse(error)
  }
}
