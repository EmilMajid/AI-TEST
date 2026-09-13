"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useTheme } from "@/hooks/use-theme"
import { MainLayout } from "@/components/main-layout"
import { ProfileAvatar } from "@/components/profile-avatar"
import { regionSymbols } from "@/lib/region-symbols"
import { subjectsByClass, getTextbooks, type Textbook } from "@/lib/education-data"
import { logout, getUserUniqueId, type UserData } from "@/lib/profile-utils"
import { User, LogOut, Mail, LayoutDashboard, BookOpen, FileText } from "lucide-react"
import Link from "next/link"
import { MessagesTab } from "@/components/messages-tab"
import { TextbookViewer } from "@/components/textbook-viewer"
import { PdfViewer } from "@/components/pdf-viewer"
import { RegionModal } from "@/components/region-modal"
import { AdBanner } from "@/components/ads/ad-banner"

interface Topic {
  title: string;
  page: number;
  path: string;
  endPage?: number;
}

interface TopicGroup {
  chapter: string;
  topics: Topic[];
}

// Hardcoded foreign languages as requested
const FOREIGN_LANGUAGES = ["İngilis dili", "Alman dili", "Fransız dili", "Rus dili"];

// Helper function to extract language name from textbook title
// e.g., "İngilis dili 5" -> "İngilis dili"
const extractLanguageFromTitle = (title: string): string => {
  // Remove grade number and extra parts
  return title.replace(/\s+\d+.*$/, '').trim();
};

