"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, TrendingUp, TrendingDown, Activity, Target, Zap } from "lucide-react"

export default function ProductionMetricsPage() {
  const [summary, setSummary] = useState<any>(null)
  const [weights, setWeights] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [adjusting, setAdjusting] = useState(false)
  const [checking, setChecking] = useState(false)
  const [logs, setLogs] = useState<string[]>([])

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [summaryRes, weightsRes] = await Promise.all([
        fetch("/api/production-metrics?action=summary"),
        fetch("/api/production-metrics?action=weights"),
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
      const response = await fetch("/api/production-metrics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "summary" }),
      })

      const data = await response.json()
      if (data.success) {
        addLog("✅ Summary updated successfully")
        await loadData()
      }
    } catch (error) {
      addLog("❌ Error updating summary")
    } finally {
      setLoading(false)
    }
  }

  const adjustWeights = async () => {
    setAdjusting(true)
    try {
      const response = await fetch("/api/production-metrics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "adjust",
          baselineHours: 168,
        }),
      })

      const data = await response.json()
      if (data.success) {
        addLog("✅ Weights adjusted based on production metrics")
        addLog(data.output)
        await loadData()
      }
    } catch (error) {
      addLog("❌ Error adjusting weights")
    } finally {
      setAdjusting(false)
    }
  }

  const checkSweepNeeded = async () => {
    setChecking(true)
    try {
      const response = await fetch("/api/production-metrics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "check" }),
      })

      const data = await response.json()
      if (data.success) {
        addLog("✅ Sweep check completed")
        addLog(data.output)
      }
    } catch (error) {
      addLog("❌ Error checking sweep status")
    } finally {
      setChecking(false)
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

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Production Metrics & Dynamic Weights</h1>
          <p className="text-muted-foreground mt-2">
            Automatically adjust optimization weights based on real production performance
          </p>
        </div>
        <Button onClick={loadData} variant="outline">
          Refresh Data
        </Button>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="weights">Dynamic Weights</TabsTrigger>
          <TabsTrigger value="actions">Actions</TabsTrigger>
          <TabsTrigger value="logs">Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {summary && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Requests (24h)</CardTitle>
                    <Activity className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{summary.last_24h?.count || 0}</div>
                    <p className="text-xs text-muted-foreground">{summary.last_7d?.count || 0} in last 7 days</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Accuracy</CardTitle>
                    <Target className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{formatPercent(summary.last_24h?.accuracy?.mean || 0)}</div>
                    <p className="text-xs text-muted-foreground">
                      P95: {formatPercent(summary.last_24h?.accuracy?.p95 || 0)}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Inference Time</CardTitle>
                    <Zap className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{formatTime(summary.last_24h?.speed?.mean || 0)}</div>
                    <p className="text-xs text-muted-foreground">
                      P95: {formatTime(summary.last_24h?.speed?.p95 || 0)}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Error Rate</CardTitle>
                    <AlertCircle className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{formatPercent(summary.last_24h?.error_rate || 0)}</div>
                    <p className="text-xs text-muted-foreground">
                      {summary.last_24h?.error_rate > 0.05 ? (
                        <span className="text-red-500">⚠️ High error rate</span>
                      ) : (
                        <span className="text-green-500">✅ Healthy</span>
                      )}
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>24 Hour Metrics</CardTitle>
                    <CardDescription>Recent performance statistics</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Accuracy</span>
                        <span className="font-medium">{formatPercent(summary.last_24h?.accuracy?.mean || 0)}</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-green-500"
                          style={{ width: `${(summary.last_24h?.accuracy?.mean || 0) * 100}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Speed (lower is better)</span>
                        <span className="font-medium">{formatTime(summary.last_24h?.speed?.mean || 0)}</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500"
                          style={{
                            width: `${Math.min(100, ((10 - (summary.last_24h?.speed?.mean || 0)) / 10) * 100)}%`,
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Error Rate (lower is better)</span>
                        <span className="font-medium">{formatPercent(summary.last_24h?.error_rate || 0)}</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-red-500"
                          style={{ width: `${(summary.last_24h?.error_rate || 0) * 100}%` }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>7 Day Comparison</CardTitle>
                    <CardDescription>Weekly average vs 24h performance</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm">Accuracy</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                          {formatPercent(summary.last_7d?.accuracy?.mean || 0)}
                        </span>
                        {(summary.last_24h?.accuracy?.mean || 0) > (summary.last_7d?.accuracy?.mean || 0) ? (
                          <TrendingUp className="h-4 w-4 text-green-500" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-red-500" />
                        )}
                        <span className="text-sm font-medium">
                          {formatPercent(summary.last_24h?.accuracy?.mean || 0)}
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm">Speed</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                          {formatTime(summary.last_7d?.speed?.mean || 0)}
                        </span>
                        {(summary.last_24h?.speed?.mean || 0) < (summary.last_7d?.speed?.mean || 0) ? (
                          <TrendingUp className="h-4 w-4 text-green-500" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-red-500" />
                        )}
                        <span className="text-sm font-medium">{formatTime(summary.last_24h?.speed?.mean || 0)}</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm">Error Rate</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                          {formatPercent(summary.last_7d?.error_rate || 0)}
                        </span>
                        {(summary.last_24h?.error_rate || 0) < (summary.last_7d?.error_rate || 0) ? (
                          <TrendingUp className="h-4 w-4 text-green-500" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-red-500" />
                        )}
                        <span className="text-sm font-medium">{formatPercent(summary.last_24h?.error_rate || 0)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </TabsContent>

        <TabsContent value="weights" className="space-y-4">
          {weights && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Current Objective Weights</CardTitle>
                  <CardDescription>Dynamically adjusted based on production performance</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(weights.current).map(([key, value]: [string, any]) => (
                    <div key={key}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="capitalize">{key.replace("_", " ")}</span>
                        <span className="font-medium">{formatPercent(value)}</span>
                      </div>
                      <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${
                            key === "accuracy" ? "bg-green-500" : key === "speed" ? "bg-blue-500" : "bg-purple-500"
                          }`}
                          style={{ width: `${value * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {weights.history && weights.history.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Weight Adjustment History</CardTitle>
                    <CardDescription>Recent automatic adjustments</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {weights.history
                        .slice(-5)
                        .reverse()
                        .map((entry: any, index: number) => (
                          <div key={index} className="border-l-2 border-blue-500 pl-4 py-2">
                            <div className="text-sm text-muted-foreground">
                              {new Date(entry.timestamp).toLocaleString()}
                            </div>
                            {entry.adjustments && entry.adjustments.length > 0 && (
                              <div className="mt-2 space-y-1">
                                {entry.adjustments.map((adj: string, i: number) => (
                                  <div key={i} className="text-sm">
                                    • {adj}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </TabsContent>

        <TabsContent value="actions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Manual Actions</CardTitle>
              <CardDescription>Trigger manual adjustments and checks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col gap-4">
                <div className="p-4 border rounded-lg space-y-2">
                  <h3 className="font-medium">Update Summary</h3>
                  <p className="text-sm text-muted-foreground">
                    Recalculate performance statistics from recent metrics
                  </p>
                  <Button onClick={updateSummary} disabled={loading}>
                    {loading ? "Updating..." : "Update Summary"}
                  </Button>
                </div>

                <div className="p-4 border rounded-lg space-y-2">
                  <h3 className="font-medium">Adjust Weights</h3>
                  <p className="text-sm text-muted-foreground">
                    Automatically adjust objective weights based on production vs baseline performance
                  </p>
                  <Button onClick={adjustWeights} disabled={adjusting}>
                    {adjusting ? "Adjusting..." : "Adjust Weights"}
                  </Button>
                </div>

                <div className="p-4 border rounded-lg space-y-2">
                  <h3 className="font-medium">Check Sweep Needed</h3>
                  <p className="text-sm text-muted-foreground">
                    Determine if a new hyperparameter sweep should be triggered
                  </p>
                  <Button onClick={checkSweepNeeded} disabled={checking}>
                    {checking ? "Checking..." : "Check Sweep Status"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Activity Logs</CardTitle>
              <CardDescription>Recent system activity</CardDescription>
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
