'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts'

export default function BloomAnalysis({ topic, grade }: { topic: string, grade: string }) {
  // Mock data representing success rate across different Bloom Taxonomy levels
  const bloomData = [
    { subject: 'Remember (Xatırlama)', A: 90, fullMark: 100 },
    { subject: 'Understand (Anlama)', A: 85, fullMark: 100 },
    { subject: 'Apply (Tətbiq)', A: 65, fullMark: 100 },
    { subject: 'Analyze (Analiz)', A: 45, fullMark: 100 },
    { subject: 'Evaluate (Dəyərləndirmə)', A: 32, fullMark: 100 },
    { subject: 'Create (Yaratma)', A: 15, fullMark: 100 },
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Bloom Taksonomiyası Analizi</CardTitle>
          <CardDescription>Şagirdlərin sualın idrak (koqnitiv) səviyyəsinə görə orta uğur dərəcəsi</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={bloomData}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#475569', fontSize: 12 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#94a3b8' }} />
                  <Radar name="Uğur %" dataKey="A" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.5} />
                  <RechartsTooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-bold text-lg border-b pb-2">Pedaqoji Nəticə (Tövsiyə)</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg border">
                  <div>
                    <span className="font-semibold text-green-700 block">Aşağı Səviyyə (Remember/Understand)</span>
                    <span className="text-sm text-slate-500">Mükəmməl mənimsənilib</span>
                  </div>
                  <span className="text-xl font-bold text-green-600">87%</span>
                </div>

                <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg border">
                  <div>
                    <span className="font-semibold text-yellow-700 block">Orta Səviyyə (Apply)</span>
                    <span className="text-sm text-slate-500">Pratika və testə ehtiyac var</span>
                  </div>
                  <span className="text-xl font-bold text-yellow-600">65%</span>
                </div>

                <div className="flex justify-between items-center bg-red-50 p-3 rounded-lg border border-red-100">
                  <div>
                    <span className="font-semibold text-red-700 block">Yüksək Səviyyə (Analyze/Evaluate/Create)</span>
                    <span className="text-sm text-red-500">Tənqidi düşüncə zəifdir</span>
                  </div>
                  <span className="text-xl font-bold text-red-600">30%</span>
                </div>
              </div>
              
              <p className="text-sm text-slate-600 mt-4 italic">
                <strong>Analiz:</strong> Şagirdlər əzbərçilik (Remember) səviyyəsində yüksək nəticə göstərsə də, bilikləri analiz etməkdə (Analyze) çətinlik çəkirlər. Açıq tipli və məntiqi analiz tələb edən sualların sayını artırmaq tövsiyə olunur.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
