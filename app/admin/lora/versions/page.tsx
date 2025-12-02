"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { CheckCircle, Circle, Trash2, BarChart3, Tag, Calendar, TrendingUp, TrendingDown, Download } from "lucide-react"

interface ModelVersion {
  version_id: string
  name: string
  description: string
  created_at: string
  metrics: Record<string, number>
  training_config: Record<string, any>
  tags: string[]
  active: boolean
  downloads: number
}

export default function LoRAVersionsPage() {
  const [models, setModels] = useState<ModelVersion[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedModels, setSelectedModels] = useState<string[]>([])
  const [compareData, setCompareData] = useState<any>(null)
  const [tagFilter, setTagFilter] = useState<string[]>([])
  const [newTags, setNewTags] = useState<string>("")

  useEffect(() => {
    loadModels()
  }, [tagFilter])

  const loadModels = async () => {
    try {
      setLoading(true)
      const tags = tagFilter.length > 0 ? `?tags=${tagFilter.join(",")}` : ""
      const response = await fetch(`/api/lora/versions${tags}`)
      const data = await response.json()

      if (data.success) {
        setModels(data.models)
      }
    } catch (error) {
      console.error("Load models error:", error)
    } finally {
      setLoading(false)
    }
  }

  const activateModel = async (versionId: string) => {
    try {
      const response = await fetch("/api/lora/versions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "activate",
          version_id: versionId,
        }),
      })

      const data = await response.json()

      if (data.success) {
        await loadModels()
      }
    } catch (error) {
      console.error("Activate model error:", error)
    }
  }

  const deleteModel = async (versionId: string, force = false) => {
    if (!confirm("Bu modeli silmək istədiyinizdən əminsiniz?")) {
      return
    }

    try {
      const response = await fetch(`/api/lora/versions?version_id=${versionId}&force=${force}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (data.success) {
        await loadModels()
      } else if (data.error.includes("Cannot delete active model")) {
        if (confirm("Bu aktiv modeldir. Yenə də silmək istəyirsiniz?")) {
          await deleteModel(versionId, true)
        }
      }
    } catch (error) {
      console.error("Delete model error:", error)
    }
  }

  const compareModels = async () => {
    if (selectedModels.length < 2) {
      alert("Ən azı 2 model seçin")
      return
    }

    try {
      const response = await fetch("/api/lora/versions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "compare",
          data: { version_ids: selectedModels },
        }),
      })

      const data = await response.json()

      if (data.success) {
        setCompareData(data.comparison)
      }
    } catch (error) {
      console.error("Compare models error:", error)
    }
  }

  const addTags = async (versionId: string) => {
    if (!newTags.trim()) return

    try {
      const tags = newTags.split(",").map((t) => t.trim())
      const response = await fetch("/api/lora/versions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "add_tags",
          version_id: versionId,
          data: { tags },
        }),
      })

      const data = await response.json()

      if (data.success) {
        setNewTags("")
        await loadModels()
      }
    } catch (error) {
      console.error("Add tags error:", error)
    }
  }

  const toggleModelSelection = (versionId: string) => {
    setSelectedModels((prev) =>
      prev.includes(versionId) ? prev.filter((id) => id !== versionId) : [...prev, versionId],
    )
  }

  const getMetricTrend = (metric: number, baseline?: number) => {
    if (!baseline) return null
    const change = ((metric - baseline) / baseline) * 100
    return {
      value: Math.abs(change).toFixed(1),
      isPositive: change > 0,
    }
  }

  const allTags = Array.from(new Set(models.flatMap((m) => m.tags)))

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Model Versiyaları
          </h1>
          <p className="text-gray-600 mt-2">LoRA modellərini idarə edin və müqayisə edin</p>
        </div>

        {/* Filter & Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Filtrlər və Əməliyyatlar</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Label>Tag-lara görə filtr:</Label>
              <div className="flex flex-wrap gap-2">
                {allTags.map((tag) => (
                  <Badge
                    key={tag}
                    variant={tagFilter.includes(tag) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => {
                      setTagFilter((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
                    }}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            {selectedModels.length > 0 && (
              <Alert>
                <AlertDescription>
                  <div className="flex items-center justify-between">
                    <span>{selectedModels.length} model seçildi</span>
                    <Button onClick={compareModels} size="sm">
                      <BarChart3 className="mr-2 h-4 w-4" />
                      Müqayisə Et
                    </Button>
                  </div>
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        <Tabs defaultValue="list" className="space-y-4">
          <TabsList>
            <TabsTrigger value="list">Model Siyahısı</TabsTrigger>
            {compareData && <TabsTrigger value="compare">Müqayisə</TabsTrigger>}
          </TabsList>

          {/* Model List */}
          <TabsContent value="list" className="space-y-4">
            {loading ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-gray-500">Yüklənir...</p>
                </CardContent>
              </Card>
            ) : models.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-gray-500">Model tapılmadı</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {models.map((model) => (
                  <Card key={model.version_id} className={model.active ? "border-green-500 border-2" : ""}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <input
                            type="checkbox"
                            checked={selectedModels.includes(model.version_id)}
                            onChange={() => toggleModelSelection(model.version_id)}
                            className="mt-1"
                          />
                          <div>
                            <CardTitle className="flex items-center gap-2">
                              {model.active ? (
                                <CheckCircle className="h-5 w-5 text-green-600" />
                              ) : (
                                <Circle className="h-5 w-5 text-gray-400" />
                              )}
                              {model.name}
                              {model.active && <Badge variant="default">Aktiv</Badge>}
                            </CardTitle>
                            <CardDescription className="mt-1">
                              <div className="flex items-center gap-4 text-sm">
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {new Date(model.created_at).toLocaleDateString("az-AZ")}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Download className="h-3 w-3" />
                                  {model.downloads} yükləmə
                                </span>
                              </div>
                            </CardDescription>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          {!model.active && (
                            <Button onClick={() => activateModel(model.version_id)} size="sm" variant="outline">
                              Aktiv Et
                            </Button>
                          )}

                          <Dialog>
                            <DialogTrigger asChild>
                              <Button size="sm" variant="outline">
                                <Tag className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Tag Əlavə Et</DialogTitle>
                                <DialogDescription>Vergüllə ayrılmış tag-lar daxil edin</DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <Input
                                  value={newTags}
                                  onChange={(e) => setNewTags(e.target.value)}
                                  placeholder="production, best, v1.0"
                                />
                                <Button onClick={() => addTags(model.version_id)} className="w-full">
                                  Əlavə Et
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>

                          <Button onClick={() => deleteModel(model.version_id)} size="sm" variant="destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent>
                      <div className="space-y-4">
                        {/* Tags */}
                        {model.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {model.tags.map((tag) => (
                              <Badge key={tag} variant="secondary">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}

                        {/* Metrics */}
                        {Object.keys(model.metrics).length > 0 && (
                          <div className="grid grid-cols-4 gap-4">
                            {Object.entries(model.metrics).map(([key, value]) => (
                              <div key={key} className="text-sm">
                                <div className="text-gray-500 capitalize">{key.replace(/_/g, " ")}</div>
                                <div className="font-semibold">
                                  {typeof value === "number" ? value.toFixed(4) : value}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Training Config */}
                        <details className="text-sm">
                          <summary className="cursor-pointer text-gray-600">Training Konfiqurasiyası</summary>
                          <pre className="mt-2 p-2 bg-gray-50 rounded text-xs overflow-auto">
                            {JSON.stringify(model.training_config, null, 2)}
                          </pre>
                        </details>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Comparison Tab */}
          {compareData && (
            <TabsContent value="compare">
              <Card>
                <CardHeader>
                  <CardTitle>Model Müqayisəsi</CardTitle>
                  <CardDescription>{compareData.models.length} model müqayisə edilir</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Metrika</TableHead>
                        {compareData.models.map((model: any) => (
                          <TableHead key={model.version_id}>{model.name}</TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {Object.entries(compareData.metrics_comparison).map(([metric, values]: [string, any]) => (
                        <TableRow key={metric}>
                          <TableCell className="font-medium capitalize">{metric.replace(/_/g, " ")}</TableCell>
                          {(values as number[]).map((value, idx) => {
                            const baseline = values[0]
                            const trend = getMetricTrend(value, baseline)

                            return (
                              <TableCell key={idx}>
                                <div className="flex items-center gap-2">
                                  <span>{value !== null ? value.toFixed(4) : "N/A"}</span>
                                  {trend && idx > 0 && (
                                    <Badge variant={trend.isPositive ? "default" : "destructive"} className="text-xs">
                                      {trend.isPositive ? (
                                        <TrendingUp className="h-3 w-3 mr-1" />
                                      ) : (
                                        <TrendingDown className="h-3 w-3 mr-1" />
                                      )}
                                      {trend.value}%
                                    </Badge>
                                  )}
                                </div>
                              </TableCell>
                            )
                          })}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  )
}
