export const dynamic = "force-dynamic"
import { NextResponse } from "next/server"

export async function GET() {
  // API key-ləri düzgün formatda yoxla
  const xaiKey = process.env.XAI_API_KEY
  const openaiKey = process.env.OPENAI_API_KEY

  const hasXaiKey = !!(xaiKey && xaiKey.startsWith("xai-"))
  const hasOpenAI = !!(openaiKey && openaiKey.startsWith("sk-"))
  const hasApiKeys = hasXaiKey || hasOpenAI

  // Key formatlarını yoxla
  const xaiKeyFormat = xaiKey ? (xaiKey.startsWith("xai-") ? "correct" : "incorrect") : "missing"
  const openaiKeyFormat = openaiKey ? (openaiKey.startsWith("sk-") ? "correct" : "incorrect") : "missing"

  // Real OpenAI key olub-olmadığını yoxla
  const isRealOpenAI = openaiKey && openaiKey.startsWith("sk-proj-")

  // Güvenli prefix-lər (ilk 20 simvol + ...)
  const xaiPrefix = xaiKey ? xaiKey.substring(0, 8) + "..." : "Not set"
  const openaiPrefix = openaiKey ? openaiKey.substring(0, 20) + "..." : "Not set"

  return NextResponse.json({
    hasApiKeys,
    providers: {
      xai: hasXaiKey,
      openai: hasOpenAI,
    },
    mode: hasApiKeys ? "ai" : "demo",
    debug: {
      xaiKeyPrefix: xaiPrefix,
      openaiPrefix: openaiPrefix,
      xaiKeyFormat,
      openaiKeyFormat,
      isRealOpenAI,
    },
    preferredProvider: hasOpenAI ? "openai" : hasXaiKey ? "xai" : "none",
    warnings: [
      ...(xaiKey && !hasXaiKey ? ["xAI API key düzgün formatda deyil (xai- ilə başlamalıdır)"] : []),
      ...(openaiKey && !hasOpenAI ? ["OpenAI API key düzgün formatda deyil (sk- ilə başlamalıdır)"] : []),
    ],
    features: {
      realOpenAI: isRealOpenAI,
      premium: isRealOpenAI || hasXaiKey,
    },
  })
}
