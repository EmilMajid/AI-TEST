"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Upload, Search, BookOpen } from "lucide-react"

export function TestInterface() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<"upload" | "search" | "generate">("upload")

  // Upload states
  const [uploadFile, setUploadFile] = useState<File | null>(null)
  const [uploadGrade, setUploadGrade] = useState("")
  const [uploadSubject, setUploadSubject] = useState("")

  // Search states
  const [searchQuery, setSearchQuery] = useState("")
  const [searchGrade, setSearchGrade] = useState("")
  const [searchSubject, setSearchSubject] = useState("")
  const [searchResults, setSearchResults] = useState([])

  // Generate states
  const [generateTopic, setGenerateTopic] = useState("")
  const [generateGrade, setGenerateGrade] = useState("")
  const [generateDifficulty, setGenerateDifficulty] = useState("orta")
  const [generateCount, setGenerateCount] = useState("10")

  const handleUpload = async () => {
    if (!uploadFile || !uploadGrade || !uploadSubject) {
      toast({
        title: "Xəta",
        description: "Bütün sahələri doldurun",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const formData = new FormData()
      formData.append("file", uploadFile)
      formData.append("grade", uploadGrade)
      formData.append("subject", uploadSubject)

      const response = await fetch("/api/rag/ingest", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) throw new Error("Upload failed")

      const data = await response.json()
      toast({
        title: "Uğurlu",
        description: data.message || "Dərslik yükləndi",
        variant: "default",
      })

      // Reset form
      setUploadFile(null)
      setUploadGrade("")
      setUploadSubject("")
    } catch (error) {
      toast({
        title: "Xəta",
        description: error instanceof Error ? error.message : "Upload uğursuz oldu",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async () => {
    if (!searchQuery || !searchGrade || !searchSubject) {
      toast({
        title: "Xəta",
        description: "Bütün sahələri doldurun",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/rag/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: searchQuery,
          grade: searchGrade,
          subject: searchSubject,
        }),
      })

      if (!response.ok) throw new Error("Search failed")

      const data = await response.json()
      setSearchResults(data.results || [])

      toast({
        title: "Uğurlu",
        description: `${data.results?.length || 0} nəticə tapıldı`,
        variant: "default",
      })
    } catch (error) {
      toast({
        title: "Xəta",
        description: error instanceof Error ? error.message : "Axtarış uğursuz oldu",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleGenerate = async () => {
    if (!generateTopic || !generateGrade) {
      toast({
        title: "Xəta",
        description: "Mövzu və sinif tələb olunur",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/generate-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: generateTopic,
          grade: generateGrade,
          difficulty: generateDifficulty,
          questionCount: Number.parseInt(generateCount),
        }),
      })

      if (!response.ok) throw new Error("Generation failed")

      const data = await response.json()
      toast({
        title: "Uğurlu",
        description: `${data.questions?.length || 0} sual yaradıldı`,
        variant: "default",
      })
    } catch (error) {
      toast({
        title: "Xəta",
        description: error instanceof Error ? error.message : "Test yaradılması uğursuz oldu",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Upload Tab */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            PDF Yüklə
          </CardTitle>
          <CardDescription>Dərslik yüklə və RAG indeksə əlavə et</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">PDF Faylı</label>
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
              className={`block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-primary/5 file:text-primary
                hover:file:bg-primary/10`}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Sinif</label>
              <Input
                type="number"
                value={uploadGrade}
                onChange={(e) => setUploadGrade(e.target.value)}
                placeholder="5-11"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Fənn</label>
              <Input
                value={uploadSubject}
                onChange={(e) => setUploadSubject(e.target.value)}
                placeholder="Riyaziyyat, Fizika..."
              />
            </div>
          </div>
          <Button onClick={handleUpload} disabled={loading} className="w-full">
            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Yüklə
          </Button>
        </CardContent>
      </Card>

      {/* Search Tab */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Axtarış
          </CardTitle>
          <CardDescription>Yüklənmiş dərsliklərdə axtarış et</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Sual</label>
            <Textarea
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Axtarmaq istədiyiniz mövzu..."
              rows={3}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Sinif</label>
              <Input
                type="number"
                value={searchGrade}
                onChange={(e) => setSearchGrade(e.target.value)}
                placeholder="5-11"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Fənn</label>
              <Input
                value={searchSubject}
                onChange={(e) => setSearchSubject(e.target.value)}
                placeholder="Riyaziyyat..."
              />
            </div>
          </div>
          <Button onClick={handleSearch} disabled={loading} className="w-full">
            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Axtar
          </Button>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="mt-6 space-y-2">
              <h3 className="font-semibold">Nəticələr ({searchResults.length})</h3>
              {searchResults.map((result: any, idx) => (
                <Card key={idx} className="p-4">
                  <p className="text-sm">{result.content || result.text}</p>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Generate Tab */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Test Yarat
          </CardTitle>
          <CardDescription>AI ilə test sualları yarat</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Mövzu</label>
            <Input
              value={generateTopic}
              onChange={(e) => setGenerateTopic(e.target.value)}
              placeholder="Mövzunu daxil et..."
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Sinif</label>
              <Input
                type="number"
                value={generateGrade}
                onChange={(e) => setGenerateGrade(e.target.value)}
                placeholder="5-11"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Çətinlik</label>
              <select
                value={generateDifficulty}
                onChange={(e) => setGenerateDifficulty(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="sadə">Sadə</option>
                <option value="orta">Orta</option>
                <option value="çətin">Çətin</option>
                <option value="qarışıq">Qarışıq</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Sual Sayı</label>
            <Input
              type="number"
              value={generateCount}
              onChange={(e) => setGenerateCount(e.target.value)}
              min="1"
              max="50"
              placeholder="10"
            />
          </div>
          <Button onClick={handleGenerate} disabled={loading} className="w-full">
            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Yarat
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
