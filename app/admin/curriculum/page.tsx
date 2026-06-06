import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BookOpen } from 'lucide-react'

export default function CurriculumGradesPage() {
  const grades = Array.from({ length: 11 }, (_, i) => i + 1)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Tədris Proqramı və Analitika</h1>
        <p className="text-muted-foreground mt-2">
          Test analitikasına və fənn iyerarxiyasına baxmaq üçün sinif seçin.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {grades.map((grade) => (
          <Link key={grade} href={`/admin/curriculum/${grade}`}>
            <Card className="hover:bg-slate-50 transition-colors cursor-pointer border-l-4 border-l-blue-500">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-blue-500" />
                  {grade}-ci Sinif
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-500">Fənlər və dərsliklər</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
