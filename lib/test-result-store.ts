import fs from "fs"
import path from "path"
import os from "os"

function getStoragePath(filename: string): string {
  try {
    const localDir = path.join(process.cwd(), ".data")
    if (!fs.existsSync(localDir)) {
      fs.mkdirSync(localDir, { recursive: true })
    }
    return path.join(localDir, filename)
  } catch (e) {
    return path.join(os.tmpdir(), filename)
  }
}

const RESULTS_FILE = getStoragePath("testai_test_results.json")

export interface StoredTestResult {
  id: string | number
  studentId: string | number
  studentEmail?: string
  studentName?: string
  uniqueId?: string       // @ayaz.rzayev.309 kimi xüsusi ID
  parentId?: string       // əlaqəli valideyn ID-si
  textbook: string
  topic: string
  class: string
  difficulty?: string
  score: number
  totalQuestions: number
  correctAnswers: number
  wrongAnswers?: number
  timeSpent: number // in seconds
  completedAt: string
  answers?: Record<string, any>
  detailedResults?: Array<{
    questionId: number
    question: string
    userAnswer?: number | string
    correctAnswer?: number | string
    isCorrect: boolean
    explanation?: string
  }>
}

import { DEMO_SHOWCASE_RESULTS } from "./demo-showcase-data"

let inMemoryResults: StoredTestResult[] = []

export function loadTestResultsFromDisk(): StoredTestResult[] {
  let diskList: StoredTestResult[] = []
  try {
    if (fs.existsSync(RESULTS_FILE)) {
      const data = fs.readFileSync(RESULTS_FILE, "utf-8")
      const parsed = JSON.parse(data)
      if (Array.isArray(parsed)) {
        diskList = parsed
      }
    }
  } catch (err) {
    console.error("Error reading test results from disk:", err)
  }

  // Always merge DEMO_SHOWCASE_RESULTS so showcase demo accounts are permanently populated
  const map = new Map<string, StoredTestResult>()
  for (const r of diskList) {
    map.set(String(r.id), r)
  }
  for (const r of DEMO_SHOWCASE_RESULTS) {
    map.set(String(r.id), r)
  }

  inMemoryResults = Array.from(map.values())
  return inMemoryResults
}

export function saveTestResultsToDisk(results: StoredTestResult[]) {
  try {
    inMemoryResults = results
    fs.writeFileSync(RESULTS_FILE, JSON.stringify(results, null, 2), "utf-8")
  } catch (err) {
    console.error("Error writing test results to disk:", err)
  }
}

