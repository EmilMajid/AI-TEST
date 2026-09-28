export const dynamic = "force-dynamic"
import { type NextRequest, NextResponse } from "next/server"
import { spawn } from "child_process"
import { join } from "path"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const metric = searchParams.get("metric")
    const command = searchParams.get("command") || "export"

    return new Promise((resolve) => {
      const args = [join(process.cwd(), "scripts", "wandb_integration.py"), command]

      if (command === "best" && metric) {
        args.push("--metric", metric)
      }

      const python = spawn("python3", args)

      let stdout = ""
      let stderr = ""

      python.stdout.on("data", (data) => {
        stdout += data.toString()
      })

      python.stderr.on("data", (data) => {
        stderr += data.toString()
      })

      python.on("close", (code) => {
        if (code === 0) {
          try {
            // Try to parse JSON output
            const data = JSON.parse(stdout)
            resolve(NextResponse.json({ success: true, data }))
          } catch {
            resolve(NextResponse.json({ success: true, output: stdout }))
          }
        } else {
          resolve(
            NextResponse.json(
              {
                success: false,
                error: stderr || "Command failed",
              },
              { status: 500 },
            ),
          )
        }
      })
    })
  } catch (error) {
    console.error("W&B API error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch runs",
      },
      { status: 500 },
    )
  }
}
