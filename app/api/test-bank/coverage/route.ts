import { NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"

const coveragePath = path.join(process.cwd(), "scripts", "topic-coverage.json")

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const topic = searchParams.get("topic")

        if (!fs.existsSync(coveragePath)) {
            return NextResponse.json({ error: "Coverage data not found" }, { status: 404 })
        }

        const coverageData = JSON.parse(fs.readFileSync(coveragePath, "utf-8"))

        // If specific topic requested
        if (topic) {
            const topicData = coverageData[topic]
            if (!topicData) {
                return NextResponse.json({ error: "Topic not found" }, { status: 404 })
            }
            return NextResponse.json(topicData)
        }

        // Return all topics
        return NextResponse.json(coverageData)
    } catch (error) {
        console.error("Error reading coverage:", error)
        return NextResponse.json({ error: "Failed to read coverage data" }, { status: 500 })
    }
}
