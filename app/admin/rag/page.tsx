"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, Search, Database, CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const subjects = ["riyaziyyat", "fizika", "kimya", "biologiya", "azərbaycan_dili", "ingilis_dili", "tarix", "coğrafiya"]

export default function RAGAdminPage() {
  const [file, setFile] = useState<File | null>(null)
  const [grade, setGrade] = useState<string>("")
  const [subject, setSubject] = useState<string>("")
  const [isUploading, setIsUploading] = useState(false)
  const [uploadResult, setUploadResult] = useState<any>(null)

  const [searchQuery, setSearchQuery] = useState("")
  const [searchGrade, setSearchGrade] = useState<string>("")
  const [searchSubject, setSearchSubject] = useState<string>("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)

  const { toast } = useToast()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleUpload = async () => {
    if (!file || !grade || !subject) {
      toast({
        title: "Xəta",
        description: "Zəhmət olmasa bütün məlumatları doldurun",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)
    setUploadResult(null)

    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("grade", grade)
      formData.append("subject", subject)

      const response = await fetch("/api/rag/ingest", {
        method: "POST",
        body: formData,
      })

      const result = await response.json()

      if (response.ok) {
        setUploadResult({ success: true, ...result })
        toast({
          title: "Uğurlu!",
          description: "Dərslik uğurla yükləndi və indeksə əlavə edildi",
        })
        // Reset form
        setFile(null)
        setGrade("")
        setSubject("")
      } else {
        setUploadResult({ success: false, error: result.error })
        toast({
          title: "Xəta",
          description: result.error || "Dərslik yüklənmədi",
          variant: "destructive",
        })
      }
    } catch (error: any) {
      setUploadResult({ success: false, error: error.message })
      toast({
        title: "Xəta",
        description: "Şəbəkə xətası baş verdi",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleSearch = async () => {
    if (!searchQuery || !searchGrade || !searchSubject) {
      toast({
        title: "Xəta",
        description: "Axtarış üçün bütün məlumatları doldurun",
        variant: "destructive",
      })
      return
    }

    setIsSearching(true)
    setSearchResults([])

    try {
      const response = await fetch("/api/rag/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: searchQuery,
          grade: searchGrade,
          subject: searchSubject,
          k: 5,
        }),
      })

      const result = await response.json()

      if (result.success) {
        setSearchResults(result.results || [])
        if (result.results.length === 0) {
          toast({
            title: "Nəticə tapılmadı",
            description: "Bu mövzu üzrə indekslənmiş məlumat yoxdur",
          })
        }
      } else {
        toast({
          title: "Xəta",
          description: result.error || "Axtarış zamanı xəta baş verdi",
          variant: "destructive",
        })
      }
    } catch (error: any) {
      toast({
        title: "Xəta",
        description: "Axtarış zamanı xəta baş verdi",
        variant: "destructive",
      })
    } finally {
      setIsSearching(false)
    }
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">RAG Sistem İdarəetməsi</h1>
        <p className="text-muted-foreground">Dərslikləri yükləyin və vektor bazasına əlavə edin</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Dərslik Yüklə
            </CardTitle>
            <CardDescription>PDF formatında dərsliyi RAG sisteminə əlavə edin</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="file">PDF Fayl</Label>
              <Input id="file" type="file" accept=".pdf" onChange={handleFileChange} disabled={isUploading} />
              {file && <p className="text-sm text-muted-foreground">Seçilmiş fayl: {file.name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="grade">Sinif</Label>
              <Select value={grade} onValueChange={setGrade} disabled={isUploading}>
                <SelectTrigger id="grade">
                  <SelectValue placeholder="Sinif seçin" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 11 }, (_, i) => i + 1).map((g) => (
                    <SelectItem key={g} value={g.toString()}>
                      {g}-ci sinif
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Fənn</Label>
              <Select value={subject} onValueChange={setSubject} disabled={isUploading}>
                <SelectTrigger id="subject">
                  <SelectValue placeholder="Fənn seçin" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button className="w-full" onClick={handleUpload} disabled={isUploading || !file || !grade || !subject}>
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Yüklənir...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Yüklə və İndekslə
                </>
              )}
            </Button>

            {uploadResult && (
              <Alert variant={uploadResult.success ? "default" : "destructive"}>
                {uploadResult.success ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                <AlertDescription>{uploadResult.success ? uploadResult.message : uploadResult.error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Search Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Kontekst Axtarışı
            </CardTitle>
            <CardDescription>RAG sistemində məlumat axtarın və test edin</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="searchQuery">Axtarış Sorğusu</Label>
              <Input
                id="searchQuery"
                placeholder="Məsələn: Nyuton qanunları"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                disabled={isSearching}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="searchGrade">Sinif</Label>
                <Select value={searchGrade} onValueChange={setSearchGrade} disabled={isSearching}>
                  <SelectTrigger id="searchGrade">
                    <SelectValue placeholder="Sinif" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 11 }, (_, i) => i + 1).map((g) => (
                      <SelectItem key={g} value={g.toString()}>
                        {g}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="searchSubject">Fənn</Label>
                <Select value={searchSubject} onValueChange={setSearchSubject} disabled={isSearching}>
                  <SelectTrigger id="searchSubject">
                    <SelectValue placeholder="Fənn" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              className="w-full"
              onClick={handleSearch}
              disabled={isSearching || !searchQuery || !searchGrade || !searchSubject}
            >
              {isSearching ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Axtarılır...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Axtar
                </>
              )}
            </Button>

            {searchResults.length > 0 && (
              <div className="mt-4 space-y-2 max-h-[400px] overflow-y-auto">
                <h4 className="font-semibold text-sm">Nəticələr ({searchResults.length}):</h4>
                {searchResults.map((result, idx) => (
                  <Card key={idx} className="p-3">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{result.source}</span>
                        <span>Səhifə: {result.page}</span>
                      </div>
                      <p className="text-sm">{result.text}</p>
                      <div className="text-xs text-muted-foreground">
                        Relevantlıq: {(result.score * 100).toFixed(1)}%
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Info Section */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            RAG Sistemi Haqqında
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-1">
              <h4 className="font-semibold text-sm">1. Dərslik Yüklə</h4>
              <p className="text-sm text-muted-foreground">PDF dərsliklərini sisteminə yükləyin</p>
            </div>
            <div className="space-y-1">
              <h4 className="font-semibold text-sm">2. Avtomatik Emal</h4>
              <p className="text-sm text-muted-foreground">Mətn çıxarılır və vektorlaşdırılır</p>
            </div>
            <div className="space-y-1">
              <h4 className="font-semibold text-sm">3. İntelektual Test</h4>
              <p className="text-sm text-muted-foreground">Dərslik məlumatına əsaslanan test yaradılır</p>
            </div>
          </div>

          <Alert>
            <Database className="h-4 w-4" />
            <AlertDescription>
              RAG sistemi dərslik məlumatlarını FAISS vektor bazasında saxlayır və test yaradarkən ən uyğun konteksti
              tapır. Bu daha dəqiq və dərslik əsaslı test suallarının yaradılmasını təmin edir.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  )
}
