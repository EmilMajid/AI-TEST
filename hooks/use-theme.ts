"use client"

import { useState, useEffect } from "react"

export interface UserTheme {
  colorScheme: string
  region: string
  gradient?: string
}

export function useTheme() {
  const [theme, setTheme] = useState<UserTheme>({
    colorScheme: "blue",
    region: "",
    gradient: "from-primary/20 to-primary/10",
  })

  useEffect(() => {
    // Load theme from localStorage
    const savedTheme = localStorage.getItem("userTheme")
    if (savedTheme) {
      try {
        const parsed = JSON.parse(savedTheme)
        setTheme({ ...parsed, gradient: "from-primary/20 to-primary/10" })
      } catch (error) {
        console.error("Error parsing saved theme:", error)
      }
    }
  }, [])

  const updateTheme = (newTheme: Partial<UserTheme>) => {
    const updatedTheme = { ...theme, ...newTheme }
    setTheme(updatedTheme)
    localStorage.setItem("userTheme", JSON.stringify(updatedTheme))
  }

  const getThemeClasses = () => {
    const colorMap: Record<string, any> = {
      blue: {
        primary: "bg-blue-600 hover:bg-blue-700",
        secondary: "bg-blue-100 text-blue-800",
        accent: "bg-blue-50",
        border: "border-blue-200",
        text: "text-blue-600",
        gradient: "from-primary/20 to-primary/10",
      },
      green: {
        primary: "bg-green-600 hover:bg-green-700",
        secondary: "bg-green-100 text-green-800",
        accent: "bg-green-50",
        border: "border-green-200",
        text: "text-green-600",
        gradient: "from-green-50/90 to-emerald-100/90",
      },
      purple: {
        primary: "bg-purple-600 hover:bg-purple-700",
        secondary: "bg-purple-100 text-purple-800",
        accent: "bg-purple-50",
        border: "border-purple-200",
        text: "text-purple-600",
        gradient: "from-purple-50/90 to-violet-100/90",
      },
      red: {
        primary: "bg-red-600 hover:bg-red-700",
        secondary: "bg-red-100 text-red-800",
        accent: "bg-red-50",
        border: "border-red-200",
        text: "text-red-600",
        gradient: "from-red-50/90 to-rose-100/90",
      },
      orange: {
        primary: "bg-orange-600 hover:bg-orange-700",
        secondary: "bg-orange-100 text-orange-800",
        accent: "bg-orange-50",
        border: "border-orange-200",
        text: "text-orange-600",
        gradient: "from-orange-50/90 to-amber-100/90",
      },
      teal: {
        primary: "bg-teal-600 hover:bg-teal-700",
        secondary: "bg-teal-100 text-teal-800",
        accent: "bg-teal-50",
        border: "border-teal-200",
        text: "text-teal-600",
        gradient: "from-teal-50/90 to-cyan-100/90",
      },
    }

    return colorMap[theme.colorScheme] || colorMap.blue
  }

  return {
    theme,
    updateTheme,
    getThemeClasses,
  }
}
