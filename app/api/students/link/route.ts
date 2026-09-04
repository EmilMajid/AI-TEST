export const dynamic = "force-dynamic"
import { type NextRequest, NextResponse } from "next/server"
import { requireAuth, logApiAccess } from "@/lib/auth-utils"
import { errorResponse, AppError, ErrorCode } from "@/lib/error-handler"
import { MOCK_USERS } from "@/lib/mock-data"
import { getUserUniqueId } from "@/lib/profile-utils"
import { getAllUsers } from "@/lib/user-store"

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
  },
  {
    id: 10,
    parentId: "parent-rzayev",
    studentId: "student-gunay",
    relationshipType: "parent",
    status: "active",
    linkedAt: new Date().toISOString(),
    student: {
      id: "student-gunay",
      firstName: "Günay",
      lastName: "Rzayeva",
      email: "gunay.rzayeva@test.com",
      class: "7",
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

    if (!relationshipType) {
      throw new AppError(ErrorCode.VALIDATION_ERROR, "relationshipType tələb olunur", 400)
    }

    if (isDemoMode) {
      // Find the user in MOCK_USERS by email or id
      const user = MOCK_USERS.find(u => (u.email && auth.user?.email && u.email.toLowerCase() === auth.user.email.toLowerCase()) || String(u.id) === String(auth.user?.id));
      const effectiveId = user ? user.id : (auth.user?.id || "parent-1");

      const rawEmailOrId = (studentEmail || "").trim();
      const cleanId = rawEmailOrId.startsWith("@") ? rawEmailOrId : `@${rawEmailOrId}`;

      // Try to find an existing student in MOCK_USERS by email, unique ID, or name
      const matchedStudent = MOCK_USERS.find(u => {
        if (u.accountType !== "student") return false;
        if (rawEmailOrId && u.email && u.email.toLowerCase() === rawEmailOrId.toLowerCase()) return true;
        const uId = getUserUniqueId(u).toLowerCase();
        if (rawEmailOrId && (uId === cleanId.toLowerCase() || uId.replace("@", "") === rawEmailOrId.toLowerCase())) return true;
        if (studentDetails?.firstName && studentDetails?.lastName) {
          return u.firstName.toLowerCase() === studentDetails.firstName.toLowerCase() &&
                 u.lastName.toLowerCase() === studentDetails.lastName.toLowerCase();
        }
        return false;
      });

      const sFirstName = matchedStudent ? matchedStudent.firstName : (studentDetails?.firstName || "Şagird");
      const sLastName = matchedStudent ? matchedStudent.lastName : (studentDetails?.lastName || "İstifadəçi");
      const sSchool = matchedStudent?.school || studentDetails?.school || "161 saylı məktəb";
      const sClass = matchedStudent?.class || studentDetails?.class || "5";
      const sUniqueId = getUserUniqueId({ firstName: sFirstName, lastName: sLastName, school: sSchool });
      const sEmail = matchedStudent?.email || (rawEmailOrId.includes("@") && rawEmailOrId.includes(".") ? rawEmailOrId : `${sUniqueId.replace("@", "")}@testai.az`);
      const sId = matchedStudent ? matchedStudent.id : `student-${Date.now()}`;

      // Mock logic for demo mode
      const newLink = {
        id: Date.now(),
        parentId: effectiveId,
        studentId: sId,
        relationshipType,
        status: "active",
        linkedAt: new Date().toISOString(),
        student: {
          id: sId,
          firstName: sFirstName,
          lastName: sLastName,
          email: sEmail,
          uniqueId: sUniqueId,
          class: sClass,
          school: sSchool
        }
      }
      mockLinks.push(newLink)

      return NextResponse.json(
        {
          success: true,
          message: "Şagird uğurla əlavə edildi",
          link: {
            id: newLink.id,
            studentName: `${sFirstName} ${sLastName}`,
            studentEmail: sEmail,
            studentClass: sClass,
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
      const allUsers = getAllUsers();
      const user = allUsers.find(
        (u) =>
          (u.email && auth.user?.email && u.email.toLowerCase() === auth.user.email.toLowerCase()) ||
          String(u.id) === String(auth.user?.id)
      );
      const effectiveId = user ? user.id : (auth.user?.id || "parent-rzayev");
      const isRzayev = effectiveId === "parent-rzayev" || auth.user?.email?.toLowerCase() === "r.h.rzayev@gmail.com";

      // Return mock links for demo
      // 1. Get explicit mock links
      const explicitLinks = mockLinks
        .filter((l) => (l.parentId === effectiveId || (isRzayev && l.parentId === "parent-rzayev")) && l.status === "active")
        .map((link) => ({
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

      if (user || isRzayev) {
        const uRole = user?.role || "parent";
        if (uRole === "parent" || isRzayev) {
          relatedStudents = allUsers.filter((u) => (u as any).parentId === effectiveId || (isRzayev && (u as any).parentId === "parent-rzayev"));
        } else if (uRole === "teacher") {
          relatedStudents = allUsers.filter((u) => (u as any).teacherId === effectiveId);
        } else if (uRole === "director") {
          relatedStudents = allUsers.filter((u) => (u as any).directorId === effectiveId || u.school === user?.school);
        }
      }

      const relationLinks = relatedStudents.map((student) => ({
        id: `rel-${student.id}`,
        studentId: student.id,
        studentName: `${student.firstName} ${student.lastName}`,
        studentEmail: student.email,
        studentClass: student.class || "7",
        studentSchool: student.school || "161 saylı məktəb",
        relationshipType: user?.role || "parent",
        linkedAt: new Date().toISOString(),
      }));

      // Merge and remove duplicates by studentId
      const allLinks = [...explicitLinks];
      relationLinks.forEach((rl) => {
        if (!allLinks.some((al) => al.studentId === rl.studentId)) {
          allLinks.push(rl);
        }
      });

      // Special guarantee for parent-rzayev: Günay Rzayeva
      if (isRzayev && !allLinks.some((al) => al.studentId === "student-gunay")) {
        allLinks.unshift({
          id: 10,
          studentId: "student-gunay",
          studentName: "Günay Rzayeva",
          studentEmail: "gunay.rzayeva@test.com",
          studentClass: "7",
          studentSchool: "161 saylı məktəb",
          relationshipType: "parent",
          linkedAt: new Date().toISOString(),
        });
      }

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
