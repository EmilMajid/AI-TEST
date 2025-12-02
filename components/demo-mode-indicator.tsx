"use client"

import { useState, useEffect } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Info, EyeOff } from "lucide-react"

export default function DemoModeIndicator() {
  const [isDemoMode, setIsDemoMode] = useState(true)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    // Check if any API keys are configured
    const checkApiKeys = async () => {
      try {
        const response = await fetch("/api/check-api-status")
        const data = await response.json()
        setIsDemoMode(!data.hasApiKeys)
      } catch (error) {
        setIsDemoMode(true) // Assume demo mode if check fails
      }
    }

    checkApiKeys()
  }, [])

  if (!isDemoMode || !isVisible) {
    return null
  }

  return (
    <Alert className="border-blue-200 bg-blue-50 mb-4">
      <Info className="h-4 w-4 text-blue-600" />
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <AlertDescription className="text-blue-800">
            <div className="flex items-center space-x-2">
              <Badge className="bg-blue-100 text-blue-800">Demo Rejimi</Badge>
              <span>AI API key təyin edilməyib. Sistem demo sualları istifadə edir.</span>
            </div>
          </AlertDescription>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsVisible(false)}
          className="text-blue-600 hover:text-blue-800"
        >
          <EyeOff className="h-4 w-4" />
        </Button>
      </div>
    </Alert>
  )
}
