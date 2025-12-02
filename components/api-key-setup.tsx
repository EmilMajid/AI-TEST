"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Key, CheckCircle, AlertCircle, Copy } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function ApiKeySetup() {
  const { toast } = useToast()
  const [apiKey, setApiKey] = useState("")
  const [isValidating, setIsValidating] = useState(false)
  const [isValid, setIsValid] = useState<boolean | null>(null)

  const validateApiKey = async () => {
    if (!apiKey.startsWith("xai-")) {
      setIsValid(false)
      toast({
        title: "Səhv format",
        description: "xAI API key 'xai-' ilə başlamalıdır",
        variant: "destructive",
      })
      return
    }

    setIsValidating(true)
    try {
      const response = await fetch("/api/validate-key", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apiKey }),
      })

      const data = await response.json()
      setIsValid(data.valid)

      if (data.valid) {
        localStorage.setItem("xai_api_key", apiKey)
        toast({
          title: "API Key təsdiqləndi!",
          description: "xAI API key uğurla qeydə alındı",
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

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Key className="h-6 w-6 mr-2" />
            xAI API Key Quraşdırması
          </CardTitle>
          <CardDescription>
            EduTest AZ platformasının AI xüsusiyyətlərini istifadə etmək üçün xAI API key tələb olunur
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* API Key Input */}
          <div className="space-y-3">
            <Label htmlFor="apiKey">xAI API Key</Label>
            <div className="flex space-x-2">
              <Input
                id="apiKey"
                type="password"
                placeholder="xai-..."
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
                  API Key düzgündür və istifadəyə hazırdır!
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
        </CardContent>
      </Card>

      {/* Setup Instructions */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>1. xAI Hesabı Yaradın</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-gray-600">xAI Console saytına daxil olun:</p>
              <div className="flex items-center space-x-2">
                <code className="bg-gray-100 px-2 py-1 rounded text-sm">console.x.ai</code>
                <Button variant="ghost" size="sm" onClick={() => window.open("https://console.x.ai", "_blank")}>
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Addımlar:</p>
              <ol className="list-decimal list-inside text-sm space-y-1">
                <li>Sign Up düyməsini basın</li>
                <li>Email və şifrə daxil edin</li>
                <li>Email təsdiqini tamamlayın</li>
                <li>Console-a daxil olun</li>
              </ol>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>2. API Key Yaradın</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Console-da:</p>
              <ol className="list-decimal list-inside text-sm space-y-1">
                <li>"API Keys" bölməsinə keçin</li>
                <li>"Create API Key" düyməsini basın</li>
                <li>Key-ə ad verin (EduTest-AZ)</li>
                <li>Key-i kopyalayın</li>
              </ol>
            </div>
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-sm">
                API key-i təhlükəsiz yerdə saxlayın. Bir dəfə göstərildikdən sonra yenidən görə bilməyəcəksiniz.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>3. Kredit Əlavə Edin</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Billing məlumatları:</p>
              <ul className="list-disc list-inside text-sm space-y-1">
                <li>Minimum $5-10 kredit əlavə edin</li>
                <li>Kredit kartı tələb olunur</li>
                <li>Test üçün kifayətdir</li>
              </ul>
            </div>
            <div className="bg-blue-50 p-3 rounded">
              <p className="text-sm text-blue-800">
                <strong>Qiymət:</strong> Grok-3 modeli üçün ~$0.50-1.00 per 100 test sualı
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>4. Environment Variable</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Terminal-da:</p>
              <div className="bg-gray-100 p-3 rounded">
                <code className="text-sm">export XAI_API_KEY="xai-your-key-here"</code>
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-2"
                  onClick={() => copyToClipboard('export XAI_API_KEY="xai-your-key-here"')}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Və ya .env faylında:</p>
              <div className="bg-gray-100 p-3 rounded">
                <code className="text-sm">XAI_API_KEY=xai-your-key-here</code>
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-2"
                  onClick={() => copyToClipboard("XAI_API_KEY=xai-your-key-here")}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alternative Solutions */}
      <Card>
        <CardHeader>
          <CardTitle>Alternativ Həllər</CardTitle>
          <CardDescription>xAI API key əldə edə bilmirsinizsə, bu alternativləri sınayın</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Badge variant="secondary">OpenAI API</Badge>
              <p className="text-sm text-gray-600">GPT-4 modeli, daha ucuz qiymət</p>
              <Button variant="outline" size="sm" onClick={() => window.open("https://platform.openai.com", "_blank")}>
                <ExternalLink className="h-4 w-4 mr-2" />
                OpenAI
              </Button>
            </div>
            <div className="space-y-2">
              <Badge variant="secondary">Anthropic Claude</Badge>
              <p className="text-sm text-gray-600">Claude-3 modeli, yaxşı performans</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open("https://console.anthropic.com", "_blank")}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Anthropic
              </Button>
            </div>
            <div className="space-y-2">
              <Badge variant="secondary">Local Model</Badge>
              <p className="text-sm text-gray-600">Ollama ilə pulsuz local model</p>
              <Button variant="outline" size="sm" onClick={() => window.open("https://ollama.ai", "_blank")}>
                <ExternalLink className="h-4 w-4 mr-2" />
                Ollama
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
