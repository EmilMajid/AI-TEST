import type React from "react"
import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "EduTest AZ - AI Test Platforması",
  description: "Azərbaycan tələbələri üçün AI-Powered Test və Analiz Platforması",
  generator: "v0.app",
}

import { Toaster } from "@/components/ui/toaster"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="az">
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  )
}
