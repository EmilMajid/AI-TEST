export const dynamic = "force-dynamic"
import { NextRequest, NextResponse } from "next/server"
import { getReports, addReport } from "@/lib/question-report-store"

export async function GET() {
  return NextResponse.json({ reports: getReports() })
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { questionId, passportId, questionText, subject, grade, topic, studentId, studentName, studentEmail, issueType, comment } = body

    if (!questionId || !questionText || !issueType) {
      return NextResponse.json({ error: "Sual məlumatları və problem növü mütləqdir" }, { status: 400 })
    }

    if (!comment || comment.trim().length < 8) {
      return NextResponse.json({ error: "Zəhmət olmasa problemi ən azı 8 simvolla qısa təsvir edin" }, { status: 400 })
    }

    const result = addReport({
      questionId,
      passportId,
      questionText,
      subject: subject || "Məlum deyil",
      grade: grade || "-",
      topic: topic || "Məlum deyil",
      studentId: studentId || "anon",
      studentName: studentName || "Şagird",
      studentEmail,
      issueType,
      comment: comment.trim()
    })

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 429 })
    }

    return NextResponse.json({ success: true, report: result.report })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Xəta baş verdi" }, { status: 500 })
  }
}
