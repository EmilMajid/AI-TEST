import { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/about", "/privacy", "/terms", "/contact", "/blog", "/open-tests", "/az/", "/en/", "/tr/", "/ru/"],
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
      {
        userAgent: "Googlebot",
        allow: "/",
      },
    ],
    sitemap: "https://www.testai.az/sitemap.xml",
  }
}
