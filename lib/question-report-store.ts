export interface QuestionReport {
  id: string
  questionId: string | number
  passportId?: string
  questionText: string
  subject: string
  grade: number | string
  topic: string
  studentId: string
  studentName: string
  studentEmail?: string
  issueType: 'wrong_key' | 'contradictory_explanation' | 'unclear_question' | 'other'
  comment: string
  reportedAt: string
  status: 'pending' | 'resolved' | 'rejected'
  adminResponse?: string
  resolvedAt?: string
}

// In-memory persistent storage for question reports
let reportsStore: QuestionReport[] = [
  {
    id: "rep-001",
    questionId: "11-004-0313-11UT13-BL2-C2-010",
    passportId: "11-004-0313-11UT13-BL2-C2-010",
    questionText: "1935-ci il 'Hindistanın idarə edilməsi haqqında Britaniya Qanunu' nəyi nəzərdə tuturdu?",
    subject: "Ümumi tarix",
    grade: 11,
    topic: "13. Hindistan, Çin və Yaponiya",
    studentId: "student-inci",
    studentName: "İnci Məcidzadə",
    studentEmail: "inci.mecidzade@test.com",
    issueType: "wrong_key",
    comment: "Dərslikdə qeyd olunur ki, qanun tam müstəqillik vermədi, lakin sistemdə doğru cavab kimi tam müstəqillik göstərilib.",
    reportedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    status: "pending"
  }
]

export function getReports(): QuestionReport[] {
  return reportsStore
}

export function addReport(report: Omit<QuestionReport, 'id' | 'reportedAt' | 'status'>): { success: boolean; report?: QuestionReport; error?: string } {
  // Anti-abuse: check rate limiting (max 5 reports per student in 24 hours)
  const now = Date.now()
  const studentReportsLast24h = reportsStore.filter(r => 
    r.studentId === report.studentId && 
    (now - new Date(r.reportedAt).getTime()) < 24 * 3600 * 1000
  )
  if (studentReportsLast24h.length >= 5) {
    return { success: false, error: "Günlük maksimum bildiriş limitinə (5 ədəd) çatdınız. Zəhmət olmasa sabah yenidən cəhd edin." }
  }

  // Deduplication: check if already reported by this student
  const alreadyReported = reportsStore.some(r => 
    r.studentId === report.studentId && 
    String(r.questionId) === String(report.questionId)
  )
  if (alreadyReported) {
    return { success: false, error: "Bu sual üçün artıq bildiriş göndərmisiniz. Müraciətiniz qeydiyyatdadır." }
  }

  const newReport: QuestionReport = {
    ...report,
    id: `rep-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    reportedAt: new Date().toISOString(),
    status: 'pending'
  }

  reportsStore.unshift(newReport)
  return { success: true, report: newReport }
}

export function updateReportStatus(reportId: string, status: 'resolved' | 'rejected', adminResponse?: string): QuestionReport | null {
  const rep = reportsStore.find(r => r.id === reportId)
  if (!rep) return null
  rep.status = status
  rep.adminResponse = adminResponse
  rep.resolvedAt = new Date().toISOString()
  return rep
}
