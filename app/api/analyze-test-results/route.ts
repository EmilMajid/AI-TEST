export const dynamic = "force-dynamic"
import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { xai } from "@ai-sdk/xai"

interface Question {
  id: number
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
  difficulty: string
  topic: string
  bloomLevel: string
}

interface TestAnalysisRequest {
  testData: {
    textbook: string
    topic: string
    class: string
    difficulty: string
  }
  questions: Question[]
  answers: { [key: number]: number }
  score: number
  timeSpent: number
}

interface QuestionAnalysis {
  questionId: number
  isCorrect: boolean
  userAnswer: string
  correctAnswer: string
  aiExplanation: string
  improvementTips: string[]
  conceptsToReview: string[]
}

interface OverallAnalysis {
  strengths: string[]
  weaknesses: string[]
  recommendations: string[]
  studyPlan: string[]
  nextTopics: string[]
  bloomAnalysis: {
    [key: string]: {
      correct: number
      total: number
      percentage: number
    }
  }
  difficultyAnalysis: {
    [key: string]: {
      correct: number
      total: number
      percentage: number
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: TestAnalysisRequest = await request.json()

    console.log("🔍 Test təhlili başladı:", {
      topic: body.testData.topic,
      score: body.score,
      questionCount: body.questions.length,
    })

    // AI model seçimi
    let model
    let provider = "fallback"

    if (process.env.XAI_API_KEY) {
      model = xai("grok-beta")
      provider = "xai"
    } else if (process.env.OPENAI_API_KEY) {
      model = openai("gpt-4o-mini")
      provider = "openai"
    }

    let questionAnalyses: QuestionAnalysis[] = []
    let overallAnalysis: OverallAnalysis

    if (model) {
      // Hər sual üçün AI təhlili
      for (const question of body.questions) {
        const userAnswer = body.answers[question.id]
        const isCorrect = userAnswer === question.correctAnswer

        try {
          const analysisPrompt = `
Azərbaycan dilində test sualının təhlilini et:

SUAL: ${question.question}
VARIANTLAR: ${question.options.map((opt, idx) => `${String.fromCharCode(65 + idx)}) ${opt}`).join("\n")}
DÜZGÜN CAVAB: ${String.fromCharCode(65 + question.correctAnswer)}) ${question.options[question.correctAnswer]}
İSTİFADƏÇİNİN CAVABI: ${userAnswer !== undefined ? `${String.fromCharCode(65 + userAnswer)}) ${question.options[userAnswer]}` : "Cavab verilməyib"}
MÖVZU: ${body.testData.topic}
ÇƏTİNLİK: ${question.difficulty}
BLOOM SƏVİYYƏSİ: ${question.bloomLevel}

Aşağıdakı formatda cavab ver:

TƏHLIL:
[İstifadəçinin cavabının niyə düzgün və ya səhv olduğunu izah et]

TÖVSİYƏLƏR:
- [Konkret tövsiyə 1]
- [Konkret tövsiyə 2]
- [Konkret tövsiyə 3]

TƏKRAR MÖVZULAR:
- [Təkrar edilməli mövzu 1]
- [Təkrar edilməli mövzu 2]

Qısa və aydın ol. Azərbaycan dilində yaz.`

          const { text } = await generateText({
            model,
            prompt: analysisPrompt,
            maxOutputTokens: 500,
          })

          // AI cavabını parse et
          const sections = text.split(/(?:TƏHLIL:|TÖVSİYƏLƏR:|TƏKRAR MÖVZULAR:)/)

          questionAnalyses.push({
            questionId: question.id,
            isCorrect,
            userAnswer: userAnswer !== undefined ? question.options[userAnswer] : "Cavab verilməyib",
            correctAnswer: question.options[question.correctAnswer],
            aiExplanation: sections[1]?.trim() || question.explanation,
            improvementTips:
              sections[2]
                ?.split("\n")
                .filter((line) => line.trim().startsWith("-"))
                .map((line) => line.replace(/^-\s*/, "").trim()) || [],
            conceptsToReview:
              sections[3]
                ?.split("\n")
                .filter((line) => line.trim().startsWith("-"))
                .map((line) => line.replace(/^-\s*/, "").trim()) || [],
          })
        } catch (error) {
          console.error(`Sual ${question.id} təhlil xətası:`, error)
          // Fallback təhlil
          questionAnalyses.push({
            questionId: question.id,
            isCorrect,
            userAnswer: userAnswer !== undefined ? question.options[userAnswer] : "Cavab verilməyib",
            correctAnswer: question.options[question.correctAnswer],
            aiExplanation: question.explanation,
            improvementTips: [],
            conceptsToReview: [],
          })
        }
      }

      // Ümumi təhlil
      try {
        const overallPrompt = `
Azərbaycan dilində test nəticələrinin ümumi təhlilini et:

TEST MƏLUMATLARI:
- Dərslik: ${body.testData.textbook}
- Mövzu: ${body.testData.topic}
- Sinif: ${body.testData.class}
- Çətinlik: ${body.testData.difficulty}
- Bal: ${body.score}%
- Vaxt: ${Math.floor(body.timeSpent / 60)} dəqiqə ${body.timeSpent % 60} saniyə

SUAL TƏHLİLİ:
${body.questions
            .map((q) => {
              const userAnswer = body.answers[q.id]
              const isCorrect = userAnswer === q.correctAnswer
              return `- ${q.bloomLevel} (${q.difficulty}): ${isCorrect ? "✓" : "✗"}`
            })
            .join("\n")}

Aşağıdakı formatda cavab ver:

GÜCLÜ TƏRƏFLƏRİ:
- [Güclü tərəf 1]
- [Güclü tərəf 2]

ZƏIF TƏRƏFLƏRİ:
- [Zəif tərəf 1]
- [Zəif tərəf 2]

TÖVSİYƏLƏR:
- [Ümumi tövsiyə 1]
- [Ümumi tövsiyə 2]
- [Ümumi tövsiyə 3]

TƏDRİS PLANI:
- [Təkrar edilməli mövzu 1]
- [Təkrar edilməli mövzu 2]
- [Təkrar edilməli mövzu 3]

NÖVBƏTİ MÖVZULAR:
- [Növbəti öyrənilməli mövzu 1]
- [Növbəti öyrənilməli mövzu 2]

Azərbaycan dilində, şəxsi və dəstəkləyici tonda yaz.`

        const { text: overallText } = await generateText({
          model,
          prompt: overallPrompt,
          maxOutputTokens: 800,
        })

        // Ümumi təhlili parse et
        const overallSections = overallText.split(
          /(?:GÜCLÜ TƏRƏFLƏRİ:|ZƏIF TƏRƏFLƏRİ:|TÖVSİYƏLƏR:|TƏDRİS PLANI:|NÖVBƏTİ MÖVZULAR:)/,
        )

        overallAnalysis = {
          strengths:
            overallSections[1]
              ?.split("\n")
              .filter((line) => line.trim().startsWith("-"))
              .map((line) => line.replace(/^-\s*/, "").trim()) || [],
          weaknesses:
            overallSections[2]
              ?.split("\n")
              .filter((line) => line.trim().startsWith("-"))
              .map((line) => line.replace(/^-\s*/, "").trim()) || [],
          recommendations:
            overallSections[3]
              ?.split("\n")
              .filter((line) => line.trim().startsWith("-"))
              .map((line) => line.replace(/^-\s*/, "").trim()) || [],
          studyPlan:
            overallSections[4]
              ?.split("\n")
              .filter((line) => line.trim().startsWith("-"))
              .map((line) => line.replace(/^-\s*/, "").trim()) || [],
          nextTopics:
            overallSections[5]
              ?.split("\n")
              .filter((line) => line.trim().startsWith("-"))
              .map((line) => line.replace(/^-\s*/, "").trim()) || [],
          bloomAnalysis: calculateBloomAnalysis(body.questions, body.answers),
          difficultyAnalysis: calculateDifficultyAnalysis(body.questions, body.answers),
        }
      } catch (error) {
        console.error("Ümumi təhlil xətası:", error)
        overallAnalysis = generateFallbackOverallAnalysis(body)
      }
    } else {
      // Fallback təhlil
      questionAnalyses = body.questions.map((question) => {
        const userAnswer = body.answers[question.id]
        const isCorrect = userAnswer === question.correctAnswer

        return {
          questionId: question.id,
          isCorrect,
          userAnswer: userAnswer !== undefined ? question.options[userAnswer] : "Cavab verilməyib",
          correctAnswer: question.options[question.correctAnswer],
          aiExplanation: question.explanation,
          improvementTips: [],
          conceptsToReview: [],
        }
      })

      overallAnalysis = generateFallbackOverallAnalysis(body)
    }

