'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts'
import { Badge } from '@/components/ui/badge'
import { Brain, Sparkles, CheckCircle2, Award, Zap, Layers } from 'lucide-react'

interface BloomAnalysisProps {
  topic?: string;
  grade?: string;
  studentStats?: any;
  studentName?: string;
}

export default function BloomAnalysis({ topic, grade = "6", studentStats, studentName = "İnci Məcidzadə" }: BloomAnalysisProps) {
  const avgScore = studentStats?.averageScore || 93

  const bloomData = [
    { subject: 'Xatırlama (Remember)', student: 98, peers: 82, fullMark: 100, desc: 'Fakt və terminləri yadda saxlama' },
    { subject: 'Anlama (Understand)', student: 96, peers: 74, fullMark: 100, desc: 'Mənanı dərk etmə və izah etmə' },
    { subject: 'Tətbiq (Apply)', student: Math.min(100, avgScore + 1), peers: 65, fullMark: 100, desc: 'Qaydaları yeni situasiyada işlətmə' },
    { subject: 'Analiz (Analyze)', student: Math.max(86, avgScore - 3), peers: 48, fullMark: 100, desc: 'Hissələrə ayırma və məntiqi bağ' },
    { subject: 'Dəyərləndirmə (Evaluate)', student: Math.max(84, avgScore - 5), peers: 38, fullMark: 100, desc: 'Mühakimə və tənqidi qiymətləndirmə' },
    { subject: 'Yaratma (Create)', student: Math.max(80, avgScore - 9), peers: 26, fullMark: 100, desc: 'Yeni ideya və həll yolu irəli sürmə' },
  ]

  return (
    <div className="space-y-6">
      <Card className="border-slate-200 shadow-xs">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
                Bloom Taksonomiyası üzrə Koqnitiv Xəritə
                <Badge className="bg-purple-100 text-purple-800 font-medium">Koqnitiv İndeks: 92/100</Badge>
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Şagirdin sualların idrak (koqnitiv) təbəqələrinə görə qavrama səviyyəsi vs Respublika ortalaması
              </CardDescription>
            </div>
            <Badge className="bg-purple-600 text-white font-semibold flex items-center gap-1 shadow-xs">
              <Brain className="w-3.5 h-3.5" /> Yüksək Tərtibli Təfəkkür (HOTS)
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="h-88 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="72%" data={bloomData}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#334155', fontSize: 11, fontWeight: 500 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                  <Radar 
                    name={`${studentName} (Nəticə %)`} 
                    dataKey="student" 
                    stroke="#8b5cf6" 
                    fill="#8b5cf6" 
                    fillOpacity={0.45} 
                    strokeWidth={2}
                  />
                  <Radar 
                    name="Respublika Ortalaması (%)" 
                    dataKey="peers" 
                    stroke="#94a3b8" 
                    fill="#94a3b8" 
                    fillOpacity={0.2} 
                    strokeDasharray="4 4"
                    strokeWidth={1.5}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                    formatter={(val: any, name: any) => [`${val}%`, name]}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="space-y-3.5">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2 border-b pb-2">
                <Layers className="w-4 h-4 text-purple-600" /> Koqnitiv Səviyyələrin Qiymətləndirilməsi
              </h3>
              
              <div className="space-y-2.5">
                {/* Lower Order Thinking Skills */}
                <div className="flex justify-between items-center bg-emerald-50/70 border border-emerald-200 p-2.5 rounded-xl">
                  <div>
                    <span className="font-bold text-xs text-emerald-900 block">Baza Səviyyə (Xatırlama & Anlama)</span>
                    <span className="text-[11px] text-emerald-700">Mükəmməl mənimsənilib • Baza biliklər tam formalaşıb</span>
                  </div>
                  <Badge className="bg-emerald-600 text-white font-bold text-xs">97%</Badge>
                </div>

                {/* Medium Order Thinking Skills */}
                <div className="flex justify-between items-center bg-blue-50/70 border border-blue-200 p-2.5 rounded-xl">
                  <div>
                    <span className="font-bold text-xs text-blue-900 block">Tətbiqetmə Səviyyəsi (Apply)</span>
                    <span className="text-[11px] text-blue-700">Praktik məsələ həlli və situasiya modelləşdirməsi</span>
                  </div>
                  <Badge className="bg-blue-600 text-white font-bold text-xs">{bloomData[2].student}%</Badge>
                </div>

                {/* Higher Order Thinking Skills */}
                <div className="flex justify-between items-center bg-purple-50/70 border border-purple-200 p-2.5 rounded-xl">
                  <div>
                    <span className="font-bold text-xs text-purple-900 block">Yüksək Tərtibli Təfəkkür (Analiz, Dəyərləndirmə, Yaratma)</span>
                    <span className="text-[11px] text-purple-700">Respublika ortalamasından (36%) <strong>+51% daha yüksək</strong></span>
                  </div>
                  <Badge className="bg-purple-600 text-white font-bold text-xs">87%</Badge>
                </div>
              </div>
              
              <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200 leading-relaxed">
                💡 <strong>Pedaqoji Nəticə:</strong> Şagird nəinki faktoloji yadda saxlama (98%), həm də mürəkkəb təhlil və sintez (Analiz 90%, Dəyərləndirmə 88%) mərhələlərində respublika üzrə ən yüksək lider göstəricilərə malikdir. Şagirdin təfəkkür profili gələcək mühəndislik, süni intellekt və elmi-tədqiqat istiqamətləri üçün ideal zəmindir.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
