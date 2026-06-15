import { NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"

const offlineTestsPath = path.join(process.cwd(), "data", "offline_tests.json")

function loadDb(): Record<string, any[]> {
    if (!fs.existsSync(offlineTestsPath)) return {}
    return JSON.parse(fs.readFileSync(offlineTestsPath, "utf-8"))
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { topicKey, subject, count = 10, difficulty, bloomLevel } = body

        if (!topicKey) {
            return NextResponse.json({ error: "topicKey required" }, { status: 400 })
        }

        const db = loadDb()
        let pool: any[] = []

        if (subject && db[subject]) {
            pool = db[subject]
        } else {
            pool = Object.values(db).flat()
        }

        // Filter by topic
        let filtered = pool.filter((q: any) => q.topic === topicKey || q.topic_key === topicKey)

        // Apply optional filters
        if (difficulty) filtered = filtered.filter((q: any) => q.difficulty === difficulty)
        if (bloomLevel) filtered = filtered.filter((q: any) => q.bloomLevel === bloomLevel)

        // Shuffle and pick
        const shuffled = filtered.sort(() => Math.random() - 0.5)
        const selected = shuffled.slice(0, count)

        return NextResponse.json({
            success: true,
            questions: selected,
            totalAvailable: filtered.length
        })
    } catch (error) {
        console.error("Error selecting questions:", error)
        return NextResponse.json({ error: "Failed to select questions" }, { status: 500 })
    }
}
