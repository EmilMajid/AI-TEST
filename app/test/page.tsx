"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Clock, CheckCircle, XCircle, RotateCcw, ArrowRight, ArrowLeft, Target, Brain } from "lucide-react"
import { useRouter } from "next/navigation"
import TestGenerationStatus from "@/components/test-generation-status"
import { getDashboardPath, getCurrentUser } from "@/lib/profile-utils"
import { AdBanner } from "@/components/ads/ad-banner"
import { TestInterstitialAd } from "@/components/ads/test-interstitial-ad"

interface Question {
  id: number
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
  difficulty: string
  topic: string
  bloomLevel: string
  timeEstimate?: number
  sourceContext?: string
}

interface TestConfig {
  textbook: string
  topic: string
  class: string
  difficulty: "sadə" | "orta" | "çətin" | "qarışıq"
  questionCount: number
  timeLimit: number
}

import { formatScientificText } from "@/lib/format-math"

const cleanFormattedText = (text: any): string => {
  return formatScientificText(text)
};

export default function TestPage() {
  const router = useRouter()
  const [testConfig, setTestConfig] = useState<TestConfig | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: number }>({})
  const [timeLeft, setTimeLeft] = useState(0)
  const [isTestStarted, setIsTestStarted] = useState(false)
  const [isTestCompleted, setIsTestCompleted] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationError, setGenerationError] = useState<string | null>(null)
  const [testResults, setTestResults] = useState<any>(null)
  const [showInterstitial, setShowInterstitial] = useState(false)

  useEffect(() => {
    // Test konfiqurasiyasını localStorage-dən oxu
    const storedTestData = localStorage.getItem("currentTest")
    if (storedTestData) {
      const config = JSON.parse(storedTestData)
      setTestConfig(config)
      setTimeLeft(config.timeLimit * 60) // dəqiqəni saniyəyə çevir
      generateTest(config)
    } else {
      const user = getCurrentUser()
      router.push(getDashboardPath(user?.accountType))
    }
  }, [router])

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (isTestStarted && timeLeft > 0 && !isTestCompleted) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleTestComplete()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [isTestStarted, timeLeft, isTestCompleted])

  const generateTest = async (config: TestConfig) => {
    setIsGenerating(true)
    setGenerationError(null)

    try {
      const response = await fetch("/api/generate-test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          textbook: config.textbook,
          topic: config.topic,
          grade: config.class,
          questionCount: config.questionCount,
          difficulty: config.difficulty,
          timeLimit: config.timeLimit,
        }),
      })

      const data = await response.json()

      if (data.success && data.questions && data.questions.length > 0) {
        // Sualları konfiqurasiyaya uyğun olaraq filtrələ
        const filteredQuestions = data.questions.slice(0, config.questionCount)
        setQuestions(filteredQuestions)
        setIsTestStarted(true)

        console.log(`✅ ${filteredQuestions.length} sual yaradıldı:`, {
          requestedCount: config.questionCount,
          actualCount: filteredQuestions.length,
          difficulty: config.difficulty,
          provider: data.provider,
        })
      } else {
        throw new Error(data.error || "Bu mövzu üzrə hələlik test bazasında sual mövcud deyil. Zəhmət olmasa digər mövzuları seçin.")
      }
    } catch (error) {
      console.error("Test generation error:", error)
      setGenerationError(error instanceof Error ? error.message : "Naməlum xəta")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleStartTest = () => {
    setIsTestStarted(true)
  }

  const handleAnswerSelect = (questionId: number, answerIndex: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: answerIndex,
    }))
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const handleTestComplete = () => {
    setShowInterstitial(true)
  }

  const handleFinishAndShowResults = () => {
    setShowInterstitial(false)
    setIsTestCompleted(true)
    calculateResults()
  }

  const calculateResults = () => {
    let correctAnswers = 0
    // Build answers map: questionId -> answerIndex (used by results page)
    const answersMap: { [key: number]: number } = {}

    const detailedResults = questions.map((question) => {
      const userAnswer = selectedAnswers[question.id]
      const isCorrect = userAnswer === question.correctAnswer
      if (isCorrect) correctAnswers++
      if (userAnswer !== undefined) answersMap[question.id] = userAnswer

      return {
        questionId: question.id,
        question: question.question,
        userAnswer,
        correctAnswer: question.correctAnswer,
        isCorrect,
        explanation: question.explanation,
        difficulty: question.difficulty,
        bloomLevel: question.bloomLevel,
        sourceContext: question.sourceContext,
      }
    })

    const score = Math.round((correctAnswers / questions.length) * 100)
    const timeSpent = (testConfig?.timeLimit || 0) * 60 - timeLeft

    const results = {
      score,
      correctAnswers,
      totalQuestions: questions.length,
      timeSpent,
      detailedResults,
      testConfig,
    }

    setTestResults(results)

    // Nəticələri results/page.tsx-in gözlədiyi formatda saxla
    const resultsPageFormat = {
      testData: {
        textbook: testConfig?.textbook || "",
        topic: testConfig?.topic || "",
        class: testConfig?.class || "",
        difficulty: testConfig?.difficulty || "orta",
      },
      questions: questions,
      answers: answersMap,
      score,
      timeSpent,
      completedAt: new Date().toISOString(),
    }

    // Hər iki açarla saxla: köhnə uyğunluq + yeni results səhifəsi
    localStorage.setItem("lastTestResults", JSON.stringify(results))
    localStorage.setItem("testResults", JSON.stringify(resultsPageFormat))

    // Real nəticəni serverə yaddaşa yaz və valideynə e-mail bildirişi göndər
    try {
      const currentUser = getCurrentUser()
      const session = localStorage.getItem("session")
      const token = session ? JSON.parse(session).access_token : null

      let parentEmail = (currentUser as any)?.parentEmail || ""
      let parentId = (currentUser as any)?.parentId || ""

      if (!parentEmail) {
        try {
          const allLinks = JSON.parse(localStorage.getItem("all_student_links") || "[]")
          const myLink = allLinks.find((l: any) =>
            String(l.studentId) === String(currentUser?.id) ||
            (currentUser?.email && l.student?.email?.toLowerCase() === currentUser.email.toLowerCase())
          )
          if (myLink?.parentEmail) {
            parentEmail = myLink.parentEmail
            parentId = myLink.parentId || parentId
          }
        } catch (e) {}
      }

      if (!parentEmail) {
        try {
          const regUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]")
          const me = regUsers.find((u: any) =>
            String(u.id) === String(currentUser?.id) ||
            (currentUser?.email && u.email?.toLowerCase() === currentUser.email.toLowerCase())
          )
          if (me?.parentEmail) {
            parentEmail = me.parentEmail
            parentId = me.parentId || parentId
          }
        } catch (e) {}
      }

      // Cache student result locally for instant parent dashboard display
      try {
        const studentKey = `student_test_results_${currentUser?.id || "student"}`
        const prevRes = JSON.parse(localStorage.getItem(studentKey) || "[]")
        prevRes.unshift({
          ...resultsPageFormat,
          id: `res-${Date.now()}`,
          studentId: currentUser?.id,
          textbook: testConfig?.textbook || "",
          topic: testConfig?.topic || "",
          class: testConfig?.class || "",
          score,
          correctAnswers,
          totalQuestions: questions.length,
          timeSpent,
          completedAt: resultsPageFormat.completedAt,
        })
        localStorage.setItem(studentKey, JSON.stringify(prevRes.slice(0, 50)))
      } catch (e) {}

      fetch("/api/save-test-result", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { "Authorization": `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          studentId: currentUser?.id,
          studentEmail: currentUser?.email,
          studentName: currentUser ? `${currentUser.firstName || ""} ${currentUser.lastName || ""}`.trim() : "Şagird",
          uniqueId: (currentUser as any)?.uniqueId || "",
          school: (currentUser as any)?.school || "",
          parentId,
          parentEmail,
          textbook: testConfig?.textbook || "",
          topic: testConfig?.topic || "",
          class: testConfig?.class || "",
          difficulty: testConfig?.difficulty || "orta",
          score,
          totalQuestions: questions.length,
          correctAnswers,
          timeSpent,
          completedAt: resultsPageFormat.completedAt,
          answers: answersMap,
          detailedResults,
        })
      }).then(res => res.json()).then(data => {
        if (data.emailNotification?.sent) {
          console.log("Valideynə imtahan bildirişi göndərildi:", data.emailNotification.parentEmail)
        }
      }).catch(err => {
        console.error("Test nəticəsi serverə göndərilərkən xəta:", err)
      })
    } catch (e) {
      console.error("Save test result trigger error:", e)
    }
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "sadə":
        return "bg-green-100 text-green-800"
      case "orta":
        return "bg-yellow-100 text-yellow-800"
      case "çətin":
        return "bg-red-100 text-red-800"
      case "qarışıq":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  if (!testConfig) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold mb-2">Yüklənir...</h3>
            <p className="text-gray-600">Test konfiqurasiyası yüklənir</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (isGenerating) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/20 to-primary/10">
        <TestGenerationStatus config={testConfig} onCancel={() => router.push(getDashboardPath(getCurrentUser()?.accountType))} />
      </div>
    )
  }

  if (generationError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600 flex items-center">
              <XCircle className="h-6 w-6 mr-2" />
              Xəta
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">{generationError}</p>
            <div className="flex space-x-2">
              <Button onClick={() => generateTest(testConfig)} className="flex-1">
                <RotateCcw className="h-4 w-4 mr-2" />
                Yenidən Cəhd Et
              </Button>
              <Button variant="outline" onClick={() => router.push(getDashboardPath(getCurrentUser()?.accountType))} className="flex-1">
                Geri Qayıt
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-lg border-border">
          <CardHeader>
            <CardTitle className="text-amber-600 flex items-center text-lg">
              <Brain className="h-5 w-5 mr-2" />
              Məlumat
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700">
              Bu mövzu üzrə hələlik test sualları bazaya daxil edilməyib. Zəhmət olmasa digər mövzuları və ya fənləri seçin.
            </p>
            <Button
              onClick={() => router.push(getDashboardPath(getCurrentUser()?.accountType))}
              className="w-full"
            >
              Fənn Seçiminə Qayıt
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (isTestCompleted && testResults) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/20 to-primary/10 py-6 px-3 sm:px-6">
        <div className="w-full max-w-[1600px] mx-auto flex justify-center items-start gap-6">
          
          {/* Sol Reklam Bloku (Nəticə səhifəsinin sol boşluğu) */}
          <aside className="hidden lg:block w-[230px] xl:w-[260px] shrink-0 sticky top-6">
            <AdBanner
              slot="result-sidebar-left"
              format="vertical"
              refreshKey="result-left"
              label="Tövsiyə Olunan Kurslar"
            />
          </aside>

          {/* Mərkəzi Əsas Nəticə Bloku */}
          <main className="w-full flex-1 max-w-4xl space-y-6">
            <Card className="shadow-md border-border/80">
              <CardHeader className="pb-3 border-b border-border/40">
                <CardTitle className="flex items-center text-xl font-bold">
                  <CheckCircle className="h-6 w-6 text-green-600 mr-2" />
                  Test Tamamlandı
                </CardTitle>
                <CardDescription className="text-sm">
                  {testConfig.textbook} - {testConfig.topic} ({testConfig.difficulty} səviyyə)
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                {/* Statistika Qutuları */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted/30 rounded-2xl border border-border/50">
                  <div className="text-center">
                    <div className={`text-3xl font-extrabold ${getScoreColor(testResults.score)}`}>{testResults.score}%</div>
                    <div className="text-xs text-muted-foreground font-medium mt-0.5">Ümumi Bal</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-extrabold text-blue-600">
                      {testResults.correctAnswers}/{testResults.totalQuestions}
                    </div>
                    <div className="text-xs text-muted-foreground font-medium mt-0.5">Düzgün Cavablar</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-extrabold text-purple-600 font-mono">{formatTime(testResults.timeSpent)}</div>
                    <div className="text-xs text-muted-foreground font-medium mt-0.5">Sərf Olunan Vaxt</div>
                  </div>
                  <div className="text-center flex flex-col items-center justify-center">
                    <Badge className={`${getDifficultyColor(testConfig.difficulty)} font-bold text-xs py-1 px-3`}>
                      {testConfig.difficulty.charAt(0).toUpperCase() + testConfig.difficulty.slice(1)}
                    </Badge>
                    <div className="text-xs text-muted-foreground font-medium mt-1">Çətinlik</div>
                  </div>
                </div>

                {/* Böyük və Zəngin Nəticə Reklamı (Featured Large Banner) */}
                <div className="pt-2">
                  <AdBanner
                    slot="result-featured-large"
                    format="large-banner"
                    refreshKey="completed-main"
                    label="Xüsusi Təhsil Təklifi və Endirim Kampaniyası"
                  />
                </div>

                {/* Keçid Düymələri */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Button
                    size="lg"
                    onClick={() => router.push("/results")}
                    className="flex-1 bg-primary hover:bg-primary/90 text-white font-bold shadow-md hover:scale-[1.01] active:scale-[0.99] transition-all"
                  >
                    Ətraflı Nəticələr və Analiz
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => router.push(getDashboardPath(getCurrentUser()?.accountType))}
                    className="flex-1 font-semibold shadow-xs hover:bg-gray-100"
                  >
                    Yeni Testə Başla
                  </Button>
                </div>
              </CardContent>
            </Card>
          </main>

          {/* Sağ Reklam Bloku (Nəticə səhifəsinin sağ boşluğu) */}
          <aside className="hidden lg:block w-[230px] xl:w-[260px] shrink-0 sticky top-6">
            <AdBanner
              slot="result-sidebar-right"
              format="vertical"
              refreshKey="result-right"
              label="Sponsorlu Təhsil"
            />
          </aside>

        </div>
      </div>
    )
  }

  if (!isTestStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/20 to-primary/10 py-6 px-3 sm:px-6">
        <div className="w-full max-w-[1600px] mx-auto flex justify-center items-start gap-6">
          
          {/* Sol Reklam Bloku (Test Hazırdır ekranı) */}
          <aside className="hidden lg:block w-[230px] xl:w-[260px] shrink-0 sticky top-6">
            <AdBanner
              slot="ready-sidebar-left"
              format="vertical"
              refreshKey="ready-left"
              label="Tövsiyə Olunan Kurslar"
            />
          </aside>

          {/* Mərkəzi Test Hazırdır Kartı */}
          <main className="w-full flex-1 max-w-4xl space-y-6">
            <Card className="shadow-md border-border/80">
              <CardHeader className="pb-3 border-b border-border/40">
                <CardTitle className="flex items-center text-xl font-bold">
                  <Target className="h-6 w-6 text-primary mr-2" />
                  Test Hazırdır
                </CardTitle>
                <CardDescription className="text-sm">
                  {testConfig.textbook} - {testConfig.topic}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                {/* Test Konfiqurasiya Məlumatları */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted/30 rounded-2xl border border-border/50">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{questions.length}</div>
                    <div className="text-xs text-muted-foreground mt-1 font-medium">Sual Sayı</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{testConfig.timeLimit}</div>
                    <div className="text-xs text-muted-foreground mt-1 font-medium">Dəqiqə</div>
                  </div>
                  <div className="text-center flex flex-col items-center justify-center">
                    <Badge className={`${getDifficultyColor(testConfig.difficulty)} font-bold text-xs py-1 px-3`}>
                      {testConfig.difficulty.charAt(0).toUpperCase() + testConfig.difficulty.slice(1)}
                    </Badge>
                    <div className="text-xs text-muted-foreground mt-1 font-medium">Çətinlik</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{testConfig.class}</div>
                    <div className="text-xs text-muted-foreground mt-1 font-medium">Sinif</div>
                  </div>
                </div>

                {/* Çətinlik Bölgüsü (qarışıq səviyyə üçün) */}
                {testConfig.difficulty === "qarışıq" && (
                  <div className="p-4 bg-purple-50/60 rounded-xl border border-purple-100">
                    <h4 className="font-semibold text-sm mb-3 flex items-center text-purple-900">
                      <Brain className="h-4 w-4 mr-2 text-purple-600" />
                      Çətinlik Bölgüsü
                    </h4>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div className="p-2 bg-white rounded-lg border border-purple-100">
                        <div className="text-green-600 font-bold text-base">{Math.ceil(questions.length * 0.3)}</div>
                        <div className="text-xs text-gray-500">Sadə (30%)</div>
                      </div>
                      <div className="p-2 bg-white rounded-lg border border-purple-100">
                        <div className="text-yellow-600 font-bold text-base">{Math.ceil(questions.length * 0.5)}</div>
                        <div className="text-xs text-gray-500">Orta (50%)</div>
                      </div>
                      <div className="p-2 bg-white rounded-lg border border-purple-100">
                        <div className="text-red-600 font-bold text-base">
                          {questions.length - Math.ceil(questions.length * 0.3) - Math.ceil(questions.length * 0.5)}
                        </div>
                        <div className="text-xs text-gray-500">Çətin (20%)</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Reklam Bloku */}
                <div className="pt-2">
                  <AdBanner
                    slot="ready-bottom-banner"
                    format="large-banner"
                    refreshKey="ready-main"
                    label="Xüsusi Təhsil Təklifi və Endirim Kampaniyası"
                  />
                </div>

                <div className="text-center space-y-4 pt-2">
                  <p className="text-muted-foreground text-sm">
                    Test başladıqdan sonra <strong>{testConfig.timeLimit} dəqiqə</strong> vaxtınız olacaq. Bütün sualları cavablandırmağa çalışın.
                  </p>
                  <Button
                    onClick={handleStartTest}
                    size="lg"
                    className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-6 text-lg rounded-xl shadow-lg hover:scale-[1.01] active:scale-[0.99] transition-all"
                  >
                    <Clock className="h-5 w-5 mr-2" />
                    Testi Başlat
                  </Button>
                </div>
              </CardContent>
            </Card>
          </main>

          {/* Sağ Reklam Bloku (Test Hazırdır ekranı) */}
          <aside className="hidden lg:block w-[230px] xl:w-[260px] shrink-0 sticky top-6">
            <AdBanner
              slot="ready-sidebar-right"
              format="vertical"
              refreshKey="ready-right"
              label="Sponsorlu Elanlar"
            />
          </aside>

        </div>
      </div>
    )
  }

  const currentQuestion = questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 to-primary/10 py-6 px-3 sm:px-6">
      <div className="w-full max-w-[1600px] mx-auto flex justify-center items-start gap-6">
        
        {/* Sol Reklam Bloku (Sual kartını sıxmır, yan kənardakı boş sahəni tutur) */}
        <aside className="hidden lg:block w-[230px] xl:w-[260px] shrink-0 sticky top-6">
          <AdBanner
            slot="test-sidebar-left"
            format="vertical"
            refreshKey={currentQuestionIndex}
            label="Tövsiyə Olunan Təhsil"
          />
        </aside>

        {/* Mərkəzi Əsas Test Bloku (Maksimum geniş və oxunaqlı) */}
        <main className="w-full flex-1 max-w-4xl space-y-6">
          {/* Header (Fənn, Mövzu, Taymer, Tərəqqi) */}
          <Card className="shadow-sm">
            <CardContent className="p-5">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h1 className="text-xl font-bold text-gray-900">{testConfig.textbook}</h1>
                  <p className="text-sm text-gray-600">{testConfig.topic}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-red-600 tracking-wider font-mono">{formatTime(timeLeft)}</div>
                  <div className="text-xs text-gray-500 font-medium">Qalan Vaxt</div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs sm:text-sm font-medium text-gray-600">
                  <span>
                    Sual {currentQuestionIndex + 1} / {questions.length}
                  </span>
                  <span>{Math.round(progress)}% tamamlandı</span>
                </div>
                <Progress value={progress} className="w-full h-2" />
              </div>
            </CardContent>
          </Card>

          {/* Sual və Cavab Kartı */}
          <Card className="shadow-md border-border/80">
            <CardHeader className="pb-3 border-b border-border/40">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <span className="flex items-center justify-center w-7 h-7 rounded-full bg-primary/10 text-primary text-sm font-bold">
                    {currentQuestionIndex + 1}
                  </span>
                  Sual {currentQuestionIndex + 1}
                </CardTitle>
                <Badge className={getDifficultyColor(currentQuestion.difficulty)}>
                  {currentQuestion.difficulty.charAt(0).toUpperCase() + currentQuestion.difficulty.slice(1)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-5 space-y-6">
              <p className="text-base sm:text-lg font-medium text-gray-900 leading-relaxed">
                {cleanFormattedText(currentQuestion.question)}
              </p>

              <RadioGroup
                value={selectedAnswers[currentQuestion.id]?.toString() || ""}
                onValueChange={(value) => handleAnswerSelect(currentQuestion.id, Number.parseInt(value))}
                className="space-y-3"
              >
                {currentQuestion.options.map((option, index) => (
                  <div
                    key={index}
                    onClick={() => handleAnswerSelect(currentQuestion.id, index)}
                    className={`flex items-center space-x-3 p-3.5 rounded-xl border transition-all cursor-pointer ${
                      selectedAnswers[currentQuestion.id] === index
                        ? "border-primary bg-primary/5 shadow-xs font-medium"
                        : "border-border/60 hover:bg-gray-50 hover:border-gray-300"
                    }`}
                  >
                    <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                    <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer text-sm sm:text-base leading-snug">
                      {cleanFormattedText(option)}
                    </Label>
                  </div>
                ))}
              </RadioGroup>

              {/* Naviqasiya Düymələri (Sual kartının daxilində - Hər zaman aydın və itməyən) */}
              <div className="pt-6 border-t border-border flex justify-between items-center gap-4">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handlePreviousQuestion}
                  disabled={currentQuestionIndex === 0}
                  className="px-6 font-semibold shadow-xs hover:bg-gray-100"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Əvvəlki
                </Button>

                <div className="flex space-x-2">
                  {currentQuestionIndex === questions.length - 1 ? (
                    <Button
                      size="lg"
                      onClick={handleTestComplete}
                      className="bg-green-600 hover:bg-green-700 text-white px-8 font-bold shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all"
                    >
                      <CheckCircle className="h-5 w-5 mr-2" />
                      Testi Bitir
                    </Button>
                  ) : (
                    <Button
                      size="lg"
                      onClick={handleNextQuestion}
                      className="bg-primary hover:bg-primary/90 text-white px-8 font-bold shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all"
                    >
                      Növbəti
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </main>

        {/* Sağ Reklam Bloku (Sual kartını sıxmır, yan kənardakı boş sahəni tutur) */}
        <aside className="hidden lg:block w-[230px] xl:w-[260px] shrink-0 sticky top-6">
          <AdBanner
            slot="test-sidebar-right"
            format="vertical"
            refreshKey={`right-${currentQuestionIndex}`}
            label="Sponsorlu Elanlar"
          />
        </aside>

      </div>

      {/* Test Bitmə Keçid (Interstitial) Reklam Modalı */}
      <TestInterstitialAd
        isOpen={showInterstitial}
        onComplete={handleFinishAndShowResults}
      />
    </div>
  )
}
