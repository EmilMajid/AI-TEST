'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Sparkles, HelpCircle, CheckCircle2, ChevronRight, Filter } from 'lucide-react'

interface ItemAnalysisProps {
  topic?: string;
  grade?: string;
  studentStats?: any;
  studentName?: string;
}

export default function ItemAnalysis({ topic, grade = "6", studentStats, studentName = "İnci Məcidzadə" }: ItemAnalysisProps) {
  const [selectedSubject, setSelectedSubject] = useState<string>('all')
  const [activeItem, setActiveItem] = useState<any>(null)

  const items = [
    { 
      id: 'Q-AZ-601', 
      subject: 'Azərbaycan dili', 
      text: 'Hansı cümlədə feilin xəbər şəkli indiki zamanda işlənmişdir?', 
      difficulty: 0.88, 
      discrimination: 0.54, 
      status: 'Əla',
      correctOpt: 'B',
      distractors: { A: '4%', B: '88% (Düzgün)', C: '5%', D: '3%' },
      pedagogy: 'Şagirdlər zaman şəkilçilərini (-ır⁴) dəqiq fərqləndirir. Ayıredicilik əmsalı yüksəkdir.'
    },
    { 
      id: 'Q-AZ-602', 
      subject: 'Azərbaycan dili', 
      text: 'Mətndə verilmiş "ürəyinə yatmaq" frazeoloji birləşməsinin kontekstə uyğun mənası hansıdır?', 
      difficulty: 0.74, 
      discrimination: 0.65, 
      status: 'Yüksək Ayıredici',
      correctOpt: 'C',
      distractors: { A: '12%', B: '8%', C: '74% (Düzgün)', D: '6%' },
      pedagogy: 'Məcazi mənaların və sabit söz birləşmələrinin qavranılması səviyyəsini dəqiq ölçən sual.'
    },
    { 
      id: 'Q-MA-603', 
      subject: 'Riyaziyyat', 
      text: '0,(6) sonsuz dövri onluq kəsrini adi kəsr kimi göstərin və ixtisar edin.', 
      difficulty: 0.68, 
      discrimination: 0.72, 
      status: 'Əla',
      correctOpt: 'A',
      distractors: { A: '68% (Düzgün - 2/3)', B: '18% (6/10)', C: '10% (3/5)', D: '4% (6/99)' },
      pedagogy: 'B variantı (6/10) adi onluq kəsrlə qarışdıran şagirdləri aşkara çıxaran güclü distraktordur.'
    },
    { 
      id: 'Q-MA-604', 
      subject: 'Riyaziyyat', 
      text: 'Düzbucaqlının perimetri 36 sm, eni uzunluğundan 4 sm qısadır. Sahəsini tapın.', 
      difficulty: 0.62, 
      discrimination: 0.78, 
      status: 'Yüksək Ayıredici',
      correctOpt: 'D',
      distractors: { A: '12%', B: '15%', C: '11%', D: '62% (Düzgün - 77 sm²)' },
      pedagogy: 'İki mərhələli məntiqi tənlik qurma bacarığını mükəmməl test edir.'
    },
    { 
      id: 'Q-INF-605', 
      subject: 'İnformatika', 
      text: 'Python proqramlaşdırma dilində budaqlanan alqoritmləri reallaşdırmaq üçün hansı konstruksiyadan istifadə olunur?', 
      difficulty: 0.92, 
      discrimination: 0.48, 
      status: 'Əla',
      correctOpt: 'B',
      distractors: { A: '3%', B: '92% (Düzgün - if-elif-else)', C: '3%', D: '2%' },
      pedagogy: 'Əsas sintaksis və alqoritm anlayışı şagirdlər tərəfindən mükəmməl mənimsənilib.'
    },
    { 
      id: 'Q-INF-606', 
      subject: 'İnformatika', 
      text: 'Alqoritmin hər bir addımının birmənalı və dəqiq icra olunmasını ifadə edən xassəsi hansıdır?', 
      difficulty: 0.82, 
      discrimination: 0.58, 
      status: 'Əla',
      correctOpt: 'C',
      distractors: { A: '6%', B: '8%', C: '82% (Düzgün - Müəyyənlik)', D: '4%' },
      pedagogy: 'Alqoritmin xassələrinin nəzəri fərqləndirilməsi üzrə etibarlı sual.'
    },
    { 
      id: 'Q-EN-607', 
      subject: 'İngilis dili', 
      text: 'Choose the correct tense: "While Aylin _____ a book, the lights went out."', 
      difficulty: 0.76, 
      discrimination: 0.62, 
      status: 'Yaxşı',
      correctOpt: 'A',
      distractors: { A: '76% (Düzgün - was reading)', B: '14% (read)', C: '6% (is reading)', D: '4% (reads)' },
      pedagogy: 'Past Continuous ilə Past Simple-ın qarşılıqlı əlaqəsini təhlil edən optimal sual.'
    },
    { 
      id: 'Q-TB-608', 
      subject: 'Təbiət', 
      text: 'Bitkilərdə fotosintez prosesi zamanı hansı qaz xaric olunur və nə udulur?', 
      difficulty: 0.86, 
      discrimination: 0.52, 
      status: 'Əla',
      correctOpt: 'D',
      distractors: { A: '4%', B: '6%', C: '4%', D: '86% (Düzgün - Oksigen xaric olur, Karbon qazı udulur)' },
      pedagogy: 'Təbiət elmləri üzrə baza bioloji proseslərin qavranılması əla səviyyədədir.'
    }
  ]

  const filteredItems = selectedSubject === 'all' ? items : items.filter(i => i.subject === selectedSubject)

  const getStatusBadge = (status: string) => {
    if (status.includes('Əla')) return <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">{status}</Badge>
    if (status.includes('Yüksək')) return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">{status}</Badge>
    if (status.includes('Yaxşı')) return <Badge className="bg-indigo-100 text-indigo-800 hover:bg-indigo-100">{status}</Badge>
    return <Badge variant="outline">{status}</Badge>
  }

  return (
    <div className="space-y-6">
      <Card className="border-slate-200 shadow-xs">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
                Sual və Element Analizi (Psychometric Item Analysis)
                <Badge className="bg-amber-100 text-amber-800 font-medium">Süni İntellekt Qiymətləndirməsi</Badge>
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Hər bir sualın Çətinlik İndeksi (p-value), Ayıredicilik Əmsalı (D-index) və Distraktor Paylanması
              </CardDescription>
            </div>
            {/* Subject Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              {[
                { id: 'all', label: 'Bütün Fənlər' },
                { id: 'Riyaziyyat', label: 'Riyaziyyat' },
                { id: 'Azərbaycan dili', label: 'Azərbaycan dili' },
                { id: 'İnformatika', label: 'İnformatika' },
                { id: 'İngilis dili', label: 'İngilis dili' },
                { id: 'Təbiət', label: 'Təbiət' }
              ].map(tab => (
                <Button
                  key={tab.id}
                  variant={selectedSubject === tab.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedSubject(tab.id)}
                  className="text-xs h-8 px-3"
                >
                  {tab.label}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-slate-200 overflow-x-auto w-full max-w-full">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead className="w-[110px] font-semibold text-slate-700">Sual Kodu</TableHead>
                  <TableHead className="w-[130px] font-semibold text-slate-700">Fənn</TableHead>
                  <TableHead className="font-semibold text-slate-700">Sualın Məzmunu</TableHead>
                  <TableHead className="w-[130px] font-semibold text-slate-700">Çətinlik (p)</TableHead>
                  <TableHead className="w-[120px] font-semibold text-slate-700">Ayıredicilik (D)</TableHead>
                  <TableHead className="w-[120px] font-semibold text-slate-700">Status</TableHead>
                  <TableHead className="w-[60px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.map((item) => (
                  <TableRow 
                    key={item.id} 
                    className={`cursor-pointer transition-colors ${activeItem?.id === item.id ? 'bg-amber-50/70' : 'hover:bg-slate-50/80'}`}
                    onClick={() => setActiveItem(activeItem?.id === item.id ? null : item)}
                  >
                    <TableCell className="font-mono text-xs font-semibold text-slate-800">{item.id}</TableCell>
                    <TableCell className="text-xs font-medium text-slate-600">{item.subject}</TableCell>
                    <TableCell className="text-xs font-normal text-slate-800 max-w-md truncate">{item.text}</TableCell>
                    <TableCell className="text-xs">
                      <span className="font-semibold">{item.difficulty}</span>{' '}
                      <span className="text-[11px] text-slate-500">
                        {item.difficulty >= 0.8 ? '(Asan)' : item.difficulty >= 0.6 ? '(Orta)' : '(Çətin)'}
                      </span>
                    </TableCell>
                    <TableCell className="text-xs font-semibold text-emerald-600">
                      +{item.discrimination}
                    </TableCell>
                    <TableCell>{getStatusBadge(item.status)}</TableCell>
                    <TableCell>
                      <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${activeItem?.id === item.id ? 'rotate-90 text-amber-600' : ''}`} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Expanded Item Details Modal / Card */}
          {activeItem && (
            <div className="mt-4 p-4 rounded-xl border border-amber-200 bg-amber-50/50 space-y-3 animate-in fade-in-50 duration-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge className="bg-amber-600 text-white font-mono text-xs">{activeItem.id}</Badge>
                  <span className="font-bold text-sm text-slate-800">{activeItem.subject}</span>
                </div>
                <span className="text-xs text-slate-500">Düzgün Cavab: <strong className="text-green-700 text-sm">{activeItem.correctOpt}</strong></span>
              </div>
              
              <p className="text-xs text-slate-800 font-medium bg-white p-3 rounded-lg border border-slate-200">
                {activeItem.text}
              </p>

              <div>
                <p className="text-xs font-semibold text-slate-700 mb-2">Variantların Şagirdlər Üzrə Paylanması (Distraktor Analizi):</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {Object.entries(activeItem.distractors).map(([opt, val]: [string, any]) => (
                    <div key={opt} className={`p-2.5 rounded-lg border text-xs ${opt === activeItem.correctOpt ? 'bg-green-50 border-green-300 font-semibold text-green-800' : 'bg-white border-slate-200 text-slate-600'}`}>
                      <span className="font-bold mr-1.5">{opt})</span> {val}
                    </div>
                  ))}
                </div>
              </div>

              <p className="text-xs text-slate-600 italic bg-white/80 p-2.5 rounded-lg border border-slate-100">
                💡 <strong>Pedaqoji İzah:</strong> {activeItem.pedagogy}
              </p>
            </div>
          )}

          {/* Explanatory footer */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div>
              <p className="font-bold text-slate-800 mb-1">Çətinlik İndeksi (Difficulty Index, p):</p>
              <p>Sualı doğru cavablandıranların ümumi şagird sayına nisbətidir. 0.80-dən yuxarı asan, 0.50-0.79 optimal orta, 0.30-dan aşağı mürəkkəb sayılır.</p>
            </div>
            <div>
              <p className="font-bold text-slate-800 mb-1">Ayıredicilik Əmsalı (Discrimination Index, D):</p>
              <p>Yüksək bal toplayanlarla zəif bal toplayanların bu sualdakı fərqidir. +0.40-dan yuxarı göstərici sualın əla keyfiyyətli və obyektiv olduğunu göstərir.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
