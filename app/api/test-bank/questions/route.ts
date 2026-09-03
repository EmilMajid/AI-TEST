export const dynamic = "force-dynamic"
import { NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"

const offlineTestsPath = path.join(process.cwd(), "data", "offline_tests.json")

function loadDb(): Record<string, any[]> {
    if (!fs.existsSync(offlineTestsPath)) return {}
    return JSON.parse(fs.readFileSync(offlineTestsPath, "utf-8"))
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const topic = searchParams.get("topic")
        const subject = searchParams.get("subject")

        const db = loadDb()
        let allQuestions: any[] = []

        const extractQuestions = (val: any, sKey?: string) => {
            if (Array.isArray(val)) {
                val.forEach((item: any) => {
                    if (item.questions && Array.isArray(item.questions)) {
                        item.questions.forEach((q: any) => {
                            if (!q.topic && item.topic_key) q.topic = item.topic_key
                            if (!q.category && sKey) q.category = sKey
                            allQuestions.push(q)
                        })
                    } else if (item.question) {
                        if (!item.category && sKey) item.category = sKey
                        allQuestions.push(item)
                    }
                })
            } else if (typeof val === "object" && val !== null) {
                Object.entries(val).forEach(([tKey, qList]: [string, any]) => {
                    if (Array.isArray(qList)) {
                        qList.forEach((q: any) => {
                            if (!q.topic) q.topic = tKey
                            if (!q.category && sKey) q.category = sKey
                            allQuestions.push(q)
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

        if (topic) {
            const norm = (s: string) => (s || "").toLowerCase().replace(/["'“”«»()]/g, "").trim()
            const targetNorm = norm(topic)
            allQuestions = allQuestions.filter((q: any) => {
                const qTopic = norm(q.topic || q.topic_key || "")
                return qTopic === targetNorm || qTopic.includes(targetNorm) || targetNorm.includes(qTopic)
            })
        }

        return NextResponse.json(allQuestions)
    } catch (error) {
        console.error("Error reading questions:", error)
        return NextResponse.json({ error: "Failed to read questions" }, { status: 500 })
    }
}

export async function PATCH(request: NextRequest) {
    try {
        const { passport_id, status } = await request.json()

        if (!passport_id) {
            return NextResponse.json({ error: "passport_id required" }, { status: 400 })
        }

        const db = loadDb()
        let found = false

        for (const subject of Object.keys(db)) {
            const idx = db[subject].findIndex((q: any) => q.passport_id === passport_id)
            if (idx !== -1) {
                if (status !== undefined) db[subject][idx].status = status
                found = true
                break
            }
        }

        if (!found) {
            return NextResponse.json({ error: "Question not found" }, { status: 404 })
        }

        fs.writeFileSync(offlineTestsPath, JSON.stringify(db, null, 2))
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Error updating question:", error)
        return NextResponse.json({ error: "Failed to update question" }, { status: 500 })
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const passport_id = searchParams.get("passport_id")

        if (!passport_id) {
            return NextResponse.json({ error: "passport_id required" }, { status: 400 })
        }

        const db = loadDb()
        let found = false

        for (const subject of Object.keys(db)) {
            const idx = db[subject].findIndex((q: any) => q.passport_id === passport_id)
            if (idx !== -1) {
                db[subject].splice(idx, 1)
                found = true
                break
            }
        }

        if (!found) {
            return NextResponse.json({ error: "Question not found" }, { status: 404 })
        }

        fs.writeFileSync(offlineTestsPath, JSON.stringify(db, null, 2))
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Error deleting question:", error)
        return NextResponse.json({ error: "Failed to delete question" }, { status: 500 })
    }
}
