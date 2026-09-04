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

let inMemoryResults: StoredTestResult[] = []

function isAyazTest(r: any): boolean {
  if (!r) return false
  const id = String(r.studentId || "").toLowerCase()
  return id === "student-ayaz-161-test" || id === "student-ayaz-309-test"
}

export function loadTestResultsFromDisk(): StoredTestResult[] {
  try {
    if (fs.existsSync(RESULTS_FILE)) {
      const data = fs.readFileSync(RESULTS_FILE, "utf-8")
      const parsed = JSON.parse(data)
      if (Array.isArray(parsed)) {
        inMemoryResults = parsed.filter(r => !isAyazTest(r))
        return inMemoryResults
      }
    }
  } catch (err) {
    console.error("Error reading test results from disk:", err)
  }
  return inMemoryResults.filter(r => !isAyazTest(r))
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
  const studentIdStr = studentId !== undefined && studentId !== null ? String(studentId) : ""
  const cleanName = (studentName || "").trim().toLowerCase()

  return current.filter((r) => {
    if (studentIdStr && String(r.studentId) === studentIdStr) return true
    if (cleanEmail && r.studentEmail && r.studentEmail.toLowerCase() === cleanEmail) return true
    if (cleanName && r.studentName && r.studentName.toLowerCase() === cleanName) return true
    return false
  })
}

export function getAllTestResults(): StoredTestResult[] {
  return loadTestResultsFromDisk()
}
