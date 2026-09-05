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
  { id: 'comparisonTab', name: 'Məktəb/Bölgə Müqayisəsi Tabı', isFree: false, desc: 'Şagirdin ölkə/məktəb ilə fənn müqayisəsi' },
  { id: 'progressTab', name: 'İnkişaf Tərəqqisi Tabı', isFree: false, desc: 'Aylıq tərəqqi və irəliləyiş qrafiki' },
  { id: 'activityTab', name: 'Son Aktivliklər Tabı', isFree: true, desc: 'Şagirdin etdiyi son testlərin siyahısı' },
  
  // Advanced Analytics
  { id: 'basicStats', name: 'İlkin Təhlil (Descriptive Stats)', isFree: true, desc: 'Tələbənin ümumi balı, doğrusu və s.' },
  { id: 'itemAnalysis', name: 'Sual Analizi (Item Analysis)', isFree: false, desc: 'Çətinlik dərəcəsi və distractor analizi' },
  { id: 'behaviorAnalysis', name: 'Davranış Analizi (Behavior)', isFree: false, desc: 'Suala sərf olunan vaxt və drop-out rateləri' },
  { id: 'clusterAnalysis', name: 'Seqmentasiya (AI Profiling)', isFree: false, desc: 'Tələbənin öyrənmə profilinin vizual təyini' },
  { id: 'bloomAnalysis', name: 'Bloom Taksonomiyası', isFree: false, desc: 'Koqnitiv səviyyə üzrə bacarıqların xəritəsi' },
]

const mockUsers = [
  { id: 1, name: 'Aysel Məmmədova (Valideyn)', email: 'aysel.valideyn@gmail.com', hasVip: false, customOverrides: [] },
  { id: 2, name: 'Rəşad Əliyev (Valideyn)', email: 'aliyev.r@mail.ru', hasVip: true, customOverrides: ['itemAnalysis'] },
  { id: 3, name: 'Nigar Həsənova (Valideyn)', email: 'nhasanova@edu.az', hasVip: false, customOverrides: ['bloomAnalysis', 'behaviorAnalysis'] },
]

import { getAllUsers } from '@/lib/user-store'

function getDb() {
  let db: any = {
    globalSettings: defaultGlobalSettings,
    users: mockUsers
  }

  if (fs.existsSync(accessControlPath)) {
    try {
      db = JSON.parse(fs.readFileSync(accessControlPath, 'utf8'))
    } catch (e) {}
  }

  // Auto-merge new default settings if they don't exist in the DB
  const existingSettingsIds = (db.globalSettings || []).map((s: any) => s.id)
  defaultGlobalSettings.forEach(defSetting => {
    if (!existingSettingsIds.includes(defSetting.id)) {
      db.globalSettings.unshift(defSetting)
    }
  })

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

  try {
    if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true })
    fs.writeFileSync(accessControlPath, JSON.stringify(db, null, 2))
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
            const userIndex = db.users.findIndex((u: any) => u.id === body.user.id)
            if (userIndex >= 0) {
                db.users[userIndex] = body.user
            } else {
                db.users.push(body.user)
            }
        }

        fs.writeFileSync(accessControlPath, JSON.stringify(db, null, 2))
        return NextResponse.json({ success: true, data: db })
    } catch(err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}
