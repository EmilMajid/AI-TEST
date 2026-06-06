'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'

export default function ItemAnalysis({ topic, grade }: { topic: string, grade: string }) {
  // Mock data for Item Analysis
  const items = [
    { id: 'Q101', text: 'Mövzu ilə bağlı əsas anlayış...', difficulty: 0.85, discrimination: 0.42, status: 'Yaxşı' },
    { id: 'Q102', text: 'Nümunədə verilmiş situasiyanı...', difficulty: 0.45, discrimination: 0.65, status: 'Əla' },
    { id: 'Q103', text: 'Aşağıdakılardan hansı yanlışdır?', difficulty: 0.15, discrimination: 0.12, status: 'Çox Çətin / Yenidən Bax' },
    { id: 'Q104', text: 'Qanuna əsasən nəticə...', difficulty: 0.95, discrimination: 0.05, status: 'Çox Asan' },
    { id: 'Q105', text: 'Düsturdan istifadə edərək...', difficulty: 0.55, discrimination: -0.15, status: 'Problemli (Mənfi Ayıredicilik)' },
  ]

  const getStatusBadge = (status: string) => {
    if (status.includes('Yaxşı') || status.includes('Əla')) return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">{status}</Badge>
    if (status.includes('Çətin') || status.includes('Problemli')) return <Badge variant="destructive">{status}</Badge>
    return <Badge variant="outline">{status}</Badge>
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Element Analizi (Item Analysis)</CardTitle>
          <CardDescription>Hər bir sualın çətinlik (Difficulty Index) və ayıredicilik (Discrimination Index) göstəriciləri</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sual ID</TableHead>
                  <TableHead>Mətn (qısa)</TableHead>
                  <TableHead>Çətinlik İndeksi (p)</TableHead>
                  <TableHead>Ayıredicilik (D)</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.id}</TableCell>
                    <TableCell className="truncate max-w-xs">{item.text}</TableCell>
                    <TableCell>{item.difficulty} {(item.difficulty > 0.8 ? '(Asan)' : item.difficulty < 0.3 ? '(Çətin)' : '(Orta)')}</TableCell>
                    <TableCell className={item.discrimination < 0 ? 'text-red-500 font-bold' : ''}>
                      {item.discrimination}
                    </TableCell>
                    <TableCell>{getStatusBadge(item.status)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          <div className="mt-6 space-y-4 text-sm text-slate-600 bg-slate-50 p-4 rounded-lg">
            <p><strong>Çətinlik İndeksi (Difficulty Index):</strong> Sualı doğru cavablandıranların ümumi iştirakçılara nisbətidir. 0.8-dən yuxarı asan, 0.2-dən aşağı çox çətin sayılır.</p>
            <p><strong>Ayıredicilik İndeksi (Discrimination Index):</strong> Yüksək bal toplayanlarla aşağı bal toplayanların bu sualdakı fərqidir. Mənfi rəqəm o deməkdir ki, zəif oxuyanlar sualı düz yazıb, əlaçılar səhv (sualda məntiq xətası ola bilər).</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
