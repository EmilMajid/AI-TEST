export const dynamic = "force-dynamic"
import { type NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/user-store"
import { getAuthContext } from "@/lib/auth-utils"
import { sendTestResultNotification, isDemoEmail } from "@/lib/email-service"
import crypto from "crypto"

function maskEmail(email: string): string {
  if (!email || !email.includes("@")) return "***"
  const [local, domain] = email.split("@")
  const masked = local.slice(0, 2) + "***"
  return `${masked}@${domain}`
}

function generateToken(): string {
  return crypto.randomBytes(24).toString("hex")
}

// POST — Şagird valideyn dəvəti göndərir
export async function POST(request: NextRequest) {
  try {
    const auth = await getAuthContext(request)
    if (!auth?.user?.id) {
      return NextResponse.json({ error: "Giriş tələb olunur" }, { status: 401 })
    }

    const body = await request.json()
    const { parentEmail, relationshipType, thirdPartyLabel } = body

    // Yalnız şagird dəvət göndərə bilər
    if (auth.user.accountType !== "student" && auth.user.role !== "student") {
      return NextResponse.json({ error: "Yalnız şagirdlər valideyn dəvəti göndərə bilər" }, { status: 403 })
    }

    // studentId mütləq session-dan
    const studentId = Number(auth.user.id)

    if (!parentEmail || !parentEmail.includes("@")) {
      return NextResponse.json({ error: "Düzgün email daxil edin" }, { status: 400 })
    }

    const validRelationships = ["father", "mother", "guardian", "other"]
    if (!validRelationships.includes(relationshipType)) {
      return NextResponse.json({ error: "Düzgün əlaqə növü seçin" }, { status: 400 })
    }

    // Demo email qadağası
    if (isDemoEmail(parentEmail)) {
      return NextResponse.json({ error: "Bu email ilə valideyn əlavə etmək mümkün deyil" }, { status: 400 })
    }

    // Şagird özünü dəvət edə bilməz
    if (auth.user.email?.toLowerCase() === parentEmail.toLowerCase()) {
      return NextResponse.json({ error: "Öz emailinizə dəvət göndərə bilməzsiniz" }, { status: 400 })
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: "Verilənlər bazası əlçatmazdır" }, { status: 503 })
    }

    // Rate limit: 24 saat ərzində 5 dəvət
    try {
      const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
      const { count } = await supabaseAdmin
        .from("ParentInvite")
        .select("*", { count: "exact", head: true })
        .eq("studentId", studentId)
        .gte("createdAt", since)
      if ((count ?? 0) >= 5) {
        return NextResponse.json({ error: "24 saat ərzində maksimum 5 dəvət göndərə bilərsiniz" }, { status: 429 })
      }
    } catch (rlErr) {
      console.warn("Rate limit check error:", rlErr)
    }

    // 'other' seçildikdə: qeydiyyat yox, yalnız valideyni xəbərdar et
    if (relationshipType === "other") {
      // Mövcud valideyni tap
      const { data: existingLink } = await supabaseAdmin
        .from("ParentStudentLink")
        .select("parentId")
        .eq("studentId", studentId)
        .neq("parentId", studentId)
        .eq("status", "active")
        .limit(1)
        .maybeSingle()

      if (existingLink?.parentId) {
        const { data: parentUser } = await supabaseAdmin
          .from("User")
          .select("email, firstName, lastName")
          .eq("id", existingLink.parentId)
          .maybeSingle()

        if (parentUser?.email) {
          const { data: stData } = await supabaseAdmin
            .from("User")
            .select("firstName, lastName, class")
            .eq("id", studentId)
            .maybeSingle()

          // NotificationLog-a qeyd
          try {
            await supabaseAdmin.from("NotificationLog").insert({
              studentId,
              parentId: existingLink.parentId,
              eventType: "third_party_attempt",
              targetEmailMasked: maskEmail(parentEmail),
              thirdPartyLabel: thirdPartyLabel || "Naməlum",
            })
          } catch (nlErr) {
            console.warn("NotificationLog insert error:", nlErr)
          }

          // Valideynə xəbərdarlıq emaili
          await sendTestResultNotification({
            parentEmail: parentUser.email,
            parentName: `${parentUser.firstName || ""} ${parentUser.lastName || ""}`.trim(),
            studentName: stData ? `${stData.firstName} ${stData.lastName}`.trim() : "Övladınız",
            studentClass: stData?.class || "",
            textbook: "Bildiriş",
            topic: `Övladınız "${thirdPartyLabel || "kənar şəxs"}" adlı şəxsə (${maskEmail(parentEmail)}) nəticə göndərməyə cəhd etdi. Bu şəxsə heç bir məlumat göndərilmədi. Əgər istəyirsinizsə, özünüz həmin şəxsə məlumat paylaşa bilərsiniz.`,
            score: 0,
            correctCount: 0,
            totalQuestions: 0,
            timeSpentMinutes: 0,
            completedAt: new Date().toISOString(),
          })
        }
      }

      return NextResponse.json({
        success: true,
        message: "Valideyniniz xəbərdar edildi. Həmin emailə heç nə göndərilmədi.",
        type: "other_notified",
      })
    }

    // Birinci valideyn varsa yoxla
    const { data: firstLink } = await supabaseAdmin
      .from("ParentStudentLink")
      .select("parentId, relationshipType")
      .eq("studentId", studentId)
      .neq("parentId", studentId)
      .eq("status", "active")
      .limit(1)
      .maybeSingle()

    // Eyni tip valideyn artıq varsa rədd et
    if (firstLink?.relationshipType === relationshipType) {
      return NextResponse.json({
        error: `Bu tipli valideyn (${relationshipType}) artıq əlavə edilib`,
      }, { status: 409 })
    }

    // Dəvət token-i yarat
    const token = generateToken()
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()

    try {
      await supabaseAdmin.from("ParentInvite").insert({
        studentId,
        parentEmail: parentEmail.toLowerCase(),
        relationshipType,
        inviteToken: token,
        status: "pending",
        expiresAt,
      })
    } catch (invErr) {
      console.error("ParentInvite insert error:", invErr)
      return NextResponse.json({ error: "Dəvət qeydə alına bilmədi" }, { status: 500 })
    }

    // Şagird məlumatları
    const { data: stData } = await supabaseAdmin
      .from("User")
      .select("firstName, lastName, class, school")
      .eq("id", studentId)
      .maybeSingle()
    const studentName = stData ? `${stData.firstName || ""} ${stData.lastName || ""}`.trim() : "Şagird"

    // Valideynə dəvət emaili
    const inviteLink = `${process.env.NEXT_PUBLIC_APP_URL || "https://www.testai.az"}/parent-accept?token=${token}`
    const relLabel = relationshipType === "father" ? "Ata" : relationshipType === "mother" ? "Ana" : "Qəyyum/Nümayəndə"

    await sendTestResultNotification({
      parentEmail: parentEmail.toLowerCase(),
      parentName: "Hörmətli Valideyn",
      studentName,
      studentClass: stData?.class || "",
      textbook: "Valideyn Dəvəti",
      topic: `${studentName} adlı şagird sizi ${relLabel} kimi əlavə etmək istəyir. Aşağıdakı linkə keçərək qeydiyyatı tamamlayın:\n\n${inviteLink}\n\nLink 24 saat ərzində etibarlıdır.`,
      score: 0,
      correctCount: 0,
      totalQuestions: 0,
      timeSpentMinutes: 0,
      completedAt: new Date().toISOString(),
    })

    // Birinci valideyn varsa xəbərdar et
    if (firstLink?.parentId) {
      const { data: firstParent } = await supabaseAdmin
        .from("User")
        .select("email, firstName, lastName")
        .eq("id", firstLink.parentId)
        .maybeSingle()

      if (firstParent?.email) {
        await sendTestResultNotification({
          parentEmail: firstParent.email,
          parentName: `${firstParent.firstName || ""} ${firstParent.lastName || ""}`.trim(),
          studentName,
          studentClass: stData?.class || "",
          textbook: "Məlumat",
          topic: `Övladınız ${studentName} sizə ${relLabel} kimi yeni bir şəxs (${maskEmail(parentEmail)}) əlavə etmək istəyir. Həmin şəxs dəvəti qəbul edərsə sistemdə ikinci valideyn kimi görünəcək.`,
          score: 0,
          correctCount: 0,
          totalQuestions: 0,
          timeSpentMinutes: 0,
          completedAt: new Date().toISOString(),
        })
      }
    }

    return NextResponse.json({
      success: true,
      message: "Dəvət emaili göndərildi. Valideyn 24 saat ərzində linki açmalıdır.",
      type: "invite_sent",
      expiresAt,
    })
  } catch (error: any) {
    console.error("[parent-invite POST error]:", error)
    return NextResponse.json({ error: error?.message || "Server xətası" }, { status: 500 })
  }
}