export default function Dashboard() {
  const router = useRouter()
  const { theme, getThemeClasses } = useTheme()
  const themeClasses = getThemeClasses()

  const [userData, setUserData] = useState<UserData | null>(null)
  const [testConfig, setTestConfig] = useState({
    textbook: "",
    topic: "",
    class: "",
    difficulty: "orta",
    questionCount: 10,
    timeLimit: 20,
  })
  const [isGenerating, setIsGenerating] = useState(false)
  const [currentView, setCurrentView] = useState<'dashboard' | 'messages'>('dashboard')

  const [selectedSubject, setSelectedSubject] = useState("")
  const [availableTextbooks, setAvailableTextbooks] = useState<Textbook[]>([])
  const [selectedTextbook, setSelectedTextbook] = useState<Textbook | null>(null)

  const [selectedLanguage, setSelectedLanguage] = useState("")
  const [availableLanguages, setAvailableLanguages] = useState<string[]>([])

  const [isViewerOpen, setIsViewerOpen] = useState(false)
  const [isPdfViewerOpen, setIsPdfViewerOpen] = useState(false)

  const [showRegionModal, setShowRegionModal] = useState(false)
  const [apiTopics, setApiTopics] = useState<Record<string, TopicGroup[]>>({})
  const [isForeignLanguage, setIsForeignLanguage] = useState(false)

  useEffect(() => {
    const storedUserData = localStorage.getItem("userData")
    if (storedUserData) {
      const parsed = JSON.parse(storedUserData)
      setUserData(parsed)

      if (parsed.accountType === "parent" || parsed.accountType === "teacher" || parsed.accountType === "director") {
        router.push("/parent-dashboard")
        return
      }

      setTestConfig((prev) => ({ ...prev, class: parsed.class }))

      // Check if region is missing
      if (!parsed.region) {
        setShowRegionModal(true)
      }
    }
  }, [])

  // Fetch topics from API
  useEffect(() => {
    async function fetchTopics() {
      if (!userData?.class) return;
      try {
        // Prefer bookId for precise topic retrieval
        const bookIdParam = selectedTextbook?.id ? `&bookId=${encodeURIComponent(selectedTextbook.id)}` : '';
        const subjectParam = selectedSubject ? `&subject=${encodeURIComponent(selectedSubject)}` : '';

        // If we have a textbook ID, use it. Otherwise uses subject (fallback).
        const queryParam = bookIdParam || subjectParam;
        if (!queryParam) {
          setApiTopics({});
          return;
        }

        const res = await fetch(`/api/textbooks/topics?class=${userData.class}${queryParam}`);
        const data = await res.json();
        if (data.success && data.topics) {
          setApiTopics(data.topics);
        } else {
          setApiTopics({});
        }
      } catch (error) {
        console.error("Failed to fetch topics:", error);
        setApiTopics({});
      }
    }
    fetchTopics();
  }, [userData?.class, selectedSubject, selectedTextbook?.id])


  const handleRegionSelect = (region: string) => {
    if (userData) {
      const updatedUser = { ...userData, region }
      setUserData(updatedUser)
      localStorage.setItem("userData", JSON.stringify(updatedUser))
      setShowRegionModal(false)
    }
  }

  const handleStartTest = async () => {
    if (!testConfig.textbook || !testConfig.topic) {
      alert("Zəhmət olmasa dərslik və mövzu seçin")
      return
    }
    setIsGenerating(true)
    const testData = {
      textbook: testConfig.textbook,
      topic: testConfig.topic,
      class: testConfig.class,
      difficulty: testConfig.difficulty,
      questionCount: testConfig.questionCount,
      timeLimit: testConfig.timeLimit,
    }
    localStorage.setItem("currentTest", JSON.stringify(testData))
    router.push("/test")
  }

  const difficultyOptions = [
    { value: "sadə", label: "Sadə", icon: "🟢", description: "Əsas anlayışlar və faktlar" },
    { value: "orta", label: "Orta", icon: "🔵", description: "Anlama və tətbiq səviyyəsi" },
    { value: "çətin", label: "Çətin", icon: "🔴", description: "Təhlil və qiymətləndirmə" },
    { value: "qarışıq", label: "Qarışıq", icon: "🔵🔴🟢", description: "Bütün səviyyələrdən" },
  ]

  const questionCountOptions = [5, 10, 15, 20, 25, 30]
  const timeLimitOptions = [10, 15, 20, 25, 30, 45, 60]

  const getDifficultyBadge = (difficulty: string) => {
    const option = difficultyOptions.find((opt) => opt.value === difficulty)
    return (
      <Badge
        className={`
        ${difficulty === "sadə" ? "bg-green-100 text-green-800" : ""}
        ${difficulty === "orta" ? "bg-yellow-100 text-yellow-800" : ""}
        ${difficulty === "çətin" ? "bg-red-100 text-red-800" : ""}
        ${difficulty === "qarışıq" ? "bg-purple-100 text-purple-800" : ""}
      `}
      >
        {option?.icon} {option?.label}
      </Badge>
    )
  }

  const getRegionInfo = () => {
    if (!userData?.region) return null
    const regionData = regionSymbols[userData.region]
    return regionData ? `${regionData.symbol} ${userData.region}` : userData.region
  }

  if (!userData) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardContent className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <h3 className="text-lg font-semibold mb-2">Yüklənir...</h3>
              <p className="text-gray-600">İstifadəçi məlumatları yüklənir</p>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className={`min-h-screen bg-gradient-to-br ${theme.gradient}`}>
        <div className="container mx-auto px-3.5 sm:px-6 py-4 sm:py-8">
          {/* 2-ci BLOK: Şagird Kartı */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-5 sm:mb-8 bg-white/90 backdrop-blur-sm p-3.5 sm:p-6 rounded-2xl shadow-sm gap-3 sm:gap-4 border border-gray-100">
            <div className="flex items-center gap-3 sm:gap-4 w-full md:w-auto">
              <ProfileAvatar
                firstName={userData.firstName}
                lastName={userData.lastName}
                profileImage={userData.profileImage}
                size="md"
              />
              <div className="min-w-0 flex-1">
                <h1 className="text-lg sm:text-2xl font-bold text-gray-900 leading-tight">
                  Xoş gəlmisiniz, {userData.firstName} {userData.lastName} 👋
                </h1>
                <p className="text-xs sm:text-sm text-gray-600 flex flex-wrap items-center gap-1.5 sm:gap-2 mt-0.5">
                  <span className="font-medium text-gray-700">{getRegionInfo()}</span>
                  <span className="text-gray-300">•</span>
                  <span className="truncate max-w-[180px] sm:max-w-none">{userData.school}</span>
                  <span className="text-gray-300">•</span>
                  <span className="font-semibold text-primary">{userData.class}-ci sinif</span>
                </p>
              </div>
            </div>
            
            {/* Desktop Yuxarı Əməliyyat Düymələri (Mobildə 4-cü blokda yerləşir) */}
            <div className="hidden md:flex items-center justify-end gap-2.5 w-full md:w-auto">
              <div className="flex flex-col items-center">
                <Link href="/profile">
                  <Button variant="outline" size="sm" className="gap-1.5 h-9 text-xs sm:text-sm">
                    <User className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    Profil
                  </Button>
                </Link>
                <span className="text-[10px] font-mono font-bold text-primary mt-0.5 px-1.5 py-0.2 bg-primary/10 rounded border border-primary/20 tracking-tight select-all" title="Sizin Şəxsi ID Kodunuz">
                  {getUserUniqueId(userData)}
                </span>
              </div>
              <Button
                variant={currentView === 'messages' ? 'default' : 'outline'}
                size="sm"
                className="gap-1.5 h-9 text-xs sm:text-sm"
                onClick={() => setCurrentView(currentView === 'dashboard' ? 'messages' : 'dashboard')}
              >
                {currentView === 'dashboard' ? <Mail className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> : <LayoutDashboard className="h-3.5 w-3.5 sm:h-4 sm:w-4" />}
                {currentView === 'dashboard' ? 'Mesajlar' : 'Panel'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 h-9 text-xs sm:text-sm text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={() => {
                  logout()
                  router.push("/login")
                }}
              >
                <LogOut className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                Çıxış
              </Button>
            </div>
          </div>

          {currentView === 'messages' ? (
            <MessagesTab userId={userData.id} userRole={userData.accountType} />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
              {/* Left Column - Test Configuration */}
              <div className="lg:col-span-2 space-y-6 sm:space-y-8">
                <Card className="border-none shadow-lg bg-white/90 backdrop-blur">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-center justify-between mb-4 sm:mb-6">
                      <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2">
                        <span className="text-xl sm:text-2xl">📝</span> Yeni Test
                      </h2>
                      <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 text-xs">
                        AI-Powered
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                      {/* Subject Selection */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Fənn</label>
                        <select
                          value={selectedSubject}
                          onChange={(e) => {
                            const subject = e.target.value
                            setSelectedSubject(subject)
                            setSelectedLanguage("")

                            const isForeign = subject === "Xarici dil" || subject === "İkinci xarici dil"
                            setIsForeignLanguage(isForeign)

                            if (isForeign) {
                              // Dynamically import textbooks for this class
                              const { getTextbooksByClass } = require("@/lib/textbook-service")
                              const allBooks = userData?.class ? getTextbooksByClass(userData.class) : []
                              
                              // Filter books for this foreign language subject
                              const foreignBooks = allBooks.filter((book: any) => {
                                const subj = book.subject || ""
                                const title = book.title || ""
                                const id = book.id || ""

                                const classNum = parseInt(userData?.class || "0", 10)
                                const isSecondary = classNum >= 5 && (
                                  subj.includes("ikinci") || 
                                  title.includes("ikinci") || 
                                  id.includes("ikinci") || 
                                  id.includes("-2-") ||
                                  /-2-\d+$/.test(id)
                                )

                                if (subject === "Xarici dil") {
                                  return !isSecondary && (
                                    subj === "Xarici dil" || 
                                    ["İngilis dili", "Alman dili", "Fransız dili", "Rus dili"].includes(subj) ||
                                    /ingilis|İngilis|alman|fransız|fransiz|rus/i.test(title)
                                  )
                                } else {
                                  return isSecondary || 
                                    subj === "İkinci xarici dil"
                                }
                              })

                              // Extract unique languages
                              const languagesSet = new Set<string>()
                              foreignBooks.forEach((book: any) => {
                                const title = book.title || ""
                                const subj = book.subject || ""
                                if (["İngilis dili", "Alman dili", "Fransız dili", "Rus dili"].includes(subj)) {
                                  languagesSet.add(subj)
                                } else if (/ingilis|english|İngilis/i.test(title)) {
                                  languagesSet.add("İngilis dili")
                                } else if (/alman|german/i.test(title)) {
                                  languagesSet.add("Alman dili")
                                } else if (/fransız|fransiz|french/i.test(title)) {
                                  languagesSet.add("Fransız dili")
                                } else if (subj === "Rus dili" || /rus|russian|русский|рус/i.test(title) || id.includes("rus")) {
                                  languagesSet.add("Rus dili")
                                }
                              })

                              const languages = Array.from(languagesSet)
                              setAvailableLanguages(languages)
                              setAvailableTextbooks([])
                              setSelectedTextbook(null)
                            } else {
                              const textbooks = userData?.class ? getTextbooks(userData.class, subject) : []
                              setAvailableTextbooks(textbooks)

                              if (textbooks.length > 0) {
                                setSelectedTextbook(textbooks[0])
                                setTestConfig(prev => ({ ...prev, textbook: textbooks[0].title, topic: "" }))
                              } else {
                                setSelectedTextbook(null)
                                setTestConfig(prev => ({ ...prev, textbook: subject, topic: "" }))
                              }
                            }
                          }}
                          className="w-full h-11 sm:h-12 px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-white text-sm sm:text-base"
                        >
                          <option value="">Seçin</option>
                          {userData?.class && subjectsByClass[userData.class]?.map((subject) => (
                            <option key={subject} value={subject}>
                              {subject}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Foreign Language Dropdown */}
                      {isForeignLanguage && (
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">Xarici dil seçimi</label>
                          <select
                            value={selectedLanguage}
                            onChange={(e) => {
                              const lang = e.target.value
                              setSelectedLanguage(lang)

                              const { getTextbooksByClass } = require("@/lib/textbook-service")
                              const allBooks = userData?.class ? getTextbooksByClass(userData.class) : []
                              const filtered = allBooks.filter((book: any) => {
                                const title = book.title || ""
                                const subj = book.subject || ""
                                const id = book.id || ""

                                const classNum = parseInt(userData?.class || "0", 10)
                                const isSecondary = classNum >= 5 && (
                                  subj.includes("ikinci") || 
                                  title.includes("ikinci") || 
                                  id.includes("ikinci") || 
                                  id.includes("-2-") ||
                                  /-2-\d+$/.test(id)
                                )

                                const isCorrectType = selectedSubject === "Xarici dil" ? !isSecondary : isSecondary

                                if (!isCorrectType) return false

                                if (lang === "İngilis dili") {
                                  return subj === "İngilis dili" || /ingilis|english|İngilis/i.test(title)
                                } else if (lang === "Alman dili") {
                                  return subj === "Alman dili" || /alman|german/i.test(title)
                                } else if (lang === "Fransız dili") {
                                  return subj === "Fransız dili" || /fransız|fransiz|french/i.test(title)
                                } else if (lang === "Rus dili") {
                                  return subj === "Rus dili" || /rus|russian|русский|рус/i.test(title) || id.includes("rus")
                                }
                                return false
                              })

                              setAvailableTextbooks(filtered)
                              if (filtered.length > 0) {
                                setSelectedTextbook(filtered[0])
                                setTestConfig(prev => ({ ...prev, textbook: filtered[0].title, topic: "" }))
                              } else {
                                setSelectedTextbook(null)
                                setTestConfig(prev => ({ ...prev, textbook: "", topic: "" }))
                              }
                            }}
                            className="w-full h-11 sm:h-12 px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-white text-sm sm:text-base"
                          >
                            <option value="">Dil seçin</option>
                            {availableLanguages.map((lang) => (
                              <option key={lang} value={lang}>
                                {lang}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}

                      {/* Textbook Selection - Show if at least 1 option EXISTS for the selected subject */}
                      {selectedSubject && availableTextbooks.length >= 1 && (
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">Dərslik</label>
                          <div className="flex gap-2">
                            <select
                              value={selectedTextbook?.id || ""}
                              onChange={(e) => {
                                const textbook = availableTextbooks.find(t => t.id === e.target.value)
                                setSelectedTextbook(textbook || null)
                                if (textbook) {
                                  setTestConfig(prev => ({ ...prev, textbook: textbook.title, topic: "" }))
                                }
                              }}
                              className="w-full h-11 sm:h-12 px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-white text-sm sm:text-base"
                            >
                              {availableTextbooks.map((textbook) => (
                                <option key={textbook.id} value={textbook.id}>
                                  {textbook.title}
                                </option>
                              ))}
                            </select>
                            {selectedTextbook?.fileUrl && (
                              <Button
                                variant="outline"
                                className="h-11 sm:h-12 px-3 sm:px-4 border-gray-200 hover:bg-primary/5 hover:text-primary hover:border-primary shrink-0"
                                onClick={() => setIsViewerOpen(true)}
                                title="Dərsliyi oxu (HTML)"
                              >
                                <BookOpen className="h-5 w-5" />
                              </Button>
                            )}
                            {selectedTextbook?.pdfUrl && (
                              <Button
                                variant="outline"
                                className="h-11 sm:h-12 px-3 sm:px-4 border-gray-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200 shrink-0"
                                onClick={() => setIsPdfViewerOpen(true)}
                                title="Dərsliyi oxu (PDF)"
                              >
                                <FileText className="h-5 w-5" />
                              </Button>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Topic Selection */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Mövzu</label>

                        {(() => {
                          const topicGroups = Object.values(apiTopics).flat();
                          const hasTopics = topicGroups.some(g => g.topics.length > 0);
                          const isDisabled = !selectedSubject || (availableTextbooks.length > 0 && !selectedTextbook);

                          return (
                            <select
                              value={testConfig.topic}
                              onChange={(e) => setTestConfig(prev => ({ ...prev, topic: e.target.value }))}
                              disabled={isDisabled || !hasTopics}
                              className="w-full h-11 sm:h-12 px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-white disabled:bg-gray-100 disabled:cursor-not-allowed text-sm sm:text-base"
                            >
                              <option value="">
                                {!selectedSubject
                                  ? "Əvvəl fənni seçin"
                                  : (availableTextbooks.length > 0 && !selectedTextbook
                                    ? "Dərsliyi seçin"
                                    : (!hasTopics ? "Mövzu tapılmadı (Dərslik mövcud deyil)" : "Mövzunu seçin"))}
                              </option>
                              {topicGroups.map((group, idx) => (
                                <optgroup key={idx} label={group.chapter}>
                                  {group.topics.map((t) => (
                                    <option key={t.title} value={t.title}>
                                      {t.title}
                                    </option>
                                  ))}
                                </optgroup>
                              ))}
                            </select>
                          );
                        })()}
                      </div>

                      {/* Difficulty */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Çətinlik dərəcəsi</label>
                        <div className="grid grid-cols-3 gap-2">
                          {difficultyOptions.map((option) => (
                            <button
                              key={option.value}
                              type="button"
                              onClick={() => setTestConfig({ ...testConfig, difficulty: option.value as any })}
                              className={`py-3 px-2 rounded-xl border text-xs sm:text-sm font-semibold transition-all flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 ${testConfig.difficulty === option.value
                                ? "border-primary bg-primary/10 text-primary ring-2 ring-primary shadow-xs"
                                : "border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700 bg-white"
                                }`}
                            >
                              <span className="text-base">{option.icon}</span>
                              <span>{option.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Question Count */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Sual sayı</label>
                        <div className="flex flex-wrap gap-2.5">
                          {questionCountOptions.map((count) => (
                            <button
                              key={count}
                              type="button"
                              onClick={() => setTestConfig({ ...testConfig, questionCount: count })}
                              className={`min-w-[48px] h-11 px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center justify-center ${testConfig.questionCount === count
                                ? "bg-primary text-white shadow-md ring-2 ring-primary/30"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                            >
                              {count}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Time Limit */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Vaxt limiti (dəq)</label>
                        <div className="flex flex-wrap gap-2.5">
                          {timeLimitOptions.map((t) => (
                            <button
                              key={t}
                              type="button"
                              onClick={() => setTestConfig({ ...testConfig, timeLimit: t })}
                              className={`min-w-[48px] h-11 px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center justify-center ${testConfig.timeLimit === t
                                ? "bg-primary text-white shadow-md ring-2 ring-primary/30"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                            >
                              {t}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 sm:mt-8">
                      <button
                        onClick={handleStartTest}
                        disabled={isGenerating}
                        className={`w-full py-4 rounded-2xl font-bold text-base sm:text-lg text-white shadow-xl transition-all transform hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-3 cursor-pointer ${isGenerating
                          ? "bg-gray-400 cursor-not-allowed"
                          : `bg-gradient-to-r ${themeClasses.primary} hover:opacity-95`
                          }`}
                      >
                        {isGenerating ? (
                          <>
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                            Test hazırlanır...
                          </>
                        ) : (
                          <>🚀 Testə Başla</>
                        )}
                      </button>
                    </div>
                  </CardContent>
                </Card>

                {/* 4-cü BLOK (Mobildə): Profil, Unikal ID, Mesajlar, Çıxış */}
                <div className="md:hidden space-y-4 pt-1">
                  <Card className="border-none shadow-md bg-white/95 backdrop-blur p-4 rounded-2xl border border-gray-100">
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                        <div className="flex items-center gap-2">
                          <Link href="/profile">
                            <Button variant="outline" size="sm" className="gap-2 h-10 px-3.5 font-semibold text-xs rounded-xl">
                              <User className="h-4 w-4 text-primary" />
                              Profil
                            </Button>
                          </Link>
                          <Button
                            variant={currentView === 'messages' ? 'default' : 'outline'}
                            size="sm"
                            className="gap-2 h-10 px-3.5 font-semibold text-xs rounded-xl"
                            onClick={() => setCurrentView(currentView === 'dashboard' ? 'messages' : 'dashboard')}
                          >
                            {currentView === 'dashboard' ? <Mail className="h-4 w-4" /> : <LayoutDashboard className="h-4 w-4" />}
                            {currentView === 'dashboard' ? 'Mesajlar' : 'Panel'}
                          </Button>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="gap-1.5 h-10 px-3 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl font-medium text-xs"
                          onClick={() => {
                            logout()
                            router.push("/login")
                          }}
                        >
                          <LogOut className="h-4 w-4" />
                          Çıxış
                        </Button>
                      </div>

                      {/* Unikal Şəxsi ID */}
                      <div className="flex items-center justify-between bg-primary/5 p-3 rounded-xl border border-primary/15">
                        <span className="text-xs text-gray-600 font-medium">Şəxsi ID Kodunuz:</span>
                        <span className="text-xs font-mono font-bold text-primary px-2.5 py-1 bg-white rounded-lg border border-primary/20 tracking-wider select-all" title="Sizin Şəxsi ID Kodunuz">
                          {getUserUniqueId(userData)}
                        </span>
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Dashboard Alt Brend Bloku */}
                <div className="pt-2">
                  <AdBanner
                    slot="dashboard-bottom-banner"
                    format="large-banner"
                    refreshKey="dashboard-bottom"
                    label="Sponsorluq və Brend Əməkdaşlığı"
                  />
                </div>
              </div>

              {/* Right Column - Brend Paneli (Yalnız Desktop ekranlarda) */}
              <div className="hidden lg:block space-y-4 sm:space-y-6 w-full overflow-hidden">
                <AdBanner
                  slot="dashboard-sidebar-top"
                  format="vertical"
                  refreshKey="dashboard-right-1"
                  label="Sponsorluq Fürsəti"
                />
                <AdBanner
                  slot="dashboard-sidebar-bottom"
                  format="vertical"
                  refreshKey="dashboard-right-2"
                  label="Brend Əməkdaşlığı"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {selectedTextbook && selectedTextbook.fileUrl && (
        <TextbookViewer
          isOpen={isViewerOpen}
          onClose={() => setIsViewerOpen(false)}
          title={selectedTextbook.title}
          fileUrl={selectedTextbook.fileUrl}
        />
      )}

      {selectedTextbook && selectedTextbook.pdfUrl && (
        <PdfViewer
          isOpen={isPdfViewerOpen}
          onClose={() => setIsPdfViewerOpen(false)}
          title={selectedTextbook.title}
          pdfUrl={selectedTextbook.pdfUrl}
        />
      )}

      <RegionModal
        isOpen={showRegionModal}
        onClose={() => {
          // Prevent closing if region is mandatory, or allow closing if optional
          // For now, we enforce selection if it was missing on load
          if (userData?.region) setShowRegionModal(false)
        }}
        onSelect={handleRegionSelect}
      />
    </MainLayout>
  )
}
