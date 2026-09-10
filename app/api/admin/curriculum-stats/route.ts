export const dynamic = "force-dynamic"
import { type NextRequest, NextResponse } from "next/server"
import * as fs from "fs"
import * as path from "path"
import { azNorm, stripTopicPrefix, findMatchingSubjectKeys } from "@/lib/topic-matcher"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const grade = searchParams.get("grade") || "2"
    const textbook = searchParams.get("textbook") || ""

    const gradeFilePath = path.join(process.cwd(), "data", "grades", `grade_${grade}.json`)
    let gradeDb: Record<string, any> = {}
    if (fs.existsSync(gradeFilePath)) {
      try {
        gradeDb = JSON.parse(fs.readFileSync(gradeFilePath, "utf-8"))
      } catch (e) {
        console.error("Error reading grade DB in curriculum-stats:", e)
      }
    }

    const textbooksPath = path.join(process.cwd(), "data", "textbooks.json")
    let gradeBooks: any[] = []
    if (fs.existsSync(textbooksPath)) {
      try {
        const tb = JSON.parse(fs.readFileSync(textbooksPath, "utf-8"))
        gradeBooks = tb[grade] || []
      } catch (e) {}
    }

    // Find requested book or all books for grade
    const targetBooks = textbook && textbook !== "all"
      ? gradeBooks.filter((b: any) => {
          const bNorm = azNorm(b.title)
          const targetNorm = azNorm(textbook)
          return bNorm === targetNorm || bNorm.includes(targetNorm) || targetNorm.includes(bNorm)
        })
      : gradeBooks

    const dbKeys = Object.keys(gradeDb)

    const stats = targetBooks.map((b: any) => {
      let topicList: string[] = []
      if (typeof b.topics === "string") {
        topicList = b.topics
          .split("\n")
          .map((t: string) => t.trim())
          .filter((t: string) => t.length > 0 && !t.startsWith("---"))
      } else if (Array.isArray(b.topics)) {
        topicList = b.topics
      }

      // Find matching subject keys in gradeDb
      const bTitleNorm = azNorm(b.title)
      const matchedKeys = dbKeys.filter((k) => {
        const kNorm = azNorm(k)
        return kNorm === bTitleNorm || kNorm.includes(bTitleNorm) || bTitleNorm.includes(kNorm)
      })

      // Also try findMatchingSubjectKeys helper
      const helperKeys = findMatchingSubjectKeys(b.title, dbKeys, String(grade))
      const combinedKeys = Array.from(new Set([...matchedKeys, ...helperKeys]))

      // Build questions map across topics
      const questionsByTopic: Record<string, any[]> = {}
      let totalQuestions = 0

      combinedKeys.forEach((sKey) => {
        const val = gradeDb[sKey]
        if (val && typeof val === "object" && !Array.isArray(val)) {
          // Format 1: Object dictionary of topics -> question array
          Object.entries(val).forEach(([tKey, qList]) => {
            if (Array.isArray(qList)) {
              totalQuestions += qList.length
              if (!questionsByTopic[tKey]) questionsByTopic[tKey] = []
              questionsByTopic[tKey].push(...qList)
            }
          })
        } else if (Array.isArray(val)) {
          // Format 2: Array of topic objects
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

      const topicStats = topicList.map((tName) => {
        let qCount = 0

        // 1. Direct exact key match
        if (questionsByTopic[tName]) {
          qCount = questionsByTopic[tName].length
        }

        // 2. Exact normalized match
        if (qCount === 0) {
          const tNorm = azNorm(tName)
          for (const tk of topicKeys) {
            if (azNorm(tk) === tNorm) {
              qCount += questionsByTopic[tk].length
            }
          }
        }

        // 3. Stripped prefix match
        if (qCount === 0) {
          const tStrip = stripTopicPrefix(tName)
          if (tStrip.length >= 3) {
            for (const tk of topicKeys) {
              if (stripTopicPrefix(tk) === tStrip) {
                qCount += questionsByTopic[tk].length
              }
            }
          }
        }

        // 4. Substring containment match
        if (qCount === 0) {
          const tNorm = azNorm(tName)
          for (const tk of topicKeys) {
            const tkNorm = azNorm(tk)
            if (
              (tNorm.length >= 5 && tkNorm.includes(tNorm)) ||
              (tkNorm.length >= 5 && tNorm.includes(tkNorm))
            ) {
              qCount += questionsByTopic[tk].length
            }
          }
        }

        return {
          topic: tName,
          questionCount: qCount,
          status: qCount >= 21 ? "full" : qCount > 0 ? "partial" : "empty",
        }
      })

      const coveredTopics = topicStats.filter((t) => t.questionCount > 0).length
      const emptyTopics = topicStats.filter((t) => t.questionCount === 0).length

      return {
        textbook: b.title,
        subject: b.subject,
        grade,
        totalTopics: topicList.length,
        coveredTopics,
        emptyTopics,
        totalQuestions,
        topics: topicStats,
      }
    })

    return NextResponse.json({ success: true, grade, stats })
  } catch (err: any) {
    console.error("[Curriculum Stats Error]:", err)
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
