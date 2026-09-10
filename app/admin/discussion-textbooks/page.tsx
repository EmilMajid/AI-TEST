"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BookOpen,
  CheckCircle2,
  ExternalLink,
  FileText,
  RefreshCw,
  Sparkles,
  ArrowRight,
  History,
  RotateCcw,
  Layers,
  Search,
  BookCheck,
  AlertCircle,
  Database,
  ArrowUpRight,
  ShieldCheck,
  Zap,
} from "lucide-react"

interface DiscussionTextbook {
  id: string
  trimsId: string
  title: string
  officialTitle: string
  grade: string
  subject: string
  part?: string
  status: "discussion" | "promoted" | "archived"
  targetOfficialId: string
  pdfUrl: string
  coverUrl: string
  trimsUrl: string
  publisher: string
  ragIndexed: boolean
  ragChunkCount: number
  testCount: number
  topics: string[]
  createdAt: string
  promotedAt?: string
  lastBackupFile?: string
}

interface Stats {
  total: number
  grade7: number
  grade8: number
  grade9: number
  ragIndexedCount: number
  promotedCount: number
  discussionCount: number
}

export default function DiscussionTextbooksPage() {
  const [textbooks, setTextbooks] = useState<DiscussionTextbook[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedGrade, setSelectedGrade] = useState<string>("all")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")

  // Promotion modal state
  const [promoteModalOpen, setPromoteModalOpen] = useState(false)
  const [selectedBook, setSelectedBook] = useState<DiscussionTextbook | null>(null)
  const [replaceAction, setReplaceAction] = useState<"replace" | "add_alongside">("replace")
  const [promoting, setPromoting] = useState(false)
  const [promoteResult, setPromoteResult] = useState<any>(null)

  // Ingest state
  const [ingestingId, setIngestingId] = useState<string | null>(null)
  const [ingestSuccess, setIngestSuccess] = useState<string | null>(null)

  // Rollback state
  const [rollingBack, setRollingBack] = useState(false)
  const [rollbackSuccess, setRollbackSuccess] = useState<string | null>(null)

  const fetchBooks = async () => {
    try {
      setLoading(true)
      const res = await fetch("/api/admin/discussion-textbooks")
      const data = await res.json()
      if (data.success) {
        setTextbooks(data.textbooks || [])
        setStats(data.stats || null)
      }
    } catch (e) {
      console.error("Error fetching discussion textbooks:", e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBooks()
  }, [])

  const handlePromote = async () => {
    if (!selectedBook) return
    try {
      setPromoting(true)
      const res = await fetch("/api/admin/discussion-textbooks/promote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          discussionBookId: selectedBook.id,
          targetOfficialId: selectedBook.targetOfficialId,
          replaceAction,
        }),
      })
      const data = await res.json()
      if (data.success) {
        setPromoteResult(data)
        fetchBooks()
      } else {
        alert("Xəta: " + data.error)
      }
    } catch (e: any) {
      alert("Xəta baş verdi: " + e.message)
    } finally {
      setPromoting(false)
    }
  }

  const handleIngest = async (book: DiscussionTextbook) => {
    try {
      setIngestingId(book.id)
      setIngestSuccess(null)
      const res = await fetch("/api/admin/discussion-textbooks/ingest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ discussionBookId: book.id }),
      })
      const data = await res.json()
      if (data.success) {
        setIngestSuccess(`"${book.title}" üçün ${data.chunkCount} chunk indeksləndi!`)
        fetchBooks()
        setTimeout(() => setIngestSuccess(null), 5000)
      } else {
        alert("Xəta: " + data.error)
      }
    } catch (e: any) {
      alert("Xəta: " + e.message)
    } finally {
      setIngestingId(null)
    }
  }

  const handleRollback = async (backupFile: string, bookId?: string) => {
    if (!confirm(`Ehtiyat nüsxə (${backupFile}) əsasında əvvəlki rəsmi dərslik vəziyyətini bərpa etmək istədiyinizdən əminsiniz?`)) {
      return
    }
    try {
      setRollingBack(true)
      setRollbackSuccess(null)
      const res = await fetch("/api/admin/discussion-textbooks/rollback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ backupFile, discussionBookId: bookId }),
      })
      const data = await res.json()
      if (data.success) {
        setRollbackSuccess(data.message)
        fetchBooks()
        setTimeout(() => setRollbackSuccess(null), 6000)
      } else {
        alert("Xəta: " + data.error)
      }
    } catch (e: any) {
      alert("Xəta: " + e.message)
    } finally {
      setRollingBack(false)
    }
  }

  // Filtered list
  const filteredBooks = textbooks.filter((book) => {
    const matchesGrade = selectedGrade === "all" || String(book.grade) === selectedGrade
    const matchesStatus = selectedStatus === "all" || book.status === selectedStatus
    const matchesSearch =
      searchQuery === "" ||
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.topics.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))

    return matchesGrade && matchesStatus && matchesSearch
  })

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 border border-blue-200">
              TRİMS Portalı (f-2 kateqoriyası)
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-700 border border-purple-200">
              Təcrid Olunmuş Layihə Bazası
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
            İctimai Müzakirədə Olan Dərsliklər
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-3xl">
            Azərbaycan Respublikası Elm və Təhsil Nazirliyi tərəfindən ictimai müzakirəyə çıxarılmış yeni layihə dərslikləri.
            Rəsmi bazadan tam təcrid olunmuş şəkildə RAG emalı, test hazırlanması və bir kliklə rəsmi dərsliklərlə əvəzlənməsi.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button
            onClick={fetchBooks}
            variant="outline"
            size="sm"
            className="flex items-center gap-1.5"
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Yenilə
          </Button>

          <Link href="/admin/ai-generation">
            <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-1.5 shadow-sm">
              <Sparkles className="h-4 w-4" />
              Antigravity Sifariş Masası
            </Button>
          </Link>
        </div>
      </div>

      {/* Notifications */}
      {ingestSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl flex items-center gap-2 text-sm">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>{ingestSuccess}</span>
        </div>
      )}
      {rollbackSuccess && (
        <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-xl flex items-center gap-2 text-sm">
          <RotateCcw className="h-4 w-4 text-blue-600 shrink-0" />
          <span>{rollbackSuccess}</span>
        </div>
      )}

      {/* Top Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <Card className="bg-white border-slate-200/80 shadow-xs">
          <CardContent className="p-4">
            <p className="text-xs font-medium text-slate-500">Müzakirə Dərslikləri</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{stats?.total || 16}</p>
            <p className="text-[11px] text-blue-600 font-medium mt-0.5">TRİMS-dən çəkilib</p>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200/80 shadow-xs">
          <CardContent className="p-4">
            <p className="text-xs font-medium text-slate-500">7-ci Sinif</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{stats?.grade7 || 6}</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Riy, AzDili, Tarix</p>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200/80 shadow-xs">
          <CardContent className="p-4">
            <p className="text-xs font-medium text-slate-500">8-ci Sinif</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{stats?.grade8 || 4}</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Riy, AzDili</p>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200/80 shadow-xs">
          <CardContent className="p-4">
            <p className="text-xs font-medium text-slate-500">9-cu Sinif</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{stats?.grade9 || 6}</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Bio, Kimya, Coğrafiya</p>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200/80 shadow-xs">
          <CardContent className="p-4">
            <p className="text-xs font-medium text-slate-500">RAG İndekslənmiş</p>
            <p className="text-2xl font-bold text-emerald-600 mt-1">{stats?.ragIndexedCount || 0}</p>
            <p className="text-[11px] text-emerald-700 font-medium mt-0.5">Test üçün hazır</p>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200/80 shadow-xs">
          <CardContent className="p-4">
            <p className="text-xs font-medium text-slate-500">Rəsmi Dərslik Edilmiş</p>
            <p className="text-2xl font-bold text-purple-600 mt-1">{stats?.promotedCount || 0}</p>
            <p className="text-[11px] text-purple-700 font-medium mt-0.5">Aktiv tədrisdə</p>
          </CardContent>
        </Card>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {/* Grade tabs */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
            {["all", "7", "8", "9"].map((g) => (
              <button
                key={g}
                onClick={() => setSelectedGrade(g)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  selectedGrade === g
                    ? "bg-white text-slate-900 shadow-xs font-semibold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {g === "all" ? "Bütün Siniflər" : `${g}-ci sinif`}
              </button>
            ))}
          </div>

          {/* Status selector */}
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="h-8 text-xs w-[170px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Bütün Statuslar</SelectItem>
              <SelectItem value="discussion">🔬 Yalnız Müzakirədə</SelectItem>
              <SelectItem value="promoted">✅ Rəsmi Edilmişlər</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Dərslik, fənn və ya mövzu axtar..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 text-xs"
          />
        </div>
      </div>

      {/* Textbook Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredBooks.map((book) => (
          <Card
            key={book.id}
            className={`flex flex-col bg-white border transition-all hover:shadow-md ${
              book.status === "promoted"
                ? "border-purple-300 ring-1 ring-purple-100"
                : "border-slate-200"
            }`}
          >
            <CardHeader className="p-4 pb-2">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <Badge variant="outline" className="text-xs bg-slate-50">
                      {book.grade}-ci sinif
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      {book.subject}
                    </Badge>
                    {book.part && (
                      <span className="text-[11px] text-slate-500 font-medium">
                        • {book.part}
                      </span>
                    )}
                  </div>
                  <CardTitle className="text-base font-bold text-slate-900 line-clamp-1">
                    {book.title}
                  </CardTitle>
                </div>

                {book.status === "promoted" ? (
                  <Badge className="bg-purple-600 text-white text-[11px] shrink-0">
                    <CheckCircle2 className="h-3 w-3 mr-1" /> Rəsmi Edilib
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 text-[11px] shrink-0">
                    Müzakirədə
                  </Badge>
                )}
              </div>
            </CardHeader>

            <CardContent className="p-4 pt-2 flex-1 space-y-3">
              {/* Cover image & Trims details */}
              <div className="flex gap-3 items-center bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                {book.coverUrl ? (
                  <img
                    src={book.coverUrl}
                    alt={book.title}
                    className="w-14 h-18 object-cover rounded shadow-xs border border-slate-200 shrink-0"
                    onError={(e) => {
                      // Fallback if image fails
                      (e.target as any).style.display = "none"
                    }}
                  />
                ) : (
                  <div className="w-14 h-18 bg-blue-50 border border-blue-200 rounded flex items-center justify-center shrink-0">
                    <BookOpen className="h-6 w-6 text-blue-500" />
                  </div>
                )}
                <div className="text-xs space-y-1 flex-1 overflow-hidden">
                  <p className="text-slate-600 text-[11px] truncate">
                    <span className="font-semibold text-slate-700">TRİMS ID:</span> #{book.trimsId}
                  </p>
                  <p className="text-slate-600 text-[11px] truncate">
                    <span className="font-semibold text-slate-700">Əvəzləmə hədəfi:</span>{" "}
                    <code className="bg-slate-200/70 px-1 py-0.5 rounded text-[10px] text-slate-800">
                      {book.targetOfficialId || "Yeni fənn"}
                    </code>
                  </p>
                  <div className="flex items-center gap-2 pt-1 flex-wrap">
                    {book.pdfUrl ? (
                      <a
                        href={book.pdfUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] text-blue-600 hover:text-blue-800 font-medium"
                      >
                        <FileText className="h-3 w-3" /> PDF Bax
                      </a>
                    ) : (
                      <span className="text-[11px] text-slate-400">Audio resurs</span>
                    )}
                    <a
                      href={book.trimsUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] text-slate-500 hover:text-slate-700 font-medium"
                    >
                      <ExternalLink className="h-3 w-3" /> TRİMS-də Aç
                    </a>
                  </div>
                </div>
              </div>

              {/* RAG & Topics Stats */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-slate-50 p-2 rounded border border-slate-100">
                  <span className="text-slate-500 block text-[10px]">Mövzu Sayı</span>
                  <span className="font-semibold text-slate-800">{book.topics?.length || 0} mövzu</span>
                </div>
                <div className="bg-slate-50 p-2 rounded border border-slate-100">
                  <span className="text-slate-500 block text-[10px]">RAG Chunks</span>
                  <span className="font-semibold text-emerald-700 flex items-center gap-1">
                    <Database className="h-3 w-3" /> {book.ragChunkCount || 0} chunk
                  </span>
                </div>
              </div>

              {/* Sample topics preview */}
              <div className="space-y-1">
                <p className="text-[11px] font-medium text-slate-500">Mövzulardan nümunələr:</p>
                <div className="flex flex-wrap gap-1">
                  {book.topics.slice(0, 3).map((topic, i) => (
                    <span
                      key={i}
                      className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded truncate max-w-[200px]"
                      title={topic}
                    >
                      {topic}
                    </span>
                  ))}
                  {book.topics.length > 3 && (
                    <span className="text-[10px] text-slate-400 self-center">
                      +{book.topics.length - 3} daha
                    </span>
                  )}
                </div>
              </div>
            </CardContent>

            <CardFooter className="p-4 pt-0 flex flex-col gap-2 border-t border-slate-100 mt-auto">
              <div className="grid grid-cols-2 gap-2 w-full pt-3">
                {/* RAG Ingest Button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleIngest(book)}
                  disabled={ingestingId === book.id}
                  className="text-xs h-8"
                >
                  <Database className={`h-3 w-3 mr-1 text-emerald-600 ${ingestingId === book.id ? "animate-spin" : ""}`} />
                  {ingestingId === book.id ? "İndekslənir..." : "RAG İndekslə"}
                </Button>

                {/* Sifariş Masası Link */}
                <Link
                  href={`/admin/ai-generation?sourceType=discussion&grade=${book.grade}&textbook=${encodeURIComponent(book.title)}`}
                  className="w-full"
                >
                  <Button variant="outline" size="sm" className="w-full text-xs h-8 text-purple-700 hover:text-purple-900 border-purple-200 hover:bg-purple-50">
                    <Sparkles className="h-3 w-3 mr-1" />
                    Test Sifarişi
                  </Button>
                </Link>
              </div>

              {/* Promotion / Replacement Trigger */}
              {book.status === "promoted" ? (
                <div className="w-full flex items-center justify-between bg-purple-50 text-purple-800 px-2.5 py-1.5 rounded-md text-xs">
                  <span className="font-medium flex items-center gap-1">
                    <ShieldCheck className="h-3.5 w-3.5 text-purple-600" />
                    Rəsmi Kurikulumda Aktivdir
                  </span>
                  {book.lastBackupFile && (
                    <button
                      onClick={() => handleRollback(book.lastBackupFile!, book.id)}
                      disabled={rollingBack}
                      className="text-[11px] text-red-600 hover:underline flex items-center gap-0.5"
                    >
                      <RotateCcw className="h-3 w-3" /> Geri Qaytar
                    </button>
                  )}
                </div>
              ) : (
                <Button
                  size="sm"
                  onClick={() => {
                    setSelectedBook(book)
                    setPromoteResult(null)
                    setPromoteModalOpen(true)
                  }}
                  className="w-full text-xs h-8 bg-slate-900 hover:bg-slate-800 text-white font-medium flex items-center justify-center gap-1"
                >
                  <BookCheck className="h-3.5 w-3.5 text-emerald-400" />
                  Bu Dərsliyi Rəsmi Et / Əvəzlə
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Promotion Modal */}
      <Dialog open={promoteModalOpen} onOpenChange={setPromoteModalOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg">
              <BookCheck className="h-5 w-5 text-purple-600" />
              Dərsliyi Rəsmi Kurikulumla Əvəzlə / Rəsmi Et
            </DialogTitle>
            <DialogDescription>
              İctimai müzakirədə olan bu layihə dərsliyi Elm və Təhsil Nazirliyi tərəfindən təsdiq edildikdə, bir kliklə cari rəsmi dərsliklə əvəzlənir.
            </DialogDescription>
          </DialogHeader>

          {selectedBook && !promoteResult && (
            <div className="space-y-4 py-2">
              <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl space-y-1">
                <p className="text-xs font-semibold text-blue-900">Keçiriləcək Dərslik:</p>
                <p className="text-sm font-bold text-blue-950">{selectedBook.title}</p>
                <p className="text-xs text-blue-700">
                  {selectedBook.grade}-ci sinif • {selectedBook.subject} ({selectedBook.topics.length} mövzu)
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-700 block">
                  Əvəzləmə növü və təhlükəsizlik seçimi:
                </label>
                <div className="space-y-2">
                  <label className="flex items-start gap-2.5 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer text-xs">
                    <input
                      type="radio"
                      name="replaceAction"
                      value="replace"
                      checked={replaceAction === "replace"}
                      onChange={() => setReplaceAction("replace")}
                      className="mt-0.5 text-purple-600"
                    />
                    <div>
                      <span className="font-semibold text-slate-900 block">
                        Mövcud rəsmi dərsliyi tam əvəzlə ({selectedBook.targetOfficialId})
                      </span>
                      <span className="text-slate-500 text-[11px] block mt-0.5">
                        Köhnə dərslik arxivə köçürüləcək və avtomatik ehtiyat nüsxə (backup) saxlanılacaq.
                      </span>
                    </div>
                  </label>

                  <label className="flex items-start gap-2.5 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer text-xs">
                    <input
                      type="radio"
                      name="replaceAction"
                      value="add_alongside"
                      checked={replaceAction === "add_alongside"}
                      onChange={() => setReplaceAction("add_alongside")}
                      className="mt-0.5 text-purple-600"
                    />
                    <div>
                      <span className="font-semibold text-slate-900 block">
                        Mövcud dərsliklə yanaşı yeni paralel dərslik kimi əlavə et
                      </span>
                      <span className="text-slate-500 text-[11px] block mt-0.5">
                        Köhnə dərslik də aktiv qalacaq, bu dərslik də rəsmi siyahıya əlavə olunacaq.
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2 text-xs text-amber-800">
                <AlertCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  Sistem cari <code>data/textbooks.json</code> faylının vaxt ştamplı nüsxəsini (backup) yaradacaq.
                  İstənilən an bir kliklə &ldquo;Geri Qaytar&rdquo; funksiyası ilə əvvəlki vəziyyətə qayıda bilərsiniz.
                </span>
              </div>
            </div>
          )}

          {promoteResult && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2 text-sm text-emerald-900">
              <p className="font-bold flex items-center gap-1.5 text-emerald-800">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                {promoteResult.message}
              </p>
              <div className="text-xs space-y-1 text-emerald-700 bg-white/60 p-2.5 rounded border border-emerald-200">
                <p>
                  <strong>Ehtiyat Nüsxə:</strong> {promoteResult.backupFile}
                </p>
                {promoteResult.archivedBook && (
                  <p>
                    <strong>Arxivlənən Köhnə Dərslik:</strong> {promoteResult.archivedBook.title}
                  </p>
                )}
                <p>
                  <strong>Sinxronlaşan RAG Chunk:</strong> {promoteResult.syncedChunksCount} ədəd
                </p>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2">
            {!promoteResult ? (
              <>
                <Button variant="outline" size="sm" onClick={() => setPromoteModalOpen(false)}>
                  Ləğv et
                </Button>
                <Button
                  size="sm"
                  onClick={handlePromote}
                  disabled={promoting}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-medium"
                >
                  {promoting ? "Əvəzlənir..." : "Təsdiq Et və Rəsmi Et"}
                </Button>
              </>
            ) : (
              <Button size="sm" onClick={() => setPromoteModalOpen(false)}>
                Bağla
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
