import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { requireAuth } from "@/lib/auth-utils"
import { errorResponse, AppError, ErrorCode } from "@/lib/error-handler"
import { requirePermission } from "@/lib/permissions"

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAuth(request)
    if (auth instanceof NextResponse) return auth

    const userRole = auth.user.role || auth.user.accountType
    if (!requirePermission(userRole, "view_audit_logs")) {
      throw new AppError(ErrorCode.FORBIDDEN, "Audit loqlarını görməyə icazəniz yoxdur", 403)
    }

    const { searchParams } = new URL(request.url)
    const action = searchParams.get("action")
    const userId = searchParams.get("userId")
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const skip = (page - 1) * limit

    const where: any = {}
    if (action) where.action = action
    if (userId) where.userId = Number.parseInt(userId)
    if (startDate || endDate) {
      where.createdAt = {}
      if (startDate) where.createdAt.gte = new Date(startDate)
      if (endDate) where.createdAt.lte = new Date(endDate)
    }

    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.auditLog.count({ where }),
    ])

    return NextResponse.json({
      success: true,
      logs,
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
