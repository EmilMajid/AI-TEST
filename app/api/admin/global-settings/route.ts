export const dynamic = "force-dynamic"
import { type NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"

import os from "os"

const SETTINGS_FILE = path.join(process.cwd(), ".data", "testai_system_settings.json")
const TMP_SETTINGS_FILE = path.join(os.tmpdir(), "testai_system_settings.json")

// Global in-memory cache for serverless runtimes
const g = globalThis as unknown as { __testai_system_settings?: SystemSetting[] }

export interface SystemSetting {
  id: number
  key: string
  value: string
  description: string
}

const DEFAULT_SETTINGS: SystemSetting[] = [
  { id: 1, key: "AI_GENERATION_ENABLED", value: "true", description: "Aİ tərəfindən test generasiyası aktivdir." },
  { id: 2, key: "STUDENT_LOGIN_ENABLED", value: "true", description: "Şagirdlərin sistemə daxil olmasına icazə ver." },
  { id: 3, key: "MAINTENANCE_MODE", value: "false", description: "Saytı texniki baxış (Maintenance) rejiminə sal." },
  { id: 4, key: "FREE_ANALYTICS_PREVIEW", value: "true", description: "Valideynlər üçün ilkin statistikaya ödənişsiz baxış." },
  { id: 5, key: "USER_REGISTRATION_ENABLED", value: "true", description: "Yeni istifadəçilərin sərbəst qeydiyyatdan keçməsi." }
]

function getSettings(): SystemSetting[] {
  if (Array.isArray(g.__testai_system_settings) && g.__testai_system_settings.length > 0) {
    return g.__testai_system_settings
  }
  try {
    if (fs.existsSync(SETTINGS_FILE)) {
      const raw = fs.readFileSync(SETTINGS_FILE, "utf-8").replace(/^\uFEFF/, "")
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed.length > 0) {
        g.__testai_system_settings = parsed
        return parsed
      }
    }
  } catch (e) {}

  try {
    if (fs.existsSync(TMP_SETTINGS_FILE)) {
      const raw = fs.readFileSync(TMP_SETTINGS_FILE, "utf-8").replace(/^\uFEFF/, "")
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed.length > 0) {
        g.__testai_system_settings = parsed
        return parsed
      }
    }
  } catch (e) {}

  return DEFAULT_SETTINGS
}

function saveSettings(settings: SystemSetting[]) {
  g.__testai_system_settings = settings
  try {
    const dataDir = path.dirname(SETTINGS_FILE)
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true })
    }
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2), "utf-8")
  } catch (e: any) {
    console.error("Error writing SETTINGS_FILE:", e)
    throw new Error(`Failed to write settings file: ${e.message}`)
  }

  try {
    fs.writeFileSync(TMP_SETTINGS_FILE, JSON.stringify(settings, null, 2), "utf-8")
  } catch (e: any) {
    console.warn("Warning: Could not write to TMP_SETTINGS_FILE:", e.message)
  }
}

export async function GET() {
  try {
    const settings = getSettings()
    return NextResponse.json({ success: true, settings })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { settings } = body

    if (!Array.isArray(settings)) {
      return NextResponse.json({ success: false, error: "Settings massivi tələb olunur" }, { status: 400 })
    }

    saveSettings(settings)
    return NextResponse.json({ success: true, message: "Tənzimləmələr uğurla yadda saxlanıldı", settings })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
