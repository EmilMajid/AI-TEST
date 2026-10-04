import * as fs from "fs"
import * as path from "path"
import * as zlib from "zlib"
import { getSafeWorkspacePath } from "@/lib/safe-path"

const gradeDbCache = new Map<string, Record<string, any>>()

function loadBundled(gradeDigit: string): string | null {
  try {
    switch (gradeDigit) {
      case "1": return require("@/data/bundled/grade_1").gradeGz
      case "2": return require("@/data/bundled/grade_2").gradeGz
      case "3": return require("@/data/bundled/grade_3").gradeGz
      case "4": return require("@/data/bundled/grade_4").gradeGz
      case "5": return require("@/data/bundled/grade_5").gradeGz
      case "6": return require("@/data/bundled/grade_6").gradeGz
      case "7": return require("@/data/bundled/grade_7").gradeGz
      case "8": return require("@/data/bundled/grade_8").gradeGz
      case "9": return require("@/data/bundled/grade_9").gradeGz
      case "10": return require("@/data/bundled/grade_10").gradeGz
      case "11": return require("@/data/bundled/grade_11").gradeGz
      default: return null
    }
  } catch (err) {
    return null
  }
}

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

      // 2. Uncompressed .json file if present locally
      const localJson = getSafeWorkspacePath("data", "grades", `grade_${gradeDigit}.json`)
      if (fs.existsSync(localJson)) {
        try {
          const data = JSON.parse(fs.readFileSync(localJson, "utf-8"))
          gradeDbCache.set(gradeDigit, data)
          return data
        } catch (_) {}
      }

      // 3. Bundled Webpack module (Guaranteed on Vercel runtime!)
      const b64 = loadBundled(gradeDigit)
      if (b64) {
        try {
          const decompressed = zlib.gunzipSync(Buffer.from(b64, "base64")).toString("utf-8")
          const data = JSON.parse(decompressed)
          gradeDbCache.set(gradeDigit, data)
          return data
        } catch (err) {
          console.error(`[grade-db] Error unpacking bundled grade_${gradeDigit}:`, err)
        }
      }

      // 4. Compressed .json.gz file if present on disk
      const gzPath = getSafeWorkspacePath("data", "grades", `grade_${gradeDigit}.json.gz`)
      if (fs.existsSync(gzPath)) {
        try {
          const decompressed = zlib.gunzipSync(fs.readFileSync(gzPath)).toString("utf-8")
          const data = JSON.parse(decompressed)
          gradeDbCache.set(gradeDigit, data)
          return data
        } catch (_) {}
      }
    }

    // 5. Grade Other bundled
    try {
      const otherB64 = require("@/data/bundled/grade_other").gradeGz
      if (otherB64) {
        const decompressed = zlib.gunzipSync(Buffer.from(otherB64, "base64")).toString("utf-8")
        return JSON.parse(decompressed)
      }
    } catch (_) {}

    // 6. Legacy offline_tests.json (local only)
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
