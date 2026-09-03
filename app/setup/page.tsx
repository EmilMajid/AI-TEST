"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, AlertTriangle, RefreshCw, Star } from "lucide-react"
import XaiSetupGuide from "@/components/xai-setup-guide"
import RealOpenAISetupGuide from "@/components/real-openai-setup-guide"

interface ApiStatus {
  hasApiKeys: boolean
  providers: {
    xai: boolean
    openai: boolean
  }
  warnings?: string[]
  debug?: {
    xaiKeyFormat: string
    openaiKeyFormat: string
    openaiPrefix?: string
  }
}

export default function SetupPage() {
  const [apiStatus, setApiStatus] = useState<ApiStatus | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const checkApiStatus = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/check-api-status")
      const data = await response.json()
      setApiStatus(data)
    } catch (error) {
      console.error("API status yoxlanılarkən xəta:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    checkApiStatus()
  }, [])

  const getStatusCard = () => {
    if (isLoading) {
      return (
        <Card>
          <CardContent className="p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>API status yoxlanılır...</p>
          </CardContent>
        </Card>
      )
    }

    if (!apiStatus) {
      return (
        <Card>
          <CardContent className="p-6 text-center">
            <AlertTriangle className="h-8 w-8 text-red-600 mx-auto mb-4" />
            <p>API status yoxlanıla bilmədi</p>
          </CardContent>
        </Card>
      )
    }

    const hasWarnings = apiStatus.warnings && apiStatus.warnings.length > 0
    const isRealOpenAI = apiStatus.debug?.openaiPrefix?.includes("sk-proj-")

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>API Status</span>
            <Button variant="ghost" size="sm" onClick={checkApiStatus}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {hasWarnings && (
            <Alert className="border-yellow-200 bg-yellow-50">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <AlertDescription className="text-yellow-800">
                <strong>Xəbərdarlıq:</strong> {apiStatus.warnings![0]}
              </AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium">xAI (Grok):</span>
                {apiStatus.providers.xai ? (
                  <Badge className="bg-green-100 text-green-800">Aktiv</Badge>
                ) : (
                  <Badge variant="secondary">Qeyri-aktiv</Badge>
                )}
              </div>
              {apiStatus.debug && <p className="text-xs text-gray-600">Format: {apiStatus.debug.xaiKeyFormat}</p>}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium">OpenAI:</span>
                <div className="flex items-center space-x-1">
                  {apiStatus.providers.openai ? (
                    <Badge className="bg-green-100 text-green-800">Aktiv</Badge>
                  ) : (
                    <Badge variant="secondary">Qeyri-aktiv</Badge>
                  )}
                  {isRealOpenAI && <Star className="h-4 w-4 text-yellow-500" />}
                </div>
              </div>
              {apiStatus.debug && (
                <div className="text-xs text-gray-600">
                  <p>Format: {apiStatus.debug.openaiKeyFormat}</p>
                  {isRealOpenAI && <p className="text-green-600 font-medium">Real API Key ✓</p>}
                </div>
              )}
            </div>
          </div>

          {apiStatus.hasApiKeys ? (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                <div className="flex items-center space-x-2">
                  <span>AI test yaradıcısı aktiv! Test yarada bilərsiniz.</span>
                  {isRealOpenAI && (
                    <Badge className="bg-yellow-100 text-yellow-800">
                      <Star className="h-3 w-3 mr-1" />
                      Premium
                    </Badge>
                  )}
                </div>
              </AlertDescription>
            </Alert>
          ) : (
            <Alert className="border-blue-200 bg-blue-50">
              <AlertDescription className="text-blue-800">
                AI test yaradıcısını aktivləşdirmək üçün aşağıdakı təlimatları izləyin.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 to-primary/10">
      <div className="container mx-auto py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">TESTAI.AZ Quraşdırması</h1>
          <p className="text-lg text-gray-600">Real AI xüsusiyyətlərini aktivləşdirmək üçün API key quraşdırın</p>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          {getStatusCard()}

          <Tabs defaultValue="openai">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="openai" className="flex items-center space-x-2">
                <span>OpenAI GPT-4</span>
                <Star className="h-4 w-4 text-yellow-500" />
                <span className="text-xs">(Real)</span>
              </TabsTrigger>
              <TabsTrigger value="xai">xAI Grok</TabsTrigger>
            </TabsList>

            <TabsContent value="openai">
              <RealOpenAISetupGuide />
            </TabsContent>

            <TabsContent value="xai">
              <XaiSetupGuide />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
