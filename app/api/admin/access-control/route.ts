export const dynamic = "force-dynamic"
import { NextResponse } from 'next/server'
import path from 'path'
import fs from 'fs'

const dataDir = path.join(process.cwd(), 'data')
const accessControlPath = path.join(dataDir, 'access_control.json')

const defaultGlobalSettings = [
  // Parent Dashboard Tabs
  { id: 'overviewTab', name: 'Ümumi Göstəricilər Tabı', isFree: true, desc: 'Güclü/Zəif tərəflər və ümumi qrafik' },
  { id: 'subjectsTab', name: 'Fənlər Üzrə Statistika Tabı', isFree: true, desc: 'Hər fənn üzrə orta ballar və qrafiklər' },
  { id: 'comparisonTab', name: 'Məktəb/Bölgə Müqayisəsi Tabı', isFree: true, desc: 'Şagirdin ölkə/məktəb ilə fənn müqayisəsi' },
  { id: 'progressTab', name: 'İnkişaf Tərəqqisi Tabı', isFree: true, desc: 'Aylıq tərəqqi və irəliləyiş qrafiki' },
  { id: 'activityTab', name: 'Son Aktivliklər Tabı', isFree: true, desc: 'Şagirdin etdiyi son testlərin siyahısı' },
  
  // Advanced Analytics
  { id: 'basicStats', name: 'İlkin Təhlil (Descriptive Stats)', isFree: true, desc: 'Tələbənin ümumi balı, doğrusu və s.' },
  { id: 'itemAnalysis', name: 'Sual Analizi (Item Analysis)', isFree: true, desc: 'Çətinlik dərəcəsi və distractor analizi' },
  { id: 'behaviorAnalysis', name: 'Davranış Analizi (Behavior)', isFree: true, desc: 'Suala sərf olunan vaxt və drop-out rateləri' },
  { id: 'clusterAnalysis', name: 'Seqmentasiya (AI Profiling)', isFree: true, desc: 'Tələbənin öyrənmə profilinin vizual təyini' },
  { id: 'bloomAnalysis', name: 'Bloom Taksonomiyası', isFree: true, desc: 'Koqnitiv səviyyə üzrə bacarıqların xəritəsi' },
]

const mockUsers = [
  { id: 'parent-emil', name: 'Emil Məcidov (Valideyn)', email: 'emil.mecidov@example.com', hasVip: true, customOverrides: ['overviewTab', 'subjectsTab', 'comparisonTab', 'progressTab', 'activityTab', 'basicStats', 'itemAnalysis', 'behaviorAnalysis', 'clusterAnalysis', 'bloomAnalysis'] },
  { id: 'parent-rufat', name: 'Rüfət Rzayev (Valideyn)', email: 'r.h.rzayev@gmail.com', hasVip: true, customOverrides: ['overviewTab', 'subjectsTab', 'comparisonTab', 'progressTab', 'activityTab', 'basicStats', 'itemAnalysis', 'behaviorAnalysis', 'clusterAnalysis', 'bloomAnalysis'] },
  { id: 1, name: 'Aysel Məmmədova (Valideyn)', email: 'aysel.valideyn@gmail.com', hasVip: true, customOverrides: [] },
  { id: 2, name: 'Rəşad Əliyev (Valideyn)', email: 'aliyev.r@mail.ru', hasVip: true, customOverrides: ['itemAnalysis'] },
  { id: 3, name: 'Nigar Həsənova (Valideyn)', email: 'nhasanova@edu.az', hasVip: true, customOverrides: ['bloomAnalysis', 'behaviorAnalysis'] },
]

import { getAllUsers } from '@/lib/user-store'
import os from 'os'

const tmpAccessControlPath = path.join(os.tmpdir(), 'access_control.json')
const g = globalThis as unknown as { __testai_access_control_db?: any }

