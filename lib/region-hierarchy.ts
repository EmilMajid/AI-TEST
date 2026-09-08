export interface SubRegion {
  name: string
  symbol: string
  type: "district" | "village" | "settlement"
}

export interface RegionHierarchy {
  name: string
  symbol: string
  description: string
  subRegions?: SubRegion[]
}

export const regionHierarchy: Record<string, RegionHierarchy> = {
  Bakı: {
    name: "Bakı",
    symbol: "🏙️",
    description: "Paytaxt şəhəri",
    subRegions: [
      { name: "Səbail rayonu", symbol: "🏛️", type: "district" },
      { name: "Nəsimi rayonu", symbol: "🏢", type: "district" },
      { name: "Yasamal rayonu", symbol: "🏘️", type: "district" },
      { name: "Nərimanov rayonu", symbol: "🏬", type: "district" },
      { name: "Binəqədi rayonu", symbol: "🏭", type: "district" },
      { name: "Suraxanı rayonu", symbol: "🛢️", type: "district" },
      { name: "Sabunçu rayonu", symbol: "🏗️", type: "district" },
      { name: "Xəzər rayonu", symbol: "🌊", type: "district" },
      { name: "Pirallahı rayonu", symbol: "🏝️", type: "district" },
      { name: "Xətai rayonu", symbol: "🏙️", type: "district" },
    ],
  },
  Gəncə: {
    name: "Gəncə",
    symbol: "🏭",
    description: "Sənaye mərkəzi",
    subRegions: [
      { name: "Kəpəz rayonu", symbol: "🏘️", type: "district" },
      { name: "Nizami rayonu", symbol: "🏛️", type: "district" },
    ],
  },
  Sumqayıt: {
    name: "Sumqayıt",
    symbol: "⚗️",
    description: "Kimya sənayesi",
    subRegions: [
      { name: "1 saylı rayon", symbol: "🏭", type: "district" },
      { name: "2 saylı rayon", symbol: "🏘️", type: "district" },
      { name: "3 saylı rayon", symbol: "🏢", type: "district" },
      { name: "4 saylı rayon", symbol: "🏬", type: "district" },
      { name: "5 saylı rayon", symbol: "🏙️", type: "district" },
    ],
  },
  Şəki: {
    name: "Şəki",
    symbol: "🏰",
    description: "Xan sarayı",
    subRegions: [
      { name: "Şəki şəhəri", symbol: "🏰", type: "settlement" },
      { name: "Kişlə kəndi", symbol: "🏘️", type: "village" },
      { name: "Baş Layısqı", symbol: "🏔️", type: "village" },
      { name: "Aşağı Layısqı", symbol: "🌲", type: "village" },
      { name: "İnçə kəndi", symbol: "🌿", type: "village" },
      { name: "Qoxmuq kəndi", symbol: "🏞️", type: "village" },
      { name: "Baş Göynük", symbol: "🌊", type: "village" },
      { name: "Aşağı Göynük", symbol: "🌊", type: "village" },
    ],
  },
  Quba: {
    name: "Quba",
    symbol: "🧶",
    description: "Xalça mərkəzi",
    subRegions: [
      { name: "Quba şəhəri", symbol: "🏘️", type: "settlement" },
      { name: "Qırmızı Qəsəbə", symbol: "🏘️", type: "village" },
      { name: "Xınalıq kəndi", symbol: "🏔️", type: "village" },
      { name: "Laza kəndi", symbol: "🌲", type: "village" },
      { name: "Qrız kəndi", symbol: "🏔️", type: "village" },
      { name: "Xudat qəsəbəsi", symbol: "🏘️", type: "settlement" },
      { name: "Qonaqkənd", symbol: "🌿", type: "village" },
    ],
  },
  Şuşa: {
    name: "Şuşa",
    symbol: "🎵",
    description: "Musiqi mərkəzi",
    subRegions: [
      { name: "Şuşa şəhəri", symbol: "🎵", type: "settlement" },
      { name: "Malıbəyli", symbol: "🏘️", type: "village" },
      { name: "Edişə", symbol: "🌿", type: "village" },
      { name: "Qaradağlı", symbol: "🏔️", type: "village" },
    ],
  },
  Qəbələ: {
    name: "Qəbələ",
    symbol: "🏔️",
    description: "Turizm mərkəzi",
    subRegions: [
      { name: "Qəbələ şəhəri", symbol: "🏘️", type: "settlement" },
      { name: "Nij kəndi", symbol: "🏛️", type: "village" },
      { name: "Çuxur Qəbələ", symbol: "🌲", type: "village" },
      { name: "Vandam kəndi", symbol: "🏔️", type: "village" },
      { name: "Durca kəndi", symbol: "🌿", type: "village" },
      { name: "Hamzalı kəndi", symbol: "🏞️", type: "village" },
    ],
  },
  Lənkəran: {
    name: "Lənkəran",
    symbol: "🍃",
    description: "Çay plantasiyaları",
    subRegions: [
      { name: "Lənkəran şəhəri", symbol: "🏘️", type: "settlement" },
      { name: "Hirkan kəndi", symbol: "🌲", type: "village" },
      { name: "Boradigah", symbol: "🍃", type: "village" },
      { name: "Şıxəkəran", symbol: "🌿", type: "village" },
      { name: "Gərmətük", symbol: "🏞️", type: "village" },
    ],
  },
  Mingəçevir: {
    name: "Mingəçevir",
    symbol: "⚡",
    description: "Enerji mərkəzi",
    subRegions: [
      { name: "1 saylı mikrorayon", symbol: "🏘️", type: "district" },
      { name: "2 saylı mikrorayon", symbol: "🏢", type: "district" },
      { name: "3 saylı mikrorayon", symbol: "🏬", type: "district" },
      { name: "4 saylı mikrorayon", symbol: "🏙️", type: "district" },
    ],
  },
  Naxçıvan: {
    name: "Naxçıvan",
    symbol: "🏛️",
    description: "Muxtar Respublika",
    subRegions: [
      { name: "Naxçıvan şəhəri", symbol: "🏛️", type: "settlement" },
      { name: "Culfa rayonu", symbol: "🏔️", type: "district" },
      { name: "Ordubad rayonu", symbol: "🍇", type: "district" },
      { name: "Şərur rayonu", symbol: "🌾", type: "district" },
      { name: "Şahbuz rayonu", symbol: "🏔️", type: "district" },
      { name: "Babək rayonu", symbol: "🏘️", type: "district" },
      { name: "Kəngərli rayonu", symbol: "🌿", type: "district" },
    ],
  },
}

