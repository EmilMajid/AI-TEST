import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { config } = body

    // Trigger LoRA training
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000"

    const response = await fetch(`${backendUrl}/api/lora/train`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        base_model: config.baseModel || "meta-llama/Meta-Llama-3-8B-Instruct",
        output_dir: config.outputDir || "lora_models/testai_v1",
        data_dir: config.dataDir || "training_data",
        lora_r: config.loraR || 64,
        lora_alpha: config.loraAlpha || 128,
        num_epochs: config.numEpochs || 3,
        batch_size: config.batchSize || 4,
        learning_rate: config.learningRate || 0.0002,
      }),
    })

    if (!response.ok) {
      throw new Error("Training failed")
    }

    const data = await response.json()

    return NextResponse.json({
      success: true,
      message: "LoRA training started successfully",
      trainingId: data.training_id,
      status: data.status,
    })
  } catch (error) {
    console.error("LoRA training error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Training failed",
      },
      { status: 500 },
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const trainingId = searchParams.get("trainingId")

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000"

    const response = await fetch(`${backendUrl}/api/lora/train/status?training_id=${trainingId}`)

    if (!response.ok) {
      throw new Error("Failed to get training status")
    }

    const data = await response.json()

    return NextResponse.json({
      success: true,
      status: data.status,
      progress: data.progress,
      metrics: data.metrics,
      currentEpoch: data.current_epoch,
      totalEpochs: data.total_epochs,
    })
  } catch (error) {
    console.error("Status check error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Status check failed",
      },
      { status: 500 },
    )
  }
}
