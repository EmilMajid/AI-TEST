'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

// We will create these components next
import DescriptiveStats from '@/components/admin/analytics/DescriptiveStats'
import ItemAnalysis from '@/components/admin/analytics/ItemAnalysis'
import BehaviorAnalysis from '@/components/admin/analytics/BehaviorAnalysis'
import ClusterAnalysis from '@/components/admin/analytics/ClusterAnalysis'
import MonetizationControl from '@/components/admin/analytics/MonetizationControl'
import BloomAnalysis from '@/components/admin/analytics/BloomAnalysis'

export default function TopicAnalyticsPage({ 
  params, 
  searchParams 
}: { 
  params: { grade: string, subject: string, textbook: string, topic: string },
  searchParams: { subjectName?: string, textbookTitle?: string } 
}) {
  const { grade, subject, textbook, topic } = params
  const decodedTopic = decodeURIComponent(topic)
  const subjectName = searchParams.subjectName || subject
  const textbookTitle = searchParams.textbookTitle || textbook

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/admin/curriculum/${grade}/${subject}/${textbook}?subjectName=${encodeURIComponent(subjectName)}`}>
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight line-clamp-1" title={decodedTopic}>{decodedTopic}</h1>
          <p className="text-muted-foreground mt-1">
            {grade}-ci Sinif • {subjectName} • {textbookTitle}
          </p>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-7 h-auto mb-6">
          <TabsTrigger value="overview" className="py-2">Ümumi (Descriptive)</TabsTrigger>
          <TabsTrigger value="item" className="py-2">Sual Analizi (Item)</TabsTrigger>
          <TabsTrigger value="behavior" className="py-2">Davranış (Behavior)</TabsTrigger>
          <TabsTrigger value="cluster" className="py-2">Seqmentasiya</TabsTrigger>
          <TabsTrigger value="bloom" className="py-2">Bloom Taksonomiyası</TabsTrigger>
          <TabsTrigger value="monetization" className="py-2">Ödənişli İdarəetmə</TabsTrigger>
          <TabsTrigger value="questions" className="py-2">Test Sualları</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-0">
          <DescriptiveStats topic={decodedTopic} grade={grade} />
        </TabsContent>
        
        <TabsContent value="item" className="mt-0">
          <ItemAnalysis topic={decodedTopic} grade={grade} />
        </TabsContent>
        
        <TabsContent value="behavior" className="mt-0">
          <BehaviorAnalysis topic={decodedTopic} grade={grade} />
        </TabsContent>
        
        <TabsContent value="cluster" className="mt-0">
          <ClusterAnalysis topic={decodedTopic} grade={grade} />
        </TabsContent>

        <TabsContent value="bloom" className="mt-0">
          <BloomAnalysis topic={decodedTopic} grade={grade} />
        </TabsContent>

        <TabsContent value="monetization" className="mt-0">
          <MonetizationControl topic={decodedTopic} grade={grade} />
        </TabsContent>
        
        <TabsContent value="questions" className="mt-0 bg-white p-6 rounded-lg border shadow-sm">
          <h2 className="text-xl font-bold mb-4">Test Bankı Sualları</h2>
          <p className="text-slate-500 mb-4">Bu mövzu üzrə mövcud testlərin siyahısı və redaktəsi burada yerləşəcək.</p>
          <Link href={`/admin/test-bank/questions?topic=${encodeURIComponent(decodedTopic)}`}>
            <Button>Sual Bankına Keç</Button>
          </Link>
        </TabsContent>
      </Tabs>
    </div>
  )
}
