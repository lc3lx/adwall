import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { LangProvider } from "@/providers/lang-provider"
import Image from "next/image"

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
  variable: "--font-inter",
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    default: "AdWell - جدار الإعلانات العصري",
    template: "%s | AdWell",
  },
  description:
    "AdWell — منصة عصرية لعرض إعلانات الشركات حسب التصنيف والموقع مع أولوية VIP وخيارات تواصل مباشرة متطورة.",
  keywords: ["AdWell", "إعلانات شركات", "دليل شركات", "VIP", "شركة", "إعلانات", "تصنيفات", "عصري", "متطور"],
  openGraph: {
    title: "AdWell - جدار الإعلانات العصري",
    description: "اكتشف شركات حسب التصنيف والموقع، تواصل مباشرة، وفعّل VIP للظهور المميز في منصة عصرية ومتطورة.",
    url: "/",
    siteName: "AdWell",
    locale: "ar_AR",
    type: "website",
    images: [{ url: "/images/adwell-logo.jpg", width: 512, height: 512, alt: "AdWell" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "AdWell - جدار الإعلانات العصري",
    description: "اكتشف شركات حسب التصنيف والموقع، تواصل مباشرة، وفعّل VIP للظهور المميز.",
    images: ["/images/adwell-logo.jpg"],
  },
  alternates: {
    canonical: "/",
    languages: {
      en: "/",
      ar: "/",
    },
  },
  robots: {
    index: true,
    follow: true,
  },
    generator: 'v0.app'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning className={inter.variable}>
      <body className={`${inter.className} font-sans`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <LangProvider>
            {/* شعار صغير مخفي للـ SEO */}
            <div className="sr-only" aria-hidden>
              <Image src="/images/adwell-logo.jpg" alt="AdWell Logo" width={32} height={32} />
            </div>

            {/* JSON-LD منظمة لموقع/منظمة */}
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  "@context": "https://schema.org",
                  "@type": "Organization",
                  name: "AdWell",
                  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
                  logo: "/images/adwell-logo.jpg",
                  description: "منصة عصرية لعرض إعلانات الشركات",
                  sameAs: [],
                }),
              }}
            />

            {children}
          </LangProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
