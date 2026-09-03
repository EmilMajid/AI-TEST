"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Brain, Zap, TrendingUp, AlertCircle, CheckCircle, Loader2 } from "lucide-react"

interface TrainingConfig {
  baseModel: string
  outputDir: string
  dataDir: string
  loraR: number
  loraAlpha: number
  numEpochs: number
  batchSize: number
  learningRate: number
}

interface TrainingStatus {
  status: "idle" | "preparing" | "training" | "completed" | "failed"
  progress: number
  currentEpoch: number
  totalEpochs: number
  metrics?: {
    loss: number
    eval_loss: number
    learning_rate: number
  }
}

export default function LoRATrainingPage() {
  const [config, setConfig] = useState<TrainingConfig>({
    baseModel: "meta-llama/Meta-Llama-3-8B-Instruct",
    outputDir: "lora_models/testai_v1",
    dataDir: "training_data",
    loraR: 64,
    loraAlpha: 128,
    numEpochs: 3,
    batchSize: 4,
    learningRate: 0.0002,
  })

  const [trainingStatus, setTrainingStatus] = useState<TrainingStatus>({
    status: "idle",
    progress: 0,
    currentEpoch: 0,
    totalEpochs: 0,
  })

  const [trainingId, setTrainingId] = useState<string | null>(null)
  const [isTraining, setIsTraining] = useState(false)

  // Poll training status
  useEffect(() => {
    if (!trainingId || trainingStatus.status === "completed" || trainingStatus.status === "failed") {
      return
    }

    const interval = setInterval(async () => {
      try {
        const response = await fetch(`/api/lora/train?trainingId=${trainingId}`)
        const data = await response.json()

        if (data.success) {
          setTrainingStatus({
            status: data.status,
            progress: data.progress,
            currentEpoch: data.currentEpoch,
            totalEpochs: data.totalEpochs,
            metrics: data.metrics,
          })

          if (data.status === "completed" || data.status === "failed") {
            setIsTraining(false)
          }
        }
      } catch (error) {
        console.error("Status check error:", error)
      }
    }, 5000) // Check every 5 seconds

    return () => clearInterval(interval)
  }, [trainingId, trainingStatus.status])

  const startTraining = async () => {
    try {
      setIsTraining(true)
      setTrainingStatus({ status: "preparing", progress: 0, currentEpoch: 0, totalEpochs: config.numEpochs })

      const response = await fetch("/api/lora/train", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ config }),
      })

      const data = await response.json()

      if (data.success) {
        setTrainingId(data.trainingId)
        setTrainingStatus({ ...trainingStatus, status: "training" })
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      console.error("Training start error:", error)
      setTrainingStatus({ ...trainingStatus, status: "failed" })
      setIsTraining(false)
    }
  }

  const getStatusColor = () => {
    switch (trainingStatus.status) {
      case "completed":
        return "text-green-600"
      case "failed":
        return "text-red-600"
      case "training":
        return "text-blue-600"
      case "preparing":
        return "text-yellow-600"
      default:
        return "text-gray-600"
    }
  }

  const getStatusIcon = () => {
    switch (trainingStatus.status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case "failed":
        return <AlertCircle className="h-5 w-5 text-red-600" />
      case "training":
      case "preparing":
        return <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />
      default:
        return <Brain className="h-5 w-5 text-gray-600" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <Brain className="h-10 w-10 text-blue-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              LoRA Fine-Tuning
            </h1>
          </div>
          <p className="text-gray-600">Dərslik məlumatları ilə Language Model-i təkmilləşdirin</p>
        </div>

        {/* Training Status Alert */}
        {trainingStatus.status !== "idle" && (
          <Alert className="border-2">
            <div className="flex items-center gap-2">
              {getStatusIcon()}
              <div className="flex-1">
                <AlertDescription className={`font-semibold ${getStatusColor()}`}>
                  {trainingStatus.status === "preparing" && "Model hazırlanır..."}
                  {trainingStatus.status === "training" &&
                    `Training davam edir... (Epoch ${trainingStatus.currentEpoch}/${trainingStatus.totalEpochs})`}
                  {trainingStatus.status === "completed" && "✅ Training uğurla tamamlandı!"}
                  {trainingStatus.status === "failed" && "❌ Training uğursuz oldu"}
                </AlertDescription>
                {trainingStatus.status === "training" && (
                  <div className="mt-2 space-y-1">
                    <Progress value={trainingStatus.progress} className="h-2" />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>{trainingStatus.progress.toFixed(1)}% tamamlandı</span>
                      {trainingStatus.metrics && <span>Loss: {trainingStatus.metrics.loss.toFixed(4)}</span>}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Alert>
        )}

        <Tabs defaultValue="config" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="config">Konfigurasiya</TabsTrigger>
            <TabsTrigger value="metrics">Metrikalar</TabsTrigger>
            <TabsTrigger value="info">İnformasiya</TabsTrigger>
          </TabsList>

          {/* Configuration Tab */}
          <TabsContent value="config" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Training Konfiqurasiyası</CardTitle>
                <CardDescription>LoRA fine-tuning parametrlərini təyin edin</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="baseModel">Base Model</Label>
                    <Input
                      id="baseModel"
                      value={config.baseModel}
                      onChange={(e) => setConfig({ ...config, baseModel: e.target.value })}
                      disabled={isTraining}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="outputDir">Output Directory</Label>
                    <Input
                      id="outputDir"
                      value={config.outputDir}
                      onChange={(e) => setConfig({ ...config, outputDir: e.target.value })}
                      disabled={isTraining}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="loraR">LoRA R (Rank)</Label>
                    <Input
                      id="loraR"
                      type="number"
                      value={config.loraR}
                      onChange={(e) => setConfig({ ...config, loraR: Number.parseInt(e.target.value) })}
                      disabled={isTraining}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="loraAlpha">LoRA Alpha</Label>
                    <Input
                      id="loraAlpha"
                      type="number"
                      value={config.loraAlpha}
                      onChange={(e) => setConfig({ ...config, loraAlpha: Number.parseInt(e.target.value) })}
                      disabled={isTraining}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="numEpochs">Epochs</Label>
                    <Input
                      id="numEpochs"
                      type="number"
                      value={config.numEpochs}
                      onChange={(e) => setConfig({ ...config, numEpochs: Number.parseInt(e.target.value) })}
                      disabled={isTraining}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="batchSize">Batch Size</Label>
                    <Input
                      id="batchSize"
                      type="number"
                      value={config.batchSize}
                      onChange={(e) => setConfig({ ...config, batchSize: Number.parseInt(e.target.value) })}
                      disabled={isTraining}
                    />
                  </div>
                </div>

                <Button onClick={startTraining} disabled={isTraining} className="w-full" size="lg">
                  {isTraining ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Training davam edir...
                    </>
                  ) : (
                    <>
                      <Zap className="mr-2 h-4 w-4" />
                      Training-ə başla
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Metrics Tab */}
          <TabsContent value="metrics" className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Training Loss</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{trainingStatus.metrics?.loss.toFixed(4) || "N/A"}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Eval Loss</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{trainingStatus.metrics?.eval_loss.toFixed(4) || "N/A"}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Learning Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {trainingStatus.metrics?.learning_rate.toExponential(2) || "N/A"}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Info Tab */}
          <TabsContent value="info" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>LoRA Fine-Tuning haqqında</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h3 className="font-semibold flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    LoRA nədir?
                  </h3>
                  <p className="text-sm text-gray-600">
                    LoRA (Low-Rank Adaptation) böyük dil modellərini səmərəli şəkildə fine-tune etmək üçün istifadə
                    olunan texnikadır. Bütün model parametrlərini yeniləmək əvəzinə, yalnız kiçik adapter layerlər əlavə
                    edir və onları train edir.
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold">Üstünlüklər:</h3>
                  <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                    <li>99% az parametr (64 milyondan 4 milyona)</li>
                    <li>Daha az GPU memory tələbi</li>
                    <li>Daha sürətli training</li>
                    <li>Model performansında minimal itki</li>
                    <li>Çoxlu task-lar üçün adapter switching</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold">Parametr İzahları:</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex gap-2">
                      <Badge>R (Rank)</Badge>
                      <span className="text-gray-600">Adapter-in ölçüsü (32-128 arası tövsiyə olunur)</span>
                    </div>
                    <div className="flex gap-2">
                      <Badge>Alpha</Badge>
                      <span className="text-gray-600">Scaling faktor (adətən R-in 2 qatı)</span>
                    </div>
                    <div className="flex gap-2">
                      <Badge>Epochs</Badge>
                      <span className="text-gray-600">Training iterasiyaları (3-5 arası kifayətdir)</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
