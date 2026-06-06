"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, AlertCircle, RefreshCw } from "lucide-react"

export default function BackendStatus() {
  const [status, setStatus] = useState<"checking" | "online" | "offline" | "fallback">("checking")
  const [backendUrl, setBackendUrl] = useState<string>("")
  const [lastCheck, setLastCheck] = useState<string>("")

  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_BACKEND_URL
    setBackendUrl(url || "Təyin edilməyib")
    checkBackendStatus()
  }, [])

  const checkBackendStatus = async () => {
    setStatus("checking")

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL
    if (!backendUrl) {
      setStatus("fallback")
      setLastCheck(new Date().toLocaleTimeString("az-AZ"))
      return
    }

    try {
      const response = await fetch("/api/backend/textbooks?class_filter=7", {
        method: "GET",
        cache: "no-store",
      })

      if (response.ok) {
        const data = await response.json()
        // Check if we got real backend data or fallback
        if (data.textbooks && data.textbooks.length > 0 && data.textbooks[0].source) {
          setStatus("online")
        } else {
          setStatus("fallback")
        }
      } else {
        setStatus("offline")
      }
    } catch (error) {
      setStatus("fallback")
    }

    setLastCheck(new Date().toLocaleTimeString("az-AZ"))
  }

  const getStatusInfo = () => {
    switch (status) {
      case "checking":
        return {
          icon: <RefreshCw className="h-4 w-4 animate-spin text-blue-600" />,
          badge: <Badge variant="secondary">Yoxlanır...</Badge>,
          message: "Backend statusu yoxlanılır",
        }
      case "online":
        return {
          icon: <CheckCircle className="h-4 w-4 text-green-600" />,
          badge: <Badge className="bg-green-100 text-green-800">Aktiv</Badge>,
          message: "Backend server uğurla əlçatandır",
        }
      case "offline":
        return {
          icon: <XCircle className="h-4 w-4 text-red-600" />,
          badge: <Badge variant="destructive">Offline</Badge>,
          message: "Backend serverə qoşulmaq mümkün deyil",
        }
      case "fallback":
        return {
          icon: <AlertCircle className="h-4 w-4 text-yellow-600" />,
          badge: <Badge className="bg-yellow-100 text-yellow-800">Fallback</Badge>,
          message: "Demo məlumatları istifadə edilir",
        }
    }
  }

  const statusInfo = getStatusInfo()

  return (
    <Card>
      
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {statusInfo.icon}
            <span className="font-medium">Status:</span>
          </div>
          {statusInfo.badge}
        </div>

        <div>
          <span className="font-medium">Backend URL:</span>
          <span className="ml-2 text-sm text-gray-500 break-all">{backendUrl}</span>
        </div>

        <div>
          <span className="font-medium">Son yoxlanış:</span>
          <span className="ml-2 text-sm text-gray-500">{lastCheck || "Yoxlanılır..."}</span>
        </div>

        <div className="pt-2">
          <Button variant="outline" size="sm" onClick={checkBackendStatus} disabled={status === "checking"}>
            <RefreshCw className={`mr-2 h-4 w-4 ${status === "checking" ? "animate-spin" : ""}`} />
            Yenilə
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
