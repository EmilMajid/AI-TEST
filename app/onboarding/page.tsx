"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { GraduationCap, Users, Sparkles, School, MapPin, CheckCircle2, Loader2, ArrowRight } from "lucide-react"
import { getCurrentUser, updateUserData, getDashboardPath } from "@/lib/profile-utils"

const regionsList = [
  "Bakı", "Gəncə", "Sumqayıt", "Mingəçevir", "Naftalan", "Şirvan", "Şəki", "Yevlax",
  "Abşeron", "Ağcabədi", "Ağdam", "Ağdaş", "Ağstafa", "Ağsu", "Astara", "Balakən",
  "Bərdə", "Beyləqan", "Biləsuvar", "Cəbrayıl", "Cəlilabad", "Culfa", "Daşkəsən",
  "Füzuli", "Gədəbəy", "Goranboy", "Göyçay", "Göygöl", "Hacıqabul", "İmişli",
  "İsmayıllı", "Kəlbəcər", "Kürdəmir", "Laçın", "Lerik", "Masallı", "Neftçala",
  "Oğuz", "Ordubad", "Qax", "Qazax", "Qəbələ", "Qobustan", "Quba", "Qubadlı",
  "Qusar", "Saatlı", "Sabirabad", "Şabran", "Şahbuz", "Şəmkir", "Şərur", "Şuşa",
  "Tərtər", "Tovuz", "Ucar", "Xaçmaz", "Xankəndi", "Xızı", "Xocalı", "Xocavənd",
  "Yardımlı", "Zəngilan", "Zaqatala", "Zərdab"
]

const grades = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11"]

