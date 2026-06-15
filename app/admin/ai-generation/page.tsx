"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Wand2, Check, X, RefreshCw } from "lucide-react"

interface GeneratedQuestion {
  id: string
  text: string
  options: string[]
  correctIndex: number
  explanation: string
}

export default function AIGenerationPage() {
  const { toast } = useToast()
  const [isGenerating, setIsGenerating] = useState(false)
  const [questions, setQuestions] = useState<GeneratedQuestion[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)

  // Form states
  const [subject, setSubject] = useState("")
  const [topic, setTopic] = useState("")
  const [count, setCount] = useState("5")
  const [difficulty, setDifficulty] = useState("medium")

  const handleGenerate = async () => {
    if (!subject || !topic) {
      toast({ title: "Xəta", description: "Zəhmət olmasa fənn və mövzunu qeyd edin.", variant: "destructive" })
      return
    }
    
    setIsGenerating(true)
    // Simulate API call to generate questions
    setTimeout(() => {
      setQuestions([
        {
          id: "1",
          text: `${topic} mövzusunda Sİ tərəfindən yaradılmış nümunə sual 1?`,
          options: ["A variantı (Səhv)", "B variantı (Düzgün)", "C variantı (Səhv)", "D variantı (Səhv)"],
          correctIndex: 1,
          explanation: "Çünki B variantı verilmiş şərtlərə ən uyğun olandır."
        },
        {
          id: "2",
          text: `${topic} mövzusunda Sİ tərəfindən yaradılmış nümunə sual 2?`,
          options: ["Düzgün", "Səhv", "Ola bilər", "Heç biri"],
          correctIndex: 0,
          explanation: "Qaydaya əsasən düzgün variant birincidir."
        }
      ])
      setCurrentIndex(0)
      setIsGenerating(false)
      toast({ title: "Uğurlu", description: "Suallar generasiya olundu. Zəhmət olmasa yoxlayın." })
    }, 2000)
  }

  const handleApprove = () => {
    toast({ title: "Təsdiqləndi", description: "Sual bazaya (Active statusu ilə) əlavə olundu." })
    nextQuestion()
  }

  const handleReject = () => {
    toast({ title: "Rədd edildi", description: "Sual bazadan silindi.", variant: "destructive" })
    nextQuestion()
  }

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1)
    } else {
      setQuestions([])
      setCurrentIndex(0)
      toast({ title: "Bitdi", description: "Baxılacaq başqa sual qalmadı." })
    }
  }

  const currentQuestion = questions[currentIndex]

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Aİ Generasiya Mərkəzi</h1>
          <p className="text-muted-foreground">
            Süni İntellekt vasitəsilə sürətli və kütləvi sual yaradın.
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-12 gap-6">
        {/* Form Section */}
        <Card className="md:col-span-4 h-fit">
          <CardHeader>
            <CardTitle>Generasiya Parametrləri</CardTitle>
            <CardDescription>Sualın xüsusiyyətlərini təyin edin</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Fənn</Label>
              <Input 
                placeholder="Məs: Riyaziyyat" 
                value={subject} 
                onChange={(e) => setSubject(e.target.value)} 
              />
            </div>
            <div className="space-y-2">
              <Label>Mövzu (və ya Standart)</Label>
              <Input 
                placeholder="Məs: Kəsrlərin toplanması" 
                value={topic} 
                onChange={(e) => setTopic(e.target.value)} 
              />
            </div>
            <div className="space-y-2">
              <Label>Çətinlik</Label>
              <Select value={difficulty} onValueChange={setDifficulty}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Asan</SelectItem>
                  <SelectItem value="medium">Orta</SelectItem>
                  <SelectItem value="hard">Çətin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Sual Sayı</Label>
              <Input 
                type="number" 
                value={count} 
                onChange={(e) => setCount(e.target.value)} 
                min="1" max="50" 
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleGenerate} disabled={isGenerating} className="w-full gap-2 bg-indigo-600 hover:bg-indigo-700">
              {isGenerating ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
              {isGenerating ? "Yaradılır..." : "Generasiya Et"}
            </Button>
          </CardFooter>
        </Card>

        {/* Swipe/Approval Section */}
        <div className="md:col-span-8 flex flex-col justify-center min-h-[400px]">
          {questions.length > 0 && currentQuestion ? (
            <Card className="border-2 border-indigo-100 shadow-lg relative overflow-hidden transition-all duration-300">
              <div className="absolute top-0 right-0 bg-indigo-100 text-indigo-800 px-3 py-1 rounded-bl-lg text-sm font-semibold">
                Sual {currentIndex + 1} / {questions.length}
              </div>
              <CardHeader>
                <CardTitle className="text-xl pt-4 leading-relaxed">{currentQuestion.text}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-2">
                  {currentQuestion.options.map((opt, idx) => (
                    <div 
                      key={idx} 
                      className={`p-3 border rounded-md ${idx === currentQuestion.correctIndex ? 'bg-green-50 border-green-200' : 'bg-slate-50'}`}
                    >
                      <span className="font-semibold mr-2">{String.fromCharCode(65 + idx)})</span>
                      {opt}
                      {idx === currentQuestion.correctIndex && <span className="ml-2 text-xs text-green-600 font-semibold">(Düzgün)</span>}
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-3 bg-blue-50 text-blue-800 rounded-md text-sm border border-blue-100">
                  <strong>İzah:</strong> {currentQuestion.explanation}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between gap-4 border-t p-4 bg-slate-50">
                <Button onClick={handleReject} variant="outline" className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 gap-2 h-12">
                  <X className="h-5 w-5" />
                  Rədd et
                </Button>
                <Button onClick={handleApprove} className="w-full bg-green-600 hover:bg-green-700 gap-2 h-12">
                  <Check className="h-5 w-5" />
                  Təsdiqlə (Active)
                </Button>
              </CardFooter>
            </Card>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center p-8 border-2 border-dashed rounded-xl bg-slate-50 text-slate-500">
              <Wand2 className="h-12 w-12 text-slate-300 mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-1">Hələ heç bir sual yoxdur</h3>
              <p>Sol tərəfdən parametrləri seçib Sİ-yə sual yazdıra bilərsiniz.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
