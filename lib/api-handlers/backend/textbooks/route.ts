export const dynamic = "force-dynamic"
import { type NextRequest, NextResponse } from "next/server"

const BACKEND_URL_RAW = process.env.NEXT_PUBLIC_BACKEND_URL || ""
const BACKEND_URL = BACKEND_URL_RAW.replace(/\/$/, "") // sondakı / sil

//  ⏱️ 5 saniyəlik timeout
const TIMEOUT_MS = 5000

const fallbackTextbooks = [
  {
    id: 1,
    name: "Azərbaycan dili",
    subject: "Azərbaycan dili",
    class: "7",
    file_path: "",
    topics: ["Fel", "Felin zamanları", "Felin şəxs və ədəd formaları", "Zərf"],
    upload_date: new Date().toISOString(),
  },
  {
    id: 2,
    name: "Riyaziyyat",
    subject: "Riyaziyyat",
    class: "7",
    file_path: "",
    topics: ["Cəbri ifadələr", "Tənliklər sistemi", "Funksiya", "Həndəsə"],
    upload_date: new Date().toISOString(),
  },
  {
    id: 3,
    name: "Fizika 7 (1-ci hissə)",
    subject: "Fizika",
    class: "7",
    file_path: "static/uploads/Fizika-7-1-ci-hisse.zip",
    topics: ["Mexanika", "Qüvvə və hərəkət", "İş və enerji", "Sadə mexanizmlər", "Təzyiq", "Arximed qanunu"],
    upload_date: new Date().toISOString(),
  },
]

export async function GET(req: NextRequest) {
  // Backend URL təyin edilməyibsə – birbaşa fallback qaytar
  if (!BACKEND_URL) {
    return NextResponse.json({ success: true, textbooks: fallbackTextbooks })
  }

  const qs = req.nextUrl.search
  const url = `${BACKEND_URL}/api/textbooks${qs}`

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS)

  try {
    const res = await fetch(url, {
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
      signal: controller.signal,
    })

    clearTimeout(timeout)

    // Backend uğurla cavab verdisə – yalnız JSON qaytarsa parse et
    if (res.ok) {
      const contentType = res.headers.get("content-type") || ""

      // Yalnız application/json olduqda parse et
      if (contentType.includes("application/json")) {
        try {
          const data = await res.json()
          return NextResponse.json(data, { status: res.status })
        } catch (jsonErr) {
          console.warn("Backend JSON parse xətası:", jsonErr)
          // Parse xətası → fallback
          return NextResponse.json({ success: true, textbooks: fallbackTextbooks })
        }
      }

      // Backend cavab JSON deyil → fallback (warning only)
      console.warn("Backend non-JSON response (content-type:", contentType, ")")
      return NextResponse.json({ success: true, textbooks: fallbackTextbooks })
    }

    // Backend HTTP error → fallback
    console.warn("Proxy backend HTTP error:", res.status)
    return NextResponse.json({ success: true, textbooks: fallbackTextbooks })
  } catch (err) {
    clearTimeout(timeout)
    console.warn("Proxy textbooks fetch failed. Using demo data.", err)
    return NextResponse.json({ success: true, textbooks: fallbackTextbooks })
  }
}
