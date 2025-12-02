import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { apiKey } = await request.json()

    if (!apiKey || !apiKey.startsWith("sk-")) {
      return NextResponse.json({ valid: false, error: "Invalid API key format" })
    }

    // Test API key with a simple request
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [{ role: "user", content: "Test" }],
        max_tokens: 5,
      }),
    })

    const valid = response.status === 200 || response.status === 400 // 400 might be rate limit but key is valid

    if (!valid) {
      const errorText = await response.text()
      console.error("OpenAI API validation error:", response.status, errorText)
    }

    return NextResponse.json({
      valid,
      status: response.status,
      provider: "openai",
    })
  } catch (error) {
    console.error("OpenAI API key validation error:", error)
    return NextResponse.json({ valid: false, error: "Validation failed" })
  }
}
