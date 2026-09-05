export const dynamic = "force-dynamic"
import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { saveTestResult, type StoredTestResult } from "@/lib/test-result-store"
import { getAllUsers, loadLinksFromDisk } from "@/lib/user-store"
import { sendTestResultNotification } from "@/lib/email-service"
import { getAuthContext } from "@/lib/auth-utils"

export async function POST(request: NextRequest) {
  try {
    const auth = await getAuthContext(request)
    const body = await request.json()

    const studentId = body.studentId || auth?.user?.id || `student-${Date.now()}`
    const studentEmail = body.studentEmail || auth?.user?.email || ""
    const studentName = body.studentName || `${auth?.user?.id || "Şagird"}`
    const uniqueId = body.uniqueId || ""

    if (!body.textbook || body.score === undefined) {
      return NextResponse.json(
        { success: false, error: "Fənn və bal tələb olunur" },
        { status: 400 }
      )
    }

    const testScore = Math.max(0, Math.min(100, Number(body.score)))
    const timeSpentSeconds = Number(body.timeSpent || body.timeSpen || 60)
    const timeSpentMinutes = Math.max(1, Math.round(timeSpentSeconds / 60))
    const totalQuestions = Number(body.totalQuestions || (body.detailedResults ? body.detailedResults.length : 10))
    const correctAnswers = Number(body.correctAnswers || Math.round((testScore / 100) * totalQuestions))

    // 1. Save test result to persistent disk store
    const storedResult: StoredTestResult = {
      id: body.id || `res-${Date.now()}`,
      studentId,
      studentEmail,
      studentName,
      uniqueId: uniqueId || undefined,
      textbook: body.textbook,
      topic: body.topic || "Ümumi test",
      class: body.class || "5",
      difficulty: body.difficulty || "orta",
      score: testScore,
      totalQuestions,
      correctAnswers,
      wrongAnswers: totalQuestions - correctAnswers,
      timeSpent: timeSpentSeconds,
      completedAt: body.completedAt || new Date().toISOString(),
      answers: body.answers,
      detailedResults: body.detailedResults,
    }

    const saved = saveTestResult(storedResult)


    // 2. Identify linked parent(s) to send email notification
    let emailStatus = { sent: false, parentEmail: "", simulated: false }
    try {
      const allUsers = getAllUsers()
      const allLinks = loadLinksFromDisk()

      // Find link by studentId or studentEmail
      const link = allLinks.find(
        (l) =>
          l.status === "active" &&
          (String(l.studentId) === String(studentId) ||
            (studentEmail && l.student.email?.toLowerCase() === studentEmail.toLowerCase()))
      )

      let parentEmailToNotify = (body.parentEmail || link?.parentEmail || "").trim()
      let parentName = body.parentName || "Valideyn"

      // If link has parentId, find user
      if (link?.parentId) {
        const parentUser = allUsers.find((u) => String(u.id) === String(link.parentId))
        if (parentUser) {
          if (!parentEmailToNotify && parentUser.email) {
            parentEmailToNotify = parentUser.email
          }
          if (parentUser.firstName) {
            parentName = `${parentUser.firstName} ${parentUser.lastName || ""}`.trim()
          }
        }
      }

      // If still no parent found, check student user's parentEmail field
      if (!parentEmailToNotify) {
        const studentUser = allUsers.find(
          (u) =>
            String(u.id) === String(studentId) ||
            (studentEmail && u.email?.toLowerCase() === studentEmail.toLowerCase())
        )
        if (studentUser?.parentEmail) {
          parentEmailToNotify = studentUser.parentEmail
        }
      }

      if (parentEmailToNotify) {
        const emailRes = await sendTestResultNotification({
          parentEmail: parentEmailToNotify,
          parentName,
          studentName: studentName || "Övladınız",
          studentClass: body.class,
          textbook: body.textbook,
          topic: body.topic || "Mövzu testi",
          score: testScore,
          correctCount: correctAnswers,
          totalQuestions,
          timeSpentMinutes,
          completedAt: saved.completedAt,
        })
        emailStatus = {
          sent: emailRes.success,
          parentEmail: parentEmailToNotify,
          simulated: emailRes.simulated || false,
        }
      }
    } catch (mailErr) {
      console.error("Error triggering parent email notification:", mailErr)
    }

    return NextResponse.json(
      {
        success: true,
        message: "Test nəticəsi uğurla yaddaşa yazıldı",
        result: saved,
        emailNotification: emailStatus,
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error("[ERROR] Save test result error:", error)
    return NextResponse.json(
      { success: false, error: error?.message || "Daxili server xətası" },
      { status: 500 }
    )
  }
}
