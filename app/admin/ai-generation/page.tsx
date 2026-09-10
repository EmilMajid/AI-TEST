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
  Settings,
  PlusCircle,
  Copy,
  Clock,
  AlertCircle,
  BarChart3,
  ListTodo,
  Bot,
  Key,
  ShieldCheck,
  Cpu,
  User,
} from "lucide-react"

// Types
export interface AntigravityAccountProfile {
  id: string
  label: string
  accountEmail: string
  apiKey: string
  model: string
  agentRole: string
  isDefault?: boolean
}

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
  antigravityAccount?: {
    label: string
    accountEmail?: string
    model: string
    agentRole: string
  }
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

// Defaults
const DEFAULT_ANTIGRAVITY_ACCOUNTS: AntigravityAccountProfile[] = [
  {
    id: "ag-gemini-31-pro",
    label: "Gemini 3.1 Pro (Əsas Agent Modeli)",
    accountEmail: "emilinpoctu@gmail.com",
    apiKey: "",
    model: "gemini-3.1-pro",
    agentRole: "Dərin Mühakimə & Kurikulum Baş Metodisti",
    isDefault: true,
  },
  {
    id: "ag-gemini-38-flash",
    label: "Gemini 3.8 Flash (Ultra Sürət & Performans)",
    accountEmail: "emilinpoctu@gmail.com",
    apiKey: "",
    model: "gemini-3.8-flash",
    agentRole: "Sürətli Test İstehsalatı Agenti",
  },
  {
    id: "ag-gemini-37-flash",
    label: "Gemini 3.7 Flash (Skriptlər & Məlumat)",
    accountEmail: "emilinpoctu@gmail.com",
    apiKey: "",
    model: "gemini-3.7-flash",
    agentRole: "Məlumat Təmizləmə & Operativ Analitik",
  },
  {
    id: "ag-claude-sonnet-46",
    label: "Claude Sonnet 4.6 (thinking)",
    accountEmail: "emilinpoctu@gmail.com",
    apiKey: "",
    model: "claude-sonnet-4.6-thinking",
    agentRole: "Dərin Refaktorinq & Analitik Sual Eksperti",
  },
  {
    id: "ag-claude-opus-46",
    label: "Claude Opus 4.6 (thinking)",
    accountEmail: "emilinpoctu@gmail.com",
    apiKey: "",
    model: "claude-opus-4.6-thinking",
    agentRole: "Sistem Memarlığı & Ağır Tapşırıqlar",
  },
  {
    id: "ag-gpt-oss",
    label: "GPT-OSS-120b (Açıq Mənbəli)",
    accountEmail: "emilinpoctu@gmail.com",
    apiKey: "",
    model: "gpt-oss-120b",
    agentRole: "Sərbəst Mühakimə & Kodlaşdırma",
  },
]

