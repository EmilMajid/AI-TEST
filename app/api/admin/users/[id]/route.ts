export const dynamic = "force-dynamic"
import { NextRequest, NextResponse } from "next/server"
import { getAllUsers, blockUser, deleteUser, loadLinksFromDisk, isMockUser, supabaseAdmin, isTargetDeletedUser } from "@/lib/user-store"
import { getUserUniqueId } from "@/lib/profile-utils"
import { getTestResultsForStudent } from "@/lib/test-result-store"
import { requireAdmin } from "@/lib/auth-utils"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    const userId = params.id
    if (
        String(userId).toLowerCase() === "1788541772004" ||
        String(userId).toLowerCase() === "emilinpoctu@gmail.com" ||
        String(userId).toLowerCase() === "inci.mecidzade.161@testai.az" ||
        isTargetDeletedUser({ id: userId, email: userId })
    ) {
        return NextResponse.json({ error: "İstifadəçi tapılmadı" }, { status: 404 })
    }

    const allUsers = getAllUsers()

    // 1. Supabase User cədvəlindən bütün istifadəçiləri allUsers-ə sinxronlaşdır
    try {
        if (supabaseAdmin) {
            const { data: suUsers } = await supabaseAdmin.from("User").select("*")
            if (suUsers && suUsers.length > 0) {
                for (const su of suUsers) {
                    const emailKey = (su.email || "").toLowerCase().trim()
                    const existing = allUsers.find(
                        (u) => (u.email && u.email.toLowerCase() === emailKey) || String(u.id) === String(su.id)
                    )
                    const suIsMock = isMockUser(su)
                    const suSource = su.accountType === "admin" ? "admin" : (suIsMock ? "mock" : "real")
                    if (existing) {
                        if (su.firstName) existing.firstName = su.firstName
                        if (su.lastName) existing.lastName = su.lastName
                        if (su.fatherName) existing.fatherName = su.fatherName
                        if (su.school) existing.school = su.school
                        if (su.class) existing.class = String(su.class)
                        if (su.region) existing.region = su.region
                        if (su.accountType) {
                            existing.accountType = su.accountType
                            existing.role = su.accountType
                        }
                        existing.source = suSource
                    } else {
                        allUsers.push({
                            id: su.id,
                            email: su.email,
                            firstName: su.firstName || "",
                            lastName: su.lastName || "",
                            fatherName: su.fatherName || "",
                            school: su.school || "",
                            class: su.class ? String(su.class) : undefined,
                            region: su.region || "Bakı",
                            accountType: su.accountType || "student",
                            role: su.accountType || "student",
                            status: "active",
                            isBlocked: false,
                            source: suSource,
                        })
                    }
                }
            }
        }
    } catch (sbErr) {
        console.error("Supabase allUsers sync error in user detail:", sbErr)
    }

    let user = allUsers.find(
        (u) =>
            String(u.id) === String(userId) ||
            (u.email && u.email.toLowerCase() === userId.toLowerCase()) ||
            getUserUniqueId(u).toLowerCase() === userId.toLowerCase()
    )

    let supabaseUser: any = null
    try {
        if (supabaseAdmin) {
            const isNum = !isNaN(Number(userId))
            if (isNum) {
                const { data } = await supabaseAdmin.from("User").select("*").eq("id", Number(userId)).maybeSingle()
                supabaseUser = data
            }
            if (!supabaseUser && user?.email) {
                const { data } = await supabaseAdmin.from("User").select("*").eq("email", user.email.toLowerCase().trim()).maybeSingle()
                supabaseUser = data
            }
            if (!supabaseUser && userId.includes("@")) {
                const { data } = await supabaseAdmin.from("User").select("*").eq("email", userId.toLowerCase().trim()).maybeSingle()
                supabaseUser = data
            }
            if (!supabaseUser) {
                const { data: suList } = await supabaseAdmin.from("User").select("*")
                if (suList) {
                    supabaseUser = suList.find((su: any) =>
                        String(su.id) === String(userId) ||
                        (su.email && su.email.toLowerCase() === userId.toLowerCase()) ||
                        (user && su.email && user.email && su.email.toLowerCase() === user.email.toLowerCase())
                    )
                }
            }
        }
    } catch (e) {
        console.error("Supabase user fetch error:", e)
    }

    if (supabaseUser) {
        if (!user) {
            user = {
                id: supabaseUser.id,
                email: supabaseUser.email,
                firstName: supabaseUser.firstName || "",
                lastName: supabaseUser.lastName || "",
                fatherName: supabaseUser.fatherName || "",
                school: supabaseUser.school || "",
                class: supabaseUser.class ? String(supabaseUser.class) : undefined,
                region: supabaseUser.region || "Bakı",
                accountType: supabaseUser.accountType || "student",
                role: supabaseUser.accountType || "student",
                status: "active",
                isBlocked: false,
                source: supabaseUser.accountType === "admin" ? "admin" : (isMockUser(supabaseUser) ? "mock" : "real"),
            }
        } else {
            if (supabaseUser.fatherName) user.fatherName = supabaseUser.fatherName
            if (supabaseUser.firstName) user.firstName = supabaseUser.firstName
            if (supabaseUser.lastName) user.lastName = supabaseUser.lastName
            if (supabaseUser.school) user.school = supabaseUser.school
            if (supabaseUser.class) user.class = String(supabaseUser.class)
            user.source = supabaseUser.accountType === "admin" ? "admin" : (isMockUser(supabaseUser) || isMockUser(user) ? "mock" : "real")
        }
    }

    if (!user) {
        return NextResponse.json({ error: "İstifadəçi tapılmadı" }, { status: 404 })
    }

    let stats: any = null
    const userRole = user.role || user.accountType

    if (userRole === 'student') {
        const isReal = user.source === 'real' || !isMockUser(user)
        const realResults = getTestResultsForStudent(user.id, user.email, `${user.firstName} ${user.lastName}`)

        // Supabase TestResult cədvəlindən də nəticələri əlavə et
        try {
            if (supabaseAdmin) {
                let sUserId: number | null = null
                if (supabaseUser?.id) {
                    sUserId = Number(supabaseUser.id)
                } else if (!isNaN(Number(user.id))) {
                    sUserId = Number(user.id)
                } else if (user.email) {
                    const { data: uData } = await supabaseAdmin
                        .from("User")
                        .select("id")
                        .eq("email", user.email.toLowerCase().trim())
                        .maybeSingle()
                    if (uData?.id) sUserId = uData.id
                }

                if (!sUserId) {
                    const { data: allStudents } = await supabaseAdmin
                        .from("User")
                        .select("id, email, firstName, lastName")
                        .eq("accountType", "student")
                    if (allStudents && allStudents.length > 0) {
                        const matched = allStudents.find((u: any) =>
                            (user.email && u.email && u.email.toLowerCase() === user.email.toLowerCase()) ||
                            (u.firstName && user.firstName && u.firstName.toLowerCase() === user.firstName.toLowerCase() &&
                             u.lastName && user.lastName && u.lastName.toLowerCase() === user.lastName.toLowerCase())
                        )
                        if (matched?.id) sUserId = matched.id
                    }
                }

                if (sUserId) {
                    const { data: trRows } = await supabaseAdmin
                        .from("TestResult")
                        .select("*")
                        .eq("userId", sUserId)
                        .order("completedAt", { ascending: false })

                    if (trRows && trRows.length > 0) {
                        for (const r of trRows) {
                            const exists = realResults.some((s: any) =>
                                String(s.id) === String(r.id) ||
                                (s.textbook === r.textbook && Math.abs(new Date(s.completedAt || 0).getTime() - new Date(r.completedAt || 0).getTime()) < 5000)
                            )
                            if (!exists) {
                                realResults.push({
                                    id: r.id,
                                    studentId: user.id,
                                    studentEmail: user.email,
                                    textbook: r.textbook,
                                    topic: r.topic || "Ümumi sınaq",
                                    class: r.class || user.class || "8",
                                    score: Number(r.score) || 0,
                                    timeSpent: r.timeSpent || 60,
                                    completedAt: r.completedAt,
                                } as any)
                            }
                        }
                    }
                }
            }
        } catch (sbErr) {
            console.error("Error fetching Supabase TestResult for admin user detail:", sbErr)
        }

        if (isReal || realResults.length > 0) {
            if (realResults.length > 0) {
                // Eyni testin təkrarlanan qeydlərini təmizlə
                const dedupedResults: any[] = []
                const seenKeys = new Set<string>()
                for (const r of realResults) {
                    const timeKey = r.completedAt ? new Date(r.completedAt).toISOString().slice(0, 16) : ""
                    const key = `${r.textbook}_${r.topic}_${r.score}_${timeKey}`
                    if (!seenKeys.has(key)) {
                        seenKeys.add(key)
                        dedupedResults.push(r)
                    }
                }

                const totalScore = dedupedResults.reduce((sum, r) => sum + (Number(r.score) || 0), 0)
                const averageScore = Math.round(totalScore / dedupedResults.length)
                
                const subjectMap: Record<string, { total: number; count: number }> = {}
                for (const r of dedupedResults) {
                    const sub = r.textbook || "Digər"
                    if (!subjectMap[sub]) subjectMap[sub] = { total: 0, count: 0 }
                    subjectMap[sub].total += Number(r.score) || 0
                    subjectMap[sub].count += 1
                }
                const subjects = Object.entries(subjectMap).map(([name, data]) => ({
                    name,
                    score: Math.round(data.total / data.count)
                }))

                const recentActivity = dedupedResults.slice(0, 10).map((r, idx) => ({
                    id: r.id || idx + 1,
                    testName: `${r.textbook}${r.topic ? ` - ${r.topic}` : ''}`,
                    date: r.completedAt ? new Date(r.completedAt).toLocaleDateString("az-AZ") : "",
                    score: r.score
                }))

                stats = {
                    isReal,
                    totalTests: dedupedResults.length,
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
    try {
        if (supabaseAdmin) {
            const { data: suLinks } = await supabaseAdmin.from("ParentStudentLink").select("*")
            if (suLinks && suLinks.length > 0) {
                for (const sl of suLinks) {
                    const parent = allUsers.find((u) => String(u.id) === String(sl.parentId))
                    const student = allUsers.find((u) => String(u.id) === String(sl.studentId))
                    if (!allLinks.some((l) => 
                        (String(l.parentId) === String(sl.parentId) || (parent?.email && l.parentEmail?.toLowerCase() === parent.email.toLowerCase())) &&
                        (String(l.studentId) === String(sl.studentId) || (student?.email && l.student?.email?.toLowerCase() === student.email.toLowerCase()))
                    )) {
                        allLinks.push({
                            parentId: sl.parentId,
                            parentEmail: parent?.email,
                            studentId: sl.studentId,
                            student: student ? {
                                id: student.id,
                                email: student.email,
                                firstName: student.firstName,
                                lastName: student.lastName,
                                class: student.class,
                                school: student.school
                            } : undefined
                        })
                    }
                }
            }
        }
    } catch (e) {
        console.error("Supabase link fetch error in user detail:", e)
    }

    if (userRole === 'student') {
        let parent = allUsers.find(u => String(u.id) === String((user as any).parentId) || (supabaseUser?.id && String(u.id) === String((supabaseUser as any).parentId)))
        if (!parent && (user as any).parentEmail) {
            parent = allUsers.find(u => u.email && u.email.toLowerCase() === (user as any).parentEmail?.toLowerCase())
        }
        if (!parent) {
            const l = allLinks.find(
                link => String(link.studentId) === String(user.id) ||
                (supabaseUser?.id && String(link.studentId) === String(supabaseUser.id)) ||
                (link.student?.email && link.student.email.toLowerCase() === user.email?.toLowerCase())
            )
            if (l) {
                parent = allUsers.find(p => String(p.id) === String(l.parentId) || (l.parentEmail && p.email?.toLowerCase() === l.parentEmail.toLowerCase()))
            }
        }
        const teacher = allUsers.find(u => u.id === (user as any).teacherId)
        if (parent) relations.parent = parent
        if (teacher) relations.teacher = teacher
    } else if (userRole === 'parent') {
        const children = allUsers.filter(c => {
            if (c.role !== "student" && c.accountType !== "student") return false

            // Real valideynə demo/mock şagird əlaqələndirilə BİLMƏZ!
            if (user.source === "real" && (c.source === "mock" || c.email?.endsWith("@test.com") || c.email?.endsWith("@example.com"))) {
                return false
            }

            // 1. Şagirdin profilindəki birbaşa parentId
            if ((c as any).parentId && (String((c as any).parentId) === String(user.id) || (supabaseUser?.id && String((c as any).parentId) === String(supabaseUser.id)) || (String((c as any).parentId) === "parent-rufat" && user.email?.toLowerCase() === "r.h.rzayev@gmail.com") || (String((c as any).parentId) === "parent-jale" && user.email?.toLowerCase() === "jalehuseynova@gmail.com"))) {
                return true
            }
            // 2. Şagirdin profilindəki birbaşa parentEmail
            if ((c as any).parentEmail && user.email && (c as any).parentEmail.toLowerCase() === user.email.toLowerCase()) {
                return true
            }
            // 3. Supabase və ya rəsmi ParentStudentLink qeydi
            const l = allLinks.find(
                link => (String(link.parentId) === String(user.id) || (supabaseUser?.id && String(link.parentId) === String(supabaseUser.id)) || (user.email && link.parentEmail?.toLowerCase() === user.email.toLowerCase())) &&
                (String(link.studentId) === String(c.id) || (c.email && link.student?.email?.toLowerCase() === c.email.toLowerCase()))
            )
            if (l) return true

            return false
        })
        const childDedup = new Map<string, any>()
        for (const c of children) {
            const cEmail = (c.email || "").trim().toLowerCase()
            const cName = `${c.firstName || ""} ${c.lastName || ""}`.trim().toLowerCase().replace(/\s+/g, " ")
            const key = cEmail || (cName ? `name:${cName}` : `id:${c.id}`)
            if (!childDedup.has(key)) {
                childDedup.set(key, c)
            }
        }
        relations.children = Array.from(childDedup.values())
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
