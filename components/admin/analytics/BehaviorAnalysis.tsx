'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'

export default function BehaviorAnalysis({ topic, grade }: { topic: string, grade: string }) {
  const timeData = [
    { question: 'Q1', time: 15 },
    { question: 'Q2', time: 25 },
    { question: 'Q3', time: 85 }, // outlier
    { question: 'Q4', time: 12 },
    { question: 'Q5', time: 30 },
  ]

  const dropOutData = [
    { question: 'Q1', remaining: 100 },
    { question: 'Q2', remaining: 98 },
    { question: 'Q3', remaining: 95 },
    { question: 'Q4', remaining: 60 }, // big drop
    { question: 'Q5', remaining: 58 },
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Suala Sərf Olunan Orta Vaxt</CardTitle>
            <CardDescription>Hər sual üçün saniyə ilə</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="question" />
                <YAxis label={{ value: 'Saniyə', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Line type="monotone" dataKey="time" stroke="#f59e0b" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tərk Etmə Nöqtəsi (Drop-out Rate)</CardTitle>
            <CardDescription>Testi yarımçıq saxlayanların suallara görə faizi</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dropOutData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="question" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Area type="stepAfter" dataKey="remaining" stroke="#ef4444" fill="#fca5a5" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-bold mb-2">Davranış Təhlili Nəticələri</h3>
          <ul className="list-disc pl-5 space-y-2 text-slate-600">
            <li><strong>Q3</strong> sualında tələbələr normadan çox vaxt itirir (85 saniyə). Sualın mətni çox uzun və ya mürəkkəb ola bilər.</li>
            <li><strong>Q4</strong> sualına çatanda iştirakçıların böyük bir qismi testi tərk edir (95%-dən 60%-ə düşüş). Bu sual texniki xətalı ola bilər.</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
