export const dynamic = "force-dynamic"
import { type NextRequest, NextResponse } from "next/server"
import { getAllUsers, blockUser, deleteUser } from "@/lib/user-store"
import { getUserUniqueId } from "@/lib/profile-utils"

export async function GET() {
  try {
    const allUsers = getAllUsers()
    const formattedUsers = allUsers.map((u) => ({
      ...u,
      uniqueId: getUserUniqueId(u),
      isBlocked: u.isBlocked ?? false,
      status: u.isBlocked ? "blocked" : (u.status || "active"),
    }))

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
