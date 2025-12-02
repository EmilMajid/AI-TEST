"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

export function StudentDashboard({ userId, profile }: any) {
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchResults()
  }, [])

  async function fetchResults() {
    const { data } = await supabase
      .from("test_results")
      .select("*")
      .eq("user_id", userId)
      .order("completed_at", { ascending: false })

    if (data) {
      setResults(data)
    }
    setLoading(false)
  }

  const averageScore =
    results.length > 0 ? Math.round(results.reduce((sum, r) => sum + r.score, 0) / results.length) : 0

  const chartData = results.slice(0, 10).map((r) => ({
    name: new Date(r.completed_at).toLocaleDateString("az-AZ"),
    score: r.score,
  }))

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Keçilmiş Testlər</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{results.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Orta Bal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageScore}%</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Ən Yüksək Bal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {results.length > 0 ? Math.max(...results.map((r) => r.score)) : 0}%
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Test Nəticələri</CardTitle>
          <CardDescription>Sonuncu 10 test</CardDescription>
        </CardHeader>
        <CardContent>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="score" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-muted-foreground py-8">Hələ heç bir test keçilməyib</p>
          )}
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button size="lg" className="gap-2">
          Test Keç
        </Button>
      </div>
    </main>
  )
}
