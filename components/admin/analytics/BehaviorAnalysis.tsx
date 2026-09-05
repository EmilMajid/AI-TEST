'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar, Legend } from 'recharts'
import { Badge } from '@/components/ui/badge'
import { Clock, Zap, Target, CheckCircle, Brain, ShieldAlert, Sparkles } from 'lucide-react'

interface BehaviorAnalysisProps {
  topic?: string;
  grade?: string;
  studentStats?: any;
  studentName?: string;
}

export default function BehaviorAnalysis({ topic, grade = "6", studentStats, studentName = "İnci Məcidzadə" }: BehaviorAnalysisProps) {
  const timeData = [
    { question: 'Sual 1', studentTime: 18, benchmarkTime: 35, topic: 'Fonetika / Əsas qayda' },
    { question: 'Sual 2', studentTime: 22, benchmarkTime: 40, topic: 'Mətn təhlili' },
    { question: 'Sual 3', studentTime: 34, benchmarkTime: 55, topic: 'Kəsrlər üzərində əməl' },
    { question: 'Sual 4', studentTime: 42, benchmarkTime: 70, topic: 'Mürəkkəb tənlik' },
    { question: 'Sual 5', studentTime: 25, benchmarkTime: 45, topic: 'Python şərt operatoru' },
    { question: 'Sual 6', studentTime: 19, benchmarkTime: 38, topic: 'İngilis dili zamanlar' },
    { question: 'Sual 7', studentTime: 28, benchmarkTime: 50, topic: 'Həndəsi fiqurun sahəsi' },
    { question: 'Sual 8', studentTime: 31, benchmarkTime: 48, topic: 'Təbiət maddə mübadiləsi' },
    { question: 'Sual 9', studentTime: 38, benchmarkTime: 65, topic: 'Alqoritm blok-sxemi' },
    { question: 'Sual 10', studentTime: 20, benchmarkTime: 40, topic: 'Oxuyub-anlama ümumiləşdirmə' },
  ]

  const staminaData = [
    { minute: '1-ci dəq', attention: 98, avgPeers: 90 },
    { minute: '4-cü dəq', attention: 99, avgPeers: 86 },
    { minute: '8-ci dəq', attention: 97, avgPeers: 80 },
    { minute: '12-ci dəq', attention: 95, avgPeers: 72 },
    { minute: '16-cı dəq', attention: 96, avgPeers: 64 },
    { minute: '20-ci dəq', attention: 94, avgPeers: 58 },
  ]

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-white border-slate-200 shadow-xs">
          <CardHeader className="pb-1 pt-4 px-4">
            <CardTitle className="text-xs font-semibold text-slate-500 flex items-center justify-between">
              Orta Cavab Müddəti
              <Clock className="w-4 h-4 text-amber-500" />
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <p className="text-2xl font-bold text-slate-900">27.7 san</p>
            <span className="text-[11px] text-green-600 font-medium">Normadan 42% sürətli</span>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200 shadow-xs">
          <CardHeader className="pb-1 pt-4 px-4">
            <CardTitle className="text-xs font-semibold text-slate-500 flex items-center justify-between">
              Tələsmə İndeksi (Rush)
              <Zap className="w-4 h-4 text-blue-500" />
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <p className="text-2xl font-bold text-slate-900">4.1%</p>
            <span className="text-[11px] text-green-600 font-medium">Düşünülmüş və sakit</span>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200 shadow-xs">
          <CardHeader className="pb-1 pt-4 px-4">
            <CardTitle className="text-xs font-semibold text-slate-500 flex items-center justify-between">
              Tərəddüd İndeksi
              <Target className="w-4 h-4 text-indigo-500" />
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <p className="text-2xl font-bold text-slate-900">5.8%</p>
            <span className="text-[11px] text-indigo-600 font-medium">Yüksək qətiyyətlilik</span>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200 shadow-xs">
          <CardHeader className="pb-1 pt-4 px-4">
            <CardTitle className="text-xs font-semibold text-slate-500 flex items-center justify-between">
              Diqqət Dayanıqlılığı
              <Brain className="w-4 h-4 text-emerald-500" />
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <p className="text-2xl font-bold text-emerald-600">96.5%</p>
            <span className="text-[11px] text-emerald-600 font-medium">Test boyu stabildir</span>
          </CardContent>
        </Card>
      </div>

      {/* Visual Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-slate-200 shadow-xs">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold text-slate-800">Sual Üzrə Zaman İdarəetməsi (Xronometrika)</CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Şagirdin suala sərf etdiyi vaxt (saniyə) vs Sinif normativi
            </CardDescription>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={timeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="question" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis label={{ value: 'Saniyə', angle: -90, position: 'insideLeft', fontSize: 11 }} tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                  formatter={(val: any, name: any) => [`${val} saniyə`, name === 'studentTime' ? `${studentName}` : 'Orta Normativ']}
                />
                <Legend formatter={(val) => val === 'studentTime' ? `${studentName}` : 'Yaşıdların Ortalaması'} />
                <Bar dataKey="studentTime" fill="#f59e0b" name="studentTime" radius={[4, 4, 0, 0]} />
                <Bar dataKey="benchmarkTime" fill="#cbd5e1" name="benchmarkTime" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-xs">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold text-slate-800">Test Boyu Konsentrasiya və Diqqət Əyrisi</CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Zaman keçdikcə şagirdin yorulma və diqqət yayınma dinamikası (%)
            </CardDescription>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={staminaData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="minute" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis domain={[40, 100]} tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                  formatter={(val: any, name: any) => [`${val}%`, name === 'attention' ? `${studentName}` : 'Yaşıdlar']}
                />
                <Legend formatter={(val) => val === 'attention' ? `${studentName} (Konsentrasiya)` : 'Ümumi Şagirdlər'} />
                <Area type="monotone" dataKey="attention" stroke="#10b981" fill="#d1fae5" strokeWidth={2} />
                <Area type="monotone" dataKey="avgPeers" stroke="#94a3b8" fill="#f1f5f9" strokeWidth={2} strokeDasharray="4 4" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      
      {/* Comprehensive Behavioral Diagnostic */}
      <Card className="bg-gradient-to-r from-emerald-50/70 via-teal-50/50 to-blue-50/70 border-emerald-200 shadow-xs">
        <CardContent className="p-5">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-bold text-slate-900">
                Pedaqoji Davranış və Zaman Diaqnostikası • {studentName}
              </h4>
              <ul className="text-xs text-slate-700 space-y-1.5 list-disc pl-4">
                <li><strong>Optimal Zaman Balansı:</strong> Şagird asan suallara (məsələn, Sual 1 və 6) cəmi 18-19 saniyə vaxt ayırır, mürəkkəb hesablamalı suallara (Sual 4) isə 42 saniyə təyin edərək vaxtını şüurlu idarə edir.</li>
                <li><strong>Yorulma Əlamətinin Olmaması:</strong> Əksər şagirdlərdə testin 15-ci dəqiqəsindən sonra diqqət 60%-ə enir, lakin {studentName} 20-ci dəqiqədə belə <strong>94% konsentrasiya</strong> nümayiş etdirir.</li>
                <li><strong>Özünəinam və Dəqiqlik:</strong> Cavabı dəyişmə və tərəddüd göstəricisi cəmi 5.8%-dir. Birinci oxunuşda sualın mahiyyətini dərhal qavrayır.</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
