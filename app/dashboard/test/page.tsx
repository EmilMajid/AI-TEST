"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

const TEXTBOOKS = ["Azərbaycan dili", "Riyaziyyat", "Fizika", "Kimya", "Biologiya", "Coğrafiya", "Tarix", "İnformatika"]

const TOPICS = {
  "Azərbaycan dili": ["Orfoqrafiya", "Qrammatika", "Ədəbiyyat"],
  Riyaziyyat: ["Cəbr", "Həndəsə", "Trigonometriya"],
  Fizika: ["Mexanika", "Optika", "Elektromagnetizm"],
  Kimya: ["Kimya əsasları", "Üzvi kimya", "Qeyri-üzvi kimya"],
  Biologiya: ["Botnika", "Zoologiya", "Genetika"],
}

export default function TestPage() {
  const router = useRouter()
  const [textbook, setTextbook] = useState("")
  const [topic, setTopic] = useState("")
  const [difficulty, setDifficulty] = useState("medium")
  const [questionCount, setQuestionCount] = useState("5")
  const [loading, setLoading] = useState(false)

  async function handleGenerateTest() {
    if (!textbook || !topic) {
      alert("Zəhmət olmasa dərslər seçin")
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/tests/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          textbook,
          topic,
          class: "10",
          difficulty,
          questionCount: Number.parseInt(questionCount),
        }),
      })

      const data = await response.json()

      if (data.success) {
        router.push(`/dashboard/test/${data.testId}/take`)
      } else {
        alert("Test yaradılarkən xəta: " + data.error)
      }
    } catch (error) {
      alert("Xəta: " + (error instanceof Error ? error.message : "Unknown error"))
    } finally {
      setLoading(false)
    }
  }

  const availableTopics =
    textbook && TOPICS[textbook as keyof typeof TOPICS] ? TOPICS[textbook as keyof typeof TOPICS] : []

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Yeni Test Yaratmaq</CardTitle>
          <CardDescription>Dərs, mövzu və çətinlik səviyyəsini seçin</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="textbook">Dərs</Label>
            <Select value={textbook} onValueChange={setTextbook}>
              <SelectTrigger id="textbook">
                <SelectValue placeholder="Dərsi seçin" />
              </SelectTrigger>
              <SelectContent>
                {TEXTBOOKS.map((tb) => (
                  <SelectItem key={tb} value={tb}>
                    {tb}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="topic">Mövzu</Label>
            <Select value={topic} onValueChange={setTopic} disabled={!textbook}>
              <SelectTrigger id="topic">
                <SelectValue placeholder="Mövzunu seçin" />
              </SelectTrigger>
              <SelectContent>
                {availableTopics.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="difficulty">Çətinlik Səviyyəsi</Label>
              <Select value={difficulty} onValueChange={setDifficulty}>
                <SelectTrigger id="difficulty">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Asan</SelectItem>
                  <SelectItem value="medium">Orta</SelectItem>
                  <SelectItem value="hard">Çətin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="count">Sual Sayı</Label>
              <Select value={questionCount} onValueChange={setQuestionCount}>
                <SelectTrigger id="count">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[5, 10, 15, 20].map((n) => (
                    <SelectItem key={n} value={n.toString()}>
                      {n}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button onClick={handleGenerateTest} disabled={!textbook || !topic || loading} className="w-full" size="lg">
            {loading ? "Test Yaradılır..." : "Test Yaratmaq"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
