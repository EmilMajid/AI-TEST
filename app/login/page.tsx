"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { BookOpen, ArrowLeft, AlertCircle } from 'lucide-react'
import Link from "next/link"
import { useRouter } from 'next/navigation'
import { useTheme } from "@/hooks/use-theme"
import RegionBackground from "@/components/region-background"
import Image from "next/image"
import { getDashboardPath } from "@/lib/profile-utils"

export default function LoginPage() {
  const router = useRouter()
  const { theme, getThemeClasses } = useTheme()

  // Steps: 'role' -> 'email' -> 'user-selection' (if needed) -> 'password'
  const [step, setStep] = useState<'role' | 'email' | 'user-selection' | 'password'>('role')

  const [formData, setFormData] = useState({
    role: "",
    email: "",
    password: "",
    userId: "", // Selected user ID if multiple exist
  })

  const [foundUsers, setFoundUsers] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const themeClasses = getThemeClasses()

  const roles = [
    { id: "student", label: "Şagird", icon: "🎓" },
    { id: "parent", label: "Valideyn", icon: "👨‍👩‍👧‍👦" },
    { id: "teacher", label: "Müəllim", icon: "👨‍🏫" },
    { id: "director", label: "Direktor", icon: "👔" },
    { id: "admin", label: "Admin", icon: "🛡️" },
  ]

  const handleRoleSelect = (roleId: string) => {
    setFormData(prev => ({ ...prev, role: roleId }))
    setStep('email')
    setError("")
  }

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // Lookup users by email and role
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "lookup",
          email: formData.email,
          role: formData.role
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Xəta baş verdi")
        return
      }

      if (data.users && data.users.length > 0) {
        setFoundUsers(data.users)
        if (data.users.length === 1) {
          // Only one user found, auto-select and go to password
          setFormData(prev => ({ ...prev, userId: data.users[0].id }))
          setStep('password')
        } else {
          // Multiple users found, show selection
          setStep('user-selection')
        }
      } else {
        setError("İstifadəçi tapılmadı")
      }

    } catch (err) {
      setError("Şəbəkə xətası baş verdi")
      console.error("Lookup error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUserSelect = (userId: string) => {
    setFormData(prev => ({ ...prev, userId }))
    setStep('password')
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    console.log("Starting login attempt...")

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "login",
          email: formData.email,
          password: formData.password,
          userId: formData.userId,
          role: formData.role
        }),
      })

      const data = await response.json()
      console.log("Login response status:", response.status, data.success)

      if (!response.ok) {
        console.error("Login failed with status:", response.status, data.error)
        setError(data.error || "Giriş uğursuz oldu")
        return
      }

      // Store user data
      console.log("Login success, storing data and redirecting...")
      localStorage.setItem("user", JSON.stringify(data.user))
      localStorage.setItem("session", JSON.stringify(data.session))
      // Also store userData for dashboard compatibility
      localStorage.setItem("userData", JSON.stringify(data.user))

      console.log("Redirecting...")
      if (data.user.role === 'admin') {
        router.push("/admin/topics")
      } else {
        const dashboardPath = getDashboardPath(data.user.accountType)
        router.push(dashboardPath)
      }
    } catch (err) {
      setError("Şəbəkə xətası baş verdi")
      console.error("Login exception:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const goBack = () => {
    if (step === 'email') setStep('role')
    else if (step === 'user-selection') setStep('email')
    else if (step === 'password') {
      // If we skipped user selection (only 1 user), go back to email
      if (foundUsers.length === 1) setStep('email')
      else setStep('user-selection')
    }
    setError("")
  }

  return (
    <RegionBackground region={theme.region} theme={theme.colorScheme}>
      <div className="min-h-screen flex items-center justify-center py-8">
        <div className="max-w-md w-full mx-auto px-4">




          {/* Header */}
          <div className="flex items-center justify-center mb-8">
            <div className="relative h-12 w-12 mr-3">
              <Image
                src="/logo.jpg"
                alt="EduTest AZ Logo"
                fill
                className="object-contain rounded-md"
              />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">EduTest AZ</h1>
          </div>

          <Card className="backdrop-blur-sm bg-white/95 shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl text-center">
                {step === 'role' && "Kim kimi daxil olmaq istəyirsiniz?"}
                {step === 'email' && "E-mail daxil edin"}
                {step === 'user-selection' && "İstifadəçi seçin"}
                {step === 'password' && "Şifrəni daxil edin"}
              </CardTitle>
              <CardDescription className="text-center">
                {step === 'role' && "Davam etmək üçün statusunuzu seçin"}
                {step === 'email' && `${roles.find(r => r.id === formData.role)?.label} kimi giriş`}
                {step === 'user-selection' && "Bu email ilə bir neçə hesab tapıldı"}
                {step === 'password' && "Hesabınıza daxil olmaq üçün şifrənizi yazın"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              {/* STEP 1: ROLE SELECTION */}
              {step === 'role' && (
                <div className="grid grid-cols-2 gap-4">
                  {roles.map((role) => (
                    <button
                      key={role.id}
                      onClick={() => handleRoleSelect(role.id)}
                      className={`p-4 rounded-xl border-2 transition-all hover:scale-105 flex flex-col items-center gap-2 ${formData.role === role.id
                        ? `border-${theme.colorScheme}-500 bg-${theme.colorScheme}-50`
                        : "border-gray-100 hover:border-gray-200 hover:bg-gray-50"
                        }`}
                    >
                      <span className="text-3xl">{role.icon}</span>
                      <span className="font-medium text-gray-900">{role.label}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* STEP 2: EMAIL INPUT */}
              {step === 'email' && (
                <form onSubmit={handleEmailSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="email">E-mail</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                      placeholder="nümunə@email.com"
                      disabled={isLoading}
                      className="text-lg p-6"
                      autoFocus
                    />
                  </div>
                  <Button type="submit" className={`w-full py-6 text-lg ${themeClasses.primary}`} disabled={isLoading}>
                    {isLoading ? "Yoxlanılır..." : "Davam et"}
                  </Button>
                </form>
              )}

              {/* STEP 3: USER SELECTION (If multiple) */}
              {step === 'user-selection' && (
                <div className="space-y-3">
                  {foundUsers.map((user) => (
                    <button
                      key={user.id}
                      onClick={() => handleUserSelect(user.id)}
                      className="w-full p-4 text-left rounded-xl border border-gray-200 hover:border-primary hover:bg-primary/5 transition-all group"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-bold text-gray-900 group-hover:text-primary">
                            {user.firstName} {user.lastName}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {user.school} • {user.class}-ci sinif
                          </p>
                        </div>
                        <div className="text-2xl">👉</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* STEP 4: PASSWORD INPUT */}
              {step === 'password' && (
                <form onSubmit={handleLogin} className="space-y-6">
                  <div className="text-center mb-4">
                    <div className="inline-block px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-600 mb-2">
                      {foundUsers.find(u => u.id === formData.userId)?.firstName} {foundUsers.find(u => u.id === formData.userId)?.lastName}
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="password">Şifrə</Label>
                    <Input
                      id="password"
                      type="password"
                      required
                      value={formData.password}
                      onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                      placeholder="••••••••"
                      disabled={isLoading}
                      className="text-lg p-6"
                      autoFocus
                    />
                  </div>
                  <Button type="submit" className={`w-full py-6 text-lg ${themeClasses.primary}`} disabled={isLoading}>
                    {isLoading ? "Giriş edilir..." : "Giriş et"}
                  </Button>
                </form>
              )}

              {/* Navigation Footer */}
              <div className="mt-6 flex justify-between items-center text-sm">
                {step !== 'role' ? (
                  <button onClick={goBack} className="text-gray-500 hover:text-gray-900 flex items-center">
                    <ArrowLeft className="h-4 w-4 mr-1" /> Geri
                  </button>
                ) : (
                  <Link href="/" className="text-gray-500 hover:text-gray-900 flex items-center">
                    <ArrowLeft className="h-4 w-4 mr-1" /> Ana səhifə
                  </Link>
                )}

                {step === 'role' && (
                  <Link href="/register" className={`${themeClasses.text} font-medium hover:underline`}>
                    Qeydiyyat
                  </Link>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </RegionBackground>
  )
}
