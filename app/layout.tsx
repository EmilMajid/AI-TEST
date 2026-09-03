import type React from "react"
import type { Metadata } from "next"
import Script from "next/script"
import "./globals.css"

export const metadata: Metadata = {
  title: "TESTAI.AZ - AI Test Platforması",
  description: "Azərbaycan tələbələri üçün AI-Powered Test və Analiz Platforması",
  generator: "v0.app",
}

import { Toaster } from "@/components/ui/toaster"
import { StickyBottomAd } from "@/components/ads/sticky-bottom-ad"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const adsenseId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || "ca-pub-1166444768651699"

  return (
    <html lang="az">
      <head>
        <meta name="google-adsense-account" content="ca-pub-1166444768651699" />
        <Script
          id="adsbygoogle-init"
          strategy="afterInteractive"
          crossOrigin="anonymous"
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseId}`}
        />
      </head>
      <body className="pb-16 sm:pb-20">
        {children}
        <Toaster />
        <StickyBottomAd />
      </body>
    </html>
  )
}
