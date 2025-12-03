"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { getCurrentUser } from "@/lib/profile-utils"

export default function TestPage() {
  const router = useRouter()
  const [textbook, setTextbook] = useState("")
  const [topic, setTopic] = useState("")
  const [difficulty, setDifficulty] = useState("medium")
  const [questionCount, setQuestionCount] = useState("5")
  const [loading, setLoading] = useState(false)
  const [loadingTopics, setLoadingTopics] = useState(true)
  const [topics, setTopics] = useState<Record<string, string[]>>({})
  const [availableTextbooks, setAvailableTextbooks] = useState<string[]>([])
  const [userClass, setUserClass] = useState<string>("8")

  // Load user data and topics on mount
  useEffect(() => {
    async function loadTopics() {
      try {
        // Get current user to determine their class
        const user = getCurrentUser()
        console.log("[TestPage] Current user:", user)

        const studentClass = user?.class || "8"
        console.log("[TestPage] Loading topics for class:", studentClass)
        setUserClass(studentClass)

        // Fetch topics for this class
        console.log(`[TestPage] Fetching topics for class ${studentClass}...`)
        const response = await fetch(`/api/textbooks/topics?class=${studentClass}`)

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`)
        }

        const data = await response.json()
        console.log("[TestPage] Topics API response:", JSON.stringify(data).substring(0, 200) + "...")

        if (data.success && data.topics) {
          const subjects = Object.keys(data.topics)
          console.log(`[TestPage] Loaded ${subjects.length} subjects:`, subjects)
          setTopics(data.topics)
          setAvailableTextbooks(subjects)
        } else {
          console.error("[TestPage] Failed to load topics:", data.error)
          setTopics({})
          setAvailableTextbooks([])
        }
      } catch (error) {
        console.error("[TestPage] Error loading topics:", error)
        setTopics({})
        setAvailableTextbooks([])
      } finally {
        setLoadingTopics(false)
      }
    }

    // Check if window is defined (client-side)
    if (typeof window !== 'undefined') {
      loadTopics()
    }
  }, [])

  // Debug state changes
  useEffect(() => {
    console.log("[TestPage] State updated - Available Textbooks:", availableTextbooks.length)
    console.log("[TestPage] State updated - Selected Textbook:", textbook)
    console.log("[TestPage] State updated - Available Topics:", textbook && topics[textbook] ? topics[textbook].length : 0)
  }, [availableTextbooks, textbook, topics])

  async function handleGenerateTest() {
    if (!textbook || !topic) {
      alert("Zəhmət olmasa dərs və mövzu seçin")
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
          class: userClass,
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

  const availableTopics = textbook && topics[textbook] ? topics[textbook] : []

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Yeni Test Yaratmaq</CardTitle>
          <CardDescription>Dərs, mövzu və çətinlik səviyyəsini seçin</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {loadingTopics ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Mövzular yüklənir...</p>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="textbook">Dərs</Label>
                <Select value={textbook} onValueChange={setTextbook}>
                  <SelectTrigger id="textbook">
                    <SelectValue placeholder="Dərsi seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableTextbooks.map((tb) => (
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
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
