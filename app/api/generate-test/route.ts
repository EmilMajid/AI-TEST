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
      "sourceContext": "Sualın və ya cavabın götürüldüyü orijinal mənbə mətni (dərslikdən tam cümlə və ya bənd)",
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

    // ✅ STEP 0: offline_tests.json-dan hazır sualları yoxla (Süni intellektdən əvvəl)
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
        console.log("🔄 OpenAI-yə keçid...");
        const { text } = await generateText({
          model: openai("gpt-4o"),
          prompt,
          temperature: difficulty === "qarışıq" ? 0.8 : 0.7,
        });
        aiResponse = text;
        usedProvider = "openai";
        console.log("✅ OpenAI cavabı uğurla alındı");
      } catch (error) {
        console.error("❌ OpenAI xətası:", error);
        errorDetails = error instanceof Error ? error.message : "Unknown OpenAI error";
      }
    }

    // 5. DeepSeek
    if (!aiResponse && process.env.DEEPSEEK_API_KEY) {
      try {
        console.log("🚀 DeepSeek Chat istifadə edilir...");
        const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.DEEPSEEK_API_KEY}`,
          },
          body: JSON.stringify({
            model: "deepseek-chat",
            messages: [
              { role: "system", content: "You are an AI assistant generating test questions in JSON format as specified." },
              { role: "user", content: prompt },
            ],
            temperature: difficulty === "qarışıq" ? 0.8 : 0.7,
          }),
        });
        const data = await response.json();
        aiResponse = data.choices?.[0]?.message?.content || null;
        usedProvider = "deepseek";
        console.log("✅ DeepSeek cavabı uğurla alındı");
      } catch (error) {
        console.error("❌ DeepSeek xətası:", error);
        errorDetails = error instanceof Error ? error.message : "Unknown DeepSeek error";
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
                sourceContext: q.sourceContext?.trim() || "Mənbə mətni tapılmadı",
                difficulty: q.difficulty || difficulty,
                topic: q.topic || topic,
                bloomLevel: q.bloomLevel || "anlama",
                timeEstimate: q.timeEstimate || Math.ceil(timeLimit / questionCount),
              }
            })

            console.log(`✅ ${questionsWithIds.length} sual uğurla yaradıldı (${usedProvider})`)

            // Save generated tests to offline_tests.json
            try {
              const offlinePath = path.join(process.cwd(), "data", "offline_tests.json")
              // Ensure the data directory exists
              const offlineDir = path.dirname(offlinePath)
              if (!fs.existsSync(offlineDir)) {
                fs.mkdirSync(offlineDir, { recursive: true })
              }
              let db: any = {}
              if (fs.existsSync(offlinePath)) {
                db = JSON.parse(fs.readFileSync(offlinePath, "utf-8"))
              }
              const subjectKey = (() => {
                const lower = textbook.toLowerCase().replace(/i̇/g, "i").replace(/ı/g, "i")
                if (lower.includes("ingilis") || lower.includes("english")) return "İngilis dili"
                if (lower.includes("fransız") || lower.includes("fransiz")) return "Fransız dili"
                if (lower.includes("alman")) return "Alman dili"
                if (lower.includes("rus") || lower.includes("русский")) return "Русский язык"
                if (lower.includes("azərbaycan dili")) return "Azərbaycan dili"
                if (lower.includes("ədəbiyyat")) return "Ədəbiyyat"
                if (lower.includes("riyaziyyat")) return "Riyaziyyat"
                if (lower.includes("ümumi tarix")) return "Ümumi tarix"
                if (lower.includes("zəfər tarixi")) return "Zəfər tarixi"
                if (lower.includes("tarix")) return "Azərbaycan tarixi"
                if (lower.includes("fizika")) return "Fizika"
                if (lower.includes("kimya")) return "Kimya"
                if (lower.includes("biologiya")) return "Biologiya"
                if (lower.includes("coğrafiya")) return "Coğrafiya"
                if (lower.includes("informatika") || lower.includes("nformatika")) return "İnformatika"
                if (lower.includes("texnologiya")) return "Texnologiya"
                if (lower.includes("təsviri")) return "Təsviri incəsənət"
                if (lower.includes("musiqi")) return "Musiqi"
                return "Digər"
              })()
              if (!db[subjectKey]) db[subjectKey] = []
              db[subjectKey].push({
                topic_key: topic,
                questions: questionsWithIds.map((q: any) => ({
                  id: q.id,
                  question: q.question,
                  options: q.options,
                  correctAnswer: q.correctAnswer,
                  explanation: q.explanation,
                  difficulty: q.difficulty,
                  topic: q.topic,
                  bloomLevel: q.bloomLevel,
                  timeEstimate: q.timeEstimate,
                  sourceContext: q.sourceContext,
                })),
              })
              fs.writeFileSync(offlinePath, JSON.stringify(db, null, 2), "utf-8")
              console.log("✅ Generated tests saved to offline_tests.json")
            } catch (e) {
              console.error("❌ Offline test save error:", e)
            }

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
    const bankQuestions = loadFromQuestionBank(textbook, grade, topic, questionCount, difficulty)

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

    // STEP 2: Heç bir real sual tapılmadıqda və AI işləmədikdə ERROR qaytar
    console.log("❌ Sual tapılmadı və AI aktiv deyil. Error qaytarılır.");
    
    return NextResponse.json({
      success: false,
      error: `"${topic}" mövzusu üzrə testlər hələ bazaya əlavə edilməyib. Zəhmət olmasa, süni intellekt açarlarını (API key) yoxlayın və ya mövzu üzrə offline testlərin generasiya olunduğundan əmin olun.`,
      debug: {
        hasXaiKey,
        hasOpenAI,
        xaiKeyFormat: xaiKey ? (xaiKey.startsWith("xai-") ? "correct" : "incorrect") : "missing",
        openaiKeyFormat: openaiKey ? (openaiKey.startsWith("sk-") ? "correct" : "incorrect") : "missing",
      }
    });
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
    
    let expectedSubject = "";
    if (titleLower.includes("ingilis") || titleLower.includes("english")) expectedSubject = "ingilis";
    else if (titleLower.includes("fransız") || titleLower.includes("fransiz")) expectedSubject = "fransız dili";
    else if (titleLower.includes("alman")) expectedSubject = "alman dili";
    else if (titleLower.includes("rus") || titleLower.includes("русский")) expectedSubject = "русский язык";
    else if (titleLower.includes("azərbaycan dili")) expectedSubject = "azərbaycan dili";
    else if (titleLower.includes("ədəbiyyat")) expectedSubject = "ədəbiyyat";
    else if (titleLower.includes("riyaziyyat")) expectedSubject = "riyaziyyat";
    else if (titleLower.includes("fizika")) expectedSubject = "fizika";
    else if (titleLower.includes("kimya")) expectedSubject = "kimya";
    else if (titleLower.includes("biologiya")) expectedSubject = "biologiya";
    else if (titleLower.includes("ümumi tarix")) expectedSubject = "ümumi tarix";
    else if (titleLower.includes("zəfər tarixi")) expectedSubject = "zəfər tarixi";
    else if (titleLower.includes("tarix")) expectedSubject = "tarix";
    else if (titleLower.includes("coğrafiya")) expectedSubject = "coğrafiya";
    else if (titleLower.includes("informatika") || titleLower.includes("nformatika")) expectedSubject = "informatika";
    else if (titleLower.includes("texnologiya")) expectedSubject = "texnologiya";
    else if (titleLower.includes("təsviri")) expectedSubject = "təsviri incəsənət";
    else if (titleLower.includes("musiqi")) expectedSubject = "musiqi";

    // Filter by grade, subject, and topic keyword match
    let matching = allQuestions.filter((q: any) => {
      const meta = q.metadata || {}
      const gradeMatch = meta.grade === gradeNum
      const subjectText = (meta.subject || "").toLowerCase()
      
      let subjectMatch = true;
      if (expectedSubject) {
         subjectMatch = subjectText.includes(expectedSubject);
      }

      const skillText = (q.measured_skill || "").toLowerCase()
      const topicText = (meta.topic || "").toLowerCase()

      // Yalnız mövzu adı və bacarıqda axtarış et, questionText-i çıxart ki, ortaq sözlər ("mərkəzi", "əsas") digər fənləri cəlb etməsin
      const topicWords = topicLower.split(/\s+/).filter((w: string) => w.length > 4)
      
      // Əgər tam uyğunluq varsa
      if (skillText.includes(topicLower) || topicText.includes(topicLower)) {
          return gradeMatch && subjectMatch;
      }
      
      const topicMatch = topicWords.length > 0 ? topicWords.some(
        (w: string) => 
          skillText.includes(w) || 
          topicText.includes(w)
      ) : false;
      
      return gradeMatch && subjectMatch && topicMatch
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

// Çətinlik bölgüsünü hesabla
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

// ✅ offline_tests.json-dan hazır sualları yüklə
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
    const topicLower = topic.toLowerCase();

    // 1. Find matching subject keys in offline_tests.json
    const titleLower = textbookTitle.toLowerCase().replace(/i̇/g, "i").replace(/ı/g, "i");
    const keys = Object.keys(db);
    let matchedKeys = keys.filter(k => 
      k === textbookTitle || 
      k.toLowerCase().replace(/i̇/g, "i").replace(/ı/g, "i") === titleLower || 
      titleLower.includes(k.toLowerCase()) || 
      k.toLowerCase().includes(titleLower)
    );
    
    if (matchedKeys.length === 0) {
        if (titleLower.includes("riyaziyyat")) matchedKeys = keys.filter(k => k.toLowerCase().replace(/i̇/g, "i").replace(/ı/g, "i").includes("riyaziyyat"));
        else if (titleLower.includes("informatika") || titleLower.includes("nformatika")) matchedKeys = keys.filter(k => k.toLowerCase().replace(/i̇/g, "i").replace(/ı/g, "i").includes("informatika") || k.toLowerCase().replace(/i̇/g, "i").replace(/ı/g, "i").includes("nformatika"));
        else if (titleLower.includes("biologiya")) matchedKeys = keys.filter(k => k.toLowerCase().replace(/i̇/g, "i").replace(/ı/g, "i").includes("biologiya"));
        else if (titleLower.includes("fizika")) matchedKeys = keys.filter(k => k.toLowerCase().replace(/i̇/g, "i").replace(/ı/g, "i").includes("fizika"));
        else if (titleLower.includes("kimya")) matchedKeys = keys.filter(k => k.toLowerCase().replace(/i̇/g, "i").replace(/ı/g, "i").includes("kimya"));
        else if (titleLower.includes("azərbaycan dili")) matchedKeys = keys.filter(k => k.toLowerCase().replace(/i̇/g, "i").replace(/ı/g, "i").includes("azərbaycan dili"));
        else if (titleLower.includes("ədəbiyyat")) matchedKeys = keys.filter(k => k.toLowerCase().replace(/i̇/g, "i").replace(/ı/g, "i").includes("ədəbiyyat"));
        else if (titleLower.includes("tarix")) matchedKeys = keys.filter(k => k.toLowerCase().replace(/i̇/g, "i").replace(/ı/g, "i").includes("tarix"));
        else if (titleLower.includes("ingilis") || titleLower.includes("english")) matchedKeys = keys.filter(k => k.toLowerCase().replace(/i̇/g, "i").replace(/ı/g, "i").includes("ingilis") || k.toLowerCase().replace(/i̇/g, "i").replace(/ı/g, "i").includes("english"));
        else if (titleLower.includes("rus") || titleLower.includes("русский")) matchedKeys = keys.filter(k => k.toLowerCase().replace(/i̇/g, "i").replace(/ı/g, "i").includes("rus") || k.toLowerCase().replace(/i̇/g, "i").replace(/ı/g, "i").includes("русский"));
        else if (titleLower.includes("fransız") || titleLower.includes("fransiz")) matchedKeys = keys.filter(k => k.toLowerCase().replace(/i̇/g, "i").replace(/ı/g, "i").includes("fransız") || k.toLowerCase().replace(/i̇/g, "i").replace(/ı/g, "i").includes("fransiz"));
        else if (titleLower.includes("alman")) matchedKeys = keys.filter(k => k.toLowerCase().replace(/i̇/g, "i").replace(/ı/g, "i").includes("alman"));
        else if (titleLower.includes("coğrafiya")) matchedKeys = keys.filter(k => k.toLowerCase().replace(/i̇/g, "i").replace(/ı/g, "i").includes("coğrafiya"));
        else if (titleLower.includes("musiqi")) matchedKeys = keys.filter(k => k.toLowerCase().replace(/i̇/g, "i").replace(/ı/g, "i").includes("musiqi"));
        else if (titleLower.includes("təsviri")) matchedKeys = keys.filter(k => k.toLowerCase().replace(/i̇/g, "i").replace(/ı/g, "i").includes("təsviri"));
        else if (titleLower.includes("texnologiya")) matchedKeys = keys.filter(k => k.toLowerCase().replace(/i̇/g, "i").replace(/ı/g, "i").includes("texnologiya"));
        else if (titleLower.includes("təbiət")) matchedKeys = keys.filter(k => k.toLowerCase().replace(/i̇/g, "i").replace(/ı/g, "i").includes("təbiət"));
    }

    if (matchedKeys.length === 0) {
      console.log(`[offline] No subject matched for textbook "${textbookTitle}"`);
      return [];
    }

    // 2. Flatten ONLY questions from the matched subjects into a single array
    let subjectQuestions: any[] = [];
    matchedKeys.forEach(subjectKey => {
      if (Array.isArray(db[subjectKey])) {
        db[subjectKey].forEach((item: any) => {
          if (item.questions && Array.isArray(item.questions)) {
            item.questions.forEach((q: any) => {
              if (!q.topic && item.topic_key) q.topic = item.topic_key;
              if (!q.category) q.category = subjectKey;
              subjectQuestions.push(q);
            });
          } else if (item.question) {
            if (!item.category) item.category = subjectKey;
            subjectQuestions.push(item);
          }
        });
      }
    });

    if (subjectQuestions.length === 0) return [];

    // 3. Filter by topic
    let specificTopicQuestions = subjectQuestions.filter((q: any) => {
        const qTopic = (q.topic || "").toLowerCase();
        return qTopic === topicLower || 
               topicLower.includes(qTopic) || 
               qTopic.includes(topicLower);
    });

    // 4. Keyword fallback if exact match fails
    if (specificTopicQuestions.length === 0) {
      console.log(`[offline] Direct match failed for "${topic}", trying keyword match within subject...`);
      const topicWords = topicLower
        .replace(/[0-9.]/g, "") // Remove numbers and dots
        .split(/\s+/)
        .filter((w: string) => w.length > 3);
      
      if (topicWords.length > 0) {
        specificTopicQuestions = subjectQuestions.filter((q: any) => {
          const qTopic = (q.topic || "").toLowerCase();
          return topicWords.some((word: string) => qTopic.includes(word));
        });
      }
    }

    if (specificTopicQuestions.length === 0) {
      console.log(`[offline] No topic matches found for "${topic}" in matched subjects`);
      return [];
    }

    // 5. Filter by difficulty
    const diffMap: Record<string, string[]> = {
      sadə: ["sadə", "asan", "easy", "beginner"],
      asan: ["sadə", "asan", "easy", "beginner"],
      orta: ["orta", "medium", "intermediate"],
      çətin: ["çətin", "hard", "advanced"],
      qarışıq: ["sadə", "asan", "orta", "çətin", "easy", "medium", "hard", "beginner", "intermediate", "advanced"]
    }
    const reqDiff = difficulty.toLowerCase().trim();
    const allowed = diffMap[reqDiff] || diffMap["qarışıq"]
    let filtered = reqDiff === "qarışıq"
      ? specificTopicQuestions
      : specificTopicQuestions.filter((q: any) => allowed.includes((q.difficulty || "").toLowerCase()))

    // If not enough questions for specific difficulty, fallback to all questions of that topic
    if (filtered.length < count && reqDiff !== "qarışıq") {
       filtered = specificTopicQuestions; 
    }

    // Shuffle and take requested count
    const shuffled = filtered.sort(() => Math.random() - 0.5).slice(0, count)

    return shuffled.map((q: any, idx: number) => ({
      id: idx + 1,
      question: q.question,
      options: Array.isArray(q.options) ? q.options.map((opt: string) => opt.replace(/^[A-D]\)\s*/i, "").trim()) : q.options,
      correctAnswer: q.correctAnswer ?? 0,
      explanation: q.explanation || "",
      difficulty: q.difficulty || difficulty,
      topic: q.topic || topic,
      bloomLevel: (q.bloomLevel || "anlama").toLowerCase(),
      timeEstimate: (q.difficulty === "sadə" || q.difficulty === "asan" || q.difficulty === "easy") ? 1 : (q.difficulty === "çətin" || q.difficulty === "hard") ? 3 : 2,
      sourceContext: q.sourceContext || `> **Mənbə (Dərslik):** ${textbookTitle}, "${topic}" mövzusu`,
    }))
  } catch (e) {
    console.error("❌ offline_tests.json oxunarkən xəta:", e)
    return []
  }
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
