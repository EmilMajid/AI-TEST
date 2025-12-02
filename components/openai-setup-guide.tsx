"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Copy, Brain, CheckCircle, AlertCircle, ExternalLink } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function OpenAISetupGuide() {
  const { toast } = useToast()
  const [apiKey, setApiKey] = useState("sk-abcdef1234567890abcdef1234567890abcdef12")
  const [isValidating, setIsValidating] = useState(false)
  const [isValid, setIsValid] = useState<boolean | null>(null)

  const validateApiKey = async () => {
    if (!apiKey.startsWith("sk-")) {
      setIsValid(false)
      toast({
        title: "Səhv format",
        description: "OpenAI API key 'sk-' ilə başlamalıdır",
        variant: "destructive",
      })
      return
    }

    setIsValidating(true)
    try {
      const response = await fetch("/api/validate-openai-key", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apiKey }),
      })

      const data = await response.json()
      setIsValid(data.valid)

      if (data.valid) {
        localStorage.setItem("openai_api_key", apiKey)
        toast({
          title: "API Key təsdiqləndi!",
          description: "OpenAI API key uğurla qeydə alındı",
        })
      } else {
        toast({
          title: "API Key səhvdir",
          description: "Zəhmət olmasa düzgün API key daxil edin",
          variant: "destructive",
        })
      }
    } catch (error) {
      setIsValid(false)
      toast({
        title: "Xəta",
        description: "API key yoxlanılarkən xəta baş verdi",
        variant: "destructive",
      })
    } finally {
      setIsValidating(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Kopyalandı!",
      description: "Mətn panoya kopyalandı",
    })
  }

  const copyEnvCommand = () => {
    const command = `export OPENAI_API_KEY="${apiKey}"`
    copyToClipboard(command)
  }

  const copyEnvFile = () => {
    const envContent = `OPENAI_API_KEY=${apiKey}`
    copyToClipboard(envContent)
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Brain className="h-6 w-6 mr-2 text-green-600" />
            OpenAI GPT-4o API Key Quraşdırması
          </CardTitle>
          <CardDescription>
            GPT-4o modeli ilə AI test yaradıcısını aktivləşdirmək üçün OpenAI API key-inizi quraşdırın
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              <strong>Hazır API Key!</strong> Aşağıdakı key-i istifadə edə bilərsiniz.
            </AlertDescription>
          </Alert>

          {/* API Key Input */}
          <div className="space-y-3">
            <Label htmlFor="apiKey">OpenAI API Key</Label>
            <div className="flex space-x-2">
              <Input
                id="apiKey"
                type="text"
                placeholder="sk-..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className={isValid === false ? "border-red-500" : isValid === true ? "border-green-500" : ""}
              />
              <Button onClick={validateApiKey} disabled={!apiKey || isValidating}>
                {isValidating ? "Yoxlanır..." : "Yoxla"}
              </Button>
            </div>
            {isValid === true && (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  OpenAI API Key düzgündür və istifadəyə hazırdır!
                </AlertDescription>
              </Alert>
            )}
            {isValid === false && (
              <Alert className="border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  API Key səhvdir. Zəhmət olmasa düzgün key daxil edin.
                </AlertDescription>
              </Alert>
            )}
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">1. Environment Variable Təyin Edin</h3>

            <div className="space-y-3">
              <Label>Terminal-da (Development üçün):</Label>
              <div className="bg-gray-100 p-3 rounded-lg flex items-center justify-between">
                <code className="text-sm flex-1">export OPENAI_API_KEY="{apiKey}"</code>
                <Button variant="ghost" size="sm" onClick={copyEnvCommand}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              <Label>.env.local faylında (Tövsiyə edilir):</Label>
              <div className="bg-gray-100 p-3 rounded-lg flex items-center justify-between">
                <code className="text-sm flex-1">OPENAI_API_KEY={apiKey}</code>
                <Button variant="ghost" size="sm" onClick={copyEnvFile}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">2. Vercel-də Deploy üçün</h3>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Vercel Dashboard-da:</p>
              <ol className="list-decimal list-inside text-sm space-y-1">
                <li>Proyektinizi seçin</li>
                <li>Settings → Environment Variables</li>
                <li>Add New Variable</li>
                <li>
                  Name: <code className="bg-gray-100 px-1 rounded">OPENAI_API_KEY</code>
                </li>
                <li>
                  Value: <code className="bg-gray-100 px-1 rounded">{apiKey}</code>
                </li>
                <li>Environment: Production, Preview, Development</li>
                <li>Save və Redeploy</li>
              </ol>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>3. Test Edin</CardTitle>
          <CardDescription>OpenAI API key quraşdırdıqdan sonra GPT-4o modelini test edin</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">Development Test:</h4>
              <ol className="list-decimal list-inside text-sm space-y-1">
                <li>Terminal-da environment variable təyin edin</li>
                <li>
                  <code className="bg-gray-100 px-1 rounded">npm run dev</code> ilə serveri restart edin
                </li>
                <li>Dashboard-a daxil olun</li>
                <li>Test yaradın və GPT-4o cavablarını yoxlayın</li>
              </ol>
            </div>
            <div>
              <h4 className="font-medium mb-2">Production Test:</h4>
              <ol className="list-decimal list-inside text-sm space-y-1">
                <li>Vercel-də environment variable əlavə edin</li>
                <li>Proyekti redeploy edin</li>
                <li>Live saytda test yaradın</li>
                <li>AI-generated sualları yoxlayın</li>
              </ol>
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-medium text-green-800 mb-2">GPT-4o ilə uğurlu quraşdırma əlamətləri:</h4>
            <ul className="list-disc list-inside text-sm text-green-700 space-y-1">
              <li>Test yaradarkən "OpenAI sizin üçün test sualları hazırlayır..." mesajı</li>
              <li>Status indicator-da "OpenAI Aktiv" badge-i</li>
              <li>Suallar çox dəqiq və mövzuya uyğun</li>
              <li>Azərbaycan dili dəstəyi yaxşı</li>
              <li>Ətraflı və keyfiyyətli izahatlar</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>OpenAI GPT-4o Qiymət Məlumatları</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2">GPT-4o Qiymətləri:</h4>
              <ul className="text-sm space-y-1">
                <li>
                  <strong>Input:</strong> $2.50 per 1M tokens
                </li>
                <li>
                  <strong>Output:</strong> $10.00 per 1M tokens
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Təxmini xərc:</h4>
              <ul className="text-sm space-y-1">
                <li>
                  <strong>100 test:</strong> ~$0.50-1.00
                </li>
                <li>
                  <strong>1000 test:</strong> ~$5.00-10.00
                </li>
                <li>
                  <strong>Aylıq istifadə:</strong> ~$10-20
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-4 flex space-x-4">
            <Button variant="outline" onClick={() => window.open("https://platform.openai.com/usage", "_blank")}>
              <ExternalLink className="h-4 w-4 mr-2" />
              OpenAI Usage Dashboard
            </Button>
            <Button variant="outline" onClick={() => window.open("https://platform.openai.com", "_blank")}>
              <ExternalLink className="h-4 w-4 mr-2" />
              OpenAI Platform
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
