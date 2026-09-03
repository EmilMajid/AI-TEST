import { type NextRequest, NextResponse } from "next/server"
import { writeFileSync } from "fs"
import { join } from "path"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { api_key, entity, project } = body

    if (!api_key) {
      return NextResponse.json(
        {
          success: false,
          error: "API key is required",
        },
        { status: 400 },
      )
    }

    // Save to .env file
    const envPath = join(process.cwd(), ".env.local")
    const envContent = `WANDB_API_KEY=${api_key}
${entity ? `WANDB_ENTITY=${entity}` : ""}
${project ? `WANDB_PROJECT=${project}` : "WANDB_PROJECT=testai-az"}
`

    writeFileSync(envPath, envContent, { flag: "a" })

    return NextResponse.json({
      success: true,
      message: "W&B configured successfully",
    })
  } catch (error) {
    console.error("Setup error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Setup failed",
      },
      { status: 500 },
    )
  }
}
