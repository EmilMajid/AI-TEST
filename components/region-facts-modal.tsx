"use client"

import type React from "react"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Info, MapPin, Users, Calendar, Landmark, Mountain, Star, Utensils } from "lucide-react"

interface RegionFactsModalProps {
  region: string
  children: React.ReactNode
}

const regionData = {
  Bakı: {
    name: "Bakı",
    subtitle: "Azərbaycanın paytaxtı və ən böyük şəhəri",
    population: "2.3 milyon",
    founded: "5-ci əsr",
    area: "2,130 km²",
    famousFor: ["Neft sənayesi", "Flame Towers", "İçərişəhər", "Xəzər dənizi"],
    historicalFacts: [
      "Dünyanın ən qədim neft hasilatı mərkəzlərindən biri",
      "UNESCO Dünya İrsi siyahısında İçərişəhər",
      "Qız qalası 12-ci əsrdən qalma abidədir",
      "19-cu əsrdə dünyanın neft paytaxtı idi",
    ],
    geography:
      "Abşeron yarımadasında, Xəzər dənizi sahilində yerləşir. Şəhər 28 metr dəniz səviyyəsindən aşağıda yerləşir.",
    culturalSites: ["İçərişəhər", "Qız qalası", "Şirvanşahlar sarayı", "Flame Towers", "Heydər Əliyev Mərkəzi"],
    localCuisine: ["Balıq kebabı", "Xəzər kürüsü", "Şah plov", "Dövğa", "Qutab"],
    funFacts: [
      "Flame Towers gecələr Azərbaycan bayrağının rənglərində işıqlandırılır",
      "Bakı metrosu SSRİ-də Moskva və Leninqraddan sonra üçüncü metro sistemi idi",
      "Şəhərdə 40-dan çox muzey fəaliyyət göstərir",
    ],
    climate: "Yarı səhra iqlimi, isti yaylar və mülayim qışlar",
    icon: <Landmark className="h-6 w-6" />,
    color: "from-blue-500 to-cyan-500",
  },
  Gəncə: {
    name: "Gəncə",
    subtitle: "Azərbaycanın ikinci ən böyük şəhəri",
    population: "335 min",
    founded: "5-6-cı əsr",
    area: "110 km²",
    famousFor: ["Nizami Gəncəvi", "Şüşə sənayesi", "Gəncə İmamzadəsi"],
    historicalFacts: [
      "Böyük şair Nizami Gəncəvinin doğulduğu şəhər",
      "Qədim İpək yolunun mühüm mərkəzi",
      "Sovet dövründə Kirovabad adlanırdı",
      "Azərbaycanın sənaye mərkəzlərindən biri",
    ],
    geography: "Kiçik Qafqaz dağlarının ətəyində, Gəncəçay vadisində yerləşir",
    culturalSites: ["Nizami məqbərəsi", "Gəncə İmamzadəsi", "Şəhər bağı", "Cavad xan küçəsi"],
    localCuisine: ["Gəncə dovğası", "Badımcan dolması", "Şəkər çörəyi", "Gəncə somonu"],
    funFacts: [
      "Nizami Gəncəvi dünya ədəbiyyatının ən böyük şairlərindən biridir",
      "Şəhərdə Azərbaycanın ən böyük şüşə zavodları yerləşir",
      "Gəncə çörəyi bütün Azərbaycanda məşhurdur",
    ],
    climate: "Mülayim kontinental iqlim",
    icon: <Mountain className="h-6 w-6" />,
    color: "from-green-500 to-emerald-500",
  },
  Şəki: {
    name: "Şəki",
    subtitle: "Qafqazın incisi və tarixi şəhər",
    population: "68 min",
    founded: "8-ci əsr",
    area: "2,010 km²",
    famousFor: ["Şəki xan sarayı", "Şəbəkə sənəti", "Şəki halvası"],
    historicalFacts: [
      "18-ci əsrdə Şəki xanlığının paytaxtı",
      "Şəbəkə sənəti UNESCO siyahısında",
      "Qafqazın ən gözəl saraylarından birinə ev sahibliyi edir",
      "İpək yolunun mühüm dayanacağı",
    ],
    geography: "Böyük Qafqaz dağlarının cənub ətəklərində, 500-850 metr hündürlükdə",
    culturalSites: ["Şəki xan sarayı", "Kiş məbədi", "Yuxarı və Aşağı karvansara", "Şəki qalası"],
    localCuisine: ["Şəki halvası", "Piti", "Girmabadam", "Şəki paklavası"],
    funFacts: [
      "Şəki halvası 500 illik tarixi olan ənənəvi şirniyyatdır",
      "Xan sarayının şəbəkələri heç bir mismar istifadə edilmədən hazırlanıb",
      "Şəhər adını şəki ağacından götürüb",
    ],
    climate: "Mülayim dağ iqlimi, sərin yaylar",
    icon: <Mountain className="h-6 w-6" />,
    color: "from-amber-500 to-orange-500",
  },
}

