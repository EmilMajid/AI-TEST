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
  Pencil,

  GraduationCap,
  Mail,
  LayoutDashboard,
  Globe,
  Lock,
} from "lucide-react"
import Link from "next/link"
import { MessagesTab } from "@/components/messages-tab"
import { useRouter } from "next/navigation"
import { useTheme } from "@/hooks/use-theme"
import { useToast } from "@/hooks/use-toast"
import { ProfileAvatar } from "@/components/profile-avatar"
import { logout, getRoleLabel } from "@/lib/profile-utils"
import AnalyticsViewer from "@/components/parent/AnalyticsViewer"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
  id: number | string
  studentId: number | string
  studentName: string
  studentEmail: string
  studentClass: string
  studentSchool: string
  relationshipType: string
  linkedAt: string
  firstName?: string
  lastName?: string
  fatherName?: string
  class?: string
  school?: string
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

const ALL_SUBJECTS = [
  "Azərbaycan dili",
  "Ədəbiyyat",
  "Xarici dil",
  "İkinci xarici dil",
  "Riyaziyyat",
  "İnformatika",
  "Azərbaycan tarixi",
  "Ümumi tarix",
  "Fizika",
  "Kimya",
  "Biologiya",
  "Coğrafiya",
  "Təbiət",
  "Həyat bilgisi",
  "Texnologiya",
  "Təsviri incəsənət",
  "Musiqi",
  "Fiziki tərbiyə",
  "Çağırışaqədərki hazırlıq"
]

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
    class: "5",
    email: "",
    password: "",
  })
  const [createdCredentials, setCreatedCredentials] = useState<{
    identifier: string
    uniqueId: string
    password: string
    studentName: string
  } | null>(null)
  const [isSendingReport, setIsSendingReport] = useState(false)
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month' | 'year'>('month')
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isAddingStudent, setIsAddingStudent] = useState(false)
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false)
  const [isEditStudentOpen, setIsEditStudentOpen] = useState(false)
  const [isSavingEditStudent, setIsSavingEditStudent] = useState(false)
  const [editingStudent, setEditingStudent] = useState<LinkedStudent | null>(null)
  const [editStudentForm, setEditStudentForm] = useState({
    firstName: "",
    lastName: "",
    fatherName: "",
    school: "",
    class: "5",
    email: ""
  })
  const [accessRules, setAccessRules] = useState({ isPremium: false, customOverrides: [] as string[] })
  const [globalPermissions, setGlobalPermissions] = useState<any>({})

  const themeClasses = getThemeClasses()

  useEffect(() => {
    const storedUserData = localStorage.getItem("userData") || localStorage.getItem("user")
    if (storedUserData) {
      const parsed = JSON.parse(storedUserData)

      if (parsed.accountType !== "parent" && parsed.accountType !== "teacher" && parsed.accountType !== "director") {
        router.push("/dashboard")
        return
      }
      setUserData(parsed)
      loadLinkedStudents(parsed.id, parsed.email)
      
      // Fetch access control rules based on user email
      fetch(`/api/admin/access-control?t=${Date.now()}`, { cache: 'no-store' })
        .then(res => res.json())
        .then(data => {
          if (data) {
            if (data.globalSettings) {
              const perms: any = {}
              data.globalSettings.forEach((setting: any) => {
                perms[setting.id] = setting.isFree
              })
              setGlobalPermissions(perms)
            }
            if (data.users) {
              const userRule = data.users.find((u: any) => u.email === parsed.email)
              if (userRule) {
                setAccessRules({ isPremium: userRule.hasVip, customOverrides: userRule.customOverrides || [] })
              }
            }
          }
        })
        .catch(console.error)
    } else {
      router.push("/login")
    }
  }, [router])

  const canAccessTab = (tabId: string) => {
    // If it's a completely new user who just logged in and DB isn't synced, fallback to free
    if (Object.keys(globalPermissions).length === 0) return true;
    if (accessRules.isPremium) return true;
    if (accessRules.customOverrides.includes(tabId)) return true;
    if (globalPermissions[tabId] === true) return true;
    return false;
  }

  const renderTabOverlay = (title: string, description: string) => (
    <Card className="relative overflow-hidden border-amber-200 bg-amber-50/50">
      <div className="absolute inset-0 backdrop-blur-[2px] bg-white/40 z-10 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-4">
          <Lock className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-2">Premium Xüsusiyyət: {title}</h3>
        <p className="text-slate-600 max-w-md mb-6">{description}</p>
        <Button className="bg-amber-500 hover:bg-amber-600 text-white gap-2">
           Premium Hesaba Keçid Et
        </Button>
      </div>
      <CardContent className="opacity-30 h-[400px] flex items-center justify-center">
      </CardContent>
    </Card>
  )

  const loadLinkedStudents = async (parentId: number | string, userEmail?: string) => {
    try {
      const session = localStorage.getItem("session")
      const token = session ? JSON.parse(session).access_token : null
      const emailQuery = userEmail ? `&email=${encodeURIComponent(userEmail)}` : ""

      // 1. Check localStorage cache for instant display
      const cacheKey = userEmail ? `linked_students_${userEmail.toLowerCase()}` : `linked_students_${parentId}`
      const cached = localStorage.getItem(cacheKey) || (userEmail ? localStorage.getItem(`linked_students_${parentId}`) : null)
      
      const isTargetAyaz = (s: any) => {
        const name = `${s.firstName || ''} ${s.lastName || ''} ${s.studentName || ''}`.toLowerCase()
        const email = (s.studentEmail || s.email || '').toLowerCase()
        const uId = (s.uniqueId || '').toLowerCase()
        return (
          uId.includes('ayaz.rzayev.161') ||
          uId.includes('ayaz.rzayev.309') ||
          (name.includes('ayaz') && name.includes('rzayev')) ||
          email.includes('ayaz.rzayev')
        )
      }

      if (cached) {
        try {
          const parsedCache = JSON.parse(cached)
          if (Array.isArray(parsedCache) && parsedCache.length > 0) {
            const cleanCache = parsedCache.filter((s: any) => !isTargetAyaz(s))
            if (cleanCache.length !== parsedCache.length) {
              if (userEmail) localStorage.setItem(`linked_students_${userEmail.toLowerCase()}`, JSON.stringify(cleanCache))
              localStorage.setItem(`linked_students_${parentId}`, JSON.stringify(cleanCache))
            }
            if (cleanCache.length > 0) {
              setLinkedStudents(cleanCache)
              if (!selectedStudent) {
                setSelectedStudent(cleanCache[0].studentId)
              }
            } else {
              setLinkedStudents([])
              setSelectedStudent(null)
            }
          }
        } catch (e) {}
      }

      const response = await fetch(`/api/students/link?parentId=${encodeURIComponent(parentId)}${emailQuery}`, {
        headers: token ? { "Authorization": `Bearer ${token}` } : {}
      })
      const data = await response.json()

      let links = data.success && data.links ? data.links.filter((s: any) => !isTargetAyaz(s)) : []

      if (links.length > 0) {
        setLinkedStudents(links)
        if (userEmail) {
          try {
            localStorage.setItem(`linked_students_${userEmail.toLowerCase()}`, JSON.stringify(links))
          } catch (e) {}
        }
        try {
          localStorage.setItem(`linked_students_${parentId}`, JSON.stringify(links))
        } catch (e) {}

        const firstStudentId = links[0].studentId
        setSelectedStudent(firstStudentId)
        loadStudentResults(firstStudentId, parentId, timeRange, userEmail)
      } else if (data.success) {
        setLinkedStudents([])
        setSelectedStudent(null)
        setStudentStats(null)
        if (userEmail) {
          try {
            localStorage.removeItem(`linked_students_${userEmail.toLowerCase()}`)
          } catch (e) {}
        }
        try {
          localStorage.removeItem(`linked_students_${parentId}`)
        } catch (e) {}
      }
    } catch (error) {
      console.error("Load students error:", error)
    }
  }

  const loadStudentResults = async (studentId: number | string, parentId: number | string, range: string = 'month', userEmail?: string) => {
    try {
      setIsLoading(true)
      const session = localStorage.getItem("session")
      const token = session ? JSON.parse(session).access_token : null
      const emailQuery = userEmail ? `&email=${encodeURIComponent(userEmail)}` : ""

      const response = await fetch(`/api/students/results?studentId=${encodeURIComponent(studentId)}&parentId=${encodeURIComponent(parentId)}&timeRange=${range}${emailQuery}`, {
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
    if (!studentFormData.firstName.trim() || !studentFormData.lastName.trim()) {
      toast({
        title: "Xəta",
        description: "Zəhmət olmasa şagirdin ad və soyadını daxil edin",
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
          parentEmail: userData.email,
          studentEmail: studentFormData.email.trim(),
          password: studentFormData.password.trim() || undefined,
          studentDetails: {
            firstName: studentFormData.firstName,
            lastName: studentFormData.lastName,
            fatherName: studentFormData.fatherName,
            school: studentFormData.school,
            class: studentFormData.class,
            password: studentFormData.password.trim() || undefined,
          },
          relationshipType: userData.role || "parent",
        }),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Sorğu göndərildi! 🎉",
          description: "Şagird uğurla əlavə edildi",
        })

        if (data.link) {
          const newEntry: LinkedStudent = {
            id: data.link.id,
            studentId: data.link.studentId || data.link.id,
            studentName: data.link.studentName || `${studentFormData.firstName} ${studentFormData.lastName}`.trim(),
            studentEmail: data.link.studentEmail || studentFormData.email.trim(),
            studentClass: data.link.studentClass || studentFormData.class || "5",
            studentSchool: data.link.studentSchool || studentFormData.school || "Məktəb",
            relationshipType: userData.role || "parent",
            linkedAt: data.link.linkedAt || new Date().toISOString(),
            firstName: studentFormData.firstName,
            lastName: studentFormData.lastName,
            fatherName: studentFormData.fatherName,
            class: data.link.studentClass || studentFormData.class || "5",
            school: studentFormData.school || "Məktəb",
          }
          setLinkedStudents((prev) => {
            const updated = [...prev.filter((p) => p.id !== newEntry.id && p.studentId !== newEntry.studentId), newEntry]
            if (userData?.email) {
              try {
                localStorage.setItem(`linked_students_${userData.email.toLowerCase()}`, JSON.stringify(updated))
              } catch (e) {}
            }
            if (userData?.id) {
              try {
                localStorage.setItem(`linked_students_${userData.id}`, JSON.stringify(updated))
              } catch (e) {}
            }
            return updated
          })
        }

        if (data.credentials) {
          setCreatedCredentials({
            identifier: data.credentials.identifier,
            uniqueId: data.credentials.uniqueId,
            password: data.credentials.password,
            studentName: `${studentFormData.firstName} ${studentFormData.lastName}`.trim(),
          })
        } else {
          setIsAddStudentOpen(false)
        }

        setStudentFormData({
          firstName: "",
          lastName: "",
          fatherName: "",
          school: "",
          class: "5",
          email: "",
          password: "",
        })
        setAddStudentStep('choice')
        loadLinkedStudents(userData.id, userData.email)
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

  const handleSendReportToEmail = async () => {
    if (!selectedStudent || !userData?.email) return
    setIsSendingReport(true)
    try {
      const studentObj = linkedStudents.find((s) => s.studentId === selectedStudent || s.id === selectedStudent)
      const res = await fetch("/api/notifications/send-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: selectedStudent,
          studentName: studentObj?.studentName,
          studentEmail: studentObj?.studentEmail,
          parentEmail: userData.email,
        }),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        toast({
          title: "Uğurlu! 📩",
          description: data.message || `Nəticələr ${userData.email} ünvanına göndərildi`,
        })
      } else {
        throw new Error(data.error || "Hesabat göndərilə bilmədi")
      }
    } catch (err: any) {
      toast({
        title: "Xəta",
        description: err.message || "E-mail göndərilərkən xəta baş verdi",
        variant: "destructive",
      })
    } finally {
      setIsSendingReport(false)
    }
  }

  const handleRemoveStudent = async (linkId: number | string) => {
    if (!confirm("Bu şagirdi silmək istədiyinizdən əminsiniz?")) {
      return
    }

    try {
      const session = localStorage.getItem("session")
      const token = session ? JSON.parse(session).access_token : null

      const response = await fetch(`/api/students/link?linkId=${encodeURIComponent(linkId)}`, {
        method: "DELETE",
        headers: token ? { "Authorization": `Bearer ${token}` } : {}
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Uğurlu",
          description: "Şagird uğurla silindi",
        })

        setLinkedStudents((prev) => {
          const updated = prev.filter((s) => String(s.id) !== String(linkId) && String(s.studentId) !== String(linkId))
          if (userData?.email) {
            try {
              localStorage.setItem(`linked_students_${userData.email.toLowerCase()}`, JSON.stringify(updated))
            } catch (e) {}
          }
          if (userData?.id) {
            try {
              localStorage.setItem(`linked_students_${userData.id}`, JSON.stringify(updated))
            } catch (e) {}
          }
          return updated
        })

        loadLinkedStudents(userData.id, userData.email)
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

  const handleOpenEditStudent = (student: LinkedStudent) => {
    setEditingStudent(student)
    const nameParts = (student.studentName || "").trim().split(" ")
    const fName = student.firstName || nameParts[0] || ""
    const lName = student.lastName || nameParts.slice(1).join(" ") || ""
    setEditStudentForm({
      firstName: fName,
      lastName: lName,
      fatherName: student.fatherName || "",
      school: student.studentSchool || student.school || "",
      class: student.studentClass || student.class || "5",
      email: student.studentEmail || "",
    })
    setIsEditStudentOpen(true)
  }

  const handleSaveEditStudent = async () => {
    if (!editingStudent) return
    if (!editStudentForm.firstName.trim() || !editStudentForm.lastName.trim()) {
      toast({
        title: "Xəta",
        description: "Zəhmət olmasa şagirdin ad və soyadını daxil edin",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSavingEditStudent(true)
      const session = localStorage.getItem("session")
      const token = session ? JSON.parse(session).access_token : null

      const response = await fetch("/api/students/link", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { "Authorization": `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          linkId: editingStudent.id,
          studentId: editingStudent.studentId,
          parentId: userData.id,
          parentEmail: userData.email,
          firstName: editStudentForm.firstName.trim(),
          lastName: editStudentForm.lastName.trim(),
          fatherName: editStudentForm.fatherName.trim(),
          school: editStudentForm.school.trim(),
          class: editStudentForm.class,
          email: editStudentForm.email.trim(),
        }),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Uğurlu! ✅",
          description: "Şagird məlumatları yeniləndi",
        })

        setLinkedStudents((prev) => {
          const updated = prev.map((s) => {
            if (s.id === editingStudent.id || s.studentId === editingStudent.studentId) {
              return {
                ...s,
                studentName: `${editStudentForm.firstName.trim()} ${editStudentForm.lastName.trim()}`.trim(),
                studentClass: editStudentForm.class,
                studentSchool: editStudentForm.school.trim(),
                studentEmail: editStudentForm.email.trim() || s.studentEmail,
                firstName: editStudentForm.firstName.trim(),
                lastName: editStudentForm.lastName.trim(),
                fatherName: editStudentForm.fatherName.trim(),
                class: editStudentForm.class,
                school: editStudentForm.school.trim(),
              }
            }
            return s
          })
          if (userData?.email) {
            try {
              localStorage.setItem(`linked_students_${userData.email.toLowerCase()}`, JSON.stringify(updated))
            } catch (e) {}
          }
          if (userData?.id) {
            try {
              localStorage.setItem(`linked_students_${userData.id}`, JSON.stringify(updated))
            } catch (e) {}
          }
          return updated
        })

        setIsEditStudentOpen(false)
        loadLinkedStudents(userData.id, userData.email)
      } else {
        throw new Error(data.error || "Şagird məlumatları yenilənmədi")
      }
    } catch (error) {
      toast({
        title: "Xəta",
        description: error instanceof Error ? error.message : "Şagird məlumatları yenilənərkən xəta baş verdi",
        variant: "destructive",
      })
    } finally {
      setIsSavingEditStudent(false)
    }
  }

  const handleStudentSelect = (studentId: number | string) => {
    setSelectedStudent(studentId as any)
    setSelectedSubject(null) // Reset subject when student changes
    loadStudentResults(studentId as any, userData.id, timeRange, userData.email)
  }

  const handleTimeRangeChange = (range: 'day' | 'week' | 'month' | 'year') => {
    setTimeRange(range)
    if (selectedStudent) {
      loadStudentResults(selectedStudent as any, userData.id, range, userData.email)
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
                        <DialogTitle>
                          {createdCredentials ? "Şagirdin Giriş Məlumatları" : "Şagird Əlavə Et"}
                        </DialogTitle>
                        <DialogDescription>
                          {createdCredentials
                            ? "Şagirdin platformaya daxil olması üçün məlumatlar hazırdır"
                            : addStudentStep === 'choice'
                            ? "Şagirdin qeydiyyat statusunu seçin"
                            : "Şagirdin məlumatlarını daxil edin"}
                        </DialogDescription>
                      </DialogHeader>

                      {createdCredentials ? (
                        <div className="space-y-4 mt-3">
                          <div className="p-4 bg-green-50 border border-green-200 rounded-xl space-y-3">
                            <div className="flex items-center gap-2 text-green-800 font-semibold text-sm">
                              <CheckCircle className="h-5 w-5 text-green-600" />
                              Şagird Uğurla Əlavə Edildi!
                            </div>
                            <p className="text-xs text-gray-700">
                              <strong>{createdCredentials.studentName}</strong> üçün platformaya giriş məlumatları:
                            </p>
                            <div className="bg-white p-3 rounded-lg border border-green-200 space-y-2 text-xs font-mono">
                              <div className="flex justify-between items-center">
                                <span className="text-gray-500 font-sans">İstifadəçi ID / E-mail:</span>
                                <span className="font-bold text-primary bg-primary/5 px-2 py-0.5 rounded select-all">
                                  {createdCredentials.identifier}
                                </span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-gray-500 font-sans">Giriş Şifrəsi:</span>
                                <span className="font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded select-all">
                                  {createdCredentials.password}
                                </span>
                              </div>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              📌 Bu məlumatları şagirdə təqdim edin ki, <strong>testai.az</strong> saytında daxil olub sərbəst test işləyə bilsin.
                            </p>
                          </div>
                          <Button
                            className={`w-full ${themeClasses.primary}`}
                            onClick={() => {
                              setCreatedCredentials(null)
                              setAddStudentStep('choice')
                              setIsAddStudentOpen(false)
                            }}
                          >
                            Oldu, Bağla
                          </Button>
                        </div>
                      ) : addStudentStep === 'choice' ? (
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
                        <div className="space-y-3 mt-3">
                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                              <Label htmlFor="firstName">Ad *</Label>
                              <Input
                                id="firstName"
                                value={studentFormData.firstName}
                                onChange={(e) => setStudentFormData({ ...studentFormData, firstName: e.target.value })}
                                placeholder="Ad"
                              />
                            </div>
                            <div className="space-y-1.5">
                              <Label htmlFor="lastName">Soyad *</Label>
                              <Input
                                id="lastName"
                                value={studentFormData.lastName}
                                onChange={(e) => setStudentFormData({ ...studentFormData, lastName: e.target.value })}
                                placeholder="Soyad"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                              <Label htmlFor="fatherName">Ata adı</Label>
                              <Input
                                id="fatherName"
                                value={studentFormData.fatherName}
                                onChange={(e) => setStudentFormData({ ...studentFormData, fatherName: e.target.value })}
                                placeholder="Ata adı"
                              />
                            </div>
                            <div className="space-y-1.5">
                              <Label htmlFor="class">Sinif</Label>
                              <Select
                                value={studentFormData.class || "5"}
                                onValueChange={(val) => setStudentFormData({ ...studentFormData, class: val })}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Sinif seçin" />
                                </SelectTrigger>
                                <SelectContent>
                                  {["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11"].map((c) => (
                                    <SelectItem key={c} value={c}>
                                      {c}-ci sinif
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          <div className="space-y-1.5">
                            <Label htmlFor="school">Məktəb</Label>
                            <Input
                              id="school"
                              value={studentFormData.school}
                              onChange={(e) => setStudentFormData({ ...studentFormData, school: e.target.value })}
                              placeholder="Məktəb adı (məs: 161 saylı məktəb)"
                            />
                          </div>

                          <div className="space-y-1.5">
                            <Label htmlFor="email">Email və ya Unikal ID (Könüllü)</Label>
                            <Input
                              id="email"
                              value={studentFormData.email}
                              onChange={(e) => setStudentFormData({ ...studentFormData, email: e.target.value })}
                              placeholder="@murad.mecidov.161 və ya boş saxlayın"
                            />
                            <p className="text-[11px] text-gray-500">
                              💡 Şagirdin e-maili yoxdursa, boş saxlaya bilərsiniz. Sistem avtomatik unikal ID generasiya edəcək.
                            </p>
                          </div>

                          <div className="space-y-1.5 bg-blue-50/60 p-3 rounded-lg border border-blue-100">
                            <Label htmlFor="password" className="text-blue-900 font-medium flex items-center justify-between">
                              <span>Şagird üçün Giriş Şifrəsi (Könüllü)</span>
                              <span className="text-[10px] text-blue-600 font-normal">Standart: Test@2026</span>
                            </Label>
                            <Input
                              id="password"
                              type="text"
                              value={studentFormData.password}
                              onChange={(e) => setStudentFormData({ ...studentFormData, password: e.target.value })}
                              placeholder="Məs: Əli2026 (boş buraxsanız avtomatik təyin ediləcək)"
                              className="bg-white"
                            />
                            <p className="text-[11px] text-blue-700">
                              💡 Şagird <strong>testai.az</strong> saytına daxil olarkən bu şifrədən istifadə edəcək.
                            </p>
                          </div>

                          <div className="flex gap-3 pt-2">
                            <Button variant="outline" onClick={() => setAddStudentStep('choice')} className="w-1/3">
                              Geri
                            </Button>
                            <Button onClick={handleAddStudent} disabled={isAddingStudent} className="w-2/3">
                              {isAddingStudent ? "Əlavə edilir..." : "Şagird Əlavə Et"}
                            </Button>
                          </div>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>

                  {/* Edit Student Dialog */}
                  <Dialog open={isEditStudentOpen} onOpenChange={setIsEditStudentOpen}>
                    <DialogContent className="sm:max-w-[500px]">
                      <DialogHeader>
                        <DialogTitle>Şagird Məlumatlarını Redaktə Et</DialogTitle>
                        <DialogDescription>
                          Şagirdin profil məlumatlarını yeniləyin
                        </DialogDescription>
                      </DialogHeader>

                      <div className="space-y-4 mt-2">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="edit-firstName">Ad *</Label>
                            <Input
                              id="edit-firstName"
                              value={editStudentForm.firstName}
                              onChange={(e) => setEditStudentForm({ ...editStudentForm, firstName: e.target.value })}
                              placeholder="Ad"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="edit-lastName">Soyad *</Label>
                            <Input
                              id="edit-lastName"
                              value={editStudentForm.lastName}
                              onChange={(e) => setEditStudentForm({ ...editStudentForm, lastName: e.target.value })}
                              placeholder="Soyad"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="edit-fatherName">Ata adı</Label>
                          <Input
                            id="edit-fatherName"
                            value={editStudentForm.fatherName}
                            onChange={(e) => setEditStudentForm({ ...editStudentForm, fatherName: e.target.value })}
                            placeholder="Ata adı"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="edit-school">Məktəb</Label>
                          <Input
                            id="edit-school"
                            value={editStudentForm.school}
                            onChange={(e) => setEditStudentForm({ ...editStudentForm, school: e.target.value })}
                            placeholder="Məktəb adı və ya nömrəsi"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="edit-class">Sinif</Label>
                          <select
                            id="edit-class"
                            value={editStudentForm.class}
                            onChange={(e) => setEditStudentForm({ ...editStudentForm, class: e.target.value })}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                          >
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((c) => (
                              <option key={c} value={String(c)}>
                                {c}-ci sinif
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="edit-email">Email və ya Unikal ID (Könüllü)</Label>
                          <Input
                            id="edit-email"
                            value={editStudentForm.email}
                            onChange={(e) => setEditStudentForm({ ...editStudentForm, email: e.target.value })}
                            placeholder="Email və ya Unikal ID"
                          />
                        </div>

                        <div className="flex justify-end gap-2 pt-2">
                          <Button
                            variant="outline"
                            onClick={() => setIsEditStudentOpen(false)}
                            disabled={isSavingEditStudent}
                          >
                            Ləğv et
                          </Button>
                          <Button
                            onClick={handleSaveEditStudent}
                            disabled={isSavingEditStudent}
                            className={themeClasses.primary}
                          >
                            {isSavingEditStudent ? "Saxlanılır..." : "Yadda saxla"}
                          </Button>
                        </div>
                      </div>
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
                              <div className="flex items-center gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleOpenEditStudent(student)
                                  }}
                                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 h-8 w-8 p-0"
                                  title="Redaktə et"
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleRemoveStudent(student.id)
                                  }}
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0"
                                  title="Sil"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
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
                          <div className="flex items-center gap-3">
                            <CardTitle className="text-2xl">{selectedStudentData?.studentName}</CardTitle>
                            {selectedStudentData && (
                              <>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleOpenEditStudent(selectedStudentData)}
                                  className="h-8 gap-1.5 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                >
                                  <Pencil className="h-3.5 w-3.5" />
                                  Redaktə et
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={handleSendReportToEmail}
                                  disabled={isSendingReport}
                                  className="h-8 gap-1.5 text-xs text-green-700 border-green-200 bg-green-50/50 hover:bg-green-100 hover:text-green-800"
                                  title="Son imtahan hesabatını e-mail ünvanınıza göndərin"
                                >
                                  <Mail className="h-3.5 w-3.5" />
                                  {isSendingReport ? "Göndərilir..." : "Hesabatı E-mailə Göndər"}
                                </Button>
                              </>
                            )}
                          </div>
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

                  {/* Empty state info if student hasn't taken tests yet */}
                  {studentStats.totalTests === 0 && (
                    <Card className="border-blue-200 bg-blue-50/60 shadow-sm">
                      <CardContent className="p-4 flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                          <BookOpen className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="text-xs text-blue-900 leading-relaxed">
                          <strong>Məlumat:</strong> Bu şagird hələ heç bir test tamamlamayıb. Şagird sistemə daxil olub test işlədikdə real nəticələr burada əks olunacaq və e-mail ünvanınıza göndəriləcək.
                        </div>
                      </CardContent>
                    </Card>
                  )}

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
                    <TabsList className="grid w-full grid-cols-6">
                      <TabsTrigger value="overview">Ümumi</TabsTrigger>
                      <TabsTrigger value="subjects">Fənlər</TabsTrigger>
                      <TabsTrigger value="comparison">Müqayisə</TabsTrigger>
                      <TabsTrigger value="progress">Tərəqqi</TabsTrigger>
                      <TabsTrigger value="activity">Aktivlik</TabsTrigger>
                      <TabsTrigger value="advanced" className="bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 border border-amber-200">
                        ✨ Premium Analitika
                      </TabsTrigger>
                    </TabsList>

                    {/* Overview Tab */}
                    <TabsContent value="overview" className="space-y-6">
                      {!canAccessTab('overviewTab') ? (
                        renderTabOverlay("Ümumi Göstəricilər", "Övladınızın güclü və zəif tərəflərini, həmçinin performans trendini görmək üçün premium hesaba keçid edin.")
                      ) : (
                        <>
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
                      </>
                      )}
                    </TabsContent>

                    {/* Subjects Tab */}
                    <TabsContent value="subjects" className="space-y-6">
                      {!canAccessTab('subjectsTab') ? (
                        renderTabOverlay("Fənlər Üzrə Statistika", "Hər bir fənn üzrə orta balları və test sayı qrafiklərini görmək üçün premium hesaba keçid edin.")
                      ) : (
                      <>
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
                      </>
                      )}
                    </TabsContent>

                    {/* Comparison Tab */}
                    <TabsContent value="comparison" className="space-y-6">
                      {!canAccessTab('comparisonTab') ? (
                        renderTabOverlay("Məktəb və Ölkə Müqayisəsi", "Övladınızın nəticələrinin məktəb, bölgə və ölkə üzrə orta göstəricilərlə müqayisəsini görmək üçün premium hesaba keçid edin.")
                      ) : (
                      <Card>
                        <CardHeader>
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                              <CardTitle>Nəticələrin Müqayisəsi (%)</CardTitle>
                              <CardDescription>
                                Şagirdin nəticələrinin məktəb, bölgə və ölkə üzrə orta göstəricilərlə müqayisəsi
                              </CardDescription>
                            </div>
                            <div className="w-full md:w-[250px]">
                              <Select
                                value={selectedSubject || ""}
                                onValueChange={setSelectedSubject}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Fənn seçin" />
                                </SelectTrigger>
                                <SelectContent className="max-h-[300px]">
                                  {ALL_SUBJECTS.map((subject) => (
                                    <SelectItem key={subject} value={subject}>
                                      {subject}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
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
                                // If subject has no data, we can either show "No Data" or simulate 0
                                // For better UX, let's show separate view if no data
                                if (!sub) {
                                  return (
                                    <div className="text-center py-12 bg-orange-50 rounded-lg border border-orange-100">
                                      <Target className="h-12 w-12 text-orange-400 mx-auto mb-3" />
                                      <h3 className="text-lg font-medium text-orange-900">Məlumat Tapılmadı</h3>
                                      <p className="text-orange-700">"{selectedSubject}" fənni üzrə hələlik heç bir nəticə mövcud deyil.</p>
                                    </div>
                                  )
                                }

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
                      )}
                    </TabsContent>
                    <TabsContent value="progress" className="space-y-6">
                      {!canAccessTab('progressTab') ? (
                        renderTabOverlay("İnkişaf Tərəqqisi", "Aylıq tərəqqi və irəliləyiş qrafikini izləmək üçün premium hesaba keçid edin.")
                      ) : (
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
                      )}
                    </TabsContent>

                    {/* Activity Tab */}
                    <TabsContent value="activity" className="space-y-6">
                      {!canAccessTab('activityTab') ? (
                        renderTabOverlay("Son Aktivliklər", "Şagirdin etdiyi son testlərin siyahısı və detallarını görmək üçün premium hesaba keçid edin.")
                      ) : (
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
                      )}
                    </TabsContent>

                    {/* Advanced Analytics Tab */}
                    <TabsContent value="advanced" className="space-y-6">
                      <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200 shadow-sm">
                        <CardHeader>
                          <CardTitle className="text-amber-800 flex items-center gap-2">
                            ✨ Qabaqcıl Pedaqoji və Süni İntellekt Analitikası
                          </CardTitle>
                          <CardDescription className="text-amber-700/80">
                            Bu bölmədəki xüsusi hesabatlar rəhbərlik (Admin) tərəfindən idarə olunur.
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <AnalyticsViewer 
                            topic={studentStats.recentTests && studentStats.recentTests.length > 0 ? studentStats.recentTests[0].topic : "Ümumi Riyaziyyat"} 
                            grade={selectedStudentData?.studentClass || "7"} 
                            isPremiumUser={accessRules.isPremium}
                            customOverrides={accessRules.customOverrides}
                          />
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
