export const dynamic = "force-dynamic"
import { type NextRequest, NextResponse } from "next/server"
import { getAllUsers, saveUser, saveLink, blockUser, deleteUser, loadLinksFromDisk } from "@/lib/user-store"
import { getUserUniqueId } from "@/lib/profile-utils"

export async function GET() {
  try {
    const allUsers = getAllUsers()
    const allLinks = loadLinksFromDisk()

    // Ensure all students from parent links are represented in allUsers
    for (const link of allLinks) {
      if (!link.student) continue
      const st = link.student
      const sId = String(st.id || link.studentId)
      const sEmail = (st.email || "").toLowerCase()
      const exists = allUsers.some(u => String(u.id) === sId || (u.email && u.email.toLowerCase() === sEmail))
      if (!exists) {
        allUsers.push({
          id: sId,
          firstName: st.firstName || "Şagird",
          lastName: st.lastName || "İstifadəçi",
          fatherName: st.fatherName || "",
          school: st.school || "161 saylı məktəb",
          class: st.class || "5",
          email: st.email || `${sId}@testai.az`,
          accountType: "student",
          role: "student",
          parentId: link.parentId,
          parentEmail: link.parentEmail,
          uniqueId: st.uniqueId || getUserUniqueId(st as any),
          source: "real",
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
        if (
          !p &&
          (u.email?.toLowerCase() === "ayaz.rzayev.309@testai.az" ||
            (u.firstName?.toLowerCase() === "ayaz" && u.lastName?.toLowerCase() === "rzayev"))
        ) {
          p = allUsers.find(
            (parent) =>
              parent.email?.toLowerCase() === "r.h.rzayev@gmail.com" ||
              (parent.firstName?.toLowerCase() === "rüfət" && parent.lastName?.toLowerCase() === "rzayev")
          )
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
          if ((c as any).parentId && String((c as any).parentId) === String(u.id)) return true
          if ((c as any).parentEmail && u.email && (c as any).parentEmail.toLowerCase() === u.email.toLowerCase()) return true
          const l = allLinks.find(
            (link) =>
              (String(link.parentId) === String(u.id) || (u.email && link.parentEmail?.toLowerCase() === u.email.toLowerCase())) &&
              (String(link.studentId) === String(c.id) || (c.email && link.student?.email?.toLowerCase() === c.email.toLowerCase()))
          )
          if (l) return true
          if (
            (u.email?.toLowerCase() === "r.h.rzayev@gmail.com" ||
              (u.firstName?.toLowerCase() === "rüfət" && u.lastName?.toLowerCase() === "rzayev")) &&
            (c.email?.toLowerCase() === "ayaz.rzayev.309@testai.az" ||
              (c.firstName?.toLowerCase() === "ayaz" && c.lastName?.toLowerCase() === "rzayev"))
          ) {
            return true
          }
          return false
        })

        const childDedup = new Map<string, any>()
        for (const c of children) {
          const cName = `${c.firstName || ""} ${c.lastName || ""}`.trim().toLowerCase().replace(/\s+/g, " ")
          const cEmail = (c.email || "").trim().toLowerCase()
          const key = cName ? `name:${cName}` : (cEmail ? `email:${cEmail}` : `id:${c.id}`)
          if (!childDedup.has(key) || c.class === "8") {
            childDedup.set(key, {
              id: c.id,
              name: `${c.firstName} ${c.lastName}`.trim(),
              email: c.email,
              class: c.class || "8",
              school: c.school || "309 saylı məktəb",
            })
          }
        }
        linkedChildren = Array.from(childDedup.values())
      }

      return {
        ...u,
        uniqueId: uId,
        isBlocked,
        status,
        linkedParent,
        linkedChildren,
      }
    })

    return NextResponse.json({
      success: true,
      users: formattedUsers,
      total: formattedUsers.length,
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "İstifadəçilər yüklənərkən xəta baş verdi" },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
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
          source: "real",
          status: u.status || "active",
          isBlocked: u.isBlocked || false,
        })
        syncedCount++
      }
    }

    if (Array.isArray(links)) {
      for (const l of links) {
        if (!l) continue
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
