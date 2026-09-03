export const dynamic = "force-dynamic"
import { type NextRequest, NextResponse } from "next/server"
import { exec } from "child_process"
import { promisify } from "util"

const execAsync = promisify(exec)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, ...params } = body

    if (action === "log") {
      const { modelVersion, requestId, accuracy, inferenceTime, modelSize } = params

      const cmd = `python3 scripts/production_metrics_collector.py log \
        --model-version "${modelVersion}" \
        --request-id "${requestId}" \
        --time ${inferenceTime} \
        ${accuracy ? `--accuracy ${accuracy}` : ""} \
        ${modelSize ? `--size ${modelSize}` : ""}`

      await execAsync(cmd)

      return NextResponse.json({
        success: true,
        message: "Metric logged successfully",
      })
    }

    if (action === "summary") {
      const { stdout } = await execAsync("python3 scripts/production_metrics_collector.py summary")

      return NextResponse.json({
        success: true,
        output: stdout,
      })
    }

    if (action === "adjust") {
      const { baselineHours = 168 } = params

      const { stdout } = await execAsync(
        `python3 scripts/production_metrics_collector.py adjust --baseline-hours ${baselineHours}`,
      )

      return NextResponse.json({
        success: true,
        output: stdout,
      })
    }

    if (action === "check") {
      const { stdout } = await execAsync("python3 scripts/production_metrics_collector.py check")

      return NextResponse.json({
        success: true,
        output: stdout,
      })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error: any) {
    console.error("Production metrics error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const action = searchParams.get("action") || "summary"

    if (action === "weights") {
      const fs = require("fs").promises
      const weightsFile = "adaptive_weights.json"

      try {
        const data = await fs.readFile(weightsFile, "utf-8")
        const weights = JSON.parse(data)
        return NextResponse.json(weights)
      } catch {
        return NextResponse.json({
          current: {
            accuracy: 0.5,
            speed: 0.3,
            model_size: 0.2,
          },
          history: [],
        })
      }
    }

    if (action === "summary") {
      const fs = require("fs").promises
      const summaryFile = "production_metrics/summary.json"

      try {
        const data = await fs.readFile(summaryFile, "utf-8")
        const summary = JSON.parse(data)
        return NextResponse.json(summary)
      } catch {
        return NextResponse.json({
          last_24h: { count: 0 },
          last_7d: { count: 0 },
        })
      }
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error: any) {
    console.error("Production metrics GET error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
