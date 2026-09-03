# Valideyn/Müəllim İstifadəçi Sistemi - Tam Bələdçi

## 📋 Ümumi Baxış

TESTAI.AZ platformasında **iki növ hesab** mövcuddur:

### 1. 🎓 Şagird Hesabı
- Test həll etmək
- Nəticələrə baxmaq
- Şəxsi statistika izləmək
- Mövzu üzrə progress

### 2. 👨‍👩‍👧‍👦 Valideyn/Müəllim Hesabı
- Şagird nəticələrini izləmək
- Çoxlu şagird əlavə etmək
- Performans müqayisəsi
- Ətraflı təhlil və hesabatlar

---

## 🚀 Qeydiyyat Prosesi

### Şagird Qeydiyyatı

\`\`\`typescript
// Tələb olunan məlumatlar
interface StudentRegistration {
  firstName: string        // Ad (min: 2, max: 50)
  lastName: string         // Soyad (min: 2, max: 50)
  fatherName: string      // Ata adı (min: 2, max: 50)
  region: string          // Ərazi (67 seçim)
  subRegion?: string      // Alt-rayon (opsional)
  school: string          // Məktəb (min: 3, max: 100)
  class: string           // Sinif (1-11)
  email: string           // Email (unikal)
  password: string        // Şifrə (min: 6)
  confirmPassword: string // Şifrə təkrarı
}
\`\`\`

**Validasiya Qaydaları:**
- ✅ Ad/Soyad yalnız hərflərdən ibarət
- ✅ Email formatı düzgün olmalı
- ✅ Şifrədə böyük hərf, kiçik hərf və rəqəm
- ✅ Şifrələr eyni olmalı

### Valideyn/Müəllim Qeydiyyatı

\`\`\`typescript
interface ParentRegistration {
  role: 'parent' | 'teacher' | 'director'  // Rol seçimi
  firstName: string
  lastName: string
  fatherName: string
  region: string
  school: string
  email: string
  password: string
  confirmPassword: string
}
\`\`\`

**Rol Növləri:**
- 👨‍👩‍👧‍👦 **Valideyn**: Öz övladlarının nəticələrinə baxır
- 👨‍🏫 **Müəllim**: Sinif şagirdlərini izləyir
- 👔 **Direktor**: Bütün məktəb statistikasına çıxışı var

---

## 🔐 Giriş Səviyyəsi Nəzarəti (RBAC)

### İcazə Sistemi

\`\`\`typescript
const permissions = {
  student: {
    canTakeTests: true,
    canViewOwnResults: true,
    canViewOthersResults: false,
    canManageStudents: false,
    canExportData: false,
    canGenerateReports: false
  },
  
  parent: {
    canTakeTests: false,
    canViewOwnResults: false,
    canViewOthersResults: true,      // yalnız bağlı şagirdlər
    canManageStudents: true,         // əlavə et/sil
    canExportData: true,             // yalnız övladları
    canGenerateReports: false
  },
  
  teacher: {
    canTakeTests: false,
    canViewOwnResults: false,
    canViewOthersResults: true,      // sinif şagirdləri
    canManageStudents: true,         // sinif idarəsi
    canExportData: true,             // sinif məlumatları
    canGenerateReports: true,        // sinif hesabatları
    canViewClassAnalytics: true
  },
  
  director: {
    canTakeTests: false,
    canViewOwnResults: false,
    canViewOthersResults: true,      // bütün şagirdlər
    canManageStudents: true,         // bütün şagirdlər
    canExportData: true,             // bütün məlumatlar
    canGenerateReports: true,        // məktəb hesabatları
    canViewAnalytics: true,          // məktəb analitikası
    canManageTeachers: true          // müəllim idarəsi
  }
}
\`\`\`

### Middleware Nümunəsi

\`\`\`typescript
async function checkAccess(
  userId: number,
  targetStudentId: number,
  action: string
): Promise<boolean> {
  const user = await getUserById(userId)
  
  // Şagird yalnız öz nəticələrinə baxa bilər
  if (user.accountType === 'student') {
    return userId === targetStudentId
  }
  
  // Valideyn yalnız övladlarına baxa bilər
  if (user.role === 'parent') {
    const isLinked = await checkStudentLink(userId, targetStudentId)
    return isLinked
  }
  
  // Müəllim yalnız sinif şagirdlərinə baxa bilər
  if (user.role === 'teacher') {
    const isInClass = await checkStudentInClass(userId, targetStudentId)
    return isInClass
  }
  
  // Direktor bütün şagirdlərə baxa bilər
  if (user.role === 'director') {
    const isSameSchool = await checkSameSchool(userId, targetStudentId)
    return isSameSchool
  }
  
  return false
}
\`\`\`

---

## 📊 Şagird-Valideyn Bağlantı Sistemi

### Bağlantı Yaratma

**Frontend:**
\`\`\`typescript
const handleAddStudent = async (studentEmail: string) => {
  const response = await fetch('/api/students/link', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      parentId: currentUser.id,
      studentEmail: studentEmail,
      relationshipType: currentUser.role  // 'parent', 'teacher', 'director'
    })
  })
  
  const data = await response.json()
  
  if (data.success) {
    toast.success('Şagird uğurla əlavə edildi!')
    refreshStudentList()
  } else {
    toast.error(data.error)
  }
}
\`\`\`

**Backend API:**
\`\`\`typescript
// POST /api/students/link
export async function POST(request: NextRequest) {
  const { parentId, studentEmail, relationshipType } = await request.json()
  
  // 1. Valideyn hesabını yoxla
  const parent = await db.users.findOne({
    id: parentId,
    accountType: 'parent'
  })
  
  if (!parent) {
    return NextResponse.json(
      { error: 'Valideyn hesabı tapılmadı' },
      { status: 404 }
    )
  }
  
  // 2. Şagirdi tap
  const student = await db.users.findOne({
    email: studentEmail,
    accountType: 'student'
  })
  
  if (!student) {
    return NextResponse.json(
      { error: 'Bu email ilə şagird tapılmadı' },
      { status: 404 }
    )
  }
  
  // 3. Mövcud bağlantını yoxla
  const existingLink = await db.studentLinks.findOne({
    parentId,
    studentId: student.id,
    status: 'active'
  })
  
  if (existingLink) {
    return NextResponse.json(
      { error: 'Bu şagird artıq əlavə edilib' },
      { status: 400 }
    )
  }
  
  // 4. Yeni bağlantı yarat
  const newLink = await db.studentLinks.create({
    parentId,
    studentId: student.id,
    relationshipType,
    linkedAt: new Date(),
    status: 'active'
  })
  
  return NextResponse.json({
    success: true,
    message: 'Şagird uğurla əlavə edildi',
    link: {
      id: newLink.id,
      studentName: `${student.firstName} ${student.lastName}`,
      studentClass: student.class,
      studentSchool: student.school,
      linkedAt: newLink.linkedAt
    }
  })
}
\`\`\`

### Bağlantı Göstərmə

\`\`\`typescript
// GET /api/students/link?parentId=1
export async function GET(request: NextRequest) {
  const parentId = request.nextUrl.searchParams.get('parentId')
  
  const links = await db.studentLinks.findMany({
    where: {
      parentId: parseInt(parentId),
      status: 'active'
    },
    include: {
      student: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          class: true,
          school: true
        }
      }
    }
  })
  
  return NextResponse.json({
    success: true,
    links: links.map(link => ({
      id: link.id,
      studentId: link.student.id,
      studentName: `${link.student.firstName} ${link.student.lastName}`,
      studentEmail: link.student.email,
      studentClass: link.student.class,
      studentSchool: link.student.school,
      relationshipType: link.relationshipType,
      linkedAt: link.linkedAt
    })),
    total: links.length
  })
}
\`\`\`

### Bağlantı Silmə

\`\`\`typescript
// DELETE /api/students/link?linkId=1
export async function DELETE(request: NextRequest) {
  const linkId = request.nextUrl.searchParams.get('linkId')
  
  // Soft delete (status-u inactive et)
  await db.studentLinks.update({
    where: { id: parseInt(linkId) },
    data: { status: 'inactive' }
  })
  
  return NextResponse.json({
    success: true,
    message: 'Şagird uğurla silindi'
  })
}
\`\`\`

---

## 📈 Şagird Nəticələrini Görüntüləmə

### Nəticə API

\`\`\`typescript
// GET /api/students/results?studentId=5&parentId=1
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const studentId = parseInt(searchParams.get('studentId'))
  const parentId = parseInt(searchParams.get('parentId'))
  
  // 1. Giriş yoxlaması
  const hasAccess = await checkAccess(parentId, studentId)
  
  if (!hasAccess) {
    return NextResponse.json(
      { error: 'Bu şagirdə giriş icazəniz yoxdur' },
      { status: 403 }
    )
  }
  
  // 2. Test nəticələrini əldə et
  const results = await db.testResults.findMany({
    where: { userId: studentId },
    orderBy: { completedAt: 'desc' }
  })
  
  // 3. Statistika hesabla
  const statistics = calculateStatistics(results)
  
  return NextResponse.json({
    success: true,
    results: results.map(formatResult),
    statistics
  })
}

function calculateStatistics(results: TestResult[]) {
  const totalTests = results.length
  const averageScore = results.reduce((sum, r) => sum + r.score, 0) / totalTests
  const bestScore = Math.max(...results.map(r => r.score))
  
  // Fənn üzrə breakdown
  const subjectBreakdown = {}
  results.forEach(result => {
    if (!subjectBreakdown[result.textbook]) {
      subjectBreakdown[result.textbook] = {
        count: 0,
        totalScore: 0,
        averageScore: 0
      }
    }
    subjectBreakdown[result.textbook].count++
    subjectBreakdown[result.textbook].totalScore += result.score
  })
  
  // Orta balları hesabla
  Object.keys(subjectBreakdown).forEach(subject => {
    const data = subjectBreakdown[subject]
    data.averageScore = Math.round(data.totalScore / data.count)
  })
  
  // Performans trendi (son 10 test)
  const performanceTrend = results
    .slice(0, 10)
    .reverse()
    .map(r => ({
      date: new Date(r.completedAt).toLocaleDateString('az-AZ'),
      score: r.score,
      subject: r.textbook
    }))
  
  // Zəif sahələr (orta < 70)
  const weakAreas = Object.entries(subjectBreakdown)
    .filter(([_, data]) => data.averageScore < 70)
    .map(([subject, data]) => ({
      subject,
      averageScore: data.averageScore,
      testCount: data.count
    }))
    .sort((a, b) => a.averageScore - b.averageScore)
  
  // Güclü sahələr (orta >= 80)
  const strongAreas = Object.entries(subjectBreakdown)
    .filter(([_, data]) => data.averageScore >= 80)
    .map(([subject, data]) => ({
      subject,
      averageScore: data.averageScore,
      testCount: data.count
    }))
    .sort((a, b) => b.averageScore - a.averageScore)
  
  return {
    totalTests,
    averageScore: Math.round(averageScore),
    bestScore,
    subjectBreakdown: Object.entries(subjectBreakdown).map(([subject, data]) => ({
      subject,
      ...data
    })),
    performanceTrend,
    weakAreas,
    strongAreas,
    recentTests: results.slice(0, 5).map(formatResult)
  }
}
\`\`\`

---

## 🎨 Parent Dashboard UI

### Dashboard Komponentləri

\`\`\`typescript
// Parent Dashboard Structure
<ParentDashboard>
  <Sidebar>
    <AddStudentButton />
    <StudentList>
      {linkedStudents.map(student => (
        <StudentCard
          key={student.id}
          student={student}
          onClick={() => selectStudent(student.id)}
          onRemove={() => removeStudent(student.id)}
        />
      ))}
    </StudentList>
  </Sidebar>
  
  <MainContent>
    <StudentHeader student={selectedStudent} />
    
    <StatisticsCards>
      <Card title="Ümumi Test" value={stats.totalTests} />
      <Card title="Orta Bal" value={stats.averageScore} />
      <Card title="Ən Yaxşı" value={stats.bestScore} />
      <Card title="Bu Ay" value={stats.monthlyTests} />
    </StatisticsCards>
    
    <Tabs>
      <Tab name="overview">
        <StrongAreas areas={stats.strongAreas} />
        <WeakAreas areas={stats.weakAreas} />
        <PerformanceTrendChart data={stats.performanceTrend} />
      </Tab>
      
      <Tab name="subjects">
        <SubjectBreakdown data={stats.subjectBreakdown} />
        <SubjectComparisonChart data={stats.subjectBreakdown} />
      </Tab>
      
      <Tab name="progress">
        <MonthlyProgress data={stats.monthly} />
        <RecentTests tests={stats.recentTests} />
      </Tab>
      
      <Tab name="activity">
        <RecentActivity activities={stats.recentActivity} />
      </Tab>
    </Tabs>
  </MainContent>
</ParentDashboard>
\`\`\`

### Responsive Design

\`\`\`css
/* Mobile (<768px) */
.parent-dashboard {
  grid-template-columns: 1fr;
}

.sidebar {
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 60vh;
  transform: translateY(100%);
}

.sidebar.open {
  transform: translateY(0);
}

/* Tablet (768px - 1024px) */
@media (min-width: 768px) {
  .parent-dashboard {
    grid-template-columns: 250px 1fr;
  }
}

/* Desktop (>1024px) */
@media (min-width: 1024px) {
  .parent-dashboard {
    grid-template-columns: 320px 1fr;
  }
}
\`\`\`

---

## 📱 Real-time Notification Sistemi

### Email Bildirişləri

\`\`\`typescript
// Email notification triggers
const emailTriggers = {
  // Test tamamlandıqda
  onTestComplete: async (studentId: number, result: TestResult) => {
    const links = await db.studentLinks.findMany({
      where: { studentId, status: 'active' },
      include: { parent: true, student: true }
    })
    
    for (const link of links) {
      await sendEmail({
        to: link.parent.email,
        subject: `${link.student.firstName} test tamamladı`,
        template: 'test-completed',
        data: {
          studentName: `${link.student.firstName} ${link.student.lastName}`,
          subject: result.textbook,
          topic: result.topic,
          score: result.score,
          date: new Date().toLocaleDateString('az-AZ')
        }
      })
    }
  },
  
  // Zəif performans
  onWeakPerformance: async (studentId: number, subject: string, score: number) => {
    if (score < 50) {
      const links = await db.studentLinks.findMany({
        where: { studentId, status: 'active' },
        include: { parent: true, student: true }
      })
      
      for (const link of links) {
        await sendEmail({
          to: link.parent.email,
          subject: `⚠️ Diqqət: ${link.student.firstName} zəif nəticə göstərdi`,
          template: 'weak-performance',
          data: {
            studentName: `${link.student.firstName} ${link.student.lastName}`,
            subject,
            score,
            recommendations: [
              'Müəllimlə əlavə dərs',
              'Mövzunu təkrar etmək',
              'Əlavə məşq materialları'
            ]
          }
        })
      }
    }
  },
  
  // Haftalıq hesabat
  onWeeklySummary: async (studentId: number) => {
    const weekStart = new Date()
    weekStart.setDate(weekStart.getDate() - 7)
    
    const results = await db.testResults.findMany({
      where: {
        userId: studentId,
        completedAt: { gte: weekStart }
      }
    })
    
    const links = await db.studentLinks.findMany({
      where: { studentId, status: 'active' },
      include: { parent: true, student: true }
    })
    
    const summary = {
      totalTests: results.length,
      averageScore: results.reduce((sum, r) => sum + r.score, 0) / results.length,
      subjects: [...new Set(results.map(r => r.textbook))]
    }
    
    for (const link of links) {
      await sendEmail({
        to: link.parent.email,
        subject: `📊 ${link.student.firstName} üçün həftəlik hesabat`,
        template: 'weekly-summary',
        data: {
          studentName: `${link.student.firstName} ${link.student.lastName}`,
          ...summary
        }
      })
    }
  }
}
\`\`\`

### Push Notification (Future)

\`\`\`typescript
// Web Push API integration
const pushNotification = {
  subscribe: async (userId: number, subscription: PushSubscription) => {
    await db.pushSubscriptions.create({
      userId,
      endpoint: subscription.endpoint,
      keys: JSON.stringify(subscription.keys)
    })
  },
  
  send: async (userId: number, notification: {
    title: string
    body: string
    icon?: string
    data?: any
  }) => {
    const subscriptions = await db.pushSubscriptions.findMany({
      where: { userId }
    })
    
    for (const sub of subscriptions) {
      await webpush.sendNotification(
        {
          endpoint: sub.endpoint,
          keys: JSON.parse(sub.keys)
        },
        JSON.stringify(notification)
      )
    }
  }
}
\`\`\`

---

## 🔒 Məxfilik və Təhlükəsizlik

### Data Şifrələmə

\`\`\`python
from cryptography.fernet import Fernet

class SecureDataHandler:
    """Həssas məlumatların şifrələnməsi"""
    
    def __init__(self):
        self.key = os.getenv('ENCRYPTION_KEY')
        self.cipher = Fernet(self.key)
    
    def encrypt_link_data(self, link: StudentLink) -> str:
        """Şagird-valideyn bağlantısını şifrələ"""
        data = {
            'parent_id': link.parent_id,
            'student_id': link.student_id,
            'relationship': link.relationship_type
        }
        
        json_data = json.dumps(data)
        encrypted = self.cipher.encrypt(json_data.encode())
        return encrypted.decode()
    
    def decrypt_link_data(self, encrypted: str) -> dict:
        """Bağlantı məlumatlarını deşifrə et"""
        decrypted = self.cipher.decrypt(encrypted.encode())
        return json.loads(decrypted.decode())
\`\`\`

### Audit Log

\`\`\`sql
CREATE TABLE audit_logs (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  action VARCHAR(50) NOT NULL,
  resource_type VARCHAR(50) NOT NULL,
  resource_id INTEGER,
  details JSONB,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indeksləmə
CREATE INDEX idx_audit_user ON audit_logs(user_id);
CREATE INDEX idx_audit_action ON audit_logs(action);
CREATE INDEX idx_audit_date ON audit_logs(created_at);
\`\`\`

\`\`\`typescript
// Audit logging middleware
async function logAction(
  userId: number,
  action: string,
  resourceType: string,
  resourceId: number,
  request: NextRequest
) {
  await db.auditLogs.create({
    userId,
    action,
    resourceType,
    resourceId,
    ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
    userAgent: request.headers.get('user-agent') || 'unknown',
    createdAt: new Date()
  })
}

// Nümunə: Nəticə görüntüləmə loqu
await logAction(
  parentId,
  'VIEW_STUDENT_RESULTS',
  'test_results',
  studentId,
  request
)
\`\`\`

---

## 📊 Reporting və Analytics

### Excel Export

\`\`\`typescript
import ExcelJS from 'exceljs'

async function exportStudentReport(studentId: number, parentId: number) {
  // Giriş yoxlaması
  const hasAccess = await checkAccess(parentId, studentId)
  if (!hasAccess) throw new Error('No access')
  
  // Məlumat əldə et
  const results = await getStudentResults(studentId)
  const student = await getStudent(studentId)
  
  // Excel workbook yarat
  const workbook = new ExcelJS.Workbook()
  const worksheet = workbook.addWorksheet('Test Nəticələri')
  
  // Header
  worksheet.columns = [
    { header: 'Tarix', key: 'date', width: 15 },
    { header: 'Fənn', key: 'subject', width: 20 },
    { header: 'Mövzu', key: 'topic', width: 30 },
    { header: 'Bal', key: 'score', width: 10 },
    { header: 'Sual Sayı', key: 'questions', width: 12 },
    { header: 'Vaxt', key: 'time', width: 12 }
  ]
  
  // Data
  results.forEach(result => {
    worksheet.addRow({
      date: new Date(result.completedAt).toLocaleDateString('az-AZ'),
      subject: result.textbook,
      topic: result.topic,
      score: `${result.score}%`,
      questions: result.questions.length,
      time: `${Math.floor(result.timeSpent / 60)}:${(result.timeSpent % 60).toString().padStart(2, '0')}`
    })
  })
  
  // Styling
  worksheet.getRow(1).font = { bold: true }
  worksheet.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF3B82F6' }
  }
  
  // Generate buffer
  const buffer = await workbook.xlsx.writeBuffer()
  return buffer
}
\`\`\`

### PDF Report

\`\`\`typescript
import PDFDocument from 'pdfkit'

async function generatePDFReport(studentId: number, parentId: number) {
  const hasAccess = await checkAccess(parentId, studentId)
  if (!hasAccess) throw new Error('No access')
  
  const results = await getStudentResults(studentId)
  const stats = calculateStatistics(results)
  const student = await getStudent(studentId)
  
  const doc = new PDFDocument()
  
  // Header
  doc.fontSize(20).text('TESTAI.AZ - Şagird Hesabatı', { align: 'center' })
  doc.moveDown()
  
  // Student info
  doc.fontSize(14).text(`Şagird: ${student.firstName} ${student.lastName}`)
  doc.fontSize(12).text(`Sinif: ${student.class}`)
  doc.text(`Məktəb: ${student.school}`)
  doc.moveDown()
  
  // Statistics
  doc.fontSize(16).text('Ümumi Statistika')
  doc.fontSize(12)
  doc.text(`Ümumi testlər: ${stats.totalTests}`)
  doc.text(`Orta bal: ${stats.averageScore}%`)
  doc.text(`Ən yaxşı nəticə: ${stats.bestScore}%`)
  doc.moveDown()
  
  // Subject breakdown
  doc.fontSize(16).text('Fənn üzrə Nəticələr')
  doc.fontSize(12)
  stats.subjectBreakdown.forEach(subject => {
    doc.text(`${subject.subject}: ${subject.averageScore}% (${subject.count} test)`)
  })
  doc.moveDown()
  
  // Recent tests table
  doc.fontSize(16).text('Son Testlər')
  doc.fontSize(10)
  
  const tableTop = doc.y
  const tableHeaders = ['Tarix', 'Fənn', 'Mövzu', 'Bal']
  const columnWidths = [100, 120, 200, 80]
  
  let x = 50
  tableHeaders.forEach((header, i) => {
    doc.text(header, x, tableTop, { width: columnWidths[i] })
    x += columnWidths[i]
  })
  
  doc.moveDown()
  
  results.slice(0, 10).forEach(result => {
    x = 50
    const y = doc.y
    doc.text(new Date(result.completedAt).toLocaleDateString('az-AZ'), x, y, { width: columnWidths[0] })
    x += columnWidths[0]
    doc.text(result.textbook, x, y, { width: columnWidths[1] })
    x += columnWidths[1]
    doc.text(result.topic, x, y, { width: columnWidths[2] })
    x += columnWidths[2]
    doc.text(`${result.score}%`, x, y, { width: columnWidths[3] })
    doc.moveDown()
  })
  
  doc.end()
  return doc
}
\`\`\`

---

## 🎯 Best Practices

### 1. Performance Optimization

\`\`\`typescript
// Lazy loading şagird siyahısı
const StudentList = dynamic(() => import('./StudentList'), {
  loading: () => <Skeleton count={5} />
})

// Memoization
const StudentCard = React.memo(({ student, onClick }) => {
  return (
    <Card onClick={() => onClick(student.id)}>
      {/* ... */}
    </Card>
  )
})

// Virtual scrolling böyük siyahılar üçün
import { FixedSizeList } from 'react-window'

<FixedSizeList
  height={600}
  itemCount={linkedStudents.length}
  itemSize={100}
  width="100%"
>
  {({ index, style }) => (
    <div style={style}>
      <StudentCard student={linkedStudents[index]} />
    </div>
  )}
</FixedSizeList>
\`\`\`

### 2. Error Handling

\`\`\`typescript
// Global error boundary
class ParentDashboardErrorBoundary extends React.Component {
  state = { hasError: false, error: null }
  
  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <ErrorView>
          <h2>Xəta baş verdi</h2>
          <p>{this.state.error?.message}</p>
          <Button onClick={() => window.location.reload()}>
            Yenidən yüklə
          </Button>
        </ErrorView>
      )
    }
    
    return this.props.children
  }
}
\`\`\`

### 3. Loading States

\`\`\`typescript
// Skeleton loading
const LoadingState = () => (
  <div className="space-y-4">
    <Skeleton className="h-24 w-full" />
    <Skeleton className="h-32 w-full" />
    <Skeleton className="h-48 w-full" />
  </div>
)

// Progressive enhancement
const [isLoading, setIsLoading] = useState(true)
const [data, setData] = useState(null)

useEffect(() => {
  fetchData().then(result => {
    setData(result)
    setIsLoading(false)
  })
}, [])

if (isLoading) return <LoadingState />
return <DataView data={data} />
\`\`\`

---

## 🚀 Gələcək Təkmilləşdirmələr

### Phase 1 (1-2 ay)
- [ ] WhatsApp bildiriş inteqrasiyası
- [ ] SMS bildirişləri
- [ ] Mobil tətbiq (React Native)
- [ ] Offline sync
- [ ] Push notifications

### Phase 2 (3-4 ay)
- [ ] Video görüşmə (valideyn-müəllim)
- [ ] Canlı chat sistemi
- [ ] Homework tracking
- [ ] Calendar integration
- [ ] Google Classroom sync

### Phase 3 (6+ ay)
- [ ] AI-powered recommendations
- [ ] Predictive analytics
- [ ] Custom report builder
- [ ] Bulk operations
- [ ] Advanced filtering

---

## 📞 Dəstək

### Texniki Dəstək
- Email: support@testai.az
- Telefon: +994XXXXXXXXX
- Telegram: @testai_support

### Sənədlər
- API Documentation: docs.testai.az
- Video Tutorials: youtube.com/@testai
- FAQ: testai.az/faq

---

**Son yenilənmə**: 2024-10-21
**Versiya**: 2.0.0
**Müəllif**: TESTAI.AZ Team

---

Bu bələdçi valideyn və müəllimlərin platformadan tam səmərəli istifadə etməsi üçün hazırlanıb. 👨‍👩‍👧‍👦🎓
