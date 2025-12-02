"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BookOpen,
  Trophy,
  CheckCircle,
  XCircle,
  RotateCcw,
  Brain,
  TrendingUp,
  TrendingDown,
  Target,
  Lightbulb,
  ChevronDown,
  ChevronUp,
  Zap,
  Eye,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface Question {
  id: number
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
  difficulty: string
  topic: string
  bloomLevel: string
}

interface TestResults {
  testData: {
    textbook: string
    topic: string
    class: string
    difficulty: string
  }
  questions: Question[]
  answers: { [key: number]: number }
  score: number
  timeSpent: number
  completedAt: string
}

interface QuestionAnalysis {
  questionId: number
  isCorrect: boolean
  userAnswer: string
  correctAnswer: string
  aiExplanation: string
  improvementTips: string[]
  conceptsToReview: string[]
}

interface OverallAnalysis {
  strengths: string[]
  weaknesses: string[]
  recommendations: string[]
  studyPlan: string[]
  nextTopics: string[]
  bloomAnalysis: {
    [key: string]: {
      correct: number
      total: number
      percentage: number
    }
  }
  difficultyAnalysis: {
    [key: string]: {
      correct: number
      total: number
      percentage: number
    }
  }
}

interface TestAnalysis {
  questionAnalyses: QuestionAnalysis[]
  overallAnalysis: OverallAnalysis
  metadata: {
    analyzedAt: string
    provider: string
    totalQuestions: number
    correctAnswers: number
  }
}

