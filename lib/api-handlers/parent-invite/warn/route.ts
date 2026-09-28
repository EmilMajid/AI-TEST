export const dynamic = "force-dynamic"
import { type NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/user-store"
import { getAuthContext } from "@/lib/auth-utils"
import { sendTestResultNotification } from "@/lib/email-service"

function maskEmail(email: string): string {
  if (!email || !email.includes("@")) return "***"
  const [local, domain] = email.split("@")
  return `${local.slice(0, 2)}***@${domain}`
}

export async function POST(request: NextRequest) {
  try {
    const auth = await getAuthContext(request)
    if (!auth?.user?.id) {
      return NextResponse.json({ error: "Giriş tələb olunur" }, { status: 401 })
    }

    // studentId mütləq session-dan — body-dən deyil
    const studentId = Number(auth.user.id)
    const body = await request.json()
    const { attemptedEmail, thirdPartyLabel } = body

    if (!attemptedEmail || !attemptedEmail.includes("@")) {
      return NextResponse.json({ error: "Email tələb olunur" }, { status: 400 })
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: "Verilənlər bazası əlçatmazdır" }, { status: 503 })
    }

    // Rate limit: 24 saat / 5 cəhd
    try {
      const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
      const { count } = await supabaseAdmin
        .from("NotificationLog")
        .select("*", { count: "exact", head: true })
        .eq("studentId", studentId)
        .eq("eventType", "third_party_attempt")
        .gte("createdAt", since)

      if ((count ?? 0) >= 5) {
        return NextResponse.json({
          error: "24 saat ərzində maksimum 5 xəbərdarlıq göndərə bilərsiniz. Valideyniniz artıq xəbərdardır.",
        }, { status: 429 })
      }
    } catch (rlErr) {
      console.warn("Rate limit check error:", rlErr)
    }

    // Şagirdin məlumatları
    const { data: student } = await supabaseAdmin
      .from("User")
      .select("firstName, lastName, class")
      .eq("id", studentId)
      .maybeSingle()
    const studentName = student ? `${student.firstName || ""} ${student.lastName || ""}`.trim() : "Şagird"

    // Rəsmi valideyni tap
    const { data: link } = await supabaseAdmin
      .from("ParentStudentLink")
      .select("parentId")
      .eq("studentId", studentId)
      .neq("parentId", studentId)
      .eq("status", "active")
      .limit(1)
      .maybeSingle()

    // NotificationLog-a qeyd (valideyn olmasa belə)
    try {
      await supabaseAdmin.from("NotificationLog").insert({
        studentId,
        parentId: link?.parentId || null,
        eventType: "third_party_attempt",
        targetEmailMasked: maskEmail(attemptedEmail),
        thirdPartyLabel: thirdPartyLabel || "Naməlum",
      })
    } catch (nlErr) {
      console.warn("NotificationLog insert error:", nlErr)
    }

    if (!link?.parentId) {
      return NextResponse.json({
        success: true,
        message: "Qeyd edildi. Sistemdə qeydiyyatlı valideyn tapılmadı.",
        parentNotified: false,
      })
    }

    const { data: parent } = await supabaseAdmin
      .from("User")
      .select("email, firstName, lastName")
      .eq("id", link.parentId)
      .maybeSingle()

    if (!parent?.email) {
      return NextResponse.json({
        success: true,
        message: "Qeyd edildi amma valideynə çatdırılmadı.",
        parentNotified: false,
      })
    }

    // Valideynə xəbərdarlıq emaili göndər
    await sendTestResultNotification({
      parentEmail: parent.email,
      parentName: `${parent.firstName || ""} ${parent.lastName || ""}`.trim(),
      studentName,
      studentClass: student?.class || "",
      textbook: "⚠️ Bildiriş",
      topic: `Övladınız ${studentName}, "${thirdPartyLabel || "kənar şəxs"}" adlı şəxsə (${maskEmail(attemptedEmail)}) nəticə göndərməyə cəhd etdi.\n\nHəmin emailə heç bir məlumat göndərilmədi.\n\nƏgər bu şəxsə məlumat paylaşmaq istəyirsinizsə, bunu öz adınızdan edə bilərsiniz.`,
      score: 0,
      correctCount: 0,
      totalQuestions: 0,
      timeSpentMinutes: 0,
      completedAt: new Date().toISOString(),
    })

    return NextResponse.json({
      success: true,
      message: "Valideyniniz xəbərdar edildi.",
      parentNotified: true,
    })
  } catch (error: any) {
    console.error("[parent-invite/warn POST error]:", error)
    return NextResponse.json({ error: error?.message || "Server xətası" }, { status: 500 })
  }
}