function getDb() {
  if (g.__testai_access_control_db) {
    return g.__testai_access_control_db
  }

  let db: any = {
    globalSettings: defaultGlobalSettings,
    users: mockUsers
  }

  if (fs.existsSync(accessControlPath)) {
    try {
      db = JSON.parse(fs.readFileSync(accessControlPath, 'utf8'))
    } catch (e) {}
  } else if (fs.existsSync(tmpAccessControlPath)) {
    try {
      db = JSON.parse(fs.readFileSync(tmpAccessControlPath, 'utf8'))
    } catch (e) {}
  }

  // Ensure all features are active and default to free/unlocked
  if (Array.isArray(db.globalSettings)) {
    db.globalSettings.forEach((s: any) => {
      s.isFree = true
    })
  } else {
    db.globalSettings = defaultGlobalSettings
  }

  // Ensure Emil Mecidov has VIP
  const emilUser = (db.users || []).find((u: any) => u.email?.toLowerCase() === 'emil.mecidov@example.com' || u.id === 'parent-emil')
  if (emilUser) {
    emilUser.hasVip = true
    emilUser.customOverrides = ['overviewTab', 'subjectsTab', 'comparisonTab', 'progressTab', 'activityTab', 'basicStats', 'itemAnalysis', 'behaviorAnalysis', 'clusterAnalysis', 'bloomAnalysis']
  } else if (Array.isArray(db.users)) {
    db.users.unshift({
      id: 'parent-emil',
      name: 'Emil Məcidov (Valideyn)',
      email: 'emil.mecidov@example.com',
      hasVip: true,
      customOverrides: ['overviewTab', 'subjectsTab', 'comparisonTab', 'progressTab', 'activityTab', 'basicStats', 'itemAnalysis', 'behaviorAnalysis', 'clusterAnalysis', 'bloomAnalysis']
    })
  }

  // Merge REAL users from user-store
  try {
    const allUsers = getAllUsers(true)
    const existingEmails = new Set((db.users || []).map((u: any) => (u.email || '').toLowerCase()))

    for (const u of allUsers) {
      if (!u.email) continue
      const emailLower = u.email.toLowerCase()
      if (!existingEmails.has(emailLower)) {
        const roleLabel = u.role === 'parent' || u.accountType === 'parent' ? ' (Valideyn)' : 
                          u.role === 'student' || u.accountType === 'student' ? ' (Şagird)' : 
                          u.role === 'teacher' ? ' (Müəllim)' : ''
        db.users.push({
          id: u.id,
          name: `${u.firstName || ''} ${u.lastName || ''}`.trim() + roleLabel,
          email: u.email,
          hasVip: false,
          customOverrides: []
        })
        existingEmails.add(emailLower)
      }
    }
  } catch (e) {}

  g.__testai_access_control_db = db

  try {
    if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true })
    fs.writeFileSync(accessControlPath, JSON.stringify(db, null, 2))
  } catch (e) {}

  try {
    fs.writeFileSync(tmpAccessControlPath, JSON.stringify(db, null, 2))
  } catch (e) {}

  return db
}

export async function GET() {
    try {
        const db = getDb()
        return NextResponse.json(db)
    } catch(err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const db = getDb()

        if (body.type === 'global') {
            db.globalSettings = body.globalSettings
        } else if (body.type === 'user') {
            const userIndex = db.users.findIndex((u: any) => u.id === body.user.id || u.email?.toLowerCase() === body.user.email?.toLowerCase())
            if (userIndex >= 0) {
                db.users[userIndex] = { ...db.users[userIndex], ...body.user }
            } else {
                db.users.push(body.user)
            }
        }

        g.__testai_access_control_db = db

        try {
            if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true })
            fs.writeFileSync(accessControlPath, JSON.stringify(db, null, 2))
        } catch (e) {}

        try {
            fs.writeFileSync(tmpAccessControlPath, JSON.stringify(db, null, 2))
        } catch (e) {}

        return NextResponse.json({ success: true, data: db })
    } catch(err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}
