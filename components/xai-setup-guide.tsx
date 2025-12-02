"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Copy, Zap, CheckCircle, ExternalLink, Star } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function XaiSetupGuide() {
  const { toast } = useToast()

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
            <Zap className="h-6 w-6 mr-2 text-purple-600" />
            xAI Grok API Key Quraşdırması
          </CardTitle>
          <CardDescription>
            Grok-3 modeli ilə AI test yaradıcısını aktivləşdirmək üçün xAI API key-inizi quraşdırın
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              <strong>xAI API Key alındı!</strong> İndi onu sistemə əlavə etmək lazımdır.
            </AlertDescription>
          </Alert>

          <Alert className="border-purple-200 bg-purple-50">
            <Star className="h-4 w-4 text-purple-600" />
            <AlertDescription className="text-purple-800">
              <strong>Grok-3 Üstünlükləri:</strong> Ən yeni model, yüksək performans, Azərbaycan dili dəstəyi
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">1. Environment Variable Təyin Edin</h3>

            <div className="space-y-3">
              <Label>Terminal-da (Development üçün):</Label>
              <div className="bg-gray-100 p-3 rounded-lg">
                <code className="text-sm">
                  export
                  XAI_API_KEY="xai-B4n95hnsgqRnqmBZFo5nNaRpYf1v7Y8XhyYxlCqIhH7BJC1AqKV6fsRC8EJfCMoOFw8EeGEAEHk32qnN"
                </code>
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-2"
                  onClick={() =>
                    copyToClipboard(
                      'export XAI_API_KEY="xai-B4n95hnsgqRnqmBZFo5nNaRpYf1v7Y8XhyYxlCqIhH7BJC1AqKV6fsRC8EJfCMoOFw8EeGEAEHk32qnN"',
                    )
                  }
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              <Label>.env.local faylında (Tövsiyə edilir):</Label>
              <div className="bg-gray-100 p-3 rounded-lg">
                <code className="text-sm">
                  XAI_API_KEY=xai-B4n95hnsgqRnqmBZFo5nNaRpYf1v7Y8XhyYxlCqIhH7BJC1AqKV6fsRC8EJfCMoOFw8EeGEAEHk32qnN
                </code>
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-2"
                  onClick={() =>
                    copyToClipboard(
                      "XAI_API_KEY=xai-B4n95hnsgqRnqmBZFo5nNaRpYf1v7Y8XhyYxlCqIhH7BJC1AqKV6fsRC8EJfCMoOFw8EeGEAEHk32qnN",
                    )
                  }
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
                  Name: <code className="bg-gray-100 px-1 rounded">XAI_API_KEY</code>
                </li>
                <li>
                  Value:{" "}
                  <code className="bg-gray-100 px-1 rounded">
                    xai-B4n95hnsgqRnqmBZFo5nNaRpYf1v7Y8XhyYxlCqIhH7BJC1AqKV6fsRC8EJfCMoOFw8EeGEAEHk32qnN
                  </code>
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
          <CardDescription>xAI API key quraşdırdıqdan sonra Grok-3 modelini test edin</CardDescription>
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
                <li>Test yaradın və Grok AI cavablarını yoxlayın</li>
              </ol>
            </div>
            <div>
              <h4 className="font-medium mb-2">Production Test:</h4>
              <ol className="list-decimal list-inside text-sm space-y-1">
                <li>Vercel-də environment variable əlavə edin</li>
                <li>Proyekti redeploy edin</li>
                <li>Live saytda test yaradın</li>
                <li>Grok-3 generated sualları yoxlayın</li>
              </ol>
            </div>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg">
            <h4 className="font-medium text-purple-800 mb-2">Grok-3 ilə uğurlu quraşdırma əlamətləri:</h4>
            <ul className="list-disc list-inside text-sm text-purple-700 space-y-1">
              <li>Test yaradarkən "Grok AI sizin üçün test sualları hazırlayır..." mesajı</li>
              <li>Status indicator-da "Grok AI Aktiv" badge-i</li>
              <li>Suallar çox dəqiq və mövzuya uyğun</li>
              <li>Azərbaycan dili dəstəyi mükəmməl</li>
              <li>Ətraflı və keyfiyyətli izahatlar</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>xAI Grok Qiymət Məlumatları</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2">Grok-3 Qiymətləri:</h4>
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
            <Button variant="outline" onClick={() => window.open("https://console.x.ai/usage", "_blank")}>
              <ExternalLink className="h-4 w-4 mr-2" />
              xAI Usage Dashboard
            </Button>
            <Button variant="outline" onClick={() => window.open("https://console.x.ai", "_blank")}>
              <ExternalLink className="h-4 w-4 mr-2" />
              xAI Console
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
