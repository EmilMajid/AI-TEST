export const dynamic = "force-dynamic"
import { type NextRequest, NextResponse } from "next/server"
import { existsSync, readFileSync, writeFileSync } from "fs"
import { join } from "path"

const REGISTRY_PATH = join(process.cwd(), "lora_models", "registry.json")

interface ModelVersion {
  version_id: string
  name: string
  description: string
  path: string
  hash: string
  created_at: string
  training_config: Record<string, any>
  metrics: Record<string, number>
  tags: string[]
  status: string
  downloads: number
  active: boolean
}

interface Registry {
  models: Record<string, ModelVersion>
  active_model: string | null
  version_counter: number
}

function loadRegistry(): Registry {
  if (!existsSync(REGISTRY_PATH)) {
    return {
      models: {},
      active_model: null,
      version_counter: 0,
    }
  }

  const data = readFileSync(REGISTRY_PATH, "utf-8")
  return JSON.parse(data)
}

function saveRegistry(registry: Registry) {
  writeFileSync(REGISTRY_PATH, JSON.stringify(registry, null, 2))
}

// GET: List all model versions
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const tags = searchParams.get("tags")?.split(",").filter(Boolean)
    const sortBy = searchParams.get("sortBy") || "created_at"
    const order = searchParams.get("order") || "desc"

    const registry = loadRegistry()
    let models = Object.values(registry.models)

    // Filter by tags
    if (tags && tags.length > 0) {
      models = models.filter((model) => tags.some((tag) => model.tags.includes(tag)))
    }

    // Sort models
    models.sort((a, b) => {
      let aVal: any = a[sortBy as keyof ModelVersion]
      let bVal: any = b[sortBy as keyof ModelVersion]

      if (sortBy === "created_at") {
        aVal = new Date(aVal).getTime()
        bVal = new Date(bVal).getTime()
      }

      if (order === "desc") {
        return bVal > aVal ? 1 : -1
      }
      return aVal > bVal ? 1 : -1
    })

    return NextResponse.json({
      success: true,
      models,
      total: models.length,
      active_model: registry.active_model,
    })
  } catch (error) {
    console.error("List versions error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to list versions",
      },
      { status: 500 },
    )
  }
}

// POST: Activate a model version
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, version_id, data } = body

    const registry = loadRegistry()

    if (action === "activate") {
      if (!registry.models[version_id]) {
        return NextResponse.json(
          {
            success: false,
            error: "Model not found",
          },
          { status: 404 },
        )
      }

      // Deactivate previous
      if (registry.active_model) {
        registry.models[registry.active_model].active = false
      }

      // Activate new
      registry.active_model = version_id
      registry.models[version_id].active = true

      saveRegistry(registry)

      return NextResponse.json({
        success: true,
        message: "Model activated successfully",
        active_model: registry.models[version_id],
      })
    } else if (action === "update_metrics") {
      if (!registry.models[version_id]) {
        return NextResponse.json(
          {
            success: false,
            error: "Model not found",
          },
          { status: 404 },
        )
      }

      registry.models[version_id].metrics = {
        ...registry.models[version_id].metrics,
        ...data.metrics,
      }

      saveRegistry(registry)

      return NextResponse.json({
        success: true,
        message: "Metrics updated successfully",
        model: registry.models[version_id],
      })
    } else if (action === "add_tags") {
      if (!registry.models[version_id]) {
        return NextResponse.json(
          {
            success: false,
            error: "Model not found",
          },
          { status: 404 },
        )
      }

      const currentTags = new Set(registry.models[version_id].tags)
      data.tags.forEach((tag: string) => currentTags.add(tag))
      registry.models[version_id].tags = Array.from(currentTags)

      saveRegistry(registry)

      return NextResponse.json({
        success: true,
        message: "Tags added successfully",
        model: registry.models[version_id],
      })
    } else if (action === "compare") {
      const { version_ids } = data
      const models = version_ids
        .map((id: string) => registry.models[id])
        .filter(Boolean)
        .map((model: ModelVersion) => ({
          version_id: model.version_id,
          name: model.name,
          created_at: model.created_at,
          metrics: model.metrics,
          training_config: model.training_config,
        }))

      // Compare metrics
      const allMetrics = new Set<string>()
      models.forEach((model: any) => {
        Object.keys(model.metrics).forEach((metric) => allMetrics.add(metric))
      })

      const metricsComparison: Record<string, any[]> = {}
      allMetrics.forEach((metric) => {
        metricsComparison[metric] = models.map((model: any) => model.metrics[metric] || null)
      })

      return NextResponse.json({
        success: true,
        comparison: {
          models,
          metrics_comparison: metricsComparison,
        },
      })
    }

    return NextResponse.json(
      {
        success: false,
        error: "Invalid action",
      },
      { status: 400 },
    )
  } catch (error) {
    console.error("Version action error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Action failed",
      },
      { status: 500 },
    )
  }
}

// DELETE: Delete a model version
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const version_id = searchParams.get("version_id")
    const force = searchParams.get("force") === "true"

    if (!version_id) {
      return NextResponse.json(
        {
          success: false,
          error: "version_id is required",
        },
        { status: 400 },
      )
    }

    const registry = loadRegistry()

    if (!registry.models[version_id]) {
      return NextResponse.json(
        {
          success: false,
          error: "Model not found",
        },
        { status: 404 },
      )
    }

    // Check if active
    if (registry.models[version_id].active && !force) {
      return NextResponse.json(
        {
          success: false,
          error: "Cannot delete active model. Use force=true to override.",
        },
        { status: 400 },
      )
    }

    // Delete from registry
    delete registry.models[version_id]

    // Clear active if deleted
    if (registry.active_model === version_id) {
      registry.active_model = null
    }

    saveRegistry(registry)

    return NextResponse.json({
      success: true,
      message: "Model deleted successfully",
    })
  } catch (error) {
    console.error("Delete version error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Delete failed",
      },
      { status: 500 },
    )
  }
}
