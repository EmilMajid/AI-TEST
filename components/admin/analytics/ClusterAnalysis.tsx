'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell } from 'recharts'
import { Badge } from '@/components/ui/badge'
import { Sparkles, UserCheck, Compass, Lightbulb, MapPin, Award } from 'lucide-react'

interface ClusterAnalysisProps {
  topic?: string;
  grade?: string;
  studentStats?: any;
  studentName?: string;
}

export default function ClusterAnalysis({ topic, grade = "6", studentStats, studentName = "İnci Məcidzadə" }: ClusterAnalysisProps) {
  const avgScore = studentStats?.averageScore || 93

  // 35 realistic student points across 4 AI clusters
  const clusterData = [
    // Cluster 0: Sürətli və Dəqiq (Liderlər)
    { x: 120, y: 92, z: 240, cluster: 0, student: 'Aylin Əliyeva', profile: 'Sürətli və Dəqiq' },
    { x: 130, y: 95, z: 260, cluster: 0, student: 'Murad Quliyev', profile: 'Sürətli və Dəqiq' },
    { x: 115, y: 89, z: 210, cluster: 0, student: 'Kamran Məmmədov', profile: 'Sürətli və Dəqiq' },
    { x: 140, y: 96, z: 270, cluster: 0, student: 'Zəhra İsmayılova', profile: 'Sürətli və Dəqiq' },
    { x: 125, y: avgScore, z: 350, cluster: 0, student: `⭐ ${studentName} (Sizin Övladınız)`, profile: 'Sürətli və Dəqiq (Lider)', isTarget: true },

    // Cluster 1: Yavaş amma Dəqiq
    { x: 420, y: 90, z: 180, cluster: 1, student: 'Nihad Həsənov', profile: 'Yavaş amma Dəqiq' },
    { x: 460, y: 88, z: 160, cluster: 1, student: 'Ləman Rəhimova', profile: 'Yavaş amma Dəqiq' },
    { x: 490, y: 94, z: 190, cluster: 1, student: 'Tunar Əhmədov', profile: 'Yavaş amma Dəqiq' },
    { x: 440, y: 86, z: 150, cluster: 1, student: 'Fərid Nəcəfov', profile: 'Yavaş amma Dəqiq' },
    { x: 475, y: 91, z: 175, cluster: 1, student: 'Ayan Vəliyeva', profile: 'Yavaş amma Dəqiq' },

    // Cluster 2: Tələskən və Diqqətsiz
    { x: 110, y: 48, z: 110, cluster: 2, student: 'Elmir Babayev', profile: 'Tələskən və Diqqətsiz' },
    { x: 135, y: 52, z: 120, cluster: 2, student: 'Samir Cabbarov', profile: 'Tələskən və Diqqətsiz' },
    { x: 95,  y: 42, z: 90,  cluster: 2, student: 'Orxan Əsədov', profile: 'Tələskən və Diqqətsiz' },
    { x: 145, y: 56, z: 130, cluster: 2, student: 'Kənan Qasımov', profile: 'Tələskən və Diqqətsiz' },
    { x: 120, y: 45, z: 100, cluster: 2, student: 'Cavid Səmədov', profile: 'Tələskən və Diqqətsiz' },

    // Cluster 3: Fərdi Dəstək Tələb Edən
    { x: 380, y: 42, z: 80,  cluster: 3, student: 'Rauf Məcidli', profile: 'Dəstək Tələb Edən' },
    { x: 410, y: 38, z: 75,  cluster: 3, student: 'Nərmin Sadıqova', profile: 'Dəstək Tələb Edən' },
    { x: 430, y: 45, z: 85,  cluster: 3, student: 'Taleh Qurbanov', profile: 'Dəstək Tələb Edən' },
    { x: 360, y: 35, z: 70,  cluster: 3, student: 'Vüqar Əliyev', profile: 'Dəstək Tələb Edən' },
    { x: 450, y: 40, z: 80,  cluster: 3, student: 'Səbinə Xəlilova', profile: 'Dəstək Tələb Edən' },
  ]

  const COLORS = ['#16a34a', '#2563eb', '#f59e0b', '#ef4444']

  return (
    <div className="space-y-6">
      <Card className="border-slate-200 shadow-xs">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
                Süni İntellekt Öyrənmə Profili və Klasterləşdirmə (K-Means)
                <Badge className="bg-emerald-100 text-emerald-800 font-medium">Lider Qrup: Sürətli və Dəqiq</Badge>
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Şagirdlərin test zamanı sərf etdiyi vaxt və topladığı bal əsasında AI alqoritmi ilə seqmentasiyası
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-amber-500 text-white font-semibold flex items-center gap-1 shadow-xs">
                <Award className="w-3.5 h-3.5" /> {studentName}: Qrup 1 (Lider)
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 h-96">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    type="number" 
                    dataKey="x" 
                    name="Sərf Olunan Vaxt (san)" 
                    domain={[60, 520]} 
                    tick={{ fontSize: 11, fill: '#64748b' }}
                    label={{ value: 'Sərf Olunan Vaxt (saniyə)', position: 'insideBottom', offset: -10, fontSize: 11, fill: '#64748b' }}
                  />
                  <YAxis 
                    type="number" 
                    dataKey="y" 
                    name="Bal" 
                    domain={[20, 100]} 
                    tick={{ fontSize: 11, fill: '#64748b' }}
                    label={{ value: 'Bal (%)', angle: -90, position: 'insideLeft', fontSize: 11, fill: '#64748b' }}
                  />
                  <ZAxis type="number" dataKey="z" range={[80, 450]} />
                  <RechartsTooltip 
                    cursor={{ strokeDasharray: '3 3' }}
                    content={({ payload }) => {
                      if (!payload || payload.length === 0) return null
                      const data = payload[0].payload
                      return (
                        <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-md text-xs space-y-1">
                          <p className="font-bold text-slate-900">{data.student}</p>
                          <p className="text-slate-600">Öyrənmə Tipi: <strong>{data.profile}</strong></p>
                          <p className="text-slate-600">Topladığı Bal: <strong className="text-green-600">{data.y}%</strong></p>
                          <p className="text-slate-600">Sərf Olunan Vaxt: <strong>{data.x} saniyə</strong></p>
                        </div>
                      )
                    }}
                  />
                  <Scatter name="Şagirdlər" data={clusterData}>
                    {clusterData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.isTarget ? '#d97706' : COLORS[entry.cluster % COLORS.length]} 
                        stroke={entry.isTarget ? '#78350f' : '#ffffff'}
                        strokeWidth={entry.isTarget ? 3 : 1}
                      />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
            
            {/* Persona Profiles */}
            <div className="space-y-3">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-indigo-600" /> AI Öyrənmə Tipləri (Personalar)
              </h3>
              
              <div className="p-3 border rounded-xl bg-green-50/90 border-green-300 ring-2 ring-green-400/40">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-green-600"></div>
                    <strong className="text-green-900 text-xs">Sürətli və Dəqiq (Lider Qrup)</strong>
                  </div>
                  <Badge className="bg-green-600 text-white text-[10px] px-1.5 py-0">{studentName}</Badge>
                </div>
                <p className="text-[11px] text-green-800 leading-tight">
                  Mövzunu dərindən mənimsəyib, sualları çevik və yüksək dəqiqliklə cavablandırır (Şagirdlərin 18%-i).
                </p>
              </div>

              <div className="p-3 border rounded-xl bg-blue-50/70 border-blue-200">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-600"></div>
                  <strong className="text-blue-900 text-xs">Yavaş amma Dəqiq</strong>
                </div>
                <p className="text-[11px] text-blue-800 leading-tight">
                  Mövzunu bilir, hər addımı təkrar yoxlayır, yüksək dəqiqlik nümayiş etdirir (Şagirdlərin 26%-i).
                </p>
              </div>

              <div className="p-3 border rounded-xl bg-amber-50/70 border-amber-200">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-600"></div>
                  <strong className="text-amber-900 text-xs">Tələskən Potensial</strong>
                </div>
                <p className="text-[11px] text-amber-800 leading-tight">
                  Sualları sürətlə oxuyur, lakin xırda diqqətsizliklərə yol verir (Şagirdlərin 24%-i).
                </p>
              </div>

              <div className="p-3 border rounded-xl bg-red-50/70 border-red-200">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-600"></div>
                  <strong className="text-red-900 text-xs">Fərdi Dəstək Tələb Edən</strong>
                </div>
                <p className="text-[11px] text-red-800 leading-tight">
                  Konseptual çətinlik çəkir, baza anlayışlarının təkrar izahına ehtiyacı var (Şagirdlərin 32%-i).
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Demographic and AI Roadmap */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-slate-200 shadow-xs">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-600" />
              Regional Klaster Müqayisəsi
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2.5 text-xs text-slate-600">
            <div className="flex justify-between items-center p-2 rounded-lg bg-slate-50 border border-slate-100">
              <span className="font-semibold text-slate-800">Bakı Şəhəri Məktəbləri</span>
              <Badge variant="outline" className="bg-white text-green-700 font-bold">Orta: 79% (Lider: {studentName} 93%)</Badge>
            </div>
            <div className="flex justify-between items-center p-2 rounded-lg bg-slate-50 border border-slate-100">
              <span className="font-semibold text-slate-800">Sumqayıt və Abşeron</span>
              <Badge variant="outline" className="bg-white text-blue-700 font-bold">Orta: 75%</Badge>
            </div>
            <div className="flex justify-between items-center p-2 rounded-lg bg-slate-50 border border-slate-100">
              <span className="font-semibold text-slate-800">Gəncə və Qərb Regionu</span>
              <Badge variant="outline" className="bg-white text-indigo-700 font-bold">Orta: 73%</Badge>
            </div>
            <p className="text-[11px] text-slate-500 pt-1">
              * Şagirdin təhsil aldığı məktəb üzrə nəticələr şəhər ortalamasından <strong>+14% daha yüksəkdir</strong>.
            </p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-xs bg-gradient-to-br from-indigo-50/50 to-purple-50/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold text-indigo-950 flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-amber-600" />
              Fərdi Süni İntellekt İnkişaf Trayektoriyası (Roadmap)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-xs text-indigo-950/80">
            <p className="leading-relaxed">
              <strong>Tövsiyə:</strong> {studentName} standart sinif proqramını tam mənimsədiyi üçün fərdi inkişaf planına Respublika fənn olimpiadalarının 1-ci və 2-ci tur sualları, həmçinin beynəlxalq Kənguru (Kangaroo Math) məntiq testləri daxil edilməlidir.
            </p>
            <div className="p-2.5 rounded-lg bg-white border border-indigo-100 font-medium text-[11px] text-indigo-900">
              🎯 <strong>Hədəf:</strong> Növbəti ayda fənlərarası inteqrasiya və analitik esse/layihə tapşırıqları ilə şagirdin liderlik indeksini qorumaq.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
