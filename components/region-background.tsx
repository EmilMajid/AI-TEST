"use client"

import type React from "react"

import { useEffect, useState } from "react"

interface RegionBackgroundProps {
  region: string
  children: React.ReactNode
  theme: string
}

const regionBackgrounds: Record<string, string> = {
  Bakı: "/images/regions/baki-flame-towers.jpg",
  Gəncə: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1920&h=1080&fit=crop",
  Sumqayıt: "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=1920&h=1080&fit=crop",
  Şəki: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1920&h=1080&fit=crop",
  Quba: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop",
  Şuşa: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1920&h=1080&fit=crop",
  Lənkəran: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop",
  Qəbələ: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop",
  Şamaxı: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1920&h=1080&fit=crop",
  Naxçıvan: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1920&h=1080&fit=crop",
}

const themeGradients: Record<string, string> = {
  blue: "from-primary/20 to-primary/10",
  green: "from-green-50/90 to-emerald-100/90",
  purple: "from-purple-50/90 to-violet-100/90",
  red: "from-red-50/90 to-rose-100/90",
  orange: "from-orange-50/90 to-amber-100/90",
  teal: "from-teal-50/90 to-cyan-100/90",
}

export default function RegionBackground({ region, children, theme }: RegionBackgroundProps) {
  const [backgroundImage, setBackgroundImage] = useState<string>("")

  useEffect(() => {
    const bgImage = regionBackgrounds[region]
    if (bgImage) {
      setBackgroundImage(bgImage)
    } else {
      setBackgroundImage("")
    }
  }, [region])

  const gradientClass = themeGradients[theme] || themeGradients.blue

  return (
    <div className="min-h-screen relative">
      {/* Background Image */}
      {backgroundImage && (
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${backgroundImage})`,
          }}
        />
      )}

      {/* Gradient Overlay */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradientClass}`} />

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  )
}
