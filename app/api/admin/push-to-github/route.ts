export const dynamic = "force-dynamic"
import { type NextRequest, NextResponse } from "next/server"
import { saveAndPushQuestions } from "@/lib/github-sync"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { grade, textbook, topic, questions } = body

    if (!grade || !textbook || !topic || !Array.isArray(questions) || questions.length === 0) {
      return NextResponse.json(
        { success: false, error: "Sinif, dərslik, mövzu və ən azı bir sual tələb olunur" },
        { status: 400 }
      )
    }

    const result = await saveAndPushQuestions({
      grade,
      textbook,
      topic,
      questions,
    })

    return NextResponse.json(result, { status: result.success ? 200 : 500 })
  } catch (err: any) {
    console.error("[push-to-github error]:", err)
    return NextResponse.json(
      { success: false, error: err?.message || "Server xətası baş verdi" },
      { status: 500 }
    )
  }
}
