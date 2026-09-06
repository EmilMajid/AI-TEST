export const dynamic = "force-dynamic"
import { NextResponse } from 'next/server'
import path from 'path'
import fs from 'fs'

const gradesDir = path.join(process.cwd(), 'data', 'grades')
const textbooksPath = path.join(process.cwd(), 'data', 'textbooks.json')

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
      const data = JSON.parse(fs.readFileSync(p, 'utf8'))
      gradeCache.set(gStr, data)
      return data
    } catch (e) {
      console.error(`Error loading grade_${gStr}.json:`, e)
    }
  }
  return null
}

function stripTopicPrefix(name: string): string {
  return (name || '')
    .replace(/^(unit|lektion|leçon|раздел|bölmə|fəsil|hissə)\s*[\dIVXivx]+[\.\-\s]+/i, '')
    .replace(/^\d+[\.\-\s]+/, '')
    .trim()
    .toLowerCase()
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const grade = searchParams.get('grade')
    const subject = searchParams.get('subject')
    const topic = searchParams.get('topic')
    const search = searchParams.get('search')
    const difficulty = searchParams.get('difficulty')

    // 1. No grade specified -> return all available grades with counts
    if (!grade) {
      const gradesList: any[] = []
      for (let g = 2; g <= 11; g++) {
        const db = getGradeDb(g)
        let qCount = 0
        let sCount = 0
        if (db) {
          sCount = Object.keys(db).length
          for (const s of Object.keys(db)) {
            const val = db[s]
            if (Array.isArray(val)) qCount += val.length
            else if (typeof val === 'object' && val !== null) {
              for (const t of Object.keys(val)) {
                if (Array.isArray(val[t])) qCount += val[t].length
              }
            }
          }
        }
        gradesList.push({
          grade: String(g),
          title: `${g}-ci Sinif`,
          subjectsCount: sCount,
          questionsCount: qCount
        })
      }
      return NextResponse.json({ type: 'grades', data: gradesList })
    }

    const gradeDb = getGradeDb(grade)
    if (!gradeDb) {
      return NextResponse.json({ error: `Grade ${grade} data not found` }, { status: 404 })
    }

    // 2. Grade specified, no subject -> return subjects/textbooks in that grade
    if (grade && !subject) {
      const subjectsWithCounts = Object.keys(gradeDb).map((subjName) => {
        const topicObj = gradeDb[subjName]
        let qCount = 0
        let tCount = 0
        const diff = { sadə: 0, orta: 0, çətin: 0 }

        if (Array.isArray(topicObj)) {
          qCount = topicObj.length
          tCount = 1
          topicObj.forEach((q: any) => {
            const d = (q.difficulty || 'orta').toLowerCase()
            if (d.includes('sad') || d.includes('asan')) diff.sadə++
            else if (d.includes('çət') || d.includes('cetin')) diff.çətin++
            else diff.orta++
          })
        } else if (typeof topicObj === 'object' && topicObj !== null) {
          const tKeys = Object.keys(topicObj)
          tCount = tKeys.length
          for (const t of tKeys) {
            const qList = topicObj[t]
            if (Array.isArray(qList)) {
              qCount += qList.length
              qList.forEach((q: any) => {
                const d = (q.difficulty || 'orta').toLowerCase()
                if (d.includes('sad') || d.includes('asan')) diff.sadə++
                else if (d.includes('çət') || d.includes('cetin')) diff.çətin++
                else diff.orta++
              })
            }
          }
        }

        return {
          title: subjName,
          name: subjName,
          grade: String(grade),
          topicsCount: tCount,
          questionCount: qCount,
          count: qCount,
          difficulty: diff
        }
      })

      return NextResponse.json({ type: 'subjects', data: subjectsWithCounts })
    }

    // Find the matching subject in gradeDb
    let targetSubjectKey = Object.keys(gradeDb).find(
      (k) => k.toLowerCase().trim() === subject.toLowerCase().trim()
    )
    if (!targetSubjectKey) {
      targetSubjectKey = Object.keys(gradeDb).find(
        (k) => k.toLowerCase().includes(subject.toLowerCase()) || subject.toLowerCase().includes(k.toLowerCase())
      )
    }

    const subjectContent = targetSubjectKey ? gradeDb[targetSubjectKey] : null

    // 3. Grade + subject, no topic -> return topics with question counts
    if (grade && subject && !topic) {
      if (!subjectContent) {
        return NextResponse.json({ type: 'topics', data: [] })
      }

      const topicsWithCounts: any[] = []

      if (Array.isArray(subjectContent)) {
        topicsWithCounts.push({
          name: 'Ümumi Mövzu',
          title: 'Ümumi Mövzu',
          questionCount: subjectContent.length,
          count: subjectContent.length
        })
      } else if (typeof subjectContent === 'object' && subjectContent !== null) {
        for (const [tName, qList] of Object.entries(subjectContent)) {
          const qArr = Array.isArray(qList) ? qList : []
          const diff = { sadə: 0, orta: 0, çətin: 0 }
          qArr.forEach((q: any) => {
            const d = (q.difficulty || 'orta').toLowerCase()
            if (d.includes('sad') || d.includes('asan')) diff.sadə++
            else if (d.includes('çət') || d.includes('cetin')) diff.çətin++
            else diff.orta++
          })

          topicsWithCounts.push({
            name: tName,
            title: tName,
            questionCount: qArr.length,
            count: qArr.length,
            difficulty: diff
          })
        }
      }

      return NextResponse.json({ type: 'topics', data: topicsWithCounts })
    }

    // 4. Grade + subject + topic -> return questions
    if (grade && subject && topic) {
      if (!subjectContent) {
        return NextResponse.json({ type: 'questions', data: [] })
      }

      let questions: any[] = []

      if (Array.isArray(subjectContent)) {
        questions = subjectContent
      } else if (typeof subjectContent === 'object' && subjectContent !== null) {
        questions = subjectContent[topic] || []
        if (questions.length === 0) {
          const found = Object.entries(subjectContent).find(
            ([k]) =>
              k.toLowerCase().trim() === topic.toLowerCase().trim() ||
              stripTopicPrefix(k) === stripTopicPrefix(topic)
          )
          if (found && Array.isArray(found[1])) {
            questions = found[1]
          }
        }
      }

      // Filter by difficulty if provided
      if (difficulty) {
        const diffLower = difficulty.toLowerCase()
        questions = questions.filter((q: any) => (q.difficulty || '').toLowerCase().includes(diffLower))
      }

      // Filter by search keyword if provided
      if (search) {
        const sLower = search.toLowerCase().trim()
        questions = questions.filter((q: any) => {
          const qText = (q.question || q.q || '').toLowerCase()
          const pId = (q.passport_id || '').toLowerCase()
          const opts = Array.isArray(q.options) ? q.options.join(' ').toLowerCase() : ''
          return qText.includes(sLower) || pId.includes(sLower) || opts.includes(sLower)
        })
      }

      return NextResponse.json({ type: 'questions', data: questions })
    }

    return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 })
  } catch (err: any) {
    console.error('Error in hierarchy route:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