export default function RegionFactsModal({ region, children }: RegionFactsModalProps) {
  const [open, setOpen] = useState(false)
  const regionInfo = regionData[region as keyof typeof regionData]

  if (!regionInfo) return <>{children}</>

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-full bg-gradient-to-r ${regionInfo.color} text-white`}>{regionInfo.icon}</div>
            <div>
              <DialogTitle className="text-2xl">{regionInfo.name}</DialogTitle>
              <DialogDescription className="text-base">{regionInfo.subtitle}</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6 mt-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Basic Info */}
            <div className="space-y-3">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Info className="h-5 w-5" />
                Əsas məlumatlar
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-gray-500" />
                  <span>Əhali: {regionInfo.population}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span>Təsis: {regionInfo.founded}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span>Sahə: {regionInfo.area}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mountain className="h-4 w-4 text-gray-500" />
                  <span>İqlim: {regionInfo.climate}</span>
                </div>
              </div>
            </div>

            <Separator />

            {/* Geography */}
            <div className="space-y-3">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Coğrafi mövqe
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">{regionInfo.geography}</p>
            </div>

            <Separator />

            {/* Famous For */}
            <div className="space-y-3">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Star className="h-5 w-5" />
                Məşhurdur
              </h3>
              <div className="flex flex-wrap gap-2">
                {regionInfo.famousFor.map((item, index) => (
                  <Badge key={index} variant="secondary" className="text-sm">
                    {item}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Historical Facts */}
            <div className="space-y-3">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Landmark className="h-5 w-5" />
                Tarixi faktlar
              </h3>
              <ul className="space-y-2">
                {regionInfo.historicalFacts.map((fact, index) => (
                  <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                    <span className="text-blue-500 mt-1 font-bold">•</span>
                    <span className="leading-relaxed">{fact}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Separator />

            {/* Fun Facts */}
            <div className="space-y-3">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Star className="h-5 w-5" />
                Maraqlı faktlar
              </h3>
              <ul className="space-y-2">
                {regionInfo.funFacts.map((fact, index) => (
                  <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                    <span className="text-green-500 mt-1 font-bold">✦</span>
                    <span className="leading-relaxed">{fact}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Full Width Sections */}
        <div className="space-y-6 mt-6">
          <Separator />

          {/* Cultural Sites */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Landmark className="h-5 w-5" />
              Mədəni abidələr və görməli yerlər
            </h3>
            <div className="flex flex-wrap gap-2">
              {regionInfo.culturalSites.map((site, index) => (
                <Badge key={index} variant="outline" className="text-sm">
                  {site}
                </Badge>
              ))}
            </div>
          </div>

          <Separator />

          {/* Local Cuisine */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Utensils className="h-5 w-5" />
              Yerli mətbəx və xüsusi yeməklər
            </h3>
            <div className="flex flex-wrap gap-2">
              {regionInfo.localCuisine.map((dish, index) => (
                <Badge key={index} variant="secondary" className="text-sm bg-orange-100 text-orange-800">
                  {dish}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
