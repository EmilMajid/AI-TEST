"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Play, Pause, RefreshCw, AlertCircle, CheckCircle, Clock, Settings, User, LogOut } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { ProfileAvatar } from "@/components/profile-avatar"
import { getCurrentUser, logout } from "@/lib/profile-utils"
import BackendStatus from "@/components/backend-status"
import Link from "next/link"

interface ScrapingStatus {
  is_running: boolean
  progress: number
  message: string
  last_run: string | null
  books_found: number
  books_downloaded: number
}

interface ScrapingLog {
  id: number
  started_at: string
  completed_at: string | null
  books_found: number
  books_downloaded: number
  status: string
  error_message: string | null
}

export default function AdminPage() {
  const { toast } = useToast()
  const router = useRouter()
  const [userData, setUserData] = useState<any>(null)
  const [status, setStatus] = useState<ScrapingStatus>({
    is_running: false,
    progress: 0,
    message: "Hazır",
    last_run: null,
    books_found: 0,
    books_downloaded: 0,
  })
  const [logs, setLogs] = useState<ScrapingLog[]>([])
  const [maxBooks, setMaxBooks] = useState(5)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const user = getCurrentUser()
    if (user) {
      setUserData(user)
    }
  }, [])

  useEffect(() => {
    fetchStatus()
    fetchLogs()

    // Status-u hər 3 saniyədə yenilə
    const interval = setInterval(() => {
      if (status.is_running) {
        fetchStatus()
      }
    }, 3000)

    return () => clearInterval(interval)
  }, [status.is_running])

  const fetchStatus = async () => {
    try {
      const response = await fetch("/api/backend/scraping/status")
      if (response.ok) {
        const data = await response.json()
        setStatus(data)
      }
    } catch (error) {
      console.error("Status əldə edilərkən xəta:", error)
    }
  }

  const fetchLogs = async () => {
    try {
      const response = await fetch("/api/backend/scraping/logs")
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setLogs(data.logs)
        }
      }
    } catch (error) {
      console.error("Loglar əldə edilərkən xəta:", error)
    }
  }

  const startScraping = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/backend/scraping/start", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          max_books: maxBooks,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Scraping başladı!",
          description: `Maksimum ${maxBooks} dərslik yüklənəcək`,
        })
        fetchStatus()
      } else {
        throw new Error(data.detail || "Scraping başladılarkən xəta")
      }
    } catch (error) {
      toast({
        title: "Xəta",
        description: error instanceof Error ? error.message : "Scraping başladılarkən xəta",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusIcon = (logStatus: string) => {
    switch (logStatus) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-600" />
      case "running":
        return <Clock className="h-4 w-4 text-blue-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusBadge = (logStatus: string) => {
    switch (logStatus) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Tamamlandı</Badge>
      case "error":
        return <Badge variant="destructive">Xəta</Badge>
      case "running":
        return <Badge className="bg-blue-100 text-blue-800">İşləyir</Badge>
      default:
        return <Badge variant="secondary">Naməlum</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 to-primary/10">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 text-primary mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">TESTAI.AZ - Admin Panel</h1>
            </div>
            <div className="flex items-center gap-3">
              {userData && (
                <>
                  <ProfileAvatar
                    firstName={userData.firstName}
                    lastName={userData.lastName}
                    profileImage={userData.profileImage}
                    size="md"
                  />
                  <Link href="/profile">
                    <Button variant="outline" size="sm" className="gap-2">
                      <User className="h-4 w-4" />
                      Profil
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => {
                      logout()
                      router.push("/login")
                    }}
                  >
                    <LogOut className="h-4 w-4" />
                    Çıxış
                  </Button>
                </>
              )}
              {!userData && (
                <Button variant="outline" onClick={() => (window.location.href = "/dashboard")}>
                  Dashboard-a qayıt
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Backend Status */}
          <div className="lg:col-span-1">
            <BackendStatus />
          </div>

          {/* Scraping Control */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>E-dərslik Scraping</CardTitle>
                <CardDescription>e-derslik.edu.az saytından avtomatik dərslik yükləmə</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="maxBooks">Maksimum dərslik sayı</Label>
                  <Input
                    id="maxBooks"
                    type="number"
                    min="1"
                    max="50"
                    value={maxBooks}
                    onChange={(e) => setMaxBooks(Number.parseInt(e.target.value) || 5)}
                    disabled={status.is_running}
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Status:</span>
                    <Badge variant={status.is_running ? "default" : "secondary"}>
                      {status.is_running ? "İşləyir" : "Dayandırılıb"}
                    </Badge>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Tərəqqi:</span>
                      <span className="text-sm text-gray-600">{status.progress}%</span>
                    </div>
                    <Progress value={status.progress} className="h-2" />
                  </div>

                  <div className="text-sm text-gray-600">
                    <p>{status.message}</p>
                  </div>

                  {status.books_found > 0 && (
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Tapılan:</span>
                        <p className="text-gray-600">{status.books_found} dərslik</p>
                      </div>
                      <div>
                        <span className="font-medium">Yüklənən:</span>
                        <p className="text-gray-600">{status.books_downloaded} dərslik</p>
                      </div>
                    </div>
                  )}

                  {status.last_run && (
                    <div className="text-sm">
                      <span className="font-medium">Son işləmə:</span>
                      <p className="text-gray-600">{new Date(status.last_run).toLocaleString("az-AZ")}</p>
                    </div>
                  )}
                </div>

                <div className="flex space-x-3">
                  <Button onClick={startScraping} disabled={status.is_running || isLoading} className="flex-1">
                    {status.is_running ? (
                      <>
                        <Pause className="h-4 w-4 mr-2" />
                        İşləyir...
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        Scraping Başlat
                      </>
                    )}
                  </Button>

                  <Button variant="outline" onClick={fetchStatus}>
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Environment Variables Guide */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="h-5 w-5 mr-2" />
              Environment Variables Quraşdırması
            </CardTitle>
            <CardDescription>Vercel-də backend URL-ni təyin etmək üçün təlimat</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-2">Vercel Dashboard-da:</h4>
                <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600">
                  <li>Proyektinizi seçin</li>
                  <li>Settings → Environment Variables</li>
                  <li>Add New Variable</li>
                  <li>
                    Name: <code className="bg-gray-100 px-1 rounded">NEXT_PUBLIC_BACKEND_URL</code>
                  </li>
                  <li>Value: Backend serverinizin URL-i</li>
                  <li>Environment: Production, Preview, Development</li>
                </ol>
              </div>
              <div>
                <h4 className="font-medium mb-2">Backend hosting seçimləri:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                  <li>
                    <strong>Railway:</strong> https://your-app.railway.app
                  </li>
                  <li>
                    <strong>Render:</strong> https://your-app.onrender.com
                  </li>
                  <li>
                    <strong>Heroku:</strong> https://your-app.herokuapp.com
                  </li>
                  <li>
                    <strong>Local:</strong> http://localhost:8000
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Qeyd:</strong> Environment variable əlavə etdikdən sonra proyekti yenidən deploy edin. Backend
                server işləmədiyi halda sistem avtomatik olaraq demo məlumatları göstərəcək.
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
