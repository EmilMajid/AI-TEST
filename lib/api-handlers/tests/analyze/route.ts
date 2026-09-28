export const dynamic = "force-dynamic"
import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { createClient } from "@/lib/supabase/server"
import { z } from "zod"

const analyzeSchema = z.object({
  testId: z.string().uuid(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { testId } = analyzeSchema.parse(body)

    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get test result and questions
    const { data: testResult, error: resultError } = await supabase
      .from("test_results")
      .select("*")
      .eq("id", testId)
      .eq("user_id", user.id)
      .single()

    if (resultError || !testResult) {
      return NextResponse.json({ error: "Test not found" }, { status: 404 })
    }

    const { data: questions } = await supabase.from("questions").select("*").eq("test_id", testResult.test_id)

    // Analyze performance by Bloom's taxonomy
    const bloomAnalysis = {} as any
    questions?.forEach((q: any) => {
      const level = q.bloom_level
      if (!bloomAnalysis[level]) {
        bloomAnalysis[level] = { total: 0, correct: 0 }
      }
      bloomAnalysis[level].total++

      const userAnswer = testResult.answers[q.id]
      if (userAnswer === q.correct_answer) {
        bloomAnalysis[level].correct++
      }
    })

    // Generate analysis using AI
    const { text: analysis } = await generateText({
      model: "openai/gpt-4-turbo",
      system: `You are an educational assessment expert. Analyze the student's test performance 
      and provide constructive feedback in Azerbaijani.`,
      prompt: `Student Score: ${testResult.score}%
      Bloom's Taxonomy Performance: ${JSON.stringify(bloomAnalysis)}
      Total Questions: ${questions?.length || 0}
      
      Provide detailed analysis with recommendations.`,
    })

    return NextResponse.json({
      success: true,
      score: testResult.score,
      bloomAnalysis,
      analysis,
    })
  } catch (error) {
    console.error("Analysis error:", error)
    return NextResponse.json({ error: "Analysis failed" }, { status: 500 })
  }
}
