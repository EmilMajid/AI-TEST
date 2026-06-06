import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ListTree, ArrowLeft, BarChart } from 'lucide-react'
import textbooksData from '@/data/textbooks.json'
import { Button } from '@/components/ui/button'
import TopicDifficultyMap from '@/components/admin/analytics/TopicDifficultyMap'

export default function TextbookTopicsPage({ 
  params, 
  searchParams 
}: { 
  params: { grade: string, subject: string, textbook: string },
  searchParams: { subjectName?: string } 
}) {
  const { grade, subject, textbook: textbookId } = params
  const subjectName = searchParams.subjectName || subject

  const gradeTextbooks = (textbooksData as any)[grade] || []
  const textbook = gradeTextbooks.find((tb: any) => tb.id === textbookId)

  // Parse topics from the text string
  let topics: string[] = []
  if (textbook && textbook.topics) {
    const rawTopics = textbook.topics.split('\n').map((t: string) => t.trim()).filter(Boolean)
    topics = rawTopics
  }

  if (!textbook) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold">Dərslik tapılmadı</h2>
        <Link href={`/admin/curriculum/${grade}/${subject}?subjectName=${encodeURIComponent(subjectName)}`}>
          <Button className="mt-4">Geri Qayıt</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Link href={`/admin/curriculum/${grade}/${subject}?subjectName=${encodeURIComponent(subjectName)}`}>
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{textbook.title}</h1>
          <p className="text-muted-foreground mt-1">
            Dərsliyə aid mövzular və test analitikası
          </p>
        </div>
      </div>

      <TopicDifficultyMap grade={grade} subject={subjectName} />

      <div>
        <h2 className="text-2xl font-bold mb-4">Mövzular</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {topics.map((topic: string, index: number) => {
            const isSection = topic.toUpperCase() === topic && !/^\d/.test(topic)
            
            if (isSection) {
              return (
                <div key={`section-${index}`} className="col-span-full mt-6 mb-2">
                  <h3 className="text-xl font-bold text-slate-800 border-b pb-2">{topic}</h3>
                </div>
              )
            }

            return (
              <Link 
                key={`topic-${index}`} 
                href={`/admin/curriculum/${grade}/${subject}/${textbookId}/${encodeURIComponent(topic)}?subjectName=${encodeURIComponent(subjectName)}&textbookTitle=${encodeURIComponent(textbook.title)}`}
              >
                <Card className="hover:bg-slate-50 transition-colors cursor-pointer border-l-4 border-l-orange-500 h-full flex flex-col">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-start gap-2 font-medium">
                      <ListTree className="h-5 w-5 text-orange-500 mt-0.5 shrink-0" />
                      <span>{topic}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 flex items-end">
                    <div className="w-full flex items-center justify-between text-sm text-slate-500 mt-4">
                      <span>Testləri İdarə Et</span>
                      <BarChart className="h-4 w-4" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
          {topics.length === 0 && (
            <div className="col-span-full p-8 text-center bg-slate-50 rounded-lg border border-dashed">
              <p className="text-slate-500">Bu dərslik üçün mövzu tapılmadı.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
