"use client"

import React, { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Sparkles, GraduationCap, Users, Loader2 } from "lucide-react"
import { getCurrentUser, updateUserData } from "@/lib/profile-utils"

interface QuickGradeModalProps {
  forcedOpen?: boolean
  onSuccess?: (grade: string) => void
}

export function QuickGradeModal({ forcedOpen, onSuccess }: QuickGradeModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [userName, setUserName] = useState("")
  const [loadingGrade, setLoadingGrade] = useState<string | null>(null)

  useEffect(() => {
    if (typeof window === "undefined") return

    const currentUser = getCurrentUser()

    // 1. Valideynlər heç vaxt sinif seçimi modalını görməməlidir!
    const isParent = 
      currentUser && (
        currentUser.accountType === "parent" || 
        currentUser.role === "parent" ||
        currentUser.accountType?.includes("parent") ||
        currentUser.role?.includes("parent") ||
        currentUser.email?.toLowerCase() === "emilinpoctu@gmail.com"
      )

    if (isParent) {
      setIsOpen(false)
      if (window.location.search.includes("showGradeModal")) {
        const cleanUrl = window.location.pathname
        window.history.replaceState({}, document.title, cleanUrl)
      }
      return
    }

    // 2. Əgər istifadəçinin artıq yaddaşda sinfi varsa (1-11), qətiyyən yenidən soruşulmamalıdır!
    const existingGrade = currentUser?.class ? String(currentUser.class).trim() : ""
    if (existingGrade.length > 0) {
      setIsOpen(false)
      if (window.location.search.includes("showGradeModal")) {
        const cleanUrl = window.location.pathname
        window.history.replaceState({}, document.title, cleanUrl)
      }
      return
    }

    // 3. Yalnız sinfi HƏQİQƏTƏN OLMAYAN şagird üçün aç
    const params = new URLSearchParams(window.location.search)
    const showByParam = params.get("showGradeModal") === "true"

    if (currentUser) {
      setUserName(currentUser.firstName || "")
      if (showByParam || forcedOpen) {
        setIsOpen(true)
      }
    } else if (showByParam || forcedOpen) {
      setIsOpen(true)
    }
  }, [forcedOpen])

  const grades = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11"]

  const handleSelectGrade = async (grade: string) => {
    setLoadingGrade(grade)
    try {
      const currentUser = getCurrentUser()
      const res = await fetch("/api/auth/set-grade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          grade,
          role: "student",
          userIdOrEmail: currentUser?.id || currentUser?.email,
        }),
      })

      const data = await res.json()
      if (res.ok && data.user) {
        updateUserData({ class: grade, accountType: "student", role: "student" })
        setIsOpen(false)
        if (onSuccess) {
          onSuccess(grade)
        } else {
          // Clean URL params if any
          const cleanUrl = window.location.pathname
          window.history.replaceState({}, document.title, cleanUrl)
          window.location.reload()
        }
      }
    } catch (e) {
      console.error("Grade selection error:", e)
    } finally {
      setLoadingGrade(null)
    }
  }

  const handleSelectParent = async () => {
    setLoadingGrade("parent")
    try {
      const currentUser = getCurrentUser()
      // Dərhal lokal yaddaşda rolu valideyn et ki, sinif yoxlaması ilişməsin
      updateUserData({
        accountType: "parent",
        role: "parent",
        class: "",
        isProfileDone: true,
      })

      setIsOpen(false)

      await fetch("/api/auth/set-grade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          grade: "",
          role: "parent",
          userIdOrEmail: currentUser?.id || currentUser?.email,
        }),
      })

      // Birbaşa Valideyn Kabinetinə yönləndir
      window.location.replace("/parent-dashboard")
    } catch (e) {
      console.error("Parent role error:", e)
      window.location.replace("/parent-dashboard")
    } finally {
      setLoadingGrade(null)
    }
  }

  const current = getCurrentUser()
  const isParentUser = 
    current && (
      current.accountType === "parent" || 
      current.role === "parent" ||
      current.accountType?.includes("parent") ||
      current.role?.includes("parent") ||
      current.email?.toLowerCase() === "emilinpoctu@gmail.com"
    )

  if (isParentUser) {
    return null
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      // Don't allow closing only if student has no grade set yet
      const currentUser = getCurrentUser()
      const isParent = currentUser?.accountType === "parent" || currentUser?.role === "parent"
      if (!isParent && !currentUser?.class) {
        return
      }
      setIsOpen(open)
    }}>
      <DialogContent className="max-w-md sm:max-w-lg p-6 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-blue-100 dark:border-slate-800">
        <DialogHeader className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/25">
            <GraduationCap className="w-6 h-6" />
          </div>
          <DialogTitle className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            {userName ? `Xoş gəldiniz, ${userName}! 🎉` : "Xoş gəldiniz! 🎉"}
          </DialogTitle>
          <DialogDescription className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
            Dərsliklərinizi və AI testlərinizi dərhal açmaq üçün oxuduğunuz sinfi seçin:
          </DialogDescription>
        </DialogHeader>

        {/* 11 Grade Grid */}
        <div className="grid grid-cols-4 sm:grid-cols-4 gap-2.5 py-4">
          {grades.map((grade) => {
            const isLoading = loadingGrade === grade
            return (
              <Button
                key={grade}
                type="button"
                variant="outline"
                disabled={loadingGrade !== null}
                onClick={() => handleSelectGrade(grade)}
                className={`h-14 flex flex-col items-center justify-center rounded-xl font-bold text-base transition-all duration-150 border-2 ${
                  isLoading
                    ? "bg-blue-600 text-white border-blue-600 animate-pulse"
                    : "hover:border-blue-600 hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-blue-950/40 dark:border-slate-700"
                }`}
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <span className="text-lg leading-tight">{grade}</span>
                    <span className="text-[10px] font-medium text-slate-400 -mt-0.5">sinif</span>
                  </>
                )}
              </Button>
            )
          })}
        </div>

        {/* Alternative Role for Parents */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-center">
          <button
            type="button"
            disabled={loadingGrade !== null}
            onClick={handleSelectParent}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors py-1 px-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            <Users className="w-4 h-4 text-slate-400" />
            <span>Mən şagird deyiləm, <strong>Valideynəm</strong></span>
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
