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
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-sm">
            <div className="flex items-center gap-4">
              <ProfileAvatar
                firstName={userData.firstName}
                lastName={userData.lastName}
                profileImage={userData.profileImage}
                size="lg"
              />
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Xoş gəlmisiniz, {userData.firstName} {userData.lastName} 👋
                </h1>
                <p className="text-gray-600 flex items-center gap-2">
                  {getRegionInfo()} | {userData.school} | {userData.class}-ci sinif
                </p>
              </div>
            </div>
            <div className="mt-4 md:mt-0 flex items-start gap-3">
              <div className="flex flex-col items-center">
                <Link href="/profile">
                  <Button variant="outline" className="gap-2">
                    <User className="h-4 w-4" />
                    Profil
                  </Button>
                </Link>
                <span className="text-[11px] font-mono font-bold text-primary mt-1 px-2 py-0.5 bg-primary/10 rounded-md border border-primary/20 tracking-tight select-all" title="Sizin Şəxsi ID Kodunuz">
                  {getUserUniqueId(userData)}
                </span>
              </div>
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
                className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={() => {
                  logout()
                  router.push("/login")
                }}
              >
                <LogOut className="h-4 w-4" />
                Çıxış
              </Button>
            </div>
          </div>

          {currentView === 'messages' ? (
            <MessagesTab userId={userData.id} userRole={userData.accountType} />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Test Configuration */}
              <div className="lg:col-span-2 space-y-8">
                <Card className="border-none shadow-lg bg-white/90 backdrop-blur">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-bold flex items-center gap-2">
                        <span className="text-2xl">📝</span> Yeni Test
                      </h2>
                      <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                        AI-Powered
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                                const isSecondary = 
                                  subj.includes("ikinci") || 
                                  title.includes("ikinci") || 
                                  id.includes("ikinci") || 
                                  id.includes("-2") ||
                                  id.includes("-2-")

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
                          className="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-white"
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

                                const isSecondary = 
                                  subj.includes("ikinci") || 
                                  title.includes("ikinci") || 
                                  id.includes("ikinci") || 
                                  id.includes("-2") ||
                                  id.includes("-2-")

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
                            className="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-white"
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
                              className="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-white"
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
                                className="h-[50px] px-4 border-gray-200 hover:bg-primary/5 hover:text-primary hover:border-primary"
                                onClick={() => setIsViewerOpen(true)}
                                title="Dərsliyi oxu (HTML)"
                              >
                                <BookOpen className="h-5 w-5" />
                              </Button>
                            )}
                            {selectedTextbook?.pdfUrl && (
                              <Button
                                variant="outline"
                                className="h-[50px] px-4 border-gray-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
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
                              className="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
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
                        <div className="grid grid-cols-2 gap-2">
                          {difficultyOptions.map((option) => (
                            <button
                              key={option.value}
                              onClick={() => setTestConfig({ ...testConfig, difficulty: option.value as any })}
                              className={`p-2 rounded-lg border text-sm transition-all flex items-center justify-center gap-2 ${testConfig.difficulty === option.value
                                ? "border-primary bg-primary/5 text-primary ring-1 ring-primary"
                                : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                                }`}
                            >
                              <span>{option.icon}</span>
                              {option.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Question Count */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Sual sayı</label>
                        <div className="flex flex-wrap gap-2">
                          {questionCountOptions.map((count) => (
                            <button
                              key={count}
                              onClick={() => setTestConfig({ ...testConfig, questionCount: count })}
                              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${testConfig.questionCount === count
                                ? "bg-primary text-white shadow-md"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
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
                        <div className="flex flex-wrap gap-2">
                          {timeLimitOptions.map((t) => (
                            <button
                              key={t}
                              onClick={() => setTestConfig({ ...testConfig, timeLimit: t })}
                              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${testConfig.timeLimit === t
                                ? "bg-primary text-white shadow-md"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                }`}
                            >
                              {t}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="mt-8">
                      <button
                        onClick={handleStartTest}
                        disabled={isGenerating}
                        className={`w-full py-4 rounded-xl font-bold text-lg text-white shadow-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 ${isGenerating
                          ? "bg-gray-400 cursor-not-allowed"
                          : `bg-gradient-to-r ${themeClasses.primary} hover:opacity-90`
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

                {/* Dashboard Alt Reklam Bloku (Qırmızı çərçivəyə alınan Son Nəticələr sahəsi) */}
                <div className="pt-2">
                  <AdBanner
                    slot="dashboard-bottom-banner"
                    format="large-banner"
                    refreshKey="dashboard-bottom"
                    label="Tövsiyə Olunan Təhsil Təklifi və Hazırlıq Proqramı"
                  />
                </div>
              </div>

              {/* Right Column - Reklam Paneli (Qırmızı çərçivəyə alınan Sağ Statistika sahəsi) */}
              <div className="space-y-6">
                <AdBanner
                  slot="dashboard-sidebar-top"
                  format="vertical"
                  refreshKey="dashboard-right-1"
                  label="DİM & Olimpiada Hazırlığı"
                />
                <AdBanner
                  slot="dashboard-sidebar-bottom"
                  format="vertical"
                  refreshKey="dashboard-right-2"
                  label="Xarici Dillər & İT Kursları"
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
