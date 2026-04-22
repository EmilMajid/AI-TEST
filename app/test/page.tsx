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
}

interface TestConfig {
  textbook: string
  topic: string
  class: string
  difficulty: "sadə" | "orta" | "çətin" | "qarışıq"
  questionCount: number
  timeLimit: number
}

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

      if (data.success && data.questions) {
        // Sualları konfiqurasiyaya uyğun olaraq filtrələ
        const filteredQuestions = data.questions.slice(0, config.questionCount)
        setQuestions(filteredQuestions)

        console.log(`✅ ${filteredQuestions.length} sual yaradıldı:`, {
          requestedCount: config.questionCount,
          actualCount: filteredQuestions.length,
          difficulty: config.difficulty,
          provider: data.provider,
        })
      } else {
        throw new Error(data.error || "Test yaradılarkən xəta baş verdi")
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
      <div className="min-h-screen bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <h3 className="text-lg font-semibold mb-2">Test Hazırlanır...</h3>
            <p className="text-gray-600">Zəhmət olmasa gözləyin</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (isTestCompleted && testResults) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/20 to-primary/10 p-4">
        <div className="max-w-4xl mx-auto">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle className="h-6 w-6 text-green-600 mr-2" />
                Test Tamamlandı
              </CardTitle>
              <CardDescription>
                {testConfig.textbook} - {testConfig.topic} ({testConfig.difficulty} səviyyə)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center">
                  <div className={`text-3xl font-bold ${getScoreColor(testResults.score)}`}>{testResults.score}%</div>
                  <div className="text-sm text-gray-600">Ümumi Bal</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">
                    {testResults.correctAnswers}/{testResults.totalQuestions}
                  </div>
                  <div className="text-sm text-gray-600">Düzgün Cavablar</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">{formatTime(testResults.timeSpent)}</div>
                  <div className="text-sm text-gray-600">Sərf Olunan Vaxt</div>
                </div>
                <div className="text-center">
                  <Badge className={getDifficultyColor(testConfig.difficulty)}>
                    {testConfig.difficulty.charAt(0).toUpperCase() + testConfig.difficulty.slice(1)} Səviyyə
                  </Badge>
                  <div className="text-sm text-gray-600 mt-1">Çətinlik</div>
                </div>
              </div>

              <div className="flex space-x-4">
                <Button onClick={() => router.push("/results")} className="flex-1">
                  Ətraflı Nəticələr
                </Button>
                <Button variant="outline" onClick={() => router.push(getDashboardPath(getCurrentUser()?.accountType))} className="flex-1">
                  Yeni Test
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (!isTestStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="h-6 w-6 text-primary mr-2" />
              Test Hazırdır
            </CardTitle>
            <CardDescription>
              {testConfig.textbook} - {testConfig.topic}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Test Konfiqurasiya Məlumatları */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{questions.length}</div>
                <div className="text-sm text-gray-600">Sual Sayı</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{testConfig.timeLimit}</div>
                <div className="text-sm text-gray-600">Dəqiqə</div>
              </div>
              <div className="text-center">
                <Badge className={getDifficultyColor(testConfig.difficulty)}>
                  {testConfig.difficulty.charAt(0).toUpperCase() + testConfig.difficulty.slice(1)}
                </Badge>
                <div className="text-sm text-gray-600 mt-1">Çətinlik</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{testConfig.class}</div>
                <div className="text-sm text-gray-600">Sinif</div>
              </div>
            </div>

            {/* Çətinlik Bölgüsü (qarışıq səviyyə üçün) */}
            {testConfig.difficulty === "qarışıq" && (
              <div className="p-4 bg-purple-50 rounded-lg">
                <h4 className="font-medium mb-2 flex items-center">
                  <Brain className="h-4 w-4 mr-2" />
                  Çətinlik Bölgüsü
                </h4>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="text-center">
                    <div className="text-green-600 font-bold">{Math.ceil(questions.length * 0.3)}</div>
                    <div className="text-gray-600">Sadə</div>
                  </div>
                  <div className="text-center">
                    <div className="text-yellow-600 font-bold">{Math.ceil(questions.length * 0.5)}</div>
                    <div className="text-gray-600">Orta</div>
                  </div>
                  <div className="text-center">
                    <div className="text-red-600 font-bold">
                      {questions.length - Math.ceil(questions.length * 0.3) - Math.ceil(questions.length * 0.5)}
                    </div>
                    <div className="text-gray-600">Çətin</div>
                  </div>
                </div>
              </div>
            )}

            <div className="text-center space-y-4">
              <p className="text-gray-600">
                Test başladıqdan sonra {testConfig.timeLimit} dəqiqə vaxtınız olacaq. Bütün sualları cavablandırmağa
                çalışın.
              </p>
              <Button onClick={handleStartTest} size="lg" className="w-full">
                <Clock className="h-5 w-5 mr-2" />
                Testi Başlat
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const currentQuestion = questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 to-primary/10 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h1 className="text-xl font-bold">{testConfig.textbook}</h1>
                <p className="text-gray-600">{testConfig.topic}</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-red-600">{formatTime(timeLeft)}</div>
                <div className="text-sm text-gray-600">Qalan Vaxt</div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>
                  Sual {currentQuestionIndex + 1} / {questions.length}
                </span>
                <span>{Math.round(progress)}% tamamlandı</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          </CardContent>
        </Card>

        {/* Question */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg">Sual {currentQuestionIndex + 1}</CardTitle>
              <Badge className={getDifficultyColor(currentQuestion.difficulty)}>{currentQuestion.difficulty}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-lg mb-6">{currentQuestion.question}</p>
            <RadioGroup
              value={selectedAnswers[currentQuestion.id]?.toString() || ""}
              onValueChange={(value) => handleAnswerSelect(currentQuestion.id, Number.parseInt(value))}
            >
              {currentQuestion.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2 p-3 rounded-lg hover:bg-gray-50">
                  <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Navigation */}
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between">
              <Button variant="outline" onClick={handlePreviousQuestion} disabled={currentQuestionIndex === 0}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Əvvəlki
              </Button>

              <div className="flex space-x-2">
                {currentQuestionIndex === questions.length - 1 ? (
                  <Button onClick={handleTestComplete} className="bg-green-600 hover:bg-green-700">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Testi Bitir
                  </Button>
                ) : (
                  <Button onClick={handleNextQuestion}>
                    Növbəti
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