const DEFAULT_GITHUB_ACCOUNTS: GitHubAccountProfile[] = [
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

  // --- Antigravity Accounts State ---
  const [agAccounts, setAgAccounts] = useState<AntigravityAccountProfile[]>(DEFAULT_ANTIGRAVITY_ACCOUNTS)
  const [activeAgAccount, setActiveAgAccount] = useState<AntigravityAccountProfile>(DEFAULT_ANTIGRAVITY_ACCOUNTS[0])
  const [isValidatingAgKey, setIsValidatingAgKey] = useState(false)
  const [agValidationResult, setAgValidationResult] = useState<{ success: boolean; message: string } | null>(null)
  const [agForm, setAgForm] = useState({
    label: "",
    accountEmail: "emilinpoctu@gmail.com",
    apiKey: "",
    model: "gemini-3.1-pro",
    agentRole: "Kurikulum və DİM Baş Metodisti",
  })

  // --- GitHub Accounts State ---
  const [ghAccounts, setGhAccounts] = useState<GitHubAccountProfile[]>(DEFAULT_GITHUB_ACCOUNTS)
  const [activeGhAccount, setActiveGhAccount] = useState<GitHubAccountProfile>(DEFAULT_GITHUB_ACCOUNTS[0])
  const [isValidatingGhToken, setIsValidatingGhToken] = useState(false)
  const [ghValidationResult, setGhValidationResult] = useState<{ success: boolean; message: string; user?: any } | null>(null)
  const [ghForm, setGhForm] = useState({
    label: "",
    token: "",
    owner: "EmilMajid",
    repo: "AI-TEST",
    branch: "main",
    operatorName: "",
    operatorRole: "Metodist",
  })

  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false)
  const [settingsTab, setSettingsTab] = useState("antigravity")

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

  // 0. Load Antigravity accounts from server API on mount
  useEffect(() => {
    async function fetchServerAgAccounts() {
      try {
        const res = await fetch("/api/admin/antigravity/accounts")
        const data = await res.json()
        if (data.success && Array.isArray(data.accounts) && data.accounts.length > 0) {
          setAgAccounts(data.accounts)
          if (data.activeAccount) {
            setActiveAgAccount(data.activeAccount)
            localStorage.setItem("antigravity_active_ai_account_id", data.activeAccount.id)
          }
          localStorage.setItem("antigravity_ai_accounts", JSON.stringify(data.accounts))
        }
      } catch (err) {
        console.warn("Server accounts fetch error", err)
      }
    }
    fetchServerAgAccounts()
  }, [])

  // 1. Load accounts from localStorage
  useEffect(() => {
    try {
      // Load Antigravity accounts
      const savedAg = localStorage.getItem("antigravity_ai_accounts")
      if (savedAg) {
        const parsedAg = JSON.parse(savedAg)
        if (Array.isArray(parsedAg) && parsedAg.length > 0) {
          setAgAccounts(parsedAg)
          const activeAgId = localStorage.getItem("antigravity_active_ai_account_id")
          const foundAg = parsedAg.find((a: AntigravityAccountProfile) => a.id === activeAgId)
          if (foundAg) setActiveAgAccount(foundAg)
          else setActiveAgAccount(parsedAg[0])
        }
      }

      // Load GitHub accounts
      const savedGh = localStorage.getItem("antigravity_github_accounts")
      if (savedGh) {
        const parsedGh = JSON.parse(savedGh)
        if (Array.isArray(parsedGh) && parsedGh.length > 0) {
          setGhAccounts(parsedGh)
          const activeGhId = localStorage.getItem("antigravity_active_account_id")
          const foundGh = parsedGh.find((a: GitHubAccountProfile) => a.id === activeGhId)
          if (foundGh) setActiveGhAccount(foundGh)
          else setActiveGhAccount(parsedGh[0])
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

  // --- Antigravity Account Handlers ---
  const handleSwitchAgAccount = async (acc: AntigravityAccountProfile) => {
    setActiveAgAccount(acc)
    localStorage.setItem("antigravity_active_ai_account_id", acc.id)
    try {
      await fetch("/api/admin/antigravity/accounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "switch", id: acc.id }),
      })
    } catch (e) {}
    toast({
      title: "Google Antigravity Hesabı Dəyişdirildi! 🤖🔄",
      description: `Aktiv Google Hesabı: ${acc.accountEmail} (${acc.label} • ${acc.model})`,
    })
  }

  const handleValidateAgKey = async () => {
    if (!agForm.apiKey.trim()) {
      toast({ title: "Xəta", description: "API açarı daxil edilməlidir", variant: "destructive" })
      return
    }
    setIsValidatingAgKey(true)
    setAgValidationResult(null)
    try {
      const res = await fetch("/api/admin/antigravity/validate-key", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          apiKey: agForm.apiKey,
          model: agForm.model,
          accountEmail: agForm.accountEmail,
        }),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        setAgValidationResult({
          success: true,
          message: data.message,
        })
        toast({ title: "Antigravity Açarı Təsdiqləndi! 🤖✅", description: data.message })
      } else {
        setAgValidationResult({
          success: false,
          message: data.error || "Açar təsdiqlənmədi",
        })
      }
    } catch (e: any) {
      setAgValidationResult({ success: false, message: e.message || "Bağlantı xətası" })
    } finally {
      setIsValidatingAgKey(false)
    }
  }

  const handleSaveAgAccount = async () => {
    const email = agForm.accountEmail.trim() || "emilinpoctu@gmail.com"
    const newAg: AntigravityAccountProfile = {
      id: `ag-${Date.now()}`,
      label: agForm.label.trim() || `Google Antigravity (${email})`,
      accountEmail: email,
      apiKey: agForm.apiKey.trim(),
      model: agForm.model,
      agentRole: agForm.agentRole.trim() || "Kurikulum Baş Metodisti",
    }

    const updated = [newAg, ...agAccounts]
    setAgAccounts(updated)
    setActiveAgAccount(newAg)
    localStorage.setItem("antigravity_ai_accounts", JSON.stringify(updated))
    localStorage.setItem("antigravity_active_ai_account_id", newAg.id)

    try {
      await fetch("/api/admin/antigravity/accounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "save", account: newAg, makeActive: true }),
      })
    } catch (e) {}

    toast({
      title: "Google Antigravity Hesabı Əlavə Edildi və Aktiv Edildi! 🤖🎉",
      description: `${newAg.accountEmail} (${newAg.label}) hazırda aktivdir.`,
    })

    setAgForm({
      label: "",
      accountEmail: "emilinpoctu@gmail.com",
      apiKey: "",
      model: "gemini-3.1-pro",
      agentRole: "Kurikulum Baş Metodisti",
    })
    setAgValidationResult(null)
  }

  const handleDeleteAgAccount = async (id: string) => {
    if (agAccounts.length <= 1) {
      toast({ title: "Xəbərdarlıq", description: "Ən azı bir Google Antigravity hesabı qalmalıdır", variant: "destructive" })
      return
    }
    const filtered = agAccounts.filter((a) => a.id !== id)
    setAgAccounts(filtered)
    if (activeAgAccount.id === id) {
      setActiveAgAccount(filtered[0])
      localStorage.setItem("antigravity_active_ai_account_id", filtered[0].id)
    }
    localStorage.setItem("antigravity_ai_accounts", JSON.stringify(filtered))

    try {
      await fetch("/api/admin/antigravity/accounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete", id }),
      })
    } catch (e) {}

    toast({ title: "Google Antigravity hesabı silindi" })
  }

  // --- GitHub Account Handlers ---
  const handleSwitchGhAccount = (acc: GitHubAccountProfile) => {
    setActiveGhAccount(acc)
    localStorage.setItem("antigravity_active_account_id", acc.id)
    toast({
      title: "GitHub Hesabı Dəyişdirildi! 🐙🔄",
      description: `Aktiv profil: ${acc.label} (@${acc.username})`,
    })
  }

  const handleValidateGhToken = async () => {
    if (!ghForm.token.trim()) {
      toast({ title: "Xəta", description: "GitHub token daxil edilməlidir", variant: "destructive" })
      return
    }
    setIsValidatingGhToken(true)
    setGhValidationResult(null)
    try {
      const res = await fetch("/api/admin/github/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: ghForm.token,
          owner: ghForm.owner,
          repo: ghForm.repo,
        }),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        setGhValidationResult({
          success: true,
          message: data.message,
          user: data.user,
        })
        setGhForm((prev) => ({
          ...prev,
          operatorName: prev.operatorName || data.user.name || data.user.login,
        }))
        toast({ title: "GitHub Token Təsdiqləndi! ✅", description: `@${data.user.login} (${ghForm.owner}/${ghForm.repo})` })
      } else {
        setGhValidationResult({
          success: false,
          message: data.error || "Token təsdiqlənmədi",
        })
      }
    } catch (e: any) {
      setGhValidationResult({ success: false, message: e.message || "Bağlantı xətası" })
    } finally {
      setIsValidatingGhToken(false)
    }
  }

  const handleSaveGhAccount = () => {
    if (!ghForm.token.trim() || !ghForm.owner.trim() || !ghForm.repo.trim()) {
      toast({ title: "Xəta", description: "Zəhmət olmasa tələb olunan sahələri doldurun", variant: "destructive" })
      return
    }

    const username = ghValidationResult?.user?.login || ghForm.owner
    const avatarUrl = ghValidationResult?.user?.avatarUrl || `https://github.com/${username}.png`

    const newAcc: GitHubAccountProfile = {
      id: `acc-${Date.now()}`,
      label: ghForm.label.trim() || `${username} (${ghForm.repo})`,
      username,
      token: ghForm.token.trim(),
      owner: ghForm.owner.trim(),
      repo: ghForm.repo.trim(),
      branch: ghForm.branch.trim() || "main",
      operatorName: ghForm.operatorName.trim() || username,
      operatorRole: ghForm.operatorRole.trim() || "Metodist",
      avatarUrl,
    }

    const updated = [newAcc, ...ghAccounts]
    setGhAccounts(updated)
    setActiveGhAccount(newAcc)
    localStorage.setItem("antigravity_github_accounts", JSON.stringify(updated))
    localStorage.setItem("antigravity_active_account_id", newAcc.id)

    toast({
      title: "Yeni GitHub Hesabı Əlavə Edildi! 🎉",
      description: `${newAcc.label} aktiv profil seçildi.`,
    })

    setGhForm({
      label: "",
      token: "",
      owner: "EmilMajid",
      repo: "AI-TEST",
      branch: "main",
      operatorName: "",
      operatorRole: "Metodist",
    })
    setGhValidationResult(null)
  }

  const handleDeleteGhAccount = (id: string) => {
    if (ghAccounts.length <= 1) {
      toast({ title: "Xəbərdarlıq", description: "Ən azı bir GitHub hesabı saxlanmalıdır", variant: "destructive" })
      return
    }
    const filtered = ghAccounts.filter((a) => a.id !== id)
    setGhAccounts(filtered)
    if (activeGhAccount.id === id) {
      setActiveGhAccount(filtered[0])
      localStorage.setItem("antigravity_active_account_id", filtered[0].id)
    }
    localStorage.setItem("antigravity_github_accounts", JSON.stringify(filtered))
    toast({ title: "GitHub hesabı silindi" })
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
          antigravityAccount: {
            label: activeAgAccount.label,
            accountEmail: activeAgAccount.accountEmail,
            model: activeAgAccount.model,
            agentRole: activeAgAccount.agentRole,
          },
          account: {
            githubUsername: activeGhAccount.username,
            repoOwner: activeGhAccount.owner,
            repoName: activeGhAccount.repo,
            branch: activeGhAccount.branch,
            operatorName: activeGhAccount.operatorName,
            operatorRole: activeGhAccount.operatorRole,
          },
        }),
      })

      const data = await res.json()
      if (res.ok && data.success) {
        toast({
          title: "Sifariş Antigravity Növbəsinə Əlavə Edildi! 📋🚀",
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
    const prompt = `[ANTIGRAVITY Sİ TEST SİFARİŞİ #${order.id}]
Antigravity Agenti: ${order.antigravityAccount?.label || "Antigravity Pro"} (${order.antigravityAccount?.model || "gemini-1.5-pro-latest"})
İxtisaslaşma: ${order.antigravityAccount?.agentRole || "Kurikulum Baş Metodisti"}
Sinif: ${order.grade}-ci sinif
Dərslik: ${order.textbook}
Mövzular (${order.topics.length} ədəd):
${order.topics.map((t, i) => `  ${i + 1}. ${t}`).join("\n")}
Sual Sayı: ${order.questionCount}
Çətinlik: ${order.difficulty}
Sual Tipi: ${order.questionType}
Bloom Səviyyəsi: ${order.bloomLevel}
Hədəf GitHub: ${order.account.repoOwner}/${order.account.repoName} (${order.account.branch})
Operator: ${order.account.operatorName} (${order.account.operatorRole})
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
          forceAi: true,
          antigravityAccount: {
            apiKey: activeAgAccount.apiKey,
            model: activeAgAccount.model,
            agentRole: activeAgAccount.agentRole,
            accountEmail: activeAgAccount.accountEmail,
          },
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
          title: "Antigravity ilə Generasiya Uğurludur! 🤖",
          description: `${formatted.length} ədəd sual hazırlandı. Agent: ${activeAgAccount.label}`,
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
            token: activeGhAccount.token,
            owner: activeGhAccount.owner,
            repo: activeGhAccount.repo,
            branch: activeGhAccount.branch,
            operatorName: activeGhAccount.operatorName,
            operatorRole: activeGhAccount.operatorRole,
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
          repoUrl: data.repoUrl || `https://github.com/${activeGhAccount.owner}/${activeGhAccount.repo}`,
        })
        toast({
          title: "Möhtəşəm! 🚀",
          description: `Suallar ${activeGhAccount.owner}/${activeGhAccount.repo} repozitoriyasına push edildi! (Commit: ${data.commitSha || "tamamlandı"})`,
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
      {/* Top Header: Title & Dual Account Status (Antigravity & GitHub) */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
              Aİ Test Fabriki & Antigravity Masası 🏭
            </h1>
            <Badge className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold">
              Antigravity Sİ ilə
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Dərslik kurikulum standartlarına uyğun test sifarişi verin, Antigravity Sİ agenti ilə hazırlayın və GitHub-a push edin.
          </p>
        </div>

        {/* Dual Account Indicators & Switcher Trigger */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Active Google Antigravity Profile Card */}
          <div className="flex items-center gap-2.5 bg-gradient-to-r from-purple-50 via-indigo-50 to-blue-50 border border-purple-300/80 px-3 py-1.5 rounded-xl shadow-xs hover:border-purple-400 transition-all">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shrink-0 shadow-xs">
              <Bot className="h-4 w-4" />
            </div>
            <div className="text-left">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-purple-950 truncate max-w-[140px]">{activeAgAccount.label}</span>
                <Badge className="text-[9px] px-1.5 py-0 h-4 bg-purple-100 text-purple-800 border-purple-200 font-bold">
                  Google Sİ
                </Badge>
              </div>
              <p className="text-[10px] text-purple-700 font-mono truncate max-w-[180px]">
                <strong className="text-purple-900">{activeAgAccount.accountEmail}</strong> • {activeAgAccount.model.replace("-latest", "")}
              </p>
            </div>

            {/* Quick Switch Dropdown if multiple accounts exist */}
            {agAccounts.length > 1 && (
              <Select
                value={activeAgAccount.id}
                onValueChange={(val) => {
                  const found = agAccounts.find((a) => a.id === val)
                  if (found) handleSwitchAgAccount(found)
                }}
              >
                <SelectTrigger className="h-7 w-7 p-0 border-purple-200 bg-white hover:bg-purple-100/60 rounded-lg text-purple-700 shadow-none ml-1" title="Google Antigravity Hesabını Dəyiş">
                  <RefreshCw className="h-3.5 w-3.5 mx-auto" />
                </SelectTrigger>
                <SelectContent align="end" className="w-72">
                  <div className="px-2 py-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Google Antigravity Hesabı Seçin:
                  </div>
                  {agAccounts.map((acc) => (
                    <SelectItem key={acc.id} value={acc.id} className="text-xs">
                      <div className="flex flex-col text-left">
                        <span className="font-semibold text-slate-900">{acc.label}</span>
                        <span className="text-[10px] text-purple-700 font-mono">{acc.accountEmail} ({acc.model})</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setSettingsTab("antigravity")
                setIsSettingsModalOpen(true)
              }}
              className="h-7 px-2 text-[11px] font-bold text-purple-700 hover:bg-purple-100/80 hover:text-purple-950 rounded-lg shadow-none"
            >
              Hesabı Dəyiş 🔄
            </Button>
          </div>

          {/* Active GitHub Account Card */}
          <div className="flex items-center gap-2 bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-xs">
            {activeGhAccount.avatarUrl ? (
              <img src={activeGhAccount.avatarUrl} alt={activeGhAccount.username} className="w-7 h-7 rounded-full border shrink-0" />
            ) : (
              <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 font-bold text-[10px] shrink-0">
                GH
              </div>
            )}
            <div className="text-left">
              <div className="flex items-center gap-1">
                <span className="text-xs font-bold text-gray-900 font-mono">@{activeGhAccount.username}</span>
                <Badge variant="outline" className="text-[9px] px-1 py-0 h-3.5 border-green-300 bg-green-50 text-green-700 font-bold">
                  Repo
                </Badge>
              </div>
              <p className="text-[10px] text-slate-500 font-mono">
                {activeGhAccount.owner}/{activeGhAccount.repo}
              </p>
            </div>
          </div>

          {/* Unified Settings Modal Button */}
          <Dialog open={isSettingsModalOpen} onOpenChange={setIsSettingsModalOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2 h-10 border-indigo-200 hover:border-indigo-300 hover:bg-indigo-50/50 text-indigo-700 font-bold text-xs shadow-sm">
                <Settings className="h-4 w-4 text-indigo-600" />
                <span>Hesabları Dəyiş</span>
              </Button>
            </DialogTrigger>

            <DialogContent className="max-w-md sm:max-w-2xl max-h-[85vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-lg">
                  <Key className="h-5 w-5 text-indigo-600" />
                  Antigravity Sİ və GitHub Hesab İdarəetməsi
                </DialogTitle>
                <DialogDescription className="text-xs">
                  Testləri generasiya edən Antigravity Sİ profilini və hədəf GitHub repozitoriyasını seçin və ya yenisini əlavə edin.
                </DialogDescription>
              </DialogHeader>

              <Tabs value={settingsTab} onValueChange={setSettingsTab} className="w-full mt-2">
                <TabsList className="grid grid-cols-2 w-full">
                  <TabsTrigger value="antigravity" className="text-xs font-bold gap-1.5">
                    <Bot className="h-4 w-4 text-purple-600" />
                    🤖 Antigravity Sİ Hesabı ({agAccounts.length})
                  </TabsTrigger>
                  <TabsTrigger value="github" className="text-xs font-bold gap-1.5">
                    <GitBranch className="h-4 w-4 text-slate-700" />
                    🐙 GitHub Hesabı ({ghAccounts.length})
                  </TabsTrigger>
                </TabsList>

                {/* ========================================================= */}
                {/* SETTINGS TAB 1: ANTIGRAVITY HESABI DƏYİŞDİRMƏ             */}
                {/* ========================================================= */}
                <TabsContent value="antigravity" className="space-y-4 pt-3">
                  <div className="p-3 bg-purple-50/60 border border-purple-200 rounded-xl text-xs text-purple-900 flex items-start gap-2.5">
                    <Sparkles className="h-4 w-4 text-purple-600 shrink-0 mt-0.5" />
                    <p>
                      <strong>Antigravity Sİ Agenti:</strong> Test sualları birbaşa seçilmiş Antigravity hesabı və modeli ilə rəsmi dərsliklərdən hazırlanır. İstənilən Google/Antigravity profilini seçə və ya fərqli açar təyin edə bilərsiniz.
                    </p>
                  </div>

                  {/* Siyahı */}
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-slate-800">Saxlanmış Antigravity Profilləri:</Label>
                    <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                      {agAccounts.map((acc) => {
                        const isActive = acc.id === activeAgAccount.id
                        return (
                          <div
                            key={acc.id}
                            className={`p-3 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                              isActive
                                ? "bg-purple-50/80 border-purple-300 ring-1 ring-purple-300"
                                : "bg-white border-slate-200 hover:border-slate-300"
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white shrink-0">
                                <Bot className="h-4 w-4" />
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5">
                                  <h4 className="font-bold text-xs text-gray-900 truncate">{acc.label}</h4>
                                  {isActive && <Badge className="bg-purple-600 text-white text-[9px] py-0 h-4">Aktiv Agent</Badge>}
                                </div>
                                <p className="text-[11px] text-purple-800 font-mono mt-0.5">
                                  Model: <strong>{acc.model}</strong> • {acc.accountEmail}
                                </p>
                                <p className="text-[10px] text-slate-500 truncate">
                                  Rol: {acc.agentRole}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5 shrink-0">
                              {!isActive ? (
                                <Button
                                  size="sm"
                                  onClick={() => handleSwitchAgAccount(acc)}
                                  className="bg-purple-600 hover:bg-purple-700 text-white text-xs h-7 px-2.5 font-bold"
                                >
                                  Seç / Aktiv Et
                                </Button>
                              ) : (
                                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300 gap-1 text-[11px] font-bold">
                                  <Check className="h-3 w-3" /> Aktivdir
                                </Badge>
                              )}
                              {agAccounts.length > 1 && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteAgAccount(acc.id)}
                                  className="h-7 w-7 p-0 text-slate-400 hover:text-red-600"
                                  title="Profili sil"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Yeni Antigravity Hesabı Əlavə Et */}
                  <div className="border-t pt-3 space-y-3">
                    <Label className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <PlusCircle className="h-3.5 w-3.5 text-purple-600" />
                      Yeni Antigravity Hesabı Əlavə Et:
                    </Label>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                      <div className="space-y-1">
                        <Label className="text-[11px] font-semibold">Profil Adı / Ləqəb</Label>
                        <Input
                          placeholder="Məs: Antigravity Pro (DİM Hazırlıq)"
                          value={agForm.label}
                          onChange={(e) => setAgForm({ ...agForm, label: e.target.value })}
                          className="h-8 text-xs"
                        />
                      </div>

                      <div className="space-y-1">
                        <Label className="text-[11px] font-semibold">Google / Antigravity Hesab E-maili</Label>
                        <Input
                          placeholder="emilinpoctu@gmail.com"
                          value={agForm.accountEmail}
                          onChange={(e) => setAgForm({ ...agForm, accountEmail: e.target.value })}
                          className="h-8 text-xs"
                        />
                      </div>

                      <div className="space-y-1">
                        <Label className="text-[11px] font-semibold">Antigravity Sİ Modeli</Label>
                        <Select value={agForm.model} onValueChange={(v) => setAgForm({ ...agForm, model: v })}>
                          <SelectTrigger className="h-8 text-xs bg-white font-medium">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="max-h-80">
                            {/* Google Gemini Seriyası */}
                            <div className="px-2 py-1 text-[10px] font-bold text-indigo-900 bg-indigo-50/80 rounded uppercase tracking-wider">
                              Google Gemini Seriyası (Dərin Mühakimə & Sürət)
                            </div>
                            <SelectItem value="gemini-3.1-pro" className="text-xs">
                              🌟 Gemini 3.1 Pro — Əsas Agent Modeli (Mürəkkəb Memarlıq & Məntiq)
                            </SelectItem>
                            <SelectItem value="gemini-3.8-flash" className="text-xs">
                              ⚡ Gemini 3.8 Flash — Ən Son Ultra Sürət & Performans
                            </SelectItem>
                            <SelectItem value="gemini-3.7-flash" className="text-xs">
                              ⚡ Gemini 3.7 Flash — Sürətli Skriptlər & Məlumat Təmizləmə
                            </SelectItem>
                            <SelectItem value="gemini-3.6-flash" className="text-xs">
                              ⚡ Gemini 3.6 Flash — Operativ Sual & Kod Tamamlama
                            </SelectItem>

                            {/* Anthropic Claude Seriyası */}
                            <div className="px-2 py-1 mt-1 text-[10px] font-bold text-amber-900 bg-amber-50/80 rounded uppercase tracking-wider">
                              Anthropic Claude Seriyası (Thinking)
                            </div>
                            <SelectItem value="claude-sonnet-4.6-thinking" className="text-xs">
                              🧠 Claude Sonnet 4.6 (thinking) — Dərin Refaktorinq & Analiz
                            </SelectItem>
                            <SelectItem value="claude-opus-4.6-thinking" className="text-xs">
                              🏛️ Claude Opus 4.6 (thinking) — Sistem Memarlığı & Ağır Tapşırıqlar
                            </SelectItem>

                            {/* Açıq Mənbəli Modellər */}
                            <div className="px-2 py-1 mt-1 text-[10px] font-bold text-emerald-900 bg-emerald-50/80 rounded uppercase tracking-wider">
                              Açıq Mənbəli Modellər
                            </div>
                            <SelectItem value="gpt-oss-120b" className="text-xs">
                              🌐 GPT-OSS-120b — OpenAI Arxitekturalı Açıq Mənbəli Model
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        {/* Avtomatik Köməkçi Model Bildirişi */}
                        <div className="p-2 bg-purple-50/50 border border-purple-100 rounded text-[10px] text-purple-900 flex items-start gap-1.5 mt-1">
                          <Sparkles className="h-3 w-3 text-purple-600 shrink-0 mt-0.5" />
                          <span>
                            <strong>Avtomatik Köməkçi:</strong> <strong>Nano Banana 2</strong> təsvir modeli interfeys maketləri, sistem diaqramları və vizual şəkillər üçün arxa fonda avtomatik işə salınır.
                          </span>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <Label className="text-[11px] font-semibold">Agent İxtisaslaşması / Rolu</Label>
                        <Input
                          placeholder="Kurikulum və DİM Baş Metodisti"
                          value={agForm.agentRole}
                          onChange={(e) => setAgForm({ ...agForm, agentRole: e.target.value })}
                          className="h-8 text-xs"
                        />
                      </div>

                      <div className="space-y-1 sm:col-span-2">
                        <Label className="text-[11px] font-semibold">Antigravity / Gemini API Açarı (AIzaSy...)</Label>
                        <div className="flex gap-2">
                          <Input
                            type="password"
                            placeholder="AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
                            value={agForm.apiKey}
                            onChange={(e) => setAgForm({ ...agForm, apiKey: e.target.value })}
                            className="h-8 text-xs font-mono"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={handleValidateAgKey}
                            disabled={isValidatingAgKey || !agForm.apiKey.trim()}
                            className="text-xs shrink-0 h-8 font-bold gap-1"
                          >
                            {isValidatingAgKey ? <RefreshCw className="h-3 w-3 animate-spin" /> : <ShieldCheck className="h-3 w-3 text-purple-600" />}
                            Yoxla
                          </Button>
                        </div>
                        {agValidationResult && (
                          <div className={`p-2 mt-1 rounded text-xs flex items-center gap-1.5 ${agValidationResult.success ? "bg-green-50 text-green-800 border border-green-200" : "bg-red-50 text-red-800 border border-red-200"}`}>
                            {agValidationResult.success ? <CheckCircle2 className="h-3.5 w-3.5 text-green-600 shrink-0" /> : <AlertCircle className="h-3.5 w-3.5 text-red-600 shrink-0" />}
                            <span>{agValidationResult.message}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <Button
                      onClick={handleSaveAgAccount}
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold h-9 text-xs gap-1.5 shadow-sm"
                    >
                      <PlusCircle className="h-3.5 w-3.5" />
                      Antigravity Hesabını Yadda Saxla və Aktiv Et
                    </Button>
                  </div>
                </TabsContent>

                {/* ========================================================= */}
                {/* SETTINGS TAB 2: GITHUB HESABI DƏYİŞDİRMƏ                  */}
                {/* ========================================================= */}
                <TabsContent value="github" className="space-y-4 pt-3">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-slate-800">Saxlanmış GitHub Hesabları:</Label>
                    <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                      {ghAccounts.map((acc) => {
                        const isActive = acc.id === activeGhAccount.id
                        return (
                          <div
                            key={acc.id}
                            className={`p-3 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                              isActive
                                ? "bg-indigo-50/80 border-indigo-300 ring-1 ring-indigo-300"
                                : "bg-white border-slate-200 hover:border-slate-300"
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              {acc.avatarUrl ? (
                                <img src={acc.avatarUrl} alt={acc.username} className="w-8 h-8 rounded-full border shrink-0" />
                              ) : (
                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-xs text-slate-700 shrink-0">
                                  GH
                                </div>
                              )}
                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5">
                                  <h4 className="font-bold text-xs text-gray-900 truncate">{acc.label}</h4>
                                  {isActive && <Badge className="bg-indigo-600 text-white text-[9px] py-0 h-4">Aktiv Repo</Badge>}
                                </div>
                                <p className="text-[11px] text-slate-600 font-mono mt-0.5">
                                  @{acc.username} • {acc.owner}/{acc.repo} ({acc.branch})
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5 shrink-0">
                              {!isActive ? (
                                <Button
                                  size="sm"
                                  onClick={() => handleSwitchGhAccount(acc)}
                                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs h-7 px-2.5 font-bold"
                                >
                                  Seç / Aktiv Et
                                </Button>
                              ) : (
                                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300 gap-1 text-[11px] font-bold">
                                  <Check className="h-3 w-3" /> Aktivdir
                                </Badge>
                              )}
                              {ghAccounts.length > 1 && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteGhAccount(acc.id)}
                                  className="h-7 w-7 p-0 text-slate-400 hover:text-red-600"
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
                  </div>

                  {/* Yeni GitHub Hesabı */}
                  <div className="border-t pt-3 space-y-3">
                    <Label className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <PlusCircle className="h-3.5 w-3.5 text-indigo-600" />
                      Yeni GitHub Hesabı / Repozitoriya Əlavə Et:
                    </Label>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                      <div className="space-y-1">
                        <Label className="text-[11px] font-semibold">Hesab Ləqəbi</Label>
                        <Input
                          placeholder="Məs: EmilMajid Əsas Hesab"
                          value={ghForm.label}
                          onChange={(e) => setGhForm({ ...ghForm, label: e.target.value })}
                          className="h-8 text-xs"
                        />
                      </div>

                      <div className="space-y-1">
                        <Label className="text-[11px] font-semibold">Operator Adı</Label>
                        <Input
                          placeholder="Emil Məcidzadə"
                          value={ghForm.operatorName}
                          onChange={(e) => setGhForm({ ...ghForm, operatorName: e.target.value })}
                          className="h-8 text-xs"
                        />
                      </div>

                      <div className="space-y-1">
                        <Label className="text-[11px] font-semibold">Repozitoriya Sahibi (Owner)</Label>
                        <Input
                          placeholder="EmilMajid"
                          value={ghForm.owner}
                          onChange={(e) => setGhForm({ ...ghForm, owner: e.target.value })}
                          className="h-8 text-xs font-mono"
                        />
                      </div>

                      <div className="space-y-1">
                        <Label className="text-[11px] font-semibold">Repozitoriya Adı (Repo)</Label>
                        <Input
                          placeholder="AI-TEST"
                          value={ghForm.repo}
                          onChange={(e) => setGhForm({ ...ghForm, repo: e.target.value })}
                          className="h-8 text-xs font-mono"
                        />
                      </div>

                      <div className="space-y-1 sm:col-span-2">
                        <Label className="text-[11px] font-semibold">GitHub Personal Access Token (PAT)</Label>
                        <div className="flex gap-2">
                          <Input
                            type="password"
                            placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                            value={ghForm.token}
                            onChange={(e) => setGhForm({ ...ghForm, token: e.target.value })}
                            className="h-8 text-xs font-mono"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={handleValidateGhToken}
                            disabled={isValidatingGhToken || !ghForm.token.trim()}
                            className="text-xs shrink-0 h-8 font-bold gap-1"
                          >
                            {isValidatingGhToken ? <RefreshCw className="h-3 w-3 animate-spin" /> : <ShieldCheck className="h-3 w-3 text-indigo-600" />}
                            Yoxla
                          </Button>
                        </div>
                        {ghValidationResult && (
                          <div className={`p-2 mt-1 rounded text-xs flex items-center gap-1.5 ${ghValidationResult.success ? "bg-green-50 text-green-800 border border-green-200" : "bg-red-50 text-red-800 border border-red-200"}`}>
                            {ghValidationResult.success ? <CheckCircle2 className="h-3.5 w-3.5 text-green-600 shrink-0" /> : <AlertCircle className="h-3.5 w-3.5 text-red-600 shrink-0" />}
                            <span>{ghValidationResult.message}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <Button
                      onClick={handleSaveGhAccount}
                      disabled={!ghForm.token.trim() || !ghForm.owner.trim() || !ghForm.repo.trim()}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-9 text-xs gap-1.5 shadow-sm"
                    >
                      <PlusCircle className="h-3.5 w-3.5" />
                      GitHub Hesabını Yadda Saxla və Aktiv Et
                    </Button>
                  </div>
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
              <CardHeader className="bg-gradient-to-r from-purple-50/70 via-indigo-50/50 to-white pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-bold flex items-center gap-2 text-indigo-950">
                    <Wand2 className="h-5 w-5 text-purple-600" />
                    Yeni Test Sifarişi Ver
                  </CardTitle>
                  <Badge variant="outline" className="text-[11px] bg-white border-purple-200 text-purple-700 font-bold">
                    Antigravity Sİ
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

                {/* Aktiv Google Antigravity Hesabı Seçimi */}
                <div className="p-3.5 bg-gradient-to-r from-purple-50/80 via-indigo-50/60 to-blue-50/60 border border-purple-200 rounded-xl text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-purple-950 flex items-center gap-1.5">
                      <Bot className="h-4 w-4 text-purple-600" /> İcraçı Google Antigravity Hesabı:
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setSettingsTab("antigravity")
                        setIsSettingsModalOpen(true)
                      }}
                      className="text-[11px] font-bold text-purple-700 hover:text-purple-900 hover:underline flex items-center gap-1"
                    >
                      <PlusCircle className="h-3 w-3" /> Yeni Hesab Əlavə Et
                    </button>
                  </div>

                  <Select
                    value={activeAgAccount.id}
                    onValueChange={(val) => {
                      const found = agAccounts.find((a) => a.id === val)
                      if (found) handleSwitchAgAccount(found)
                    }}
                  >
                    <SelectTrigger className="bg-white h-8 text-xs border-purple-200 font-medium">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {agAccounts.map((acc) => (
                        <SelectItem key={acc.id} value={acc.id} className="text-xs">
                          <span className="font-bold text-purple-950">{acc.accountEmail}</span>
                          {" — "}
                          <span className="text-slate-600">{acc.label} ({acc.model.replace("-latest", "")})</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <div className="flex items-center justify-between text-[11px] text-slate-600 pt-1.5 border-t border-purple-100">
                    <span>Hədəf GitHub:</span>
                    <span className="font-mono font-semibold text-slate-800">{activeGhAccount.owner}/{activeGhAccount.repo} ({activeGhAccount.branch})</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-1">
                <Button
                  onClick={handleCreateAntigravityOrder}
                  disabled={isCreatingOrder || !selectedTextbook || selectedMultipleTopics.length === 0}
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold h-11 gap-2 shadow-sm"
                >
                  {isCreatingOrder ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Sifariş Növbəyə Yazılır...
                    </>
                  ) : (
                    <>
                      <ListTodo className="h-4 w-4" />
                      📋 Antigravity Sifarişi Yarat ({selectedMultipleTopics.length} mövzu)
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
                    <Clock className="h-4 w-4 text-purple-600" />
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
                    <Card key={ord.id} className="border shadow-sm hover:border-purple-200 transition-all bg-white">
                      <CardHeader className="py-3 px-4 bg-slate-50/70 border-b flex flex-row items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge className="bg-purple-600 text-white font-mono text-xs">
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
                              <Badge key={tIdx} variant="secondary" className="text-[11px] bg-purple-50 text-purple-900 border border-purple-100">
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
                            <strong className="text-slate-900 font-mono text-[10px]">{ord.account.repoOwner}/{ord.account.repoName}</strong>
                          </div>
                        </div>

                        {ord.antigravityAccount && (
                          <p className="text-[11px] text-purple-900 bg-purple-50/70 p-2 rounded border border-purple-100 flex items-center justify-between">
                            <span>Sİ Agenti: <strong>{ord.antigravityAccount.label}</strong> ({ord.antigravityAccount.model})</span>
                            <span className="text-purple-700">{ord.antigravityAccount.agentRole}</span>
                          </p>
                        )}

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
                          className="h-8 gap-1.5 text-xs font-semibold text-purple-700 border-purple-200 hover:bg-purple-50"
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
                  <div className="bg-white p-3 rounded-full shadow-sm mb-2 text-purple-600">
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
                  Tək mövzu üzrə Antigravity Sİ ilə sual yaradıb ekranda yoxlayın
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

                {/* Aktiv Agent və Hədəf Repo Məlumatı */}
                <div className="p-2.5 bg-slate-50 border rounded-lg text-[11px] text-slate-600 space-y-1">
                  <div>
                    <span>İcraçı Agent: </span>
                    <strong className="text-purple-900">{activeAgAccount.label}</strong> ({activeAgAccount.model.replace("-latest", "")})
                  </div>
                  <div>
                    <span>Hədəf GitHub: </span>
                    <strong className="text-slate-900">@{activeGhAccount.username}</strong> ({activeGhAccount.owner}/{activeGhAccount.repo})
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-1">
                <Button
                  onClick={handleGenerate}
                  disabled={isGenerating || !selectedTextbook || !effectiveTopic}
                  className="w-full gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-5"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Antigravity ilə Hazırlanır...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      Antigravity ilə Yarat
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
                        {questions.length} ədəd sual hazırlandı. Redaktə edib birbaşa <strong>{activeGhAccount.owner}/{activeGhAccount.repo}</strong>-a göndərin.
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
                          🚀 GitHub-a Göndər (@{activeGhAccount.username})
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
                      🚀 Təsdiqlə və GitHub-a Göndər (@{activeGhAccount.username})
                    </Button>
                  </div>
                </div>
              ) : (
                <Card className="border-2 border-dashed border-slate-200 bg-slate-50/50 text-slate-500 min-h-[400px] flex flex-col items-center justify-center p-8 text-center">
                  <div className="bg-white p-3.5 rounded-full shadow-sm mb-3 text-purple-600">
                    <Bot className="h-7 w-7" />
                  </div>
                  <h3 className="text-base font-bold text-slate-800">Hələ heç bir test generasiya olunmayıb</h3>
                  <p className="text-xs text-slate-500 max-w-sm mt-1">
                    Sol paneldən <strong>Dərslik</strong> və <strong>Mövzu</strong>nu seçib <strong>"Antigravity ilə Yarat"</strong> düyməsinə basın.
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
