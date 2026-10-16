export const dynamic = "force-dynamic"
import { NextResponse } from "next/server"

export async function GET() {
  const xaiKey = process.env.XAI_API_KEY
  const openaiKey = process.env.OPENAI_API_KEY

  const hasXaiKey = !!(xaiKey && xaiKey.startsWith("xai-"))
  const hasOpenAI = !!(openaiKey && openaiKey.startsWith("sk-"))
  const hasApiKeys = hasXaiKey || hasOpenAI

  return NextResponse.json({
    hasApiKeys,
    providers: {
      xai: hasXaiKey,
      openai: hasOpenAI,
    },
    mode: hasApiKeys ? "ai" : "standard",
    preferredProvider: hasOpenAI ? "openai" : hasXaiKey ? "xai" : "none",
    status: "ok",
  })
}
