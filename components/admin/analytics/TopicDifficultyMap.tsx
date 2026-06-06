'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function TopicDifficultyMap({ grade, subject }: { grade: string, subject: string }) {
  // Mock data representing the success rate (difficulty) of topics
  const topics = [
    { name: 'Feodal münasibətlərinin inkişafı', successRate: 92, status: 'easy' },
    { name: 'Ərəb işğalına qarşı mübarizə. Cavanşir', successRate: 81, status: 'medium' },
    { name: 'Xilafət dövründə idarəetmə', successRate: 75, status: 'medium' },
    { name: 'Xürrəmilər hərəkatı. Babək', successRate: 34, status: 'hard' },
    { name: 'İslamın milli və mədəni inkişafa təsiri', successRate: 45, status: 'hard' },
    { name: 'Müstəqil dövlətçiliyin bərpası', successRate: 88, status: 'easy' },
    { name: 'Azərbaycan vahid dövlət tərkibində', successRate: 60, status: 'medium' },
    { name: 'Slavyanların hücumları', successRate: 52, status: 'hard' },
  ]

  const getColorClass = (rate: number) => {
    if (rate >= 80) return 'bg-green-100 text-green-800 border-green-200'
    if (rate >= 60) return 'bg-blue-100 text-blue-800 border-blue-200'
    if (rate >= 50) return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    return 'bg-red-100 text-red-800 border-red-200'
  }

  const getIntensityClass = (rate: number) => {
    if (rate >= 80) return 'bg-green-500'
    if (rate >= 60) return 'bg-blue-500'
    if (rate >= 50) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mövzu Çətinlik Xəritəsi (Heatmap)</CardTitle>
        <CardDescription>
          Şagirdlərin mövzular üzrə göstərdiyi orta uğur faizi. Qırmızı rəng problem olan mövzuları, yaşıl isə asan mənimsənilən mövzuları göstərir.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {topics.map((topic, idx) => (
            <div key={idx} className={`p-4 rounded-lg border ${getColorClass(topic.successRate)} transition-all hover:scale-[1.02] cursor-pointer`}>
              <div className="flex justify-between items-start gap-2 mb-3">
                <h3 className="font-semibold text-sm line-clamp-2" title={topic.name}>{topic.name}</h3>
                <Badge className={`${getIntensityClass(topic.successRate)} text-white hover:${getIntensityClass(topic.successRate)} shadow-none`}>
                  {topic.successRate}%
                </Badge>
              </div>
              
              {/* Mini progress bar showing success */}
              <div className="w-full bg-white/50 rounded-full h-1.5 mt-2">
                <div 
                  className={`h-1.5 rounded-full ${getIntensityClass(topic.successRate)}`} 
                  style={{ width: `${topic.successRate}%` }}
                ></div>
              </div>

              {topic.successRate < 50 && (
                <div className="mt-3 text-xs bg-white/60 p-2 rounded text-red-900 font-medium">
                  ⚠️ Bu mövzu üzrə əlavə video izah və ya sadələşdirilmiş testlər təyin edilməsi tövsiyə olunur.
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
