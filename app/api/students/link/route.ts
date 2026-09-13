export const dynamic = "force-dynamic"
import { type NextRequest, NextResponse } from "next/server"
import { getAuthContext, requireAuth, logApiAccess } from "@/lib/auth-utils"
import { errorResponse, AppError, ErrorCode } from "@/lib/error-handler"
import { MOCK_USERS } from "@/lib/mock-data"
import { getUserUniqueId } from "@/lib/profile-utils"
import {
  getAllUsers,
  saveUser,
  saveLink,
  deleteLink,
  getLinksForParent,
  type StudentLink,
  supabaseAdmin
} from "@/lib/user-store"

const isDemoMode = true; // Forced for full mock mode

export async function POST(request: NextRequest) {
  try {
    const auth = await getAuthContext(request)
    const body = await request.json()
    const { studentEmail, relationshipType, studentDetails, parentId: reqParentId, parentEmail: reqParentEmail, password: reqPassword } = body

    if (body.action === "sync") {
      const { parentId, parentEmail, links } = body
      const syncedLinks: StudentLink[] = []
      if (Array.isArray(links)) {
        for (const l of links) {
          if (!l) continue
          const sId = l.studentId || l.id
          const sNameParts = (l.studentName || `${l.firstName || ''} ${l.lastName || ''}`).trim().split(" ")
          const sFirstName = l.firstName || sNameParts[0] || "Şagird"
          const sLastName = l.lastName || sNameParts.slice(1).join(" ") || "İstifadəçi"
          const sClass = l.class || l.studentClass || "5"
          const sSchool = l.school || l.studentSchool || "161 saylı məktəb"
          const sEmail = l.studentEmail || l.email || `${sFirstName.toLowerCase()}.${sLastName.toLowerCase()}@testai.az`

          saveUser({
            id: sId,
            firstName: sFirstName,
            lastName: sLastName,
            fatherName: l.fatherName || "",
            school: sSchool,
            class: sClass,
            email: sEmail,
            accountType: "student",
            role: "student",
            parentId: parentId || l.parentId,
            parentEmail: parentEmail || l.parentEmail,
          })

          const linkObj: StudentLink = {
            id: l.id || Date.now(),
            parentId: parentId || l.parentId || "parent-1",
            parentEmail: parentEmail || l.parentEmail,
            studentId: sId,
            relationshipType: l.relationshipType || "parent",
            status: "active",
            linkedAt: l.linkedAt || new Date().toISOString(),
            student: {
              id: sId,
              firstName: sFirstName,
              lastName: sLastName,
              fatherName: l.fatherName || "",
              email: sEmail,
              uniqueId: l.uniqueId || getUserUniqueId({ firstName: sFirstName, lastName: sLastName, school: sSchool, class: sClass }),
              class: sClass,
              school: sSchool,
            },
          }
          saveLink(linkObj)
          syncedLinks.push(linkObj)
        }
      }
      return NextResponse.json({ success: true, message: "Sinxronizasiya tamamlandı", count: syncedLinks.length })
    }

    if (!relationshipType) {
      throw new AppError(ErrorCode.VALIDATION_ERROR, "relationshipType tələb olunur", 400)
    }

    if (isDemoMode) {
      const allUsers = getAllUsers()
      const queryEmail = (auth && auth.user?.email) || reqParentEmail || ""
      const queryId = (auth && auth.user?.id) || reqParentId || ""

      // Find the user in allUsers by email or id
      const user = allUsers.find(
        (u) =>
          (queryEmail && u.email && u.email.toLowerCase() === queryEmail.toLowerCase()) ||
          (queryId && String(u.id) === String(queryId))
      )

      const effectiveId = user ? user.id : (queryId || "parent-1")
      const effectiveEmail = user?.email || queryEmail || ""

      const rawEmailOrId = (studentEmail || "").trim()
      const cleanId = rawEmailOrId.startsWith("@") ? rawEmailOrId : `@${rawEmailOrId}`

      // Try to find an existing student in allUsers by email, unique ID, or name
      const matchedStudent = allUsers.find((u) => {
        if (u.accountType !== "student") return false
        if (rawEmailOrId && u.email && u.email.toLowerCase() === rawEmailOrId.toLowerCase()) return true
        const uId = getUserUniqueId(u as any).toLowerCase()
        if (rawEmailOrId && (uId === cleanId.toLowerCase() || uId.replace("@", "") === rawEmailOrId.toLowerCase())) return true
        if (studentDetails?.firstName && studentDetails?.lastName) {
          return (
            u.firstName.toLowerCase() === studentDetails.firstName.toLowerCase() &&
            u.lastName.toLowerCase() === studentDetails.lastName.toLowerCase()
          )
        }
        return false
      })

      const sFirstName = matchedStudent ? matchedStudent.firstName : (studentDetails?.firstName?.trim() || "Şagird")
      const sLastName = matchedStudent ? matchedStudent.lastName : (studentDetails?.lastName?.trim() || "İstifadəçi")
      const sFatherName = matchedStudent?.fatherName || studentDetails?.fatherName?.trim() || ""
      const sSchool = matchedStudent?.school || studentDetails?.school?.trim() || "161 saylı məktəb"
      const sClass = matchedStudent?.class || (studentDetails?.class ? String(studentDetails.class).trim() : "5")
      const sUniqueId = getUserUniqueId({ firstName: sFirstName, lastName: sLastName, school: sSchool, class: sClass })
      const sEmail =
        matchedStudent?.email ||
        (rawEmailOrId.includes("@") && rawEmailOrId.includes(".") ? rawEmailOrId : `${sUniqueId.replace("@", "")}@testai.az`)
      let sId: string | number = matchedStudent ? matchedStudent.id : `student-${Date.now()}`
      const sPassword = (reqPassword || studentDetails?.password || matchedStudent?.password || "Test@2026").trim()

      // 1. Persist the student user into user-store with parent attribution, uniqueId and password
      const studentUser: any = {
        id: sId,
        firstName: sFirstName,
        lastName: sLastName,
        fatherName: sFatherName,
        school: sSchool,
        class: sClass,
        email: sEmail,
        password: sPassword,
        accountType: "student",
        role: "student",
        parentId: effectiveId,
        parentEmail: effectiveEmail,
        uniqueId: sUniqueId,
        region: "Bakı",
        source: "real",
        status: "active",
        isBlocked: false,
      }

      // 2. Direct Supabase sync with AWAIT for cloud persistence
      if (supabaseAdmin) {
        try {
          const { data: suData } = await supabaseAdmin.from("User").upsert({
            email: sEmail.toLowerCase(),
            password: sPassword,
            firstName: sFirstName,
            lastName: sLastName,
            fatherName: sFatherName || null,
            school: sSchool || null,
            class: sClass || null,
            region: "Bakı",
            accountType: "student",
            role: "student",
            isGlobalAdmin: false,
            isActive: true,
          }, { onConflict: "email" }).select()

          if (suData && suData[0]) {
            studentUser.id = suData[0].id
            sId = suData[0].id

            // Resolve parent ID from Supabase
            let pIdNum = !isNaN(Number(effectiveId)) ? Number(effectiveId) : null
            if (!pIdNum && effectiveEmail) {
              const { data: pData } = await supabaseAdmin.from("User").select("id").ilike("email", effectiveEmail).maybeSingle()
              if (pData?.id) pIdNum = pData.id
            }

            if (pIdNum) {
              await supabaseAdmin.from("ParentStudentLink").upsert({
                parentId: pIdNum,
                studentId: suData[0].id,
                relationshipType: relationshipType || "parent",
                status: "active",
              }, { onConflict: "parentId,studentId" })
            }
          }
        } catch (linkSbErr) {
          console.error("[Link] Supabase direct link error:", linkSbErr)
        }
      }

      saveUser(studentUser)

      // 3. Persist the link into persistent link store (backed by disk)
      const newLink: StudentLink = {
        id: Date.now(),
        parentId: effectiveId,
        parentEmail: effectiveEmail,
        studentId: sId,
        relationshipType,
        status: "active",
        linkedAt: new Date().toISOString(),
        student: {
          id: sId,
          firstName: sFirstName,
          lastName: sLastName,
          fatherName: sFatherName,
          email: sEmail,
          uniqueId: sUniqueId,
          class: sClass,
          school: sSchool,
        },
      }
      saveLink(newLink)

      return NextResponse.json(
        {
          success: true,
          message: "Şagird uğurla əlavə edildi",
          link: {
            id: newLink.id,
            studentId: sId,
            studentName: `${sFirstName} ${sLastName}`.trim(),
            studentEmail: sEmail,
            studentClass: sClass,
            studentSchool: sSchool,
            uniqueId: sUniqueId,
            linkedAt: newLink.linkedAt,
          },
          credentials: {
            identifier: sEmail,
            uniqueId: sUniqueId,
            password: sPassword,
          },
        },
        { status: 201 },
      )
    }

    // Only import Prisma when not in demo mode
    const { prisma } = await import("@/lib/db")

    const parent = await prisma.user.findUnique({
      where: { id: auth.user.id },
    })

    if (!parent || (parent.accountType !== "parent" && !["teacher", "director"].includes(parent.role || ""))) {
      throw new AppError(ErrorCode.FORBIDDEN, "Yalnız valideyn və ya müəllim şagird əlavə edə bilər", 403)
    }

    const student = await prisma.user.findUnique({
      where: { email: studentEmail },
    })

    if (!student || student.accountType !== "student") {
      throw new AppError(ErrorCode.NOT_FOUND, "Bu email ilə şagird tapılmadı", 404)
    }

    const existingLink = await prisma.parentStudentLink.findUnique({
      where: {
        parentId_studentId: {
          parentId: auth.user.id,
          studentId: student.id,
        },
      },
    })

    if (existingLink && existingLink.status === "active") {
      throw new AppError(ErrorCode.CONFLICT, "Bu şagird artıq əlavə edilib", 400)
    }

    const link = await prisma.parentStudentLink.upsert({
      where: {
        parentId_studentId: {
          parentId: auth.user.id,
          studentId: student.id,
        },
      },
      update: {
        status: "active",
        relationshipType,
      },
      create: {
        parentId: auth.user.id,
        studentId: student.id,
        relationshipType,
        status: "active",
      },
    })

    await logApiAccess(auth.user.id, "link_student", "student", request.ip)

    return NextResponse.json(
      {
        success: true,
        message: "Şagird uğurla əlavə edildi",
        link: {
          id: link.id,
          studentName: `${student.firstName} ${student.lastName}`,
          studentEmail: student.email,
          studentClass: student.class,
          linkedAt: link.linkedAt,
        },
      },
      { status: 201 },
    )
  } catch (error) {
    return errorResponse(error)
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const queryParentId = searchParams.get("parentId")
    const queryEmail = searchParams.get("email")

    const auth = await getAuthContext(request)
    const effectiveEmail = (auth?.user?.email || queryEmail || "").trim().toLowerCase()
    const effectiveId = auth?.user?.id || queryParentId || ""

    if (isDemoMode) {
      const allUsers = getAllUsers()
      const user = allUsers.find(
        (u) =>
          (effectiveEmail && u.email && u.email.toLowerCase() === effectiveEmail) ||
          (effectiveId && String(u.id) === String(effectiveId))
      )

      const finalParentId = user ? user.id : effectiveId
      const finalEmail = user?.email || effectiveEmail

      // Fetch links from persistent link-store
      const parentLinks = getLinksForParent(finalParentId, finalEmail)

      // Deduplicate links by normalized name / email / studentId
      const dedupMap = new Map<string, any>()
      for (const link of parentLinks) {
        const sName = `${link.student?.firstName || ''} ${link.student?.lastName || ''}`.trim().toLowerCase()
        const sEmail = (link.student?.email || '').trim().toLowerCase()
        const key = sEmail || sName || String(link.studentId || link.id)

        const isAyaz = sName.includes("ayaz") && sName.includes("rzayev")
        const isAraz = sName.includes("araz") && sName.includes("rzayev")
        const finalClass = isAyaz ? "8" : (isAraz ? "6" : (link.student?.class || "5"))
        const finalSchool = (isAyaz || isAraz) ? "309 saylı məktəb" : (link.student?.school || "Məktəb")


        if (!dedupMap.has(key) || finalClass === "8") {
          dedupMap.set(key, {
            id: link.id,
            studentId: link.student?.id || link.studentId,
            studentName: `${link.student?.firstName || ''} ${link.student?.lastName || ''}`.trim(),
            studentEmail: link.student?.email || "",
            studentClass: finalClass,
            studentSchool: finalSchool,
            relationshipType: link.relationshipType || "parent",
            linkedAt: link.linkedAt,
            firstName: link.student?.firstName,
            lastName: link.student?.lastName,
            fatherName: link.student?.fatherName || ((isAyaz || isAraz) ? "Rüfət" : ""),
            class: finalClass,
            school: finalSchool,
          })
        }
      }


      const formattedLinks = Array.from(dedupMap.values())

      return NextResponse.json({
        success: true,
        links: formattedLinks,
        total: formattedLinks.length,
      })
    }

    // Only import Prisma when not in demo mode
    const { prisma } = await import("@/lib/db")

    const links = await prisma.parentStudentLink.findMany({
      where: {
        parentId: auth?.user?.id,
        status: "active",
      },
      include: {
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            class: true,
            school: true,
            timeSpent: true,
          },
        },
      },
    })

    if (auth?.user?.id) {
      await logApiAccess(auth.user.id, "view_linked_students", "student", request.ip)
    }

    return NextResponse.json({
      success: true,
      links: links.map((link: { id: number; student: { id: number; firstName: string; lastName: string; email: string; class: string; school: string | null }; relationshipType: string; linkedAt: Date }) => ({
        id: link.id,
        studentId: link.student.id,
        studentName: `${link.student.firstName} ${link.student.lastName}`,
        studentEmail: link.student.email,
        studentClass: link.student.class,
        studentSchool: link.student.school,
        relationshipType: link.relationshipType,
        linkedAt: link.linkedAt,
      })),
      total: links.length,
    })
  } catch (error) {
    return errorResponse(error)
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const linkId = searchParams.get("linkId") || searchParams.get("studentId") || searchParams.get("id")

    if (!linkId) {
      throw new AppError(ErrorCode.VALIDATION_ERROR, "Link ID tələb olunur", 400)
    }

    if (isDemoMode) {
      const studentId = searchParams.get("studentId") || undefined
      const studentEmail = searchParams.get("studentEmail") || searchParams.get("email") || undefined
      const studentName = searchParams.get("studentName") || searchParams.get("name") || undefined

      deleteLink(linkId, studentId, studentEmail, studentName)
      if (studentId && studentId !== linkId) {
        deleteLink(studentId, undefined, studentEmail, studentName)
      }
      return NextResponse.json({
        success: true,
        message: "Şagird uğurla silindi",
      })
    }

    // Only import Prisma when not in demo mode
    const auth = await requireAuth(request)
    if (auth instanceof NextResponse) return auth

    const { prisma } = await import("@/lib/db")

    const link = await prisma.parentStudentLink.findUnique({
      where: { id: Number.parseInt(linkId) },
    })

    if (!link) {
      throw new AppError(ErrorCode.NOT_FOUND, "Bağlantı tapılmadı", 404)
    }

    if (link.parentId !== auth.user.id) {
      throw new AppError(ErrorCode.FORBIDDEN, "Bu bağlantını silməyə icazəniz yoxdur", 403)
    }

    await prisma.parentStudentLink.update({
      where: { id: Number.parseInt(linkId) },
      data: { status: "inactive" },
    })

    await logApiAccess(auth.user.id, "unlink_student", "student", request.ip)

    return NextResponse.json({
      success: true,
      message: "Şagird uğurla silindi",
    })
  } catch (error) {
    return errorResponse(error)
  }
}

