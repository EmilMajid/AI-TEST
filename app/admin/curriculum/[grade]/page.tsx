import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BookMarked, ArrowLeft } from 'lucide-react'
import subjectsData from '@/data/subjects.json'
import { Button } from '@/components/ui/button'

export default function GradeSubjectsPage({ params }: { params: { grade: string } }) {
  const grade = params.grade
  
  // Filter subjects that are available for this grade
  const availableSubjects = subjectsData.subjects.filter(
    (subject: any) => subject.grades[grade] === true
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/curriculum">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{grade}-ci Sinif - Fənlər</h1>
          <p className="text-muted-foreground mt-1">
            Bu sinif üçün tədris olunan fənlər
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {availableSubjects.map((subject: any) => {
          // Slugify subject name for URL (e.g. "Azərbaycan dili" -> "azerbaycan-dili")
          const subjectSlug = subject.name.toLowerCase().replace(/ə/g, 'e').replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ü/g, 'u').replace(/ş/g, 's').replace(/ç/g, 'c').replace(/ğ/g, 'g').replace(/[^a-z0-9]+/g, '-')
          
          return (
            <Link key={subject.name} href={`/admin/curriculum/${grade}/${subjectSlug}?subjectName=${encodeURIComponent(subject.name)}`}>
              <Card className="hover:bg-slate-50 transition-colors cursor-pointer border-l-4 border-l-green-500">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl flex items-center gap-2">
                    <BookMarked className="h-5 w-5 text-green-500" />
                    {subject.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-500">Dərsliklərə bax</p>
                </CardContent>
              </Card>
            </Link>
          )
        })}
        {availableSubjects.length === 0 && (
          <div className="col-span-full p-8 text-center bg-slate-50 rounded-lg border border-dashed">
            <p className="text-slate-500">Bu sinif üçün fənn tapılmadı.</p>
          </div>
        )}
      </div>
    </div>
  )
}
