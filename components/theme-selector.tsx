"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Palette, Check } from "lucide-react"

interface ThemeOption {
  id: string
  name: string
  primary: string
  secondary: string
  accent: string
  gradient: string
}

const themeOptions: ThemeOption[] = [
  {
    id: "blue",
    name: "Mavi (Klassik)",
    primary: "bg-blue-600",
    secondary: "bg-blue-100",
    accent: "bg-blue-50",
    gradient: "from-primary/20 to-primary/10",
  },
  {
    id: "green",
    name: "Yaşıl (Təbii)",
    primary: "bg-green-600",
    secondary: "bg-green-100",
    accent: "bg-green-50",
    gradient: "from-green-50 to-emerald-100",
  },
  {
    id: "purple",
    name: "Bənövşəyi (Müasir)",
    primary: "bg-purple-600",
    secondary: "bg-purple-100",
    accent: "bg-purple-50",
    gradient: "from-purple-50 to-violet-100",
  },
  {
    id: "red",
    name: "Qırmızı (Enerji)",
    primary: "bg-red-600",
    secondary: "bg-red-100",
    accent: "bg-red-50",
    gradient: "from-red-50 to-rose-100",
  },
  {
    id: "orange",
    name: "Narıncı (İsti)",
    primary: "bg-orange-600",
    secondary: "bg-orange-100",
    accent: "bg-orange-50",
    gradient: "from-orange-50 to-amber-100",
  },
  {
    id: "teal",
    name: "Dəniz Yaşılı (Sakit)",
    primary: "bg-teal-600",
    secondary: "bg-teal-100",
    accent: "bg-teal-50",
    gradient: "from-teal-50 to-cyan-100",
  },
]

interface ThemeSelectorProps {
  selectedTheme: string
  onThemeChange: (theme: string) => void
}

export default function ThemeSelector({ selectedTheme, onThemeChange }: ThemeSelectorProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Palette className="h-5 w-5 mr-2" />
          İnterfeys Rəngi
        </CardTitle>
        <CardDescription>Özünüzə uyğun rəng temasını seçin</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {themeOptions.map((theme) => (
            <button
              key={theme.id}
              onClick={() => onThemeChange(theme.id)}
              className={`relative p-3 rounded-lg border-2 transition-all hover:scale-105 ${
                selectedTheme === theme.id ? "border-gray-800 ring-2 ring-gray-300" : "border-gray-200"
              }`}
            >
              <div className="space-y-2">
                <div className="flex space-x-1">
                  <div className={`w-4 h-4 rounded ${theme.primary}`}></div>
                  <div className={`w-4 h-4 rounded ${theme.secondary}`}></div>
                  <div className={`w-4 h-4 rounded ${theme.accent}`}></div>
                </div>
                <p className="text-xs font-medium text-center">{theme.name}</p>
              </div>
              {selectedTheme === theme.id && (
                <div className="absolute -top-1 -right-1 bg-green-600 text-white rounded-full p-1">
                  <Check className="h-3 w-3" />
                </div>
              )}
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
