import { type NextRequest, NextResponse } from "next/server"
import * as fs from "fs"
import * as path from "path"
import * as crypto from "crypto"
import { spawn } from "child_process"
import { getSafeWorkspacePath } from "@/lib/safe-path"

export const dynamic = "force-dynamic"

function azNormText(str: string): string {
  return (str || "")
    .replace(/İ/g, "i")
    .replace(/i̇/g, "i")
    .replace(/I/g, "ı")
    .toLowerCase()
}

export function detectTextLanguage(text: string, subjectContext?: string): "az" | "en" | "ru" | "de" | "fr" {
  if (!text || !text.trim()) return "az"
  const trimmed = text.trim()

  // 1. Rus dili: Kiril hərflərinin üstünlük təşkil etməsi
  const cyrillicCount = (trimmed.match(/[\u0400-\u04FF]/g) || []).length
  const latinCount = (trimmed.match(/[a-zA-ZçəıöüşğÇƏİÖÜŞĞ]/g) || []).length
  if (cyrillicCount > latinCount && cyrillicCount > 0) return "ru"

  // 2. Azərbaycan dilinə xas olan xüsusi hərflər (İngilis dilində qətiyyən yoxdur)
  if (/[çÇşŞöÖüÜəƏıIğĞ]/.test(trimmed)) return "az"

  // 3. Azərbaycan dilinə aid qrammatik və sual açar sözləri
  const azWords = /\b(hansı|hansıdır|nədir|necə|deyilir|deməkdir|tərcüməsi|dilində|sözünün|sözü|ifadəsi|doğrudur|uyğundur|sual|cavab|variantı|seçin|əşya|şəkil|masanın|üstündə|altında|sağda|solda|və|ilə|olan|üçün|ədəd|sayı|cəm|fərq)\b/i
  if (azWords.test(trimmed)) return "az"

  // 4. Normallaşdırılmış fənn konteksti
  const sub = azNormText(subjectContext || "")

  // 5. Alman dilinə xas xarakterik simvol və sözlər
  if (/[äÄß]/.test(trimmed) || /\b(der|die|das|und|ist|nicht|guten|morgen|tag|nacht|auf|wiedersehen|tschüss|danke|bitte|hallo)\b/i.test(trimmed)) {
    if (sub.includes("alman") || sub.includes("german") || sub.includes("de")) return "de"
  }

  // 6. Fransız dilinə xas xarakterik sözlər və hərflər
  if (/\b(bonjour|salut|au revoir|merci|oui|non|s'il vous plaît|bonne nuit|monsieur|madame)\b/i.test(trimmed)) return "fr"
  if (/[éèêëàâùûôîïœæ]/i.test(trimmed)) {
    if (sub.includes("fransiz") || sub.includes("fransız") || sub.includes("french") || sub.includes("fr")) return "fr"
  }

  // 7. Əgər fənn xarici dildirsə və mətn Azərbaycan dili əlaməti daşımırsa, xarici dilə aid et:
  if (sub.includes("ingilis") || sub.includes("english") || sub.includes("en")) {
    return "en"
  }
  if (sub.includes("alman") || sub.includes("german") || sub.includes("de")) {
    return "de"
  }
  if (sub.includes("fransiz") || sub.includes("fransız") || sub.includes("french") || sub.includes("fr")) {
    return "fr"
  }
  if (sub.includes("rus") || sub.includes("russian")) {
    if (cyrillicCount > 0) return "ru"
  }

  return "az"
}

function getVoice(text: string, langOrContext?: string, requestedVoice?: string): string {
  if (requestedVoice) return requestedVoice
  const detectedLang = detectTextLanguage(text, langOrContext)
  if (detectedLang === "en") return "en-US-JennyNeural"
  if (detectedLang === "ru") return "ru-RU-SvetlanaNeural"
  if (detectedLang === "de") return "de-DE-KatjaNeural"
  if (detectedLang === "fr") return "fr-FR-DeniseNeural"
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
  let cleanText = rawText
    .replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, "")
    .replace(/\s+/g, " ")
    .trim()

  if (cleanText === ">") cleanText = "Böyükdür"
  else if (cleanText === "<") cleanText = "Kiçikdir"
  else if (cleanText === "=") cleanText = "Bərabərdir"
  else if (cleanText === "«+»" || cleanText === "+") cleanText = "Toplama işarəsi"
  else if (cleanText === "«-»" || cleanText === "-") cleanText = "Çıxma işarəsi"
  else if (cleanText === "«?»" || cleanText === "?") cleanText = "Sual işarəsi"
  else if (cleanText === "«!»" || cleanText === "!") cleanText = "Nida işarəsi"

  if (!cleanText) {
    return NextResponse.json({ error: "Səsləndirmək üçün mətn daxil edilməyib" }, { status: 400 })
  }

  // Maksimum 500 simvol həddi
  const truncatedText = cleanText.slice(0, 500)
  const voice = getVoice(truncatedText, lang, requestedVoice)

  // Keş qovluğu
  const cacheDir = getSafeWorkspacePath("public", "audio", "cache")
  if (!fs.existsSync(cacheDir)) {
    fs.mkdirSync(cacheDir, { recursive: true })
  }

  // Fayl adı üçün unikal heş
  const hash = crypto.createHash("md5").update(`${voice}__${truncatedText}`).digest("hex")
  const cacheFilePath = path.join(cacheDir, `${hash}.mp3`)
  const staticUrl = `/audio/cache/${hash}.mp3`

  // Əgər audio fayl artıq keşdə varsa, birbaşa audio məzmununu qaytar (307 redirect-siz, dərhal ifa üçün)
  if (fs.existsSync(cacheFilePath) && fs.statSync(cacheFilePath).size > 1000) {
    if (request.headers.get("accept")?.includes("application/json")) {
      return NextResponse.json({ success: true, audioUrl: staticUrl })
    }
    const fileBuffer = fs.readFileSync(cacheFilePath)
    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": String(fileBuffer.length),
        "Accept-Ranges": "bytes",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    })
  }

  // Əgər keşdə yoxdursa, edge-tts ilə yüksək keyfiyyətli MP3 yarat
  try {
    await new Promise<void>((resolve, reject) => {
      const synthScript = getSafeWorkspacePath("scripts", "synthesize.py")
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

    const fileBuffer = fs.readFileSync(cacheFilePath)
    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": String(fileBuffer.length),
        "Accept-Ranges": "bytes",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    })
  } catch (genError: any) {
    console.error("Audio generasiya xətası:", genError)
    return NextResponse.json({ error: "Səs faylı yaradılarkən xəta: " + genError.message }, { status: 500 })
  }
}
