export const dynamic = "force-dynamic"
import { type NextRequest, NextResponse } from "next/server"
import * as fs from "fs"
import * as path from "path"
import { azNorm, stripTopicPrefix, findMatchingSubjectKeys } from "@/lib/topic-matcher"

export interface TopicThresholdResult {
  topic: string
  currentCount: number
  minThreshold: number
  status: "skip" | "replenish"
  needed: number
  distribution: {
    simple: number
    medium: number
    hard: number
  }
  message: string
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { grade = "2", textbook = "", topics = [], minThreshold = 21 } = body
    const thresholdNum = Math.max(1, Number(minThreshold) || 21)

    const gradeFilePath = path.join(process.cwd(), "data", "grades", `grade_${grade}.json`)
    let gradeDb: Record<string, any> = {}
    if (fs.existsSync(gradeFilePath)) {
      try {
        gradeDb = JSON.parse(fs.readFileSync(gradeFilePath, "utf-8"))
      } catch (e) {
        console.error("Error reading grade DB in threshold-check:", e)
      }
    }

    const dbKeys = Object.keys(gradeDb)
    const bTitleNorm = azNorm(textbook)
    const matchedSubjectKeys = dbKeys.filter((k) => {
      const kNorm = azNorm(k)
      return kNorm === bTitleNorm || kNorm.includes(bTitleNorm) || bTitleNorm.includes(kNorm)
    })
    const helperKeys = findMatchingSubjectKeys(textbook, dbKeys, String(grade))
    const combinedKeys = Array.from(new Set([...matchedSubjectKeys, ...helperKeys]))

    // Build questions map across topics
    const questionsByTopic: Record<string, any[]> = {}
    let totalQuestions = 0

    combinedKeys.forEach((sKey) => {
      const val = gradeDb[sKey]
      if (val && typeof val === "object" && !Array.isArray(val)) {
        Object.entries(val).forEach(([tKey, qList]) => {
          if (Array.isArray(qList)) {
            totalQuestions += qList.length
            if (!questionsByTopic[tKey]) questionsByTopic[tKey] = []
            questionsByTopic[tKey].push(...qList)
          }
        })
      } else if (Array.isArray(val)) {
        val.forEach((item: any) => {
          if (item.questions && Array.isArray(item.questions)) {
            totalQuestions += item.questions.length
            const tKey = item.topic || item.topic_key || ""
            if (tKey) {
              if (!questionsByTopic[tKey]) questionsByTopic[tKey] = []
              questionsByTopic[tKey].push(...item.questions)
            }
          } else if (item.question) {
            totalQuestions++
            const tKey = item.topic || ""
            if (tKey) {
              if (!questionsByTopic[tKey]) questionsByTopic[tKey] = []
              questionsByTopic[tKey].push(item)
            }
          }
        })
      }
    })

    const topicKeys = Object.keys(questionsByTopic)
    const topicList: string[] = Array.isArray(topics) && topics.length > 0 ? topics : []
    const results: TopicThresholdResult[] = []

    let totalNeeded = 0
    let totalSimple = 0
    let totalMedium = 0
    let totalHard = 0
    let skippedCount = 0
    let replenishCount = 0

    for (const tName of topicList) {
      let currentCount = 0

      // 1. Direct exact key match
      if (questionsByTopic[tName]) {
        currentCount = questionsByTopic[tName].length
      }

      // 2. Exact normalized match
      if (currentCount === 0) {
        const tNorm = azNorm(tName)
        for (const tk of topicKeys) {
          if (azNorm(tk) === tNorm) {
            currentCount += questionsByTopic[tk].length
          }
        }
      }

      // 3. Stripped prefix match
      if (currentCount === 0) {
        const tStrip = stripTopicPrefix(tName)
        if (tStrip.length >= 3) {
          for (const tk of topicKeys) {
            if (stripTopicPrefix(tk) === tStrip) {
              currentCount += questionsByTopic[tk].length
            }
          }
        }
      }

      // 4. Substring containment match
      if (currentCount === 0) {
        const tNorm = azNorm(tName)
        for (const tk of topicKeys) {
          const tkNorm = azNorm(tk)
          if (
            (tNorm.length >= 5 && tkNorm.includes(tNorm)) ||
            (tkNorm.length >= 5 && tNorm.includes(tkNorm))
          ) {
            currentCount += questionsByTopic[tk].length
          }
        }
      }

      const isSatisfied = currentCount >= thresholdNum
      const needed = isSatisfied ? 0 : thresholdNum - currentCount

      // Bərabər paylanma: Sadə, Orta, Çətin
      const base = Math.floor(needed / 3)
      const rem = needed % 3
      const simple = base + (rem === 2 ? 1 : 0)
      const medium = base + (rem >= 1 ? 1 : 0)
      const hard = base

      if (isSatisfied) {
        skippedCount++
      } else {
        replenishCount++
        totalNeeded += needed
        totalSimple += simple
        totalMedium += medium
        totalHard += hard
      }

      results.push({
        topic: tName,
        currentCount,
        minThreshold: thresholdNum,
        status: isSatisfied ? "skip" : "replenish",
        needed,
        distribution: { simple, medium, hard },
        message: isSatisfied
          ? `Artıq ${currentCount} test var (Hədd: ${thresholdNum}). Mövzu adlanır (0 sual).`
          : `Bazada ${currentCount} test var. ${thresholdNum}-ə çatmaq üçün ${needed} test (${simple} sadə, ${medium} orta, ${hard} çətin) generasiya ediləcək.`,
      })
    }

    return NextResponse.json({
      success: true,
      minThreshold: thresholdNum,
      grade,
      textbook,
      totalTopics: topicList.length,
      skippedTopics: skippedCount,
      replenishedTopics: replenishCount,
      totalNeededQuestions: totalNeeded,
      distributionTotal: {
        simple: totalSimple,
        medium: totalMedium,
        hard: totalHard,
      },
      topics: results,
    })
  } catch (err: any) {
    console.error("[Threshold Check Error]:", err)
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
