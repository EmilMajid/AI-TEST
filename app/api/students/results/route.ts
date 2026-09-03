export const dynamic = "force-dynamic"
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
    const timeRange = searchParams.get("timeRange") || "month"

    if (!studentId) {
      throw new AppError(ErrorCode.VALIDATION_ERROR, "Student ID tələb olunur", 400)
    }

    const studentIdNum = Number.parseInt(studentId)
    const isNumericId = !isNaN(studentIdNum)

    if (isDemoMode) {
      // Mock results for demo
      // Determine what subjects to show based on student
      const isAli = studentId === "student-ali"
      const isFatime = studentId === "student-fatime"

      const subjects = isAli
        ? ["Riyaziyyat", "Fizika", "İnformatika", "Azərbaycan dili", "Ədəbiyyat", "Coğrafiya", "Kimya", "Biologiya", "Ümumi tarix"]
        : ["Azərbaycan dili", "Riyaziyyat", "Həyat bilgisi", "İngilis dili", "Təsviri incəsənət", "Musiqi", "Texnologiya"]

      const mockResults = subjects.map((sub, idx) => ({
        id: idx + 1,
        textbook: sub,
        topic: "Fəsil " + (idx + 1),
        class: isAli ? "8" : "5",
        score: Math.floor(Math.random() * 30) + (timeRange === 'year' ? 60 : 70), // Slightly lower base for year
        timeSpent: Math.floor(Math.random() * 60) + 40,
        completedAt: new Date(Date.now() - (idx * 86400000)).toISOString()
      }))

      const totalTests = timeRange === 'day' ? 1 : timeRange === 'week' ? 3 : timeRange === 'month' ? mockResults.length : mockResults.length * 4
      const averageScore = Math.round(mockResults.reduce((sum: number, r: any) => sum + r.score, 0) / mockResults.length)
      const bestScore = Math.max(...mockResults.map((r: any) => r.score))

      const subjectBreakdown = subjects.map(sub => {
        const subResults = mockResults.filter(r => r.textbook === sub)
        const avg = Math.round(subResults.reduce((sum, r) => sum + r.score, 0) / subResults.length)
        return {
          subject: sub,
          count: timeRange === 'day' ? 1 : timeRange === 'week' ? 2 : timeRange === 'month' ? subResults.length : subResults.length * 3,
          averageScore: avg,
          comparison: {
            schoolAverage: Math.max(0, Math.min(100, avg + (Math.random() * 10 - 5))),
            regionAverage: Math.max(0, Math.min(100, avg + (Math.random() * 14 - 7))),
            nationalAverage: Math.max(0, Math.min(100, avg + (Math.random() * 20 - 10)))
          }
        }
      })

      return NextResponse.json({
        success: true,
        results: mockResults,
        statistics: {
          totalTests,
          averageScore,
          bestScore,
          subjectBreakdown,
          comparisonData: subjectBreakdown.map(s => ({
            subject: s.subject,
            student: s.averageScore,
            school: s.comparison.schoolAverage,
            region: s.comparison.regionAverage,
            national: s.comparison.nationalAverage
          })),
          recentTests: mockResults,
          recentActivity: mockResults.map((r: any) => ({
            id: r.id,
            subject: r.textbook,
            topic: r.topic,
            score: r.score,
            date: new Date(r.completedAt).toLocaleDateString("az-AZ"),
            time: new Date(r.completedAt).toLocaleTimeString("az-AZ"),
          })),
          monthly: {
            testsThisMonth: mockResults.length,
            averageThisMonth: averageScore
          },
          strongAreas: subjectBreakdown.filter(s => s.averageScore >= 85).slice(0, 3),
          weakAreas: subjectBreakdown.filter(s => s.averageScore < 80).slice(0, 3),
          performanceTrend: [
            { date: "Bugün", score: averageScore },
            { date: "Keçən həftə", score: averageScore - 5 },
            { date: "Keçən ay", score: averageScore - 10 },
            { date: "Keçən il", score: averageScore - 15 },
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
