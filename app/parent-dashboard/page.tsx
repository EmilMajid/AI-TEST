"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BookOpen,
  Users,
  Plus,
  TrendingUp,
  TrendingDown,
  Target,
  Calendar,
  BarChart3,
  CheckCircle,
  Clock,
  Award,
  Eye,
  Trash2,
  User,
  LogOut,

  GraduationCap,
  Mail,
  LayoutDashboard,
  Globe,
} from "lucide-react"
import Link from "next/link"
import { MessagesTab } from "@/components/messages-tab"
import { useRouter } from "next/navigation"
import { useTheme } from "@/hooks/use-theme"
import { useToast } from "@/hooks/use-toast"
import { ProfileAvatar } from "@/components/profile-avatar"
import { logout, getRoleLabel } from "@/lib/profile-utils"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

interface LinkedStudent {
  id: number
  studentId: number
  studentName: string
  studentEmail: string
  studentClass: string
  studentSchool: string
  relationshipType: string
  linkedAt: string
  // Assuming these new fields are available based on the instruction's usage
  firstName: string
  lastName: string
  class: string
  school: string
}

interface StudentStatistics {
  totalTests: number
  averageScore: number
  bestScore: number
  recentTests: any[]
  subjectBreakdown: Array<{
    subject: string
    count: number
    averageScore: number
    comparison: {
      schoolAverage: number
      regionAverage: number
      nationalAverage: number
    }
  }>
  comparisonData: Array<{
    subject: string
    student: number
    school: number
    region: number
    national: number
  }>
  performanceTrend: Array<{
    date: string
    score: number
    subject: string
  }>
  weakAreas: Array<{
    subject: string
    averageScore: number
    testCount: number
  }>
  strongAreas: Array<{
    subject: string
    averageScore: number
    testCount: number
  }>
  recentActivity: Array<{
    id: number
    subject: string
    topic: string
    score: number
    date: string
    time: string
  }>
  monthly: {
    testsThisMonth: number
    averageThisMonth: number
  }
}

