export const dynamic = "force-dynamic"
import { type NextRequest, NextResponse } from "next/server"
import { requireAuth, logApiAccess } from "@/lib/auth-utils"
import { errorResponse, AppError, ErrorCode } from "@/lib/error-handler"
import { MOCK_USERS } from "@/lib/mock-data"

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

const isDemoMode = true; // Forced for full mock mode

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
      // Find the user in MOCK_USERS by email to get their real string ID
      const user = MOCK_USERS.find(u => u.email.toLowerCase() === auth.user.email.toLowerCase());
      const effectiveId = user ? user.id : auth.user.id;

      // Mock logic for demo mode
      const newLink = {
        id: Date.now(),
        parentId: effectiveId,
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
      // Find the user in MOCK_USERS by email to get their real string ID (e.g., "parent-aysel")
      const user = MOCK_USERS.find(u => u.email.toLowerCase() === auth.user.email.toLowerCase());
      const effectiveId = user ? user.id : auth.user.id;

      // Return mock links for demo
      // 1. Get explicit mock links
      const explicitLinks = mockLinks.filter(l => l.parentId === effectiveId && l.status === "active").map(link => ({
        id: link.id,
        studentId: link.student.id,
        studentName: `${link.student.firstName} ${link.student.lastName}`,
        studentEmail: link.student.email,
        studentClass: link.student.class,
        studentSchool: link.student.school,
        relationshipType: link.relationshipType,
        linkedAt: link.linkedAt,
      }));

      // 2. Get links from MOCK_USERS relations
      let relatedStudents: any[] = [];

      if (user) {
        if (user.role === 'parent') {
          relatedStudents = MOCK_USERS.filter(u => (u as any).parentId === user.id);
        } else if (user.role === 'teacher') {
          relatedStudents = MOCK_USERS.filter(u => (u as any).teacherId === user.id);
        } else if (user.role === 'director') {
          relatedStudents = MOCK_USERS.filter(u => (u as any).directorId === user.id || u.school === user.school);
        }
      }

      const relationLinks = relatedStudents.map(student => ({
        id: `rel-${student.id}`,
        studentId: student.id,
        studentName: `${student.firstName} ${student.lastName}`,
        studentEmail: student.email,
        studentClass: student.class,
        studentSchool: student.school,
        relationshipType: user?.role || "parent",
        linkedAt: new Date().toISOString(),
      }));

      // Merge and remove duplicates by studentId
      const allLinks = [...explicitLinks];
      relationLinks.forEach(rl => {
        if (!allLinks.some(al => al.studentId === rl.studentId)) {
          allLinks.push(rl);
        }
      });

      return NextResponse.json({
        success: true,
        links: allLinks,
        total: allLinks.length,
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
      // For demo mode, we just allow deleting any link for now, 
      // but let's check ownership if we have info
      const user = MOCK_USERS.find(u => u.email.toLowerCase() === auth.user.email.toLowerCase());
      const effectiveId = user ? user.id : auth.user.id;

      const linkToDelete = mockLinks.find(l => l.id === Number(linkId));
      if (linkToDelete && linkToDelete.parentId !== effectiveId) {
        // In strict mode we'd fail, but for demo we can be lenient or just log
        console.log(`[Demo] User ${effectiveId} deleting link belonging to ${linkToDelete.parentId}`);
      }

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
