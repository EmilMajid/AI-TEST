export const dynamic = "force-dynamic"
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const topic = searchParams.get('topic')
  const grade = searchParams.get('grade')

  if (!topic || !grade) {
    return NextResponse.json({ error: 'Mövzu və sinif qeyd edilməlidir' }, { status: 400 })
  }

  try {
    // 1. Fetch real data if it exists in the database
    // const results = await prisma.testResult.findMany({
    //   where: { topic, class: grade }
    // })

    // For now, we return mock architecture ready to be connected to the real ML Python backend or DB
    
    return NextResponse.json({
      success: true,
      topic,
      grade,
      descriptive: {
        totalAttempts: 1245,
        meanScore: 68.5,
        medianScore: 70,
        modeScore: 75,
        passRate: 72,
        scoreDistribution: [
          { name: '0-20', count: 45 },
          { name: '21-40', count: 120 },
          { name: '41-60', count: 350 },
          { name: '61-80', count: 480 },
          { name: '81-100', count: 250 },
        ],
        correctnessRatio: [
          { name: 'Doğru', value: 7200, color: '#22c55e' },
          { name: 'Səhv', value: 2800, color: '#ef4444' },
        ]
      },
      itemAnalysis: [
        { id: 'Q101', text: 'Mövzu ilə bağlı əsas anlayış...', difficulty: 0.85, discrimination: 0.42, status: 'Yaxşı' },
        { id: 'Q102', text: 'Nümunədə verilmiş situasiyanı...', difficulty: 0.45, discrimination: 0.65, status: 'Əla' },
      ],
      behavior: {
        timeData: [
          { question: 'Q1', time: 15 },
          { question: 'Q2', time: 25 },
        ],
        dropOutData: [
          { question: 'Q1', remaining: 100 },
          { question: 'Q2', remaining: 98 },
        ]
      },
      clustering: {
        points: [
          { x: 120, y: 85, z: 200, cluster: 0, profile: 'Sürətli və Dəqiq' },
          { x: 450, y: 92, z: 150, cluster: 1, profile: 'Yavaş amma Dəqiq' }
        ]
      }
    })
  } catch (error) {
    console.error('Analytics API Error:', error)
    return NextResponse.json({ error: 'Məlumatları yükləyərkən xəta baş verdi' }, { status: 500 })
  }
}
