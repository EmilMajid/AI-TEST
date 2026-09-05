export const dynamic = "force-dynamic"
import { type NextRequest, NextResponse } from "next/server"
import { requireAuth, checkParentStudentAccess, logApiAccess } from "@/lib/auth-utils"
import { errorResponse, AppError, ErrorCode } from "@/lib/error-handler"
import { getTestResultsForStudent } from "@/lib/test-result-store"
import { INCI_TEST_RESULTS, EMILIA_TEST_RESULTS } from "@/lib/demo-showcase-data"

const isDemoMode = true // Forced for full mock mode

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAuth(request)
    if (auth instanceof NextResponse) return auth

    const { searchParams } = new URL(request.url)
    const studentId = searchParams.get("studentId")
    const timeRange = searchParams.get("timeRange") || "month"
    const studentEmail = searchParams.get("email") || undefined

    if (!studentId) {
      throw new AppError(ErrorCode.VALIDATION_ERROR, "Student ID tələb olunur", 400)
    }

    const studentIdNum = Number.parseInt(studentId)
    const isNumericId = !isNaN(studentIdNum)

    if (isDemoMode) {
      // 1. Check if real test results exist for this student in test-result-store
      const storedResults = getTestResultsForStudent(studentId, studentEmail)

      if (storedResults.length > 0) {
        // Calculate REAL statistics from real stored results
        const totalTests = storedResults.length
        const totalScore = storedResults.reduce((sum, r) => sum + r.score, 0)
        const averageScore = Math.round(totalScore / totalTests)
        const bestScore = Math.max(...storedResults.map((r) => r.score))

        // Group by subject (textbook)
        const subjectMap: Record<string, { totalScore: number; count: number }> = {}
        for (const r of storedResults) {
          if (!subjectMap[r.textbook]) {
            subjectMap[r.textbook] = { totalScore: 0, count: 0 }
          }
          subjectMap[r.textbook].totalScore += r.score
          subjectMap[r.textbook].count += 1
        }

        const subjectBreakdown = Object.entries(subjectMap).map(([subject, data]) => {
          const avg = Math.round(data.totalScore / data.count)
          return {
            subject,
            count: data.count,
            averageScore: avg,
            comparison: {
              schoolAverage: Math.max(55, Math.min(82, Math.round(avg * 0.82))),
              regionAverage: Math.max(50, Math.min(78, Math.round(avg * 0.78))),
              nationalAverage: Math.max(48, Math.min(74, Math.round(avg * 0.74))),
            },
          }
        })

        const comparisonData = subjectBreakdown.map((s) => ({
          subject: s.subject,
          student: s.averageScore,
          school: s.comparison.schoolAverage,
          region: s.comparison.regionAverage,
          national: s.comparison.nationalAverage,
        }))

        const recentActivity = storedResults.slice(0, 10).map((r, idx) => ({
          id: r.id || idx + 1,
          subject: r.textbook,
          topic: r.topic,
          score: r.score,
          date: new Date(r.completedAt).toLocaleDateString("az-AZ"),
          time: new Date(r.completedAt).toLocaleTimeString("az-AZ", { hour: "2-digit", minute: "2-digit" }),
        }))

        const strongAreas = subjectBreakdown.filter((s) => s.averageScore >= 90).slice(0, 3)
        const weakAreas = (subjectBreakdown.filter((s) => s.averageScore < 90).length > 0
          ? subjectBreakdown.filter((s) => s.averageScore < 90)
          : subjectBreakdown.slice(-2)
        ).slice(0, 3)

        // Generate smooth chronological progress trend for showcase
        const performanceTrend = [
          { date: "4 həftə əvvəl", score: Math.max(60, averageScore - 11), subject: "Ümumi" },
          { date: "3 həftə əvvəl", score: Math.max(65, averageScore - 8), subject: "Ümumi" },
          { date: "2 həftə əvvəl", score: Math.max(70, averageScore - 4), subject: "Ümumi" },
          { date: "Keçən həftə", score: Math.max(75, averageScore - 1), subject: "Ümumi" },
          { date: "Cari həftə", score: averageScore, subject: "Ümumi" },
        ]

        return NextResponse.json({
          success: true,
          hasRealData: true,
          results: storedResults,
          statistics: {
            totalTests,
            averageScore,
            bestScore,
            subjectBreakdown,
            comparisonData,
            recentTests: storedResults,
            recentActivity,
            monthly: {
              testsThisMonth: storedResults.length,
              averageThisMonth: averageScore,
            },
            strongAreas: strongAreas.length > 0 ? strongAreas : subjectBreakdown.slice(0, 2),
            weakAreas: weakAreas.length > 0 ? weakAreas : subjectBreakdown.slice(-2),
            performanceTrend,
          },
        })
      }

      // 2. If it's a seed/demo student without stored results, provide initial demo baseline
      const isInci = studentId === "student-inci" || studentId === "student-1" || studentEmail?.toLowerCase() === "inci.mecidzade@test.com"
      const isEmilia = studentId === "student-emilia" || studentId === "student-2" || studentEmail?.toLowerCase() === "emilia.mecidzade@test.com"

      if (isInci || isEmilia) {
        const showcaseResults = isInci ? INCI_TEST_RESULTS : EMILIA_TEST_RESULTS
        const totalTests = showcaseResults.length
        const totalScore = showcaseResults.reduce((sum, r) => sum + r.score, 0)
        const averageScore = Math.round(totalScore / totalTests)
        const bestScore = Math.max(...showcaseResults.map((r) => r.score))

        const subjectMap: Record<string, { totalScore: number; count: number }> = {}
        for (const r of showcaseResults) {
          if (!subjectMap[r.textbook]) {
            subjectMap[r.textbook] = { totalScore: 0, count: 0 }
          }
          subjectMap[r.textbook].totalScore += r.score
          subjectMap[r.textbook].count += 1
        }

        const subjectBreakdown = Object.entries(subjectMap).map(([subject, data]) => {
          const avg = Math.round(data.totalScore / data.count)
          return {
            subject,
            count: data.count,
            averageScore: avg,
            comparison: {
              schoolAverage: Math.max(55, Math.min(82, Math.round(avg * 0.82))),
              regionAverage: Math.max(50, Math.min(78, Math.round(avg * 0.78))),
              nationalAverage: Math.max(48, Math.min(74, Math.round(avg * 0.74))),
            },
          }
        })

        const comparisonData = subjectBreakdown.map((s) => ({
          subject: s.subject,
          student: s.averageScore,
          school: s.comparison.schoolAverage,
          region: s.comparison.regionAverage,
          national: s.comparison.nationalAverage,
        }))

        const recentActivity = showcaseResults.slice(0, 10).map((r, idx) => ({
          id: r.id || idx + 1,
          subject: r.textbook,
          topic: r.topic,
          score: r.score,
          date: new Date(r.completedAt).toLocaleDateString("az-AZ"),
          time: new Date(r.completedAt).toLocaleTimeString("az-AZ", { hour: "2-digit", minute: "2-digit" }),
        }))

        const strongAreas = subjectBreakdown.filter((s) => s.averageScore >= 90).slice(0, 3)
        const weakAreas = (subjectBreakdown.filter((s) => s.averageScore < 90).length > 0
          ? subjectBreakdown.filter((s) => s.averageScore < 90)
          : subjectBreakdown.slice(-2)
        ).slice(0, 3)

        const performanceTrend = [
          { date: "4 həftə əvvəl", score: Math.max(60, averageScore - 11), subject: "Ümumi" },
          { date: "3 həftə əvvəl", score: Math.max(65, averageScore - 8), subject: "Ümumi" },
          { date: "2 həftə əvvəl", score: Math.max(70, averageScore - 4), subject: "Ümumi" },
          { date: "Keçən həftə", score: Math.max(75, averageScore - 1), subject: "Ümumi" },
          { date: "Cari həftə", score: averageScore, subject: "Ümumi" },
        ]

        return NextResponse.json({
          success: true,
          hasRealData: true,
          results: showcaseResults,
          statistics: {
            totalTests,
            averageScore,
            bestScore,
            subjectBreakdown,
            comparisonData,
            recentTests: showcaseResults,
            recentActivity,
            monthly: {
              testsThisMonth: showcaseResults.length,
              averageThisMonth: averageScore,
            },
            strongAreas: strongAreas.length > 0 ? strongAreas : subjectBreakdown.slice(0, 2),
            weakAreas: weakAreas.length > 0 ? weakAreas : subjectBreakdown.slice(-2),
            performanceTrend,
          },
        })
      }

      const isAli = studentId === "student-ali"
      const isFatime = studentId === "student-fatime"

      if (isAli || isFatime) {
        const subjects = isAli
          ? ["Riyaziyyat", "Fizika", "İnformatika", "Azərbaycan dili", "Ədəbiyyat"]
          : ["Azərbaycan dili", "Riyaziyyat", "Həyat bilgisi", "İngilis dili"]

        const baseScore = isAli ? 84 : 78
        const mockResults = subjects.map((sub, idx) => ({
          id: idx + 1,
          textbook: sub,
          topic: "Fəsil " + (idx + 1),
          class: isAli ? "8" : "5",
          score: baseScore - (idx % 3) * 5,
          timeSpent: 45 + idx * 5,
          completedAt: new Date(Date.now() - idx * 86400000).toISOString(),
        }))

        const totalTests = mockResults.length
        const averageScore = Math.round(
          mockResults.reduce((sum: number, r: any) => sum + r.score, 0) / mockResults.length
        )
        const bestScore = Math.max(...mockResults.map((r: any) => r.score))

        const subjectBreakdown = subjects.map((sub, idx) => {
          const sScore = baseScore - (idx % 3) * 5
          return {
            subject: sub,
            count: 2,
            averageScore: sScore,
            comparison: {
              schoolAverage: Math.round(sScore * 0.94),
              regionAverage: Math.round(sScore * 0.91),
              nationalAverage: Math.round(sScore * 0.88),
            },
          }
        })

        return NextResponse.json({
          success: true,
          hasRealData: false,
          results: mockResults,
          statistics: {
            totalTests,
            averageScore,
            bestScore,
            subjectBreakdown,
            comparisonData: subjectBreakdown.map((s) => ({
              subject: s.subject,
              student: s.averageScore,
              school: s.comparison.schoolAverage,
              region: s.comparison.regionAverage,
              national: s.comparison.nationalAverage,
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
              averageThisMonth: averageScore,
            },
            strongAreas: subjectBreakdown.filter((s) => s.averageScore >= 80).slice(0, 3),
            weakAreas: subjectBreakdown.filter((s) => s.averageScore < 80).slice(0, 3),
            performanceTrend: [
              { date: "Bugün", score: averageScore },
              { date: "Keçən həftə", score: averageScore - 3 },
              { date: "Keçən ay", score: averageScore - 6 },
            ],
          },
        })
      }

      // 3. For any newly registered student who hasn't taken tests yet, show clean zero state
      return NextResponse.json({
        success: true,
        hasRealData: false,
        results: [],
        statistics: {
          totalTests: 0,
          averageScore: 0,
          bestScore: 0,
          subjectBreakdown: [],
          comparisonData: [],
          recentTests: [],
          recentActivity: [],
          monthly: {
            testsThisMonth: 0,
            averageThisMonth: 0,
          },
          strongAreas: [],
          weakAreas: [],
          performanceTrend: [],
        },
      })
    }

    // Only import Prisma when not in demo mode
    const { prisma } = await import("@/lib/db")

    const hasAccess = await checkParentStudentAccess(auth.user.id as any, studentIdNum)
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

    await logApiAccess(Number(auth.user.id) || 1, "view_student_results", "student", request.ip)

    if (results.length === 0) {
      return NextResponse.json({
        success: true,
        results: [],
        statistics: {
          totalTests: 0,
          averageScore: 0,
          bestScore: 0,
          subjectBreakdown: [],
          recentTests: [],
          strongAreas: [],
          weakAreas: [],
        },
      })
    }

    const totalTests = results.length
    const averageScore = Math.round(results.reduce((sum: number, r: { score: number }) => sum + r.score, 0) / totalTests)
    const bestScore = Math.max(...results.map((r: { score: number }) => r.score))

    return NextResponse.json({
      success: true,
      results,
      statistics: {
        totalTests,
        averageScore,
        bestScore,
        recentTests: results.slice(0, 5),
      },
    })
  } catch (error) {
    return errorResponse(error)
  }
}
