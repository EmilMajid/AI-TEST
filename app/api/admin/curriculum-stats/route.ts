export const dynamic = "force-dynamic"
import { type NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"
import { azNorm, findMatchingSubjectKeys, findBestTopicMatch } from "@/lib/topic-matcher"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const grade = searchParams.get("grade") || "2"
    const textbook = searchParams.get("textbook") || ""

    const gradeFilePath = path.join(process.cwd(), "data", "grades", `grade_${grade}.json`)
    let gradeDb: Record<string, any[]> = {}
    if (fs.existsSync(gradeFilePath)) {
      try {
        gradeDb = JSON.parse(fs.readFileSync(gradeFilePath, "utf-8"))
      } catch (e) {}
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
    const targetBooks = textbook
      ? gradeBooks.filter((b: any) => b.title.toLowerCase().trim() === textbook.toLowerCase().trim())
      : gradeBooks

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

      // Find matching subject key in gradeDb
      const matchedKeys = findMatchingSubjectKeys(b.title, Object.keys(gradeDb), grade)
      const allQuestionsForBook: any[] = []
      matchedKeys.forEach(k => {
        const val = gradeDb[k]
        if (Array.isArray(val)) {
          val.forEach((item: any) => {
            if (item.questions && Array.isArray(item.questions)) {
              allQuestionsForBook.push(...item.questions)
            } else if (item.question) {
              allQuestionsForBook.push(item)
            }
          })
        }
      })

      const topicStats = topicList.map((tName) => {
        const qCount = allQuestionsForBook.filter((q) => {
          const qTopic = azNorm(q.topic || "")
          const targetNorm = azNorm(tName)
          return qTopic === targetNorm || qTopic.includes(targetNorm) || targetNorm.includes(qTopic)
        }).length

        return {
          topic: tName,
          questionCount: qCount,
          status: qCount >= 10 ? "full" : qCount > 0 ? "partial" : "empty",
        }
      })

      const totalQuestions = allQuestionsForBook.length
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
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
