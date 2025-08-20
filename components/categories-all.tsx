"use client"

import { useMemo } from "react"
import { useI18n } from "@/providers/lang-provider"
import { getCategories, getAdsByCategory } from "@/lib/store"
import { AdCard } from "@/components/ad-card"

export function CategoriesAll() {
  const { locale, t } = useI18n()
  const categories = useMemo(() => getCategories(), [])

  return (
    <section className="container space-y-12 py-10 md:py-14">
      {categories.map((cat) => {
        const name = locale === "ar" ? cat.nameAr : cat.nameEn
        const ads = getAdsByCategory(cat.slug) // لا تقص العدد — اعرض الكل

        return (
          <div key={cat.slug} className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-2 w-10 rounded-full" style={{ backgroundColor: cat.color }} aria-hidden />
              <h2 className="text-2xl font-bold tracking-tight">{name}</h2>
            </div>

            {ads.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {ads.map((ad) => (
                  <AdCard key={ad.id} ad={ad} />
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">{t("noResults")}</p>
            )}
          </div>
        )
      })}
    </section>
  )
}
