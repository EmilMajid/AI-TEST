import { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        // Bütün crawlerlər: ictimai hissə açıq, privat bölmələr qapalı
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin/",
          "/api/",
          "/dashboard/",
          "/parent-dashboard/",
          "/profile/",
          "/setup/",
        ],
      },
      {
        userAgent: "Mediapartners-Google",
        allow: "/",
      },
    ],
    sitemap: "https://www.testai.az/sitemap.xml",
  }
}
