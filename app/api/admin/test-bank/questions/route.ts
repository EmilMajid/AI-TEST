export const dynamic = "force-dynamic"
import { NextRequest, NextResponse } from "next/server"
import path from "path"
import fs from "fs"

const gradesDir = path.join(process.cwd(), "data", "grades")

// In-memory cache for grade databases
const gradeCache = new Map<string, any>()

function getGradeDb(grade: string | number): Record<string, any> | null {
  const gStr = String(grade)
  if (gradeCache.has(gStr)) {
    return gradeCache.get(gStr)
  }

  const p = path.join(gradesDir, `grade_${gStr}.json`)
  if (fs.existsSync(p)) {
    try {
      const data = JSON.parse(fs.readFileSync(p, "utf8"))
      gradeCache.set(gStr, data)
      return data
    } catch (e) {
      console.error(`Error loading grade_${gStr}.json:`, e)
    }
  }
  return null
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const grade = searchParams.get("grade")
    const subject = searchParams.get("subject")
    const topic = searchParams.get("topic")
    const difficulty = searchParams.get("difficulty")
    const bloom = searchParams.get("bloom")
    const search = searchParams.get("search") || searchParams.get("q")
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10))
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20", 10)))

    let pool: any[] = []

    // If grade is specified, search in that grade; otherwise search in all grades or default to 8
    const gradesToSearch = grade ? [grade] : ["8", "5", "6", "7", "9", "10", "11", "2", "3", "4"]

    for (const g of gradesToSearch) {
      const db = getGradeDb(g)
      if (!db) continue

      const subjects = subject
        ? Object.keys(db).filter(
            (s) =>
              s.toLowerCase().trim() === subject.toLowerCase().trim() ||
              s.toLowerCase().includes(subject.toLowerCase())
          )
        : Object.keys(db)

      for (const s of subjects) {
        const topicObj = db[s]
        if (Array.isArray(topicObj)) {
          pool.push(...topicObj.map((q: any) => ({ ...q, grade: g, subject: s })))
        } else if (typeof topicObj === "object" && topicObj !== null) {
          const tKeys = topic
            ? Object.keys(topicObj).filter(
                (t) =>
                  t.toLowerCase().trim() === topic.toLowerCase().trim() ||
                  t.toLowerCase().includes(topic.toLowerCase())
              )
            : Object.keys(topicObj)

          for (const t of tKeys) {
            const qList = topicObj[t]
            if (Array.isArray(qList)) {
              pool.push(...qList.map((q: any) => ({ ...q, grade: g, subject: s, topic: t })))
            }
          }
        }
      }

      // If user is searching across all grades and we already have enough matches for performance, break early
      if (!grade && search && pool.length > 500) break
    }

    // Apply difficulty filter
    if (difficulty && difficulty !== "all") {
      const dLower = difficulty.toLowerCase()
      pool = pool.filter((q) => (q.difficulty || "").toLowerCase().includes(dLower))
    }

    // Apply bloom level filter
    if (bloom && bloom !== "all") {
      const bLower = bloom.toLowerCase()
      pool = pool.filter(
        (q) =>
          String(q.bloom_level || "").toLowerCase() === bLower ||
          (q.bloomLevel || "").toLowerCase().includes(bLower)
      )
    }

    // Apply search filter
    if (search) {
      const sLower = search.toLowerCase().trim()
      pool = pool.filter((q) => {
        const qText = (q.question || q.q || "").toLowerCase()
        const pId = (q.passport_id || "").toLowerCase()
        const opts = Array.isArray(q.options)
          ? q.options.join(" ").toLowerCase()
          : Array.isArray(q.opts)
          ? q.opts.join(" ").toLowerCase()
          : ""
        const expl = (q.explanation || q.izah || "").toLowerCase()
        return (
          qText.includes(sLower) ||
          pId.includes(sLower) ||
          opts.includes(sLower) ||
          expl.includes(sLower)
        )
      })
    }

    const total = pool.length
    const totalPages = Math.ceil(total / limit)
    const startIndex = (page - 1) * limit
    const paginated = pool.slice(startIndex, startIndex + limit)

    // Normalize question format
    const normalized = paginated.map((q, idx) => {
      let options = Array.isArray(q.options) ? q.options : Array.isArray(q.opts) ? q.opts : []
      options = options.map((opt: string) => opt.replace(/^[A-D]\)\s*/i, "").trim())

      let correctIndex = 0
      if (typeof q.correctAnswer === "number") correctIndex = q.correctAnswer
      else if (typeof q.correct_index === "number") correctIndex = q.correct_index
      else if (typeof q.answer === "string") {
        const letter = q.answer.trim().toUpperCase()
        if (letter === "B") correctIndex = 1
        else if (letter === "C") correctIndex = 2
        else if (letter === "D") correctIndex = 3
        else if (letter === "E") correctIndex = 4
      }

      return {
        id: q.id || startIndex + idx + 1,
        passport_id: q.passport_id || `0${q.grade || 8}-AUTOGEN-${idx + 1}`,
        grade: q.grade,
        subject: q.subject,
        topic: q.topic || q.category || "Ümumi mövzu",
        question: q.question || q.q || "",
        options,
        correctAnswer: correctIndex,
        explanation: q.explanation || q.izah || "",
        difficulty: q.difficulty || "orta",
        bloomLevel: q.bloomLevel || q.bloom_level || "anlama",
        sourceContext: q.sourceContext || "",
        status: q.status || "active",
      }
    })

    return NextResponse.json({
      success: true,
      questions: normalized,
      pagination: {
        total,
        page,
        limit,
        totalPages,
      },
    })
  } catch (error: any) {
    console.error("Error querying questions:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
