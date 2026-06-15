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

        if (subject && db[subject]) {
            allQuestions = db[subject]
        } else {
            allQuestions = Object.values(db).flat()
        }

        if (topic) {
            allQuestions = allQuestions.filter((q: any) => q.topic === topic || q.topic_key === topic)
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
