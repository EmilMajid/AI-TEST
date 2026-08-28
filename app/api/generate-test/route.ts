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

    // STEP 0: offline_tests.json-dan hazır sualları yoxla
    console.log("🔄 offline_tests.json-dan hazır suallar axtarılır...")
    const offlineQuestions = loadFromOfflineTests(textbook, topic, questionCount, difficulty)

    if (offlineQuestions.length > 0) {
      console.log(`✅ offline_tests.json-dan ${offlineQuestions.length} hazır sual tapıldı! AI sorğusu ləğv edilir.`)
      return NextResponse.json({
        questions: offlineQuestions,
        provider: "offline",
        success: true,
        message: `${offlineQuestions.length} test sualı hazır bazadan yükləndi`,
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

    const hasXaiKey = !!(xaiKey && xaiKey.startsWith("xai-"))
    const hasOpenAI = !!(openaiKey && openaiKey.startsWith("sk-"))
    const hasGoogle = !!(googleKey && googleKey.length > 0)
    const hasAnthropic = !!(anthropicKey && anthropicKey.startsWith("sk-ant-"))

    let aiResponse: string | null = null
    let usedProvider = "fallback"

    if (hasGoogle) {
      try {
        const { text } = await generateText({
          model: google("gemini-1.5-pro-latest"),
          prompt,
          temperature: difficulty === "qarışıq" ? 0.8 : 0.7,
        })
        aiResponse = text
        usedProvider = "google"
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
            const questionsWithIds = parsedData.questions.map((q: any, index: number) => {
              const cleanOptions = q.options.map((opt: string) => opt.replace(/^[A-D]\)\s*/, "").trim())
              return {
                id: index + 1,
                question: q.question?.trim() || `Sual ${index + 1}`,
                options: cleanOptions,
                correctAnswer: typeof q.correctAnswer === "number" ? q.correctAnswer : 0,
                explanation: q.explanation?.trim() || "İzahat mövcud deyil",
                sourceContext: q.sourceContext?.trim() || "Mənbə mətni tapılmadı",
                difficulty: q.difficulty || difficulty,
                topic: q.topic || topic,
                bloomLevel: q.bloomLevel || "anlama",
                timeEstimate: q.timeEstimate || Math.ceil(timeLimit / questionCount),
              }
            })

            return NextResponse.json({
              questions: questionsWithIds,
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

    // STEP 2: Guaranteed Dynamic Fallback Generator for 100% test availability
    const fallbackQuestions = generateSubjectFallbackQuestions(textbook, topic, grade, questionCount, difficulty)

    return NextResponse.json({
      questions: fallbackQuestions,
      provider: "fallback_curriculum",
      success: true,
      message: `${fallbackQuestions.length} test sualı fənn standartı əsasında dərhal generasiya olundu (${topic})`,
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
  // If specific topic match failed, fallback to any available questions from the SAME subject/grade in offline_tests.json
  // NEVER generate hardcoded fake meta-template boilerplate!
  try {
    const bankPath = path.join(process.cwd(), "data", "offline_tests.json")
    if (fs.existsSync(bankPath)) {
      const raw = fs.readFileSync(bankPath, "utf-8")
      const db = JSON.parse(raw)
      
      const norm = (s: string) =>
        s
          .toLowerCase()
          .replace(/i̇/g, "i")
          .replace(/ı/g, "i")
          .replace(/ğ/g, "g")
          .replace(/ö/g, "o")
          .replace(/ü/g, "u")
          .replace(/ş/g, "s")
          .replace(/ç/g, "c")
          .replace(/ə/g, "e")
          .replace(/[\s\-_]+/g, " ")
          .trim()

      const titleNorm = norm(textbookTitle)
      const gradeDigit = String(grade || "").match(/\d+/)?.[0] || textbookTitle.match(/\d+/)?.[0]

      let matchedKeys = Object.keys(db).filter(k => {
        const kNorm = norm(k)
        if (kNorm === titleNorm) return true
        if (gradeDigit && !k.includes(gradeDigit)) return false
        return titleNorm.includes(kNorm) || kNorm.includes(titleNorm)
      })

      if (matchedKeys.length === 0) {
        matchedKeys = Object.keys(db).filter(k => {
          const kNorm = norm(k)
          if (gradeDigit && !k.includes(gradeDigit)) return false
          if ((titleNorm.includes("рус") || titleNorm.includes("rus")) && (kNorm.includes("rus") || kNorm.includes("рус"))) return true
          if ((titleNorm.includes("english") || titleNorm.includes("ingilis")) && (kNorm.includes("ingilis") || kNorm.includes("english") || kNorm.includes("eng"))) return true
          if ((titleNorm.includes("deutsch") || titleNorm.includes("german") || titleNorm.includes("alman")) && (kNorm.includes("alman") || kNorm.includes("deu"))) return true
          if ((titleNorm.includes("français") || titleNorm.includes("francais") || titleNorm.includes("french") || titleNorm.includes("fransız") || titleNorm.includes("fransiz")) && (kNorm.includes("fransız") || kNorm.includes("fransiz") || kNorm.includes("fra"))) return true
          return false
        })
      }

      let pool: any[] = []
      matchedKeys.forEach(k => {
        const val = db[k]
        if (Array.isArray(val)) {
          val.forEach((item: any) => {
            if (item.questions && Array.isArray(item.questions)) {
              item.questions.forEach((q: any) => pool.push(q))
            } else if (item.question) {
              pool.push(item)
            }
          })
        } else if (typeof val === "object" && val !== null) {
          Object.values(val).forEach((qList: any) => {
            if (Array.isArray(qList)) {
              qList.forEach((q: any) => pool.push(q))
            }
          })
        }
      })

      if (pool.length > 0) {
        const shuffled = pool.sort(() => Math.random() - 0.5).slice(0, count)
        return shuffled.map((q: any, idx: number) => ({
          id: idx + 1,
          question: q.question,
          options: Array.isArray(q.options)
            ? q.options.map((opt: any) => typeof opt === "string" ? opt.replace(/^[A-D]\)\s*/i, "").trim() : String(opt))
            : q.options,
          correctAnswer: typeof q.correctAnswer === "number" ? q.correctAnswer : (q.correct_index ?? 0),
          explanation: typeof q.explanation === "object" ? (q.explanation.correct || "") : (q.explanation || ""),
          difficulty: q.difficulty || difficulty,
          topic: q.topic || topic,
          bloomLevel: q.bloom_level || q.bloomLevel || "anlama",
          timeEstimate: 2,
          sourceContext: q.sourceContext || `> **Mənbə:** ${textbookTitle}, "${topic}"`,
        }))
      }
    }
  } catch (e) {
    console.error("Fallback pool loading error:", e)
  }

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
    const bankPath = path.join(process.cwd(), "data", "question_bank.json")
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
      const subjectText = (meta.subject || "").toLowerCase()
      
      let subjectMatch = true
      if (expectedSubject) {
         subjectMatch = subjectText.includes(expectedSubject)
      }

      const skillText = (q.measured_skill || "").toLowerCase()
      const topicText = (meta.topic || "").toLowerCase()
      const topicWords = topicLower.split(/\s+/).filter((w: string) => w.length > 4)
      
      if (skillText.includes(topicLower) || topicText.includes(topicLower)) {
          return gradeMatch && subjectMatch
      }
      
      const topicMatch = topicWords.length > 0 ? topicWords.some(
        (w: string) => 
          skillText.includes(w) || 
          topicText.includes(w)
      ) : false
      
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

    const pool = filtered.length > 0 ? filtered : matching
    const shuffled = pool.sort(() => Math.random() - 0.5).slice(0, count)

    return shuffled.map((q: any, idx: number) => ({
      id: idx + 1,
      question: q.question,
      options: Array.isArray(q.options) ? q.options.map((opt: string) => opt.replace(/^[A-D]\)\s*/i, "").trim()) : q.options,
      correctAnswer: q.correct_index ?? 0,
      explanation: typeof q.explanation === "object"
        ? q.explanation.correct || ""
        : q.explanation || "",
      difficulty: q.difficulty || difficulty,
      topic: q.measured_skill || topic,
      bloomLevel: (q.bloom_level || "anlama").toLowerCase(),
      timeEstimate: q.estimated_time_sec ? Math.round(q.estimated_time_sec / 60) : 2,
      sourceContext: q.sourceContext || `> **Mənbə (Dərslik):** ${textbookTitle}, "${topic}" mövzusu`,
    }))
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

function loadFromOfflineTests(
  textbookTitle: string,
  topic: string,
  count: number,
  difficulty: string
): any[] {
  try {
    const bankPath = path.join(process.cwd(), "data", "offline_tests.json")
    if (!fs.existsSync(bankPath)) return []

    const raw = fs.readFileSync(bankPath, "utf-8")
    const db = JSON.parse(raw)
    const topicLower = topic.toLowerCase().trim()

    const norm = (s: string) =>
      (s || "")
        .normalize("NFKD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/i̇/g, "i")
        .replace(/ı/g, "i")
        .replace(/ğ/g, "g")
        .replace(/ö/g, "o")
        .replace(/ü/g, "u")
        .replace(/ş/g, "s")
        .replace(/ç/g, "c")
        .replace(/ə/g, "e")
        .replace(/[\s\-_]+/g, " ")
        .trim()

    const titleNorm = norm(textbookTitle)
    const keys = Object.keys(db)
    const gradeDigit = textbookTitle.match(/\d+/)?.[0]
    
    let matchedKeys = keys.filter(k => {
      const kNorm = norm(k)
      if (kNorm === titleNorm) return true
      if (gradeDigit && !k.includes(gradeDigit)) return false
      return titleNorm.includes(kNorm) || kNorm.includes(titleNorm)
    })
    
    if (matchedKeys.length === 0) {
      matchedKeys = keys.filter(k => {
        const kNorm = norm(k)
        const coreName = titleNorm.replace(/\b\d+\b/g, "").trim()
        const kCoreName = kNorm.replace(/\b\d+\b/g, "").trim()
        if (gradeDigit && !k.includes(gradeDigit)) return false
        return kCoreName.includes(coreName) || coreName.includes(kCoreName)
      })
    }

    if (matchedKeys.length === 0) {
      matchedKeys = keys.filter(k => {
        const kNorm = norm(k)
        if (gradeDigit && !k.includes(gradeDigit)) return false
        if ((titleNorm.includes("рус") || titleNorm.includes("rus")) && (kNorm.includes("rus") || kNorm.includes("рус"))) return true
        if ((titleNorm.includes("english") || titleNorm.includes("ingilis")) && (kNorm.includes("ingilis") || kNorm.includes("english") || kNorm.includes("eng"))) return true
        if ((titleNorm.includes("deutsch") || titleNorm.includes("german") || titleNorm.includes("alman")) && (kNorm.includes("alman") || kNorm.includes("deu"))) return true
        if ((titleNorm.includes("français") || titleNorm.includes("francais") || titleNorm.includes("french") || titleNorm.includes("fransız") || titleNorm.includes("fransiz")) && (kNorm.includes("fransız") || kNorm.includes("fransiz") || kNorm.includes("fra"))) return true
        return false
      })
    }

    if (matchedKeys.length === 0) {
      console.log(`[offline] No subject matched for textbook "${textbookTitle}"`)
      return []
    }

    let subjectQuestions: any[] = []
    matchedKeys.forEach(subjectKey => {
      const val = db[subjectKey]
      if (Array.isArray(val)) {
        val.forEach((item: any) => {
          if (item.questions && Array.isArray(item.questions)) {
            item.questions.forEach((q: any) => {
              if (!q.topic && item.topic_key) q.topic = item.topic_key
              if (!q.category) q.category = subjectKey
              subjectQuestions.push(q)
            })
          } else if (item.question) {
            if (!item.category) item.category = subjectKey
            subjectQuestions.push(item)
          }
        })
      } else if (typeof val === "object" && val !== null) {
        Object.entries(val).forEach(([tKey, qList]: [string, any]) => {
          if (Array.isArray(qList)) {
            qList.forEach((q: any) => {
              if (!q.topic) q.topic = tKey
              if (!q.category) q.category = subjectKey
              subjectQuestions.push(q)
            })
          }
        })
      }
    })

    if (subjectQuestions.length === 0) return []

    const cleanTopicStr = (str: string) =>
      norm(str)
        .replace(/^[0-9ivx]+[.\-)]*\s*/gi, "")
        .replace(/^bölmə\s+[0-9ivx]+[.\-:]*\s*/gi, "")
        .replace(/^hissə\s+[0-9ivx]+[.\-:]*\s*/gi, "")
        .replace(/["'“”«»()]/g, "")
        .trim()

    const targetNorm = norm(topic)
    const targetClean = cleanTopicStr(topic)

    // Stage 1: Exact or direct normalized match
    let specificTopicQuestions = subjectQuestions.filter((q: any) => {
      const qTopic = q.topic || ""
      const qNorm = norm(qTopic)
      return qNorm === targetNorm || qTopic.toLowerCase().trim() === topicLower
    })

    // Stage 2: Cleaned title match (without chapter numbers/quotes)
    if (specificTopicQuestions.length === 0) {
      specificTopicQuestions = subjectQuestions.filter((q: any) => {
        const qClean = cleanTopicStr(q.topic || "")
        return qClean === targetClean ||
               (targetClean.length > 4 && qClean.includes(targetClean)) ||
               (qClean.length > 4 && targetClean.includes(qClean))
      })
    }

    // Stage 3: Keyword overlap match
    if (specificTopicQuestions.length === 0) {
      const topicWords = targetClean
        .split(/\s+/)
        .filter((w: string) => w.length > 3)
      
      if (topicWords.length > 0) {
        specificTopicQuestions = subjectQuestions.filter((q: any) => {
          const qClean = cleanTopicStr(q.topic || "")
          return topicWords.some((word: string) => qClean.includes(word))
        })
      }
    }

    // Stage 4: Fallback to subject pool if no specific topic match
    if (specificTopicQuestions.length === 0) {
      console.log(`[offline] No specific topic match for "${topic}", using subject-level pool for "${textbookTitle}".`)
      specificTopicQuestions = subjectQuestions
    }

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
      ? specificTopicQuestions
      : specificTopicQuestions.filter((q: any) => allowed.includes((q.difficulty || "").toLowerCase()))

    if (filtered.length < count && reqDiff !== "qarışıq") {
       filtered = specificTopicQuestions 
    }

    const shuffled = filtered.sort(() => Math.random() - 0.5).slice(0, count)

    return shuffled.map((q: any, idx: number) => {
      let cleanOptions: string[] = []
      let correctAnswerIndex = 0

      // Handle options format: string array OR dict { A: "...", B: "...", C: "...", D: "..." }
      if (Array.isArray(q.options)) {
        cleanOptions = q.options.map((opt: any) => typeof opt === "string" ? opt.replace(/^[A-D]\)\s*/i, "").trim() : String(opt))
      } else if (typeof q.options === "object" && q.options !== null) {
        const optionKeys = ["A", "B", "C", "D"]
        cleanOptions = optionKeys.map(k => {
          const val = q.options[k] || q.options[k.toLowerCase()] || ""
          return typeof val === "string" ? val.trim() : String(val).trim()
        })
        if (cleanOptions.every(opt => !opt)) {
          cleanOptions = Object.values(q.options).map((v: any) => typeof v === "string" ? v.trim() : String(v).trim())
        }
      }

      // Handle correctAnswer: number (0,1,2,3) OR letter string ("A", "B", "C", "D")
      const rawAns = q.correct_answer ?? q.correctAnswer ?? q.answer ?? q.correct_index
      if (typeof rawAns === "number") {
        correctAnswerIndex = rawAns
      } else if (typeof rawAns === "string") {
        const letter = rawAns.trim().toUpperCase()
        if (letter === "A") correctAnswerIndex = 0
        else if (letter === "B") correctAnswerIndex = 1
        else if (letter === "C") correctAnswerIndex = 2
        else if (letter === "D") correctAnswerIndex = 3
        else {
          const foundIdx = cleanOptions.findIndex(opt => opt.trim() === rawAns.trim())
          correctAnswerIndex = foundIdx !== -1 ? foundIdx : 0
        }
      }

      let expText = ""
      if (typeof q.explanation === "string") {
        expText = q.explanation
      } else if (typeof q.explanation === "object" && q.explanation !== null) {
        expText = q.explanation.correct || ""
        if (q.explanation.distractors && typeof q.explanation.distractors === "object") {
          const distStr = Object.entries(q.explanation.distractors)
            .map(([k, v]) => `- ${k} Variantı: ${v}`)
            .join("\n")
          if (distStr) expText += "\n\nSəhv variantlar:\n" + distStr
        }
      } else if (q.izah) {
        if (typeof q.izah === "string") {
          expText = q.izah
        } else if (typeof q.izah === "object") {
          expText = q.izah.doğru_cavab_səbəbi || ""
          if (q.izah.səhv_variantlar) {
            const dists = Object.entries(q.izah.səhv_variantlar)
              .map(([k, v]: [string, any]) => `- ${k} Variantı: ${typeof v === "object" ? v.səbəb : v}`)
              .join("\n")
            if (dists) expText += "\n\nSəhv variantlar:\n" + dists
          }
        }
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
        explanation: expText,
        difficulty: qDiff,
        topic: qTopic,
        bloomLevel: qBloom,
        timeEstimate: (qDiff === "sadə" || qDiff === "asan" || qDiff === "easy") ? 1 : (qDiff === "çətin" || qDiff === "hard") ? 3 : 2,
        sourceContext: q.sourceContext || `> **Mənbə (Dərslik):** ${textbookTitle}, "${qTopic}" mövzusu`,
      }
    })
  } catch (e) {
    console.error("❌ offline_tests.json oxunarkən xəta:", e)
    return []
  }
}
