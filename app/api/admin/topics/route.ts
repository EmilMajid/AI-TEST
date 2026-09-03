export const dynamic = "force-dynamic"
import { type NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"

const manualTopicsPath = path.join(process.cwd(), "scripts", "manual-topics.json")

export async function GET() {
    try {
        if (!fs.existsSync(manualTopicsPath)) {
            return NextResponse.json({})
        }
        const data = fs.readFileSync(manualTopicsPath, "utf-8")
        return NextResponse.json(JSON.parse(data))
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

        let currentData: Record<string, any> = {}
        if (fs.existsSync(manualTopicsPath)) {
            currentData = JSON.parse(fs.readFileSync(manualTopicsPath, "utf-8"))
        }

        // Update the specific subject
        currentData[subject] = topics

        // Write back to file
        fs.writeFileSync(manualTopicsPath, JSON.stringify(currentData, null, 2))

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Error saving topics:", error)
        return NextResponse.json({ error: "Failed to save topics" }, { status: 500 })
    }
}
