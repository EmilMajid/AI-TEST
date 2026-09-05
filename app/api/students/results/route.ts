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
      // 1. Check if real test results exist for this student in test-result-store & Supabase
      const uniqueId = searchParams.get("uniqueId") || undefined
      const storedResults = getTestResultsForStudent(studentId, studentEmail, undefined, uniqueId)

      try {
        const { supabaseAdmin } = await import("@/lib/user-store")
        if (supabaseAdmin) {
          let sUserId: number | null = null
          if (isNumericId) {
            sUserId = studentIdNum
          } else if (studentEmail) {
            const { data: uData } = await supabaseAdmin
              .from("User")
              .select("id")
              .eq("email", studentEmail.toLowerCase())
              .maybeSingle()
            if (uData?.id) sUserId = uData.id
          }
          if (!sUserId && studentId) {
            const { data: allStudents } = await supabaseAdmin
              .from("User")
              .select("id, email")
              .eq("accountType", "student")
            if (allStudents) {
              const matchedU = allStudents.find((u: any) =>
                studentId.toLowerCase().includes(u.email.split("@")[0].toLowerCase()) ||
                u.email.toLowerCase().includes(studentId.toLowerCase().replace("student-", ""))
              )
              if (matchedU) sUserId = matchedU.id
            }
          }

          if (sUserId) {
            const { data: trRows } = await supabaseAdmin
              .from("TestResult")
              .select("*")
              .eq("userId", sUserId)
              .order("completedAt", { ascending: false })

            if (trRows && trRows.length > 0) {
              for (const r of trRows) {
                if (!storedResults.some((s) => String(s.id) === String(r.id) || (s.textbook === r.textbook && s.completedAt === r.completedAt))) {
                  storedResults.push({
                    id: r.id,
                    studentId: studentId,
                    studentEmail: studentEmail,
                    textbook: r.textbook,
                    topic: r.topic || "Ümumi sınaq",
                    class: r.class || "6",
                    score: r.score,
                    timeSpent: r.timeSpent || 60,
                    completedAt: r.completedAt,
                    correctAnswers: Math.round((r.score / 100) * 10),
                    totalQuestions: 10,
                  })
                }
              }
            }
          }
        }
      } catch (err) {
        console.error("Supabase test results query error:", err)
      }

      if (storedResults.length > 0) {
        // Calculate REAL statistics from real stored results
        const totalTests = storedResults.length
        const totalScore = storedResults.reduce((sum, r) => sum + r.score, 0)
        const averageScore = Math.round(totalScore / totalTests)
        const bestScore = Math.max(...storedResults.map((r) => r.score))

        // Platforma üzrə orta hesabla (eyni sinif üçün mövcud bütün nəticələr)
        const { getAllTestResults } = await import("@/lib/test-result-store")
        const allResults = getAllTestResults()
        const studentClass = storedResults[0]?.class || ""
        const platformResultsForClass = studentClass
          ? allResults.filter((r) => r.class === studentClass)
          : []

        // Group by subject (textbook) — topicBreakdown ilə birlikdə
        const subjectTopicMap: Record<string, {
          totalScore: number
          count: number
          topics: Record<string, { totalCorrect: number; totalQ: number; count: number }>
        }> = {}

        for (const r of storedResults) {
          if (!subjectTopicMap[r.textbook]) {
            subjectTopicMap[r.textbook] = { totalScore: 0, count: 0, topics: {} }
          }
          subjectTopicMap[r.textbook].totalScore += r.score
          subjectTopicMap[r.textbook].count += 1

          // Mövzu səviyyəsində statistika
          const topicKey = r.topic || "Ümumi"
          if (!subjectTopicMap[r.textbook].topics[topicKey]) {
            subjectTopicMap[r.textbook].topics[topicKey] = { totalCorrect: 0, totalQ: 0, count: 0 }
          }
          subjectTopicMap[r.textbook].topics[topicKey].totalCorrect += r.correctAnswers || Math.round((r.score / 100) * (r.totalQuestions || 10))
          subjectTopicMap[r.textbook].topics[topicKey].totalQ += r.totalQuestions || 10
          subjectTopicMap[r.textbook].topics[topicKey].count += 1
        }

        const subjectBreakdown = Object.entries(subjectTopicMap).map(([subject, data]) => {
          const avg = Math.round(data.totalScore / data.count)

          // Platform ortalaması: eyni fənn + sinif
          const platformForSubject = platformResultsForClass.filter((r) => r.textbook === subject)
          const platformAvg = platformForSubject.length > 0
            ? Math.round(platformForSubject.reduce((s, r) => s + r.score, 0) / platformForSubject.length)
            : null

          // topicBreakdown — mövzu üzrə doğruluk nisbəti
          const topicBreakdown = Object.entries(data.topics).map(([topic, td]) => ({
            topic,
            correctRate: td.totalQ > 0 ? Math.round((td.totalCorrect / td.totalQ) * 100) : 0,
            testCount: td.count,
          })).sort((a, b) => b.testCount - a.testCount)

          return {
            subject,
            count: data.count,
            averageScore: avg,
            topicBreakdown,
            comparison: {
              schoolAverage: platformAvg ?? Math.max(55, Math.min(82, Math.round(avg * 0.82))),
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

        // recentActivity — correctAnswers, totalQuestions, timeSpent ilə zənginləşdirilmiş
        const recentActivity = storedResults.slice(0, 10).map((r, idx) => ({
          id: r.id || idx + 1,
          subject: r.textbook,
          topic: r.topic,
          score: r.score,
          date: new Date(r.completedAt).toLocaleDateString("az-AZ"),
          time: new Date(r.completedAt).toLocaleTimeString("az-AZ", { hour: "2-digit", minute: "2-digit" }),
          correctAnswers: r.correctAnswers || Math.round((r.score / 100) * (r.totalQuestions || 10)),
          totalQuestions: r.totalQuestions || 10,
          timeSpent: r.timeSpent ? `${Math.max(1, Math.round(r.timeSpent / 60))} dəq` : undefined,
        }))

        // strongAreas (≥80%) / weakAreas (<65%) — daha real eşiklər
        const strongAreas = subjectBreakdown.filter((s) => s.averageScore >= 80).slice(0, 3)
        const weakAreas = subjectBreakdown.filter((s) => s.averageScore < 65).slice(0, 3)

        // learningVelocity — son 4 həftəlik orta bal trendi
        const sortedByDate = [...storedResults].sort(
          (a, b) => new Date(a.completedAt).getTime() - new Date(b.completedAt).getTime()
        )
        const now = Date.now()
        const weekMs = 7 * 24 * 60 * 60 * 1000
        const weekLabels = ["4 həftə əvvəl", "3 həftə əvvəl", "2 həftə əvvəl", "Keçən həftə", "Cari həftə"]
        const learningVelocity = weekLabels.map((label, i) => {
          const weekStart = now - (4 - i) * weekMs
          const weekEnd = now - (3 - i) * weekMs
          const weekResults = sortedByDate.filter((r) => {
            const t = new Date(r.completedAt).getTime()
            return t >= weekStart && t < weekEnd
          })
          return {
            week: label,
            avgScore: weekResults.length > 0
              ? Math.round(weekResults.reduce((s, r) => s + r.score, 0) / weekResults.length)
              : null,
            testCount: weekResults.length,
          }
        })

        // performanceTrend — xronoloji real trendi göstər
        const performanceTrend = sortedByDate.slice(-7).map((r) => ({
          date: new Date(r.completedAt).toLocaleDateString("az-AZ"),
          score: r.score,
          subject: r.textbook,
        }))

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
            learningVelocity,
            monthly: {
              testsThisMonth: storedResults.length,
              averageThisMonth: averageScore,
            },
            strongAreas: strongAreas.length > 0 ? strongAreas : subjectBreakdown.slice(0, 2),
            weakAreas: weakAreas.length > 0 ? weakAreas : [],
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
