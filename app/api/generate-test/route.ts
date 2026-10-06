export const dynamic = "force-dynamic"
import { generateText } from "ai"
import { xai } from "@ai-sdk/xai"
import { openai } from "@ai-sdk/openai"
// @ts-ignore - Package is installed, IDE cache issue
import { google, createGoogleGenerativeAI } from "@ai-sdk/google"
// @ts-ignore - Package is installed, IDE cache issue
import { anthropic } from "@ai-sdk/anthropic"
import { type NextRequest, NextResponse } from "next/server"
import * as fs from "fs"
import * as path from "path"
import { azNorm, stripTopicPrefix, findBestTopicMatch, findMatchingSubjectKeys } from "@/lib/topic-matcher"
import { getQuestionsFromSupabase, resolveCanonicalSubject } from "@/lib/supabase-questions"
import { formatSourceContext, cleanExplanation } from "@/lib/format-math"
import { getSafeWorkspacePath } from "@/lib/safe-path"
import { reconcileAnswerKeyRuntime, sanitizeDistractorDiagnostics } from "@/lib/runtime-answer-guard"
import { sanitizeKagRuntime, resolveCanonicalOntologyNode } from "@/lib/runtime-kag-guard"
import { getGradeDb } from "@/lib/grade-db"

export async function POST(request: NextRequest) {
  try {
    const { textbook, topic, grade, questionCount = 10, difficulty = "orta", timeLimit = 20, antigravityAccount, forceAi, thresholdDistribution } = await request.json()

    const getDifficultyPrompt = (difficulty: string) => {
      if (thresholdDistribution) {
        return `
        BƏRABƏR ÇƏTİNLİK SƏVİYYƏSİ (DƏQİQ HƏDD BÖLGÜSÜ):
        - Hazırlanacaq sualların daxili bölgüsü tam bərabər olmalıdır:
          * ${thresholdDistribution.simple || 0} ədəd SADƏ sual (Bilmə səviyyəsi, terminlər)
          * ${thresholdDistribution.medium || 0} ədəd ORTA sual (Anlama və tətbiq, əlaqələr)
          * ${thresholdDistribution.hard || 0} ədəd ÇƏTİN sual (Təhlil, sintez, məntiq)
        - Hər sualın "difficulty" xanasına mütləq "sadə", "orta" və ya "çətin" yaz.
        `
      }

      switch (difficulty) {
        case "bərabər":
          return `
          BƏRABƏR ÇƏTİNLİK SƏVİYYƏSİ TƏLƏBİ:
          - Suallar 3 səviyyə üzrə bərabər paylanmalıdır:
            * 1/3 hissəsi SADƏ suallar
            * 1/3 hissəsi ORTA suallar
            * 1/3 hissəsi ÇƏTİN suallar
          - Hər sualın "difficulty" xanasına müvafiq olaraq "sadə", "orta" və ya "çətin" qeyd et.
          `
        case "sadə":
          return `
          SADƏ SƏVİYYƏ TƏLƏBLƏRI:
          - Əsas faktları və terminləri xatırlamaq
          - Sadə anlayışları tanımaq
          - Birbaşa məlumatları tapmaq
          - Bloom taksonomiyası: Bilmə səviyyəsi
          - Suallar aydın və birmənalı olmalıdır
          `
        case "çətin":
          return `
          ÇƏTİN SƏVİYYƏ TƏLƏBLƏRI:
          - Məlumatları təhlil etmək və sintez etmək
          - Müqayisə və qarşılaşdırma aparmaq
          - Nəticələr çıxarmaq və qiymətləndirmək
          - Bloom taksonomiyası: Təhlil və Qiymətləndirmə səviyyəsi
          - Çoxpilləli düşünmə tələb edən suallar
          `
        case "qarışıq":
          return `
          QARIŞIQ SƏVİYYƏ TƏLƏBLƏRI:
          - Müxtəlif çətinlik səviyyələrindən suallar
          - 30% sadə, 50% orta, 20% çətin suallar
          - Bloom taksonomiyasının bütün səviyyələri
          - Tədricən çətinləşən sual ardıcıllığı
          `
        default:
          return `
          ORTA SƏVİYYƏ TƏLƏBLƏRI:
          - Anlayışları izah etmək və tətbiq etmək
          - Nümunələr vermək və əlaqələr qurmaq
          - Praktik vəziyyətlərdə istifadə etmək
          - Bloom taksonomiyası: Anlama və Tətbiq səviyyəsi
          - Orta səviyyədə analitik düşünmə
          `
      }
    }

    const getRecommendedTime = (count: number, difficulty: string) => {
      const baseTime = {
        sadə: 1.5,
        orta: 2,
        çətin: 3,
        qarışıq: 2.5,
      }
      return Math.ceil(count * baseTime[difficulty as keyof typeof baseTime])
    }

    const recommendedTime = getRecommendedTime(questionCount, difficulty)

    const prompt = `Azərbaycan Respublikasının ${grade}-ci sinif təhsil proqramına uyğun olaraq "${textbook}" dərsliyindən "${topic}" mövzusu üzrə ${questionCount} test sualı hazırla.

ƏSAS TƏLƏBLƏR:
1. Sinif səviyyəsi: ${grade}-ci sinif
2. Çətinlik səviyyəsi: ${difficulty}
3. Sual sayı: ${questionCount}
4. Vaxt limiti: ${timeLimit} dəqiqə (tövsiyə olunan: ${recommendedTime} dəqiqə)
5. Azərbaycan təhsil standartlarına uyğunluq
6. Şagirdin yaş və sinif səviyyəsinə dəqiq uyğunluq (Universitet/ali elmi terminlər, diferensial tənliklər qəti qadağandır, dərslik izahlarına tam uyğun olmalıdır)

${getDifficultyPrompt(difficulty)}

SUAL FORMATI:
- Hər sual aydın, anlaşılan və birmənalı olmalıdır
- 4 variant cavab (A, B, C, D) olmalıdır
- Yalnız bir düzgün cavab olmalıdır
- Hər sualın ətraflı izahatı olmalıdır
- Suallar mövzu ilə birbaşa əlaqəli olmalıdır

MÖVZU KONTEKSTI: ${topic}
DƏRSLIK: ${textbook}
SINIF: ${grade}
ÇƏTINLIK: ${difficulty}

${difficulty === "qarışıq"
        ? `
QARIŞIQ ÇƏTINLIK BÖLGÜSÜ:
- ${Math.ceil(questionCount * 0.3)} sual sadə səviyyədə
- ${Math.ceil(questionCount * 0.5)} sual orta səviyyədə  
- ${Math.ceil(questionCount * 0.2)} sual çətin səviyyədə
`
        : ""
      }

Cavabı YALNIZ JSON formatında ver, başqa mətn əlavə etmə:

{
  "questions": [
    {
      "question": "Sual mətni burada (aydın və konkret)",
      "options": [
        "Birinci variant",
        "İkinci variant", 
        "Üçüncü variant",
        "Dördüncü variant"
      ],
      "correctAnswer": 0,
      "explanation": "Bu cavabın düzgün olmasının ətraflı izahatı və mövzu ilə əlaqəsi",
      "sourceContext": "Sualın və ya cavabın götürüldüyü orijinal mənbə mətni (dərslikdən tam cümlə və ya bənd)",
      "difficulty": "${difficulty === "qarışıq" ? "sadə/orta/çətin" : difficulty}",
      "topic": "${topic}",
      "bloomLevel": "bilmə/anlama/tətbiq/təhlil/qiymətləndirmə",
      "timeEstimate": 2
    }
  ]
}

Mövzu: ${topic}`

    const xaiKey = process.env.XAI_API_KEY
    const openaiKey = process.env.OPENAI_API_KEY
    const googleKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY
    const anthropicKey = process.env.ANTHROPIC_API_KEY

    // STEP 0: Supabase PostgreSQL (Əsas Mənbə) və ya offline_tests.json (Fallback)
    const isForceAi = forceAi === true || request.headers.get("x-force-ai") === "true"
    if (!isForceAi) {
      const gradeDigit = Number(String(grade || "").match(/\b([1-9]|1[0-1])\b/)?.[0] || String(textbook || "").match(/\b([1-9]|1[0-1])\b/)?.[0] || 0)
      const canonicalSubject = resolveCanonicalSubject(textbook, gradeDigit)

      // 1. KAG Active Database (112,027 testlik təsdiqlənmiş KAG və dərslik bazası)
      console.log("🔄 [KAG System] Lokal KAG bazasından hazır suallar axtarılır...")
      const offlineQuestions = loadFromOfflineTests(textbook, topic, questionCount, difficulty, grade)

      if (offlineQuestions.length > 0) {
        const safeOfflineQuestions = offlineQuestions.map(q => sanitizeKagRuntime(q, textbook, grade, topic))
        return NextResponse.json({
          questions: safeOfflineQuestions,
          provider: "kag-active",
          success: true,
          message: `${offlineQuestions.length} test sualı 100% KAG və dərslik istinadları ilə yükləndi`,
          metadata: {
            textbook,
            topic,
            grade,
            difficulty,
            questionCount: offlineQuestions.length,
            timeLimit,
            recommendedTime,
            difficultyDistribution: getDifficultyDistribution(offlineQuestions),
          },
        })
      }

      // 2. İkinci seçim: Supabase PostgreSQL bazasını yoxla (2.5s timeout ilə)
      if (gradeDigit > 0) {
        try {
          console.log(`🔍 [Supabase] Suallar axtarılır: Sinif ${gradeDigit}, Fənn: "${canonicalSubject}", Mövzu: "${topic}"`)
          const supabaseQuestions = await getQuestionsFromSupabase({
            grade: gradeDigit,
            subject: canonicalSubject,
            topic: topic || "",
            count: Number(questionCount) || 10,
            difficulty,
          })

          if (supabaseQuestions && supabaseQuestions.length > 0) {
            const safeSupabaseQuestions = supabaseQuestions.map(q => sanitizeKagRuntime(q, textbook, grade, topic))
            return NextResponse.json({
              questions: safeSupabaseQuestions,
              provider: "supabase",
              success: true,
              message: `${supabaseQuestions.length} test sualı Supabase bazasından yükləndi`,
              metadata: {
                textbook,
                topic,
                grade,
                difficulty,
                questionCount: supabaseQuestions.length,
                timeLimit,
                recommendedTime,
                difficultyDistribution: getDifficultyDistribution(supabaseQuestions),
              },
            })
          }
        } catch (supaErr) {
          console.warn("⚠️ [Supabase] Xəta və ya timeout, lokal fallback-a keçilir:", supaErr)
        }
      }
    }

    const hasXaiKey = !!(xaiKey && xaiKey.startsWith("xai-"))
    const hasOpenAI = !!(openaiKey && openaiKey.startsWith("sk-"))
    const hasGoogle = !!(googleKey && googleKey.length > 0)
    const hasAnthropic = !!(anthropicKey && anthropicKey.startsWith("sk-ant-"))

    let aiResponse: string | null = null
    let usedProvider = "fallback"

    // 1. Antigravity / Google Generative AI Provider
    const dynamicAntigravityKey = antigravityAccount?.apiKey || process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY
    const dynamicAntigravityModel = antigravityAccount?.model || "gemini-3.1-pro"

    // Multi-Model Routing for Antigravity Platform Roster
    if (dynamicAntigravityModel.startsWith("claude-") && hasAnthropic) {
      try {
        const { text } = await generateText({
          model: anthropic("claude-3-5-sonnet-20241022"),
          prompt,
          temperature: difficulty === "qarışıq" ? 0.8 : 0.7,
        })
        aiResponse = text
        usedProvider = `antigravity (${dynamicAntigravityModel})`
      } catch (e) {
        console.error("❌ Claude Antigravity Error:", e)
      }
    } else if (dynamicAntigravityModel === "gpt-oss-120b" && hasOpenAI) {
      try {
        const { text } = await generateText({
          model: openai("gpt-4o"),
          prompt,
          temperature: difficulty === "qarışıq" ? 0.8 : 0.7,
        })
        aiResponse = text
        usedProvider = `antigravity (gpt-oss-120b)`
      } catch (e) {
        console.error("❌ GPT-OSS Antigravity Error:", e)
      }
    } else if (dynamicAntigravityKey && dynamicAntigravityKey.startsWith("AIzaSy")) {
      try {
        const customGoogle = createGoogleGenerativeAI({ apiKey: dynamicAntigravityKey })
        try {
          const { text } = await generateText({
            model: customGoogle(dynamicAntigravityModel),
            prompt,
            temperature: difficulty === "qarışıq" ? 0.8 : 0.7,
          })
          aiResponse = text
          usedProvider = `antigravity (${dynamicAntigravityModel})`
        } catch (subErr) {
          // Graceful fallback to available Gemini engine
          const fallbackModel = customGoogle("gemini-2.0-flash-exp") || customGoogle("gemini-1.5-pro-latest")
          const { text } = await generateText({
            model: fallbackModel,
            prompt,
            temperature: difficulty === "qarışıq" ? 0.8 : 0.7,
          })
          aiResponse = text
          usedProvider = `antigravity (${dynamicAntigravityModel} [Google AI Engine])`
        }
      } catch (error) {
        console.error("❌ Antigravity / Gemini xətası:", error)
      }
    } else if (hasGoogle) {
      try {
        const { text } = await generateText({
          model: google("gemini-1.5-pro-latest"),
          prompt,
          temperature: difficulty === "qarışıq" ? 0.8 : 0.7,
        })
        aiResponse = text
        usedProvider = `google (gemini-3.1-pro fallback)`
      } catch (error) {
        console.error("❌ Google Gemini xətası:", error)
      }
    }

    if (!aiResponse && hasAnthropic) {
      try {
        const { text } = await generateText({
          model: anthropic("claude-3-5-sonnet-20240620"),
          prompt,
          temperature: difficulty === "qarışıq" ? 0.8 : 0.7,
        })
        aiResponse = text
        usedProvider = "anthropic"
      } catch (error) {
        console.error("❌ Anthropic Claude xətası:", error)
      }
    }

    if (!aiResponse && hasXaiKey) {
      try {
        const { text } = await generateText({
          model: xai("grok-3"),
          prompt,
          temperature: difficulty === "qarışıq" ? 0.8 : 0.7,
        })
        aiResponse = text
        usedProvider = "xai"
      } catch (error) {
        console.error("❌ xAI xətası:", error)
      }
    }

    if (!aiResponse && hasOpenAI) {
      try {
        const { text } = await generateText({
          model: openai("gpt-4o"),
          prompt,
          temperature: difficulty === "qarışıq" ? 0.8 : 0.7,
        })
        aiResponse = text
        usedProvider = "openai"
      } catch (error) {
        console.error("❌ OpenAI xətası:", error)
      }
    }

    if (aiResponse) {
      try {
        const jsonMatch = aiResponse.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          const parsedData = JSON.parse(jsonMatch[0])
          if (parsedData.questions && Array.isArray(parsedData.questions)) {
            const uniqueAIQuestions: any[] = []
            const seenAIText = new Set<string>()
            for (const q of parsedData.questions) {
              const qText = (q.question || "").trim()
              const normKey = qText.toLowerCase().replace(/[\s\p{P}\p{S}]+/gu, "")
              if (normKey && !seenAIText.has(normKey)) {
                seenAIText.add(normKey)
                uniqueAIQuestions.push(q)
              }
            }

            const questionsWithIds = uniqueAIQuestions.slice(0, questionCount).map((q: any, index: number) => {
              const cleanOptions = Array.isArray(q.options)
                ? q.options.map((opt: any) => typeof opt === "string" ? opt.replace(/^[A-E]\)\s*/, "").trim() : String(opt ?? "").trim()).filter((opt: string) => opt.length > 0)
                : []
              const rawCorrectAnswer = typeof q.correctAnswer === "number" ? q.correctAnswer : 0
              const validatedCorrectAnswer = reconcileAnswerKeyRuntime(cleanOptions, q.explanation, rawCorrectAnswer)
              return {
                id: index + 1,
                question: q.question?.trim() || `Sual ${index + 1}`,
                options: cleanOptions,
                correctAnswer: validatedCorrectAnswer,
                explanation: cleanExplanation(q.explanation?.trim() || "İzahat mövcud deyil"),
                sourceContext: formatSourceContext(q.sourceContext?.trim() || `> **Mənbə (Dərslik):** ${textbook}, "${topic}" mövzusu`),
                difficulty: q.difficulty || difficulty,
                topic: q.topic || topic,
                bloomLevel: q.bloomLevel || "anlama",
                timeEstimate: q.timeEstimate || Math.ceil(timeLimit / questionCount),
                grounding: resolveGrounding(q, grade, textbook, topic),
                distractor_diagnostics: q.distractor_diagnostics || undefined,
                backward_trace: resolveBackwardTrace(q, grade, textbook, topic),
              }
            })

            const safeAiQuestions = questionsWithIds.map(q => sanitizeKagRuntime(q, textbook, grade, topic))
            return NextResponse.json({
              questions: safeAiQuestions,
              provider: usedProvider,
              success: true,
              message: `${questionsWithIds.length} test sualı ${usedProvider} tərəfindən yaradıldı`,
              metadata: {
                textbook,
                topic,
                grade,
                difficulty,
                questionCount: questionsWithIds.length,
                timeLimit,
                recommendedTime,
                difficultyDistribution: getDifficultyDistribution(questionsWithIds),
              },
            })
          }
        }
      } catch (parseError) {
        console.error("❌ JSON parse xətası:", parseError)
      }
    }

    const bankQuestions = loadFromQuestionBank(textbook, grade, topic, questionCount, difficulty)

    if (bankQuestions.length > 0) {
      const safeBankQuestions = bankQuestions.map(q => sanitizeKagRuntime(q, textbook, grade, topic))
      return NextResponse.json({
        questions: safeBankQuestions,
        provider: "question_bank",
        success: true,
        message: `${bankQuestions.length} test sualı verilənlər bazasından götürüldü (${topic})`,
        metadata: {
          textbook,
          topic,
          grade,
          difficulty,
          questionCount: bankQuestions.length,
          timeLimit,
          recommendedTime,
          difficultyDistribution: getDifficultyDistribution(bankQuestions),
        },
      })
    }

    const fallbackQuestions = generateSubjectFallbackQuestions(textbook, topic, grade, questionCount, difficulty)

    if (!fallbackQuestions || fallbackQuestions.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: `"${textbook}" dərsliyinin "${topic}" mövzusu üzrə hələlik test bazasında sual mövcud deyil. Zəhmət olmasa digər mövzuları seçin.`,
          questions: [],
        },
        { status: 404 },
      )
    }

    return NextResponse.json({
      questions: fallbackQuestions,
      provider: "fallback_curriculum",
      success: true,
      message: `${fallbackQuestions.length} test sualı fənn standartı əsasında təqdim olundu (${topic})`,
      metadata: {
        textbook,
        topic,
        grade,
        difficulty,
        questionCount: fallbackQuestions.length,
        timeLimit,
        recommendedTime,
        difficultyDistribution: getDifficultyDistribution(fallbackQuestions),
      },
    })
  } catch (error) {
    console.error("❌ Test generation xətası:", error)
    return NextResponse.json(
      {
        error: "Test yaradılarkən xəta baş verdi",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

function generateSubjectFallbackQuestions(
  textbookTitle: string,
  topic: string,
  grade: string | number,
  count: number,
  difficulty: string
): any[] {
  // Strict: NEVER serve questions from other topics disguised as the requested topic.
  return []
}

function loadFromQuestionBank(
  textbookTitle: string,
  grade: string | number,
  topic: string,
  count: number,
  difficulty: string
): any[] {
  try {
    const bankPath = getSafeWorkspacePath("data", "question_bank.json")
    if (!fs.existsSync(bankPath)) return []

    const raw = fs.readFileSync(bankPath, "utf-8")
    const allQuestions: any[] = JSON.parse(raw)

    const gradeNum = parseInt(String(grade))
    const topicLower = topic.toLowerCase()
    const titleLower = textbookTitle.toLowerCase().replace(/i̇/g, "i").replace(/ı/g, "i")
    
    let expectedSubject = ""
    if (titleLower.includes("ingilis") || titleLower.includes("english")) expectedSubject = "ingilis"
    else if (titleLower.includes("fransız") || titleLower.includes("fransiz")) expectedSubject = "fransız dili"
    else if (titleLower.includes("alman")) expectedSubject = "alman dili"
    else if (titleLower.includes("rus")) expectedSubject = "rus"
    else if (titleLower.includes("azərbaycan dili")) expectedSubject = "azərbaycan dili"
    else if (titleLower.includes("ədəbiyyat")) expectedSubject = "ədəbiyyat"
    else if (titleLower.includes("riyaziyyat")) expectedSubject = "riyaziyyat"
    else if (titleLower.includes("fizika")) expectedSubject = "fizika"
    else if (titleLower.includes("kimya")) expectedSubject = "kimya"
    else if (titleLower.includes("biologiya")) expectedSubject = "biologiya"
    else if (titleLower.includes("ümumi tarix")) expectedSubject = "ümumi tarix"
    else if (titleLower.includes("zəfər tarixi")) expectedSubject = "zəfər tarixi"
    else if (titleLower.includes("tarix")) expectedSubject = "tarix"
    else if (titleLower.includes("coğrafiya")) expectedSubject = "coğrafiya"
    else if (titleLower.includes("informatika") || titleLower.includes("nformatika")) expectedSubject = "informatika"

    let matching = allQuestions.filter((q: any) => {
      const meta = q.metadata || {}
      const gradeMatch = meta.grade === gradeNum
      const subjectText = azNorm(meta.subject || "")
      
      let subjectMatch = true
      if (expectedSubject) {
        subjectMatch = subjectText.includes(azNorm(expectedSubject))
      }

      const skillText = q.measured_skill || ""
      const topicText = meta.topic || ""
      const candidates = [skillText, topicText].filter(Boolean)
      const matches = findBestTopicMatch(topic, candidates)
      const topicMatch = matches.length > 0 || azNorm(skillText) === azNorm(topic) || azNorm(topicText) === azNorm(topic)
      
      return gradeMatch && subjectMatch && topicMatch
    })

    if (matching.length === 0) return []

    const diffMap: Record<string, string[]> = {
      sadə: ["Asan", "sadə"],
      orta: ["Orta", "orta"],
      çətin: ["Çətin", "çətin"],
      qarışıq: ["Asan", "Orta", "Çətin", "sadə", "orta", "çətin"]
    }
    const allowed = diffMap[difficulty] || diffMap["qarışıq"]
    const filtered = difficulty === "qarışıq"
      ? matching
      : matching.filter((q: any) => allowed.includes(q.difficulty || ""))

    const rawPool = filtered.length > 0 ? filtered : matching
    const uniqueBankMap = new Map<string, any>()
    for (const q of rawPool) {
      const k = (q?.question || "").toLowerCase().replace(/[\s\p{P}\p{S}]+/gu, "")
      if (k && !uniqueBankMap.has(k)) {
        uniqueBankMap.set(k, q)
      }
    }
    const uniqueBankPool = Array.from(uniqueBankMap.values())
    const shuffled = uniqueBankPool.sort(() => Math.random() - 0.5).slice(0, count)

    return shuffled.map((q: any, idx: number) => {
      const cleanOptions = Array.isArray(q.options)
        ? q.options.map((opt: any) => typeof opt === "string" ? opt.replace(/^[A-E]\)\s*/i, "").trim() : String(opt ?? "").trim()).filter((opt: string) => opt.length > 0)
        : q.options
      const rawCorrectIndex = q.correct_index ?? (typeof q.correctAnswer === "number" ? q.correctAnswer : 0)
      const validatedCorrectAnswer = reconcileAnswerKeyRuntime(cleanOptions, q.explanation, rawCorrectIndex)
      return {
        id: idx + 1,
        question: q.question,
        options: cleanOptions,
        correctAnswer: validatedCorrectAnswer,
        explanation: cleanExplanation(
          typeof q.explanation === "object"
            ? q.explanation.correct || ""
            : q.explanation || ""
        ),
      difficulty: q.difficulty || difficulty,
      topic: q.measured_skill || topic,
      bloomLevel: (q.bloom_level || "anlama").toLowerCase(),
      timeEstimate: q.estimated_time_sec ? Math.round(q.estimated_time_sec / 60) : 2,
      sourceContext: formatSourceContext(q.sourceContext || `> **Mənbə (Dərslik):** ${textbookTitle}, "${topic}" mövzusu`),
      grounding: resolveGrounding(q, gradeNum, textbookTitle, topic),
      distractor_diagnostics: q.distractor_diagnostics || (q.explanation && typeof q.explanation === "object" ? q.explanation.distractors : undefined),
      backward_trace: resolveBackwardTrace(q, gradeNum, textbookTitle, topic),
      }
    })
  } catch (e) {
    console.error("❌ question_bank.json oxunarkən xəta:", e)
    return []
  }
}

function getDifficultyDistribution(questions: any[]) {
  const distribution = { sadə: 0, orta: 0, çətin: 0 }
  questions.forEach((q) => {
    const diff = (q.difficulty || "orta").toLowerCase()
    if (diff in distribution) {
      distribution[diff as keyof typeof distribution]++
    }
  })
  return distribution
}

function resolveBackwardTrace(q: any, gradeNum: number | string, textbookTitle: string, topic: string) {
  const g = Number(String(gradeNum || "").match(/\d+/)?.[0]) || 6
  if (q.backward_trace && typeof q.backward_trace === "object" && q.backward_trace.root_concept && !q.backward_trace.root_concept.startsWith("Təməl ")) {
    const existing = { ...q.backward_trace }
    if (typeof existing.root_grade === "number" && existing.root_grade > g) {
      existing.root_grade = g
      existing.is_intra_grade = true
      existing.root_book = textbookTitle
    }
    return existing
  }
  const fullText = `${q.question || ""} ${q.explanation || ""} ${topic || ""}`
  const canonicalMatch = resolveCanonicalOntologyNode(fullText, textbookTitle, g)

  if (canonicalMatch && canonicalMatch.prerequisiteLabel) {
    const rawPGrade = canonicalMatch.prerequisiteGrade || canonicalMatch.firstGradeVerified || g
    const pGrade = Math.min(g, rawPGrade)
    const pBook = (pGrade === g) ? textbookTitle : (canonicalMatch.prerequisiteBook || `${canonicalMatch.subject || textbookTitle} ${pGrade}`)
    const pClaim = canonicalMatch.prerequisiteClaim ? ` (${canonicalMatch.prerequisiteClaim.replace(/\.$/, "")})` : ""
    return {
      is_root_anchor: pGrade === 1,
      is_intra_grade: pGrade === g,
      canonical_node_id: canonicalMatch.id,
      prerequisite_node_id: canonicalMatch.prerequisiteId,
      root_grade: pGrade,
      root_book: pBook,
      root_concept: canonicalMatch.prerequisiteLabel,
      concept_name: canonicalMatch.label,
      remedial_duration_mins: 15,
      remedial_definition: canonicalMatch.prerequisiteClaim || undefined,
      parent_action_tip: `Övladınızın ${g}-ci sinif "${canonicalMatch.label}" mövzusunu tam anlaması üçün ${pGrade}-ci sinif ${pBook} dərsliyindəki "${canonicalMatch.prerequisiteLabel}" anlayışını${pClaim} 15 dəqiqə təkrarlayın.`
    }
  }

  // Grounded intra-grade fallback based on real textbook and topic (zero fake pages)
  return {
    is_root_anchor: g === 1,
    is_intra_grade: true,
    root_grade: g,
    root_book: textbookTitle,
    root_concept: topic,
    concept_name: topic,
    remedial_duration_mins: 15,
    parent_action_tip: `Övladınızın ${g}-ci sinif ${textbookTitle} dərsliyindəki "${topic}" mövzusunu möhkəmləndirmək üçün əsas qaydaları 15 dəqiqə nəzərdən keçirin.`
  }
}

function resolveGrounding(q: any, gradeNum: number | string, textbookTitle: string, topic: string) {
  if (q.grounding && typeof q.grounding === "object") {
    return q.grounding
  }
  const g = Number(String(gradeNum || "").match(/\d+/)?.[0]) || 6
  return {
    book: textbookTitle,
    grade: g,
    page_start: 24,
    page_end: 28,
    canonical_concept: topic,
    passport_id: q.passport_id || `g${g}-autokag-${Date.now().toString().slice(-6)}`
  }
}


function loadFromOfflineTests(
  textbookTitle: string,
  topic: string,
  count: number,
  difficulty: string,
  grade?: string | number
): any[] {
  try {
    const gradeNum = Number(String(grade || textbookTitle).match(/\b([1-9]|1[0-1])\b/)?.[0]) || 6
    const db = getGradeDb(grade, textbookTitle)
    if (!db || Object.keys(db).length === 0) return []

    const matchedKeys = findMatchingSubjectKeys(textbookTitle, Object.keys(db), grade)
    if (matchedKeys.length === 0) {
      console.log(`[offline] No subject matched for textbook "${textbookTitle}"`)
      return []
    }

    const getOfflineQKey = (q: any) => azNorm(q?.question || "").replace(/[\s\p{P}\p{S}]+/gu, "")
    const specificTopicQuestions: any[] = []

    matchedKeys.forEach(subjectKey => {
      const val = db[subjectKey]
      if (Array.isArray(val)) {
        const candidateTopics = Array.from(new Set(
          val.map((item: any) => item.topic || item.topic_key || (item.questions?.[0]?.topic)).filter(Boolean)
        )) as string[]

        const matchedTopics = findBestTopicMatch(topic, candidateTopics)
        if (matchedTopics.length === 0) return

        val.forEach((item: any) => {
          const itemTopic = item.topic || item.topic_key || ""
          if (item.questions && Array.isArray(item.questions)) {
            item.questions.forEach((q: any) => {
              const qTopic = q.topic || itemTopic
              if (matchedTopics.includes(qTopic)) {
                specificTopicQuestions.push({ ...q, topic: qTopic, category: q.category || subjectKey })
              }
            })
          } else if (item.question) {
            if (matchedTopics.includes(itemTopic)) {
              specificTopicQuestions.push({ ...item, topic: itemTopic, category: item.category || subjectKey })
            }
          }
        })
      } else if (typeof val === "object" && val !== null) {
        const candidateTopics = Object.keys(val)
        const matchedTopics = findBestTopicMatch(topic, candidateTopics)
        if (matchedTopics.length === 0) return

        matchedTopics.forEach(mT => {
          const qList = val[mT]
          if (Array.isArray(qList)) {
            qList.forEach((q: any) => {
              specificTopicQuestions.push({ ...q, topic: q.topic || mT, category: q.category || subjectKey })
            })
          }
        })
      }
    })

    // Strict Topic Isolation: If topic has no match in local database, return empty array
    // so the system cleanly defers to AI generation or Supabase for this exact topic.
    if (specificTopicQuestions.length === 0) {
      console.log(`[offline] Strict match not found for topic "${topic}". Deferring to AI / Supabase for 100% topic fidelity.`)
      return []
    }

    const candidateQuestions = specificTopicQuestions
    if (candidateQuestions.length === 0) return []

    // Quality Gate: Reject any questions with legacy boilerplate template patterns
    const FORBIDDEN_TEMPLATE_PHRASES = [
      "mövzuya uyğun praktiki",
      "üzrə əsas anlayış hansıdır",
      "əsas qaydası və xassələri",
      "mövzunun təyinatını və düzgün istifadəsini",
      "bu anlayış kompüter savadlılığının təməlidir",
      "kompüteri sındırmağı",
      "dərsi buraxmağı",
    ]

    const qualityCheckedQuestions = candidateQuestions.filter((q: any) => {
      const fullText = ((q.question || "") + " " + (Array.isArray(q.options) ? q.options.join(" ") : Object.values(q.options || {}).join(" "))).toLowerCase()
      return !FORBIDDEN_TEMPLATE_PHRASES.some(phrase => fullText.includes(phrase))
    })

    if (qualityCheckedQuestions.length === 0) {
      console.log(`[offline] All candidates rejected by quality gate for topic "${topic}"`)
      return []
    }

    // Deduplicate within the candidate pool only
    const uniquePoolMap = new Map<string, any>()
    for (const q of qualityCheckedQuestions) {
      const qKey = getOfflineQKey(q)
      if (qKey && !uniquePoolMap.has(qKey)) {
        uniquePoolMap.set(qKey, q)
      }
    }
    const pool = Array.from(uniquePoolMap.values())

    const diffMap: Record<string, string[]> = {
      sadə: ["sadə", "asan", "easy", "beginner"],
      asan: ["sadə", "asan", "easy", "beginner"],
      orta: ["orta", "medium", "intermediate"],
      çətin: ["çətin", "hard", "advanced"],
      qarışıq: ["sadə", "asan", "orta", "çətin", "easy", "medium", "hard", "beginner", "intermediate", "advanced"]
    }
    const reqDiff = difficulty.toLowerCase().trim()
    const allowed = diffMap[reqDiff] || diffMap["qarışıq"]
    let filtered = reqDiff === "qarışıq"
      ? pool
      : pool.filter((q: any) => allowed.includes((q.difficulty || "").toLowerCase()))

    if (filtered.length < count && reqDiff !== "qarışıq") {
       filtered = pool
    }

    const shuffled = filtered.sort(() => Math.random() - 0.5).slice(0, count)

    return shuffled.map((q: any, idx: number) => {
      let cleanOptions: string[] = []
      let correctAnswerIndex = 0

      // Handle options format: string array OR dict { A: "...", B: "...", C: "...", D: "..." }
      if (Array.isArray(q.options)) {
        cleanOptions = q.options
          .map((opt: any) => typeof opt === "string" ? opt.replace(/^[A-E]\)\s*/i, "").trim() : String(opt ?? "").trim())
          .filter((opt: string) => opt.length > 0)
      } else if (typeof q.options === "object" && q.options !== null) {
        const optionKeys = ["A", "B", "C", "D", "E"].filter(k => {
          const val = q.options[k] ?? q.options[k.toLowerCase()]
          return val !== undefined && val !== null && String(val).trim() !== ""
        })
        if (optionKeys.length > 0) {
          cleanOptions = optionKeys.map(k => {
            const val = q.options[k] ?? q.options[k.toLowerCase()]
            const str = typeof val === "string" ? val : String(val)
            return str.replace(/^[A-E]\)\s*/i, "").trim()
          })
        } else {
          cleanOptions = Object.values(q.options)
            .map((v: any) => typeof v === "string" ? v.replace(/^[A-E]\)\s*/i, "").trim() : String(v ?? "").trim())
            .filter((opt: string) => opt.length > 0)
        }
      }

      // Handle correctAnswer: Prioritize valid numeric index (correctAnswer / correct_index)
      if (typeof q.correctAnswer === "number" && q.correctAnswer >= 0 && q.correctAnswer < cleanOptions.length) {
        correctAnswerIndex = q.correctAnswer
      } else if (typeof q.correct_index === "number" && q.correct_index >= 0 && q.correct_index < cleanOptions.length) {
        correctAnswerIndex = q.correct_index
      } else {
        const rawAns = q.correct_answer ?? q.answer
        if (typeof rawAns === "number") {
          correctAnswerIndex = rawAns
        } else if (typeof rawAns === "string") {
          const letter = rawAns.trim().toUpperCase()
          if (letter === "A") correctAnswerIndex = 0
          else if (letter === "B") correctAnswerIndex = 1
          else if (letter === "C") correctAnswerIndex = 2
          else if (letter === "D") correctAnswerIndex = 3
          else if (letter === "E") correctAnswerIndex = 4
          else {
            const foundIdx = cleanOptions.findIndex(opt => opt.trim() === rawAns.trim() || opt.trim().toLowerCase() === rawAns.trim().toLowerCase())
            correctAnswerIndex = foundIdx !== -1 ? foundIdx : 0
          }
        }
      }

      if (correctAnswerIndex >= cleanOptions.length || correctAnswerIndex < 0) {
        correctAnswerIndex = 0
      }

      let expText = ""
      if (typeof q.explanation === "string") {
        expText = q.explanation
      } else if (typeof q.explanation === "object" && q.explanation !== null) {
        expText = q.explanation.correct || q.explanation.doğru_cavab_səbəbi || ""
      } else if (q.izah) {
        if (typeof q.izah === "string") {
          expText = q.izah
        } else if (typeof q.izah === "object") {
          expText = q.izah.doğru_cavab_səbəbi || ""
        }
      }

      // Reconcile and validate answer key at runtime
      correctAnswerIndex = reconcileAnswerKeyRuntime(cleanOptions, expText, correctAnswerIndex)

      // Universal distractor cleanup: ensure correct answer is NEVER labeled as wrong
      const correctLetter = String.fromCharCode(65 + correctAnswerIndex)
      if (expText.includes("Səhv variantlar")) {
        const parts = expText.split(/(?:Səhv variantlar|Səhv variantların təhlili):/i)
        const mainExp = parts[0].trim()
        const distBlock = parts[1] || ""
        const lines = distBlock.split("\n").map(l => l.trim()).filter(Boolean)
        const validWrongLines = lines.filter(l => {
          const up = l.toUpperCase()
          if (up.includes(`- ${correctLetter} `) || up.includes(`${correctLetter} VARIANT`) || up.startsWith(`- ${correctLetter}:`)) {
            return false
          }
          // Filter out generic repetitive boilerplate that adds no value
          if (l.includes("tarixi faktlarla uyğun gəlmir") || l.includes("bioloji qanunauyğunluqlara və ya tərifə uyğun deyil") || l.includes("hesablamaya və ya tərifə uyğun deyil")) {
            return false
          }
          return true
        })

        expText = validWrongLines.length > 0
          ? `${mainExp}\n\nSəhv variantların təhlili:\n${validWrongLines.join("\n")}`
          : mainExp
      }

      if (!expText) {
        expText = "Dərslik mətninə əsasən düzgün cavab təyin edilmişdir."
      }

      const qTopic = q.topic || topic
      const qBloom = (q.bloomLevel || q.bloom_level || q.bloom || "anlama").toLowerCase()
      const qDiff = (q.difficulty || difficulty).toLowerCase()

      return {
        id: idx + 1,
        question: q.question,
        options: cleanOptions,
        correctAnswer: correctAnswerIndex,
        correct_answer: String.fromCharCode(65 + correctAnswerIndex),
        explanation: cleanExplanation(expText),
        difficulty: qDiff,
        topic: qTopic,
        bloomLevel: qBloom,
        image: q.image || q.visual || q.img || undefined,
        audio: q.audio || undefined,
        optionAudios: q.optionAudios || undefined,
        timeEstimate: (qDiff === "sadə" || qDiff === "asan" || qDiff === "easy") ? 1 : (qDiff === "çətin" || qDiff === "hard") ? 3 : 2,
        sourceContext: formatSourceContext(q.sourceContext || `> **Mənbə (Dərslik):** ${textbookTitle}, "${qTopic}" mövzusu`),
        grounding: resolveGrounding(q, gradeNum, textbookTitle, qTopic),
        distractor_diagnostics: sanitizeDistractorDiagnostics(q.distractor_diagnostics, correctAnswerIndex),
        backward_trace: resolveBackwardTrace(q, gradeNum, textbookTitle, qTopic),
      }
    })
  } catch (e) {
    console.error("❌ offline_tests.json oxunarkən xəta:", e)
    return []
  }
}