export default function OnboardingPage() {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [selectedRole, setSelectedRole] = useState<"student" | "parent">("student")
  const [selectedGrade, setSelectedGrade] = useState("5")
  const [region, setRegion] = useState("Bakı")
  const [school, setSchool] = useState("")
  const [fatherName, setFatherName] = useState("")
  const [parentEmail, setParentEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    const user = getCurrentUser()
    if (user) {
      setCurrentUser(user)
      if (user.class) setSelectedGrade(user.class)
      if (user.accountType === "parent") setSelectedRole("parent")
      if (user.region) setRegion(user.region)
      if (user.school) setSchool(user.school)
    }
  }, [])

  const handleQuickStart = async () => {
    setIsLoading(true)
    setError("")
    try {
      // 1. Set Grade First
      const gradeRes = await fetch("/api/auth/set-grade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          grade: selectedRole === "student" ? selectedGrade : "",
          role: selectedRole,
          userIdOrEmail: currentUser?.id || currentUser?.email,
        }),
      })

      if (!gradeRes.ok) {
        throw new Error("Sinif təyin edilərkən xəta baş verdi")
      }

      // 2. If school is provided, also complete profile
      if (school.trim()) {
        await fetch("/api/auth/complete-profile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            region,
            school,
            fatherName,
            parentEmail,
            class: selectedGrade,
            userIdOrEmail: currentUser?.id || currentUser?.email,
          }),
        })
        updateUserData({
          class: selectedGrade,
          school,
          region,
          fatherName,
          isProfileDone: true,
        })
      } else {
        updateUserData({
          class: selectedGrade,
          accountType: selectedRole,
          role: selectedRole,
        })
      }

      router.push(selectedRole === "parent" ? "/parent-dashboard" : "/dashboard")
    } catch (err: any) {
      setError(err.message || "Xəta baş verdi")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50/40 to-slate-100 dark:from-slate-950 dark:to-slate-900 py-10 px-4 flex items-center justify-center">
      <Card className="w-full max-w-xl shadow-2xl border border-white/70 dark:border-slate-800 rounded-3xl backdrop-blur-md bg-white/95 dark:bg-slate-900/95 overflow-hidden">
        <div className="h-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 w-full" />
        
        <CardHeader className="text-center pt-6 pb-2 space-y-2">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-xl shadow-blue-500/25">
            <GraduationCap className="w-7 h-7" />
          </div>
          <CardTitle className="text-2xl font-black text-slate-900 dark:text-white">
            {currentUser?.firstName ? `Xoş gəldiniz, ${currentUser.firstName}! 🎉` : "Xoş gəldiniz! 🎉"}
          </CardTitle>
          <CardDescription className="text-sm text-slate-600 dark:text-slate-400">
            Dərslik və testlərinizi dərhal açmaq üçün profilinizi təsdiqləyin
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6 pt-4 p-6 sm:p-8">
          {error && (
            <div className="p-3 text-xs font-semibold text-red-600 bg-red-50 rounded-xl border border-red-200">
              {error}
            </div>
          )}

          {/* Rol Seçimi */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setSelectedRole("student")}
              className={`p-3.5 rounded-2xl border-2 flex items-center justify-center gap-2 font-bold text-sm transition-all ${
                selectedRole === "student"
                  ? "border-blue-600 bg-blue-50/70 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300"
                  : "border-slate-200 hover:border-slate-300 text-slate-600"
              }`}
            >
              <GraduationCap className="w-5 h-5" />
              <span>Şagirdəm</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedRole("parent")}
              className={`p-3.5 rounded-2xl border-2 flex items-center justify-center gap-2 font-bold text-sm transition-all ${
                selectedRole === "parent"
                  ? "border-blue-600 bg-blue-50/70 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300"
                  : "border-slate-200 hover:border-slate-300 text-slate-600"
              }`}
            >
              <Users className="w-5 h-5" />
              <span>Valideynəm</span>
            </button>
          </div>

          {/* Məcburi Sinif Seçimi (Şagirdlər üçün) */}
          {selectedRole === "student" && (
            <div className="space-y-2">
              <Label className="text-xs font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" /> Oxuduğunuz Sinif <span className="text-red-500">* (Məcburidir)</span>
              </Label>
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                {grades.map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setSelectedGrade(g)}
                    className={`h-12 rounded-xl font-black text-base border-2 transition-all flex flex-col items-center justify-center ${
                      selectedGrade === g
                        ? "border-blue-600 bg-blue-600 text-white shadow-md shadow-blue-500/25"
                        : "border-slate-200 dark:border-slate-700 hover:border-blue-400 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                    }`}
                  >
                    <span>{g}</span>
                    <span className="text-[9px] -mt-1 font-medium opacity-80">sinif</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Tədrici Profil Sahələri (İstəyə bağlı, testlərdən sonra da tamamlana bilər) */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200/80 dark:border-slate-700 space-y-3">
            <div className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <School className="w-3.5 h-3.5 text-blue-600" /> Məktəb Məlumatları
              </span>
              <span className="text-[11px] font-normal text-slate-400">İndi və ya testdən sonra</span>
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-[11px] text-slate-600 dark:text-slate-400">Rayon / Şəhər</Label>
                <Select value={region} onValueChange={setRegion}>
                  <SelectTrigger className="h-10 text-xs rounded-xl">
                    <SelectValue placeholder="Rayon" />
                  </SelectTrigger>
                  <SelectContent className="max-h-52">
                    {regionsList.map((r) => (
                      <SelectItem key={r} value={r}>{r}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label className="text-[11px] text-slate-600 dark:text-slate-400">Məktəb nömrəsi</Label>
                <Input
                  placeholder="Məs: 161 saylı məktəb"
                  value={school}
                  onChange={(e) => setSchool(e.target.value)}
                  className="h-10 text-xs rounded-xl"
                />
              </div>
            </div>
          </div>

          <Button
            type="button"
            disabled={isLoading}
            onClick={handleQuickStart}
            className="w-full h-13 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-base rounded-2xl shadow-xl shadow-blue-500/25 transition-all"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin mx-auto" />
            ) : (
              <span className="flex items-center justify-center gap-2">
                Dərhal Testlərə Başla <ArrowRight className="w-5 h-5" />
              </span>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
