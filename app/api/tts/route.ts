import { type NextRequest, NextResponse } from "next/server"
import * as fs from "fs"
import * as path from "path"
import * as crypto from "crypto"
import { spawn } from "child_process"

export const dynamic = "force-dynamic"

function getVoice(lang?: string, requestedVoice?: string): string {
  if (requestedVoice) return requestedVoice
  const l = (lang || "").toLowerCase()
  if (l.startsWith("en") || l.includes("ingilis")) return "en-US-JennyNeural"
  if (l.startsWith("ru") || l.includes("rus")) return "ru-RU-SvetlanaNeural"
  if (l.startsWith("de") || l.includes("alman")) return "de-DE-KatjaNeural"
  if (l.startsWith("fr") || l.includes("fransiz")) return "fr-FR-DeniseNeural"
  if (l.startsWith("tr") || l.includes("turk")) return "tr-TR-EmelNeural"
  // Standart olaraq Azərbaycan dili üçün təbii Azərbaycan Neural səsi:
  return "az-AZ-BanuNeural"
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const text = searchParams.get("text") || ""
    const lang = searchParams.get("lang") || "az"
    const requestedVoice = searchParams.get("voice") || ""

    return await handleTTS(text, lang, requestedVoice, request)
  } catch (error: any) {
    console.error("TTS GET error:", error)
    return NextResponse.json({ error: error.message || "TTS xətası baş verdi" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const text = body.text || ""
    const lang = body.lang || "az"
    const requestedVoice = body.voice || ""

    return await handleTTS(text, lang, requestedVoice, request)
  } catch (error: any) {
    console.error("TTS POST error:", error)
    return NextResponse.json({ error: error.message || "TTS xətası baş verdi" }, { status: 500 })
  }
}

async function handleTTS(rawText: string, lang: string, requestedVoice: string, request: NextRequest) {
  // Emojiləri və lazımsız simvolları təmizlə
  const cleanText = rawText
    .replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, "")
    .replace(/\s+/g, " ")
    .trim()

  if (!cleanText) {
    return NextResponse.json({ error: "Səsləndirmək üçün mətn daxil edilməyib" }, { status: 400 })
  }

  // Maksimum 500 simvol həddi
  const truncatedText = cleanText.slice(0, 500)
  const voice = getVoice(lang, requestedVoice)

  // Keş qovluğu
  const cacheDir = path.join(process.cwd(), "public", "audio", "cache")
  if (!fs.existsSync(cacheDir)) {
    fs.mkdirSync(cacheDir, { recursive: true })
  }

  // Fayl adı üçün unikal heş
  const hash = crypto.createHash("md5").update(`${voice}__${truncatedText}`).digest("hex")
  const cacheFilePath = path.join(cacheDir, `${hash}.mp3`)
  const staticUrl = `/audio/cache/${hash}.mp3`

  // Əgər audio fayl artıq keşdə varsa, birbaşa yönləndir
  if (fs.existsSync(cacheFilePath) && fs.statSync(cacheFilePath).size > 1000) {
    if (request.headers.get("accept")?.includes("application/json")) {
      return NextResponse.json({ success: true, audioUrl: staticUrl })
    }
    return NextResponse.redirect(new URL(staticUrl, request.url), 307)
  }

  // Əgər keşdə yoxdursa, edge-tts ilə yüksək keyfiyyətli MP3 yarat
  try {
    await new Promise<void>((resolve, reject) => {
      const synthScript = path.join(process.cwd(), "scripts", "synthesize.py")
      const py = spawn("python", [synthScript, voice, cacheFilePath], {
        env: { ...process.env, PYTHONIOENCODING: "utf-8", PYTHONUTF8: "1" },
      })

      py.stdin.write(truncatedText, "utf-8")
      py.stdin.end()

      let stderr = ""
      py.stderr.on("data", (d) => {
        stderr += d.toString()
      })

      py.on("close", (code) => {
        if (code === 0 && fs.existsSync(cacheFilePath)) {
          resolve()
        } else {
          reject(new Error(`edge-tts xətası (kod ${code}): ${stderr}`))
        }
      })

      py.on("error", (err) => {
        reject(err)
      })

      // 15 saniyəlik timeout
      setTimeout(() => {
        try {
          py.kill()
        } catch (_) {}
        if (fs.existsSync(cacheFilePath)) resolve()
        else reject(new Error("TTS generasiya vaxtı bitdi"))
      }, 15000)
    })

    if (request.headers.get("accept")?.includes("application/json")) {
      return NextResponse.json({ success: true, audioUrl: staticUrl })
    }
    return NextResponse.redirect(new URL(staticUrl, request.url), 307)
  } catch (genError: any) {
    console.error("Audio generasiya xətası:", genError)
    return NextResponse.json({ error: "Səs faylı yaradılarkən xəta: " + genError.message }, { status: 500 })
  }
}
