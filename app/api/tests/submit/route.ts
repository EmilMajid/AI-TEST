export const dynamic = "force-dynamic"
import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { z } from "zod"

const submitSchema = z.object({
  testId: z.string().uuid(),
  answers: z.record(z.string(), z.number()),
  timeSpent: z.number().min(0),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { testId, answers, timeSpent } = submitSchema.parse(body)

    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get questions for scoring
    const { data: questions } = await supabase.from("questions").select("*").eq("test_id", testId)

    // Calculate score
    let correctCount = 0
    questions?.forEach((q: any) => {
      if (answers[q.id] === q.correct_answer) {
        correctCount++
      }
    })

    const score = Math.round((correctCount / (questions?.length || 1)) * 100)

    // Save test result
    const { data: result, error } = await supabase
      .from("test_results")
      .insert({
        user_id: user.id,
        test_id: testId,
        answers,
        score,
        time_spent: timeSpent,
        completed_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      resultId: result.id,
      score,
      correctCount,
      totalCount: questions?.length || 0,
    })
  } catch (error) {
    console.error("Submit error:", error)
    return NextResponse.json({ error: "Failed to submit test" }, { status: 500 })
  }
}
