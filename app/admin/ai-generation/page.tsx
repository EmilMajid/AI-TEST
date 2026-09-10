"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
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
  UserCheck,
  Settings,
  PlusCircle,
  Copy,
  Clock,
  AlertCircle,
  BarChart3,
  ListTodo,
  FileCheck2,
  Key,
  ShieldCheck,
} from "lucide-react"

// Types
export interface GitHubAccountProfile {
  id: string
  label: string
  username: string
  token: string
  owner: string
  repo: string
  branch: string
  operatorName: string
  operatorRole: string
  avatarUrl?: string
  isDefault?: boolean
}

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

interface AntigravityOrder {
  id: string
  createdAt: string
  grade: string
  textbook: string
  topics: string[]
  questionCount: number
  difficulty: string
  bloomLevel?: string
  questionType?: string
  notes?: string
  status: "pending" | "in_progress" | "completed" | "cancelled"
  account: {
    githubUsername: string
    repoOwner: string
    repoName: string
    branch: string
    operatorName?: string
    operatorRole?: string
  }
}

interface TopicStat {
  topic: string
  questionCount: number
  status: "full" | "partial" | "empty"
}

interface TextbookStat {
  textbook: string
  subject: string
  grade: string
  totalTopics: number
  coveredTopics: number
  emptyTopics: number
  totalQuestions: number
  topics: TopicStat[]
}

const DEFAULT_ACCOUNTS: GitHubAccountProfile[] = [
  {
    id: "acc-emil-main",
    label: "Əsas EmilMajid Hesabı",
    username: "EmilMajid",
    token: "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",
    owner: "EmilMajid",
    repo: "AI-TEST",
    branch: "main",
    operatorName: "Emil Məcidzadə",
    operatorRole: "Baş Administrator / İmtahan Rəhbəri",
    avatarUrl: "https://avatars.githubusercontent.com/u/198541055?v=4",
    isDefault: true,
  },
]

