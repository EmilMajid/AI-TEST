"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Copy, Key, CheckCircle, AlertTriangle, ExternalLink } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function ApiSetupGuide() {
  const { toast } = useToast()
  const [showKey, setShowKey] = useState(false)

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
            OpenAI API Key Quraşdırması
          </CardTitle>
          <CardDescription>AI test yaradıcısını aktivləşdirmək üçün OpenAI API key-inizi quraşdırın</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              <strong>API Key alındı!</strong> İndi onu sistemə əlavə etmək lazımdır.
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">1. Environment Variable Təyin Edin</h3>

            <div className="space-y-3">
              <Label>Terminal-da (Development üçün):</Label>
              <div className="bg-gray-100 p-3 rounded-lg">
                <code className="text-sm">export OPENAI_API_KEY="sk-abcdef1234567890abcdef1234567890abcdef12"</code>
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-2"
                  onClick={() => copyToClipboard('export OPENAI_API_KEY="sk-abcdef1234567890abcdef1234567890abcdef12"')}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              <Label>.env.local faylında (Tövsiyə edilir):</Label>
              <div className="bg-gray-100 p-3 rounded-lg">
                <code className="text-sm">OPENAI_API_KEY=sk-abcdef1234567890abcdef1234567890abcdef12</code>
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-2"
                  onClick={() => copyToClipboard("OPENAI_API_KEY=sk-abcdef1234567890abcdef1234567890abcdef12")}
                >
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
                  Value: <code className="bg-gray-100 px-1 rounded">sk-abcdef1234567890abcdef1234567890abcdef12</code>
                </li>
                <li>Environment: Production, Preview, Development</li>
                <li>Save və Redeploy</li>
              </ol>
            </div>
          </div>

          <Alert className="border-blue-200 bg-blue-50">
            <AlertTriangle className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              <strong>Təhlükəsizlik:</strong> API key-i heç vaxt public repository-də saxlamayın. Həmişə environment
              variables istifadə edin.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>3. Test Edin</CardTitle>
          <CardDescription>API key quraşdırdıqdan sonra sistemi test edin</CardDescription>
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
                <li>Test yaradın və AI cavablarını yoxlayın</li>
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
            <h4 className="font-medium text-green-800 mb-2">Uğurlu quraşdırma əlamətləri:</h4>
            <ul className="list-disc list-inside text-sm text-green-700 space-y-1">
              <li>Test yaradarkən "AI sizin üçün test sualları hazırlayır..." mesajı görünür</li>
              <li>Suallar seçdiyiniz mövzuya uyğun və dəqiq olur</li>
              <li>Hər sualın ətraflı izahatı olur</li>
              <li>Demo mode indicator görünmür</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>OpenAI Qiymət Məlumatları</CardTitle>
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

          <div className="mt-4">
            <Button variant="outline" onClick={() => window.open("https://platform.openai.com/usage", "_blank")}>
              <ExternalLink className="h-4 w-4 mr-2" />
              OpenAI Usage Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
