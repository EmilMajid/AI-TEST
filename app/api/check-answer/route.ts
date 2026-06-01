import { NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"

/**
 * POST /api/check-answer
 * Checks student answers and returns:
 * - Correct/Incorrect status
 * - Correct answer
 * - Explanation from offline database
 * - Original text from textbook
 * - Question details
 */
export async function POST(request: NextRequest) {
  try {
    const { questionId, topic, selectedAnswer, difficulty = "orta" } = await request.json()

    console.log("[v0] Checking answer:", { questionId, topic, selectedAnswer })

    // Load offline database
    const dbPath = path.join(process.cwd(), "data", "offline_tests.json")
    if (!fs.existsSync(dbPath)) {
      return NextResponse.json(
        { error: "Offline database not found" },
        { status: 404 }
      )
    }

    const raw = fs.readFileSync(dbPath, "utf-8")
    const allTests: Record<string, any[]> = JSON.parse(raw)

    // Find the question in offline database
    let foundQuestion: any = null
    let foundTopic: string = ""

    for (const [subject, questions] of Object.entries(allTests)) {
      if (!Array.isArray(questions)) continue

      const subjectLower = subject.toLowerCase()
      const topicLower = (topic || "").toLowerCase()

      // Check if this subject matches the topic
      if (subjectLower.includes(topicLower) || topicLower.includes(subjectLower)) {
        // Search for question in this subject
        for (const item of questions) {
          if (Array.isArray(item.options) && item.id === questionId) {
            foundQuestion = item
            foundTopic = subject
            break
          }
        }
      }

      if (foundQuestion) break
    }

    // If not found by ID, search by question content (fallback)
    if (!foundQuestion) {
      for (const [subject, questions] of Object.entries(allTests)) {
        if (Array.isArray(questions)) {
          const found = questions.find((q: any) => q.id === parseInt(String(questionId)))
          if (found) {
            foundQuestion = found
            foundTopic = subject
            break
          }
        }
      }
    }

    if (!foundQuestion) {
      return NextResponse.json(
        {
          error: "Question not found in offline database",
          fallback: true,
          message: "This question is not in the offline database. Verify with teacher or use AI generation."
        },
        { status: 404 }
      )
    }

    // Check if answer is correct
    const isCorrect = foundQuestion.correctAnswer === selectedAnswer

    // Prepare detailed response
    const response = {
      success: true,
      questionId,
      topic: foundTopic,
      
      // Answer feedback
      isCorrect,
      selectedAnswer,
      correctAnswer: foundQuestion.correctAnswer,
      selectedAnswerText: foundQuestion.options?.[selectedAnswer] || "Unknown",
      correctAnswerText: foundQuestion.options?.[foundQuestion.correctAnswer] || "Unknown",

      // Learning materials (shown regardless of correct/incorrect)
      explanation: foundQuestion.explanation || "No explanation available",
      sourceContext: foundQuestion.sourceContext || "Original text not available",
      bloomLevel: foundQuestion.bloomLevel || "unknown",
      
      // Additional details
      difficulty: foundQuestion.difficulty || difficulty,
      allOptions: foundQuestion.options || [],
      
      // Feedback message
      message: isCorrect 
        ? "✅ Düzgün cavab! Əla oldu!"
        : `❌ Səhv cavab. Düzgün cavab: ${foundQuestion.options?.[foundQuestion.correctAnswer] || "Unknown"}`,
      
      // Study material for learning
      studyMaterial: {
        explanation: foundQuestion.explanation,
        originalText: foundQuestion.sourceContext,
        topic: foundQuestion.topic || topic,
        difficulty: foundQuestion.difficulty || difficulty,
        bloomLevel: foundQuestion.bloomLevel || "knowledge"
      }
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("[v0] Error checking answer:", error)
    return NextResponse.json(
      { error: "Failed to check answer", details: String(error) },
      { status: 500 }
    )
  }
}
