export const dynamic = "force-dynamic"
import { type NextRequest, NextResponse } from "next/server"
import { getAuthContext } from "@/lib/auth-utils"
import { completeUserProfile, saveLink, type StudentLink, getAllUsers, saveUser } from "@/lib/user-store"
import { getUserUniqueId } from "@/lib/profile-utils"

export async function POST(request: NextRequest) {
  try {
    const auth = await getAuthContext(request)
    const body = await request.json()
    const { region, school, fatherName, parentEmail, parentEmail2, class: optClass, userIdOrEmail } = body

    const targetKey = (auth?.user?.id || auth?.user?.email || userIdOrEmail || "").toString()

    if (!targetKey) {
      return NextResponse.json({ error: "İstifadəçi sessiyası tapılmadı" }, { status: 401 })
    }

    if (!region || !school) {
      return NextResponse.json(
        { error: "Zəhmət olmasa Rayon və Məktəb nömrənizi daxil edin" },
        { status: 400 }
      )
    }

    const updatedUser = completeUserProfile(targetKey, {
      region: (region || "").trim(),
      school: (school || "").trim(),
      fatherName: (fatherName || "").trim(),
      parentEmail: (parentEmail || "").trim().toLowerCase(),
      parentEmail2: (parentEmail2 || "").trim().toLowerCase(),
      class: optClass,
    })

    if (!updatedUser) {
      return NextResponse.json({ error: "İstifadəçi bazada tapılmadı" }, { status: 404 })
    }

    // Əgər 1-ci valideyn emaili qeyd olunubsa, valideyn bağlantısını formalaşdır
    if (parentEmail && parentEmail.includes("@")) {
      const pEmail1 = parentEmail.trim().toLowerCase()
      const link1: StudentLink = {
        id: Date.now(),
        parentId: pEmail1,
        parentEmail: pEmail1,
        studentId: updatedUser.id,
        relationshipType: "parent",
        status: "active",
        linkedAt: new Date().toISOString(),
        student: {
          id: updatedUser.id,
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
          fatherName: updatedUser.fatherName || "",
          email: updatedUser.email,
          uniqueId: getUserUniqueId(updatedUser),
          class: updatedUser.class || "5",
          school: updatedUser.school || school,
        },
      }
      saveLink(link1)
    }

    // Əgər 2-ci valideyn emaili (məs: Ana və ya Ata) qeyd olunubsa, onu da bağla
    if (parentEmail2 && parentEmail2.includes("@")) {
      const pEmail2 = parentEmail2.trim().toLowerCase()
      const link2: StudentLink = {
        id: Date.now() + 1,
        parentId: pEmail2,
        parentEmail: pEmail2,
        studentId: updatedUser.id,
        relationshipType: "parent",
        status: "active",
        linkedAt: new Date().toISOString(),
        student: {
          id: updatedUser.id,
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
          fatherName: updatedUser.fatherName || "",
          email: updatedUser.email,
          uniqueId: getUserUniqueId(updatedUser),
          class: updatedUser.class || "5",
          school: updatedUser.school || school,
        },
      }
      saveLink(link2)
    }

    const clientUser = {
      id: updatedUser.id,
      email: updatedUser.email,
      accountType: updatedUser.accountType,
      role: updatedUser.role || updatedUser.accountType,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      fatherName: updatedUser.fatherName || "",
      school: updatedUser.school,
      class: updatedUser.class,
      region: updatedUser.region,
      uniqueId: getUserUniqueId(updatedUser),
      googleId: updatedUser.googleId,
      avatarUrl: updatedUser.avatarUrl,
      isProfileDone: true,
      profileWarningsCount: 0,
      parentEmail: updatedUser.parentEmail,
    }

    return NextResponse.json({
      success: true,
      message: "Profiliniz uğurla tamamlandı! Test nəticələri açıldı 🎉",
      user: clientUser,
    })
  } catch (error) {
    console.error("complete-profile error:", error)
    return NextResponse.json({ error: "Profilin tamamlanması zamanı xəta baş verdi" }, { status: 500 })
  }
}
