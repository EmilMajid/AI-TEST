import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { requireAuth, logApiAccess } from "@/lib/auth-utils"
import { errorResponse, AppError, ErrorCode } from "@/lib/error-handler"
import { requirePermission } from "@/lib/permissions"

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAuth(request)
    if (auth instanceof NextResponse) return auth

    // Force Mock Response
    return NextResponse.json({
      success: true,
      users: [
        { id: 1, firstName: "Emil", lastName: "Məcidov", email: "emil.mecidov@example.com", accountType: "parent", role: "parent", isActive: true, createdAt: new Date() },
        { id: 2, firstName: "Nigar", lastName: "Hüseynova", email: "nigar.huseynova@test.com", accountType: "teacher", role: "teacher", isActive: true, createdAt: new Date() },
      ],
      pagination: { page: 1, limit: 10, total: 2, pages: 1 },
    })

    const userRole = (auth as any).user.role || (auth as any).user.accountType
    if (!requirePermission(userRole, "manage_users")) {
      throw new AppError(ErrorCode.FORBIDDEN, "Bu əməliyyatı yerinə yetirməyə icazəniz yoxdur", 403)
    }

    const { searchParams } = new URL(request.url)
    const accountType = searchParams.get("accountType")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const skip = (page - 1) * limit

    const where: any = {}
    if (accountType) {
      where.accountType = accountType
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          accountType: true,
          role: true,
          class: true,
          school: true,
          region: true,
          isActive: true,
          createdAt: true,
          lastLogin: true,
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.user.count({ where }),
    ])

    await logApiAccess(auth.user.id, "view_all_users", "user", request.ip)

    return NextResponse.json({
      success: true,
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    return errorResponse(error)
  }
}

export async function PUT(request: NextRequest) {
  try {
    const auth = await requireAuth(request)
    if (auth instanceof NextResponse) return auth

    const userRole = (auth as any).user.role || (auth as any).user.accountType
    if (!requirePermission(userRole, "manage_users")) {
      throw new AppError(ErrorCode.FORBIDDEN, "Bu əməliyyatı yerinə yetirməyə icazəniz yoxdur", 403)
    }

    const body = await request.json()
    const { userId, isActive, role } = body

    if (!userId) {
      throw new AppError(ErrorCode.VALIDATION_ERROR, "User ID tələb olunur", 400)
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(typeof isActive === "boolean" && { isActive }),
        ...(role && { role }),
      },
    })

    await prisma.auditLog.create({
      data: {
        userId: (auth as any).user.id,
        action: "update",
        entity: "user",
        entityId: userId,
        oldValue: { isActive: !updatedUser.isActive, role: updatedUser.role },
        newValue: { isActive: updatedUser.isActive, role: updatedUser.role },
        ipAddress: request.ip,
      },
    })

    await logApiAccess((auth as any).user.id, "update_user", "user", request.ip)

    return NextResponse.json({
      success: true,
      message: "İstifadəçi uğurla yeniləndi",
      user: updatedUser,
    })
  } catch (error) {
    return errorResponse(error)
  }
}