// Add other regions without sub-regions
const otherRegions = [
  "Naftalan",
  "Şirvan",
  "Yevlax",
  "Abşeron",
  "Ağcabədi",
  "Ağdam",
  "Ağdaş",
  "Ağstafa",
  "Ağsu",
  "Astara",
  "Balakən",
  "Bərdə",
  "Beyləqan",
  "Biləsuvar",
  "Cəbrayıl",
  "Cəlilabad",
  "Culfa",
  "Daşkəsən",
  "Füzuli",
  "Gədəbəy",
  "Goranboy",
  "Göyçay",
  "Göygöl",
  "Hacıqabul",
  "İmişli",
  "İsmayıllı",
  "Kəlbəcər",
  "Kürdəmir",
  "Laçın",
  "Lerik",
  "Masallı",
  "Neftçala",
  "Oğuz",
  "Ordubad",
  "Qax",
  "Qazax",
  "Qobustan",
  "Qubadlı",
  "Qusar",
  "Saatlı",
  "Sabirabad",
  "Şabran",
  "Şahbuz",
  "Şəmkir",
  "Şərur",
  "Tərtər",
  "Tovuz",
  "Ucar",
  "Xaçmaz",
  "Xankəndi",
  "Xızı",
  "Xocalı",
  "Xocavənd",
  "Yardımlı",
  "Zəngilan",
  "Zaqatala",
  "Zərdab",
]

// Add other regions to the hierarchy without sub-regions
otherRegions.forEach((region) => {
  if (!regionHierarchy[region]) {
    // Import from the original region symbols
    const regionInfo = {
      name: region,
      symbol: "🏘️", // default symbol
      description: "Rayon mərkəzi",
    }
    regionHierarchy[region] = regionInfo
  }
})

export const getRegionHierarchy = (regionName: string): RegionHierarchy | null => {
  return regionHierarchy[regionName] || null
}

export const hasSubRegions = (regionName: string): boolean => {
  const region = regionHierarchy[regionName]
  return Boolean(region?.subRegions && region.subRegions.length > 0)
}

export const getSubRegions = (regionName: string): SubRegion[] => {
  const region = regionHierarchy[regionName]
  return region?.subRegions || []
}
