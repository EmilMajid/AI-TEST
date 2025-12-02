"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CheckCircle, XCircle, Clock, TrendingUp, AlertTriangle, PlayCircle, History, BarChart3 } from "lucide-react"

interface BenchmarkResult {
  version_id: string
  timestamp: string
  overall_score: number
  passed: boolean
  question_validity: number
  answer_correctness: number
  format_compliance: number
  textbook_relevance: number
  difficulty_accuracy: number
  bloom_coverage: number
  azerbaijani_quality: number
  grammar_score: number
  avg_generation_time: number
  success_rate: number
  auto_activated?: boolean
}

interface ModelVersion {
  version_id: string
  name: string
  path: string
  active: boolean
}

export default function BenchmarkPage() {
  const [models, setModels] = useState<ModelVersion[]>([])
  const [results, setResults] = useState<BenchmarkResult[]>([])
  const [selectedModel, setSelectedModel] = useState<string>("")
  const [selectedResult, setSelectedResult] = useState<BenchmarkResult | null>(null)
  const [running, setRunning] = useState(false)
  const [autoActivate, setAutoActivate] = useState(true)
  const [logs, setLogs] = useState<string>("")

  useEffect(() => {
    loadModels()
    loadResults()
  }, [])

  const loadModels = async () => {
    try {
      const response = await fetch("/api/lora/versions")
      const data = await response.json()

      if (data.success) {
        setModels(data.models)
      }
    } catch (error) {
      console.error("Load models error:", error)
    }
  }

  const loadResults = async () => {
    try {
      const response = await fetch("/api/lora/benchmark")
      const data = await response.json()

      if (data.success) {
        setResults(data.results)
      }
    } catch (error) {
      console.error("Load results error:", error)
    }
  }

  const runBenchmark = async () => {
    if (!selectedModel) {
      alert("Model seçin")
      return
    }

    const model = models.find((m) => m.version_id === selectedModel)
    if (!model) return

    setRunning(true)
    setLogs("🚀 Benchmark başladı...\n")

    try {
      const response = await fetch("/api/lora/benchmark", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          version_id: model.version_id,
          lora_path: model.path,
          auto_activate_if_passed: autoActivate,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setLogs((prev) => prev + "\n✅ Benchmark tamamlandı!\n\n" + data.stdout)
        setSelectedResult(data.result)
        await loadResults()
      } else {
        setLogs((prev) => prev + "\n❌ Xəta: " + data.error + "\n\n" + data.stderr)
      }
    } catch (error) {
      setLogs((prev) => prev + "\n❌ Xəta: " + String(error))
    } finally {
      setRunning(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 0.85) return "text-green-600"
    if (score >= 0.75) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreBadge = (score: number, passed: boolean) => {
    if (passed) {
      return (
        <Badge variant="default" className="bg-green-600">
          <CheckCircle className="mr-1 h-3 w-3" />
          KEÇDİ
        </Badge>
      )
    }
    return (
      <Badge variant="destructive">
        <XCircle className="mr-1 h-3 w-3" />
        UĞURSUZ
      </Badge>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Model Benchmark Sistemi
          </h1>
          <p className="text-gray-600 mt-2">Avtomatik keyfiyyət testləri və qiymətləndirmə</p>
        </div>

        <Tabs defaultValue="run" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="run">
              <PlayCircle className="mr-2 h-4 w-4" />
              Benchmark İşə Sal
            </TabsTrigger>
            <TabsTrigger value="history">
              <History className="mr-2 h-4 w-4" />
              Tarixçə
            </TabsTrigger>
            <TabsTrigger value="details">
              <BarChart3 className="mr-2 h-4 w-4" />
              Ətraflı Təhlil
            </TabsTrigger>
          </TabsList>

          {/* Run Benchmark Tab */}
          <TabsContent value="run" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Yeni Benchmark</CardTitle>
                <CardDescription>Model seçin və keyfiyyət testlərini işə salın</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Model</label>
                  <Select value={selectedModel} onValueChange={setSelectedModel} disabled={running}>
                    <SelectTrigger>
                      <SelectValue placeholder="Model seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      {models.map((model) => (
                        <SelectItem key={model.version_id} value={model.version_id}>
                          {model.name} {model.active && "⭐"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="auto-activate"
                    checked={autoActivate}
                    onChange={(e) => setAutoActivate(e.target.checked)}
                    disabled={running}
                  />
                  <label htmlFor="auto-activate" className="text-sm">
                    Uğurlu olduqda avtomatik aktivləşdir
                  </label>
                </div>

                <Button onClick={runBenchmark} disabled={running || !selectedModel} className="w-full">
                  {running ? (
                    <>
                      <Clock className="mr-2 h-4 w-4 animate-spin" />
                      İşləyir...
                    </>
                  ) : (
                    <>
                      <PlayCircle className="mr-2 h-4 w-4" />
                      Benchmark Başlat
                    </>
                  )}
                </Button>

                {logs && (
                  <div className="mt-4">
                    <label className="text-sm font-medium">Logs</label>
                    <pre className="mt-2 p-4 bg-gray-900 text-green-400 rounded text-xs overflow-auto max-h-96 font-mono">
                      {logs}
                    </pre>
                  </div>
                )}
              </CardContent>
            </Card>

            {selectedResult && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Benchmark Nəticəsi</CardTitle>
                    {getScoreBadge(selectedResult.overall_score, selectedResult.passed)}
                  </div>
                  <CardDescription>{new Date(selectedResult.timestamp).toLocaleString("az-AZ")}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Overall Score */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Ümumi Xal</span>
                      <span className={`text-2xl font-bold ${getScoreColor(selectedResult.overall_score)}`}>
                        {(selectedResult.overall_score * 100).toFixed(1)}%
                      </span>
                    </div>
                    <Progress value={selectedResult.overall_score * 100} className="h-3" />
                  </div>

                  {/* Metrics Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <MetricCard label="Sual Düzgünlüyü" value={selectedResult.question_validity} threshold={0.85} />
                    <MetricCard label="Cavab Düzgünlüyü" value={selectedResult.answer_correctness} threshold={0.8} />
                    <MetricCard label="Format Uyğunluğu" value={selectedResult.format_compliance} threshold={0.9} />
                    <MetricCard label="Dərslik Uyğunluğu" value={selectedResult.textbook_relevance} threshold={0.8} />
                    <MetricCard label="Çətinlik Dəqiqliyi" value={selectedResult.difficulty_accuracy} threshold={0.7} />
                    <MetricCard label="Bloom Əhatəsi" value={selectedResult.bloom_coverage} threshold={0.6} />
                    <MetricCard label="Azərbaycan Dili" value={selectedResult.azerbaijani_quality} threshold={0.85} />
                    <MetricCard label="Qrammatika" value={selectedResult.grammar_score} threshold={0.8} />
                  </div>

                  {/* Performance */}
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                    <div>
                      <div className="text-sm text-gray-500">Orta Generasiya Vaxtı</div>
                      <div className="text-2xl font-bold">{selectedResult.avg_generation_time.toFixed(2)}s</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Uğur Faizi</div>
                      <div className="text-2xl font-bold">{(selectedResult.success_rate * 100).toFixed(0)}%</div>
                    </div>
                  </div>

                  {selectedResult.auto_activated && (
                    <Alert>
                      <CheckCircle className="h-4 w-4" />
                      <AlertDescription>
                        Model keyfiyyət testlərindən keçdi və avtomatik aktivləşdirildi! 🎉
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Benchmark Tarixçəsi</CardTitle>
                <CardDescription>{results.length} nəticə tapıldı</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Model</TableHead>
                      <TableHead>Tarix</TableHead>
                      <TableHead>Xal</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Vaxt</TableHead>
                      <TableHead>Uğur</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {results.map((result, idx) => (
                      <TableRow
                        key={idx}
                        className="cursor-pointer hover:bg-gray-50"
                        onClick={() => setSelectedResult(result)}
                      >
                        <TableCell className="font-medium">{result.version_id}</TableCell>
                        <TableCell>{new Date(result.timestamp).toLocaleDateString("az-AZ")}</TableCell>
                        <TableCell>
                          <span className={`font-bold ${getScoreColor(result.overall_score)}`}>
                            {(result.overall_score * 100).toFixed(0)}%
                          </span>
                        </TableCell>
                        <TableCell>{getScoreBadge(result.overall_score, result.passed)}</TableCell>
                        <TableCell>{result.avg_generation_time.toFixed(2)}s</TableCell>
                        <TableCell>{(result.success_rate * 100).toFixed(0)}%</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Details Tab */}
          <TabsContent value="details">
            {selectedResult ? (
              <Card>
                <CardHeader>
                  <CardTitle>Ətraflı Təhlil</CardTitle>
                  <CardDescription>{selectedResult.version_id}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Metrics Breakdown */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Keyfiyyət Metriklər</h3>
                      <div className="space-y-3">
                        <MetricBar label="Sual Düzgünlüyü" value={selectedResult.question_validity} threshold={0.85} />
                        <MetricBar label="Cavab Düzgünlüyü" value={selectedResult.answer_correctness} threshold={0.8} />
                        <MetricBar label="Format Uyğunluğu" value={selectedResult.format_compliance} threshold={0.9} />
                        <MetricBar
                          label="Dərslik Uyğunluğu"
                          value={selectedResult.textbook_relevance}
                          threshold={0.8}
                        />
                        <MetricBar
                          label="Çətinlik Dəqiqliyi"
                          value={selectedResult.difficulty_accuracy}
                          threshold={0.7}
                        />
                        <MetricBar label="Bloom Əhatəsi" value={selectedResult.bloom_coverage} threshold={0.6} />
                        <MetricBar
                          label="Azərbaycan Dili"
                          value={selectedResult.azerbaijani_quality}
                          threshold={0.85}
                        />
                        <MetricBar label="Qrammatika" value={selectedResult.grammar_score} threshold={0.8} />
                      </div>
                    </div>

                    {/* Performance Stats */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Performans Statistikası</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <Card>
                          <CardContent className="pt-6">
                            <div className="text-center">
                              <Clock className="mx-auto h-8 w-8 text-blue-600 mb-2" />
                              <div className="text-2xl font-bold">{selectedResult.avg_generation_time.toFixed(2)}s</div>
                              <div className="text-sm text-gray-500">Orta Generasiya Vaxtı</div>
                            </div>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="pt-6">
                            <div className="text-center">
                              <TrendingUp className="mx-auto h-8 w-8 text-green-600 mb-2" />
                              <div className="text-2xl font-bold">
                                {(selectedResult.success_rate * 100).toFixed(0)}%
                              </div>
                              <div className="text-sm text-gray-500">Uğur Faizi</div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>Benchmark nəticəsi seçin</AlertDescription>
              </Alert>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

function MetricCard({
  label,
  value,
  threshold,
}: {
  label: string
  value: number
  threshold: number
}) {
  const passed = value >= threshold
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="text-sm text-gray-500 mb-1">{label}</div>
        <div className={`text-2xl font-bold ${passed ? "text-green-600" : "text-red-600"}`}>
          {(value * 100).toFixed(0)}%
        </div>
        <div className="text-xs text-gray-400">Threshold: {(threshold * 100).toFixed(0)}%</div>
      </CardContent>
    </Card>
  )
}

function MetricBar({ label, value, threshold }: { label: string; value: number; threshold: number }) {
  const passed = value >= threshold
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-medium">{label}</span>
        <span className={`text-sm font-bold ${passed ? "text-green-600" : "text-red-600"}`}>
          {(value * 100).toFixed(1)}%
        </span>
      </div>
      <div className="relative">
        <Progress value={value * 100} className={`h-2 ${passed ? "bg-green-100" : "bg-red-100"}`} />
        <div
          className="absolute top-0 h-2 w-0.5 bg-gray-400"
          style={{ left: `${threshold * 100}%` }}
          title={`Threshold: ${(threshold * 100).toFixed(0)}%`}
        />
      </div>
    </div>
  )
}
