"use client"

import { Button } from "@/components/ui/button"
import { useI18n } from "@/providers/lang-provider"
import Link from "next/link"
import { ArrowRight, Sparkles, Plus, Grid3X3, Star, Zap, Users } from "lucide-react"
import { UltraSlider } from "./ultra-slider"
import { useEffect, useState } from "react"

export function UltraHero() {
  const { t } = useI18n()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-pattern-grid">
      {/* Floating Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-primary-400/20 to-purple-400/20 rounded-full blur-3xl float-1" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-r from-blue-400/15 to-primary-400/15 rounded-full blur-3xl float-2" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-gradient-to-r from-primary-200/10 to-purple-200/10 rounded-full blur-3xl float-3" />
      </div>

      <div className="container-premium pt-24 pb-20">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          {/* Content */}
          <div className="text-center lg:text-start space-y-10 scroll-fade-in visible">
            {/* Premium Badge */}
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full glass glow-primary">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary-600 animate-pulse" />
                <span className="text-sm font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
                  جديد: خطط VIP مع أولوية الظهور
                </span>
              </div>
            </div>

            {/* Main Heading */}
            <div className="space-y-6">
              <h1 className="text-ultra-xl font-black text-balance">
                <span className="gradient-text">{t("heroTitle")}</span>
                <br />
                <span className="text-foreground/80">العصري</span>
              </h1>
              <p className="text-ultra-base text-muted-foreground max-w-2xl text-balance leading-relaxed">
                {t("heroDesc")} اكتشف آلاف الشركات المميزة، تواصل مباشرة مع أصحاب الأعمال، واحصل على أفضل الخدمات في
                منطقتك بتقنية متطورة وتصميم عصري.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start">
              <Button asChild size="lg" className="btn-ultra group text-lg px-10 py-6">
                <Link href="/ad/new">
                  <Plus className="h-6 w-6 mr-3" />
                  {t("addAd")}
                  <ArrowRight className="h-5 w-5 ml-3 transition-transform group-hover:translate-x-2" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-2xl border-2 hover:bg-primary-50 dark:hover:bg-primary-950/50 bg-transparent text-lg px-10 py-6 font-semibold"
              >
                <Link href="/category/cars">
                  <Grid3X3 className="h-6 w-6 mr-3" />
                  {t("categories")}
                </Link>
              </Button>
            </div>

            {/* Premium Stats */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-8 pt-8">
              <div className="text-center group">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Star className="h-5 w-5 text-amber-500" />
                  <div className="text-3xl font-black gradient-text">1000+</div>
                </div>
                <div className="text-sm text-muted-foreground font-medium">شركة مسجلة</div>
              </div>
              <div className="text-center group">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Zap className="h-5 w-5 text-primary-500" />
                  <div className="text-3xl font-black gradient-text">14</div>
                </div>
                <div className="text-sm text-muted-foreground font-medium">تصنيف متنوع</div>
              </div>
              <div className="text-center group">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Users className="h-5 w-5 text-green-500" />
                  <div className="text-3xl font-black gradient-text">3</div>
                </div>
                <div className="text-sm text-muted-foreground font-medium">دول مدعومة</div>
              </div>
            </div>
          </div>

          {/* Ultra Slider */}
          <div className="relative perspective-1000 scroll-fade-in visible">
            <div className="absolute -inset-8 bg-gradient-to-r from-primary-400/30 to-purple-400/30 rounded-3xl blur-3xl opacity-50" />
            <UltraSlider />
          </div>
        </div>
      </div>
    </section>
  )
}
