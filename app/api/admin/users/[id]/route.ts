export const dynamic = "force-dynamic"
import { NextRequest, NextResponse } from "next/server"
import { MOCK_USERS } from "@/lib/mock-data"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    const userId = params.id
    const user = MOCK_USERS.find(u => u.id === userId)

    if (!user) {
        return NextResponse.json({ error: "İstifadəçi tapılmadı" }, { status: 404 })
    }

    // Generate Mock Analytics
    // This simulates data that would come from a real database (TestResult table)
    // We make it deterministic based on user ID logic or just random for demo

    const mockStats = {
        totalTests: Math.floor(Math.random() * 20) + 5,
        averageScore: Math.floor(Math.random() * 40) + 60, // 60-100 random
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

    // Find relations
    let relations: any = {}

    if (user.role === 'student') {
        // Find parent
        const parent = MOCK_USERS.find(u => u.id === (user as any).parentId)
        const teacher = MOCK_USERS.find(u => u.id === (user as any).teacherId)
        if (parent) relations.parent = parent
        if (teacher) relations.teacher = teacher
    } else if (user.role === 'parent') {
        // Find children
        const children = MOCK_USERS.filter(u => (u as any).parentId === user.id)
        relations.children = children
    }

    return NextResponse.json({
        success: true,
        user,
        stats: user.role === 'student' ? mockStats : null,
        relations
    })
}
