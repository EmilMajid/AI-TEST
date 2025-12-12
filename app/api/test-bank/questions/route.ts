import { NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"

const questionBankPath = path.join(process.cwd(), "scripts", "question-bank.json")

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const topic = searchParams.get("topic")

        if (!fs.existsSync(questionBankPath)) {
            return NextResponse.json([])
        }

        const questionBank = JSON.parse(fs.readFileSync(questionBankPath, "utf-8"))

        // If specific topic requested
        if (topic) {
            const questions = Object.values(questionBank).filter((q: any) => q.topicKey === topic)
            return NextResponse.json(questions)
        }

        // Return all questions
        return NextResponse.json(Object.values(questionBank))
    } catch (error) {
        console.error("Error reading questions:", error)
        return NextResponse.json({ error: "Failed to read questions" }, { status: 500 })
    }
}
