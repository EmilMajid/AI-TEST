export const dynamic = "force-dynamic"
import { NextRequest, NextResponse } from "next/server"
import { getAllUsers, blockUser, deleteUser, loadLinksFromDisk, isMockUser } from "@/lib/user-store"
import { getUserUniqueId } from "@/lib/profile-utils"
import { getTestResultsForStudent } from "@/lib/test-result-store"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    const userId = params.id
    const allUsers = getAllUsers()
    const user = allUsers.find(
        (u) =>
            String(u.id) === String(userId) ||
            (u.email && u.email.toLowerCase() === userId.toLowerCase()) ||
            getUserUniqueId(u).toLowerCase() === userId.toLowerCase()
    )

    if (!user) {
        return NextResponse.json({ error: "İstifadəçi tapılmadı" }, { status: 404 })
    }

    let stats: any = null
    const userRole = user.role || user.accountType

    if (userRole === 'student') {
        const isReal = user.source === 'real' || !isMockUser(user)
        const realResults = getTestResultsForStudent(user.id, user.email, `${user.firstName} ${user.lastName}`)

        if (isReal) {
            if (realResults.length > 0) {
                const totalScore = realResults.reduce((sum, r) => sum + (Number(r.score) || 0), 0)
                const averageScore = Math.round(totalScore / realResults.length)
                
                const subjectMap: Record<string, { total: number; count: number }> = {}
                for (const r of realResults) {
                    const sub = r.textbook || "Digər"
                    if (!subjectMap[sub]) subjectMap[sub] = { total: 0, count: 0 }
                    subjectMap[sub].total += Number(r.score) || 0
                    subjectMap[sub].count += 1
                }
                const subjects = Object.entries(subjectMap).map(([name, data]) => ({
                    name,
                    score: Math.round(data.total / data.count)
                }))

                const recentActivity = realResults.slice(0, 10).map((r, idx) => ({
                    id: r.id || idx + 1,
                    testName: `${r.textbook}${r.topic ? ` - ${r.topic}` : ''}`,
                    date: r.completedAt ? new Date(r.completedAt).toLocaleDateString("az-AZ") : "",
                    score: r.score
                }))

                stats = {
                    isReal: true,
                    totalTests: realResults.length,
                    averageScore,
                    subjects,
                    recentActivity
                }
            } else {
                // Real student who hasn't taken any tests yet
                stats = {
                    isReal: true,
                    totalTests: 0,
                    averageScore: 0,
                    subjects: [],
                    recentActivity: []
                }
            }
        } else {
            // Mock demo student
            stats = {
                isReal: false,
                totalTests: Math.floor(Math.random() * 20) + 5,
                averageScore: Math.floor(Math.random() * 40) + 60,
                subjects: [
                    { name: "Riyaziyyat", score: Math.floor(Math.random() * 30) + 70 },
                    { name: "Azərbaycan dili", score: Math.floor(Math.random() * 30) + 70 },
                    { name: "İnformatika", score: Math.floor(Math.random() * 30) + 70 }
                ],
                recentActivity: [
                    { id: 101, testName: "Riyaziyyat - Kvadrat tənliklər", date: "2024-12-05", score: 85 },
                    { id: 102, testName: "Ana dili - Feil", date: "2024-12-03", score: 90 },
                    { id: 103, testName: "İnformatika - Alqoritmlər", date: "2024-11-28", score: 75 }
                ]
            }
        }
    }


    let relations: any = {}
    const allLinks = loadLinksFromDisk()
    const userRole = user.role || user.accountType

    if (userRole === 'student') {
        let parent = allUsers.find(u => String(u.id) === String((user as any).parentId))
        if (!parent && (user as any).parentEmail) {
            parent = allUsers.find(u => u.email && u.email.toLowerCase() === (user as any).parentEmail?.toLowerCase())
        }
        if (!parent) {
            const l = allLinks.find(
                link => String(link.studentId) === String(user.id) ||
                (link.student?.email && link.student.email.toLowerCase() === user.email?.toLowerCase())
            )
            if (l) {
                parent = allUsers.find(p => String(p.id) === String(l.parentId) || (l.parentEmail && p.email?.toLowerCase() === l.parentEmail.toLowerCase()))
            }
        }
        if (!parent && (user.email?.toLowerCase() === "ayaz.rzayev.309@testai.az" || (user.firstName?.toLowerCase() === "ayaz" && user.lastName?.toLowerCase() === "rzayev"))) {
            parent = allUsers.find(p => p.email?.toLowerCase() === "r.h.rzayev@gmail.com" || (p.firstName?.toLowerCase() === "rüfət" && p.lastName?.toLowerCase() === "rzayev"))
        }

        const teacher = allUsers.find(u => u.id === (user as any).teacherId)
        if (parent) relations.parent = parent
        if (teacher) relations.teacher = teacher
    } else if (userRole === 'parent') {
        const children = allUsers.filter(c => {
            if (c.role !== "student" && c.accountType !== "student") return false
            if ((c as any).parentId && String((c as any).parentId) === String(user.id)) return true
            if ((c as any).parentEmail && user.email && (c as any).parentEmail.toLowerCase() === user.email.toLowerCase()) return true
            const l = allLinks.find(
                link => (String(link.parentId) === String(user.id) || (user.email && link.parentEmail?.toLowerCase() === user.email.toLowerCase())) &&
                (String(link.studentId) === String(c.id) || (c.email && link.student?.email?.toLowerCase() === c.email.toLowerCase()))
            )
            if (l) return true
            if ((user.email?.toLowerCase() === "r.h.rzayev@gmail.com" || (user.firstName?.toLowerCase() === "rüfət" && user.lastName?.toLowerCase() === "rzayev")) &&
                (c.email?.toLowerCase() === "ayaz.rzayev.309@testai.az" || (c.firstName?.toLowerCase() === "ayaz" && c.lastName?.toLowerCase() === "rzayev"))) {
                return true
            }
            return false
        })
        relations.children = children
    }

    return NextResponse.json({
        success: true,
        user: {
            ...user,
            uniqueId: getUserUniqueId(user),
            isBlocked: user.isBlocked ?? false,
            status: user.isBlocked ? "blocked" : (user.status || "active"),
        },
        stats,
        relations
    })
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const userId = params.id
        if (String(userId).toLowerCase() === "admin-main" || String(userId).toLowerCase() === "admin@edu.az") {
            return NextResponse.json({ error: "Əsas administrator profilini bloklamaq olmaz" }, { status: 403 })
        }

        const body = await request.json()
        const { action, isBlocked } = body
        const shouldBlock = action === "block" ? true : action === "unblock" ? false : Boolean(isBlocked)

        const updated = blockUser(userId, shouldBlock)
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
        return NextResponse.json({ error: error.message || "Xəta baş verdi" }, { status: 500 })
    }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const userId = params.id
        if (String(userId).toLowerCase() === "admin-main" || String(userId).toLowerCase() === "admin@edu.az") {
            return NextResponse.json({ error: "Əsas administrator profilini silmək olmaz" }, { status: 403 })
        }

        deleteUser(userId)
        return NextResponse.json({
            success: true,
            message: "İstifadəçi sistemdən tamamilə silindi",
        })
    } catch (error: any) {
        return NextResponse.json({ error: error.message || "Xəta baş verdi" }, { status: 500 })
    }
}