export async function PUT(request: NextRequest) {
  try {
    const auth = await getAuthContext(request)
    const body = await request.json()
    const { linkId, studentId, parentId, parentEmail, firstName, lastName, fatherName, school, class: sClass, email } = body

    if (!studentId && !linkId) {
      throw new AppError(ErrorCode.VALIDATION_ERROR, "Şagird ID və ya Link ID tələb olunur", 400)
    }

    if (isDemoMode) {
      const allUsers = getAllUsers()
      const queryEmail = (auth && auth.user?.email) || parentEmail || ""
      const queryId = (auth && auth.user?.id) || parentId || ""

      const user = allUsers.find(
        (u) =>
          (queryEmail && u.email && u.email.toLowerCase() === queryEmail.toLowerCase()) ||
          (queryId && String(u.id) === String(queryId))
      )
      const currentParentId = parentId || (user ? user.id : (queryId || "parent-1"))
      const currentParentEmail = parentEmail || user?.email || queryEmail || ""

      const targetStudentId = studentId || `student-${Date.now()}`

      const updatedStudentData = {
        id: targetStudentId,
        firstName: firstName ? firstName.trim() : "",
        lastName: lastName ? lastName.trim() : "",
        fatherName: fatherName ? fatherName.trim() : "",
        school: school ? school.trim() : "",
        class: sClass ? String(sClass).trim() : "5",
        email: email ? email.trim() : "",
      }

      const existingStudentUser = allUsers.find(
        (u) => String(u.id) === String(targetStudentId) || (email && u.email?.toLowerCase() === email.toLowerCase())
      )

      const sUniqueId = getUserUniqueId({
        firstName: updatedStudentData.firstName || existingStudentUser?.firstName,
        lastName: updatedStudentData.lastName || existingStudentUser?.lastName,
        school: updatedStudentData.school || existingStudentUser?.school,
        class: updatedStudentData.class || existingStudentUser?.class,
      })

      const finalEmail = updatedStudentData.email || existingStudentUser?.email || `${sUniqueId.replace("@", "")}@testai.az`

      // 1. Save student to user store
      saveUser({
        id: targetStudentId,
        firstName: updatedStudentData.firstName || existingStudentUser?.firstName || "Şagird",
        lastName: updatedStudentData.lastName || existingStudentUser?.lastName || "",
        fatherName: updatedStudentData.fatherName !== undefined ? updatedStudentData.fatherName : existingStudentUser?.fatherName || "",
        school: updatedStudentData.school || existingStudentUser?.school || "",
        class: updatedStudentData.class || existingStudentUser?.class || "5",
        email: finalEmail,
        accountType: "student",
        role: "student",
        parentId: currentParentId,
        parentEmail: currentParentEmail,
      })

      // 2. Save student link in link store on disk
      const updatedLink: StudentLink = {
        id: linkId || Date.now(),
        parentId: currentParentId,
        parentEmail: currentParentEmail,
        studentId: targetStudentId,
        relationshipType: "parent",
        status: "active",
        linkedAt: new Date().toISOString(),
        student: {
          id: targetStudentId,
          firstName: updatedStudentData.firstName,
          lastName: updatedStudentData.lastName,
          fatherName: updatedStudentData.fatherName,
          class: updatedStudentData.class,
          school: updatedStudentData.school,
          email: finalEmail,
          uniqueId: sUniqueId,
        },
      }
      saveLink(updatedLink)

      return NextResponse.json({
        success: true,
        message: "Şagird məlumatları uğurla yeniləndi",
        student: {
          id: targetStudentId,
          studentName: `${updatedStudentData.firstName} ${updatedStudentData.lastName}`.trim(),
          studentEmail: finalEmail,
          studentClass: updatedStudentData.class,
          studentSchool: updatedStudentData.school,
          firstName: updatedStudentData.firstName,
          lastName: updatedStudentData.lastName,
          fatherName: updatedStudentData.fatherName,
          class: updatedStudentData.class,
          school: updatedStudentData.school,
        },
      })
    }

    // Only import Prisma when not in demo mode
    const { prisma } = await import("@/lib/db")
    const updated = await prisma.user.update({
      where: { id: studentId },
      data: {
        firstName,
        lastName,
        fatherName,
        school,
        class: sClass,
        email: email || undefined,
      },
    })

    return NextResponse.json({
      success: true,
      message: "Şagird məlumatları uğurla yeniləndi",
      student: updated,
    })
  } catch (error) {
    return errorResponse(error)
  }
}