export default function ParentDashboard() {
  const router = useRouter()
  const { toast } = useToast()
  const { theme, getThemeClasses } = useTheme()
  const [userData, setUserData] = useState<any>(null)
  const [linkedStudents, setLinkedStudents] = useState<LinkedStudent[]>([])
  const [selectedStudent, setSelectedStudent] = useState<number | string | null>(null)
  const [studentStats, setStudentStats] = useState<StudentStatistics | null>(null)

  const [addStudentStep, setAddStudentStep] = useState<'choice' | 'form'>('choice')
  const [currentView, setCurrentView] = useState<'dashboard' | 'messages'>('dashboard')
  const [studentFormData, setStudentFormData] = useState({
    firstName: "",
    lastName: "",
    fatherName: "",
    school: "",
    email: ""
  })
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month' | 'year'>('month')
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isAddingStudent, setIsAddingStudent] = useState(false)
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false)


  const themeClasses = getThemeClasses()

  useEffect(() => {
    const storedUserData = localStorage.getItem("userData")
    if (storedUserData) {
      const parsed = JSON.parse(storedUserData)
      if (parsed.accountType !== "parent" && parsed.accountType !== "teacher" && parsed.accountType !== "director") {
        router.push("/dashboard")
        return
      }
      setUserData(parsed)
      loadLinkedStudents(parsed.id)
    } else {
      router.push("/login")
    }
  }, [router])

  const loadLinkedStudents = async (parentId: number) => {
    try {
      const session = localStorage.getItem("session")
      const token = session ? JSON.parse(session).access_token : null

      const response = await fetch(`/api/students/link?parentId=${parentId}`, {
        headers: token ? { "Authorization": `Bearer ${token}` } : {}
      })
      const data = await response.json()

      if (data.success) {
        setLinkedStudents(data.links)
        if (data.links.length > 0) {
          const firstStudentId = data.links[0].studentId
          setSelectedStudent(firstStudentId)
          loadStudentResults(firstStudentId, parentId, timeRange)
        }
      }
    } catch (error) {
      console.error("Load students error:", error)
    }
  }

  const loadStudentResults = async (studentId: number | string, parentId: number | string, range: string = 'month') => {
    try {
      setIsLoading(true)
      const session = localStorage.getItem("session")
      const token = session ? JSON.parse(session).access_token : null

      const response = await fetch(`/api/students/results?studentId=${studentId}&parentId=${parentId}&timeRange=${range}`, {
        headers: token ? { "Authorization": `Bearer ${token}` } : {}
      })
      const data = await response.json()

      if (data.success) {
        setStudentStats(data.statistics)
        // Auto-select first subject if none selected
        if (!selectedSubject && data.statistics.subjectBreakdown.length > 0) {
          setSelectedSubject(data.statistics.subjectBreakdown[0].subject)
        }
      } else {
        const errorMsg = typeof data.error === 'object' ? data.error.message : data.error;
        toast({
          title: "Xəta",
          description: errorMsg || "Nəticələr yüklənmədi",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Load results error:", error)
      toast({
        title: "Xəta",
        description: "Nəticələr yüklənərkən xəta baş verdi",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddStudent = async () => {
    if (!studentFormData.email.trim() || !studentFormData.firstName.trim() || !studentFormData.lastName.trim()) {
      toast({
        title: "Xəta",
        description: "Zəhmət olmasa vacib sahələri doldurun",
        variant: "destructive",
      })
      return
    }

    try {
      setIsAddingStudent(true)
      const session = localStorage.getItem("session")
      const token = session ? JSON.parse(session).access_token : null

      const response = await fetch("/api/students/link", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { "Authorization": `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          parentId: userData.id,
          studentEmail: studentFormData.email.trim(),
          studentDetails: {
            firstName: studentFormData.firstName,
            lastName: studentFormData.lastName,
            fatherName: studentFormData.fatherName,
            school: studentFormData.school
          },
          relationshipType: userData.role || "parent",
        }),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Sorğu göndərildi! 🎉",
          description: "Şagirdə təsdiq sorğusu göndərildi (Demo rejimdə avtomatik təsdiqləndi)",
        })
        setStudentFormData({
          firstName: "",
          lastName: "",
          fatherName: "",
          school: "",
          email: ""
        })
        setAddStudentStep('choice')
        setIsAddStudentOpen(false) // Close dialog on success
        loadLinkedStudents(userData.id)
      } else {
        throw new Error(data.error || "Şagird əlavə edilmədi")
      }
    } catch (error) {
      toast({
        title: "Xəta",
        description: error instanceof Error ? error.message : "Şagird əlavə edilərkən xəta baş verdi",
        variant: "destructive",
      })
    } finally {
      setIsAddingStudent(false)
    }
  }

  const handleRemoveStudent = async (linkId: number) => {
    if (!confirm("Bu şagirdi silmək istədiyinizdən əminsiniz?")) {
      return
    }

    try {
      const session = localStorage.getItem("session")
      const token = session ? JSON.parse(session).access_token : null

      const response = await fetch(`/api/students/link?linkId=${linkId}`, {
        method: "DELETE",
        headers: token ? { "Authorization": `Bearer ${token}` } : {}
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Uğurlu",
          description: "Şagird uğurla silindi",
        })
        loadLinkedStudents(userData.id)
        setSelectedStudent(null)
        setStudentStats(null)
      } else {
        throw new Error(data.error || "Şagird silinmədi")
      }
    } catch (error) {
      toast({
        title: "Xəta",
        description: error instanceof Error ? error.message : "Şagird silinərkən xəta baş verdi",
        variant: "destructive",
      })
    }
  }

  const handleStudentSelect = (studentId: number | string) => {
    setSelectedStudent(studentId as any)
    setSelectedSubject(null) // Reset subject when student changes
    loadStudentResults(studentId as any, userData.id, timeRange)
  }

  const handleTimeRangeChange = (range: 'day' | 'week' | 'month' | 'year') => {
    setTimeRange(range)
    if (selectedStudent) {
      loadStudentResults(selectedStudent as any, userData.id, range)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreBadge = (score: number) => {
    if (score >= 80) return { text: "🏆Əla", className: "bg-green-100 text-green-800" }
    if (score >= 60) return { text: "👍 Yaxşı", className: "bg-yellow-100 text-yellow-800" }
    return { text: "📚 Zəif", className: "bg-red-100 text-red-800" }
  }

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "parent":
        return "Valideyn"
      case "teacher":
        return "Müəllim"
      case "director":
        return "Direktor"
      default:
        return role
    }
  }

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  const selectedStudentData = linkedStudents.find((s) => s.studentId === selectedStudent)

  return (
    <div className={`min-h-screen bg-gradient-to-br ${theme.gradient}`}>
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-sm shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Users className={`h-8 w-8 ${themeClasses.text} mr-3`} />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{getRoleLabel(userData.role)} İdarəetmə Paneli</h1>
                <p className="text-sm text-gray-600">Sistem Versiyası: 2.1 • Cihaz: {userData.email}</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <ProfileAvatar
                firstName={userData.firstName}
                lastName={userData.lastName}
                profileImage={userData.profileImage}
                size="md"
              />
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {userData.firstName} {userData.lastName}
                </p>
                <p className="text-xs text-gray-600">{userData.school}</p>
              </div>

              <Link href="/profile">
                <Button variant="outline" size="sm" className="gap-2">
                  <User className="h-4 w-4" />
                  Profil
                </Button>
              </Link>
              <Button
                variant={currentView === 'messages' ? 'default' : 'outline'}
                className="gap-2"
                onClick={() => setCurrentView(currentView === 'dashboard' ? 'messages' : 'dashboard')}
              >
                {currentView === 'dashboard' ? <Mail className="h-4 w-4" /> : <LayoutDashboard className="h-4 w-4" />}
                {currentView === 'dashboard' ? 'Mesajlar' : 'Panel'}
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
                Çıxış
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'messages' ? (
          <MessagesTab userId={userData.id} userRole={userData.accountType} />
        ) : (
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar - Student List */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Şagirdlər</span>
                    <Badge variant="secondary">{linkedStudents.length}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Add Student Dialog */}
                  <Dialog open={isAddStudentOpen} onOpenChange={setIsAddStudentOpen}>
                    <DialogTrigger asChild>
                      <Button className={`w-full ${themeClasses.primary}`}>
                        <Plus className="h-4 w-4 mr-2" />
                        Şagird Əlavə Et
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                      <DialogHeader>
                        <DialogTitle>Şagird Əlavə Et</DialogTitle>
                        <DialogDescription>
                          {addStudentStep === 'choice'
                            ? "Şagirdin qeydiyyat statusunu seçin"
                            : "Şagirdin məlumatlarını daxil edin"}
                        </DialogDescription>
                      </DialogHeader>

                      {addStudentStep === 'choice' ? (
                        <div className="grid grid-cols-2 gap-4 mt-4">
                          <Card
                            className="cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all"
                            onClick={() => router.push('/register?role=student')}
                          >
                            <CardContent className="flex flex-col items-center justify-center p-6 text-center h-full">
                              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mb-3">
                                <Plus className="h-6 w-6 text-blue-600" />
                              </div>
                              <h3 className="font-semibold mb-1">Yeni Şagird</h3>
                              <p className="text-xs text-gray-500">Platformada qeydiyyatdan keçməyib</p>
                            </CardContent>
                          </Card>

                          <Card
                            className="cursor-pointer hover:border-green-500 hover:bg-green-50 transition-all"
                            onClick={() => setAddStudentStep('form')}
                          >
                            <CardContent className="flex flex-col items-center justify-center p-6 text-center h-full">
                              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-3">
                                <User className="h-6 w-6 text-green-600" />
                              </div>
                              <h3 className="font-semibold mb-1">Mövcud Şagird</h3>
                              <p className="text-xs text-gray-500">Artıq qeydiyyatdan keçib</p>
                            </CardContent>
                          </Card>
                        </div>
                      ) : (
                        <div className="space-y-4 mt-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="firstName">Ad *</Label>
                              <Input
                                id="firstName"
                                value={studentFormData.firstName}
                                onChange={(e) => setStudentFormData({ ...studentFormData, firstName: e.target.value })}
                                placeholder="Ad"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="lastName">Soyad *</Label>
                              <Input
                                id="lastName"
                                value={studentFormData.lastName}
                                onChange={(e) => setStudentFormData({ ...studentFormData, lastName: e.target.value })}
                                placeholder="Soyad"
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="fatherName">Ata adı</Label>
                            <Input
                              id="fatherName"
                              value={studentFormData.fatherName}
                              onChange={(e) => setStudentFormData({ ...studentFormData, fatherName: e.target.value })}
                              placeholder="Ata adı"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="school">Məktəb</Label>
                            <Input
                              id="school"
                              value={studentFormData.school}
                              onChange={(e) => setStudentFormData({ ...studentFormData, school: e.target.value })}
                              placeholder="Məktəb adı"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="email">Email *</Label>
                            <Input
                              id="email"
                              type="email"
                              value={studentFormData.email}
                              onChange={(e) => setStudentFormData({ ...studentFormData, email: e.target.value })}
                              placeholder="student@example.com"
                            />
                          </div>

                          <div className="flex gap-3 pt-2">
                            <Button variant="outline" onClick={() => setAddStudentStep('choice')} className="w-1/3">
                              Geri
                            </Button>
                            <Button onClick={handleAddStudent} disabled={isAddingStudent} className="w-2/3">
                              {isAddingStudent ? "Sorğu göndərilir..." : "Təsdiq sorğusu göndər"}
                            </Button>
                          </div>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>

                  {/* Student List */}
                  <div className="space-y-2">
                    {linkedStudents.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">Hələ şagird əlavə edilməyib</p>
                      </div>
                    ) : (
                      linkedStudents.map((student) => (
                        <Card
                          key={student.id}
                          className={`cursor-pointer transition-all hover:shadow-md ${selectedStudent === student.studentId ? `ring-2 ${themeClasses.ring}` : ""
                            }`}
                          onClick={() => handleStudentSelect(student.studentId)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h4 className="font-medium text-sm">{student.studentName}</h4>
                                <p className="text-xs text-gray-600">{student.studentClass}-ci sinif</p>
                                <p className="text-xs text-gray-500 mt-1">{student.studentSchool}</p>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleRemoveStudent(student.id)
                                }}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content - Student Details */}
            <div className="lg:col-span-3">
              {isLoading ? (
                <Card className="text-center py-16">
                  <CardContent>
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-gray-600">Yüklənir...</p>
                  </CardContent>
                </Card>
              ) : !selectedStudent || !studentStats ? (
                <Card className="text-center py-16">
                  <CardContent>
                    <Eye className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-semibold mb-2">Şagird Seçin</h3>
                    <p className="text-gray-600">Nəticələri görmək üçün sol tərəfdən bir şagird seçin</p>
                    {linkedStudents.length > 0 ? (
                      <p className="text-xs text-blue-500 mt-2 font-medium">Cəmi {linkedStudents.length} şagird tapıldı. Seçim edin.</p>
                    ) : (
                      <p className="text-xs text-red-500 mt-2">Heç bir şagird tapılmadı. Zəhmət olmasa "Şagird Əlavə Et" düyməsini istifadə edin.</p>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-6">
                  {/* Student Header */}
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-2xl">{selectedStudentData?.studentName}</CardTitle>
                          <CardDescription>
                            {selectedStudentData?.studentClass}-ci sinif • {selectedStudentData?.studentSchool}
                          </CardDescription>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="bg-gray-100 p-1 rounded-lg flex space-x-1">
                            {[
                              { id: 'day', label: 'Cari gün' },
                              { id: 'week', label: 'Həftəlik' },
                              { id: 'month', label: 'Aylıq' },
                              { id: 'year', label: 'İllik' }
                            ].map((range) => (
                              <button
                                key={range.id}
                                onClick={() => handleTimeRangeChange(range.id as any)}
                                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${timeRange === range.id
                                  ? 'bg-white shadow-sm text-blue-600'
                                  : 'text-gray-500 hover:text-gray-700'
                                  }`}
                              >
                                {range.label}
                              </button>
                            ))}
                          </div>
                          <Badge className={getScoreBadge(studentStats.averageScore).className}>
                            {getScoreBadge(studentStats.averageScore).text}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>

                  {/* Statistics Cards */}
                  <div className="grid md:grid-cols-4 gap-4">
                    <Card>
                      <CardContent className="p-6 text-center">
                        <BookOpen className={`h-8 w-8 ${themeClasses.text} mx-auto mb-2`} />
                        <div className="text-3xl font-bold">{studentStats.totalTests}</div>
                        <div className="text-sm text-gray-600">Ümumi Test</div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-6 text-center">
                        <Target className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                        <div className={`text-3xl font-bold ${getScoreColor(studentStats.averageScore)}`}>
                          {studentStats.averageScore}%
                        </div>
                        <div className="text-sm text-gray-600">Orta Bal</div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-6 text-center">
                        <Award className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                        <div className={`text-3xl font-bold ${getScoreColor(studentStats.bestScore)}`}>
                          {studentStats.bestScore}%
                        </div>
                        <div className="text-sm text-gray-600">Ən Yaxşı</div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-6 text-center">
                        <Calendar className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                        <div className="text-3xl font-bold">{studentStats.monthly.testsThisMonth}</div>
                        <div className="text-sm text-gray-600">Bu Ay</div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Tabs */}
                  <Tabs defaultValue="overview" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-5">
                      <TabsTrigger value="overview">Ümumi</TabsTrigger>
                      <TabsTrigger value="subjects">Fənlər</TabsTrigger>
                      <TabsTrigger value="comparison">Müqayisə</TabsTrigger>
                      <TabsTrigger value="progress">Tərəqqi</TabsTrigger>
                      <TabsTrigger value="activity">Aktivlik</TabsTrigger>
                    </TabsList>

                    {/* Overview Tab */}
                    <TabsContent value="overview" className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        {/* Strong Areas */}
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center text-green-600">
                              <TrendingUp className="h-5 w-5 mr-2" />
                              Güclü Tərəflər
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            {studentStats.strongAreas.length === 0 ? (
                              <p className="text-sm text-gray-600">Məlumat yoxdur</p>
                            ) : (
                              <div className="space-y-3">
                                {studentStats.strongAreas.map((area, index) => (
                                  <div key={index} className="flex items-center justify-between">
                                    <div className="flex-1">
                                      <div className="flex items-center justify-between mb-1">
                                        <span className="text-sm font-medium">{area.subject}</span>
                                        <span className="text-sm text-green-600">{area.averageScore}%</span>
                                      </div>
                                      <Progress value={area.averageScore} className="h-2" />
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </CardContent>
                        </Card>

                        {/* Weak Areas */}
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center text-red-600">
                              <TrendingDown className="h-5 w-5 mr-2" />
                              Zəif Tərəflər
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            {studentStats.weakAreas.length === 0 ? (
                              <div className="text-center py-4">
                                <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-2" />
                                <p className="text-sm text-green-600 font-medium">Zəif sahə yoxdur!</p>
                              </div>
                            ) : (
                              <div className="space-y-3">
                                {studentStats.weakAreas.map((area, index) => (
                                  <div key={index} className="flex items-center justify-between">
                                    <div className="flex-1">
                                      <div className="flex items-center justify-between mb-1">
                                        <span className="text-sm font-medium">{area.subject}</span>
                                        <span className="text-sm text-red-600">{area.averageScore}%</span>
                                      </div>
                                      <Progress value={area.averageScore} className="h-2" />
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      </div>

                      {/* Performance Trend Chart */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center">
                            <BarChart3 className="h-5 w-5 mr-2" />
                            Performans Trendi
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          {studentStats.performanceTrend.length === 0 ? (
                            <p className="text-sm text-gray-600 text-center py-8">Məlumat yoxdur</p>
                          ) : (
                            <ResponsiveContainer width="100%" height={300}>
                              <LineChart data={studentStats.performanceTrend}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis domain={[0, 100]} />
                                <RechartsTooltip />
                                <Legend />
                                <Line type="monotone" dataKey="score" stroke="#3b82f6" name="Bal" />
                              </LineChart>
                            </ResponsiveContainer>
                          )}
                        </CardContent>
                      </Card>
                    </TabsContent>

                    {/* Subjects Tab */}
                    <TabsContent value="subjects" className="space-y-6">
                      <Card>
                        <CardHeader>
                          <CardTitle>Fənn üzrə Statistika</CardTitle>
                        </CardHeader>
                        <CardContent>
                          {studentStats.subjectBreakdown.length === 0 ? (
                            <p className="text-sm text-gray-600 text-center py-8">Məlumat yoxdur</p>
                          ) : (
                            <div className="space-y-4">
                              {studentStats.subjectBreakdown.map((subject, index) => (
                                <Card key={index}>
                                  <CardContent className="p-4">
                                    <div className="flex items-center justify-between mb-2">
                                      <h4 className="font-medium">{subject.subject}</h4>
                                      <div className="flex items-center space-x-4">
                                        <Badge variant="outline">{subject.count} test</Badge>
                                        <Badge className={getScoreBadge(subject.averageScore).className}>
                                          {subject.averageScore}%
                                        </Badge>
                                      </div>
                                    </div>
                                    <Progress value={subject.averageScore} className="h-3" />
                                  </CardContent>
                                </Card>
                              ))}
                            </div>
                          )}
                        </CardContent>
                      </Card>

                      {/* Subject Comparison Chart */}
                      <Card>
                        <CardHeader>
                          <CardTitle>Fənn Müqayisəsi</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={studentStats.subjectBreakdown}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="subject" />
                              <YAxis domain={[0, 100]} />
                              <RechartsTooltip />
                              <Legend />
                              <Bar dataKey="averageScore" fill="#3b82f6" name="Orta Bal" />
                            </BarChart>
                          </ResponsiveContainer>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    {/* Comparison Tab */}
                    <TabsContent value="comparison" className="space-y-6">
                      <Card>
                        <CardHeader>
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                              <CardTitle>Nəticələrin Müqayisəsi (%)</CardTitle>
                              <CardDescription>
                                Şagirdin nəticələrinin məktəb, bölgə və ölkə üzrə orta göstəricilərlə müqayisəsi
                              </CardDescription>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {studentStats.subjectBreakdown.map((s) => (
                                <Button
                                  key={s.subject}
                                  variant={selectedSubject === s.subject ? "default" : "outline"}
                                  size="sm"
                                  onClick={() => setSelectedSubject(s.subject)}
                                  className="text-xs"
                                >
                                  {s.subject}
                                </Button>
                              ))}
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          {!selectedSubject ? (
                            <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed">
                              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                              <h3 className="text-lg font-medium text-gray-900">Fənn Seçilməyib</h3>
                              <p className="text-gray-500">Müqayisəli analizi görmək üçün yuxarıdakı siyahıdan bir fənn seçin</p>
                            </div>
                          ) : (
                            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                              {/* Focused Comparison Card */}
                              {(() => {
                                const sub = studentStats.subjectBreakdown.find(s => s.subject === selectedSubject);
                                if (!sub) return null;

                                const comparisonItems = [
                                  { label: 'Şagirdin Nəticəsi', value: sub.averageScore, color: 'bg-blue-600', icon: User },
                                  { label: 'Məktəb Ortalaması', value: sub.comparison.schoolAverage, color: 'bg-green-600', icon: GraduationCap },
                                  { label: 'Bölgə Ortalaması', value: sub.comparison.regionAverage, color: 'bg-orange-600', icon: Target },
                                  { label: 'Ölkə Ortalaması', value: sub.comparison.nationalAverage, color: 'bg-red-600', icon: Globe }
                                ];

                                return (
                                  <>
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                      {comparisonItems.map((item, i) => (
                                        <Card key={i} className="border-none shadow-sm bg-gray-50/50">
                                          <CardContent className="p-4">
                                            <div className="flex items-center justify-between mb-2">
                                              <item.icon className="h-4 w-4 text-gray-500" />
                                              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">{item.label}</span>
                                            </div>
                                            <div className="flex items-end gap-2">
                                              <span className="text-2xl font-bold">{Math.round(item.value)}%</span>
                                              <div className="flex-1 h-2 bg-gray-200 rounded-full mb-1 overflow-hidden">
                                                <div
                                                  className={`h-full ${item.color}`}
                                                  style={{ width: `${item.value}%` }}
                                                />
                                              </div>
                                            </div>
                                          </CardContent>
                                        </Card>
                                      ))}
                                    </div>

                                    <div className="h-[350px] w-full mt-6">
                                      <ResponsiveContainer width="100%" height="100%">
                                        <BarChart
                                          data={[
                                            {
                                              name: selectedSubject,
                                              student: sub.averageScore,
                                              school: sub.comparison.schoolAverage,
                                              region: sub.comparison.regionAverage,
                                              national: sub.comparison.nationalAverage
                                            }
                                          ]}
                                          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                                        >
                                          <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                          <XAxis dataKey="name" hide />
                                          <YAxis domain={[0, 100]} />
                                          <RechartsTooltip
                                            cursor={{ fill: 'transparent' }}
                                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                          />
                                          <Legend verticalAlign="top" height={36} />
                                          <Bar dataKey="student" fill="#3b82f6" name="Şagird" radius={[6, 6, 0, 0]} barSize={60} />
                                          <Bar dataKey="school" fill="#10b981" name="Məktəb" radius={[6, 6, 0, 0]} barSize={60} />
                                          <Bar dataKey="region" fill="#f59e0b" name="Bölgə" radius={[6, 6, 0, 0]} barSize={60} />
                                          <Bar dataKey="national" fill="#ef4444" name="Ölkə" radius={[6, 6, 0, 0]} barSize={60} />
                                        </BarChart>
                                      </ResponsiveContainer>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6 mt-8">
                                      <Card className="bg-primary/5 border-primary/20">
                                        <CardHeader className="pb-2">
                                          <CardTitle className="text-sm flex items-center">
                                            <TrendingUp className="h-4 w-4 mr-2 text-primary" />
                                            Analiz: {selectedSubject}
                                          </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                          <div className="space-y-4">
                                            <div className="p-4 bg-white rounded-xl shadow-sm space-y-3">
                                              <div className="flex justify-between items-center text-sm">
                                                <span className="text-gray-600">Ölkə ortalaması ilə müqayisə:</span>
                                                <Badge className={sub.averageScore >= sub.comparison.nationalAverage ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}>
                                                  {sub.averageScore >= sub.comparison.nationalAverage ? "+" : ""}
                                                  {(sub.averageScore - sub.comparison.nationalAverage).toFixed(1)}%
                                                </Badge>
                                              </div>
                                              <div className="flex justify-between items-center text-sm">
                                                <span className="text-gray-600">Bölgə ortalaması ilə müqayisə:</span>
                                                <Badge className={sub.averageScore >= sub.comparison.regionAverage ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}>
                                                  {sub.averageScore >= sub.comparison.regionAverage ? "+" : ""}
                                                  {(sub.averageScore - sub.comparison.regionAverage).toFixed(1)}%
                                                </Badge>
                                              </div>
                                            </div>
                                          </div>
                                        </CardContent>
                                      </Card>

                                      <Card className="border-blue-100 bg-blue-50/30">
                                        <CardHeader className="pb-2">
                                          <CardTitle className="text-sm flex items-center">
                                            <Award className="h-4 w-4 mr-2 text-blue-600" />
                                            Xüsusi Tövsiyələr
                                          </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                          <ul className="text-sm space-y-3 text-gray-700">
                                            <li className="flex items-start bg-white p-2 rounded-lg shadow-sm">
                                              <span className="text-blue-600 mr-2 font-bold">1.</span>
                                              <span>{sub.averageScore < sub.comparison.nationalAverage
                                                ? `${selectedSubject} üzrə nəticələr ölkə ortalamasından aşağıdır. Bu fənnə daha çox vaxt ayrılmalıdır.`
                                                : `${selectedSubject} üzrə nəticələr ölkə ortalamasından yüksəkdir! Bu tempdə davam etmək vacibdir.`}</span>
                                            </li>
                                            <li className="flex items-start bg-white p-2 rounded-lg shadow-sm">
                                              <span className="text-blue-600 mr-2 font-bold">2.</span>
                                              <span>Mütəxəssis rəyi üçün şagirdin müəllimi ilə ətraflı məsləhətləşin.</span>
                                            </li>
                                          </ul>
                                        </CardContent>
                                      </Card>
                                    </div>
                                  </>
                                );
                              })()}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </TabsContent>
                    <TabsContent value="progress" className="space-y-6">
                      <Card>
                        <CardHeader>
                          <CardTitle>İrəliləyiş Təhlili</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-6">
                            {/* Monthly Progress */}
                            <div>
                              <h4 className="font-medium mb-4">Bu Aylıq Performans</h4>
                              <div className="grid md:grid-cols-2 gap-4">
                                <Card className="bg-blue-50">
                                  <CardContent className="p-4">
                                    <div className="flex items-center justify-between">
                                      <div>
                                        <p className="text-sm text-gray-600">Test Sayı</p>
                                        <p className="text-2xl font-bold text-blue-600">
                                          {studentStats.monthly.testsThisMonth}
                                        </p>
                                      </div>
                                      <Calendar className="h-12 w-12 text-blue-600 opacity-50" />
                                    </div>
                                  </CardContent>
                                </Card>

                                <Card className="bg-green-50">
                                  <CardContent className="p-4">
                                    <div className="flex items-center justify-between">
                                      <div>
                                        <p className="text-sm text-gray-600">Orta Bal</p>
                                        <p className="text-2xl font-bold text-green-600">
                                          {studentStats.monthly.averageThisMonth}%
                                        </p>
                                      </div>
                                      <Target className="h-12 w-12 text-green-600 opacity-50" />
                                    </div>
                                  </CardContent>
                                </Card>
                              </div>
                            </div>

                            {/* Progress Timeline */}
                            <div>
                              <h4 className="font-medium mb-4">Son Testlər</h4>
                              <div className="space-y-3">
                                {studentStats.recentTests.slice(0, 5).map((test: any, index: number) => (
                                  <Card key={index}>
                                    <CardContent className="p-4">
                                      <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                          <h5 className="font-medium text-sm">{test.textbook}</h5>
                                          <p className="text-xs text-gray-600">{test.topic}</p>
                                        </div>
                                        <Badge className={getScoreBadge(test.score).className}>{test.score}%</Badge>
                                      </div>
                                    </CardContent>
                                  </Card>
                                ))}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    {/* Activity Tab */}
                    <TabsContent value="activity" className="space-y-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center">
                            <Clock className="h-5 w-5 mr-2" />
                            Son Aktivliklər
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          {studentStats.recentActivity.length === 0 ? (
                            <p className="text-sm text-gray-600 text-center py-8">Aktivlik yoxdur</p>
                          ) : (
                            <div className="space-y-3">
                              {studentStats.recentActivity.map((activity) => (
                                <Card key={activity.id}>
                                  <CardContent className="p-4">
                                    <div className="flex items-start justify-between">
                                      <div className="flex-1">
                                        <div className="flex items-center space-x-2 mb-1">
                                          <BookOpen className="h-4 w-4 text-gray-600" />
                                          <h5 className="font-medium text-sm">{activity.subject}</h5>
                                        </div>
                                        <p className="text-xs text-gray-600 mb-2">{activity.topic}</p>
                                        <div className="flex items-center space-x-3 text-xs text-gray-500">
                                          <span className="flex items-center">
                                            <Calendar className="h-3 w-3 mr-1" />
                                            {activity.date}
                                          </span>
                                          <span className="flex items-center">
                                            <Clock className="h-3 w-3 mr-1" />
                                            {activity.time}
                                          </span>
                                        </div>
                                      </div>
                                      <Badge className={getScoreBadge(activity.score).className}>{activity.score}%</Badge>
                                    </div>
                                  </CardContent>
                                </Card>
                              ))}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>
                </div>
              )
              }
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