    console.log("✅ Test təhlili tamamlandı:", {
      provider,
      questionsAnalyzed: questionAnalyses.length,
      overallAnalysisGenerated: !!overallAnalysis,
    })

    return NextResponse.json({
      success: true,
      provider,
      analysis: {
        questionAnalyses,
        overallAnalysis,
        metadata: {
          analyzedAt: new Date().toISOString(),
          provider,
          totalQuestions: body.questions.length,
          correctAnswers: questionAnalyses.filter((qa) => qa.isCorrect).length,
        },
      },
    })
  } catch (error) {
    console.error("Test təhlili xətası:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Test təhlili zamanı xəta baş verdi",
        details: error instanceof Error ? error.message : "Naməlum xəta",
      },
      { status: 500 },
    )
  }
}

function calculateBloomAnalysis(questions: Question[], answers: { [key: number]: number }) {
  const bloomLevels = ["bilmə", "anlama", "tətbiq", "təhlil", "qiymətləndirmə", "yaratma"]
  const analysis: { [key: string]: { correct: number; total: number; percentage: number } } = {}

  bloomLevels.forEach((level) => {
    const levelQuestions = questions.filter((q) => q.bloomLevel === level)
    const correct = levelQuestions.filter((q) => answers[q.id] === q.correctAnswer).length

    analysis[level] = {
      correct,
      total: levelQuestions.length,
      percentage: levelQuestions.length > 0 ? Math.round((correct / levelQuestions.length) * 100) : 0,
    }
  })

  return analysis
}

