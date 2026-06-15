import { NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"

// Stats are tracked in a lightweight separate file to avoid rewriting the full 10MB offline_tests.json on every submission
const statsPath = path.join(process.cwd(), "data", "question_stats.json")

function loadStats(): Record<string, any> {
    if (!fs.existsSync(statsPath)) return {}
    return JSON.parse(fs.readFileSync(statsPath, "utf-8"))
}

function detectProblem(question: any): { isProblem: boolean, type?: string } {
    if (!question.wrongAnswerStats || !question.usageCount || question.usageCount < 5) {
        return { isProblem: false }
    }

    const wrongPercentages = [0, 1, 2, 3]
        .filter(i => i !== question.correctAnswer)
        .map(i => ({
            option: i,
            percentage: ((question.wrongAnswerStats[`option${i}`] || 0) / question.usageCount) * 100
        }))

    const dominantWrong = wrongPercentages.find(w => w.percentage > 40)
    if (dominantWrong) return { isProblem: true, type: "misleading_option" }

    if (question.successRate !== undefined && question.successRate < 20) {
        return { isProblem: true, type: "teaching_gap" }
    }

    return { isProblem: false }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { testResults } = body

        if (!testResults || !Array.isArray(testResults)) {
            return NextResponse.json({ error: "testResults array required" }, { status: 400 })
        }

        const stats = loadStats()
        const problemsDetected: any[] = []

        testResults.forEach((result: any) => {
            const { questionId, userAnswer, isCorrect } = result
            if (!questionId) return

            if (!stats[questionId]) {
                stats[questionId] = {
                    usageCount: 0,
                    successRate: 0,
                    wrongAnswerStats: { option0: 0, option1: 0, option2: 0, option3: 0 },
                    isProblemDetected: false,
                }
            }

            const q = stats[questionId]
            q.usageCount = (q.usageCount || 0) + 1
            q.wrongAnswerStats[`option${userAnswer}`] = (q.wrongAnswerStats[`option${userAnswer}`] || 0) + 1

            const prevSuccesses = (q.successRate || 0) * (q.usageCount - 1) / 100
            q.successRate = ((prevSuccesses + (isCorrect ? 1 : 0)) / q.usageCount) * 100

            const check = detectProblem(q)
            if (check.isProblem) {
                q.isProblemDetected = true
                q.problemType = check.type
                problemsDetected.push({ questionId, type: check.type })
            }
        })

        fs.writeFileSync(statsPath, JSON.stringify(stats, null, 2))

        return NextResponse.json({
            success: true,
            problemsDetected,
            message: problemsDetected.length > 0
                ? `${problemsDetected.length} problemli sual aşkarlandı`
                : "Statistika yeniləndi"
        })
    } catch (error) {
        console.error("Error submitting test results:", error)
        return NextResponse.json({ error: "Failed to submit results" }, { status: 500 })
    }
}