// GET — Token yoxlama (minimal məlumat)
export async function GET(request: NextRequest) {
  try {
    const token = request.nextUrl.searchParams.get("token")
    if (!token) {
      return NextResponse.json({ error: "Token tələb olunur" }, { status: 400 })
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: "Verilənlər bazası əlçatmazdır" }, { status: 503 })
    }

    const { data: invite } = await supabaseAdmin
      .from("ParentInvite")
      .select("studentId, relationshipType, status, expiresAt")
      .eq("inviteToken", token)
      .maybeSingle()

    if (!invite) {
      return NextResponse.json({ error: "Dəvət tapılmadı və ya müddəti bitib" }, { status: 404 })
    }

    if (invite.status !== "pending") {
      return NextResponse.json({ error: `Bu dəvət artıq ${invite.status} statusundadır` }, { status: 410 })
    }

    if (new Date(invite.expiresAt) < new Date()) {
      await supabaseAdmin
        .from("ParentInvite")
        .update({ status: "expired" })
        .eq("inviteToken", token)
      return NextResponse.json({ error: "Dəvətin müddəti bitib" }, { status: 410 })
    }

    // Yalnız minimal məlumat — tam ad, email, məktəb gizli saxlanılır
    const { data: student } = await supabaseAdmin
      .from("User")
      .select("firstName, class")
      .eq("id", invite.studentId)
      .maybeSingle()

    const relLabel = invite.relationshipType === "father" ? "Ata"
      : invite.relationshipType === "mother" ? "Ana" : "Qəyyum/Nümayəndə"

    return NextResponse.json({
      valid: true,
      student: {
        firstName: student?.firstName ? `${student.firstName.slice(0, 1)}***` : "Ş***",
        grade: student?.class || "?",
      },
      relationshipType: relLabel,
      expiresAt: invite.expiresAt,
    })
  } catch (error: any) {
    console.error("[parent-invite GET error]:", error)
    return NextResponse.json({ error: error?.message || "Server xətası" }, { status: 500 })
  }
}

