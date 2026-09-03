export const dynamic = "force-dynamic"
import { type NextRequest, NextResponse } from "next/server"
import { exec } from "child_process"
import { promisify } from "util"
import fs from "fs/promises"

const execAsync = promisify(exec)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, ...params } = body

    if (action === "log") {
      const { modelVersion, requestId, region, ipAddress, accuracy, inferenceTime, modelSize } = params

      let cmd = `python3 scripts/regional_metrics_collector.py log \
        --model-version "${modelVersion}" \
        --request-id "${requestId}" \
        --time ${inferenceTime}`

      if (region) cmd += ` --region "${region}"`
      if (ipAddress) cmd += ` --ip "${ipAddress}"`
      if (accuracy) cmd += ` --accuracy ${accuracy}`
      if (modelSize) cmd += ` --size ${modelSize}`

      await execAsync(cmd)

      return NextResponse.json({
        success: true,
        message: "Regional metric logged successfully",
      })
    }

    if (action === "summary") {
      const { stdout } = await execAsync("python3 scripts/regional_metrics_collector.py summary")

      return NextResponse.json({
        success: true,
        output: stdout,
      })
    }

    if (action === "compare") {
      const { metric = "accuracy", hours = 24 } = params

      const { stdout } = await execAsync(
        `python3 scripts/regional_metrics_collector.py compare --metric ${metric} --hours ${hours}`,
      )

      return NextResponse.json({
        success: true,
        output: stdout,
      })
    }

    if (action === "disparities") {
      const { hours = 24, threshold = 0.1 } = params

      const { stdout } = await execAsync(
        `python3 scripts/regional_metrics_collector.py disparities --hours ${hours} --threshold ${threshold}`,
      )

      return NextResponse.json({
        success: true,
        output: stdout,
      })
    }

    if (action === "weights") {
      const { stdout } = await execAsync("python3 scripts/regional_metrics_collector.py weights")

      return NextResponse.json({
        success: true,
        output: stdout,
      })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error: any) {
    console.error("Regional metrics error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const action = searchParams.get("action") || "summary"

    if (action === "summary") {
      try {
        const data = await fs.readFile("regional_metrics/regional_summary.json", "utf-8")
        const summary = JSON.parse(data)
        return NextResponse.json(summary)
      } catch {
        return NextResponse.json({
          regions: {},
          comparison: {},
          disparities: { has_disparities: false, disparities: [] },
        })
      }
    }

    if (action === "weights") {
      const { stdout } = await execAsync("python3 scripts/regional_metrics_collector.py weights")

      const weights: Record<string, any> = {}
      const lines = stdout.split("\n")
      let currentRegion = ""

      for (const line of lines) {
        if (line.includes("(") && line.includes("):")) {
          const match = line.match(/(.+?)\s+$$(.+?)$$:/)
          if (match) {
            currentRegion = match[2]
            weights[currentRegion] = {}
          }
        } else if (line.includes(":") && currentRegion) {
          const match = line.trim().match(/(.+?):\s+(.+?)%/)
          if (match) {
            const metric = match[1]
            const value = Number.parseFloat(match[2]) / 100
            weights[currentRegion][metric] = value
          }
        }
      }

      return NextResponse.json(weights)
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error: any) {
    console.error("Regional metrics GET error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
