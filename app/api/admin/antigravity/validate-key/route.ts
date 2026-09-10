export const dynamic = "force-dynamic"
import { type NextRequest, NextResponse } from "next/server"
import { createGoogleGenerativeAI } from "@ai-sdk/google"
import { generateText } from "ai"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const apiKey = (body.apiKey || "").trim()
    const modelId = body.model || "gemini-1.5-pro-latest"
    const accountEmail = body.accountEmail || ""

    if (!apiKey) {
      return NextResponse.json({ success: false, error: "Antigravity / Gemini API açarı daxil edilməlidir" }, { status: 400 })
    }

    // Ping Antigravity / Gemini AI Engine
    const googleProvider = createGoogleGenerativeAI({ apiKey })
    const { text } = await generateText({
      model: googleProvider(modelId),
      prompt: "Salam! Qısa cavab ver: Antigravity sistemi aktivdirmi?",
    })

    return NextResponse.json({
      success: true,
      model: modelId,
      accountEmail,
      responsePreview: text.trim(),
      message: `Antigravity hesabı uğurla təsdiqləndi! 🤖 Model: ${modelId}`,
    })
  } catch (err: any) {
    console.error("[Antigravity Key Validation Error]:", err)
    return NextResponse.json({
      success: false,
      error: err?.message || "Antigravity API açarı etibarsızdır və ya kvota tükənib",
    }, { status: 400 })
  }
}
