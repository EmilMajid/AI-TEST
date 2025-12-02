import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { apiKey } = await request.json()

    if (!apiKey || !apiKey.startsWith("xai-")) {
      return NextResponse.json({ valid: false, error: "Invalid API key format" })
    }

    // Test API key with a simple request
    const response = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        messages: [{ role: "user", content: "Test" }],
        model: "grok-3",
        max_tokens: 5,
      }),
    })

    const valid = response.status === 200 || response.status === 400 // 400 might be rate limit but key is valid

    return NextResponse.json({ valid })
  } catch (error) {
    console.error("API key validation error:", error)
    return NextResponse.json({ valid: false, error: "Validation failed" })
  }
}
