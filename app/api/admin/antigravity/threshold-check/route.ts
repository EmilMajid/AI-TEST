export const dynamic = "force-dynamic"
import { type NextRequest, NextResponse } from "next/server"
import * as fs from "fs"
import * as path from "path"
import { azNorm, stripTopicPrefix, findBestTopicMatch, findMatchingSubjectKeys } from "@/lib/topic-matcher"

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
        console.error("Error reading grade DB:", e)
      }
    }

    // Also load offline_tests if gradeDb doesn't have subject
    const matchedKeys = findMatchingSubjectKeys(textbook, Object.keys(gradeDb), String(grade))

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

      matchedKeys.forEach((sKey) => {
        const val = gradeDb[sKey]
        if (Array.isArray(val)) {
          const candidateTopics = Array.from(new Set(
            val.map((item: any) => item.topic || item.topic_key || (item.questions?.[0]?.topic)).filter(Boolean)
          )) as string[]

          const matched = findBestTopicMatch(tName, candidateTopics)
          if (matched.length > 0) {
            val.forEach((item: any) => {
              const itemTopic = item.topic || item.topic_key || ""
              if (item.questions && Array.isArray(item.questions)) {
                item.questions.forEach((q: any) => {
                  const qTopic = q.topic || itemTopic
                  if (matched.includes(qTopic)) currentCount++
                })
              } else if (item.question) {
                if (matched.includes(itemTopic)) currentCount++
              }
            })
          }
        } else if (typeof val === "object" && val !== null) {
          const candidateTopics = Object.keys(val)
          const matched = findBestTopicMatch(tName, candidateTopics)
          if (matched.length > 0) {
            matched.forEach((mT) => {
              const qList = val[mT]
              if (Array.isArray(qList)) {
                currentCount += qList.length
              }
            })
          }
        }
      })

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
