export const dynamic = "force-dynamic"
import { NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"
import { azNorm, findBestTopicMatch, findMatchingSubjectKeys } from "@/lib/topic-matcher"
import { atomicWriteJsonSync, offlineTestsMutex, syncSubjectToGradeFile } from "@/lib/data-safety"

const offlineTestsPath = path.join(process.cwd(), "data", "offline_tests.json")

function loadDb(): Record<string, any> {
    if (!fs.existsSync(offlineTestsPath)) return {}
    try {
        return JSON.parse(fs.readFileSync(offlineTestsPath, "utf-8"))
    } catch (err) {
        console.error("Critical error reading or parsing offline_tests.json in loadDb:", err)
        return {}
    }
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const topic = searchParams.get("topic")
        const subject = searchParams.get("subject")

        const db = loadDb()
        let allQuestions: any[] = []

        const extractQuestions = (val: any, sKey?: string) => {
            if (Array.isArray(val)) {
                val.forEach((item: any) => {
                    if (item.questions && Array.isArray(item.questions)) {
                        item.questions.forEach((q: any) => {
                            if (!q.topic && item.topic_key) q.topic = item.topic_key
                            if (!q.category && sKey) q.category = sKey
                            allQuestions.push(q)
                        })
                    } else if (item.question) {
                        if (!item.category && sKey) item.category = sKey
                        allQuestions.push(item)
                    }
                })
            } else if (typeof val === "object" && val !== null) {
                Object.entries(val).forEach(([tKey, qList]: [string, any]) => {
                    if (Array.isArray(qList)) {
                        qList.forEach((q: any) => {
                            if (!q.topic) q.topic = tKey
                            if (!q.category && sKey) q.category = sKey
                            allQuestions.push(q)
                        })
                    }
                })
            }
        }

        if (subject) {
            const matchedSubjects = findMatchingSubjectKeys(subject, Object.keys(db))
            if (matchedSubjects.length > 0) {
                matchedSubjects.forEach(s => extractQuestions(db[s], s))
            } else if (db[subject]) {
                extractQuestions(db[subject], subject)
            }
        } else {
            Object.entries(db).forEach(([sKey, val]) => extractQuestions(val, sKey))
        }

        if (topic) {
            const allTopics = Array.from(new Set(allQuestions.map((q: any) => q.topic || q.topic_key).filter(Boolean))) as string[]
            const matchedTopics = findBestTopicMatch(topic, allTopics)
            allQuestions = matchedTopics.length > 0
                ? allQuestions.filter((q: any) => matchedTopics.includes(q.topic || q.topic_key))
                : []
        }

        return NextResponse.json(allQuestions)
    } catch (error) {
        console.error("Error reading questions:", error)
        return NextResponse.json({ error: "Failed to read questions" }, { status: 500 })
    }
}

export async function PATCH(request: NextRequest) {
    try {
        const { passport_id, status } = await request.json()

        if (!passport_id) {
            return NextResponse.json({ error: "passport_id required" }, { status: 400 })
        }

        const unlock = await offlineTestsMutex.lock()
        try {
            const db = loadDb()
            let found = false
            let matchedSubject: string | null = null

            for (const subject of Object.keys(db)) {
                const val: any = db[subject]
                if (Array.isArray(val)) {
                    const idx = val.findIndex((q: any) => q.passport_id === passport_id)
                    if (idx !== -1) {
                        if (status !== undefined) val[idx].status = status
                        found = true
                        matchedSubject = subject
                        break
                    }
                } else if (val && typeof val === "object") {
                    for (const topicKey of Object.keys(val)) {
                        if (Array.isArray(val[topicKey])) {
                            const idx = val[topicKey].findIndex((q: any) => q.passport_id === passport_id)
                            if (idx !== -1) {
                                if (status !== undefined) val[topicKey][idx].status = status
                                found = true
                                matchedSubject = subject
                                break
                            }
                        }
                    }
                    if (found) break
                }
            }

            if (!found) {
                return NextResponse.json({ error: "Question not found" }, { status: 404 })
            }

            atomicWriteJsonSync(offlineTestsPath, db, { backup: true })
            if (matchedSubject) {
                syncSubjectToGradeFile(matchedSubject, db[matchedSubject])
            }
            return NextResponse.json({ success: true })
        } finally {
            unlock()
        }
    } catch (error) {
        console.error("Error updating question:", error)
        return NextResponse.json({ error: "Failed to update question" }, { status: 500 })
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const passport_id = searchParams.get("passport_id")

        if (!passport_id) {
            return NextResponse.json({ error: "passport_id required" }, { status: 400 })
        }

        const unlock = await offlineTestsMutex.lock()
        try {
            const db = loadDb()
            let found = false
            let matchedSubject: string | null = null

            for (const subject of Object.keys(db)) {
                const val: any = db[subject]
                if (Array.isArray(val)) {
                    const idx = val.findIndex((q: any) => q.passport_id === passport_id)
                    if (idx !== -1) {
                        val.splice(idx, 1)
                        found = true
                        matchedSubject = subject
                        break
                    }
                } else if (val && typeof val === "object") {
                    for (const topicKey of Object.keys(val)) {
                        if (Array.isArray(val[topicKey])) {
                            const idx = val[topicKey].findIndex((q: any) => q.passport_id === passport_id)
                            if (idx !== -1) {
                                val[topicKey].splice(idx, 1)
                                found = true
                                matchedSubject = subject
                                break
                            }
                        }
                    }
                    if (found) break
                }
            }

            if (!found) {
                return NextResponse.json({ error: "Question not found" }, { status: 404 })
            }

            atomicWriteJsonSync(offlineTestsPath, db, { backup: true })
            if (matchedSubject) {
                syncSubjectToGradeFile(matchedSubject, db[matchedSubject])
            }
            return NextResponse.json({ success: true })
        } finally {
            unlock()
        }
    } catch (error) {
        console.error("Error deleting question:", error)
        return NextResponse.json({ error: "Failed to delete question" }, { status: 500 })
    }
}