export default function AIGenerationPage() {
  const { toast } = useToast()

  // --- Account State ---
  const [accounts, setAccounts] = useState<GitHubAccountProfile[]>(DEFAULT_ACCOUNTS)
  const [activeAccount, setActiveAccount] = useState<GitHubAccountProfile>(DEFAULT_ACCOUNTS[0])
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false)
  const [isValidatingToken, setIsValidatingToken] = useState(false)
  const [validationResult, setValidationResult] = useState<{ success: boolean; message: string; user?: any } | null>(null)

  // Account Form
  const [accountForm, setAccountForm] = useState({
    label: "",
    token: "",
    owner: "EmilMajid",
    repo: "AI-TEST",
    branch: "main",
    operatorName: "",
    operatorRole: "Metodist",
  })

  // --- Curriculum & Generation State ---
  const [grade, setGrade] = useState("2")
  const [textbooks, setTextbooks] = useState<TextbookOption[]>([])
  const [selectedTextbook, setSelectedTextbook] = useState("")
  const [topics, setTopics] = useState<string[]>([])
  const [selectedTopic, setSelectedTopic] = useState("")
  const [customTopic, setCustomTopic] = useState("")
  const [selectedMultipleTopics, setSelectedMultipleTopics] = useState<string[]>([])
  const [count, setCount] = useState("10")
  const [difficulty, setDifficulty] = useState("orta")
  const [questionType, setQuestionType] = useState("standart")
  const [bloomLevel, setBloomLevel] = useState("qarışıq")
  const [orderNotes, setOrderNotes] = useState("")

  // UI States
  const [activeTab, setActiveTab] = useState("orders")
  const [isLoadingCurriculum, setIsLoadingCurriculum] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isPushing, setIsPushing] = useState(false)
  const [questions, setQuestions] = useState<GeneratedQuestion[]>([])
  const [orders, setOrders] = useState<AntigravityOrder[]>([])
  const [isLoadingOrders, setIsLoadingOrders] = useState(false)
  const [isCreatingOrder, setIsCreatingOrder] = useState(false)
  const [curriculumStats, setCurriculumStats] = useState<TextbookStat[]>([])
  const [isLoadingStats, setIsLoadingStats] = useState(false)

  const [lastPushResult, setLastPushResult] = useState<{
    success: boolean
    commitSha?: string
    message: string
    addedCount?: number
    repoUrl?: string
  } | null>(null)

  // 1. Load accounts from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("antigravity_github_accounts")
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) {
          setAccounts(parsed)
          const activeId = localStorage.getItem("antigravity_active_account_id")
          const found = parsed.find((a: GitHubAccountProfile) => a.id === activeId)
          if (found) setActiveAccount(found)
          else setActiveAccount(parsed[0])
        }
      }
    } catch (e) {}
  }, [])

  // 2. Load orders
  const loadOrders = async () => {
    try {
      setIsLoadingOrders(true)
      const res = await fetch("/api/admin/antigravity/orders")
      const data = await res.json()
      if (data.success && Array.isArray(data.orders)) {
        setOrders(data.orders)
      }
    } catch (e) {
      console.error("Error loading orders:", e)
    } finally {
      setIsLoadingOrders(false)
    }
  }

  useEffect(() => {
    loadOrders()
  }, [])

  // 3. Load curriculum textbooks for selected grade
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
            setSelectedMultipleTopics(firstBook.topics?.slice(0, 3) || [])
          } else {
            setSelectedTextbook("")
            setTopics([])
            setSelectedTopic("")
            setSelectedMultipleTopics([])
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

  // 4. Load curriculum coverage stats
  const loadCoverageStats = async () => {
    try {
      setIsLoadingStats(true)
      const res = await fetch(`/api/admin/curriculum-stats?grade=${grade}&textbook=${encodeURIComponent(selectedTextbook)}`)
      const data = await res.json()
      if (data.success && Array.isArray(data.stats)) {
        setCurriculumStats(data.stats)
      }
    } catch (e) {
      console.error("Error loading stats:", e)
    } finally {
      setIsLoadingStats(false)
    }
  }

  useEffect(() => {
    if (activeTab === "stats" && selectedTextbook) {
      loadCoverageStats()
    }
  }, [activeTab, grade, selectedTextbook])

  // When textbook changes
  const handleTextbookChange = (bookTitle: string) => {
    setSelectedTextbook(bookTitle)
    const found = textbooks.find((b) => b.title === bookTitle)
    if (found) {
      setTopics(found.topics || [])
      setSelectedTopic(found.topics?.[0] || "")
      setSelectedMultipleTopics(found.topics?.slice(0, 3) || [])
    } else {
      setTopics([])
      setSelectedTopic("")
      setSelectedMultipleTopics([])
    }
  }

  // Toggle multiple topic selection
  const handleToggleTopic = (topicName: string) => {
    setSelectedMultipleTopics((prev) =>
      prev.includes(topicName) ? prev.filter((t) => t !== topicName) : [...prev, topicName]
    )
  }

  const handleSelectAllTopics = () => {
    if (selectedMultipleTopics.length === topics.length) {
      setSelectedMultipleTopics([])
    } else {
      setSelectedMultipleTopics([...topics])
    }
  }

  // --- Account Management Handlers ---
  const handleSwitchAccount = (account: GitHubAccountProfile) => {
    setActiveAccount(account)
    localStorage.setItem("antigravity_active_account_id", account.id)
    toast({
      title: "Hesab Dəyişdirildi! 🔄",
      description: `Aktiv profil: ${account.label} (@${account.username})`,
    })
    setIsAccountModalOpen(false)
  }

  const handleValidateNewToken = async () => {
    if (!accountForm.token.trim()) {
      toast({ title: "Xəta", description: "Token daxil edilməlidir", variant: "destructive" })
      return
    }
    setIsValidatingToken(true)
    setValidationResult(null)
    try {
      const res = await fetch("/api/admin/github/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: accountForm.token,
          owner: accountForm.owner,
          repo: accountForm.repo,
        }),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        setValidationResult({
          success: true,
          message: data.message,
          user: data.user,
        })
        setAccountForm((prev) => ({
          ...prev,
          operatorName: prev.operatorName || data.user.name || data.user.login,
        }))
        toast({ title: "Token Uğurla Təsdiqləndi! ✅", description: `GitHub İstifadəçisi: @${data.user.login}` })
      } else {
        setValidationResult({
          success: false,
          message: data.error || "Token təsdiqlənmədi",
        })
      }
    } catch (e: any) {
      setValidationResult({
        success: false,
        message: e.message || "Bağlantı xətası baş verdi",
      })
    } finally {
      setIsValidatingToken(false)
    }
  }

  const handleSaveAccount = () => {
    if (!accountForm.token.trim() || !accountForm.owner.trim() || !accountForm.repo.trim()) {
      toast({ title: "Xəta", description: "Zəhmət olmasa tələb olunan sahələri doldurun", variant: "destructive" })
      return
    }

    const username = validationResult?.user?.login || accountForm.owner
    const avatarUrl = validationResult?.user?.avatarUrl || `https://github.com/${username}.png`

    const newAcc: GitHubAccountProfile = {
      id: `acc-${Date.now()}`,
      label: accountForm.label.trim() || `${username} (${accountForm.repo})`,
      username,
      token: accountForm.token.trim(),
      owner: accountForm.owner.trim(),
      repo: accountForm.repo.trim(),
      branch: accountForm.branch.trim() || "main",
      operatorName: accountForm.operatorName.trim() || username,
      operatorRole: accountForm.operatorRole.trim() || "Metodist",
      avatarUrl,
    }

    const updated = [newAcc, ...accounts]
    setAccounts(updated)
    setActiveAccount(newAcc)
    localStorage.setItem("antigravity_github_accounts", JSON.stringify(updated))
    localStorage.setItem("antigravity_active_account_id", newAcc.id)

    toast({
      title: "Yeni Hesab Əlavə Edildi! 🎉",
      description: `${newAcc.label} aktiv hesab olaraq seçildi.`,
    })

    setAccountForm({
      label: "",
      token: "",
      owner: "EmilMajid",
      repo: "AI-TEST",
      branch: "main",
      operatorName: "",
      operatorRole: "Metodist",
    })
    setValidationResult(null)
    setIsAccountModalOpen(false)
  }

  const handleDeleteAccount = (id: string) => {
    if (accounts.length <= 1) {
      toast({ title: "Xəbərdarlıq", description: "Ən azı bir hesab saxlanmalıdır", variant: "destructive" })
      return
    }
    const filtered = accounts.filter((a) => a.id !== id)
    setAccounts(filtered)
    if (activeAccount.id === id) {
      setActiveAccount(filtered[0])
      localStorage.setItem("antigravity_active_account_id", filtered[0].id)
    }
    localStorage.setItem("antigravity_github_accounts", JSON.stringify(filtered))
    toast({ title: "Hesab silindi" })
  }

  // --- Antigravity Order Creation ---
  const handleCreateAntigravityOrder = async () => {
    const selectedTopicsList = selectedMultipleTopics.length > 0 ? selectedMultipleTopics : [selectedTopic]

    if (!selectedTextbook || selectedTopicsList.length === 0) {
      toast({ title: "Xəta", description: "Zəhmət olmasa dərslik və ən azı bir mövzu seçin", variant: "destructive" })
      return
    }

    setIsCreatingOrder(true)
    try {
      const res = await fetch("/api/admin/antigravity/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          grade,
          textbook: selectedTextbook,
          topics: selectedTopicsList,
          questionCount: Number(count) || 20,
          difficulty,
          questionType,
          bloomLevel,
          notes: orderNotes,
          account: {
            githubUsername: activeAccount.username,
            repoOwner: activeAccount.owner,
            repoName: activeAccount.repo,
            branch: activeAccount.branch,
            operatorName: activeAccount.operatorName,
            operatorRole: activeAccount.operatorRole,
          },
        }),
      })

      const data = await res.json()
      if (res.ok && data.success) {
        toast({
          title: "Sifariş Növbəyə Əlavə Edildi! 📋🚀",
          description: data.message,
        })
        setOrderNotes("")
        loadOrders()
      } else {
        throw new Error(data.error || "Sifariş yaradıla bilmədi")
      }
    } catch (e: any) {
      toast({ title: "Xəta", description: e.message, variant: "destructive" })
    } finally {
      setIsCreatingOrder(false)
    }
  }

  const handleDeleteOrder = async (orderId: string) => {
    try {
      const res = await fetch(`/api/admin/antigravity/orders?id=${orderId}`, { method: "DELETE" })
      const data = await res.json()
      if (res.ok && data.success) {
        setOrders((prev) => prev.filter((o) => o.id !== orderId))
        toast({ title: "Sifariş silindi" })
      }
    } catch (e) {}
  }

  const handleCopyOrderPrompt = (order: AntigravityOrder) => {
    const prompt = `[ANTIGRAVITY TEST ORDER #${order.id}]
Sinif: ${order.grade}-ci sinif
Dərslik: ${order.textbook}
Mövzular (${order.topics.length} ədəd):
${order.topics.map((t, i) => `  ${i + 1}. ${t}`).join("\n")}
Sual Sayı: ${order.questionCount}
Çətinlik: ${order.difficulty}
Sual Tipi: ${order.questionType}
Bloom Səviyyəsi: ${order.bloomLevel}
Hədəf GitHub: ${order.account.repoOwner}/${order.account.repo} (${order.account.branch})
Sifarişçi: ${order.account.operatorName} (${order.account.operatorRole})
Qeyd: ${order.notes || "Dərslik kurrikulum standartına 100% uyğun orijinal suallar tərtib edilsin."}`

    navigator.clipboard.writeText(prompt)
    toast({ title: "Sifariş Promptu Kopyalandı! 📋", description: "Antigravity dialoquna yapışdıra bilərsiniz." })
  }

  // --- Rapid Generation & In-place Review ---
  const effectiveTopic = customTopic.trim() || selectedTopic

  const handleGenerate = async () => {
    if (!selectedTextbook || !effectiveTopic) {
      toast({ title: "Xəta", description: "Zəhmət olmasa dərslik və mövzunu seçin.", variant: "destructive" })
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
          description: `${formatted.length} ədəd sual hazırlandı. Yoxlayıb GitHub-a göndərə bilərsiniz.`,
        })
      } else {
        throw new Error(data.error || "Suallar generasiya edilə bilmədi")
      }
    } catch (error: any) {
      toast({ title: "Xəta", description: error.message || "Generasiya zamanı xəta baş verdi", variant: "destructive" })
    } finally {
      setIsGenerating(false)
    }
  }

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

  // Push to GitHub with active account
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
          githubConfig: {
            token: activeAccount.token,
            owner: activeAccount.owner,
            repo: activeAccount.repo,
            branch: activeAccount.branch,
            operatorName: activeAccount.operatorName,
            operatorRole: activeAccount.operatorRole,
          },
        }),
      })

      const data = await res.json()
      if (res.ok && data.success) {
        setLastPushResult({
          success: true,
          commitSha: data.commitSha,
          message: data.message,
          addedCount: data.addedCount,
          repoUrl: data.repoUrl || `https://github.com/${activeAccount.owner}/${activeAccount.repo}`,
        })
        toast({
          title: "Möhtəşəm! 🚀",
          description: `Suallar ${activeAccount.owner}/${activeAccount.repo} repozitoriyasına push edildi! (Commit: ${data.commitSha || "tamamlandı"})`,
        })
      } else {
        throw new Error(data.error || "GitHub-a göndərilərkən xəta baş verdi")
      }
    } catch (err: any) {
      toast({ title: "Xəta", description: err.message || "GitHub-a göndərilərkən xəta baş verdi", variant: "destructive" })
    } finally {
      setIsPushing(false)
    }
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-4 sm:p-6">
      {/* Top Banner: Title & Account Switcher */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
              Aİ Test Fabriki & Antigravity Masası 🏭
            </h1>
            <Badge className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold">
              Avtomatlaşdırılmış
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Dərslik kurikulum standartlarına uyğun kütləvi test sifarişi verin, birbaşa GitHub-a commit/push edin.
          </p>
        </div>

        {/* Active Account Pill & Switcher Trigger */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-3 bg-white border border-slate-200 shadow-sm px-3.5 py-2 rounded-xl">
            {activeAccount.avatarUrl ? (
              <img
                src={activeAccount.avatarUrl}
                alt={activeAccount.username}
                className="w-8 h-8 rounded-full border border-indigo-200"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs">
                {activeAccount.username.slice(0, 2).toUpperCase()}
              </div>
            )}
            <div className="text-left">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-gray-900">@{activeAccount.username}</span>
                <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 border-green-300 bg-green-50 text-green-700 font-semibold">
                  Aktiv
                </Badge>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Repo: <code className="font-semibold text-slate-700">{activeAccount.owner}/{activeAccount.repo}</code> ({activeAccount.branch})
              </p>
            </div>
          </div>

          <Dialog open={isAccountModalOpen} onOpenChange={setIsAccountModalOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2 h-11 border-indigo-200 hover:border-indigo-300 hover:bg-indigo-50/50 text-indigo-700 font-semibold shadow-sm">
                <Settings className="h-4 w-4 text-indigo-600" />
                <span>Hesabı Dəyiş</span>
              </Button>
            </DialogTrigger>

            <DialogContent className="max-w-md sm:max-w-xl">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-lg">
                  <Key className="h-5 w-5 text-indigo-600" />
                  GitHub və Antigravity Hesab İdarəetməsi
                </DialogTitle>
                <DialogDescription className="text-xs">
                  Sifarişlərin və sualların göndəriləcəyi GitHub hesabını, tokenini və hədəf repozitoriyanı idarə edin.
                </DialogDescription>
              </DialogHeader>

              <Tabs defaultValue="list" className="w-full mt-2">
                <TabsList className="grid grid-cols-2 w-full">
                  <TabsTrigger value="list" className="text-xs font-semibold">Saxlanmış Hesablar ({accounts.length})</TabsTrigger>
                  <TabsTrigger value="add" className="text-xs font-semibold">+ Yeni Hesab Əlavə Et</TabsTrigger>
                </TabsList>

                {/* Tab: Saved Accounts List */}
                <TabsContent value="list" className="space-y-3 pt-3">
                  <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                    {accounts.map((acc) => {
                      const isActive = acc.id === activeAccount.id
                      return (
                        <div
                          key={acc.id}
                          className={`p-3.5 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                            isActive
                              ? "bg-indigo-50/70 border-indigo-300 ring-1 ring-indigo-300"
                              : "bg-white border-slate-200 hover:border-slate-300"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            {acc.avatarUrl ? (
                              <img src={acc.avatarUrl} alt={acc.username} className="w-10 h-10 rounded-full border" />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-700">
                                {acc.username.slice(0, 2).toUpperCase()}
                              </div>
                            )}
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-bold text-sm text-gray-900">{acc.label}</h4>
                                {isActive && (
                                  <Badge className="bg-indigo-600 text-white text-[10px] py-0 h-4">Aktiv Profil</Badge>
                                )}
                              </div>
                              <p className="text-xs text-slate-600 mt-0.5">
                                @{acc.username} • <code>{acc.owner}/{acc.repo}</code> ({acc.branch})
                              </p>
                              <p className="text-[11px] text-slate-400">
                                Operator: {acc.operatorName} ({acc.operatorRole})
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            {!isActive ? (
                              <Button
                                size="sm"
                                onClick={() => handleSwitchAccount(acc)}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs h-8 px-3 font-semibold"
                              >
                                Seç / Aktiv Et
                              </Button>
                            ) : (
                              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300 gap-1 text-xs">
                                <Check className="h-3.5 w-3.5" /> Aktivdir
                              </Badge>
                            )}
                            {accounts.length > 1 && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteAccount(acc.id)}
                                className="h-8 w-8 p-0 text-slate-400 hover:text-red-600"
                                title="Hesabı sil"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </TabsContent>

                {/* Tab: Add / Edit Account */}
                <TabsContent value="add" className="space-y-3 pt-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1 sm:col-span-2">
                      <Label className="text-xs font-semibold">Profil Ləqəbi / Adı</Label>
                      <Input
                        placeholder="Məs: EmilMajid Əsas Hesab"
                        value={accountForm.label}
                        onChange={(e) => setAccountForm({ ...accountForm, label: e.target.value })}
                        className="h-9 text-xs"
                      />
                    </div>

                    <div className="space-y-1 sm:col-span-2">
                      <Label className="text-xs font-semibold">GitHub Personal Access Token (PAT)</Label>
                      <div className="flex gap-2">
                        <Input
                          type="password"
                          placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                          value={accountForm.token}
                          onChange={(e) => setAccountForm({ ...accountForm, token: e.target.value })}
                          className="h-9 text-xs font-mono"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleValidateNewToken}
                          disabled={isValidatingToken || !accountForm.token.trim()}
                          className="text-xs shrink-0 h-9 font-semibold gap-1.5"
                        >
                          {isValidatingToken ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <ShieldCheck className="h-3.5 w-3.5 text-indigo-600" />}
                          Yoxla
                        </Button>
                      </div>
                      {validationResult && (
                        <div className={`p-2 mt-1.5 rounded-md text-xs flex items-center gap-1.5 ${validationResult.success ? "bg-green-50 text-green-800 border border-green-200" : "bg-red-50 text-red-800 border border-red-200"}`}>
                          {validationResult.success ? <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" /> : <AlertCircle className="h-4 w-4 text-red-600 shrink-0" />}
                          <span>{validationResult.message}</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-1">
                      <Label className="text-xs font-semibold">Repozitoriya Sahibi (Owner)</Label>
                      <Input
                        placeholder="EmilMajid"
                        value={accountForm.owner}
                        onChange={(e) => setAccountForm({ ...accountForm, owner: e.target.value })}
                        className="h-9 text-xs font-mono"
                      />
                    </div>

                    <div className="space-y-1">
                      <Label className="text-xs font-semibold">Repozitoriya Adı (Repo)</Label>
                      <Input
                        placeholder="AI-TEST"
                        value={accountForm.repo}
                        onChange={(e) => setAccountForm({ ...accountForm, repo: e.target.value })}
                        className="h-9 text-xs font-mono"
                      />
                    </div>

                    <div className="space-y-1">
                      <Label className="text-xs font-semibold">Şaxə (Branch)</Label>
                      <Input
                        placeholder="main"
                        value={accountForm.branch}
                        onChange={(e) => setAccountForm({ ...accountForm, branch: e.target.value })}
                        className="h-9 text-xs font-mono"
                      />
                    </div>

                    <div className="space-y-1">
                      <Label className="text-xs font-semibold">Operatorun Adı</Label>
                      <Input
                        placeholder="Emil Məcidzadə"
                        value={accountForm.operatorName}
                        onChange={(e) => setAccountForm({ ...accountForm, operatorName: e.target.value })}
                        className="h-9 text-xs"
                      />
                    </div>
                  </div>

                  <DialogFooter className="pt-2">
                    <Button
                      onClick={handleSaveAccount}
                      disabled={!accountForm.token.trim() || !accountForm.owner.trim() || !accountForm.repo.trim()}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-10 gap-2"
                    >
                      <PlusCircle className="h-4 w-4" />
                      Yadda Saxla və Aktiv Profil Et
                    </Button>
                  </DialogFooter>
                </TabsContent>
              </Tabs>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 max-w-xl bg-slate-100 p-1 rounded-xl">
          <TabsTrigger value="orders" className="gap-2 font-bold text-xs">
            <ListTodo className="h-4 w-4" />
            📋 Antigravity Sifariş Masası
          </TabsTrigger>
          <TabsTrigger value="instant" className="gap-2 font-bold text-xs">
            <Sparkles className="h-4 w-4 text-indigo-600" />
            ⚡ Sürətli Generasiya
          </TabsTrigger>
          <TabsTrigger value="stats" className="gap-2 font-bold text-xs">
            <BarChart3 className="h-4 w-4 text-emerald-600" />
            📊 Fənn və Mövzu Təftişi
          </TabsTrigger>
        </TabsList>

        {/* ========================================================================= */}
        {/* TAB 1: ANTIGRAVITY SİFARİŞ MASASI                                         */}
        {/* ========================================================================= */}
        <TabsContent value="orders" className="space-y-6 pt-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Sifariş Yaratma Formu */}
            <Card className="lg:col-span-5 h-fit border-indigo-100 shadow-sm">
              <CardHeader className="bg-gradient-to-r from-indigo-50/60 to-white pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-bold flex items-center gap-2 text-indigo-950">
                    <Wand2 className="h-5 w-5 text-indigo-600" />
                    Yeni Test Sifarişi Ver
                  </CardTitle>
                  <Badge variant="outline" className="text-[11px] bg-white border-indigo-200 text-indigo-700">
                    Avtomatlaşdırılmış
                  </Badge>
                </div>
                <CardDescription className="text-xs">
                  Antigravity agenti üçün kurrikuluma uyğun dəqiq test tapşırığı formalaşdırın.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-4 text-xs">
                {/* Sinif Seçimi */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">1. Sinif Səviyyəsi</Label>
                  <Select value={grade} onValueChange={setGrade}>
                    <SelectTrigger className="bg-white h-9 text-xs">
                      <SelectValue placeholder="Sinif seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((g) => (
                        <SelectItem key={g} value={String(g)} className="text-xs">
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
                    <SelectTrigger className="bg-white h-9 text-xs">
                      <SelectValue placeholder="Dərslik seçin" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                      {textbooks.map((b) => (
                        <SelectItem key={b.id || b.title} value={b.title} className="text-xs">
                          {b.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Çoxsaylı Mövzu Seçimi */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-semibold">3. Sifariş Mövzuları ({selectedMultipleTopics.length}/{topics.length})</Label>
                    <button
                      type="button"
                      onClick={handleSelectAllTopics}
                      className="text-[11px] text-indigo-600 hover:underline font-semibold"
                    >
                      {selectedMultipleTopics.length === topics.length ? "Seçimi təmizlə" : "Hamısını seç (Bütöv fənn)"}
                    </button>
                  </div>
                  <div className="border rounded-lg bg-white p-2 max-h-44 overflow-y-auto space-y-1">
                    {topics.length > 0 ? (
                      topics.map((t, idx) => {
                        const isChecked = selectedMultipleTopics.includes(t)
                        return (
                          <label
                            key={idx}
                            className={`flex items-start gap-2 p-1.5 rounded text-xs cursor-pointer transition-colors ${
                              isChecked ? "bg-indigo-50/80 text-indigo-950 font-medium" : "hover:bg-slate-50 text-slate-700"
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => handleToggleTopic(t)}
                              className="mt-0.5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            <span className="leading-tight">{t}</span>
                          </label>
                        )
                      })
                    ) : (
                      <p className="text-xs text-muted-foreground p-2">Mövzu tapılmadı</p>
                    )}
                  </div>
                </div>

                {/* Sual Sayı və Çətinlik */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs font-semibold">Sual Sayı</Label>
                    <Select value={count} onValueChange={setCount}>
                      <SelectTrigger className="bg-white h-9 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10">10 sual</SelectItem>
                        <SelectItem value="20">20 sual</SelectItem>
                        <SelectItem value="30">30 sual</SelectItem>
                        <SelectItem value="50">50 sual (Fəsil)</SelectItem>
                        <SelectItem value="100">100 sual (Bütöv Kitab)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs font-semibold">Çətinlik</Label>
                    <Select value={difficulty} onValueChange={setDifficulty}>
                      <SelectTrigger className="bg-white h-9 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sadə">Sadə</SelectItem>
                        <SelectItem value="orta">Orta</SelectItem>
                        <SelectItem value="çətin">Çətin</SelectItem>
                        <SelectItem value="qarışıq">Qarışıq (30/50/20%)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Sual Tipi və Bloom Taksonomiyası */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs font-semibold">Sual Tipi</Label>
                    <Select value={questionType} onValueChange={setQuestionType}>
                      <SelectTrigger className="bg-white h-9 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="standart">Standart (4 variant)</SelectItem>
                        <SelectItem value="ibtidai_3">İbtidai (A, B, C)</SelectItem>
                        <SelectItem value="situasiya">Mətn / Situasiya</SelectItem>
                        <SelectItem value="məntiq">Məntiqi Düşünmə</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs font-semibold">Bloom Səviyyəsi</Label>
                    <Select value={bloomLevel} onValueChange={setBloomLevel}>
                      <SelectTrigger className="bg-white h-9 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="qarışıq">Bütün səviyyələr</SelectItem>
                        <SelectItem value="bilmə">Bilmə / Yaddaş</SelectItem>
                        <SelectItem value="anlama">Anlama / İzah</SelectItem>
                        <SelectItem value="tətbiq">Tətbiqetmə</SelectItem>
                        <SelectItem value="təhlil">Təhlil / Analiz</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Xüsusi Metodik Qeydlər */}
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">Xüsusi Metodik Tələblər (İstəyə bağlı):</Label>
                  <Textarea
                    placeholder="Məs: Suallarda yalnız dərslik terminlərindən istifadə edilsin, elmi izahlar tam olsun..."
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    className="bg-white text-xs resize-none h-16"
                  />
                </div>

                {/* Sifarişçi Məlumatı Qutusu */}
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-1 text-slate-700">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-900">Sifarişçi Hesab:</span>
                    <Badge variant="outline" className="font-mono text-[10px] bg-white">
                      @{activeAccount.username}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Hədəf Repozitoriya: <strong>{activeAccount.owner}/{activeAccount.repo}</strong> ({activeAccount.branch})
                  </p>
                </div>
              </CardContent>
              <CardFooter className="pt-1">
                <Button
                  onClick={handleCreateAntigravityOrder}
                  disabled={isCreatingOrder || !selectedTextbook || selectedMultipleTopics.length === 0}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-11 gap-2 shadow-sm"
                >
                  {isCreatingOrder ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Sifariş Növbəyə Yazılır...
                    </>
                  ) : (
                    <>
                      <ListTodo className="h-4 w-4" />
                      📋 Sifarişi Növbəyə Əlavə Et ({selectedMultipleTopics.length} mövzu)
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>

            {/* Sifarişlər Növbəsi Siyahısı */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between bg-white p-3.5 rounded-xl border shadow-sm">
                <div>
                  <h3 className="font-bold text-sm text-gray-900 flex items-center gap-2">
                    <Clock className="h-4 w-4 text-indigo-600" />
                    Antigravity Sifarişlər Növbəsi ({orders.length})
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Antigravity agentinin icra etməsi üçün qeydə alınmış test sifarişləri
                  </p>
                </div>
                <Button variant="outline" size="sm" onClick={loadOrders} disabled={isLoadingOrders} className="h-8 gap-1.5 text-xs font-semibold">
                  <RefreshCw className={`h-3.5 w-3.5 ${isLoadingOrders ? "animate-spin" : ""}`} />
                  Yenilə
                </Button>
              </div>

              {orders.length > 0 ? (
                <div className="space-y-3">
                  {orders.map((ord) => (
                    <Card key={ord.id} className="border shadow-sm hover:border-indigo-200 transition-all bg-white">
                      <CardHeader className="py-3 px-4 bg-slate-50/70 border-b flex flex-row items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge className="bg-indigo-600 text-white font-mono text-xs">
                            {ord.id}
                          </Badge>
                          <Badge variant="outline" className="bg-white font-semibold text-xs text-slate-800">
                            {ord.grade}-ci sinif • {ord.textbook}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className="bg-amber-100 text-amber-800 border-amber-300 text-[11px] font-semibold gap-1">
                            <Clock className="h-3 w-3" /> Növbədədir
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteOrder(ord.id)}
                            className="h-7 w-7 p-0 text-slate-400 hover:text-red-600"
                            title="Sifarişi sil"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="p-4 space-y-3 text-xs">
                        <div>
                          <Label className="text-[11px] text-muted-foreground">Mövzular ({ord.topics.length} ədəd):</Label>
                          <div className="flex flex-wrap gap-1.5 mt-1">
                            {ord.topics.map((t, tIdx) => (
                              <Badge key={tIdx} variant="secondary" className="text-[11px] bg-indigo-50 text-indigo-900 border border-indigo-100">
                                {t}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-lg">
                          <div>
                            <span className="text-muted-foreground block">Sual Sayı:</span>
                            <strong className="text-slate-900">{ord.questionCount} sual</strong>
                          </div>
                          <div>
                            <span className="text-muted-foreground block">Çətinlik:</span>
                            <strong className="text-slate-900">{ord.difficulty}</strong>
                          </div>
                          <div>
                            <span className="text-muted-foreground block">Sual Tipi:</span>
                            <strong className="text-slate-900">{ord.questionType}</strong>
                          </div>
                          <div>
                            <span className="text-muted-foreground block">Hədəf Repo:</span>
                            <strong className="text-slate-900 font-mono text-[10px]">{ord.account.repoOwner}/{ord.account.repo}</strong>
                          </div>
                        </div>

                        {ord.notes && (
                          <p className="text-[11px] text-slate-600 italic bg-amber-50/50 p-2 rounded border border-amber-100">
                            <strong>Qeyd:</strong> {ord.notes}
                          </p>
                        )}
                      </CardContent>
                      <CardFooter className="py-2 px-4 bg-slate-50/50 border-t flex items-center justify-between">
                        <span className="text-[11px] text-muted-foreground">
                          Operator: <strong>{ord.account.operatorName}</strong> ({new Date(ord.createdAt).toLocaleDateString("az-AZ")})
                        </span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleCopyOrderPrompt(ord)}
                          className="h-8 gap-1.5 text-xs font-semibold text-indigo-700 border-indigo-200 hover:bg-indigo-50"
                        >
                          <Copy className="h-3.5 w-3.5" />
                          Antigravity Promptunu Kopyala
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="border-2 border-dashed border-slate-200 bg-slate-50/50 text-slate-500 min-h-[300px] flex flex-col items-center justify-center p-8 text-center">
                  <div className="bg-white p-3 rounded-full shadow-sm mb-2 text-indigo-600">
                    <ListTodo className="h-6 w-6" />
                  </div>
                  <h4 className="font-bold text-slate-800 text-sm">Hazırda aktiv sifariş yoxdur</h4>
                  <p className="text-xs text-slate-500 max-w-sm mt-1">
                    Sol paneldən istədiyiniz dərslik və mövzuları seçərək Antigravity üçün test generasiyası sifarişi verə bilərsiniz.
                  </p>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        {/* ========================================================================= */}
        {/* TAB 2: SÜRƏTLİ GENERASİYA VƏ REDAKTƏ (CANLI PUSH)                          */}
        {/* ========================================================================= */}
        <TabsContent value="instant" className="space-y-6 pt-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Form */}
            <Card className="lg:col-span-4 h-fit border-indigo-100 shadow-sm">
              <CardHeader className="bg-gradient-to-r from-indigo-50/50 to-white pb-4">
                <CardTitle className="text-base flex items-center gap-2">
                  <Layers className="h-5 w-5 text-indigo-600" />
                  Canlı Generasiya Parametrləri
                </CardTitle>
                <CardDescription className="text-xs">
                  Tək mövzu üzrə dərhal sual yaradıb ekranda yoxlayın
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-4 text-xs">
                {/* Sinif */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">1. Sinif Səviyyəsi</Label>
                  <Select value={grade} onValueChange={setGrade}>
                    <SelectTrigger className="bg-white h-9 text-xs">
                      <SelectValue placeholder="Sinif seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((g) => (
                        <SelectItem key={g} value={String(g)} className="text-xs">
                          {g}-ci sinif
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Dərslik */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold flex items-center justify-between">
                    <span>2. Dərslik / Fənn</span>
                    {isLoadingCurriculum && <RefreshCw className="h-3 w-3 animate-spin text-indigo-600" />}
                  </Label>
                  <Select value={selectedTextbook} onValueChange={handleTextbookChange} disabled={isLoadingCurriculum}>
                    <SelectTrigger className="bg-white h-9 text-xs">
                      <SelectValue placeholder="Dərslik seçin" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                      {textbooks.map((b) => (
                        <SelectItem key={b.id || b.title} value={b.title} className="text-xs">
                          {b.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Mövzu */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">3. Mövzu (Kurikulumdan)</Label>
                  {topics.length > 0 ? (
                    <Select value={selectedTopic} onValueChange={setSelectedTopic}>
                      <SelectTrigger className="bg-white h-9 text-xs">
                        <SelectValue placeholder="Mövzu seçin" />
                      </SelectTrigger>
                      <SelectContent className="max-h-60">
                        {topics.map((t, idx) => (
                          <SelectItem key={idx} value={t} className="text-xs">
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
                      className="bg-white h-9 text-xs"
                    />
                  )}
                </div>

                {/* Çətinlik və Say */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Çətinlik</Label>
                    <Select value={difficulty} onValueChange={setDifficulty}>
                      <SelectTrigger className="bg-white h-9 text-xs">
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

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Sual Sayı</Label>
                    <Select value={count} onValueChange={setCount}>
                      <SelectTrigger className="bg-white h-9 text-xs">
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

                {/* Göndəriləcək Hədəf Hesab */}
                <div className="p-2.5 bg-slate-50 border rounded-lg text-[11px] text-slate-600">
                  <span>Hədəf GitHub: </span>
                  <strong className="text-slate-900">@{activeAccount.username}</strong> ({activeAccount.owner}/{activeAccount.repo})
                </div>
              </CardContent>
              <CardFooter className="pt-1">
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

            {/* Sualların Redaktəsi və Push */}
            <div className="lg:col-span-8 space-y-4">
              {lastPushResult && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-xl flex items-center justify-between gap-3 text-green-900 animate-in fade-in">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-6 w-6 text-green-600 shrink-0" />
                    <div>
                      <p className="font-semibold text-sm">{lastPushResult.message}</p>
                      {lastPushResult.commitSha && (
                        <p className="text-xs text-green-700 mt-0.5">
                          Commit SHA: <code>{lastPushResult.commitSha}</code> • Vercel avtomatik yeniləyir.
                        </p>
                      )}
                    </div>
                  </div>
                  {lastPushResult.repoUrl && (
                    <a
                      href={lastPushResult.repoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-semibold text-green-800 hover:underline flex items-center gap-1 shrink-0"
                    >
                      GitHub-da bax <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              )}

              {questions.length > 0 ? (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border shadow-sm">
                    <div>
                      <h3 className="font-bold text-gray-900 flex items-center gap-2 text-sm">
                        <BookOpen className="h-4 w-4 text-indigo-600" />
                        {selectedTextbook} — {effectiveTopic}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {questions.length} ədəd sual hazırlandı. Redaktə edib birbaşa <strong>{activeAccount.owner}/{activeAccount.repo}</strong>-a göndərin.
                      </p>
                    </div>
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
                          🚀 GitHub-a Göndər (@{activeAccount.username})
                        </>
                      )}
                    </Button>
                  </div>

                  {/* Sual Kartları */}
                  <div className="space-y-3">
                    {questions.map((q, qIdx) => (
                      <Card key={q.id || qIdx} className="border shadow-sm hover:border-indigo-200 transition-all bg-white">
                        <CardHeader className="py-2.5 px-4 bg-slate-50/70 border-b flex flex-row items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="bg-white font-bold text-indigo-700 text-xs">
                              Sual {qIdx + 1}
                            </Badge>
                            <Badge variant="secondary" className="text-[10px]">
                              {q.difficulty || difficulty}
                            </Badge>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteQuestion(qIdx)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 h-7 px-2 text-xs gap-1"
                          >
                            <Trash2 className="h-3 w-3" /> Sil
                          </Button>
                        </CardHeader>
                        <CardContent className="p-3.5 space-y-3 text-xs">
                          <div>
                            <Label className="text-xs text-muted-foreground mb-1 block">Sualın Mətni:</Label>
                            <Textarea
                              value={q.text}
                              onChange={(e) => handleUpdateQuestion(qIdx, "text", e.target.value)}
                              className="text-xs font-medium resize-none min-h-[50px]"
                            />
                          </div>

                          <div className="space-y-1.5 pt-1">
                            <Label className="text-xs text-muted-foreground">Cavab Variantları (Düzgün olanı seçin):</Label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {q.options.map((opt, optIdx) => {
                                const isCorrect = optIdx === q.correctIndex
                                return (
                                  <div
                                    key={optIdx}
                                    className={`flex items-center gap-2 p-1.5 rounded-lg border text-xs transition-all ${
                                      isCorrect ? "bg-green-50/80 border-green-300 ring-1 ring-green-300" : "bg-white"
                                    }`}
                                  >
                                    <button
                                      type="button"
                                      onClick={() => handleUpdateQuestion(qIdx, "correctIndex", optIdx)}
                                      className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                                        isCorrect ? "bg-green-600 text-white" : "bg-slate-200 text-slate-700 hover:bg-slate-300"
                                      }`}
                                    >
                                      {String.fromCharCode(65 + optIdx)}
                                    </button>
                                    <Input
                                      value={opt}
                                      onChange={(e) => handleUpdateOption(qIdx, optIdx, e.target.value)}
                                      className="h-7 text-xs border-0 shadow-none p-1 bg-transparent"
                                    />
                                    {isCorrect && <Check className="h-3.5 w-3.5 text-green-600 shrink-0 mr-1" />}
                                  </div>
                                )
                              })}
                            </div>
                          </div>

                          <div>
                            <Label className="text-xs text-muted-foreground mb-1 block">Dərslikdən Elmi İzah:</Label>
                            <Input
                              value={q.explanation}
                              onChange={(e) => handleUpdateQuestion(qIdx, "explanation", e.target.value)}
                              className="text-xs h-7 bg-blue-50/40 border-blue-100 text-blue-900"
                            />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <div className="pt-2 flex justify-end">
                    <Button
                      onClick={handlePushToGithub}
                      disabled={isPushing || questions.length === 0}
                      className="bg-green-600 hover:bg-green-700 text-white font-bold gap-2 px-6 py-5 shadow-md"
                    >
                      {isPushing ? <RefreshCw className="h-4 w-4 animate-spin" /> : <UploadCloud className="h-4 w-4" />}
                      🚀 Təsdiqlə və GitHub-a Göndər (@{activeAccount.username})
                    </Button>
                  </div>
                </div>
              ) : (
                <Card className="border-2 border-dashed border-slate-200 bg-slate-50/50 text-slate-500 min-h-[400px] flex flex-col items-center justify-center p-8 text-center">
                  <div className="bg-white p-3.5 rounded-full shadow-sm mb-3 text-indigo-600">
                    <Wand2 className="h-7 w-7" />
                  </div>
                  <h3 className="text-base font-bold text-slate-800">Hələ heç bir test generasiya olunmayıb</h3>
                  <p className="text-xs text-slate-500 max-w-sm mt-1">
                    Sol paneldən <strong>Dərslik</strong> və <strong>Mövzu</strong>nu seçib <strong>"Süni İntellektlə Yarat"</strong> düyməsinə basın.
                  </p>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        {/* ========================================================================= */}
        {/* TAB 3: FƏNN VƏ MÖVZU TƏFTİŞİ (COVERAGE & GAP ANALYSIS)                    */}
        {/* ========================================================================= */}
        <TabsContent value="stats" className="space-y-6 pt-4">
          <Card className="border-slate-200 shadow-sm bg-white">
            <CardHeader className="pb-3 border-b">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <CardTitle className="text-base font-bold flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-emerald-600" />
                    Dərslik və Mövzu Əhatəlilik Təftişi (Bazada nə çatışmır?)
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Rəsmi kurrikulum mövzuları üzrə faktiki sual sayını təhlil edin və çatışmayan mövzuları dərhal sifariş edin.
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Select value={grade} onValueChange={setGrade}>
                    <SelectTrigger className="w-28 h-8 text-xs bg-white">
                      <SelectValue placeholder="Sinif" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((g) => (
                        <SelectItem key={g} value={String(g)} className="text-xs">
                          {g}-ci sinif
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button size="sm" variant="outline" onClick={loadCoverageStats} disabled={isLoadingStats} className="h-8 text-xs gap-1">
                    <RefreshCw className={`h-3.5 w-3.5 ${isLoadingStats ? "animate-spin" : ""}`} />
                    Yoxla
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              {curriculumStats.length > 0 ? (
                curriculumStats.map((stat, sIdx) => (
                  <div key={sIdx} className="space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-slate-50 rounded-xl border">
                      <div>
                        <h4 className="font-bold text-sm text-gray-900">{stat.textbook}</h4>
                        <p className="text-xs text-muted-foreground">
                          {stat.grade}-ci sinif • Cəmi {stat.totalTopics} mövzu • {stat.totalQuestions} sual bazada mövcuddur
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300 text-xs font-semibold">
                          Tam/Qismən: {stat.coveredTopics} mövzu
                        </Badge>
                        {stat.emptyTopics > 0 && (
                          <Badge className="bg-red-100 text-red-800 border-red-300 text-xs font-semibold">
                            Çatışmayan: {stat.emptyTopics} mövzu
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                      {stat.topics.map((t, tIdx) => (
                        <div
                          key={tIdx}
                          className={`p-3 rounded-lg border text-xs flex items-center justify-between gap-2 ${
                            t.status === "full"
                              ? "bg-green-50/50 border-green-200"
                              : t.status === "partial"
                              ? "bg-amber-50/50 border-amber-200"
                              : "bg-red-50/50 border-red-200"
                          }`}
                        >
                          <div className="min-w-0 flex-1">
                            <p className="font-semibold text-gray-900 truncate" title={t.topic}>
                              {t.topic}
                            </p>
                            <span className="text-[11px] text-muted-foreground">
                              {t.questionCount > 0 ? `${t.questionCount} sual bazada` : "Test yoxdur (0 sual)"}
                            </span>
                          </div>
                          {t.questionCount === 0 && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedTextbook(stat.textbook)
                                setSelectedMultipleTopics([t.topic])
                                setActiveTab("orders")
                                toast({ title: "Mövzu Sifariş Masasına Əlavə Edildi! 📋", description: t.topic })
                              }}
                              className="text-[10px] h-7 px-2 font-bold text-red-700 border-red-300 hover:bg-red-100 shrink-0"
                            >
                              Sifariş Et
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-12 text-center text-slate-500 text-xs">
                  {isLoadingStats ? "Baza təftiş olunur..." : "Dərslik seçərək təftiş məlumatlarını əldə edin."}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
