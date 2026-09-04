export const dynamic = "force-dynamic"
import { type NextRequest, NextResponse } from "next/server"
import { getAuthContext } from "@/lib/auth-utils"
import { getTestResultsForStudent } from "@/lib/test-result-store"
import { sendTestResultNotification } from "@/lib/email-service"

export async function POST(request: NextRequest) {
  try {
    const auth = await getAuthContext(request)
    const body = await request.json()
    const { studentId, studentName, studentEmail, parentEmail: reqParentEmail } = body

    const targetEmail = (auth?.user?.email || reqParentEmail || "").trim()

    if (!targetEmail || !targetEmail.includes("@")) {
      return NextResponse.json(
        { success: false, error: "Valideyn e-mail ünvanı tapılmadı" },
        { status: 400 }
      )
    }

    const results = getTestResultsForStudent(studentId, studentEmail, studentName)

    if (results.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Bu şagird üçün hələlik heç bir test nəticəsi tapılmadı",
        },
        { status: 404 }
      )
    }

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
        ? `Hesabat ${targetEmail} ünvanına göndərildi!`
        : (emailRes.error || "E-mail göndərilə bilmədi"),
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
