import { NextResponse } from 'next/server'
import path from 'path'
import fs from 'fs'

const dataDir = path.join(process.cwd(), 'data')
const offlineTestsPath = path.join(dataDir, 'offline_tests.json')
const textbooksPath = path.join(dataDir, 'textbooks.json')

let db: any = null
let textbooks: any = null

function loadData() {
    if (!db) {
        db = JSON.parse(fs.readFileSync(offlineTestsPath, 'utf8'))
    }
    if (!textbooks) {
        textbooks = JSON.parse(fs.readFileSync(textbooksPath, 'utf8'))
    }
}

// Maps a textbook title to the subject key used in offline_tests.json
function getSubjectKeyFromTitle(bookTitle: string): string | null {
    const titleLower = bookTitle.toLowerCase()
    const dbSubjects = Object.keys(db)

    // Try exact match first (case insensitive)
    for (const subj of dbSubjects) {
        if (subj.toLowerCase() === titleLower) return subj
    }

    // Try: does the db subject appear inside the book title?
    // e.g. book "İngilis dili 5 (əsas xarici dil)" → subject "İngilis dili"
    for (const subj of dbSubjects) {
        if (titleLower.includes(subj.toLowerCase())) return subj
    }

    // Specific fallbacks
    if (titleLower.includes('ingilis') || titleLower.includes('english')) return 'İngilis dili'
    if (titleLower.includes('riyaziyyat')) return 'Riyaziyyat'
    if (titleLower.includes('azərbaycan tarixi') || titleLower.includes('azerbaycan tarixi')) return 'Azərbaycan tarixi'
    if (titleLower.includes('ümumi tarix') || titleLower.includes('umumi tarix')) return 'Ümumi tarix'
    if (titleLower.includes('tarix') && (titleLower.includes('azərbaycan') || titleLower.includes('azerbaycan'))) return 'Azərbaycan tarixi'
    if (titleLower.includes('tarix')) return 'Ümumi tarix'
    if (titleLower.includes('həyat bilgisi') || titleLower.includes('heyat bilgisi')) return 'Həyat Bilgisi 5'
    if (titleLower.includes('ədəbiyyat')) return 'Ədəbiyyat'
    if (titleLower.includes('informatika')) return 'İnformatika'
    if (titleLower.includes('təbiət') || titleLower.includes('tebiet')) return 'Təbiət'
    if (titleLower.includes('rus dili')) return 'Rus dili'
    if (titleLower.includes('alman dili')) return titleLower.includes('ikinci') ? 'Alman dili 5 (ikinci xarici dil)' : 'Alman dili 5 (əsas xarici dil)'
    if (titleLower.includes('fransız dili')) return titleLower.includes('ikinci') ? 'Fransız dili 5 (ikinci xarici dil)' : 'Fransız dili 5 (əsas xarici dil)'
    if (titleLower.includes('coğrafiya') || titleLower.includes('cografiya')) return 'Coğrafiya'
    if (titleLower.includes('kimya')) return 'Kimya'
    if (titleLower.includes('fizika')) return 'Fizika'
    if (titleLower.includes('biologiya')) return 'Biologiya'
    if (titleLower.includes('texnologiya')) return 'Texnologiya'
    if (titleLower.includes('azərbaycan dili') || titleLower.includes('azerbaycan dili')) return 'Azərbaycan dili'

    return null
}

// Fuzzy topic match: strips common prefixes like "UNIT 1. ", "Lektion 1. ", "Раздел I. " etc.
function stripTopicPrefix(name: string): string {
    return name
        .replace(/^(unit|lektion|leçon|раздел|bölmə|fəsil|hissə)\s*[\dIVXivx]+[\.\-\s]+/i, '')
        .replace(/^\d+[\.\-\s]+/, '')
        .trim()
        .toLowerCase()
}

function topicsMatch(dbTopic: string, bookTopic: string): boolean {
    if (!dbTopic || !bookTopic) return false
    if (dbTopic === bookTopic) return true
    // Try stripping prefixes from both sides
    return stripTopicPrefix(dbTopic) === stripTopicPrefix(bookTopic)
}

