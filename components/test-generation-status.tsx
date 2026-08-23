"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Brain, Zap, Target, Clock, BookOpen, X } from "lucide-react"
import { AdBanner } from "@/components/ads/ad-banner"

interface TestConfig {
  textbook: string
  topic: string
  class: string
  difficulty: "sadə" | "orta" | "çətin" | "qarışıq"
  questionCount: number
  timeLimit: number
}

interface TestGenerationStatusProps {
  config: TestConfig
  onCancel: () => void
}

export default function TestGenerationStatus({ config, onCancel }: TestGenerationStatusProps) {
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)

  const steps = [
    { name: "AI Modeli Seçimi", icon: Brain, description: "Ən uyğun AI modeli seçilir" },
    { name: "Mövzu Təhlili", icon: Target, description: "Mövzu məzmunu təhlil edilir" },
    { name: "Sual Yaradılması", icon: Zap, description: `${config.questionCount} sual yaradılır` },
    { name: "Keyfiyyət Yoxlaması", icon: BookOpen, description: "Suallar yoxlanılır və optimallaşdırılır" },
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          return 100
        }
        const increment = Math.random() * 15 + 5
        return Math.min(prev + increment, 100)
      })
    }, 800)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const stepTimer = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < steps.length - 1) {
          return prev + 1
        }
        return prev
      })
    }, 2000)

    return () => clearInterval(stepTimer)
  }, [steps.length])

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "sadə":
        return "bg-green-100 text-green-800"
      case "orta":
        return "bg-yellow-100 text-yellow-800"
      case "çətin":
        return "bg-red-100 text-red-800"
      case "qarışıq":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 to-primary/10 py-6 px-3 sm:px-6 flex justify-center items-start">
      <div className="w-full max-w-[1600px] mx-auto flex justify-center items-start gap-6">
        
        {/* Sol Reklam Bloku (Test yaradılarkən) */}
        <aside className="hidden lg:block w-[230px] xl:w-[260px] shrink-0 sticky top-6">
          <AdBanner
            slot="gen-sidebar-left"
            format="vertical"
            refreshKey="gen-left"
            label="Tövsiyə Olunan Təhsil"
          />
        </aside>

        {/* Mərkəzi AI Test Yaradılır Kartı */}
        <main className="w-full flex-1 max-w-4xl space-y-6">
          <Card className="shadow-md border-border/80">
            <CardHeader className="pb-3 border-b border-border/40">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center text-xl font-bold">
                    <Brain className="h-6 w-6 text-purple-600 mr-2" />
                    AI Test Yaradılır
                  </CardTitle>
                  <p className="text-gray-600 mt-1 text-sm">
                    {config.textbook} - {config.topic}
                  </p>
                </div>
                <Button variant="ghost" size="sm" onClick={onCancel}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              {/* Test Konfiqurasiyası */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted/30 rounded-2xl border border-border/50">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{config.questionCount}</div>
                  <div className="text-xs text-muted-foreground mt-1 font-medium">Sual Sayı</div>
                </div>
                <div className="text-center flex flex-col items-center justify-center">
                  <Badge className={`${getDifficultyColor(config.difficulty)} font-bold text-xs py-1 px-3`}>
                    {config.difficulty.charAt(0).toUpperCase() + config.difficulty.slice(1)}
                  </Badge>
                  <div className="text-xs text-muted-foreground mt-1 font-medium">Çətinlik</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{config.timeLimit}</div>
                  <div className="text-xs text-muted-foreground mt-1 font-medium">Dəqiqə</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{config.class}</div>
                  <div className="text-xs text-muted-foreground mt-1 font-medium">Sinif</div>
                </div>
              </div>

              {/* Progress */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs sm:text-sm font-medium text-gray-600">
                  <span>Test Yaradılma Gedişatı</span>
                  <span className="font-bold text-primary">{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="w-full h-2.5" />
              </div>

              {/* Steps */}
              <div className="space-y-3">
                {steps.map((step, index) => {
                  const Icon = step.icon
                  const isActive = index === currentStep
                  const isCompleted = index < currentStep

                  return (
                    <div
                      key={index}
                      className={`flex items-center p-3.5 rounded-xl border transition-all ${
                        isActive
                          ? "bg-blue-50/80 border-blue-200 shadow-xs"
                          : isCompleted
                            ? "bg-green-50/80 border-green-200"
                            : "bg-muted/20 border-border/40"
                      }`}
                    >
                      <div
                        className={`flex items-center justify-center w-8 h-8 rounded-full mr-3 shrink-0 ${
                          isActive
                            ? "bg-blue-600 text-white"
                            : isCompleted
                              ? "bg-green-600 text-white"
                              : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div
                          className={`font-semibold text-sm ${isActive ? "text-blue-900" : isCompleted ? "text-green-900" : "text-gray-700"}`}
                        >
                          {step.name}
                        </div>
                        <div
                          className={`text-xs ${isActive ? "text-blue-700" : isCompleted ? "text-green-700" : "text-gray-500"}`}
                        >
                          {step.description}
                        </div>
                      </div>
                      {isActive && (
                        <div className="ml-3 shrink-0">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                        </div>
                      )}
                      {isCompleted && (
                        <div className="ml-3 shrink-0 font-bold text-green-600">
                          ✓
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>

              {/* Çətinlik Bölgüsü (qarışıq səviyyə üçün) */}
              {config.difficulty === "qarışıq" && (
                <div className="p-4 bg-purple-50/60 rounded-xl border border-purple-100">
                  <h4 className="font-semibold text-sm mb-3 flex items-center text-purple-900">
                    <Target className="h-4 w-4 mr-2 text-purple-600" />
                    Çətinlik Bölgüsü
                  </h4>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="p-2 bg-white rounded-lg border border-purple-100">
                      <div className="text-green-600 font-bold text-base">{Math.ceil(config.questionCount * 0.3)}</div>
                      <div className="text-xs text-gray-500">Sadə (30%)</div>
                    </div>
                    <div className="p-2 bg-white rounded-lg border border-purple-100">
                      <div className="text-yellow-600 font-bold text-base">{Math.ceil(config.questionCount * 0.5)}</div>
                      <div className="text-xs text-gray-500">Orta (50%)</div>
                    </div>
                    <div className="p-2 bg-white rounded-lg border border-purple-100">
                      <div className="text-red-600 font-bold text-base">
                        {config.questionCount -
                          Math.ceil(config.questionCount * 0.3) -
                          Math.ceil(config.questionCount * 0.5)}
                      </div>
                      <div className="text-xs text-gray-500">Çətin (20%)</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Reklam Bloku (Test Yaradılarkən Alt Banner) */}
              <div className="pt-2">
                <AdBanner
                  slot="gen-bottom-banner"
                  format="large-banner"
                  refreshKey="gen-banner"
                  label="Xüsusi Təhsil Təklifi və Endirim Kampaniyası"
                />
              </div>

              <div className="text-center text-xs text-muted-foreground pt-1">
                <Clock className="h-3.5 w-3.5 inline mr-1" />
                Süni intellekt dərslik əsasında sualları hazırlayır (təxminən 5-15 saniyə)
              </div>
            </CardContent>
          </Card>
        </main>

        {/* Sağ Reklam Bloku (Test yaradılarkən) */}
        <aside className="hidden lg:block w-[230px] xl:w-[260px] shrink-0 sticky top-6">
          <AdBanner
            slot="gen-sidebar-right"
            format="vertical"
            refreshKey="gen-right"
            label="Sponsorlu Elanlar"
          />
        </aside>

      </div>
    </div>
  )
}
