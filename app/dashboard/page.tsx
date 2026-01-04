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
import { logout, type UserData } from "@/lib/profile-utils"
import { User, LogOut, Mail, LayoutDashboard, BookOpen, FileText } from "lucide-react"
import Link from "next/link"
import { MessagesTab } from "@/components/messages-tab"
import { TextbookViewer } from "@/components/textbook-viewer"
import { PdfViewer } from "@/components/pdf-viewer"
import { RegionModal } from "@/components/region-modal"

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

      if (parsed.accountType === "parent") {
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
        const subjectParam = selectedSubject ? `&subject=${encodeURIComponent(selectedSubject)}` : '';
        const res = await fetch(`/api/textbooks/topics?class=${userData.class}${subjectParam}`);
        const data = await res.json();
        if (data.success && data.topics) {
          setApiTopics(data.topics);
        }
      } catch (error) {
        console.error("Failed to fetch topics:", error);
      }
    }
    fetchTopics();
  }, [userData?.class, selectedSubject])

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
            <div className="mt-4 md:mt-0 flex gap-3">
              <Link href="/profile">
                <Button variant="outline" className="gap-2">
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
                      {/* Subject / Textbook Dropdown */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Fənn</label>
                        <select
                          value={selectedSubject}
                          onChange={(e) => {
                            const subject = e.target.value
                            setSelectedSubject(subject)

                            // Check if this is a foreign language subject
                            const isForeignLang = subject === "Xarici dil" || subject === "İkinci xarici dil"
                            setIsForeignLanguage(isForeignLang)

                            if (isForeignLang) {
                              // For foreign languages, always show the 4 static languages
                              setAvailableLanguages(FOREIGN_LANGUAGES)
                              setSelectedLanguage("")
                              setAvailableTextbooks([])
                              setSelectedTextbook(null)
                              setTestConfig({ ...testConfig, textbook: "", topic: "" })
                            } else {
                              // For regular subjects, get textbooks as before
                              setAvailableLanguages([])
                              setSelectedLanguage("")
                              const textbooks = userData?.class ? getTextbooks(userData.class, subject) : []
                              setAvailableTextbooks(textbooks)

                              if (textbooks.length > 0) {
                                setTestConfig({ ...testConfig, textbook: textbooks[0].title, topic: "" })
                                setSelectedTextbook(textbooks[0])
                              } else {
                                setTestConfig({ ...testConfig, textbook: subject, topic: "" })
                                setSelectedTextbook(null)
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

                      {/* Foreign Language Selection (Always show 4 languages) */}
                      {isForeignLanguage && selectedSubject && (
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">Dil seçin</label>
                          <select
                            value={selectedLanguage}
                            onChange={(e) => {
                              const language = e.target.value;
                              setSelectedLanguage(language);

                              if (language && userData?.class) {
                                // Get textbooks matching the selected language and subject
                                // For "Xarici dil" -> "İngilis dili", we look for textbooks with subject="Xarici dil" and title containing "İngilis dili"
                                const allTextbooks = getTextbooks(userData.class, selectedSubject);
                                const languageTextbooks = allTextbooks.filter(t =>
                                  extractLanguageFromTitle(t.title) === language
                                );

                                setAvailableTextbooks(languageTextbooks);

                                if (languageTextbooks.length > 0) {
                                  // Auto-select first textbook if found
                                  setSelectedTextbook(languageTextbooks[0]);
                                  setTestConfig({ ...testConfig, textbook: language, topic: "" });
                                } else {
                                  // No textbook found for this language+grade
                                  setSelectedTextbook(null);
                                  // Still keep the language as "textbook" for topic API lookup (even if it might fail)
                                  setTestConfig({ ...testConfig, textbook: language, topic: "" });
                                }
                              } else {
                                setAvailableTextbooks([]);
                                setSelectedTextbook(null);
                                setTestConfig({ ...testConfig, textbook: "", topic: "" });
                              }
                            }}
                            className="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-white"
                          >
                            <option value="">Dil seçin</option>
                            {/* Always show the hardcoded list */}
                            {FOREIGN_LANGUAGES.map((lang) => (
                              <option key={lang} value={lang}>
                                {lang}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}

                      {/* Textbook Selection */}
                      {/* Show if we have textbooks OR if we are in non-foreign mode */}
                      {/* For foreign mode: only show if a language is selected AND we actually found a textbook */}
                      {(!isForeignLanguage || (isForeignLanguage && selectedLanguage && availableTextbooks.length > 0)) && availableTextbooks.length > 0 && (
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">Dərslik</label>
                          <div className="flex gap-2">
                            <select
                              value={selectedTextbook?.id || ""}
                              onChange={(e) => {
                                const textbook = availableTextbooks.find(t => t.id === e.target.value)
                                setSelectedTextbook(textbook || null)
                                if (textbook) {
                                  // For foreign language, we keep the language name as the primary config identifier if needed, 
                                  // but usually we might want the Title.
                                  // The User said: "Select language -> Select Textbook -> Select Topic from Textbook"
                                  // The API topics usually need the Subject Name or Textbook Name.
                                  // Let's stick to using the format likely expected by the existing API or state.
                                  // If isForeignLanguage, we effectively used `language` as the key before.
                                  // Let's ensure consistency.
                                  setTestConfig({ ...testConfig, textbook: isForeignLanguage ? selectedLanguage : textbook.title, topic: "" })
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

                      {/* Topic Dropdown - API-based with groups */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Mövzu</label>
                        {(() => {
                          // Determine lookup key for API
                          const textbookForTopics = isForeignLanguage
                            ? selectedLanguage  // For foreign languages, key is the language name (e.g. "İngilis dili")
                            : selectedSubject;  // For regular subjects, key is subject name

                          const topicGroups = textbookForTopics && apiTopics[textbookForTopics]
                            ? apiTopics[textbookForTopics]
                            : [];

                          const hasTopics = topicGroups.some(g => g.topics.length > 0);

                          // Disable if:
                          // 1. Foreign Language mode AND no language selected
                          // 2. Regular mode AND no subject selected
                          // 3. No topics found (regardless of selection)
                          const isDisabled = (isForeignLanguage ? !selectedLanguage : !selectedSubject);

                          return (
                            <select
                              value={testConfig.topic}
                              onChange={(e) => setTestConfig({ ...testConfig, topic: e.target.value })}
                              disabled={isDisabled || !hasTopics}
                              className="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                            >
                              <option value="">
                                {isDisabled
                                  ? "Əvvəl əvvəlki xanaları seçin"
                                  : (!hasTopics ? "Mövzu tapılmadı (Dərslik mövcud deyil)" : "Mövzunu seçin")}
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

                {/* Recent Activity Mock */}
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-sm">
                  <h3 className="text-lg font-bold mb-4">Son Nəticələr</h3>
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-gray-100 text-xl`}>{i === 1 ? "📚" : i === 2 ? "📐" : "🌍"}</div>
                          <div>
                            <h4 className="font-medium text-gray-900">{i === 1 ? "Azərbaycan dili" : i === 2 ? "Riyaziyyat" : "Coğrafiya"}</h4>
                            <p className="text-sm text-gray-500">{new Date().toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="block font-bold text-lg text-green-600">{85 + i * 2}%</span>
                          <span className="text-xs text-gray-400">15 sual</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column - Stats */}
              <div className="space-y-6">
                <Card className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white border-none shadow-xl">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-medium opacity-90 mb-1">Ümumi Bal</h3>
                    <div className="text-4xl font-bold mb-4">2,450</div>
                    <div className="flex items-center gap-2 text-sm opacity-80">
                      <span className="bg-white/20 px-2 py-1 rounded">🏆 Top 5%</span>
                      <span>Bu ay +350</span>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-2 gap-4">
                  <Card className="bg-white/80 backdrop-blur-sm border-none shadow-sm">
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl mb-2">✅</div>
                      <div className="text-2xl font-bold text-gray-900">45</div>
                      <div className="text-xs text-gray-500">Testlər</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-white/80 backdrop-blur-sm border-none shadow-sm">
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl mb-2">🔥</div>
                      <div className="text-2xl font-bold text-gray-900">12</div>
                      <div className="text-xs text-gray-5">Gün ardıcıl</div>
                    </CardContent>
                  </Card>
                </div>

                <Card className="bg-white/80 backdrop-blur-sm border-none shadow-sm">
                  <CardContent className="p-6">
                    <h3 className="font-bold mb-4">Güclü tərəflər</h3>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Tarix</span>
                          <span className="font-medium">92%</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-green-500 w-[92%]"></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Ədəbiyyat</span>
                          <span className="font-medium">88%</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500 w-[88%]"></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Coğrafiya</span>
                          <span className="font-medium">75%</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-yellow-500 w-[75%]"></div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
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
