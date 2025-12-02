"use client"

import { useState, useEffect } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, Zap, EyeOff, RefreshCw, AlertTriangle } from "lucide-react"

interface ApiStatus {
  hasApiKeys: boolean
  providers: {
    xai: boolean
    openai: boolean
  }
  mode: string
  preferredProvider: string
  warnings?: string[]
  debug?: {
    xaiKeyFormat: string
    openaiKeyFormat: string
  }
}

export default function AiStatusIndicator() {
  const [status, setStatus] = useState<ApiStatus | null>(null)
  const [isVisible, setIsVisible] = useState(true)
  const [isLoading, setIsLoading] = useState(true)

  const checkStatus = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/check-api-status")
      const data = await response.json()
      setStatus(data)
    } catch (error) {
      console.error("Failed to check API status:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    checkStatus()
  }, [])

  if (!isVisible || isLoading) {
    return null
  }

  if (!status) {
    return null
  }

  const getStatusInfo = () => {
    // Xəbərdarlıq varsa, onu göstər
    if (status.warnings && status.warnings.length > 0) {
      return {
        icon: <AlertTriangle className="h-4 w-4 text-yellow-600" />,
        badge: <Badge className="bg-yellow-100 text-yellow-800">API Key Xətası</Badge>,
        message: status.warnings[0],
        color: "yellow",
      }
    }

    if (status.providers.xai) {
      return {
        icon: <Zap className="h-4 w-4 text-purple-600" />,
        badge: <Badge className="bg-purple-100 text-purple-800">Grok AI Aktiv</Badge>,
        message: "xAI Grok-3 modeli ilə AI test yaradıcısı aktiv",
        color: "purple",
      }
    } else if (status.providers.openai) {
      return {
        icon: <CheckCircle className="h-4 w-4 text-green-600" />,
        badge: <Badge className="bg-green-100 text-green-800">OpenAI Aktiv</Badge>,
        message: "OpenAI GPT-4o modeli ilə AI test yaradıcısı aktiv",
        color: "green",
      }
    } else {
      return {
        icon: <CheckCircle className="h-4 w-4 text-blue-600" />,
        badge: <Badge className="bg-blue-100 text-blue-800">Demo Rejimi</Badge>,
        message: "Demo test sualları istifadə edilir",
        color: "blue",
      }
    }
  }

  const statusInfo = getStatusInfo()

  return (
    <Alert className={`border-${statusInfo.color}-200 bg-${statusInfo.color}-50 mb-4`}>
      {statusInfo.icon}
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <AlertDescription className={`text-${statusInfo.color}-800`}>
            <div className="flex items-center space-x-2">
              {statusInfo.badge}
              <span>{statusInfo.message}</span>
            </div>
            {status.debug && (
              <div className="mt-2 text-xs space-y-1">
                <p>xAI Key: {status.debug.xaiKeyFormat}</p>
                <p>OpenAI Key: {status.debug.openaiKeyFormat}</p>
              </div>
            )}
          </AlertDescription>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={checkStatus}
            className={`text-${statusInfo.color}-600 hover:text-${statusInfo.color}-800`}
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsVisible(false)}
            className={`text-${statusInfo.color}-600 hover:text-${statusInfo.color}-800`}
          >
            <EyeOff className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Alert>
  )
}
