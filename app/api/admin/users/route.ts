export const dynamic = "force-dynamic"
import { type NextRequest, NextResponse } from "next/server"
import { getAllUsers, saveUser, saveLink, blockUser, deleteUser, loadLinksFromDisk, supabaseAdmin, isMockUser, isTargetDeletedUser } from "@/lib/user-store"
import { getUserUniqueId } from "@/lib/profile-utils"
import { requireAdmin } from "@/lib/auth-utils"

export async function GET(request: NextRequest) {
  const auth = await requireAdmin(request)
  if (auth instanceof NextResponse) return auth

  try {
    const allUsers = getAllUsers()
    const allLinks = loadLinksFromDisk()

    // 1. Supabase User və ParentStudentLink cədvəllərindən real məlumatları yüklə və sinxronlaşdır
    try {
      if (supabaseAdmin) {
        const { data: suUsers } = await supabaseAdmin.from("User").select("*")
        if (suUsers && suUsers.length > 0) {
          for (const su of suUsers) {
            const emailKey = (su.email || "").toLowerCase().trim()
            const existing = allUsers.find(
              (u) => (u.email && u.email.toLowerCase() === emailKey) || String(u.id) === String(su.id)
            )
            const suIsMock = isMockUser(su)
            const suSource = su.accountType === "admin" ? "admin" : (suIsMock ? "mock" : "real")
            if (existing) {
              if (su.firstName) existing.firstName = su.firstName
              if (su.lastName) existing.lastName = su.lastName
              if (su.fatherName) existing.fatherName = su.fatherName
              if (su.school) existing.school = su.school
              if (su.class) existing.class = String(su.class)
              if (su.region) existing.region = su.region
              if (su.accountType) {
                existing.accountType = su.accountType
                existing.role = su.accountType
              }
              existing.source = suSource
            } else {
              allUsers.push({
                id: su.id,
                email: su.email,
                firstName: su.firstName || "",
                lastName: su.lastName || "",
                fatherName: su.fatherName || "",
                school: su.school || "",
                class: su.class ? String(su.class) : undefined,
                region: su.region || "Bakı",
                accountType: su.accountType || "student",
                role: su.accountType || "student",
                status: "active",
                isBlocked: false,
                source: suSource,
              })
            }
          }
        }

        const { data: suLinks } = await supabaseAdmin.from("ParentStudentLink").select("*")
        if (suLinks && suLinks.length > 0) {
          for (const sl of suLinks) {
            const parent = allUsers.find((u) => String(u.id) === String(sl.parentId))
            const student = allUsers.find((u) => String(u.id) === String(sl.studentId))
            if (
              !allLinks.some(
                (l) =>
                  (String(l.parentId) === String(sl.parentId) || (parent?.email && l.parentEmail?.toLowerCase() === parent.email.toLowerCase())) &&
                  (String(l.studentId) === String(sl.studentId) || (student?.email && l.student?.email?.toLowerCase() === student.email.toLowerCase()))
              )
            ) {
              allLinks.push({
                parentId: sl.parentId,
                parentEmail: parent?.email,
                studentId: sl.studentId,
                student: student
                  ? {
                      id: student.id,
                      email: student.email,
                      firstName: student.firstName,
                      lastName: student.lastName,
                      class: student.class,
                      school: student.school,
                    }
                  : undefined,
              })
            }
          }
        }
      }
    } catch (sbErr) {
      console.error("Supabase fetch error in admin users:", sbErr)
    }

    // Ensure all students from parent links are represented in allUsers
    for (const link of allLinks) {
      if (!link.student) continue
      const st = link.student
      const sId = String(st.id || link.studentId)
      const sEmail = (st.email || "").toLowerCase()
      const exists = allUsers.some((u) => String(u.id) === sId || (u.email && u.email.toLowerCase() === sEmail))
      if (!exists) {
        allUsers.push({
          id: sId,
          firstName: st.firstName || "Şagird",
          lastName: st.lastName || "İstifadəçi",
          fatherName: st.fatherName || "",
          school: st.school || "309 saylı məktəb",
          class: st.class || "5",
          email: st.email || `${sId}@testai.az`,
          accountType: "student",
          role: "student",
          parentId: link.parentId,
          parentEmail: link.parentEmail,
          uniqueId: st.uniqueId || getUserUniqueId(st as any),
          source: isMockUser(st) ? "mock" : "real",
          status: "active",
          isBlocked: false,
        } as any)
      }
    }

    const formattedUsers = allUsers.map((u) => {
      const uId = getUserUniqueId(u)
      const isBlocked = u.isBlocked ?? false
      const status = u.isBlocked ? "blocked" : (u.status || "active")

      let linkedParent: any = null
      let linkedChildren: any[] = []

      const userRole = u.role || u.accountType

      if (userRole === "student") {
        let p = allUsers.find((parent) => String(parent.id) === String((u as any).parentId))
        if (!p && (u as any).parentEmail) {
          p = allUsers.find((parent) => parent.email && parent.email.toLowerCase() === (u as any).parentEmail?.toLowerCase())
        }
        if (!p) {
          const l = allLinks.find(
            (link) =>
              String(link.studentId) === String(u.id) ||
              (link.student?.email && link.student.email.toLowerCase() === u.email?.toLowerCase())
          )
          if (l) {
            p = allUsers.find(
              (parent) =>
                String(parent.id) === String(l.parentId) ||
                (l.parentEmail && parent.email?.toLowerCase() === l.parentEmail.toLowerCase())
            )
          }
        }

        if (p) {
          linkedParent = {
            id: p.id,
            name: `${p.firstName} ${p.lastName}`.trim(),
            email: p.email,
            school: p.school,
          }
        }
      } else if (userRole === "parent") {
        const children = allUsers.filter((c) => {
          if (c.role !== "student" && c.accountType !== "student") return false

          // Real valideynə demo/mock şagird əlaqələndirilə BİLMƏZ!
          if (u.source === "real" && (c.source === "mock" || c.email?.endsWith("@test.com") || c.email?.endsWith("@example.com"))) {
            return false
          }

          // 1. Şagirdin profilindəki birbaşa parentId
          if ((c as any).parentId && (String((c as any).parentId) === String(u.id) || (String((c as any).parentId) === "parent-rufat" && u.email?.toLowerCase() === "r.h.rzayev@gmail.com") || (String((c as any).parentId) === "parent-jale" && u.email?.toLowerCase() === "jalehuseynova@gmail.com"))) {
            return true
          }
          // 2. Şagirdin profilindəki birbaşa parentEmail
          if ((c as any).parentEmail && u.email && (c as any).parentEmail.toLowerCase() === u.email.toLowerCase()) {
            return true
          }
          // 3. Supabase və ya rəsmi ParentStudentLink qeydi
          const l = allLinks.find(
            (link) =>
              (String(link.parentId) === String(u.id) || (u.email && link.parentEmail?.toLowerCase() === u.email.toLowerCase())) &&
              (String(link.studentId) === String(c.id) || (c.email && link.student?.email?.toLowerCase() === c.email.toLowerCase()))
          )
          if (l) return true

          return false
        })

        const childDedup = new Map<string, any>()
        for (const c of children) {
          const cEmail = (c.email || "").trim().toLowerCase()
          const cName = `${c.firstName || ""} ${c.lastName || ""}`.trim().toLowerCase().replace(/\s+/g, " ")
          const key = cEmail || (cName ? `name:${cName}` : `id:${c.id}`)
          if (!childDedup.has(key)) {
            childDedup.set(key, {
              id: c.id,
              name: `${c.firstName} ${c.lastName}`.trim(),
              email: c.email,
              class: c.class || "",
              school: c.school || "",
            })
          }
        }
        linkedChildren = Array.from(childDedup.values())
      }

      const isMock = isMockUser(u)
      const effectiveSource = isMock ? "mock" : (u.accountType === "admin" || u.role === "admin" ? "admin" : (u.source || "real"))

      return {
        ...u,
        source: effectiveSource,
        uniqueId: uId,
        isBlocked,
        status,
        linkedParent,
        linkedChildren,
      }
    })

    const filteredUsers = formattedUsers.filter((u: any) => !isTargetDeletedUser(u))

    return NextResponse.json({
      success: true,
      users: filteredUsers,
      total: filteredUsers.length,
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "İstifadəçilər yüklənərkən xəta baş verdi" },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  const auth = await requireAdmin(request)
  if (auth instanceof NextResponse) return auth

  try {
    const body = await request.json()
    const { id, action, isBlocked } = body

    if (!id) {
      return NextResponse.json({ error: "İstifadəçi ID tələb olunur" }, { status: 400 })
    }

    if (String(id).toLowerCase() === "admin-main" || String(id).toLowerCase() === "admin@edu.az") {
      return NextResponse.json({ error: "Əsas administrator profilini bloklamaq olmaz" }, { status: 403 })
    }

    const shouldBlock = action === "block" ? true : action === "unblock" ? false : Boolean(isBlocked)
    const updated = blockUser(id, shouldBlock)

    if (!updated) {
      return NextResponse.json({ error: "İstifadəçi tapılmadı" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: shouldBlock ? "İstifadəçi uğurla bloklandı" : "İstifadəçi uğurla blokdan çıxarıldı",
      user: {
        ...updated,
        uniqueId: getUserUniqueId(updated),
        isBlocked: updated.isBlocked ?? false,
        status: updated.status || (updated.isBlocked ? "blocked" : "active"),
      },
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Əməliyyat icra olunarkən xəta baş verdi" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  const auth = await requireAdmin(request)
  if (auth instanceof NextResponse) return auth

  try {
    const { searchParams } = new URL(request.url)
    let id = searchParams.get("id")

    if (!id) {
      try {
        const body = await request.json()
        id = body.id
      } catch (e) {}
    }

    if (!id) {
      return NextResponse.json({ error: "İstifadəçi ID tələb olunur" }, { status: 400 })
    }

    if (String(id).toLowerCase() === "admin-main" || String(id).toLowerCase() === "admin@edu.az") {
      return NextResponse.json({ error: "Əsas administrator profilini silmək olmaz" }, { status: 403 })
    }

    deleteUser(id)

    return NextResponse.json({
      success: true,
      message: "İstifadəçi sistemdən tamamilə silindi",
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "İstifadəçi silinərkən xəta baş verdi" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { users, links } = body
    let syncedCount = 0

    if (Array.isArray(users)) {
      for (const u of users) {
        if (!u || (!u.email && !u.id)) continue
        if (isTargetDeletedUser(u)) continue
        saveUser({
          id: u.id || `student-${Date.now()}`,
          firstName: u.firstName || "İstifadəçi",
          lastName: u.lastName || "",
          fatherName: u.fatherName || "",
          school: u.school || "",
          class: u.class || "",
          email: u.email || `${u.id}@testai.az`,
          password: u.password || "Test@2026",
          accountType: u.accountType || u.role || "student",
          role: u.role || u.accountType || "student",
          parentId: u.parentId,
          parentEmail: u.parentEmail,
          uniqueId: u.uniqueId || getUserUniqueId(u),
          source: isMockUser(u) ? "mock" : (u.source || "real"),
          status: u.status || "active",
          isBlocked: u.isBlocked || false,
        })
        syncedCount++
      }
    }

    if (Array.isArray(links)) {
      for (const l of links) {
        if (!l) continue
        if (isTargetDeletedUser(l.student) || isTargetDeletedUser({ id: l.studentId, email: l.student?.email })) continue
        if (String(l.parentId) === "1788541772004" || l.parentEmail?.toLowerCase() === "emilinpoctu@gmail.com") continue
        saveLink(l)
      }
    }

    return NextResponse.json({
      success: true,
      message: "İstifadəçilər uğurla sinxronlaşdırıldı",
      count: syncedCount,
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Sinxronlaşdırma zamanı xəta baş verdi" },
      { status: 500 }
    )
  }
}
