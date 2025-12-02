"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Brain, Zap, Target, Clock, BookOpen, X } from "lucide-react"

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
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="flex items-center">
                <Brain className="h-6 w-6 text-purple-600 mr-2" />
                AI Test Yaradılır
              </CardTitle>
              <p className="text-gray-600 mt-1">
                {config.textbook} - {config.topic}
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={onCancel}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Test Konfiqurasiyası */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{config.questionCount}</div>
              <div className="text-sm text-gray-600">Sual</div>
            </div>
            <div className="text-center">
              <Badge className={getDifficultyColor(config.difficulty)}>
                {config.difficulty.charAt(0).toUpperCase() + config.difficulty.slice(1)}
              </Badge>
              <div className="text-sm text-gray-600 mt-1">Çətinlik</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{config.timeLimit}</div>
              <div className="text-sm text-gray-600">Dəqiqə</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{config.class}</div>
              <div className="text-sm text-gray-600">Sinif</div>
            </div>
          </div>

          {/* Progress */}
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span>Test Yaradılma Gedişatı</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="w-full" />
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
                  className={`flex items-center p-3 rounded-lg transition-all ${
                    isActive
                      ? "bg-blue-50 border border-blue-200"
                      : isCompleted
                        ? "bg-green-50 border border-green-200"
                        : "bg-gray-50"
                  }`}
                >
                  <div
                    className={`flex items-center justify-center w-8 h-8 rounded-full mr-3 ${
                      isActive
                        ? "bg-blue-600 text-white"
                        : isCompleted
                          ? "bg-green-600 text-white"
                          : "bg-gray-300 text-gray-600"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <div
                      className={`font-medium ${isActive ? "text-blue-900" : isCompleted ? "text-green-900" : "text-gray-700"}`}
                    >
                      {step.name}
                    </div>
                    <div
                      className={`text-sm ${isActive ? "text-blue-700" : isCompleted ? "text-green-700" : "text-gray-500"}`}
                    >
                      {step.description}
                    </div>
                  </div>
                  {isActive && (
                    <div className="ml-3">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    </div>
                  )}
                  {isCompleted && (
                    <div className="ml-3">
                      <div className="text-green-600">✓</div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Çətinlik Bölgüsü (qarışıq səviyyə üçün) */}
          {config.difficulty === "qarışıq" && (
            <div className="p-4 bg-purple-50 rounded-lg">
              <h4 className="font-medium mb-3 flex items-center">
                <Target className="h-4 w-4 mr-2" />
                Çətinlik Bölgüsü
              </h4>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="text-center">
                  <div className="text-green-600 font-bold text-lg">{Math.ceil(config.questionCount * 0.3)}</div>
                  <div className="text-gray-600">Sadə Suallar</div>
                  <div className="text-xs text-gray-500">30%</div>
                </div>
                <div className="text-center">
                  <div className="text-yellow-600 font-bold text-lg">{Math.ceil(config.questionCount * 0.5)}</div>
                  <div className="text-gray-600">Orta Suallar</div>
                  <div className="text-xs text-gray-500">50%</div>
                </div>
                <div className="text-center">
                  <div className="text-red-600 font-bold text-lg">
                    {config.questionCount -
                      Math.ceil(config.questionCount * 0.3) -
                      Math.ceil(config.questionCount * 0.5)}
                  </div>
                  <div className="text-gray-600">Çətin Suallar</div>
                  <div className="text-xs text-gray-500">20%</div>
                </div>
              </div>
            </div>
          )}

          <div className="text-center text-sm text-gray-600">
            <Clock className="h-4 w-4 inline mr-1" />
            Təxminən 30-60 saniyə çəkəcək
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
