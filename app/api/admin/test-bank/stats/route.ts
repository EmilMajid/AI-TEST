export const dynamic = "force-dynamic"
import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

let cachedStats: any = null
let cacheTime = 0
const CACHE_TTL = 1000 * 60 * 30 // 30 minutes

export async function GET() {
  try {
    const now = Date.now()
    if (cachedStats && now - cacheTime < CACHE_TTL) {
      return NextResponse.json({ success: true, stats: cachedStats })
    }

    const gradesDir = path.join(process.cwd(), "data", "grades")
    const summary = {
      totalQuestions: 0,
      totalGrades: 0,
      totalSubjects: 0,
      totalTopics: 0,
      difficultyDistribution: { sadə: 0, orta: 0, çətin: 0 },
      grades: [] as any[],
    }

    const uniqueSubjectsSet = new Set<string>()

    for (let g = 2; g <= 11; g++) {
      const p = path.join(gradesDir, `grade_${g}.json`)
      if (!fs.existsSync(p)) continue

      try {
        const data = JSON.parse(fs.readFileSync(p, "utf8"))
        let gQuestions = 0
        let gTopics = 0
        const gDiff = { sadə: 0, orta: 0, çətin: 0 }
        const subjects = Object.keys(data)

        for (const s of subjects) {
          uniqueSubjectsSet.add(s)
          const topicObj = data[s]

          if (Array.isArray(topicObj)) {
            gQuestions += topicObj.length
            gTopics += 1
            for (const q of topicObj) {
              const d = (q.difficulty || "orta").toLowerCase()
              if (d.includes("sad") || d.includes("asan")) {
                gDiff.sadə++
                summary.difficultyDistribution.sadə++
              } else if (d.includes("çət") || d.includes("cetin")) {
                gDiff.çətin++
                summary.difficultyDistribution.çətin++
              } else {
                gDiff.orta++
                summary.difficultyDistribution.orta++
              }
            }
          } else if (typeof topicObj === "object" && topicObj !== null) {
            const topics = Object.keys(topicObj)
            gTopics += topics.length
            for (const t of topics) {
              const qList = topicObj[t]
              if (Array.isArray(qList)) {
                gQuestions += qList.length
                for (const q of qList) {
                  const d = (q.difficulty || "orta").toLowerCase()
                  if (d.includes("sad") || d.includes("asan")) {
                    gDiff.sadə++
                    summary.difficultyDistribution.sadə++
                  } else if (d.includes("çət") || d.includes("cetin")) {
                    gDiff.çətin++
                    summary.difficultyDistribution.çətin++
                  } else {
                    gDiff.orta++
                    summary.difficultyDistribution.orta++
                  }
                }
              }
            }
          }
        }

        summary.totalQuestions += gQuestions
        summary.totalTopics += gTopics
        summary.grades.push({
          grade: String(g),
          title: `${g}-ci Sinif`,
          subjectsCount: subjects.length,
          topicsCount: gTopics,
          questionsCount: gQuestions,
          difficulty: gDiff,
        })
      } catch (err) {
        console.error(`Error reading grade_${g}.json:`, err)
      }
    }

    summary.totalGrades = summary.grades.length
    summary.totalSubjects = uniqueSubjectsSet.size

    cachedStats = summary
    cacheTime = now

    return NextResponse.json({ success: true, stats: summary })
  } catch (error: any) {
    console.error("Failed to load test bank stats:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
