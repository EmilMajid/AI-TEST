"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

const BLOOM_COLORS = {
  knowledge: "#3b82f6",
  comprehension: "#10b981",
  application: "#f59e0b",
  analysis: "#ef4444",
  synthesis: "#8b5cf6",
  evaluation: "#ec4899",
}

export default function ResultsPage() {
  const [results, setResults] = useState<any[]>([])
  const [bloomStats, setBloomStats] = useState<any>({})
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchResults()
  }, [])

  async function fetchResults() {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return

    const { data } = await supabase
      .from("test_results")
      .select(
        `
        *,
        questions(bloom_level)
      `,
      )
      .eq("user_id", user.id)
      .order("completed_at", { ascending: false })

    if (data) {
      setResults(data)

      // Calculate Bloom's taxonomy stats
      const stats: any = {}
      data.forEach((result: any) => {
        result.questions?.forEach((q: any) => {
          if (!stats[q.bloom_level]) {
            stats[q.bloom_level] = 0
          }
          stats[q.bloom_level]++
        })
      })

      setBloomStats(stats)
    }

    setLoading(false)
  }

  const chartData = results.map((r) => ({
    date: new Date(r.completed_at).toLocaleDateString("az-AZ"),
    score: r.score,
  }))

  const bloomData = Object.entries(bloomStats).map(([level, count]) => ({
    name: level,
    value: count as number,
  }))

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Test Nəticələri</h1>

      <div className="grid gap-4 md:grid-cols-2 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Orta Bal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {results.length > 0 ? Math.round(results.reduce((sum, r) => sum + r.score, 0) / results.length) : 0}%
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Keçilmiş Testlər</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{results.length}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Bal Dinamikası</CardTitle>
          <CardDescription>Sonuncu testlər</CardDescription>
        </CardHeader>
        <CardContent>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Line type="monotone" dataKey="score" stroke="#3b82f6" />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-muted-foreground py-8">Hələ heç bir test keçilməyib</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Bloom Taksonomiyası</CardTitle>
          <CardDescription>Sualların təhlili</CardDescription>
        </CardHeader>
        <CardContent>
          {bloomData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={bloomData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {bloomData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={BLOOM_COLORS[entry.name as keyof typeof BLOOM_COLORS]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-muted-foreground py-8">Data yoxdur</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