export async function GET(request: Request) {
    try {
        loadData()
        const { searchParams } = new URL(request.url)
        const grade = searchParams.get('grade')
        const subject = searchParams.get('subject')
        const topic = searchParams.get('topic')

        // 1. No grade → return grades
        if (!grade) {
            const grades = Object.keys(textbooks).sort((a, b) => Number(a) - Number(b))
            return NextResponse.json({ type: 'grades', data: grades })
        }

        // 2. Grade, no subject → return books for that grade (only those with questions)
        if (grade && !subject) {
            const books = textbooks[grade] || []
            const uniqueSubjects = Array.from(new Set(books.map((b: any) => b.title)))
            // Annotate each subject with total question count
            const subjectsWithCounts = uniqueSubjects.map((title: any) => {
                const subjectKey = getSubjectKeyFromTitle(title)
                const count = subjectKey && db[subjectKey] ? db[subjectKey].length : 0
                return { title, count }
            })
            return NextResponse.json({ type: 'subjects', data: subjectsWithCounts })
        }

        // 3. Grade + subject, no topic → return topics with question counts
        if (grade && subject && !topic) {
            const books = textbooks[grade] || []
            const book = books.find((b: any) => b.title === subject)
            if (!book) {
                return NextResponse.json({ type: 'topics', data: [] })
            }

            const subjectKey = getSubjectKeyFromTitle(book.title)
            const allQuestions: any[] = subjectKey && db[subjectKey] ? db[subjectKey] : []

            const topicsArray: string[] = typeof book.topics === 'string'
                ? book.topics.split('\n').map((t: string) => t.trim()).filter(Boolean)
                : Array.isArray(book.topics) ? book.topics : []

            const targetGradePrefix = grade.toString().padStart(2, '0') + '-'

            // Also collect questions that have no passport_id (treat grade as optional for them)
            const topicsWithCounts = topicsArray.map((tName: string) => {
                const questionsForTopic = allQuestions.filter((q: any) => {
                    const topicOk = topicsMatch(q.topic, tName) || topicsMatch(q.category, tName)
                    const gradeOk = !q.passport_id || q.passport_id.startsWith(targetGradePrefix)
                    return topicOk && gradeOk
                })
                return { name: tName, questionCount: questionsForTopic.length }
            })

            // Also show topics that exist in the db but NOT in the textbook list (orphaned questions)
            const coveredTopics = new Set(topicsArray.map(t => stripTopicPrefix(t)))
            const orphanTopics = new Map<string, number>()
            allQuestions.forEach((q: any) => {
                const gradeOk = !q.passport_id || q.passport_id.startsWith(targetGradePrefix)
                if (!gradeOk) return
                const rawTopic = q.topic || q.category || '(Mövzusuz)'
                if (!coveredTopics.has(stripTopicPrefix(rawTopic))) {
                    orphanTopics.set(rawTopic, (orphanTopics.get(rawTopic) || 0) + 1)
                }
            })
            orphanTopics.forEach((count, name) => {
                topicsWithCounts.push({ name, questionCount: count })
            })

            return NextResponse.json({ type: 'topics', data: topicsWithCounts })
        }

        // 4. Grade + subject + topic → return questions
        if (grade && subject && topic) {
            const subjectKey = getSubjectKeyFromTitle(subject)
            if (!subjectKey || !db[subjectKey]) {
                return NextResponse.json({ type: 'questions', data: [] })
            }

            const targetGradePrefix = grade.toString().padStart(2, '0') + '-'
            const allQuestions: any[] = db[subjectKey]

            const questions = allQuestions.filter((q: any) => {
                const topicOk = topicsMatch(q.topic, topic) || topicsMatch(q.category, topic)
                const gradeOk = !q.passport_id || q.passport_id.startsWith(targetGradePrefix)
                return topicOk && gradeOk
            })

            return NextResponse.json({ type: 'questions', data: questions })
        }

        return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 })
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}
