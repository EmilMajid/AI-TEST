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

        const extractQuestions = (val: any, sKey?: string) => {
            if (Array.isArray(val)) {
                val.forEach((item: any) => {
                    if (item.questions && Array.isArray(item.questions)) {
                        item.questions.forEach((q: any) => {
                            if (!q.topic && item.topic_key) q.topic = item.topic_key
                            if (!q.category && sKey) q.category = sKey
                            pool.push(q)
                        })
                    } else if (item.question) {
                        if (!item.category && sKey) item.category = sKey
                        pool.push(item)
                    }
                })
            } else if (typeof val === "object" && val !== null) {
                Object.entries(val).forEach(([tKey, qList]: [string, any]) => {
                    if (Array.isArray(qList)) {
                        qList.forEach((q: any) => {
                            if (!q.topic) q.topic = tKey
                            if (!q.category && sKey) q.category = sKey
                            pool.push(q)
                        })
                    }
                })
            }
        }

        if (subject && db[subject]) {
            extractQuestions(db[subject], subject)
        } else {
            Object.entries(db).forEach(([sKey, val]) => extractQuestions(val, sKey))
        }

        // Filter by topic
        const norm = (s: string) => (s || "").toLowerCase().replace(/["'“”«»()]/g, "").trim()
        const targetNorm = norm(topicKey)

        let filtered = pool.filter((q: any) => {
            const qTopic = norm(q.topic || q.topic_key || "")
            return qTopic === targetNorm || qTopic.includes(targetNorm) || targetNorm.includes(qTopic)
        })

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
