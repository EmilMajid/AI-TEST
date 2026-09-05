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

function isAyazTest(r: any): boolean {
  if (!r) return false
  const id = String(r.studentId || "").toLowerCase()
  return id === "student-ayaz-161-test" || id === "student-ayaz-309-test"
}

export function loadTestResultsFromDisk(): StoredTestResult[] {
  let diskList: StoredTestResult[] = []
  try {
    if (fs.existsSync(RESULTS_FILE)) {
      const data = fs.readFileSync(RESULTS_FILE, "utf-8")
      const parsed = JSON.parse(data)
      if (Array.isArray(parsed)) {
        diskList = parsed.filter(r => !isAyazTest(r))
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
  return newResult
}

export function getTestResultsForStudent(
  studentId?: string | number,
  studentEmail?: string,
  studentName?: string
): StoredTestResult[] {
  const current = loadTestResultsFromDisk()
  const cleanEmail = (studentEmail || "").trim().toLowerCase()
  const studentIdStr = studentId !== undefined && studentId !== null ? String(studentId).trim().toLowerCase() : ""
  const cleanName = (studentName || "").trim().toLowerCase()

  const isInci = studentIdStr === "student-inci" || studentIdStr === "student-1" || cleanEmail === "inci.mecidzade@test.com" || cleanEmail === "inci.mecidzade@example.com" || cleanName.includes("inci")
  const isEmilia = studentIdStr === "student-emilia" || studentIdStr === "student-2" || cleanEmail === "emilia.mecidzade@test.com" || cleanEmail === "emilia.mecidzade@example.com" || cleanName.includes("emilia")

  return current.filter((r) => {
    const rId = String(r.studentId).toLowerCase()
    const rEmail = (r.studentEmail || "").toLowerCase()
    const rName = (r.studentName || "").toLowerCase()

    if (isInci && (rId === "student-inci" || rEmail === "inci.mecidzade@test.com" || rName.includes("inci"))) return true
    if (isEmilia && (rId === "student-emilia" || rEmail === "emilia.mecidzade@test.com" || rName.includes("emilia"))) return true

    if (studentIdStr && rId === studentIdStr) return true
    if (cleanEmail && rEmail && rEmail === cleanEmail) return true
    if (cleanName && rName && rName === cleanName) return true
    return false
  })
}

export function getAllTestResults(): StoredTestResult[] {
  return loadTestResultsFromDisk()
}
