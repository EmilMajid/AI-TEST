"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, AlertCircle, Lock, X, Sparkles, ShieldCheck } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useTheme } from "@/hooks/use-theme"
import RegionBackground from "@/components/region-background"
import Image from "next/image"
import { getDashboardPath, getUserUniqueId } from "@/lib/profile-utils"
import { AdBanner } from "@/components/ads/ad-banner"

export default function LoginPage() {
  const router = useRouter()
  const { theme, getThemeClasses } = useTheme()

  // Steps: 'role' -> 'email' -> 'user-selection' (if needed) -> 'password'
  const [step, setStep] = useState<"role" | "email" | "user-selection" | "password">("role")

  const [formData, setFormData] = useState({
    role: "",
    email: "",
    password: "",
    userId: "", // Selected user ID if multiple exist
  })

  const [foundUsers, setFoundUsers] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [restrictedModal, setRestrictedModal] = useState<{ open: boolean; title: string; desc: string } | null>(null)

  const themeClasses = getThemeClasses()

  // Admin siyahıdan çıxarıldı, Müəllim və Direktor məhdudlaşdırıldı
  const roles = [
    { id: "student", label: "Şagird", icon: "🎓", restricted: false },
    { id: "parent", label: "Valideyn", icon: "👨‍👩‍👧‍👦", restricted: false },
    { id: "teacher", label: "Müəllim", icon: "👨‍🏫", restricted: true, badge: "Tezliklə" },
    { id: "director", label: "Direktor", icon: "👔", restricted: true, badge: "Tezliklə" },
  ]

  const handleRoleSelect = (role: { id: string; label: string; restricted: boolean }) => {
    if (role.restricted) {
      setRestrictedModal({
        open: true,
        title: `${role.label} Kabineti Hazırlıq Mərhələsindədir`,
        desc: `Hörmətli ${role.label}, hal-hazırda ${role.label.toLowerCase()} kabineti üzərində texniki təkmilləşdirmə işləri aparılır. Çox tezliklə tam funksionallıqla istifadəyə veriləcək. Əməkdaşlıq və ilkin qeydiyyat üçün bizimlə əlaqə saxlayın: info@testai.az`,
      })
      return
    }
    setFormData((prev) => ({ ...prev, role: role.id }))
    setStep("email")
    setError("")
  }

  const handleAdminSelect = () => {
    setFormData((prev) => ({ ...prev, role: "admin" }))
    setStep("email")
    setError("")
  }

  const findLocalClientUser = (input: string) => {
    try {
      const cleanInput = (input || "").trim().toLowerCase()
      if (!cleanInput) return null
      const cleanId = cleanInput.startsWith("@") ? cleanInput : `@${cleanInput}`
      const cleanWithoutAt = cleanInput.replace("@", "")

      const match = (u: any) => {
        if (!u) return false
        const uEmail = (u.email || "").toLowerCase()
        const uUid = (u.uniqueId || "").toLowerCase()
        const genUid = getUserUniqueId(u).toLowerCase()
        const uId = String(u.id || "").toLowerCase()
        const uStudentId = String(u.studentId || "").toLowerCase()
        const uName = `${u.firstName || ""} ${u.lastName || ""}`.trim().toLowerCase()

        return (
          uEmail === cleanInput ||
          uEmail.split("@")[0] === cleanWithoutAt ||
          uUid === cleanId ||
          uUid.replace("@", "") === cleanWithoutAt ||
          genUid === cleanId ||
          genUid.replace("@", "") === cleanWithoutAt ||
          uId === cleanInput ||
          uId === cleanWithoutAt ||
          uStudentId === cleanInput ||
          uStudentId === cleanWithoutAt ||
          uName === cleanInput
        )
      }

      const storedUserData = localStorage.getItem("userData")
      if (storedUserData) {
        const parsed = JSON.parse(storedUserData)
        if (match(parsed)) return parsed
      }

      const registeredUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]")
      const foundInReg = registeredUsers.find(match)
      if (foundInReg) return foundInReg

      const allLinks = JSON.parse(localStorage.getItem("all_student_links") || "[]")
      for (const l of allLinks) {
        if (match(l.student || l)) return l.student || l
      }
    } catch (e) {}
    return null
  }

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // Check if user is known in local storage (searches by email, uniqueId, id, name)
      const clientUser = findLocalClientUser(formData.email)

      // Lookup users by email and role
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "lookup",
          email: formData.email,
          role: formData.role,
          clientUser,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        // If server lookup failed but we found a valid client user, use client user directly
        if (clientUser) {
          setFoundUsers([clientUser])
          setFormData((prev) => ({
            ...prev,
            userId: clientUser.id || clientUser.studentId,
            email: clientUser.email || prev.email,
            role: clientUser.accountType || clientUser.role || prev.role,
          }))
          setStep("password")
          return
        }
        setError(data.error || "Xəta baş verdi")
        return
      }

      if (data.users && data.users.length > 0) {
        setFoundUsers(data.users)
        if (data.users.length === 1) {
          const matched = data.users[0]
          // Only one user found, auto-select and go to password
          setFormData((prev) => ({
            ...prev,
            userId: matched.id,
            email: matched.email || prev.email,
            role: matched.role || matched.accountType || prev.role,
          }))
          setStep("password")
        } else {
          // Multiple users found, show selection
          setStep("user-selection")
        }
      } else if (clientUser) {
        setFoundUsers([clientUser])
        setFormData((prev) => ({
          ...prev,
          userId: clientUser.id || clientUser.studentId,
          email: clientUser.email || prev.email,
          role: clientUser.accountType || clientUser.role || prev.role,
        }))
        setStep("password")
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

  const handleUserSelect = (user: any) => {
    setFormData((prev) => ({
      ...prev,
      userId: user.id,
      email: user.email || prev.email,
      role: user.role || user.accountType || prev.role,
    }))
    setStep("password")
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    console.log("Starting login attempt...")

    try {
      const clientUser = findLocalClientUser(formData.email) || (formData.userId ? findLocalClientUser(formData.userId) : null)

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "login",
          email: formData.email,
          password: formData.password,
          userId: formData.userId,
          role: formData.role,
          clientUser,
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
      const cleanedUser = {
        ...data.user,
        accountType: data.user?.accountType || formData.role || "student",
        role: data.user?.role || data.user?.accountType || formData.role || "student",
      }

      localStorage.setItem("user", JSON.stringify(cleanedUser))
      localStorage.setItem("session", JSON.stringify(data.session))
      // Also store userData for dashboard compatibility
      localStorage.setItem("userData", JSON.stringify(cleanedUser))

      console.log("Redirecting...")
      if (cleanedUser.role === "admin" || cleanedUser.accountType === "admin") {
        router.push("/admin/topics")
        setTimeout(() => {
          if (!window.location.pathname.startsWith("/admin")) {
            window.location.href = "/admin/topics"
          }
        }, 150)
      } else {
        const dashboardPath = getDashboardPath(cleanedUser.accountType)
        router.push(dashboardPath)
        // Hard navigation fallback if client router doesn't trigger
        setTimeout(() => {
          if (window.location.pathname !== dashboardPath) {
            window.location.href = dashboardPath
          }
        }, 150)
      }
    } catch (err) {
      setError("Şəbəkə xətası baş verdi")
      console.error("Login exception:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const goBack = () => {
    if (step === "email") setStep("role")
    else if (step === "user-selection") setStep("email")
    else if (step === "password") {
      // If we skipped user selection (only 1 user), go back to email
      if (foundUsers.length === 1) setStep("email")
      else setStep("user-selection")
    }
    setError("")
  }

  return (
    <RegionBackground region={theme.region} theme={theme.colorScheme}>
      <div className="min-h-screen py-8 px-4 flex justify-center items-center">
        <div className="w-full max-w-[1550px] mx-auto flex justify-center items-start gap-6">
          
          {/* Sol Reklam Bloku (Giriş səhifəsinin sol boşluğu) */}
          <aside className="hidden lg:block w-[230px] xl:w-[260px] shrink-0 sticky top-6">
            <AdBanner
              slot="login-sidebar-left"
              format="vertical"
              refreshKey="login-left"
              label="Tövsiyə Olunan Təhsil"
            />
          </aside>

          {/* Mərkəzi Giriş Paneli */}
          <main className="w-full max-w-md mx-auto space-y-4">
            
            {/* Böyük Loqo / Emblemi */}
            <div className="flex flex-col items-center justify-center mb-6 text-center">
              <div className="relative h-20 w-20 sm:h-24 sm:w-24 mb-3 p-1.5 rounded-2xl bg-white/95 shadow-xl border-2 border-primary/20 backdrop-blur-md overflow-hidden transition-transform hover:scale-105">
                <Image
                  src="/logo.jpg"
                  alt="TESTAI.AZ Logo"
                  fill
                  className="object-contain rounded-xl p-1"
                  priority
                />
              </div>
              <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">TESTAI.AZ</h1>
            </div>

            <Card className="backdrop-blur-sm bg-white/95 shadow-2xl border border-white/60 rounded-2xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-xl sm:text-2xl text-center font-bold">
                  {step === "role" && "Kim kimi daxil olmaq istəyirsiniz?"}
                  {step === "email" && "E-mail və ya Şagird ID daxil edin"}
                  {step === "user-selection" && "İstifadəçi seçin"}
                  {step === "password" && "Şifrəni daxil edin"}
                </CardTitle>
                <CardDescription className="text-center text-xs sm:text-sm">
                  {step === "role" && "Davam etmək üçün statusunuzu seçin"}
                  {step === "email" && (formData.role === "admin" ? "Sistem İnzibatçısı kimi giriş (E-mail və ya 'admin')" : `${roles.find((r) => r.id === formData.role)?.label || "İstifadəçi"} kimi giriş (E-mail və ya Şagird ID)`)}
                  {step === "user-selection" && "Bu məlumatla uyğun hesablar tapıldı"}
                  {step === "password" && "Hesabınıza daxil olmaq üçün şifrənizi yazın"}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
                    <AlertCircle className="h-4 w-4 text-red-600 shrink-0" />
                    <p className="text-xs sm:text-sm text-red-600">{error}</p>
                  </div>
                )}

                {/* STEP 1: ROLE SELECTION */}
                {step === "role" && (
                  <div className="grid grid-cols-2 gap-3.5">
                    {roles.map((role) => (
                      <button
                        key={role.id}
                        onClick={() => handleRoleSelect(role)}
                        className={`relative p-4 rounded-2xl border-2 transition-all hover:scale-[1.02] active:scale-[0.98] flex flex-col items-center justify-center gap-2 cursor-pointer shadow-xs ${
                          role.restricted
                            ? "border-gray-200 bg-gray-50/70 opacity-85 hover:border-amber-300"
                            : formData.role === role.id
                              ? "border-primary bg-primary/5 shadow-md"
                              : "border-gray-100 bg-white hover:border-primary/40 hover:bg-primary/5"
                        }`}
                      >
                        {role.badge && (
                          <span className="absolute top-2 right-2 px-1.5 py-0.5 text-[9px] font-bold bg-amber-500 text-white rounded-full flex items-center gap-0.5 shadow-xs">
                            <Lock className="w-2.5 h-2.5" />
                            {role.badge}
                          </span>
                        )}
                        <span className="text-3xl drop-shadow-xs">{role.icon}</span>
                        <span className="font-semibold text-gray-900 text-sm">{role.label}</span>
                      </button>
                    ))}
                  </div>
                )}

                {/* STEP 2: EMAIL OR UNIQUE ID INPUT */}
                {step === "email" && (
                  <form onSubmit={handleEmailSubmit} className="space-y-5">
                    <div>
                      <Label htmlFor="email" className="text-xs font-semibold">
                        {formData.role === "admin" ? "Admin E-mail və ya İstifadəçi adı" : "E-mail və ya Unikal Şagird ID"}
                      </Label>
                      <Input
                        id="email"
                        type="text"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                        placeholder={formData.role === "admin" ? "admin@edu.az və ya admin" : "nümunə@email.com və ya @gunay.rzayeva.161"}
                        disabled={isLoading}
                        className="text-base p-5 mt-1 rounded-xl font-mono"
                        autoFocus
                      />
                    </div>
                    <Button type="submit" className={`w-full py-5 text-base font-bold rounded-xl ${themeClasses.primary}`} disabled={isLoading}>
                      {isLoading ? "Yoxlanılır..." : "Davam et"}
                    </Button>
                  </form>
                )}

                {/* STEP 3: USER SELECTION (If multiple) */}
                {step === "user-selection" && (
                  <div className="space-y-3">
                    {foundUsers.map((user) => (
                      <button
                        key={user.id}
                        onClick={() => handleUserSelect(user)}
                        className="w-full p-4 text-left rounded-xl border border-gray-200 hover:border-primary hover:bg-primary/5 transition-all group cursor-pointer"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-bold text-gray-900 group-hover:text-primary">
                              {user.firstName} {user.lastName}
                            </h3>
                            <p className="text-xs text-gray-500">
                              {user.school} • {user.class}-ci sinif
                            </p>
                          </div>
                          <div className="text-xl">👉</div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {/* STEP 4: PASSWORD INPUT */}
                {step === "password" && (
                  <form onSubmit={handleLogin} className="space-y-5">
                    <div className="text-center mb-3">
                      <div className="inline-block px-3 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-600">
                        {foundUsers.find((u) => u.id === formData.userId)?.firstName}{" "}
                        {foundUsers.find((u) => u.id === formData.userId)?.lastName}
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="password" className="text-xs font-semibold">Şifrə</Label>
                      <Input
                        id="password"
                        type="password"
                        required
                        value={formData.password}
                        onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                        placeholder="••••••••"
                        disabled={isLoading}
                        className="text-base p-5 mt-1 rounded-xl"
                        autoFocus
                      />
                    </div>
                    <Button type="submit" className={`w-full py-5 text-base font-bold rounded-xl ${themeClasses.primary}`} disabled={isLoading}>
                      {isLoading ? "Giriş edilir..." : "Giriş et"}
                    </Button>
                  </form>
                )}

                {/* Navigation Footer */}
                <div className="mt-5 flex justify-between items-center text-xs sm:text-sm pt-3 border-t border-gray-100">
                  {step !== "role" ? (
                    <button onClick={goBack} className="text-gray-500 hover:text-gray-900 flex items-center font-medium cursor-pointer">
                      <ArrowLeft className="h-3.5 w-3.5 mr-1" /> Geri
                    </button>
                  ) : (
                    <Link href="/" className="text-gray-500 hover:text-gray-900 flex items-center font-medium">
                      <ArrowLeft className="h-3.5 w-3.5 mr-1" /> Ana səhifə
                    </Link>
                  )}

                  {step === "role" && (
                    <Link href="/register" className={`${themeClasses.text} font-bold hover:underline`}>
                      Qeydiyyat
                    </Link>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Sistem İnzibatçısı Girişi Düyməsi */}
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={handleAdminSelect}
                className="text-xs text-gray-500 hover:text-primary hover:bg-white/80 transition-all px-3.5 py-1.5 rounded-full inline-flex items-center gap-1.5 mx-auto cursor-pointer font-medium border border-gray-200/60 shadow-2xs backdrop-blur-xs"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                <span>Sistem İnzibatçısı Girişi</span>
              </button>
            </div>

          </main>

          {/* Sağ Reklam Bloku (Giriş səhifəsinin sağ boşluğu) */}
          <aside className="hidden lg:block w-[230px] xl:w-[260px] shrink-0 sticky top-6">
            <AdBanner
              slot="login-sidebar-right"
              format="vertical"
              refreshKey="login-right"
              label="Sponsorlu Elanlar"
            />
          </aside>

        </div>
      </div>

      {/* Müəllim və Direktor üçün Xəbərdarlıq Modalı */}
      {restrictedModal?.open && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-start">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                <Sparkles className="w-5 h-5" />
              </div>
              <button
                onClick={() => setRestrictedModal(null)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-gray-900">{restrictedModal.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{restrictedModal.desc}</p>
            </div>

            <div className="pt-2">
              <Button
                onClick={() => setRestrictedModal(null)}
                className="w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-xl py-4"
              >
                Başa düşdüm
              </Button>
            </div>
          </div>
        </div>
      )}
    </RegionBackground>
  )
}