export function saveTestResult(result: StoredTestResult): StoredTestResult {
  const current = loadTestResultsFromDisk()
  const newResult: StoredTestResult = {
    ...result,
    id: result.id || `res-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    completedAt: result.completedAt || new Date().toISOString(),
  }
  current.unshift(newResult) // newest first
  saveTestResultsToDisk(current)

  // Async sync to Supabase TestResult table
  try {
    const { supabaseAdmin } = require("./user-store")
    if (supabaseAdmin) {
      const sEmail = (newResult.studentEmail || "").toLowerCase()
      const sId = String(newResult.studentId || "").toLowerCase()
      const isNum = !isNaN(Number(sId)) && Number(sId) > 0

      const resolveUserId = async (): Promise<number | null> => {
        if (isNum) return Number(sId)
        if (sEmail) {
          const { data } = await supabaseAdmin.from("User").select("id").eq("email", sEmail).maybeSingle()
          if (data?.id) return data.id
        }
        if (sId) {
          const { data: allStudents } = await supabaseAdmin.from("User").select("id, email").eq("accountType", "student")
          if (allStudents) {
            const m = allStudents.find((u: any) =>
              sId.includes(u.email.split("@")[0].toLowerCase()) ||
              u.email.toLowerCase().includes(sId.replace("student-", ""))
            )
            if (m?.id) return m.id
          }
        }
        return null
      }

      resolveUserId().then((uId) => {
        if (uId) {
          return supabaseAdmin.from("TestResult").insert({
            userId: uId,
            textbook: newResult.textbook,
            topic: newResult.topic || "Ümumi sınaq",
            class: String(newResult.class || "6"),
            score: Number(newResult.score) || 0,
            timeSpent: Number(newResult.timeSpent) || 0,
            answers: newResult.answers || {},
            completedAt: newResult.completedAt || new Date().toISOString(),
          })
        }
      }).catch((e: any) => console.error("Supabase insert error:", e))
    }
  } catch (err) {}

  return newResult
}


/**
 * Şagirdi çoxlu identifikator üzrə axtarır (Cross-ID lookup).
 * Sıra: studentId → studentEmail → uniqueId → email prefix → name
 */
export function getTestResultsForStudent(
  studentId?: string | number,
  studentEmail?: string,
  studentName?: string,
  uniqueId?: string
): StoredTestResult[] {
  const current = loadTestResultsFromDisk()

  const cleanId = studentId !== undefined && studentId !== null
    ? String(studentId).trim().toLowerCase()
    : ""
  const cleanEmail = (studentEmail || "").trim().toLowerCase()
  const cleanName = (studentName || "").trim().toLowerCase()
  const cleanUniqueId = (uniqueId || "").trim().toLowerCase()

  // Showcase shortcuts
  const isInci =
    cleanId === "student-inci" || cleanId === "student-1" ||
    cleanEmail === "inci.mecidzade@test.com" || cleanEmail === "inci.mecidzade@example.com" ||
    cleanName.includes("inci")
  const isEmilia =
    cleanId === "student-emilia" || cleanId === "student-2" ||
    cleanEmail === "emilia.mecidzade@test.com" || cleanEmail === "emilia.mecidzade@example.com" ||
    cleanName.includes("emilia")

  const matched = new Map<string, StoredTestResult>()

  for (const r of current) {
    const rId = String(r.studentId || "").toLowerCase()
    const rEmail = (r.studentEmail || "").toLowerCase()
    const rName = (r.studentName || "").toLowerCase()
    const rUniqueId = (r.uniqueId || "").toLowerCase()

    let matches = false

    // 1. Showcase shortcuts
    if (isInci && (rId === "student-inci" || rEmail === "inci.mecidzade@test.com" || rName.includes("inci"))) {
      matches = true
    } else if (isEmilia && (rId === "student-emilia" || rEmail === "emilia.mecidzade@test.com" || rName.includes("emilia"))) {
      matches = true
    }
    // 2. studentId dəqiq uyğunluq
    else if (cleanId && rId === cleanId) {
      matches = true
    }
    // 3. studentEmail dəqiq uyğunluq
    else if (cleanEmail && rEmail && rEmail === cleanEmail) {
      matches = true
    }
    // 4. uniqueId uyğunluq (@ ilə başlayan xüsusi ID)
    else if (cleanUniqueId && rUniqueId && rUniqueId === cleanUniqueId) {
      matches = true
    }
    // 5. Axtarılan email-in @ öncəsi hissəsi rId-də varsa (cross-ID köprüsü)
    else if (cleanEmail && cleanEmail.includes("@") && rId && rId.includes(cleanEmail.split("@")[0])) {
      matches = true
    }
    // 6. Axtarılan ID, rEmail-in @ öncəsi hissəsinə bərabərdirsə
    else if (cleanId && rEmail && rEmail.split("@")[0] === cleanId) {
      matches = true
    }
    // 7. studentName dəqiq uyğunluq (son çarə)
    else if (cleanName && rName && rName === cleanName) {
      matches = true
    }

    if (matches) {
      matched.set(String(r.id), r)
    }
  }

  return Array.from(matched.values())
}

export function getAllTestResults(): StoredTestResult[] {
  return loadTestResultsFromDisk()
}