export default function ResultsPage() {
  const router = useRouter()
  const [results, setResults] = useState<TestResults | null>(null)
  const [analysis, setAnalysis] = useState<TestAnalysis | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [showExplanations, setShowExplanations] = useState(false)
  const [expandedQuestions, setExpandedQuestions] = useState<Set<number>>(new Set())

  useEffect(() => {
    const storedResults = localStorage.getItem("testResults")
    if (storedResults) {
      const parsedResults = JSON.parse(storedResults)
      setResults(parsedResults)
      analyzeResults(parsedResults)
    } else {
      router.push("/dashboard")
    }
  }, [router])

  const analyzeResults = async (testResults: TestResults) => {
    setIsAnalyzing(true)
    try {
      console.log("🔍 AI təhlili başlayır...")

      const response = await fetch("/api/analyze-test-results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(testResults),
      })

      const data = await response.json()

      if (data.success) {
        setAnalysis(data.analysis)
        console.log("✅ AI təhlili tamamlandı:", data.provider)
      } else {
        console.error("❌ Təhlil xətası:", data.error)
      }
    } catch (error) {
      console.error("❌ Təhlil API xətası:", error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const toggleQuestionExpansion = (questionId: number) => {
    const newExpanded = new Set(expandedQuestions)
    if (newExpanded.has(questionId)) {
      newExpanded.delete(questionId)
    } else {
      newExpanded.add(questionId)
    }
    setExpandedQuestions(newExpanded)
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes} dəqiqə ${remainingSeconds} saniyə`
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreBadge = (score: number) => {
    if (score >= 80) return { text: "🏆 Əla", className: "bg-green-100 text-green-800" }
    if (score >= 60) return { text: "👍 Yaxşı", className: "bg-yellow-100 text-yellow-800" }
    return { text: "📚 Zəif", className: "bg-red-100 text-red-800" }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "sadə":
        return "bg-green-100 text-green-800"
      case "orta":
        return "bg-yellow-100 text-yellow-800"
      case "çətin":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getBloomColor = (bloomLevel: string) => {
    const colors = {
      bilmə: "bg-gray-100 text-gray-800",
      anlama: "bg-blue-100 text-blue-800",
      tətbiq: "bg-indigo-100 text-indigo-800",
      təhlil: "bg-purple-100 text-purple-800",
      qiymətləndirmə: "bg-pink-100 text-pink-800",
      yaratma: "bg-red-100 text-red-800",
    }
    return colors[bloomLevel as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  if (!results) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  const correctAnswers = results.questions.filter((q) => results.answers[q.id] === q.correctAnswer).length
  const scoreBadge = getScoreBadge(results.score)

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 to-primary/10">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 text-primary mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Test Nəticələri</h1>
                <p className="text-gray-600">
                  {results.testData.textbook} - {results.testData.topic}
                </p>
              </div>
            </div>
            <Link href="/dashboard">
              <Button>Dashboard-a qayıt</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Results Summary */}
        <Card className="mb-8">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Trophy className={`h-16 w-16 ${getScoreColor(results.score)}`} />
            </div>
            <CardTitle className="text-3xl">
              <span className={getScoreColor(results.score)}>{results.score}%</span>
            </CardTitle>
            <CardDescription className="text-lg">
              {results.testData.textbook} - {results.testData.topic}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-5 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-green-600">{correctAnswers}</div>
                <div className="text-sm text-gray-600">Düzgün</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-600">{results.questions.length - correctAnswers}</div>
                <div className="text-sm text-gray-600">Səhv</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">{formatTime(results.timeSpent)}</div>
                <div className="text-sm text-gray-600">Vaxt</div>
              </div>
              <div>
                <Badge className={getDifficultyColor(results.testData.difficulty)}>
                  {results.testData.difficulty.charAt(0).toUpperCase() + results.testData.difficulty.slice(1)}
                </Badge>
                <div className="text-sm text-gray-600 mt-1">Çətinlik</div>
              </div>
              <div>
                <Badge className={scoreBadge.className}>{scoreBadge.text}</Badge>
                <div className="text-sm text-gray-600 mt-1">Qiymət</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI Analysis Loading */}
        {isAnalyzing && (
          <Card className="mb-8">
            <CardContent className="p-8 text-center">
              <div className="flex items-center justify-center mb-4">
                <Brain className="h-8 w-8 text-purple-600 mr-3 animate-pulse" />
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
              </div>
              <h3 className="text-lg font-semibold mb-2">AI Təhlili Aparılır</h3>
              <p className="text-gray-600">Cavablarınız təhlil edilir və şəxsi tövsiyələr hazırlanır...</p>
            </CardContent>
          </Card>
        )}

        {/* AI Analysis Results */}
        {analysis && (
          <Tabs defaultValue="overview" className="mb-8">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Ümumi Təhlil</TabsTrigger>
              <TabsTrigger value="performance">Performans</TabsTrigger>
              <TabsTrigger value="questions">Sual Təhlili</TabsTrigger>
              <TabsTrigger value="recommendations">Tövsiyələr</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Strengths */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center text-green-600">
                      <TrendingUp className="h-5 w-5 mr-2" />
                      Güclü Tərəfləri
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {analysis.overallAnalysis.strengths.map((strength, index) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* Weaknesses */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center text-red-600">
                      <TrendingDown className="h-5 w-5 mr-2" />
                      Təkmilləşdirmə Sahələri
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {analysis.overallAnalysis.weaknesses.map((weakness, index) => (
                        <li key={index} className="flex items-start">
                          <Target className="h-4 w-4 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{weakness}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>

              {/* AI Provider Info */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {analysis.metadata.provider === "xai" && <Zap className="h-4 w-4 text-purple-600 mr-2" />}
                      {analysis.metadata.provider === "openai" && <Brain className="h-4 w-4 text-green-600 mr-2" />}
                      <span className="text-sm font-medium">
                        {analysis.metadata.provider === "xai" && "Grok AI tərəfindən təhlil edildi"}
                        {analysis.metadata.provider === "openai" && "OpenAI tərəfindən təhlil edildi"}
                        {analysis.metadata.provider === "fallback" && "Avtomatik təhlil sistemi"}
                      </span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {new Date(analysis.metadata.analyzedAt).toLocaleString("az-AZ")}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Performance Tab */}
            <TabsContent value="performance" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Bloom Analysis */}
                <Card>
                  <CardHeader>
                    <CardTitle>Bloom Taksonomiyası üzrə Performans</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {Object.entries(analysis.overallAnalysis.bloomAnalysis).map(
                      ([level, data]) =>
                        data.total > 0 && (
                          <div key={level}>
                            <div className="flex justify-between items-center mb-2">
                              <Badge className={getBloomColor(level)}>{level}</Badge>
                              <span className="text-sm font-medium">
                                {data.correct}/{data.total} ({data.percentage}%)
                              </span>
                            </div>
                            <Progress value={data.percentage} className="h-2" />
                          </div>
                        ),
                    )}
                  </CardContent>
                </Card>

                {/* Difficulty Analysis */}
                <Card>
                  <CardHeader>
                    <CardTitle>Çətinlik Səviyyəsi üzrə Performans</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {Object.entries(analysis.overallAnalysis.difficultyAnalysis).map(
                      ([difficulty, data]) =>
                        data.total > 0 && (
                          <div key={difficulty}>
                            <div className="flex justify-between items-center mb-2">
                              <Badge className={getDifficultyColor(difficulty)}>{difficulty}</Badge>
                              <span className="text-sm font-medium">
                                {data.correct}/{data.total} ({data.percentage}%)
                              </span>
                            </div>
                            <Progress value={data.percentage} className="h-2" />
                          </div>
                        ),
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Questions Tab */}
            <TabsContent value="questions" className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Sual-cavab Təhlili</h3>
                <Button variant="outline" onClick={() => setShowExplanations(!showExplanations)}>
                  <Eye className="h-4 w-4 mr-2" />
                  {showExplanations ? "İzahları Gizlət" : "İzahları Göstər"}
                </Button>
              </div>

              <div className="space-y-4">
                {results.questions.map((question, index) => {
                  const userAnswer = results.answers[question.id]
                  const isCorrect = userAnswer === question.correctAnswer
                  const questionAnalysis = analysis.questionAnalyses.find((qa) => qa.questionId === question.id)
                  const isExpanded = expandedQuestions.has(question.id)

                  return (
                    <Card
                      key={question.id}
                      className={`border-l-4 ${isCorrect ? "border-l-green-500" : "border-l-red-500"}`}
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-base flex items-center">
                              {isCorrect ? (
                                <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                              ) : (
                                <XCircle className="h-5 w-5 text-red-600 mr-2" />
                              )}
                              Sual {index + 1}
                            </CardTitle>
                            <p className="text-sm text-gray-600 mt-1">{question.question}</p>
                          </div>
                          <div className="flex items-center space-x-2 ml-4">
                            <Badge className={getDifficultyColor(question.difficulty)}>{question.difficulty}</Badge>
                            <Badge className={getBloomColor(question.bloomLevel)}>{question.bloomLevel}</Badge>
                            <Button variant="ghost" size="sm" onClick={() => toggleQuestionExpansion(question.id)}>
                              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                            </Button>
                          </div>
                        </div>
                      </CardHeader>

                      {isExpanded && (
                        <CardContent className="pt-0">
                          <div className="grid md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <span className="text-sm font-medium text-gray-600">Sizin cavabınız:</span>
                              <p className={`font-medium ${isCorrect ? "text-green-600" : "text-red-600"}`}>
                                {userAnswer !== undefined
                                  ? `${String.fromCharCode(65 + userAnswer)}) ${question.options[userAnswer]}`
                                  : "Cavab verilməyib"}
                              </p>
                            </div>
                            <div>
                              <span className="text-sm font-medium text-gray-600">Düzgün cavab:</span>
                              <p className="text-green-600 font-medium">
                                {String.fromCharCode(65 + question.correctAnswer)}){" "}
                                {question.options[question.correctAnswer]}
                              </p>
                            </div>
                          </div>

                          {questionAnalysis && (
                            <div className="space-y-4">
                              {/* AI Explanation */}
                              <div className="bg-blue-50 p-4 rounded-lg">
                                <h4 className="font-medium text-blue-800 mb-2 flex items-center">
                                  <Brain className="h-4 w-4 mr-2" />
                                  AI Təhlili
                                </h4>
                                <p className="text-blue-700 text-sm">{questionAnalysis.aiExplanation}</p>
                              </div>

                              {/* Improvement Tips */}
                              {questionAnalysis.improvementTips.length > 0 && (
                                <div className="bg-yellow-50 p-4 rounded-lg">
                                  <h4 className="font-medium text-yellow-800 mb-2 flex items-center">
                                    <Lightbulb className="h-4 w-4 mr-2" />
                                    Təkmilləşdirmə Tövsiyələri
                                  </h4>
                                  <ul className="text-yellow-700 text-sm space-y-1">
                                    {questionAnalysis.improvementTips.map((tip, tipIndex) => (
                                      <li key={tipIndex} className="flex items-start">
                                        <span className="mr-2">•</span>
                                        <span>{tip}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                              {/* Concepts to Review */}
                              {questionAnalysis.conceptsToReview.length > 0 && (
                                <div className="bg-purple-50 p-4 rounded-lg">
                                  <h4 className="font-medium text-purple-800 mb-2">Təkrar Edilməli Mövzular</h4>
                                  <div className="flex flex-wrap gap-2">
                                    {questionAnalysis.conceptsToReview.map((concept, conceptIndex) => (
                                      <Badge
                                        key={conceptIndex}
                                        variant="outline"
                                        className="text-purple-700 border-purple-300"
                                      >
                                        {concept}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}

                          {showExplanations && (
                            <div className="bg-gray-50 p-4 rounded-lg mt-4">
                              <h4 className="font-medium text-gray-800 mb-2">Əsas İzahat</h4>
                              <p className="text-gray-700 text-sm">{question.explanation}</p>
                            </div>
                          )}
                        </CardContent>
                      )}
                    </Card>
                  )
                })}
              </div>
            </TabsContent>

            {/* Recommendations Tab */}
            <TabsContent value="recommendations" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* General Recommendations */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Lightbulb className="h-5 w-5 text-yellow-600 mr-2" />
                      Ümumi Tövsiyələr
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {analysis.overallAnalysis.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start">
                          <div className="bg-yellow-100 rounded-full p-1 mr-3 mt-0.5">
                            <div className="w-2 h-2 bg-yellow-600 rounded-full"></div>
                          </div>
                          <span className="text-sm">{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* Study Plan */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <BookOpen className="h-5 w-5 text-blue-600 mr-2" />
                      Təkrar Planı
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {analysis.overallAnalysis.studyPlan.map((plan, index) => (
                        <li key={index} className="flex items-start">
                          <div className="bg-blue-100 rounded-full p-1 mr-3 mt-0.5">
                            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                          </div>
                          <span className="text-sm">{plan}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>

              {/* Next Topics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Target className="h-5 w-5 text-green-600 mr-2" />
                    Növbəti Öyrənilməli Mövzular
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4">
                    {analysis.overallAnalysis.nextTopics.map((topic, index) => (
                      <div key={index} className="bg-green-50 p-3 rounded-lg text-center">
                        <span className="text-sm font-medium text-green-800">{topic}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}

        {/* Actions */}
        <div className="flex justify-center space-x-4">
          <Link href="/dashboard">
            <Button size="lg">
              <RotateCcw className="h-5 w-5 mr-2" />
              Yeni Test
            </Button>
          </Link>
          <Button
            variant="outline"
            size="lg"
            onClick={() => {
              const currentTest = {
                textbook: results.testData.textbook,
                topic: results.testData.topic,
                class: results.testData.class,
                difficulty: results.testData.difficulty,
                questionCount: results.questions.length,
                timeLimit: 20,
              }
              localStorage.setItem("currentTest", JSON.stringify(currentTest))
              window.location.href = "/test"
            }}
          >
            🔄 Yenidən Başla
          </Button>
          <Button variant="outline" size="lg" onClick={() => window.print()}>
            🖨️ Nəticəni Çap Et
          </Button>
        </div>
      </main>
    </div>
  )
}
