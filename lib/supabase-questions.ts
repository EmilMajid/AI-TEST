import { supabaseAdmin } from "@/lib/user-store"

export interface SafeClientQuestion {
  id: number
  question: string
  options: string[]
  difficulty: string
  topic: string
  bloomLevel?: string
  timeEstimate?: number
  sourceContext?: string
}

export interface EvaluatedQuestionResult {
  questionId: number
  question: string
  userAnswer?: number
  correctAnswer: number
  isCorrect: boolean
  explanation: string
  difficulty: string
  bloomLevel?: string
  sourceContext?: string
}

export function resolveCanonicalSubject(textbookTitle: string, gradeDigit: string | number): string {
  const cleanTitle = (textbookTitle || "").replace(/\(.*?\)/g, "").trim()
  const g = String(gradeDigit || "").match(/\b([1-9]|1[0-1])\b/)?.[0] || ""
  
  if (!g) return cleanTitle
  if (/\b([1-9]|1[0-1])$/.test(cleanTitle)) {
    return cleanTitle
  }
  return `${cleanTitle} ${g}`
}

export async function getQuestionsFromSupabase(params: {
  grade: number
  subject: string
  topic: string
  count: number
  difficulty?: string
}): Promise<SafeClientQuestion[]> {
  if (!supabaseAdmin) return []

  const { grade, subject, topic, count, difficulty } = params

  try {
    let query = supabaseAdmin
      .from("Question")
      .select("id, question, options, difficulty, topic, bloomLevel, sourceContext")
      .eq("grade", grade)
      .eq("status", "active")
      .ilike("subject", `%${subject}%`)

    if (topic && topic !== "Ümumi test" && topic !== "Mövzusuz") {
      query = query.ilike("topic", `%${topic.trim()}%`)
    }

    if (difficulty && difficulty !== "qarışıq") {
      query = query.eq("difficulty", difficulty.toLowerCase().trim())
    }

    query = query.limit(Math.max(50, count * 3))

    const timeoutPromise = new Promise<{ data: any[] | null; error: any }>((_, reject) =>
      setTimeout(() => reject(new Error("Supabase timeout (2.5s)")), 2500)
    )

    const { data, error } = (await Promise.race([query, timeoutPromise])) as any

    if (error || !data || data.length === 0) {
      return []
    }

    const shuffled = data.sort(() => Math.random() - 0.5).slice(0, count)

    return shuffled.map((q: any) => ({
      id: q.id,
      question: q.question,
      options: Array.isArray(q.options) ? q.options : [],
      difficulty: q.difficulty || "orta",
      topic: q.topic || topic,
      bloomLevel: q.bloomLevel || "anlama",
      timeEstimate: (q.difficulty === "sadə" || q.difficulty === "asan") ? 1 : (q.difficulty === "çətin") ? 3 : 2,
      sourceContext: q.sourceContext || `> **Mənbə:** ${subject}, "${q.topic}" mövzusu`,
    }))
  } catch (err) {
    console.warn("[Supabase Questions] Query failed or timed out:", err)
    return []
  }
}

export async function evaluateStudentAnswers(
  answersMap: Record<number | string, number>
): Promise<{
  score: number
  correctAnswers: number
  totalQuestions: number
  detailedResults: EvaluatedQuestionResult[]
}> {
  const questionIds = Object.keys(answersMap).map((id) => Number(id)).filter((id) => !isNaN(id) && id > 0)

  if (questionIds.length === 0 || !supabaseAdmin) {
    return { score: 0, correctAnswers: 0, totalQuestions: 0, detailedResults: [] }
  }

  try {
    const { data: realQuestions, error } = await supabaseAdmin
      .from("Question")
      .select("id, question, correctAnswer, explanation, difficulty, bloomLevel, sourceContext")
      .in("id", questionIds)

    if (error || !realQuestions) {
      throw error || new Error("Failed to fetch answer keys")
    }

    let correctCount = 0
    const detailedResults: EvaluatedQuestionResult[] = realQuestions.map((rq: any) => {
      const userAns = answersMap[rq.id]
      const isCorrect = userAns !== undefined && userAns === rq.correctAnswer
      if (isCorrect) correctCount++

      return {
        questionId: rq.id,
        question: rq.question,
        userAnswer: userAns,
        correctAnswer: rq.correctAnswer,
        isCorrect,
        explanation: rq.explanation,
        difficulty: rq.difficulty || "orta",
        bloomLevel: rq.bloomLevel || "anlama",
        sourceContext: rq.sourceContext,
      }
    })

    const total = detailedResults.length
    const score = total > 0 ? Math.round((correctCount / total) * 100) : 0

    return {
      score,
      correctAnswers: correctCount,
      totalQuestions: total,
      detailedResults,
    }
  } catch (e) {
    console.error("[Evaluation] Server-side evaluation error:", e)
    return { score: 0, correctAnswers: 0, totalQuestions: 0, detailedResults: [] }
  }
}
