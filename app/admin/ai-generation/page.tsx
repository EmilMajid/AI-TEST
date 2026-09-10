"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import {
  Wand2,
  Check,
  Trash2,
  RefreshCw,
  GitBranch,
  UploadCloud,
  BookOpen,
  Layers,
  Sparkles,
  ExternalLink,
  CheckCircle2,
} from "lucide-react"

interface GeneratedQuestion {
  id: string
  text: string
  options: string[]
  correctIndex: number
  explanation: string
  difficulty?: string
  bloomLevel?: string
}

interface TextbookOption {
  id: string
  title: string
  subject: string
  topics: string[]
}

export default function AIGenerationPage() {
  const { toast } = useToast()

  // Form states
  const [grade, setGrade] = useState("2")
  const [textbooks, setTextbooks] = useState<TextbookOption[]>([])
  const [selectedTextbook, setSelectedTextbook] = useState("")
  const [topics, setTopics] = useState<string[]>([])
  const [selectedTopic, setSelectedTopic] = useState("")
  const [customTopic, setCustomTopic] = useState("")
  const [count, setCount] = useState("10")
  const [difficulty, setDifficulty] = useState("orta")

  // Generation & Push states
  const [isLoadingCurriculum, setIsLoadingCurriculum] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isPushing, setIsPushing] = useState(false)
  const [questions, setQuestions] = useState<GeneratedQuestion[]>([])
  const [lastPushResult, setLastPushResult] = useState<{
    success: boolean
    commitSha?: string
    message: string
    addedCount?: number
  } | null>(null)

  // 1. Fetch curriculum textbooks for selected grade
  useEffect(() => {
    async function loadCurriculum() {
      setIsLoadingCurriculum(true)
      try {
        const res = await fetch(`/api/admin/curriculum-options?grade=${grade}`)
        const data = await res.json()
        if (data.success && Array.isArray(data.textbooks)) {
          setTextbooks(data.textbooks)
          if (data.textbooks.length > 0) {
            const firstBook = data.textbooks[0]
            setSelectedTextbook(firstBook.title)
            setTopics(firstBook.topics || [])
            setSelectedTopic(firstBook.topics?.[0] || "")
          } else {
            setSelectedTextbook("")
            setTopics([])
            setSelectedTopic("")
          }
        }
      } catch (e) {
        console.error("Error loading curriculum:", e)
      } finally {
        setIsLoadingCurriculum(false)
      }
    }
    loadCurriculum()
  }, [grade])

  // 2. When textbook changes, update topics
  const handleTextbookChange = (bookTitle: string) => {
    setSelectedTextbook(bookTitle)
    const found = textbooks.find((b) => b.title === bookTitle)
    if (found) {
      setTopics(found.topics || [])
      setSelectedTopic(found.topics?.[0] || "")
    } else {
      setTopics([])
      setSelectedTopic("")
    }
  }

  const effectiveTopic = customTopic.trim() || selectedTopic

  // 3. Generate Questions using RAG & Quality Gate
  const handleGenerate = async () => {
    if (!selectedTextbook || !effectiveTopic) {
      toast({
        title: "Xəta",
        description: "Zəhmət olmasa dərslik və mövzunu seçin.",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)
    setLastPushResult(null)

    try {
      const response = await fetch("/api/generate-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          textbook: selectedTextbook,
          topic: effectiveTopic,
          grade: grade,
          questionCount: Number.parseInt(count) || 10,
          difficulty: difficulty,
        }),
      })

      const data = await response.json()

      if (response.ok && Array.isArray(data.questions) && data.questions.length > 0) {
        const formatted: GeneratedQuestion[] = data.questions.map((q: any, idx: number) => ({
          id: String(q.id || idx + 1),
          text: q.question || q.text || "",
          options: Array.isArray(q.options) ? q.options : [],
          correctIndex: typeof q.correctAnswer === "number" ? q.correctAnswer : 0,
          explanation: q.explanation || "Dərslik kurrikulum standartına əsaslanan elmi izah.",
          difficulty: q.difficulty || difficulty,
          bloomLevel: q.bloomLevel || "anlama",
        }))

        setQuestions(formatted)
        toast({
          title: "Generasiya Uğurludur! 🤖",
          description: `${formatted.length} ədəd dərslik əsaslı sual hazırlandı. Yoxlayıb GitHub-a göndərə bilərsiniz.`,
        })
      } else {
        throw new Error(data.error || "Suallar generasiya edilə bilmədi")
      }
    } catch (error: any) {
      toast({
        title: "Xəta",
        description: error.message || "Generasiya zamanı xəta baş verdi",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  // 4. Edit question in place
  const handleUpdateQuestion = (idx: number, field: keyof GeneratedQuestion, value: any) => {
    setQuestions((prev) => {
      const updated = [...prev]
      updated[idx] = { ...updated[idx], [field]: value }
      return updated
    })
  }

  const handleUpdateOption = (qIdx: number, optIdx: number, val: string) => {
    setQuestions((prev) => {
      const updated = [...prev]
      const newOpts = [...updated[qIdx].options]
      newOpts[optIdx] = val
      updated[qIdx] = { ...updated[qIdx], options: newOpts }
      return updated
    })
  }

  const handleDeleteQuestion = (idx: number) => {
    setQuestions((prev) => prev.filter((_, i) => i !== idx))
    toast({ title: "Sual silindi" })
  }

  // 5. Commit and Push to GitHub
  const handlePushToGithub = async () => {
    if (questions.length === 0) {
      toast({ title: "Xəta", description: "Göndəriləcək sual yoxdur", variant: "destructive" })
      return
    }

    setIsPushing(true)
    try {
      const res = await fetch("/api/admin/push-to-github", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          grade,
          textbook: selectedTextbook,
          topic: effectiveTopic,
          questions,
        }),
      })

      const data = await res.json()
      if (res.ok && data.success) {
        setLastPushResult({
          success: true,
          commitSha: data.commitSha,
          message: data.message,
          addedCount: data.addedCount,
        })
        toast({
          title: "Möhtəşəm! 🚀",
          description: `Suallar bazaya yazıldı və GitHub-a commit/push edildi! (Commit: ${data.commitSha || "tamamlandı"})`,
        })
      } else {
        throw new Error(data.error || "GitHub-a göndərilərkən xəta baş verdi")
      }
    } catch (err: any) {
      toast({
        title: "Xəta",
        description: err.message || "GitHub-a göndərilərkən xəta baş verdi",
        variant: "destructive",
      })
    } finally {
      setIsPushing(false)
    }
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
              Aİ Test Fabriki 🏭
            </h1>
            <Badge className="bg-indigo-600 hover:bg-indigo-700 text-white">Avtomatlaşdırılmış</Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Rəsmi kurikulum dərsliklərindən RAG əsaslı elmi suallar generasiya edin və birbaşa GitHub-a push edin.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-lg text-xs text-slate-700">
          <GitBranch className="h-4 w-4 text-slate-500" />
          <span>Repozitoriya: <strong>EmilMajid/AI-TEST</strong></span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form: Parameters */}
        <Card className="lg:col-span-4 h-fit border-indigo-100 shadow-sm">
          <CardHeader className="bg-gradient-to-r from-indigo-50/50 to-white pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <Layers className="h-5 w-5 text-indigo-600" />
              Sifariş Parametrləri
            </CardTitle>
            <CardDescription className="text-xs">
              Sinif, dərslik və mövzunu kurikulum bazasından seçin
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            {/* Sinif Seçimi */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">1. Sinif Səviyyəsi</Label>
              <Select value={grade} onValueChange={setGrade}>
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Sinif seçin" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((g) => (
                    <SelectItem key={g} value={String(g)}>
                      {g}-ci sinif
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Dərslik Seçimi */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold flex items-center justify-between">
                <span>2. Dərslik / Fənn</span>
                {isLoadingCurriculum && <RefreshCw className="h-3 w-3 animate-spin text-indigo-600" />}
              </Label>
              <Select value={selectedTextbook} onValueChange={handleTextbookChange} disabled={isLoadingCurriculum}>
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Dərslik seçin" />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {textbooks.map((b) => (
                    <SelectItem key={b.id || b.title} value={b.title}>
                      {b.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Mövzu Seçimi */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">3. Mövzu (Kurikulumdan)</Label>
              {topics.length > 0 ? (
                <Select value={selectedTopic} onValueChange={setSelectedTopic}>
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Mövzu seçin" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    {topics.map((t, idx) => (
                      <SelectItem key={idx} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  placeholder="Mövzu adını daxil edin"
                  value={customTopic}
                  onChange={(e) => setCustomTopic(e.target.value)}
                  className="bg-white"
                />
              )}
            </div>

            {/* Xüsusi Mövzu Qeydi (Əgər siyahıda yoxdursa) */}
            {topics.length > 0 && (
              <div className="space-y-1">
                <Label className="text-[11px] text-muted-foreground">Fərqli xüsusi mövzu adı (istəyə bağlı):</Label>
                <Input
                  placeholder="Siyahıdan kənar mövzu daxil et..."
                  value={customTopic}
                  onChange={(e) => setCustomTopic(e.target.value)}
                  className="bg-white text-xs h-8"
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 pt-1">
              {/* Çətinlik */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Çətinlik</Label>
                <Select value={difficulty} onValueChange={setDifficulty}>
                  <SelectTrigger className="bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sadə">Sadə</SelectItem>
                    <SelectItem value="orta">Orta</SelectItem>
                    <SelectItem value="çətin">Çətin</SelectItem>
                    <SelectItem value="qarışıq">Qarışıq</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Sual Sayı */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Sual Sayı</Label>
                <Select value={count} onValueChange={setCount}>
                  <SelectTrigger className="bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 sual</SelectItem>
                    <SelectItem value="10">10 sual</SelectItem>
                    <SelectItem value="15">15 sual</SelectItem>
                    <SelectItem value="20">20 sual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
          <CardFooter className="pt-2">
            <Button
              onClick={handleGenerate}
              disabled={isGenerating || !selectedTextbook || !effectiveTopic}
              className="w-full gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-5"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  RAG Sualları Hazırlanır...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Süni İntellektlə Yarat
                </>
              )}
            </Button>
          </CardFooter>
        </Card>

        {/* Right Section: Question Review & Push */}
        <div className="lg:col-span-8 space-y-4">
          {/* Push Status Alert Banner */}
          {lastPushResult && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-xl flex items-center justify-between gap-3 text-green-900 animate-in fade-in">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-6 w-6 text-green-600 shrink-0" />
                <div>
                  <p className="font-semibold text-sm">{lastPushResult.message}</p>
                  {lastPushResult.commitSha && (
                    <p className="text-xs text-green-700 mt-0.5">
                      GitHub Commit ID: <code>{lastPushResult.commitSha}</code> • Vercel avtomatik deploy edir.
                    </p>
                  )}
                </div>
              </div>
              <a
                href="https://github.com/EmilMajid/AI-TEST"
                target="_blank"
                rel="noreferrer"
                className="text-xs font-semibold text-green-800 hover:underline flex items-center gap-1 shrink-0"
              >
                GitHub-da bax <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          )}

          {questions.length > 0 ? (
            <div className="space-y-4">
              {/* Action Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border shadow-sm">
                <div>
                  <h3 className="font-bold text-gray-900 flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-indigo-600" />
                    {selectedTextbook} — {effectiveTopic}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {questions.length} ədəd sual hazırlandı. Redaktə edib birbaşa GitHub-a göndərə bilərsiniz.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    onClick={handlePushToGithub}
                    disabled={isPushing || questions.length === 0}
                    className="bg-green-600 hover:bg-green-700 text-white font-bold gap-2 px-5 py-5 shadow-sm"
                  >
                    {isPushing ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        GitHub-a Göndərilir...
                      </>
                    ) : (
                      <>
                        <UploadCloud className="h-4 w-4" />
                        🚀 GitHub-a Göndər (Commit & Push)
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Questions List */}
              <div className="space-y-4">
                {questions.map((q, qIdx) => (
                  <Card key={q.id || qIdx} className="border shadow-sm hover:border-indigo-200 transition-all">
                    <CardHeader className="py-3 px-4 bg-slate-50/70 border-b flex flex-row items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-white font-bold text-indigo-700">
                          Sual {qIdx + 1}
                        </Badge>
                        <Badge variant="secondary" className="text-[11px]">
                          {q.difficulty || difficulty}
                        </Badge>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteQuestion(qIdx)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 px-2 text-xs gap-1"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Sil
                      </Button>
                    </CardHeader>
                    <CardContent className="p-4 space-y-3">
                      {/* Sualın mətni */}
                      <div>
                        <Label className="text-xs text-muted-foreground mb-1 block">Sualın Mətni:</Label>
                        <Textarea
                          value={q.text}
                          onChange={(e) => handleUpdateQuestion(qIdx, "text", e.target.value)}
                          className="text-sm font-medium resize-none min-h-[60px]"
                        />
                      </div>

                      {/* Variantlar */}
                      <div className="space-y-2 pt-1">
                        <Label className="text-xs text-muted-foreground">Cavab Variantları (Düzgün olanı seçin):</Label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {q.options.map((opt, optIdx) => {
                            const isCorrect = optIdx === q.correctIndex
                            return (
                              <div
                                key={optIdx}
                                className={`flex items-center gap-2 p-2 rounded-lg border text-sm transition-all ${
                                  isCorrect ? "bg-green-50/80 border-green-300 ring-1 ring-green-300" : "bg-white"
                                }`}
                              >
                                <button
                                  type="button"
                                  onClick={() => handleUpdateQuestion(qIdx, "correctIndex", optIdx)}
                                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                                    isCorrect
                                      ? "bg-green-600 text-white"
                                      : "bg-slate-200 text-slate-700 hover:bg-slate-300"
                                  }`}
                                  title="Düzgün cavab olaraq təyin et"
                                >
                                  {String.fromCharCode(65 + optIdx)}
                                </button>
                                <Input
                                  value={opt}
                                  onChange={(e) => handleUpdateOption(qIdx, optIdx, e.target.value)}
                                  className="h-8 text-xs border-0 shadow-none focus-visible:ring-1 p-1 bg-transparent"
                                />
                                {isCorrect && <Check className="h-4 w-4 text-green-600 shrink-0 mr-1" />}
                              </div>
                            )
                          })}
                        </div>
                      </div>

                      {/* İzah */}
                      <div>
                        <Label className="text-xs text-muted-foreground mb-1 block">Dərslikdən Elmi İzah:</Label>
                        <Input
                          value={q.explanation}
                          onChange={(e) => handleUpdateQuestion(qIdx, "explanation", e.target.value)}
                          className="text-xs h-8 bg-blue-50/50 border-blue-100 text-blue-900"
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Bottom Push Button */}
              <div className="pt-2 flex justify-end">
                <Button
                  onClick={handlePushToGithub}
                  disabled={isPushing || questions.length === 0}
                  className="bg-green-600 hover:bg-green-700 text-white font-bold gap-2 px-6 py-5 shadow-md"
                >
                  {isPushing ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      GitHub-a Göndərilir...
                    </>
                  ) : (
                    <>
                      <UploadCloud className="h-4 w-4" />
                      🚀 Təsdiqlə və GitHub-a Göndər (Commit & Push)
                    </>
                  )}
                </Button>
              </div>
            </div>
          ) : (
            <Card className="border-2 border-dashed border-slate-200 bg-slate-50/50 text-slate-500 min-h-[420px] flex flex-col items-center justify-center p-8 text-center">
              <div className="bg-white p-4 rounded-full shadow-sm mb-3 text-indigo-600">
                <Wand2 className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">Hələ heç bir test generasiya olunmayıb</h3>
              <p className="text-xs text-slate-500 max-w-sm mt-1">
                Sol paneldən istədiyiniz <strong>Sinif</strong>, <strong>Dərslik</strong> və <strong>Mövzu</strong>nu seçib{" "}
                <strong>"Süni İntellektlə Yarat"</strong> düyməsinə basın.
              </p>
              <div className="mt-4 flex items-center gap-4 text-xs text-slate-400">
                <span>✓ Şablonsuz RAG sualları</span>
                <span>•</span>
                <span>✓ Birbaşa GitHub Commit</span>
                <span>•</span>
                <span>✓ Vercel Auto-Deploy</span>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
