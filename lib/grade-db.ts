import * as fs from "fs"
import * as path from "path"
import * as zlib from "zlib"
import { getSafeWorkspacePath } from "@/lib/safe-path"

const gradeDbCache = new Map<string, Record<string, any>>()

export function getGradeDb(grade?: string | number, textbookTitle?: string): Record<string, any> {
  try {
    const gradeDigit =
      String(grade || "").match(/\b([1-9]|1[0-1])\b/)?.[0] ||
      String(textbookTitle || "").match(/\b([1-9]|1[0-1])\b/)?.[0] ||
      ""

    if (gradeDigit) {
      if (gradeDbCache.has(gradeDigit)) {
        return gradeDbCache.get(gradeDigit)!
      }

      // 1. Local KAG staging if present locally
      const stagingPath = getSafeWorkspacePath("autonomous_kag", "active_staging", `grade_${gradeDigit}.json`)
      if (fs.existsSync(stagingPath)) {
        try {
          const data = JSON.parse(fs.readFileSync(stagingPath, "utf-8"))
          gradeDbCache.set(gradeDigit, data)
          return data
        } catch (_) {}
      }

      // 2. Compressed .json.gz file (Vercel Serverless production bundle)
      const gzPath = getSafeWorkspacePath("data", "grades", `grade_${gradeDigit}.json.gz`)
      if (fs.existsSync(gzPath)) {
        try {
          const compressed = fs.readFileSync(gzPath)
          const decompressed = zlib.gunzipSync(compressed).toString("utf-8")
          const data = JSON.parse(decompressed)
          gradeDbCache.set(gradeDigit, data)
          return data
        } catch (err) {
          console.error(`[grade-db] Error reading compressed grade_${gradeDigit}.json.gz:`, err)
        }
      }

      // 3. Uncompressed .json file (local fallback)
      const p = getSafeWorkspacePath("data", "grades", `grade_${gradeDigit}.json`)
      if (fs.existsSync(p)) {
        try {
          const data = JSON.parse(fs.readFileSync(p, "utf-8"))
          gradeDbCache.set(gradeDigit, data)
          return data
        } catch (err) {
          console.error(`[grade-db] Error reading grade_${gradeDigit}.json:`, err)
        }
      }
    }

    // 4. Grade Other
    const otherGz = getSafeWorkspacePath("data", "grades", "grade_other.json.gz")
    if (fs.existsSync(otherGz)) {
      try {
        const decompressed = zlib.gunzipSync(fs.readFileSync(otherGz)).toString("utf-8")
        return JSON.parse(decompressed)
      } catch (_) {}
    }
    const otherPath = getSafeWorkspacePath("data", "grades", "grade_other.json")
    if (fs.existsSync(otherPath)) {
      try {
        return JSON.parse(fs.readFileSync(otherPath, "utf-8"))
      } catch (_) {}
    }

    // 5. Legacy offline_tests.json (local only)
    const legacyPath = getSafeWorkspacePath("data", "offline_tests.json")
    if (fs.existsSync(legacyPath)) {
      try {
        return JSON.parse(fs.readFileSync(legacyPath, "utf-8"))
      } catch (_) {}
    }
  } catch (e) {
    console.error("Error reading grade questions database:", e)
  }
  return {}
}