function calculateDifficultyAnalysis(questions: Question[], answers: { [key: number]: number }) {
  const difficulties = ["sadə", "orta", "çətin"]
  const analysis: { [key: string]: { correct: number; total: number; percentage: number } } = {}

  difficulties.forEach((difficulty) => {
    const difficultyQuestions = questions.filter((q) => q.difficulty === difficulty)
    const correct = difficultyQuestions.filter((q) => answers[q.id] === q.correctAnswer).length

    analysis[difficulty] = {
      correct,
      total: difficultyQuestions.length,
      percentage: difficultyQuestions.length > 0 ? Math.round((correct / difficultyQuestions.length) * 100) : 0,
    }
  })

  return analysis
}

function generateFallbackOverallAnalysis(body: TestAnalysisRequest): OverallAnalysis {
  const score = body.score

  return {
    strengths:
      score >= 80
        ? ["Mövzunu çox yaxşı bilirsən", "Test zamanını yaxşı idarə etmisən", "Əksər sualları düzgün cavablandırmısan"]
        : score >= 60
          ? ["Əsas məfhumları bilirsən", "Bəzi mövzuları yaxşı mənimsəmisən"]
          : ["Cəhd göstərmisən", "Bəzi sualları düzgün cavablandırmısan"],

    weaknesses:
      score < 60
        ? ["Mövzunu daha ətraflı öyrənməlisən", "Əsas məfhumları təkrar etməlisən", "Daha çox məşq etməlisən"]
        : score < 80
          ? ["Bəzi mövzuları təkrar etməlisən", "Daha diqqətli oxumalısan"]
          : ["Kiçik səhvlərə diqqət et"],

    recommendations:
      score >= 80
        ? ["Digər mövzulara keçə bilərsən", "Sinif yoldaşlarına kömək edə bilərsən", "Əlavə testlər həll et"]
        : score >= 60
          ? ["Səhv etdiyin mövzuları təkrar et", "Dərslikdən əlavə oxu", "Müəllimdən kömək istə"]
          : ["Dərsliyi əvvəldən oxu", "Hər gün məşq et", "Müəllimlə əlavə dərs al"],

    studyPlan: [`${body.testData.topic} mövzusunu təkrar et`, "Əsas terminləri öyrən", "Praktik tapşırıqlar həll et"],

    nextTopics: ["Növbəti fəsil mövzuları", "Əlaqəli mövzular", "Təkrar testləri"],

    bloomAnalysis: calculateBloomAnalysis(body.questions, body.answers),
    difficultyAnalysis: calculateDifficultyAnalysis(body.questions, body.answers),
  }
}
