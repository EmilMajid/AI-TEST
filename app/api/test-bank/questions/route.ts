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

export async function PATCH(request: NextRequest) {
    try {
        const { id, status, isPending } = await request.json()

        if (!fs.existsSync(questionBankPath)) {
            return NextResponse.json({ error: "Database not found" }, { status: 404 })
        }

        const questionBank = JSON.parse(fs.readFileSync(questionBankPath, "utf-8"))

        if (!questionBank[id]) {
            return NextResponse.json({ error: "Question not found" }, { status: 404 })
        }

        // Update fields
        if (status !== undefined) questionBank[id].status = status
        if (isPending !== undefined) questionBank[id].isPending = isPending

        fs.writeFileSync(questionBankPath, JSON.stringify(questionBank, null, 2))

        return NextResponse.json({ success: true, question: questionBank[id] })
    } catch (error) {
        console.error("Error updating question:", error)
        return NextResponse.json({ error: "Failed to update question" }, { status: 500 })
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get("id")

        if (!id) {
            return NextResponse.json({ error: "ID required" }, { status: 400 })
        }

        if (!fs.existsSync(questionBankPath)) {
            return NextResponse.json({ error: "Database not found" }, { status: 404 })
        }

        const questionBank = JSON.parse(fs.readFileSync(questionBankPath, "utf-8"))

        if (!questionBank[id]) {
            return NextResponse.json({ error: "Question not found" }, { status: 404 })
        }

        delete questionBank[id]
        fs.writeFileSync(questionBankPath, JSON.stringify(questionBank, null, 2))

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Error deleting question:", error)
        return NextResponse.json({ error: "Failed to delete question" }, { status: 500 })
    }
}
