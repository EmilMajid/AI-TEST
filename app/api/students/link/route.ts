import { type NextRequest, NextResponse } from "next/server"
import { requireAuth, logApiAccess } from "@/lib/auth-utils"
import { errorResponse, AppError, ErrorCode } from "@/lib/error-handler"

// Mock storage for demo mode
let mockLinks: any[] = [
  {
    id: 1,
    parentId: "parent-1",
    studentId: "student-1",
    relationshipType: "parent",
    status: "active",
    linkedAt: new Date().toISOString(),
    student: {
      id: "student-1",
      firstName: "İnci",
      lastName: "Məcidzadə",
      email: "inci.mecidzade@example.com",
      class: "6",
      school: "161 saylı məktəb"
    }
  },
  {
    id: 2,
    parentId: "parent-1",
    studentId: "student-2",
    relationshipType: "parent",
    status: "active",
    linkedAt: new Date().toISOString(),
    student: {
      id: "student-2",
      firstName: "Emilia",
      lastName: "Məcidzadə",
      email: "emilia.mecidzade@example.com",
      class: "2",
      school: "161 saylı məktəb"
    }
  }
]

const isDemoMode = process.env.NEXT_PUBLIC_SUPABASE_URL?.includes("demo") || process.env.NODE_ENV === "development"

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuth(request)
    if (auth instanceof NextResponse) return auth

    const body = await request.json()
    const { studentEmail, relationshipType, studentDetails } = body

    if (!studentEmail || !relationshipType) {
      throw new AppError(ErrorCode.VALIDATION_ERROR, "studentEmail və relationshipType tələb olunur", 400)
    }

    if (isDemoMode) {
      // Mock logic for demo mode
      const newLink = {
        id: Date.now(),
        parentId: auth.user.id,
        studentId: 101, // Mock student ID
        relationshipType,
        status: "active",
        linkedAt: new Date().toISOString(),
        student: {
          id: 101,
          firstName: studentDetails?.firstName || "Yeni",
          lastName: studentDetails?.lastName || "Şagird",
          email: studentEmail,
          class: "5", // Default class for new demo students
          school: studentDetails?.school || "Bakı Avropa Liseyi"
        }
      }
      mockLinks.push(newLink)

      return NextResponse.json(
        {
          success: true,
          message: "Sorğu göndərildi (Demo rejimdə avtomatik təsdiqləndi)",
          link: {
            id: newLink.id,
            studentName: `${newLink.student.firstName} ${newLink.student.lastName}`,
            studentEmail: newLink.student.email,
            studentClass: newLink.student.class,
            linkedAt: newLink.linkedAt,
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
    const auth = await requireAuth(request)
    if (auth instanceof NextResponse) return auth

    if (isDemoMode) {
      // Return mock links for demo
      return NextResponse.json({
        success: true,
        links: mockLinks.filter(l => l.parentId === auth.user.id && l.status === "active").map(link => ({
          id: link.id,
          studentId: link.student.id,
          studentName: `${link.student.firstName} ${link.student.lastName}`,
          studentEmail: link.student.email,
          studentClass: link.student.class,
          studentSchool: link.student.school,
          relationshipType: link.relationshipType,
          linkedAt: link.linkedAt,
        })),
        total: mockLinks.length,
      })
    }

    // Only import Prisma when not in demo mode
    const { prisma } = await import("@/lib/db")

    const links = await prisma.parentStudentLink.findMany({
      where: {
        parentId: auth.user.id,
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

    await logApiAccess(auth.user.id, "view_linked_students", "student", request.ip)

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
    const auth = await requireAuth(request)
    if (auth instanceof NextResponse) return auth

    const { searchParams } = new URL(request.url)
    const linkId = searchParams.get("linkId")

    if (!linkId) {
      throw new AppError(ErrorCode.VALIDATION_ERROR, "Link ID tələb olunur", 400)
    }

    if (isDemoMode) {
      mockLinks = mockLinks.filter(l => l.id !== Number(linkId))
      return NextResponse.json({
        success: true,
        message: "Şagird uğurla silindi (Demo)",
      })
    }

    // Only import Prisma when not in demo mode
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
