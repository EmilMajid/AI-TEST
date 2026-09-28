export const dynamic = "force-dynamic"
import { type NextRequest, NextResponse } from "next/server"
import { getAuthContext } from "@/lib/auth-utils"
import { getTestResultsForStudent } from "@/lib/test-result-store"
import { sendTestResultNotification } from "@/lib/email-service"

export async function POST(request: NextRequest) {
  try {
    const auth = await getAuthContext(request)
    const body = await request.json()
    const {
      studentId,
      studentName,
      studentEmail,
      parentEmail: reqParentEmail,
      studentStats: frontendStats,  // Frontend-dən gələn fallback statistika
    } = body

    const targetEmail = (auth?.user?.email || reqParentEmail || "").trim()

    if (!targetEmail || !targetEmail.includes("@")) {
      return NextResponse.json(
        { success: false, error: "Valideyn e-mail ünvanı tapılmadı" },
        { status: 400 }
      )
    }

    // 1. Disk nəticələrini yoxla
    const results = getTestResultsForStudent(studentId, studentEmail, studentName)

    if (results.length > 0) {
      // ── Real disk nəticəsi mövcuddur ──
      const latest = results[0]
      const avgScore = Math.round(
        results.reduce((sum, r) => sum + r.score, 0) / results.length
      )

      const emailRes = await sendTestResultNotification({
        parentEmail: targetEmail,
        parentName: auth?.user?.email ? "Hörmətli Valideyn" : undefined,
        studentName: studentName || latest.studentName || "Şagird",
        studentClass: latest.class,
        textbook: latest.textbook,
        topic: `${latest.topic} (Son Nəticə)`,
        score: latest.score,
        correctCount: latest.correctAnswers,
        totalQuestions: latest.totalQuestions,
        timeSpentMinutes: Math.max(1, Math.round(latest.timeSpent / 60)),
        completedAt: latest.completedAt,
      })

      return NextResponse.json({
        success: emailRes.success,
        message: emailRes.success
          ? `Hesabat ${targetEmail} ünvanına göndərildi! (${results.length} test nəticəsi, orta bal: ${avgScore}%)`
          : (emailRes.error || "E-mail göndərilə bilmədi"),
        simulated: emailRes.simulated,
      })
    }

    // 2. Disk boşdur, amma frontend statistika göndəribsə, ondan istifadə et
    if (frontendStats && frontendStats.totalTests > 0) {
      const avgScore = frontendStats.averageScore || 0
      const totalTests = frontendStats.totalTests || 0
      const bestScore = frontendStats.bestScore || 0
      const strongSubjects = (frontendStats.strongAreas || []).map((a: any) => a.subject).join(", ") || "—"
      const weakSubjects = (frontendStats.weakAreas || []).map((a: any) => a.subject).join(", ") || "—"

      const emailRes = await sendTestResultNotification({
        parentEmail: targetEmail,
        parentName: auth?.user?.email ? "Hörmətli Valideyn" : undefined,
        studentName: studentName || "Şagird",
        studentClass: "—",
        textbook: strongSubjects,
        topic: `Ümumi Hesabat — ${totalTests} test, orta bal ${avgScore}%, ən yaxşı ${bestScore}%. Güclü: ${strongSubjects}. İnkişaf: ${weakSubjects}.`,
        score: avgScore,
        correctCount: Math.round((avgScore / 100) * 10),
        totalQuestions: 10,
        timeSpentMinutes: 5,
        completedAt: new Date().toISOString(),
      })

      return NextResponse.json({
        success: emailRes.success,
        message: emailRes.success
          ? `Ümumi hesabat ${targetEmail} ünvanına göndərildi! (${totalTests} test, orta bal: ${avgScore}%)`
          : (emailRes.error || "E-mail göndərilə bilmədi"),
        simulated: emailRes.simulated,
      })
    }

    // 3. Nə disk, nə frontend datası — xülasə məktub göndər (404 deyil!)
    const emailRes = await sendTestResultNotification({
      parentEmail: targetEmail,
      parentName: "Hörmətli Valideyn",
      studentName: studentName || "Övladınız",
      studentClass: "—",
      textbook: "TestAI.az",
      topic: "Şagird hələ test tamamlamamışdır. Test işlədikdən sonra nəticələr avtomatik bildiriləcək.",
      score: 0,
      correctCount: 0,
      totalQuestions: 0,
      timeSpentMinutes: 0,
      completedAt: new Date().toISOString(),
    })

    return NextResponse.json({
      success: true,
      message: `Məlumat məktubu ${targetEmail} ünvanına göndərildi.`,
      simulated: emailRes.simulated,
    })
  } catch (error: any) {
    console.error("Error sending manual report:", error)
    return NextResponse.json(
      { success: false, error: error?.message || "Xəta baş verdi" },
      { status: 500 }
    )
  }
}
