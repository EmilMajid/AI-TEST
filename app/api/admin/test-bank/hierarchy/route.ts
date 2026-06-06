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

// Function to dynamically match the book title with the subject key in offline_tests.json
function getSubjectKeyFromTitle(bookTitle: string) {
    const titleLower = bookTitle.toLowerCase()
    const dbSubjects = Object.keys(db)
    
    // First, try exact matches (case insensitive)
    for(const subj of dbSubjects) {
         if(titleLower.includes(subj.toLowerCase())) return subj
    }

    // Then handle special rules
    if (titleLower.includes("ingilis") || titleLower.includes("english")) return "İngilis dili"
    if (titleLower.includes("riyaziyyat")) return "Riyaziyyat"
    if (titleLower.includes("tarix")) {
         if(titleLower.includes("azərbaycan") || titleLower.includes("azerbaijan")) return "Azərbaycan tarixi"
         else return "Ümumi tarix"
    }
    if (titleLower.includes("həyat bilgisi") || titleLower.includes("heyat bilgisi")) return "Həyat bilgisi"
    if (titleLower.includes("coğrafiya") || titleLower.includes("cografiya")) return "Coğrafiya"
    if (titleLower.includes("ədəbiyyat")) return "Ədəbiyyat"
    if (titleLower.includes("informatika")) return "İnformatika"
    if (titleLower.includes("kimya")) return "Kimya"
    if (titleLower.includes("fizika")) return "Fizika"
    if (titleLower.includes("biologiya")) return "Biologiya"

    // If still no match, return null
    return null
}

export async function GET(request: Request) {
    try {
        loadData()
        const { searchParams } = new URL(request.url)
        const grade = searchParams.get('grade')
        const subject = searchParams.get('subject')
        const topic = searchParams.get('topic')

        // 1. If no grade provided, return list of available grades
        if (!grade) {
            const grades = Object.keys(textbooks).sort((a, b) => Number(a) - Number(b))
            return NextResponse.json({ type: 'grades', data: grades })
        }

        // 2. If grade provided, but no subject -> return subjects for that grade
        if (grade && !subject) {
            const books = textbooks[grade] || []
            const uniqueSubjects = Array.from(new Set(books.map((b: any) => b.title)))
            return NextResponse.json({ type: 'subjects', data: uniqueSubjects })
        }

        // 3. If grade and subject provided, but no topic -> return topics for that subject
        if (grade && subject && !topic) {
            const books = textbooks[grade] || []
            const book = books.find((b: any) => b.title === subject)
            if (!book) {
                return NextResponse.json({ type: 'topics', data: [] })
            }
            
            // For each topic in the book, we need to know the question count
            const subjectKey = getSubjectKeyFromTitle(book.title)
            const dbTopics = subjectKey && db[subjectKey] ? db[subjectKey] : []
            
            const topicsArray = typeof book.topics === 'string' 
                 ? book.topics.split('\n').map((t: string) => t.trim()).filter(Boolean)
                 : Array.isArray(book.topics) ? book.topics : []

            const topicsWithCounts = topicsArray.map((tName: string) => {
                const dt = dbTopics.find((d: any) => d.topic_key === tName || d.topic === tName)
                return {
                    name: tName,
                    questionCount: dt && dt.questions ? dt.questions.length : 0
                }
            })

            return NextResponse.json({ type: 'topics', data: topicsWithCounts })
        }

        // 4. If all provided, return questions for that specific topic
        if (grade && subject && topic) {
            const subjectKey = getSubjectKeyFromTitle(subject)
            if (!subjectKey || !db[subjectKey]) {
                 return NextResponse.json({ type: 'questions', data: [] })
            }
            const dbTopics = db[subjectKey]
            const foundTopic = dbTopics.find((d: any) => d.topic_key === topic || d.topic === topic)
            let questions = foundTopic ? foundTopic.questions : []
            
            // Filter questions by grade using their passport_id (TİK)
            const targetGradePrefix = grade.toString().padStart(2, '0') + "-";
            questions = questions.filter((q: any) => q.passport_id && q.passport_id.startsWith(targetGradePrefix));

            return NextResponse.json({ type: 'questions', data: questions })
        }

        return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 })
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}
