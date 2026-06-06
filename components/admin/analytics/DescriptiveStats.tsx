'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

export default function DescriptiveStats({ topic, grade }: { topic: string, grade: string }) {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // In a real app, this would fetch from /api/admin/analytics/topic-stats
    // Using mock data for architecture demonstration
    setTimeout(() => {
      setData({
        totalAttempts: 1245,
        meanScore: 68.5,
        medianScore: 70,
        modeScore: 75,
        passRate: 72,
        scoreDistribution: [
          { name: '0-20', count: 45 },
          { name: '21-40', count: 120 },
          { name: '41-60', count: 350 },
          { name: '61-80', count: 480 },
          { name: '81-100', count: 250 },
        ],
        correctnessRatio: [
          { name: 'Doğru', value: 7200, color: '#22c55e' },
          { name: 'Səhv', value: 2800, color: '#ef4444' },
        ]
      })
      setLoading(false)
    }, 1000)
  }, [topic])

  if (loading) return <div className="flex justify-center p-12"><Loader2 className="h-8 w-8 animate-spin text-slate-400" /></div>

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-slate-500">Orta Bal (Mean)</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-bold">{data.meanScore}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-slate-500">Mediana</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-bold">{data.medianScore}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-slate-500">Moda</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-bold">{data.modeScore}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-slate-500">Uğur Göstəricisi</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-bold text-green-600">{data.passRate}%</p></CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Nəticələrin Paylanması (Score Distribution)</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.scoreDistribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Doğru/Səhv Nisbəti</CardTitle>
          </CardHeader>
          <CardContent className="h-80 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.correctnessRatio}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                >
                  {data.correctnessRatio.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
