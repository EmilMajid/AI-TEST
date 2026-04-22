import { generateText } from "ai"
import { xai } from "@ai-sdk/xai"
import { openai } from "@ai-sdk/openai"
// @ts-ignore - Package is installed, IDE cache issue
import { google } from "@ai-sdk/google"
// @ts-ignore - Package is installed, IDE cache issue
import { anthropic } from "@ai-sdk/anthropic"
import { type NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export async function POST(request: NextRequest) {
  try {
    const { textbook, topic, grade, questionCount = 10, difficulty = "orta", timeLimit = 20 } = await request.json()

    // Çətinlik səviyyəsinə uyğun prompt yaradılması
    const getDifficultyPrompt = (difficulty: string) => {
      switch (difficulty) {
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
        default: // orta
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

    // Sual sayına uyğun vaxt təyin etmə
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

    // Ətraflı və strukturlu prompt
    const prompt = `Azərbaycan Respublikasının ${grade}-ci sinif təhsil proqramına uyğun olaraq "${textbook}" dərsliyindən "${topic}" mövzusu üzrə ${questionCount} test sualı hazırla.

ƏSAS TƏLƏBLƏR:
1. Sinif səviyyəsi: ${grade}-ci sinif
2. Çətinlik səviyyəsi: ${difficulty}
3. Sual sayı: ${questionCount}
4. Vaxt limiti: ${timeLimit} dəqiqə (tövsiyə olunan: ${recommendedTime} dəqiqə)
5. Azərbaycan təhsil standartlarına uyğunluq

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
        "A) Birinci variant",
        "B) İkinci variant", 
        "C) Üçüncü variant",
        "D) Dördüncü variant"
      ],
      "correctAnswer": 0,
      "explanation": "Bu cavabın düzgün olmasının ətraflı izahatı və mövzu ilə əlaqəsi",
      "difficulty": "${difficulty === "qarışıq" ? "sadə/orta/çətin" : difficulty}",
      "topic": "${topic}",
      "bloomLevel": "bilmə/anlama/tətbiq/təhlil/qiymətləndirmə",
      "timeEstimate": 2
    }
  ]
}

Mövzu: ${topic}`

    // API key-ləri düzgün yoxla
    const xaiKey = process.env.XAI_API_KEY
    const openaiKey = process.env.OPENAI_API_KEY
    const googleKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY
    const anthropicKey = process.env.ANTHROPIC_API_KEY

    const hasXaiKey = !!(xaiKey && xaiKey.startsWith("xai-"))
    const hasOpenAI = !!(openaiKey && openaiKey.startsWith("sk-"))
    const hasGoogle = !!(googleKey && googleKey.length > 0)
    const hasAnthropic = !!(anthropicKey && anthropicKey.startsWith("sk-ant-"))

    console.log("🔑 API Key Status:", {
      hasGoogle,
      hasAnthropic,
      hasXaiKey,
      hasOpenAI,
      difficulty,
      questionCount,
      timeLimit,
    })

    let aiResponse: string | null = null
    let usedProvider = "fallback"
    let errorDetails = null

    // 1. Google Gemini (Prioritet 1)
    if (hasGoogle) {
      try {
        console.log("🚀 Google Gemini 1.5 Pro istifadə edilir...")
        const { text } = await generateText({
          model: google("gemini-1.5-pro-latest"),
          prompt,
          temperature: difficulty === "qarışıq" ? 0.8 : 0.7,
        })
        aiResponse = text
        usedProvider = "google"
        console.log("✅ Google Gemini cavabı uğurla alındı")
      } catch (error) {
        console.error("❌ Google Gemini xətası:", error)
        errorDetails = error instanceof Error ? error.message : "Unknown Google error"
      }
    }

    // 2. Anthropic Claude (Prioritet 2)
    if (!aiResponse && hasAnthropic) {
      try {
        console.log("🚀 Anthropic Claude 3.5 Sonnet istifadə edilir...")
        const { text } = await generateText({
          model: anthropic("claude-3-5-sonnet-20240620"),
          prompt,
          temperature: difficulty === "qarışıq" ? 0.8 : 0.7,
        })
        aiResponse = text
        usedProvider = "anthropic"
        console.log("✅ Anthropic Claude cavabı uğurla alındı")
      } catch (error) {
        console.error("❌ Anthropic Claude xətası:", error)
        errorDetails = error instanceof Error ? error.message : "Unknown Anthropic error"
      }
    }

    // 3. xAI (Grok)
    if (!aiResponse && hasXaiKey) {
      try {
        console.log("🚀 xAI Grok-3 istifadə edilir...")
        const { text } = await generateText({
          model: xai("grok-3"),
          prompt,
          temperature: difficulty === "qarışıq" ? 0.8 : 0.7,
        })
        aiResponse = text
        usedProvider = "xai"
        console.log("✅ xAI cavabı uğurla alındı")
      } catch (error) {
        console.error("❌ xAI xətası:", error)
        errorDetails = error instanceof Error ? error.message : "Unknown xAI error"
      }
    }

    // 4. OpenAI
    if (!aiResponse && hasOpenAI) {
      try {
        console.log("🔄 OpenAI-yə keçid...")
        const { text } = await generateText({
          model: openai("gpt-4o"),
          prompt,
          temperature: difficulty === "qarışıq" ? 0.8 : 0.7,
        })
        aiResponse = text
        usedProvider = "openai"
        console.log("✅ OpenAI cavabı uğurla alındı")
      } catch (error) {
        console.error("❌ OpenAI xətası:", error)
        errorDetails = error instanceof Error ? error.message : "Unknown OpenAI error"
      }
    }

    // AI cavabını parse et
    if (aiResponse) {
      try {
        // JSON-u tap və parse et
        const jsonMatch = aiResponse.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          const parsedData = JSON.parse(jsonMatch[0])

          if (parsedData.questions && Array.isArray(parsedData.questions)) {
            // Sualları ID ilə təmin et və validasiya et
            const questionsWithIds = parsedData.questions.map((q: any, index: number) => {
              // Cavab variantlarını təmizlə (A), B), C), D) prefikslərini sil)
              const cleanOptions = q.options.map((opt: string) => opt.replace(/^[A-D]\)\s*/, "").trim())

              return {
                id: index + 1,
                question: q.question?.trim() || `Sual ${index + 1}`,
                options: cleanOptions,
                correctAnswer: typeof q.correctAnswer === "number" ? q.correctAnswer : 0,
                explanation: q.explanation?.trim() || "İzahat mövcud deyil",
                difficulty: q.difficulty || difficulty,
                topic: q.topic || topic,
                bloomLevel: q.bloomLevel || "anlama",
                timeEstimate: q.timeEstimate || Math.ceil(timeLimit / questionCount),
              }
            })

            console.log(`✅ ${questionsWithIds.length} sual uğurla yaradıldı (${usedProvider})`)

            return NextResponse.json({
              questions: questionsWithIds,
              provider: usedProvider,
              success: true,
              message: `${questionsWithIds.length} test sualı ${usedProvider === "xai" ? "Grok AI" : "OpenAI"} tərəfindən yaradıldı`,
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
        } else {
          console.error("❌ AI cavabında JSON tapılmadı")
        }
      } catch (parseError) {
        console.error("❌ JSON parse xətası:", parseError)
        console.log("Raw AI response:", aiResponse.substring(0, 500) + "...")
      }
    }

    // ✅ STEP 1: question_bank.json-dan real sualları yoxla
    console.log("🔄 question_bank.json-dan real suallar axtarılır...")
    const bankQuestions = loadFromQuestionBank(grade, topic, questionCount, difficulty)

    if (bankQuestions.length > 0) {
      console.log(`✅ question_bank.json-dan ${bankQuestions.length} real sual tapıldı!`)
      return NextResponse.json({
        questions: bankQuestions,
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

    // STEP 2: Heç bir real sual tapılmadıqda ümumi fallback
    console.log("🔄 Demo suallarına keçid...")
    const fallbackQuestions = generateAdvancedFallbackQuestions(topic, textbook, grade, questionCount, difficulty)

    return NextResponse.json({
      questions: fallbackQuestions,
      provider: "fallback",
      success: true,
      message: `Demo test sualları istifadə edildi (${topic} mövzusu, ${difficulty} səviyyə)`,
      error: errorDetails,
      debug: {
        hasXaiKey,
        hasOpenAI,
        xaiKeyFormat: xaiKey ? (xaiKey.startsWith("xai-") ? "correct" : "incorrect") : "missing",
        openaiKeyFormat: openaiKey ? (openaiKey.startsWith("sk-") ? "correct" : "incorrect") : "missing",
      },
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

// ✅ question_bank.json-dan real sualları yüklə
function loadFromQuestionBank(
  grade: string | number,
  topic: string,
  count: number,
  difficulty: string
): any[] {
  try {
    const bankPath = path.join(process.cwd(), "data", "question_bank.json")
    if (!fs.existsSync(bankPath)) return []

    const raw = fs.readFileSync(bankPath, "utf-8")
    const allQuestions: any[] = JSON.parse(raw)

    const gradeNum = parseInt(String(grade))
    const topicLower = topic.toLowerCase()

    // Filter by grade and topic keyword match
    let matching = allQuestions.filter((q: any) => {
      const meta = q.metadata || {}
      const gradeMatch = meta.grade === gradeNum
      const subjectText = (meta.subject || "").toLowerCase()
      const skillText = (q.measured_skill || "").toLowerCase()
      const questionText = (q.question || "").toLowerCase()

      const topicWords = topicLower.split(/\s+/).filter((w: string) => w.length > 3)
      const topicMatch = topicWords.some(
        (w: string) => subjectText.includes(w) || skillText.includes(w) || questionText.includes(w)
      )
      return gradeMatch && topicMatch
    })

    if (matching.length === 0) return []

    // Sort by difficulty if needed
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

    const pool = filtered.length > 0 ? filtered : matching

    // Shuffle and take requested count
    const shuffled = pool.sort(() => Math.random() - 0.5).slice(0, count)

    // Map to the format the frontend expects
    return shuffled.map((q: any, idx: number) => ({
      id: idx + 1,
      question: q.question,
      options: q.options,
      correctAnswer: q.correct_index ?? 0,
      explanation: typeof q.explanation === "object"
        ? q.explanation.correct || ""
        : q.explanation || "",
      difficulty: q.difficulty || difficulty,
      topic: q.measured_skill || topic,
      bloomLevel: (q.bloom_level || "anlama").toLowerCase(),
      timeEstimate: q.estimated_time_sec ? Math.round(q.estimated_time_sec / 60) : 2,
    }))
  } catch (e) {
    console.error("❌ question_bank.json oxunarkən xəta:", e)
    return []
  }
}

// Çətinlik bölgüsünü hesabla
function getDifficultyDistribution(questions: any[]) {
  const distribution = { sadə: 0, orta: 0, çətin: 0 }
  questions.forEach((q) => {
    if (q.difficulty in distribution) {
      distribution[q.difficulty as keyof typeof distribution]++
    }
  })
  return distribution
}

// Təkmilləşdirilmiş fallback sualları yaradıcısı
function generateAdvancedFallbackQuestions(
  topic: string,
  textbook: string,
  grade: string,
  count: number,
  difficulty: string,
) {
  const topicLower = topic.toLowerCase()

  // Çətinlik səviyyəsinə uyğun sual şablonları
  const questionTemplatesByDifficulty = {
    sadə: {
      // Fənn və mövzuya görə sadə suallar
      fel: [
        {
          question: "Fel hansı nitq hissəsidir?",
          options: ["İsim", "Sifət", "Fel", "Zərf"],
          correctAnswer: 2,
          explanation: "Fel hərəkət, hal və vəziyyəti bildirən nitq hissəsidir.",
          bloomLevel: "bilmə",
        },
      ],
      riyaziyyat: [
        {
          question: "2 + 3 = ?",
          options: ["4", "5", "6", "7"],
          correctAnswer: 1,
          explanation: "2 + 3 = 5",
          bloomLevel: "bilmə",
        },
      ],
    },
    orta: {
      fel: [
        {
          question: "Felin hansı forması mövcuddur?",
          options: [
            "Yalnız indiki zaman",
            "Keçmiş və indiki zaman",
            "İndiki, keçmiş və gələcək zaman",
            "Yalnız gələcək zaman",
          ],
          correctAnswer: 2,
          explanation: "Fel üç zamanda - indiki, keçmiş və gələcək zamanda işlənir.",
          bloomLevel: "anlama",
        },
      ],
      riyaziyyat: [
        {
          question: "2x + 3 = 7 tənliyində x-in qiyməti nədir?",
          options: ["1", "2", "3", "4"],
          correctAnswer: 1,
          explanation: "2x + 3 = 7, 2x = 4, x = 2",
          bloomLevel: "tətbiq",
        },
      ],
    },
    çətin: {
      fel: [
        {
          question: "Aşağıdakı cümlələrdən hansında fel məchul növdədir?",
          options: ["Kitab oxuyuram", "Kitab oxunur", "Kitabı oxudum", "Kitab oxuyacağam"],
          correctAnswer: 1,
          explanation:
            "Məchul növdə fel hərəkətin kimin tərəfindən edilməsini göstərmir. 'Oxunur' feli məchul növdədir.",
          bloomLevel: "təhlil",
        },
      ],
      riyaziyyat: [
        {
          question: "f(x) = x² + 2x - 3 funksiyasının minimum qiyməti nədir?",
          options: ["-4", "-3", "-2", "-1"],
          correctAnswer: 0,
          explanation: "Parabolanın təpə nöqtəsi x = -b/2a = -2/2 = -1 nöqtəsindədir. f(-1) = 1 - 2 - 3 = -4",
          bloomLevel: "təhlil",
        },
      ],
      coğrafiya: [
        {
          question: "Azərbaycanın ən hündür zirvəsi hansıdır?",
          options: ["Şahdağ", "Bazardüzü", "Tufandağ", "Qapıcıq"],
          correctAnswer: 1,
          explanation: "Azərbaycanın ən hündür zirvəsi Bazardüzü dağıdır (4466 m).",
          bloomLevel: "bilmə",
        },
        {
          question: "Kür çayı hansı dənizə tökülür?",
          options: ["Qara dəniz", "Aral dənizi", "Xəzər dənizi", "Azov dənizi"],
          correctAnswer: 2,
          explanation: "Kür çayı Xəzər dənizinə tökülür.",
          bloomLevel: "bilmə",
        },
        {
          question: "Azərbaycan hansı iqlim qurşaqlarında yerləşir?",
          options: ["Subtropik və Mülayim", "Tropik və Subtropik", "Mülayim və Arktik", "Ekvatorial və Tropik"],
          correctAnswer: 0,
          explanation: "Azərbaycan əsasən Subtropik və Mülayim iqlim qurşaqlarında yerləşir.",
          bloomLevel: "anlama",
        }
      ]
    },
  }

  // Mövzuya uyğun şablon tap
  let selectedTemplates: any = null
  const difficultyLevel = difficulty === "qarışıq" ? "orta" : difficulty

  for (const [key, templates] of Object.entries(
    questionTemplatesByDifficulty[difficultyLevel as keyof typeof questionTemplatesByDifficulty],
  )) {
    if (topicLower.includes(key)) {
      selectedTemplates = templates
      break
    }
  }

  // Əgər spesifik şablon tapılmasa, ümumi şablon istifadə et
  if (!selectedTemplates) {
    selectedTemplates = [
      {
        question: `${topic} mövzusunda əsas anlayış hansıdır?`,
        options: ["Birinci anlayış", "İkinci anlayış", "Üçüncü anlayış", "Dördüncü anlayış"],
        correctAnswer: 1,
        explanation: `${topic} mövzusunda ikinci anlayış əsas hesab olunur.`,
        bloomLevel: "anlama",
      },
      {
        question: `${topic} haqqında düzgün məlumat hansıdır?`,
        options: ["Birinci məlumat", "İkinci məlumat", "Üçüncü məlumat", "Dördüncü məlumat"],
        correctAnswer: 2,
        explanation: `${topic} mövzusunda üçüncü məlumat ən dəqiqdir.`,
        bloomLevel: "anlama",
      },
      {
        question: `${topic} mövzusunun praktik tətbiqi hansıdır?`,
        options: ["Gündəlik həyatda", "Elmdə", "Texnologiyada", "Hamısında"],
        correctAnswer: 3,
        explanation: `${topic} mövzusu həm gündəlik həyatda, həm elmdə, həm də texnologiyada tətbiq olunur.`,
        bloomLevel: "tətbiq",
      },
    ]
  }

  // Qarışıq çətinlik üçün müxtəlif səviyyələrdən suallar
  if (difficulty === "qarışıq") {
    const questions = []
    const sadəCount = Math.ceil(count * 0.3)
    const ortaCount = Math.ceil(count * 0.5)
    const çətinCount = count - sadəCount - ortaCount

    // Sadə suallar
    for (let i = 0; i < sadəCount; i++) {
      questions.push({
        id: i + 1,
        question: `${topic} mövzusunda əsas faktı hansıdır? (Sadə)`,
        options: ["Birinci fakt", "İkinci fakt", "Üçüncü fakt", "Dördüncü fakt"],
        correctAnswer: 1,
        explanation: `${topic} mövzusunda ikinci fakt əsasdır.`,
        difficulty: "sadə",
        topic: topic,
        bloomLevel: "bilmə",
        timeEstimate: 1,
      })
    }

    // Orta suallar
    for (let i = 0; i < ortaCount; i++) {
      questions.push({
        id: sadəCount + i + 1,
        question: `${topic} mövzusunu necə izah edərsiniz? (Orta)`,
        options: ["Birinci izahat", "İkinci izahat", "Üçüncü izahat", "Dördüncü izahat"],
        correctAnswer: 2,
        explanation: `${topic} mövzusunun üçüncü izahatı ən düzgündür.`,
        difficulty: "orta",
        topic: topic,
        bloomLevel: "anlama",
        timeEstimate: 2,
      })
    }

    // Çətin suallar
    for (let i = 0; i < çətinCount; i++) {
      questions.push({
        id: sadəCount + ortaCount + i + 1,
        question: `${topic} mövzusunu təhlil edərkən hansı aspekt ən vacibdir? (Çətin)`,
        options: ["Birinci aspekt", "İkinci aspekt", "Üçüncü aspekt", "Dördüncü aspekt"],
        correctAnswer: 0,
        explanation: `${topic} mövzusunun təhlilində birinci aspekt ən vacib hesab olunur.`,
        difficulty: "çətin",
        topic: topic,
        bloomLevel: "təhlil",
        timeEstimate: 3,
      })
    }

    return questions
  }

  // Tələb olunan sayda sual yarat
  const questions = []
  for (let i = 0; i < count; i++) {
    const template = selectedTemplates[i % selectedTemplates.length]
    questions.push({
      id: i + 1,
      question: template.question,
      options: template.options,
      correctAnswer: template.correctAnswer,
      explanation: template.explanation,
      difficulty: difficulty,
      topic: topic,
      bloomLevel: template.bloomLevel,
      timeEstimate: difficulty === "sadə" ? 1 : difficulty === "orta" ? 2 : 3,
    })
  }

  return questions
}
