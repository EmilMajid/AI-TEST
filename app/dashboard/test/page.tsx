"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

const TEXTBOOKS = [
  "Azərbaycan dili",
  "Riyaziyyat",
  "Fizika",
  "Kimya",
  "Biologiya",
  "Coğrafiya",
  "Tarix",
  "İnformatika",
  "Həyat bilgisi",
  "Təsviri incəsənət",
  "Musiqi"
]

interface Topic {
  title: string;
  page: number;
  path: string;
  endPage?: number;
}

interface TopicGroup {
  chapter: string;
  topics: Topic[];
}

export default function TestPage() {
  const router = useRouter()
  const [textbook, setTextbook] = useState("")
  const [topic, setTopic] = useState("")
  const [difficulty, setDifficulty] = useState("medium")
  const [questionCount, setQuestionCount] = useState("5")
  const [loading, setLoading] = useState(false)
  const [apiTopics, setApiTopics] = useState<Record<string, TopicGroup[]>>({})

  // Fetch topics from API
  useEffect(() => {
    async function fetchTopics() {
      try {
        const res = await fetch("/api/textbooks/topics?class=8")
        const data = await res.json()
        if (data.success && data.topics) {
          setApiTopics(data.topics)
        }
      } catch (error) {
        console.error("Failed to fetch topics:", error)
      }
    }
    fetchTopics()
  }, [])

  async function handleGenerateTest() {
    if (!textbook || !topic) {
      alert("Zəhmət olmasa dərslər seçin")
      return
    }

    setLoading(true)
    try {
      // Find the selected topic object across all groups
      let selectedTopicObj: Topic | undefined;
      const groups = apiTopics[textbook] || [];
      for (const group of groups) {
        const found = group.topics.find(t => t.title === topic);
        if (found) {
          selectedTopicObj = found;
          break;
        }
      }

      const response = await fetch("/api/tests/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          textbook,
          topic,
          topicDetails: selectedTopicObj,
          class: "8",
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

  const topicGroups = textbook && apiTopics[textbook] ? apiTopics[textbook] : []
  const hasTopics = topicGroups.some(g => g.topics.length > 0)

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
            <Select value={textbook} onValueChange={(val) => { setTextbook(val); setTopic(""); }}>
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
            <Select value={topic} onValueChange={setTopic} disabled={!textbook || !hasTopics}>
              <SelectTrigger id="topic">
                <SelectValue placeholder={!hasTopics ? "Mövzu tapılmadı" : "Mövzunu seçin"} />
              </SelectTrigger>
              <SelectContent>
                {topicGroups.map((group, idx) => (
                  <SelectGroup key={idx}>
                    <SelectLabel>{group.chapter}</SelectLabel>
                    {group.topics.map((t) => (
                      <SelectItem key={t.title} value={t.title}>
                        {t.title}
                      </SelectItem>
                    ))}
                  </SelectGroup>
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
