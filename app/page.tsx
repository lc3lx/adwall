"use client"

import { UltraHeader } from "@/components/ultra-header"
import { Footer } from "@/components/footer"
import { UltraHero } from "@/components/ultra-hero"
import { CategoriesGrid } from "@/components/categories-grid"
import { useI18n } from "@/providers/lang-provider"
import { Star, Users, Zap, Shield, TrendingUp, Award, Sparkles, ArrowRight } from "lucide-react"
import { Suspense, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

function UltraFeatureCard({
  icon: Icon,
  title,
  description,
  delay = 0,
}: {
  icon: any
  title: string
  description: string
  delay?: number
}) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay)
    return () => clearTimeout(timer)
  }, [delay])

  return (
    <div
      className={cn(
        "ultra-card p-8 text-center group cursor-pointer transition-all duration-700",
        isVisible ? "scroll-fade-in visible" : "scroll-fade-in",
      )}
    >
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-400/20 to-purple-400/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500" />
        <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900 dark:to-primary-800 group-hover:scale-110 transition-all duration-500 shadow-lg">
          <Icon className="h-10 w-10 text-primary-600 dark:text-primary-400 group-hover:scale-110 transition-transform duration-300" />
        </div>
      </div>
      <h3 className="font-bold text-xl mb-4 group-hover:text-primary-600 transition-colors duration-300 text-shadow-sm">
        {title}
      </h3>
      <p className="text-base text-muted-foreground leading-relaxed">{description}</p>
    </div>
  )
}

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(" ")
}

export default function HomePage() {
  const { t } = useI18n()

  const features = [
    {
      icon: Star,
      title: "خطط VIP فاخرة",
      description: "أولوية الظهور المطلقة مع شارة ذهبية مميزة وإحصائيات تفصيلية متقدمة لشركتك",
    },
    {
      icon: Users,
      title: "تواصل فوري ومباشر",
      description: "هاتف، واتساب، إيميل وموقع إلكتروني - كل وسائل التواصل في مكان واحد متطور",
    },
    {
      icon: Zap,
      title: "سرعة البرق",
      description: "إضافة وإدارة الإعلانات في ثوانٍ معدودة مع واجهة عصرية وسهلة الاستخدام",
    },
    {
      icon: Shield,
      title: "أمان عالمي",
      description: "نظام دفع محمي ومشفر بأعلى المعايير العالمية عبر Stripe المعتمد دولياً",
    },
    {
      icon: TrendingUp,
      title: "نمو متسارع",
      description: "آلاف الشركات الجديدة والعملاء المحتملين ينضمون شهرياً لمنصتنا المتنامية",
    },
    {
      icon: Award,
      title: "جودة استثنائية",
      description: "مراجعة وتدقيق شامل لجميع الإعلانات من فريق متخصص قبل النشر والموافقة",
    },
  ]

  return (
    <div className="min-h-screen">
      <UltraHeader />

      <main className="space-y-20 lg:space-y-32">
        {/* Ultra Hero Section */}
        <UltraHero />

        {/* Premium Features Section */}
        <section className="py-20 lg:py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-pattern-grid opacity-30" />
          <div className="container-premium relative">
            <div className="text-center mb-20 scroll-fade-in visible">
              <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full glass glow-primary mb-8">
                <Sparkles className="h-5 w-5 text-primary-600" />
                <span className="text-sm font-bold gradient-text">لماذا نحن الأفضل؟</span>
              </div>
              <h2 className="text-ultra-lg font-black mb-6 text-balance">
                منصة <span className="gradient-text">AdWell</span> العصرية
              </h2>
              <p className="text-ultra-base text-muted-foreground max-w-3xl mx-auto text-balance leading-relaxed">
                تجربة فريدة ومتطورة لعرض وإدارة إعلانات الشركات مع أحدث التقنيات العالمية والتصميم العصري المبتكر
              </p>
            </div>

            <div className="ultra-grid">
              {features.map((feature, index) => (
                <UltraFeatureCard key={index} {...feature} delay={index * 100} />
              ))}
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <Suspense fallback={<div className="h-96 skeleton-ultra rounded-3xl mx-6" />}>
          <CategoriesGrid />
        </Suspense>

        {/* Ultra CTA Section */}
        <section className="py-20 lg:py-32 relative overflow-hidden">
          <div className="container-premium">
            <div className="relative overflow-hidden rounded-3xl">
              {/* Premium Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary-500 via-purple-600 to-blue-600" />
              <div className="absolute inset-0 bg-pattern-grid opacity-20" />
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-primary-600/20 to-transparent" />

              {/* Floating Elements */}
              <div className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl float-1" />
              <div className="absolute bottom-10 left-10 w-24 h-24 bg-white/10 rounded-full blur-xl float-2" />

              {/* Content */}
              <div className="relative p-12 lg:p-20 text-center text-white">
                <div className="max-w-4xl mx-auto space-y-8">
                  <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/20 backdrop-blur-sm mb-6">
                    <Sparkles className="h-5 w-5" />
                    <span className="text-sm font-bold">ابدأ رحلتك الآن</span>
                  </div>

                  <h2 className="text-ultra-lg font-black mb-6 text-balance text-shadow-lg">
                    انضم إلى مستقبل الإعلانات الرقمية
                  </h2>

                  <p className="text-xl opacity-90 max-w-3xl mx-auto mb-10 text-balance leading-relaxed text-shadow">
                    كن جزءاً من ثورة الإعلانات الرقمية وانضم إلى آلاف الشركات الناجحة التي تستخدم AdWell للوصول إلى عملاء
                    جدد وتحقيق نمو استثنائي في أعمالها
                  </p>

                  <div className="flex flex-col sm:flex-row gap-6 justify-center">
                    <Button
                      asChild
                      size="lg"
                      variant="secondary"
                      className="rounded-2xl font-bold text-lg px-10 py-6 bg-white text-primary-600 hover:bg-white/90 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105"
                    >
                      <Link href="/ad/new">
                        <Sparkles className="h-6 w-6 mr-3" />
                        ابدأ مجاناً الآن
                        <ArrowRight className="h-5 w-5 ml-3" />
                      </Link>
                    </Button>
                    <Button
                      asChild
                      size="lg"
                      variant="outline"
                      className="rounded-2xl border-2 border-white/30 text-white hover:bg-white/10 bg-transparent font-bold text-lg px-10 py-6 backdrop-blur-sm"
                    >
                      <Link href="/category/cars">
                        <Star className="h-6 w-6 mr-3" />
                        استكشف الشركات
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
