export const dynamic = "force-dynamic"
import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { createClient } from "@/lib/supabase/server"
import { z } from "zod"

const generateTestSchema = z.object({
  textbook: z.string().min(1),
  topic: z.string().min(1),
  class: z.string().min(1),
  questionCount: z.number().min(1).max(20).default(5),
  difficulty: z.enum(["easy", "medium", "hard"]).default("medium"),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const params = generateTestSchema.parse(body)

    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Generate questions using AI
    const { text } = await generateText({
      model: "openai/gpt-4-turbo",
      system: `You are an educational content creator for Azerbaijani students.
      Generate multiple-choice questions based on the given topic.
      IMPORTANT: Every question must be completely unique, distinct in wording and concept, with no duplicate questions or options.
      Return valid JSON only with this structure:
      {
        "questions": [
          {
            "question": "Question text in Azerbaijani",
            "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
            "correctAnswer": 0,
            "explanation": "Explanation in Azerbaijani",
            "bloomLevel": "knowledge|comprehension|application|analysis|synthesis|evaluation"
          }
        ]
      }`,
      prompt: `Generate ${params.questionCount} ${params.difficulty} distinct multiple-choice questions about:
      Textbook: ${params.textbook}
      Topic: ${params.topic}
      Class: ${params.class}`,
    })

    let parsedQuestions
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      parsedQuestions = JSON.parse(jsonMatch ? jsonMatch[0] : text)
    } catch (e) {
      return NextResponse.json({ error: "Failed to parse generated questions" }, { status: 500 })
    }

    // Deduplicate parsed questions
    const rawList = Array.isArray(parsedQuestions?.questions) ? parsedQuestions.questions : []
    const uniqueMap = new Map<string, any>()
    for (const q of rawList) {
      const key = (q?.question || "").toLowerCase().replace(/[\s\p{P}\p{S}]+/gu, "").trim()
      if (key && !uniqueMap.has(key)) {
        uniqueMap.set(key, q)
      }
    }
    const uniqueQuestionsList = Array.from(uniqueMap.values()).slice(0, params.questionCount)

    // Save test metadata
    const { data: testData, error: testError } = await supabase
      .from("test_data")
      .insert({
        textbook: params.textbook,
        topic: params.topic,
        class: params.class,
        difficulty: params.difficulty,
        question_count: uniqueQuestionsList.length,
      })
      .select()
      .single()

    if (testError) {
      return NextResponse.json({ error: testError.message }, { status: 400 })
    }

    // Save questions
    const questionsToSave = uniqueQuestionsList.map((q: any) => ({
      test_id: testData.id,
      question: q.question,
      options: q.options,
      correct_answer: q.correctAnswer,
      explanation: q.explanation,
      bloom_level: q.bloomLevel,
      difficulty: params.difficulty,
      topic: params.topic,
    }))

    const { data: questions, error: questionsError } = await supabase.from("questions").insert(questionsToSave).select()

    if (questionsError) {
      return NextResponse.json({ error: questionsError.message }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      testId: testData.id,
      questions,
    })
  } catch (error) {
    console.error("Test generation error:", error)
    return NextResponse.json({ error: "Test generation failed" }, { status: 500 })
  }
}
