export const dynamic = "force-dynamic"
import { type NextRequest, NextResponse } from "next/server"
import { sendTestResultNotification } from "@/lib/email-service"
import { getAuthContext } from "@/lib/auth-utils"

export async function POST(request: NextRequest) {
  try {
    const auth = await getAuthContext(request)
    const body = await request.json()

    const targetEmail = (body.parentEmail || auth?.user?.email || "").trim()

    if (!targetEmail || !targetEmail.includes("@")) {
      return NextResponse.json(
        { success: false, error: "Etibarlı e-mail ünvanı daxil edin" },
        { status: 400 }
      )
    }

    const emailRes = await sendTestResultNotification({
      parentEmail: targetEmail,
      parentName: body.parentName || "Valideyn",
      studentName: body.studentName || auth?.user?.firstName || "Şagird",
      studentClass: String(body.studentClass || body.class || ""),
      textbook: body.textbook || "Ümumi test",
      topic: body.topic || "Mövzu sınağı",
      score: Number(body.score || 0),
      correctCount: Number(body.correctCount || body.correctAnswers || 0),
      totalQuestions: Number(body.totalQuestions || 10),
      timeSpentMinutes: Math.max(1, Math.round(Number(body.timeSpent || 60) / 60)),
      completedAt: body.completedAt || new Date().toISOString(),
    })

    if (emailRes.success) {
      const recipientMsg = emailRes.redirectedTo
        ? `${emailRes.redirectedTo} ünvanına (Demo yönləndirmə: ${targetEmail})`
        : targetEmail

      return NextResponse.json({
        success: true,
        message: `Test nəticələri uğurla ${recipientMsg} ünvanına göndərildi! 🚀`,
        redirectedTo: emailRes.redirectedTo,
        messageId: emailRes.messageId,
      })
    } else {
      return NextResponse.json(
        { success: false, error: emailRes.error || "E-mail göndərilə bilmədi" },
        { status: 500 }
      )
    }
  } catch (error: any) {
    console.error("[send-result API error]:", error)
    return NextResponse.json(
      { success: false, error: error?.message || "Server xətası baş verdi" },
      { status: 500 }
    )
  }
}
