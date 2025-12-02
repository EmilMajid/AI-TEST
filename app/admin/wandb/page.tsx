"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { BarChart, LineChart, Activity, Settings, ExternalLink, TrendingUp, Award } from "lucide-react"
import { checkWandBConfiguration } from "./actions"

export default function WandBPage() {
  const [apiKey, setApiKey] = useState("")
  const [entity, setEntity] = useState("")
  const [project, setProject] = useState("edutest-ai")
  const [configured, setConfigured] = useState(false)
  const [loading, setLoading] = useState(false)
  const [runs, setRuns] = useState<any[]>([])
  const [bestModel, setBestModel] = useState<any>(null)

  useEffect(() => {
    checkConfiguration()
    if (configured) {
      loadRuns()
      loadBestModel()
    }
  }, [configured])

  const checkConfiguration = async () => {
    const hasKey = await checkWandBConfiguration()
    setConfigured(hasKey || !!localStorage.getItem("wandb_configured"))
  }

  const setupWandB = async () => {
    if (!apiKey) {
      alert("API açarı daxil edin")
      return
    }

    setLoading(true)

    try {
      const response = await fetch("/api/wandb/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ api_key: apiKey, entity, project }),
      })

      const data = await response.json()

      if (data.success) {
        localStorage.setItem("wandb_configured", "true")
        setConfigured(true)
        alert("✅ W&B konfiqurasiya edildi!")
      } else {
        alert("❌ Xəta: " + data.error)
      }
    } catch (error) {
      alert("❌ Xəta: " + String(error))
    } finally {
      setLoading(false)
    }
  }

  const loadRuns = async () => {
    try {
      const response = await fetch("/api/wandb/runs?command=export")
      const data = await response.json()

      if (data.success && data.data) {
        setRuns(data.data)
      }
    } catch (error) {
      console.error("Load runs error:", error)
    }
  }

  const loadBestModel = async () => {
    try {
      const response = await fetch("/api/wandb/runs?command=best&metric=benchmark/overall_score")
      const data = await response.json()

      if (data.success) {
        // Parse output to extract best model info
        const output = data.output
        const lines = output.split("\n")

        const nameMatch = lines.find((l: string) => l.includes("Best Model:"))
        const scoreMatch = lines.find((l: string) => l.includes("Score:"))
        const urlMatch = lines.find((l: string) => l.includes("URL:"))

        if (nameMatch && scoreMatch && urlMatch) {
          setBestModel({
            name: nameMatch.split(":")[1].trim(),
            score: scoreMatch.split(":")[1].trim(),
            url: urlMatch.split("URL:")[1].trim(),
          })
        }
      }
    } catch (error) {
      console.error("Load best model error:", error)
    }
  }

  if (!configured) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-6 w-6" />
                Weights & Biases Konfiqurasiyası
              </CardTitle>
              <CardDescription>Experiment tracking sistemini quraşdırın</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <Activity className="h-4 w-4" />
                <AlertDescription>
                  W&B hesabınız yoxdursa,{" "}
                  <a href="https://wandb.ai/signup" target="_blank" className="underline" rel="noreferrer">
                    wandb.ai/signup
                  </a>{" "}
                  ünvanından yarada bilərsiniz
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <label className="text-sm font-medium">API Key *</label>
                <Input
                  type="password"
                  placeholder="W&B API açarınızı daxil edin"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                />
                <p className="text-xs text-gray-500">
                  API açarınızı{" "}
                  <a href="https://wandb.ai/authorize" target="_blank" className="underline" rel="noreferrer">
                    wandb.ai/authorize
                  </a>{" "}
                  səhifəsindən əldə edə bilərsiniz
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Entity (İstəyə bağlı)</label>
                <Input
                  placeholder="Username və ya team name"
                  value={entity}
                  onChange={(e) => setEntity(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Project</label>
                <Input placeholder="edutest-ai" value={project} onChange={(e) => setProject(e.target.value)} />
              </div>

              <Button onClick={setupWandB} disabled={loading || !apiKey} className="w-full">
                {loading ? "Konfiqurasiya edilir..." : "Konfiqurasiya Et"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Weights & Biases Dashboard
            </h1>
            <p className="text-gray-600 mt-2">Experiment tracking və model monitoring</p>
          </div>
          <Button variant="outline" asChild>
            <a href={`https://wandb.ai/${entity || ""}/${project}`} target="_blank" rel="noreferrer">
              <ExternalLink className="mr-2 h-4 w-4" />
              W&B Dashboard-a Keç
            </a>
          </Button>
        </div>

        {/* Best Model Card */}
        {bestModel && (
          <Card className="border-2 border-yellow-400 bg-gradient-to-br from-yellow-50 to-amber-50">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Award className="h-6 w-6 text-yellow-600" />
                <CardTitle>🏆 Ən Yaxşı Model</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <div className="text-sm text-gray-500">Model Adı</div>
                  <div className="text-xl font-bold">{bestModel.name}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Benchmark Score</div>
                  <div className="text-xl font-bold text-green-600">{bestModel.score}</div>
                </div>
                <div className="flex items-center">
                  <Button asChild className="w-full">
                    <a href={bestModel.url} target="_blank" rel="noreferrer">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Detallara Bax
                    </a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">
              <Activity className="mr-2 h-4 w-4" />
              Ümumi Baxış
            </TabsTrigger>
            <TabsTrigger value="runs">
              <BarChart className="mr-2 h-4 w-4" />
              Runs
            </TabsTrigger>
            <TabsTrigger value="metrics">
              <TrendingUp className="mr-2 h-4 w-4" />
              Metrics
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Toplam Runs</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold">{runs.length}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Uğurlu Runs</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-green-600">
                    {runs.filter((r) => r.state === "finished").length}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Aktiv Runs</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-blue-600">
                    {runs.filter((r) => r.state === "running").length}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Son Fəaliyyətlər</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {runs.slice(0, 5).map((run, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <div>
                        <div className="font-medium">{run.name}</div>
                        <div className="text-sm text-gray-500">{new Date(run.created_at).toLocaleString("az-AZ")}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={run.state === "finished" ? "default" : "secondary"}>{run.state}</Badge>
                        <Button variant="outline" size="sm" asChild>
                          <a href={run.url} target="_blank" rel="noreferrer">
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Runs Tab */}
          <TabsContent value="runs">
            <Card>
              <CardHeader>
                <CardTitle>Bütün Runs</CardTitle>
                <CardDescription>{runs.length} run tapıldı</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Ad</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Tags</TableHead>
                      <TableHead>Tarix</TableHead>
                      <TableHead>Əməliyyatlar</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {runs.map((run, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="font-medium">{run.name}</TableCell>
                        <TableCell>
                          <Badge variant={run.state === "finished" ? "default" : "secondary"}>{run.state}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            {run.tags?.slice(0, 2).map((tag: string, i: number) => (
                              <Badge key={i} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>{new Date(run.created_at).toLocaleDateString("az-AZ")}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" asChild>
                            <a href={run.url} target="_blank" rel="noreferrer">
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Metrics Tab */}
          <TabsContent value="metrics">
            <Card>
              <CardHeader>
                <CardTitle>Metrics Tracking</CardTitle>
                <CardDescription>Model performans metrikləri</CardDescription>
              </CardHeader>
              <CardContent>
                <Alert>
                  <LineChart className="h-4 w-4" />
                  <AlertDescription>
                    Ətraflı metrics və chartlar üçün{" "}
                    <a
                      href={`https://wandb.ai/${entity || ""}/${project}`}
                      target="_blank"
                      className="underline"
                      rel="noreferrer"
                    >
                      W&B Dashboard
                    </a>
                    -a keçin
                  </AlertDescription>
                </Alert>

                <div className="mt-6 grid grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Training Loss</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">Tracking...</div>
                      <p className="text-xs text-gray-500">W&B-də real-time izlənilir</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Benchmark Score</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">Tracking...</div>
                      <p className="text-xs text-gray-500">W&B-də real-time izlənilir</p>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
