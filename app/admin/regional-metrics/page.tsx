"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { MapPin, AlertTriangle, Target, Zap, Users } from "lucide-react"

const REGIONS = {
  baku: "Bakı",
  ganja: "Gəncə",
  sumqayit: "Sumqayıt",
  mingachevir: "Mingəçevir",
  shirvan: "Şirvan",
  lankaran: "Lənkəran",
  nakhchivan: "Naxçıvan",
  sheki: "Şəki",
  yevlakh: "Yevlax",
  other: "Digər",
}

export default function RegionalMetricsPage() {
  const [summary, setSummary] = useState<any>(null)
  const [weights, setWeights] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [logs, setLogs] = useState<string[]>([])

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [summaryRes, weightsRes] = await Promise.all([
        fetch("/api/regional-metrics?action=summary"),
        fetch("/api/regional-metrics?action=weights"),
      ])

      const summaryData = await summaryRes.json()
      const weightsData = await weightsRes.json()

      setSummary(summaryData)
      setWeights(weightsData)
    } catch (error) {
      console.error("Error loading data:", error)
    }
  }

  const updateSummary = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/regional-metrics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "summary" }),
      })

      const data = await response.json()
      if (data.success) {
        addLog("✅ Regional summary updated")
        await loadData()
      }
    } catch (error) {
      addLog("❌ Error updating summary")
    } finally {
      setLoading(false)
    }
  }

  const checkDisparities = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/regional-metrics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "disparities", hours: 24, threshold: 0.1 }),
      })

      const data = await response.json()
      if (data.success) {
        addLog("✅ Disparity check completed")
        addLog(data.output)
      }
    } catch (error) {
      addLog("❌ Error checking disparities")
    } finally {
      setLoading(false)
    }
  }

  const addLog = (message: string) => {
    setLogs((prev) => [`[${new Date().toLocaleTimeString()}] ${message}`, ...prev].slice(0, 50))
  }

  const formatPercent = (value: number) => {
    return `${(value * 100).toFixed(1)}%`
  }

  const formatTime = (value: number) => {
    return `${value.toFixed(2)}s`
  }

  const getPerformanceBadge = (value: number, type: "accuracy" | "speed") => {
    if (type === "accuracy") {
      if (value >= 0.9) return <Badge className="bg-green-500">Əla</Badge>
      if (value >= 0.8) return <Badge className="bg-yellow-500">Yaxşı</Badge>
      return <Badge className="bg-red-500">Zəif</Badge>
    } else {
      if (value <= 3) return <Badge className="bg-green-500">Sürətli</Badge>
      if (value <= 5) return <Badge className="bg-yellow-500">Orta</Badge>
      return <Badge className="bg-red-500">Yavaş</Badge>
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Regional Performance Metrics</h1>
          <p className="text-muted-foreground mt-2">Track and compare metrics across geographic regions</p>
        </div>
        <Button onClick={loadData} variant="outline">
          Refresh Data
        </Button>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Regional Overview</TabsTrigger>
          <TabsTrigger value="comparison">Comparison</TabsTrigger>
          <TabsTrigger value="disparities">Disparities</TabsTrigger>
          <TabsTrigger value="weights">Regional Weights</TabsTrigger>
          <TabsTrigger value="logs">Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {summary?.regions && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {Object.entries(summary.regions).map(([regionCode, data]: [string, any]) => {
                  const stats = data.last_24h
                  if (stats.count === 0) return null

                  return (
                    <Card key={regionCode}>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            {data.name}
                          </CardTitle>
                          {getPerformanceBadge(stats.accuracy.mean, "accuracy")}
                        </div>
                        <CardDescription>{stats.count} requests (24h)</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="flex items-center gap-1">
                              <Target className="h-3 w-3" />
                              Accuracy
                            </span>
                            <span className="font-medium">{formatPercent(stats.accuracy.mean)}</span>
                          </div>
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-green-500 transition-all"
                              style={{ width: `${stats.accuracy.mean * 100}%` }}
                            />
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="flex items-center gap-1">
                              <Zap className="h-3 w-3" />
                              Speed
                            </span>
                            <span className="font-medium">{formatTime(stats.speed.mean)}</span>
                          </div>
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-blue-500 transition-all"
                              style={{
                                width: `${Math.min(100, ((10 - stats.speed.mean) / 10) * 100)}%`,
                              }}
                            />
                          </div>
                        </div>

                        {stats.error_rate > 0 && (
                          <div className="text-xs text-red-500 flex items-center gap-1">
                            <AlertTriangle className="h-3 w-3" />
                            Error rate: {formatPercent(stats.error_rate)}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </>
          )}
        </TabsContent>

        <TabsContent value="comparison" className="space-y-4">
          {summary?.comparison && (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Best Performing Regions</CardTitle>
                    <CardDescription>Top regions by accuracy (24h)</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {summary.comparison.best_region && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-green-500 flex items-center justify-center text-white font-bold">
                              1
                            </div>
                            <div>
                              <div className="font-medium">
                                {REGIONS[summary.comparison.best_region as keyof typeof REGIONS]}
                              </div>
                              <div className="text-sm text-muted-foreground">Best accuracy</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-green-600">
                              {formatPercent(summary.comparison.best_value)}
                            </div>
                            <div className="text-xs text-muted-foreground">accuracy</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Needs Improvement</CardTitle>
                    <CardDescription>Regions requiring attention</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {summary.comparison.worst_region && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
                          <div className="flex items-center gap-3">
                            <AlertTriangle className="h-10 w-10 text-red-500" />
                            <div>
                              <div className="font-medium">
                                {REGIONS[summary.comparison.worst_region as keyof typeof REGIONS]}
                              </div>
                              <div className="text-sm text-muted-foreground">Needs improvement</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-red-600">
                              {formatPercent(summary.comparison.worst_value)}
                            </div>
                            <div className="text-xs text-muted-foreground">accuracy</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>All Regions Performance</CardTitle>
                  <CardDescription>Comprehensive regional comparison</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {Object.entries(summary.comparison.regional_stats || {})
                      .filter(([_, stats]: [string, any]) => stats.count > 0)
                      .sort(([_, a]: [string, any], [__, b]: [string, any]) => b.accuracy.mean - a.accuracy.mean)
                      .map(([region, stats]: [string, any], index) => (
                        <div
                          key={region}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="text-sm font-medium text-muted-foreground w-6">{index + 1}</div>
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{REGIONS[region as keyof typeof REGIONS]}</span>
                          </div>
                          <div className="flex items-center gap-6">
                            <div className="text-right">
                              <div className="text-sm font-medium">{formatPercent(stats.accuracy.mean)}</div>
                              <div className="text-xs text-muted-foreground">accuracy</div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-medium">{formatTime(stats.speed.mean)}</div>
                              <div className="text-xs text-muted-foreground">speed</div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-medium flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                {stats.count}
                              </div>
                              <div className="text-xs text-muted-foreground">requests</div>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        <TabsContent value="disparities" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Regional Disparity Analysis</CardTitle>
              <CardDescription>Detect and address performance gaps between regions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={checkDisparities} disabled={loading}>
                {loading ? "Analyzing..." : "Check Disparities"}
              </Button>

              {summary?.disparities && summary.disparities.has_disparities && (
                <div className="space-y-4">
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="h-5 w-5 text-yellow-600" />
                      <span className="font-medium text-yellow-800">
                        {summary.disparities.disparities.length} Disparities Detected
                      </span>
                    </div>
                    <p className="text-sm text-yellow-700">
                      Some regions show significant performance differences. Review recommendations below.
                    </p>
                  </div>

                  <div className="space-y-3">
                    {summary.disparities.disparities.map((disparity: any, index: number) => (
                      <div
                        key={index}
                        className={`p-4 rounded-lg border ${
                          disparity.severity === "high" ? "bg-red-50 border-red-200" : "bg-yellow-50 border-yellow-200"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            <span className="font-medium">{disparity.region_name}</span>
                            <Badge
                              variant={disparity.severity === "high" ? "destructive" : "secondary"}
                              className="ml-2"
                            >
                              {disparity.severity}
                            </Badge>
                          </div>
                          <span className="text-sm text-muted-foreground capitalize">{disparity.type}</span>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <div className="text-muted-foreground">Current</div>
                            <div className="font-medium">
                              {disparity.type === "accuracy"
                                ? formatPercent(disparity.value)
                                : formatTime(disparity.value)}
                            </div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Mean</div>
                            <div className="font-medium">
                              {disparity.type === "accuracy"
                                ? formatPercent(disparity.mean)
                                : formatTime(disparity.mean)}
                            </div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Difference</div>
                            <div className="font-medium text-red-600">{formatPercent(disparity.difference)}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {summary.disparities.recommendations && summary.disparities.recommendations.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Recommendations</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {summary.disparities.recommendations.map((rec: string, index: number) => (
                            <div key={index} className="text-sm whitespace-pre-line p-3 bg-blue-50 rounded-lg">
                              {rec}
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}

              {summary?.disparities && !summary.disparities.has_disparities && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center">
                      <span className="text-white font-bold">✓</span>
                    </div>
                    <div>
                      <div className="font-medium text-green-800">No Significant Disparities</div>
                      <div className="text-sm text-green-700">All regions performing within acceptable range</div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="weights" className="space-y-4">
          {weights && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(weights).map(([regionCode, regionWeights]: [string, any]) => (
                <Card key={regionCode}>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      {REGIONS[regionCode as keyof typeof REGIONS]}
                    </CardTitle>
                    <CardDescription>Optimization weights for this region</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {Object.entries(regionWeights).map(([metric, weight]: [string, any]) => (
                      <div key={metric}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="capitalize">{metric.replace("_", " ")}</span>
                          <span className="font-medium">{formatPercent(weight)}</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${
                              metric === "accuracy"
                                ? "bg-green-500"
                                : metric === "speed"
                                  ? "bg-blue-500"
                                  : "bg-purple-500"
                            }`}
                            style={{ width: `${weight * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="logs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Activity Logs</CardTitle>
              <CardDescription>Recent regional metrics activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-1 font-mono text-sm max-h-96 overflow-y-auto">
                {logs.length === 0 ? (
                  <div className="text-muted-foreground">No logs yet</div>
                ) : (
                  logs.map((log, index) => (
                    <div key={index} className="text-xs">
                      {log}
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
