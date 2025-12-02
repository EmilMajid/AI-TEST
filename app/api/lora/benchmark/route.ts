import { type NextRequest, NextResponse } from "next/server"
import { spawn } from "child_process"
import { existsSync, readFileSync } from "fs"
import { join } from "path"

interface BenchmarkRequest {
  version_id: string
  lora_path: string
  auto_activate_if_passed?: boolean
}

// GET: Get benchmark results
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const version_id = searchParams.get("version_id")

    if (!version_id) {
      // List all benchmark results
      const resultsDir = join(process.cwd(), "benchmark_results")

      if (!existsSync(resultsDir)) {
        return NextResponse.json({
          success: true,
          results: [],
        })
      }

      const { readdirSync } = await import("fs")
      const files = readdirSync(resultsDir)
        .filter((f) => f.endsWith(".json"))
        .map((f) => {
          const content = readFileSync(join(resultsDir, f), "utf-8")
          return JSON.parse(content)
        })
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

      return NextResponse.json({
        success: true,
        results: files,
      })
    }

    // Get specific version results
    const resultsDir = join(process.cwd(), "benchmark_results")
    const { readdirSync } = await import("fs")

    if (!existsSync(resultsDir)) {
      return NextResponse.json({
        success: false,
        error: "No benchmark results found",
      })
    }

    const files = readdirSync(resultsDir).filter((f) => f.startsWith(version_id) && f.endsWith(".json"))

    if (files.length === 0) {
      return NextResponse.json({
        success: false,
        error: "No benchmark results for this version",
      })
    }

    // Get most recent result
    const latestFile = files.sort().reverse()[0]
    const content = readFileSync(join(resultsDir, latestFile), "utf-8")
    const result = JSON.parse(content)

    return NextResponse.json({
      success: true,
      result,
    })
  } catch (error) {
    console.error("Get benchmark error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to get benchmark results",
      },
      { status: 500 },
    )
  }
}

// POST: Run benchmark
export async function POST(request: NextRequest) {
  try {
    const body: BenchmarkRequest = await request.json()
    const { version_id, lora_path, auto_activate_if_passed = false } = body

    if (!version_id || !lora_path) {
      return NextResponse.json(
        {
          success: false,
          error: "version_id and lora_path are required",
        },
        { status: 400 },
      )
    }

    // Check if LoRA path exists
    if (!existsSync(lora_path)) {
      return NextResponse.json(
        {
          success: false,
          error: `LoRA path not found: ${lora_path}`,
        },
        { status: 404 },
      )
    }

    // Run benchmark in background
    const pythonScript = join(process.cwd(), "scripts", "lora_model_benchmarker.py")

    return new Promise((resolve) => {
      const python = spawn("python3", [pythonScript, version_id, lora_path])

      let stdout = ""
      let stderr = ""

      python.stdout.on("data", (data) => {
        stdout += data.toString()
        console.log(data.toString())
      })

      python.stderr.on("data", (data) => {
        stderr += data.toString()
        console.error(data.toString())
      })

      python.on("close", async (code) => {
        if (code === 0) {
          // Read benchmark results
          const resultsDir = join(process.cwd(), "benchmark_results")
          const { readdirSync } = await import("fs")

          const files = readdirSync(resultsDir).filter((f) => f.startsWith(version_id) && f.endsWith(".json"))

          if (files.length > 0) {
            const latestFile = files.sort().reverse()[0]
            const content = readFileSync(join(resultsDir, latestFile), "utf-8")
            const result = JSON.parse(content)

            // Auto-activate if passed and requested
            if (auto_activate_if_passed && result.passed) {
              try {
                const activateResponse = await fetch(
                  `${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000"}/api/lora/versions`,
                  {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      action: "activate",
                      version_id,
                    }),
                  },
                )

                if (activateResponse.ok) {
                  result.auto_activated = true
                }
              } catch (e) {
                console.error("Auto-activate error:", e)
              }
            }

            resolve(
              NextResponse.json({
                success: true,
                result,
                stdout,
              }),
            )
          } else {
            resolve(
              NextResponse.json({
                success: false,
                error: "Benchmark completed but no results file found",
                stdout,
                stderr,
              }),
            )
          }
        } else {
          resolve(
            NextResponse.json(
              {
                success: false,
                error: `Benchmark failed with code ${code}`,
                stdout,
                stderr,
              },
              { status: 500 },
            ),
          )
        }
      })
    })
  } catch (error) {
    console.error("Benchmark error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Benchmark failed",
      },
      { status: 500 },
    )
  }
}
