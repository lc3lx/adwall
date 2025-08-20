"use client"

import { Button } from "@/components/ui/button"
import { useI18n } from "@/providers/lang-provider"
import Link from "next/link"
import { ArrowRight, Sparkles, Plus, Grid3X3 } from "lucide-react"
import { ModernSlider } from "./modern-slider"

export function ModernHero() {
  const { t } = useI18n()

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary-300/15 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-primary-200/10 to-primary-400/10 rounded-full blur-3xl" />
      </div>

      <div className="container-modern pt-20 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content */}
          <div className="text-center lg:text-start space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-950 dark:to-primary-900 border border-primary-200 dark:border-primary-800">
              <Sparkles className="h-4 w-4 text-primary-600" />
              <span className="text-sm font-medium text-primary-700 dark:text-primary-300">
                جديد: خطط VIP مع أولوية الظهور
              </span>
            </div>

            {/* Main Heading */}
            <div className="space-y-4">
              <h1 className="text-responsive-xl font-bold text-balance">
                <span className="gradient-text">{t("heroTitle")}</span>
              </h1>
              <p className="text-responsive-base text-muted-foreground max-w-2xl text-balance">
                {t("heroDesc")} اكتشف آلاف الشركات، تواصل مباشرة، واحصل على أفضل الخدمات في منطقتك.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button asChild size="lg" className="btn-modern group">
                <Link href="/ad/new">
                  <Plus className="h-5 w-5 mr-2" />
                  {t("addAd")}
                  <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-xl border-2 hover:bg-primary-50 dark:hover:bg-primary-950/50 bg-transparent"
              >
                <Link href="/category/cars">
                  <Grid3X3 className="h-5 w-5 mr-2" />
                  {t("categories")}
                </Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-8 pt-4">
              <div className="text-center">
                <div className="text-2xl font-bold gradient-text">1000+</div>
                <div className="text-sm text-muted-foreground">شركة مسجلة</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold gradient-text">14</div>
                <div className="text-sm text-muted-foreground">تصنيف متنوع</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold gradient-text">3</div>
                <div className="text-sm text-muted-foreground">دول مدعومة</div>
              </div>
            </div>
          </div>

          {/* Slider */}
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-primary-400/20 to-primary-600/20 rounded-3xl blur-2xl" />
            <ModernSlider />
          </div>
        </div>
      </div>
    </section>
  )
}
