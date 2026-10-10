export const dynamic = "force-dynamic"
import { NextRequest, NextResponse } from "next/server"
import { getReports, updateReportStatus } from "@/lib/question-report-store"
import { addMessageDirect } from "@/lib/api-handlers/messages/route"

export async function GET() {
  return NextResponse.json({ reports: getReports() })
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { reportId, action, adminResponse } = body

    if (!reportId || !action) {
      return NextResponse.json({ error: "reportId və action mütləqdir" }, { status: 400 })
    }

    if (action !== "resolve" && action !== "reject") {
      return NextResponse.json({ error: "action 'resolve' və ya 'reject' olmalıdır" }, { status: 400 })
    }

    const updated = updateReportStatus(reportId, action === "resolve" ? "resolved" : "rejected", adminResponse)
    if (!updated) {
      return NextResponse.json({ error: "Müraciət tapılmadı" }, { status: 404 })
    }

    // If resolved, send notification message to the student
    if (action === "resolve" && updated.studentId) {
      const subjectText = "Müraciətiniz Təsdiqləndi: Problemli Sual Düzəldildi 🎯"
      const contentText = adminResponse || 
        `Hörmətli ${updated.studentName}! ${updated.subject} fənnindən bildirdiyiniz "${updated.questionText.slice(0, 50)}..." sualındakı qüsur metodist heyətimiz tərəfindən araşdırıldı və təsdiqlənərək düzəldildi. Platformanın keyfiyyətinin yüksəldilməsinə töhfəniz üçün təşəkkür edirik!`
      
      try {
        addMessageDirect({
          senderId: "admin-main",
          senderUniqueId: "@super.admin",
          receiverId: updated.studentId,
          receiverUniqueId: updated.studentEmail ? `@${updated.studentEmail.split('@')[0]}` : `@student.${updated.studentId}`,
          subject: subjectText,
          content: contentText,
          sender: { firstName: "Admin", lastName: "Metodist", role: "admin" },
          receiver: { firstName: updated.studentName, lastName: "", role: "student" }
        })
      } catch (msgErr) {
        console.warn("Could not dispatch internal message:", msgErr)
      }
    }

    return NextResponse.json({ success: true, report: updated })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Xəta baş verdi" }, { status: 500 })
  }
}
