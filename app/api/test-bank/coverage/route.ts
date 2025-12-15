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

export async function PATCH(request: NextRequest) {
    try {
        const body = await request.json()
        const { topicKey, targetQuestions } = body

        if (!topicKey || targetQuestions === undefined) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
        }

        if (!fs.existsSync(coveragePath)) {
            return NextResponse.json({ error: "Database not found" }, { status: 404 })
        }

        const coverageData = JSON.parse(fs.readFileSync(coveragePath, "utf-8"))

        if (!coverageData[topicKey]) {
            return NextResponse.json({ error: "Topic not found" }, { status: 404 })
        }

        // Update target
        const topic = coverageData[topicKey]
        topic.targetQuestions = Number(targetQuestions)

        // Recalculate percentage
        if (topic.targetQuestions > 0) {
            topic.completionPercentage = (topic.currentCount / topic.targetQuestions) * 100
        } else {
            topic.completionPercentage = 0
        }

        // Check completion status
        topic.isComplete = topic.currentCount >= topic.targetQuestions

        fs.writeFileSync(coveragePath, JSON.stringify(coverageData, null, 2))

        return NextResponse.json({ success: true, topic })
    } catch (error) {
        console.error("Error updating topic:", error)
        return NextResponse.json({ error: "Failed to update topic" }, { status: 500 })
    }
}
