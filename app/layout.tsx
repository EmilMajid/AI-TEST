import type React from "react"
import type { Metadata, Viewport } from "next"
import Script from "next/script"
import "./globals.css"

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
}

export const metadata: Metadata = {
  title: "TESTAI.AZ - AI Test Platforması | Azərbaycan Dərslikləri Əsasında",
  description: "Azərbaycan dərslikləri əsasında hazırlanmış süni intellekt dəstəkli test və bilik analiz platforması. Şagirdlər və valideynlər üçün fərdi sınaqlar.",
  keywords: [
    "testai",
    "testai.az",
    "ai test",
    "azərbaycan dərslikləri",
    "onlayn sınaq imtahanı",
    "süni intellekt təhsil",
    "valideyn nəzarəti",
    "məktəb testləri",
  ],
  authors: [{ name: "TESTAI.AZ", url: "https://testai.az" }],
  creator: "TESTAI.AZ",
  metadataBase: new URL("https://testai.az"),
  openGraph: {
    title: "TESTAI.AZ - AI ilə Öyrən, Test Et, İnkişaf Et",
    description: "Azərbaycan dərslikləri əsasında hazırlanmış AI test platforması. Mövzuya uyğun testlər və nəticələrin dərin təhlili.",
    url: "https://testai.az",
    siteName: "TESTAI.AZ",
    locale: "az_AZ",
    type: "website",
  },
  alternates: {
    canonical: "https://testai.az",
  },
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
        {/* Schema.org Structured Data */}
        <Script
          id="schema-organization"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "EducationalOrganization",
              name: "TESTAI.AZ",
              url: "https://testai.az",
              logo: "https://testai.az/logo.jpg",
              description: "Azərbaycan dərslikləri əsasında hazırlanmış süni intellekt dəstəkli test və bilik analiz platforması.",
              email: "aztestai.az@gmail.com",
              sameAs: [
                "https://www.instagram.com/testai.az/",
                "https://www.facebook.com/profile.php?id=61594359745552",
                "https://www.youtube.com/channel/UCSsFhuYKk6MHdLna05kfJrA",
              ],
              contactPoint: {
                "@type": "ContactPoint",
                email: "aztestai.az@gmail.com",
                contactType: "customer support",
                availableLanguage: "Azerbaijani",
              },
            }),
          }}
        />
        <Script
          id="adsbygoogle-init"
          strategy="afterInteractive"
          crossOrigin="anonymous"
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseId}`}
        />
        {/* Meta Pixel Code */}
        <Script
          id="meta-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '2027404764555987');
              fbq('track', 'PageView');
            `,
          }}
        />
        <noscript>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=2027404764555987&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
        {/* End Meta Pixel Code */}
      </head>
      <body className="pb-16 sm:pb-20">
        {children}
        <Toaster />
        <StickyBottomAd />
      </body>
    </html>
  )
}
