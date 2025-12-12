import { NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"

const questionBankPath = path.join(process.cwd(), "scripts", "question-bank.json")
const coveragePath = path.join(process.cwd(), "scripts", "topic-coverage.json")

// Helper function to detect problem questions
function detectProblem(question: any): { isProblem: boolean, type?: string, message?: string } {
    if (!question.wrongAnswerStats || !question.usageCount) {
        return { isProblem: false }
    }

    const totalAttempts = question.usageCount
    const wrongAnswers = question.wrongAnswerStats

    // Check if any wrong answer is selected more than 40%
    const wrongPercentages = [0, 1, 2, 3]
        .filter(i => i !== question.correctAnswer)
        .map(i => ({
            option: i,
            count: wrongAnswers[`option${i}`] || 0,
            percentage: ((wrongAnswers[`option${i}`] || 0) / totalAttempts) * 100
        }))

    const dominantWrong = wrongPercentages.find(w => w.percentage > 40)

    if (dominantWrong) {
        return {
            isProblem: true,
            type: 'misleading_option',
            message: `Variant ${dominantWrong.option} çox seçilir (${dominantWrong.percentage.toFixed(1)}%). Test tapşırığı yenidən nəzərdən keçirilməlidir.`
        }
    }

    // Check if success rate is very low
    if (question.successRate !== undefined && question.successRate < 20) {
        return {
            isProblem: true,
            type: 'teaching_gap',
            message: 'Uğur faizi çox aşağıdır. Mövzunun tədrisində problem ola bilər.'
        }
    }

    return { isProblem: false }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { testResults } = body // Array of { questionId, userAnswer, isCorrect }

        if (!testResults || !Array.isArray(testResults)) {
            return NextResponse.json({ error: "Test results required" }, { status: 400 })
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

        const problemsDetected: any[] = []

        // Update statistics for each question
        testResults.forEach((result: any) => {
            const { questionId, userAnswer, isCorrect } = result
            const question = questionBank[questionId]

            if (!question) return

            // Initialize wrong answer stats if not exists
            if (!question.wrongAnswerStats) {
                question.wrongAnswerStats = {
                    option0: 0,
                    option1: 0,
                    option2: 0,
                    option3: 0
                }
            }

            // Update wrong answer count
            question.wrongAnswerStats[`option${userAnswer}`] =
                (question.wrongAnswerStats[`option${userAnswer}`] || 0) + 1

            // Update success rate
            const totalAttempts = question.usageCount || 0
            const previousSuccesses = (question.successRate || 0) * (totalAttempts - 1) / 100
            const newSuccesses = previousSuccesses + (isCorrect ? 1 : 0)
            question.successRate = (newSuccesses / totalAttempts) * 100

            // Detect problems
            const problemCheck = detectProblem(question)
            if (problemCheck.isProblem) {
                question.isProblemDetected = true
                question.problemType = problemCheck.type

                problemsDetected.push({
                    questionId,
                    question: question.question,
                    type: problemCheck.type,
                    message: problemCheck.message
                })
            }
        })

        // Save updated question bank
        fs.writeFileSync(questionBankPath, JSON.stringify(questionBank, null, 2))

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
