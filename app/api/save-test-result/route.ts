export const dynamic = "force-dynamic"
import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { saveTestResult, type StoredTestResult } from "@/lib/test-result-store"
import { getAllUsers, loadLinksFromDisk, supabaseAdmin } from "@/lib/user-store"
import { sendTestResultNotification, isDemoEmail } from "@/lib/email-service"
import { getAuthContext } from "@/lib/auth-utils"

function matchStudentUser(queryId: string | number | undefined, email: string | undefined, user: any): boolean {
  if (!user) return false
  if (email && user.email && user.email.toLowerCase() === email.toLowerCase().trim()) return true
  if (queryId !== undefined && queryId !== null && String(user.id) === String(queryId)) return true

  const q = String(queryId || "").toLowerCase().replace(/[^a-z0-9]/g, "")
  const uEmail = (user.email || "").toLowerCase().replace(/[^a-z0-9]/g, "")
  const uFirst = (user.firstName || "").toLowerCase()

  if (q && uEmail && (q === uEmail || uEmail.includes(q) || q.includes(uEmail.split("testai")[0]))) return true
  if (q && uFirst && q.includes(uFirst)) return true
  return false
}

export async function POST(request: NextRequest) {
  try {
    const auth = await getAuthContext(request)
    const body = await request.json()

    const studentId = body.studentId || auth?.user?.id || `student-${Date.now()}`
    const studentEmail = (body.studentEmail || auth?.user?.email || "").trim()
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
    const testClass = String(body.class || "8")

    // 1. Resolve student user in Supabase
    let studentDbId: number | null = null
    try {
      if (supabaseAdmin) {
        // Check by numeric ID
        const numId = Number(studentId)
        if (!isNaN(numId) && numId > 0) {
          const { data: uById } = await supabaseAdmin.from("User").select("id").eq("id", numId).maybeSingle()
          if (uById?.id) studentDbId = uById.id
        }

        // Check by student email
        if (!studentDbId && studentEmail) {
          const { data: uByEmail } = await supabaseAdmin.from("User").select("id").eq("email", studentEmail.toLowerCase()).maybeSingle()
          if (uByEmail?.id) studentDbId = uByEmail.id
        }

        // Check by matching studentId or uniqueId across all student users
        if (!studentDbId) {
          const { data: allStudents } = await supabaseAdmin.from("User").select("id, email, firstName, lastName").eq("accountType", "student")
          if (allStudents && allStudents.length > 0) {
            const matched = allStudents.find((u: any) => matchStudentUser(studentId, studentEmail, u) || (uniqueId && matchStudentUser(uniqueId, studentEmail, u)))
            if (matched?.id) studentDbId = matched.id
          }
        }

        // If student not found in Supabase, auto-create student so tests are never dropped
        if (!studentDbId) {
          const resolvedEmail = studentEmail || (uniqueId ? `${uniqueId.replace("@", "")}@testai.az` : `student-${Date.now()}@testai.az`)
          const nameParts = (studentName || "Şagird").split(" ")
          const firstName = nameParts[0] || "Şagird"
          const lastName = nameParts.slice(1).join(" ") || "İstifadəçi"

          const { data: newUser } = await supabaseAdmin.from("User").insert({
            email: resolvedEmail.toLowerCase().trim(),
            password: "Test@2026",
            firstName,
            lastName,
            fatherName: "",
            region: "Bakı",
            school: body.school || "Məktəb",
            class: testClass,
            accountType: "student",
            role: "student",
            isActive: true,
          }).select("id").maybeSingle()

          if (newUser?.id) {
            studentDbId = newUser.id
          }
        }

        // Save directly to Supabase TestResult table with AWAIT
        if (studentDbId) {
          const { error: insertErr } = await supabaseAdmin.from("TestResult").insert({
            userId: studentDbId,
            textbook: body.textbook,
            topic: body.topic || "Ümumi test",
            class: testClass,
            score: testScore,
            timeSpent: timeSpentSeconds,
            answers: body.answers || {},
            completedAt: body.completedAt || new Date().toISOString(),
          })

          if (insertErr) {
            console.error("Supabase TestResult insert error:", insertErr)
          } else {
            console.log(`[Supabase] TestResult recorded successfully for student userId=${studentDbId}`)
          }
        }
      }
    } catch (dbErr) {
      console.error("Database resolution error in save-test-result:", dbErr)
    }

    // 2. Identify linked parent and send email notification to parent's real inbox
    let parentEmailToNotify = (body.parentEmail || "").trim()
    let parentName = body.parentName || "Valideyn"
    let emailStatus = { sent: false, parentEmail: "", simulated: false }

    try {
      const allUsers = getAllUsers()
      const allLinks = loadLinksFromDisk()

      // 1. Try resolving parent email from disk links
      if (!parentEmailToNotify) {
        const link = allLinks.find(
          (l) =>
            l.status === "active" &&
            (String(l.studentId) === String(studentId) ||
              (studentEmail && l.student?.email?.toLowerCase() === studentEmail.toLowerCase()))
        )
        if (link?.parentEmail) {
          parentEmailToNotify = link.parentEmail
        } else if (link?.parentId) {
          const parentUser = allUsers.find((u) => String(u.id) === String(link.parentId))
          if (parentUser?.email) parentEmailToNotify = parentUser.email
        }
      }

      // 2. Try resolving parent email from Supabase ParentStudentLink
      if (!parentEmailToNotify && studentDbId && supabaseAdmin) {
        try {
          const { data: dbLinks } = await supabaseAdmin
            .from("ParentStudentLink")
            .select("parentId")
            .eq("studentId", studentDbId)
            .eq("status", "active")
            .limit(1)

          if (dbLinks && dbLinks.length > 0 && dbLinks[0].parentId) {
            const { data: pUser } = await supabaseAdmin
              .from("User")
              .select("email, firstName, lastName")
              .eq("id", dbLinks[0].parentId)
              .maybeSingle()

            if (pUser?.email) {
              parentEmailToNotify = pUser.email
              if (pUser.firstName) parentName = `${pUser.firstName} ${pUser.lastName || ""}`.trim()
            }
          }
        } catch (sbLinkErr) {
          console.error("Supabase parent link resolution error:", sbLinkErr)
        }
      }

      // 3. Fallback: if no parent linked, check if student themselves has a real registered email
      if (!parentEmailToNotify && studentEmail && studentEmail.includes("@") && !isDemoEmail(studentEmail)) {
        parentEmailToNotify = studentEmail
        parentName = studentName || "Şagird"
      }

      // 4. Fallback for demo/test environments to ensure tester receives the result
      if (!parentEmailToNotify && process.env.TEST_EMAIL_RECIPIENT) {
        parentEmailToNotify = process.env.TEST_EMAIL_RECIPIENT
      }

      // 4. Ensure ParentStudentLink in Supabase if parent is resolved
      if (parentEmailToNotify && studentDbId && supabaseAdmin) {
        try {
          const { data: parentDbUser } = await supabaseAdmin
            .from("User")
            .select("id")
            .eq("email", parentEmailToNotify.toLowerCase())
            .maybeSingle()

          if (parentDbUser?.id) {
            await supabaseAdmin.from("ParentStudentLink").upsert({
              parentId: parentDbUser.id,
              studentId: studentDbId,
              relationshipType: "parent",
              status: "active",
              accessLevel: "full",
            }, { onConflict: "parentId,studentId" })
          }
        } catch (linkErr) {
          console.error("Error upserting ParentStudentLink in Supabase:", linkErr)
        }
      }

      if (parentEmailToNotify) {
        const emailRes = await sendTestResultNotification({
          parentEmail: parentEmailToNotify,
          parentName,
          studentName: studentName || "Övladınız",
          studentClass: testClass,
          textbook: body.textbook,
          topic: body.topic || "Mövzu testi",
          score: testScore,
          correctCount: correctAnswers,
          totalQuestions,
          timeSpentMinutes,
          completedAt: body.completedAt || new Date().toISOString(),
        })
        emailStatus = {
          sent: emailRes.success,
          parentEmail: parentEmailToNotify,
          redirectedTo: (emailRes as any).redirectedTo || "",
          simulated: emailRes.simulated || false,
        }
      }
    } catch (mailErr) {
      console.error("Error triggering parent email notification:", mailErr)
    }

    // 3. Save to local persistent store for offline/dev fallback
    const storedResult: StoredTestResult = {
      id: body.id || `res-${Date.now()}`,
      studentId: studentDbId || studentId,
      studentEmail: studentEmail,
      studentName,
      uniqueId: uniqueId || undefined,
      textbook: body.textbook,
      topic: body.topic || "Ümumi test",
      class: testClass,
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
