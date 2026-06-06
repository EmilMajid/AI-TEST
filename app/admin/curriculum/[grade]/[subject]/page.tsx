import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Book, ArrowLeft } from 'lucide-react'
import textbooksData from '@/data/textbooks.json'
import { Button } from '@/components/ui/button'

export default function SubjectTextbooksPage({ 
  params, 
  searchParams 
}: { 
  params: { grade: string, subject: string },
  searchParams: { subjectName?: string } 
}) {
  const grade = params.grade
  const subjectSlug = params.subject
  // Reconstruct subject name or use query param if available
  const subjectName = searchParams.subjectName || subjectSlug

  // Get textbooks for this grade
  const gradeTextbooks = (textbooksData as any)[grade] || []
  
  // Filter by subject
  const availableTextbooks = gradeTextbooks.filter((tb: any) => {
    // Basic matching, could be improved if subject names have slight mismatches
    return tb.subject.toLowerCase() === subjectName.toLowerCase() || 
           subjectName.toLowerCase().includes(tb.subject.toLowerCase()) ||
           tb.subject.toLowerCase().includes(subjectName.toLowerCase())
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/admin/curriculum/${grade}`}>
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{grade}-ci Sinif - {subjectName}</h1>
          <p className="text-muted-foreground mt-1">
            Bu fənn üzrə tədris olunan dərsliklər
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {availableTextbooks.map((textbook: any) => (
          <Link key={textbook.id} href={`/admin/curriculum/${grade}/${subjectSlug}/${textbook.id}?subjectName=${encodeURIComponent(subjectName)}`}>
            <Card className="hover:bg-slate-50 transition-colors cursor-pointer border-l-4 border-l-purple-500 h-full flex flex-col">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl flex items-start gap-2">
                  <Book className="h-5 w-5 text-purple-500 mt-1 shrink-0" />
                  <span className="line-clamp-2">{textbook.title}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-end">
                <p className="text-sm text-slate-500 mt-4">Mövzulara və testlərə bax</p>
              </CardContent>
            </Card>
          </Link>
        ))}
        {availableTextbooks.length === 0 && (
          <div className="col-span-full p-8 text-center bg-slate-50 rounded-lg border border-dashed">
            <p className="text-slate-500">Bu fənn üzrə dərslik tapılmadı.</p>
          </div>
        )}
      </div>
    </div>
  )
}
