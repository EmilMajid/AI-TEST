'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell } from 'recharts'
import { Badge } from '@/components/ui/badge'

export default function ClusterAnalysis({ topic, grade }: { topic: string, grade: string }) {
  // Mock data representing K-Means clustering of students
  // X = Time Spent, Y = Score, Z = Engagement Level
  const clusterData = [
    { x: 120, y: 85, z: 200, cluster: 0, profile: 'Sürətli və Dəqiq' },
    { x: 130, y: 90, z: 220, cluster: 0, profile: 'Sürətli və Dəqiq' },
    { x: 140, y: 88, z: 210, cluster: 0, profile: 'Sürətli və Dəqiq' },
    
    { x: 450, y: 92, z: 150, cluster: 1, profile: 'Yavaş amma Dəqiq' },
    { x: 480, y: 85, z: 160, cluster: 1, profile: 'Yavaş amma Dəqiq' },
    { x: 500, y: 89, z: 180, cluster: 1, profile: 'Yavaş amma Dəqiq' },

    { x: 150, y: 35, z: 100, cluster: 2, profile: 'Tələskən və Diqqətsiz' },
    { x: 110, y: 40, z: 120, cluster: 2, profile: 'Tələskən və Diqqətsiz' },
    { x: 130, y: 30, z: 90,  cluster: 2, profile: 'Tələskən və Diqqətsiz' },
    
    { x: 400, y: 45, z: 80,  cluster: 3, profile: 'Çətinlik Çəkənlər' },
    { x: 420, y: 40, z: 85,  cluster: 3, profile: 'Çətinlik Çəkənlər' },
  ]

  const COLORS = ['#22c55e', '#3b82f6', '#ef4444', '#f59e0b']

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Klasterləşdirmə (K-Means Personaları)</CardTitle>
          <CardDescription>Tələbələrin test cəhdlərinə görə süni intellekt tərəfindən qruplaşdırılması</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 h-96">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" dataKey="x" name="Sərf Olunan Vaxt (san)" />
                  <YAxis type="number" dataKey="y" name="Bal" />
                  <ZAxis type="number" dataKey="z" range={[50, 400]} />
                  <RechartsTooltip cursor={{ strokeDasharray: '3 3' }} />
                  <Scatter name="Tələbələr" data={clusterData}>
                    {clusterData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[entry.cluster % COLORS.length]} />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-bold text-lg">Öyrənmə Profilləri</h3>
              
              <div className="p-3 border rounded-lg bg-green-50 border-green-200">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <strong className="text-green-800">Sürətli və Dəqiq</strong>
                </div>
                <p className="text-xs text-green-700">Mövzunu çox yaxşı mənimsəyib, sualları tez həll edir.</p>
              </div>

              <div className="p-3 border rounded-lg bg-blue-50 border-blue-200">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <strong className="text-blue-800">Yavaş amma Dəqiq</strong>
                </div>
                <p className="text-xs text-blue-700">Mövzunu bilir, amma tətbiq etməkdə tərəddüd edir. Praktika lazımdır.</p>
              </div>

              <div className="p-3 border rounded-lg bg-red-50 border-red-200">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <strong className="text-red-800">Tələskən və Diqqətsiz</strong>
                </div>
                <p className="text-xs text-red-700">Sualları oxumadan cavablayır. Diqqət əksikliyi ola bilər.</p>
              </div>

              <div className="p-3 border rounded-lg bg-yellow-50 border-yellow-200">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <strong className="text-yellow-800">Çətinlik Çəkənlər</strong>
                </div>
                <p className="text-xs text-yellow-700">Mövzunu ümumiyyətlə anlamayıb. Baza biliklərinə qayıdış lazımdır.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Demoqrafik Seqmentasiya</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-500">Regionlara görə fərqliliklər. Məsələn: <em>"A regionunun məktəbliləri bu mövzuda digərlərindən 15% daha yüksək nəticə göstərib."</em></p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