// PATCH — Dəvəti qəbul et və ya rədd et
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { token, action, parentData } = body

    if (!token || !action) {
      return NextResponse.json({ error: "Token və action tələb olunur" }, { status: 400 })
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: "Verilənlər bazası əlçatmazdır" }, { status: 503 })
    }

    const { data: invite } = await supabaseAdmin
      .from("ParentInvite")
      .select("*")
      .eq("inviteToken", token)
      .maybeSingle()

    if (!invite || invite.status !== "pending") {
      return NextResponse.json({ error: "Dəvət tapılmadı, artıq istifadə edilib və ya müddəti bitib" }, { status: 404 })
    }

    if (new Date(invite.expiresAt) < new Date()) {
      await supabaseAdmin.from("ParentInvite").update({ status: "expired" }).eq("inviteToken", token)
      return NextResponse.json({ error: "Dəvətin müddəti bitib" }, { status: 410 })
    }

    if (action === "reject") {
      await supabaseAdmin
        .from("ParentInvite")
        .update({ status: "rejected", rejectedAt: new Date().toISOString() })
        .eq("inviteToken", token)
      return NextResponse.json({ success: true, message: "Dəvət rədd edildi" })
    }

    if (action !== "accept") {
      return NextResponse.json({ error: "Yalnız 'accept' və ya 'reject' mümkündür" }, { status: 400 })
    }

    // Valideyn qeydiyyatı (əgər artıq hesab yoxdursa)
    let parentDbId: number | null = null
    const { data: existingParent } = await supabaseAdmin
      .from("User")
      .select("id, accountType")
      .eq("email", invite.parentEmail.toLowerCase())
      .maybeSingle()

    if (existingParent) {
      parentDbId = existingParent.id
      if (existingParent.accountType !== "parent") {
        return NextResponse.json({
          error: "Bu email ilə qeydiyyatdan keçmiş hesab valideyn hesabı deyil"
        }, { status: 409 })
      }
    } else if (parentData?.firstName) {
      // Yeni valideyn yaradılır
      const { data: newParent } = await supabaseAdmin
        .from("User")
        .insert({
          email: invite.parentEmail.toLowerCase(),
          password: parentData.password || "TestAI@2026",
          firstName: parentData.firstName,
          lastName: parentData.lastName || "",
          fatherName: parentData.fatherName || "",
          region: parentData.region || "Bakı",
          school: "Məktəb qeyd edilməyib",
          accountType: "parent",
          role: "parent",
          isActive: true,
        })
        .select("id")
        .maybeSingle()
      if (newParent?.id) parentDbId = newParent.id
    }

    if (!parentDbId) {
      return NextResponse.json({
        error: "Valideyn məlumatları tamamlanmamışdır. Zəhmət olmasa qeydiyyatı tamamlayın.",
        needsRegistration: true,
        parentEmail: invite.parentEmail,
      }, { status: 422 })
    }

    // Race condition qoruması: atomik yoxlama + yazma
    const selfLink = parentDbId === invite.studentId
    if (selfLink) {
      return NextResponse.json({ error: "Öz-özünüzə valideyn ola bilməzsiniz" }, { status: 400 })
    }

    // ParentStudentLink yarat (DB CHECK constraint ikinci müdafiə xətti)
    const { error: linkErr } = await supabaseAdmin
      .from("ParentStudentLink")
      .upsert({
        parentId: parentDbId,
        studentId: invite.studentId,
        relationshipType: invite.relationshipType,
        status: "active",
        accessLevel: "full",
        approvedAt: new Date().toISOString(),
      }, { onConflict: "parentId,studentId" })

    if (linkErr) {
      console.error("ParentStudentLink upsert error:", linkErr)
      return NextResponse.json({ error: "Əlaqə yaradıla bilmədi: " + linkErr.message }, { status: 500 })
    }

    // Dəvəti qəbul olunmuş kimi işarələ
    await supabaseAdmin
      .from("ParentInvite")
      .update({ status: "accepted", acceptedAt: new Date().toISOString() })
      .eq("inviteToken", token)

    return NextResponse.json({
      success: true,
      message: "Valideyn uğurla əlavə edildi!",
      parentId: parentDbId,
    })
  } catch (error: any) {
    console.error("[parent-invite PATCH error]:", error)
    return NextResponse.json({ error: error?.message || "Server xətası" }, { status: 500 })
  }
}
