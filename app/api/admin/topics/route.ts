export const dynamic = "force-dynamic"
import { type NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"

import os from "os"

const manualTopicsPath = path.join(process.cwd(), "scripts", "manual-topics.json")
const tmpManualTopicsPath = path.join(os.tmpdir(), "manual-topics.json")

const g = globalThis as unknown as { __testai_manual_topics?: Record<string, any> }

export async function GET() {
    try {
        if (g.__testai_manual_topics) {
            return NextResponse.json(g.__testai_manual_topics)
        }
        if (fs.existsSync(manualTopicsPath)) {
            const data = fs.readFileSync(manualTopicsPath, "utf-8")
            const parsed = JSON.parse(data)
            g.__testai_manual_topics = parsed
            return NextResponse.json(parsed)
        }
        if (fs.existsSync(tmpManualTopicsPath)) {
            const data = fs.readFileSync(tmpManualTopicsPath, "utf-8")
            const parsed = JSON.parse(data)
            g.__testai_manual_topics = parsed
            return NextResponse.json(parsed)
        }
        return NextResponse.json({})
    } catch (error) {
        return NextResponse.json({ error: "Failed to read topics" }, { status: 500 })
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { subject, topics } = body

        if (!subject || !topics) {
            return NextResponse.json({ error: "Missing subject or topics" }, { status: 400 })
        }

        let currentData: Record<string, any> = g.__testai_manual_topics || {}
        if (Object.keys(currentData).length === 0 && fs.existsSync(manualTopicsPath)) {
            try {
                currentData = JSON.parse(fs.readFileSync(manualTopicsPath, "utf-8"))
            } catch (e) {}
        }
        if (Object.keys(currentData).length === 0 && fs.existsSync(tmpManualTopicsPath)) {
            try {
                currentData = JSON.parse(fs.readFileSync(tmpManualTopicsPath, "utf-8"))
            } catch (e) {}
        }

        // Update the specific subject
        currentData[subject] = topics
        g.__testai_manual_topics = currentData

        // Write back to file safely
        try {
            const dir = path.dirname(manualTopicsPath)
            if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
            fs.writeFileSync(manualTopicsPath, JSON.stringify(currentData, null, 2))
        } catch (e) {}

        try {
            fs.writeFileSync(tmpManualTopicsPath, JSON.stringify(currentData, null, 2))
        } catch (e) {}

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Error saving topics:", error)
        return NextResponse.json({ error: "Failed to save topics" }, { status: 500 })
    }
}
