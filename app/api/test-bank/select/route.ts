import { NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"

const questionBankPath = path.join(process.cwd(), "scripts", "question-bank.json")
const coveragePath = path.join(process.cwd(), "scripts", "topic-coverage.json")

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { topicKey, count = 10, difficulty, bloomLevel } = body

        if (!topicKey) {
            return NextResponse.json({ error: "Topic key required" }, { status: 400 })
        }

        // Load question bank and coverage
        let questionBank: Record<string, any> = {}
        let coverage: Record<string, any> = {}

        if (fs.existsSync(questionBankPath)) {
            questionBank = JSON.parse(fs.readFileSync(questionBankPath, "utf-8"))
        }

        if (fs.existsSync(coveragePath)) {
            coverage = JSON.parse(fs.readFileSync(coveragePath, "utf-8"))
        }

        // Get all questions for this topic
        const topicQuestions = Object.values(questionBank).filter((q: any) => q.topicKey === topicKey)

        // Filter by difficulty and bloom level if specified
        let filteredQuestions = topicQuestions
        if (difficulty) {
            filteredQuestions = filteredQuestions.filter((q: any) => q.difficulty === difficulty)
        }
        if (bloomLevel) {
            filteredQuestions = filteredQuestions.filter((q: any) => q.bloomLevel === bloomLevel)
        }

        // Sort by usage count (least used first)
        filteredQuestions.sort((a: any, b: any) => (a.usageCount || 0) - (b.usageCount || 0))

        // Select questions
        const selected = filteredQuestions.slice(0, count)

        // Update usage count
        selected.forEach((q: any) => {
            if (questionBank[q.id]) {
                questionBank[q.id].usageCount = (questionBank[q.id].usageCount || 0) + 1
            }
        })

        // Save updated question bank
        fs.writeFileSync(questionBankPath, JSON.stringify(questionBank, null, 2))

        return NextResponse.json({
            success: true,
            questions: selected,
            totalAvailable: filteredQuestions.length
        })
    } catch (error) {
        console.error("Error selecting questions:", error)
        return NextResponse.json({ error: "Failed to select questions" }, { status: 500 })
    }
}
