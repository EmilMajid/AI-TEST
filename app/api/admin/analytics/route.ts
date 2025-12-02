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
    if (!requirePermission(userRole, "view_school_analytics")) {
      throw new AppError(ErrorCode.FORBIDDEN, "Analitikaya giriş icazəniz yoxdur", 403)
    }

    const totalUsers = await prisma.user.count()
    const totalStudents = await prisma.user.count({ where: { accountType: "student" } })
    const totalParents = await prisma.user.count({ where: { accountType: "parent" } })
    const totalTests = await prisma.testResult.count()
    const avgScore = await prisma.testResult.aggregate({
      _avg: { score: true },
    })

    // Get tests by subject
    const testsBySubject = await prisma.testResult.groupBy({
      by: ["textbook"],
      _count: true,
      _avg: { score: true },
    })

    // Get active users (last 7 days)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const activeUsers = await prisma.auditLog.groupBy({
      by: ["userId"],
      where: {
        createdAt: { gte: sevenDaysAgo },
      },
      _count: true,
    })

    return NextResponse.json({
      success: true,
      analytics: {
        users: {
          total: totalUsers,
          students: totalStudents,
          parents: totalParents,
          activeLastWeek: activeUsers.length,
        },
        tests: {
          total: totalTests,
          averageScore: Math.round((avgScore._avg.score || 0) * 100) / 100,
          bySubject: testsBySubject.map((item: { textbook: string; _count: number; _avg: { score: number | null } }) => ({
            subject: item.textbook,
            count: item._count,
            avgScore: Math.round((item._avg.score || 0) * 100) / 100,
          })),
        },
      },
    })
  } catch (error) {
    return errorResponse(error)
  }
}
